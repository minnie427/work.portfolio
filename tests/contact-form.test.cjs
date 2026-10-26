// Isolated form logic tests. No browser, real network, email, or external service is used.
// Run: node --test work-site/tests/contact-form.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const siteRoot = process.env.MP_WORK_ROOT || path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(siteRoot, 'hero-visual.js'), 'utf8');
const start = script.indexOf('function initCustomSelects()');
const end = script.indexOf('function initFormPerformanceMode()', start);
assert(start >= 0 && end > start, 'Form function extraction boundaries must exist');
const formSource = script.slice(start, end);
const decode = (text = '') => text.replaceAll('&amp;', '&').replaceAll('&quot;', '"');
const attrs = (text) => Object.fromEntries(
  [...text.matchAll(/([\w-]+)="([^"]*)"/g)].map((match) => [match[1], decode(match[2])])
);

class ClassList {
  constructor() { this.values = new Set(); }
  add(...names) { names.forEach((name) => this.values.add(name)); }
  remove(...names) { names.forEach((name) => this.values.delete(name)); }
  contains(name) { return this.values.has(name); }
  toggle(name) {
    if (this.contains(name)) { this.remove(name); return false; }
    this.add(name); return true;
  }
}

function makeNode(attributes = {}, text = '') {
  const node = {
    attributes: { ...attributes }, textContent: text, classList: new ClassList(),
    dataset: {}, events: new Map(), disabled: false, focusCount: 0,
    getAttribute(name) { return this.attributes[name] ?? null; },
    setAttribute(name, value) { this.attributes[name] = String(value); },
    removeAttribute(name) { delete this.attributes[name]; },
    addEventListener(name, fn) {
      const list = this.events.get(name) || [];
      list.push(fn); this.events.set(name, list);
    },
    async fire(name, event = {}) {
      const e = { target: this, preventDefault() {}, ...event };
      for (const fn of this.events.get(name) || []) await fn(e);
    },
    focus() { this.focusCount += 1; },
    blur() {},
    contains(other) { return other === this; }
  };
  for (const [name, value] of Object.entries(attributes)) {
    if (name.startsWith('data-')) node.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
  }
  return node;
}

function buildHarness(locale, responseFactory = () => response({ success: true })) {
  const html = fs.readFileSync(path.join(siteRoot, locale === 'en' ? 'en/index.html' : 'index.html'), 'utf8');
  const markup = html.match(/<form\b[^>]*class="contact-form"[^>]*>[\s\S]*?<\/form>/)?.[0];
  assert(markup, `${locale}: contact form exists`);
  const form = makeNode(attrs(markup.slice(0, markup.indexOf('>'))));
  form.action = form.attributes.action;
  const fields = {};
  const nodes = [];
  for (const match of markup.matchAll(/<(input|textarea)\b([^>]*)>/g)) {
    const a = attrs(match[2]);
    const field = makeNode(a);
    field.name = a.name;
    field.type = a.type || (match[1] === 'textarea' ? 'textarea' : 'text');
    field.required = /\brequired\b/.test(match[2]);
    field.maxLength = a.maxlength ? Number(a.maxlength) : -1;
    field.value = a.value || '';
    field.defaultValue = field.value;
    field.validationMessage = '';
    field.setCustomValidity = (message) => { field.validationMessage = message; };
    field.checkValidity = () => {
      if (field.type === 'hidden') return true;
      return !field.validationMessage && (!field.required || !!field.value) &&
        (field.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) &&
        (field.maxLength < 0 || field.value.length <= field.maxLength);
    };
    fields[field.name] = field;
    nodes.push(field);
  }
  const selects = [...markup.matchAll(/<div class="custom-select"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g)].map((match) => {
    const inner = match[1];
    const name = inner.match(/<input[^>]*name="([^"]+)"/)[1];
    const select = makeNode();
    select.input = fields[name];
    select.trigger = makeNode({ 'aria-expanded': 'false' });
    select.label = makeNode({}, inner.match(/<span>([^<]+)<\/span>/)[1]);
    select.options = [...inner.matchAll(/<button\b([^>]*role="option"[^>]*)>([^<]+)<\/button>/g)].map((m) => makeNode(attrs(m[1]), m[2]));
    select.querySelector = (selector) => {
      if (selector === '.custom-select-trigger') return select.trigger;
      if (selector === 'span') return select.label;
      if (selector.startsWith('input')) return select.input;
      return null;
    };
    select.querySelectorAll = (selector) => selector.includes('option') ? select.options : [];
    select.contains = (node) => node === select || node === select.trigger || node === select.input || select.options.includes(node);
    select.input.closest = () => select;
    select.trigger.closest = () => select;
    return select;
  });
  assert.equal(selects.length, 2);
  const status = makeNode();
  const button = makeNode({}, locale === 'en' ? 'Send Project Inquiry' : '문의 보내기');
  const namedField = (selector) => fields[selector.match(/name=['"]([^'"]+)['"]/)?.[1]];
  form.querySelector = (selector) => {
    if (selector === '.form-status') return status;
    if (/button\[type=['"]submit['"]\]/.test(selector)) return button;
    return namedField(selector) || null;
  };
  form.querySelectorAll = (selector) => {
    if (selector === '[data-custom-select]') return selects;
    if (selector.includes('[data-custom-select]') && selector.includes('input')) return selects.map((select) => select.input);
    if (selector.includes('[required]')) return nodes.filter((field) => field.required && field.type !== 'hidden');
    if (selector.includes('input') || selector.includes('textarea')) return nodes;
    return [];
  };
  form.elements = Object.assign(nodes, fields, { namedItem: (name) => fields[name] || null });
  form.reportValidityCount = 0;
  form.reportValidity = () => {
    form.reportValidityCount += 1;
    const invalid = nodes.find((field) => !field.checkValidity());
    // Native reportValidity dispatches invalid; simulate that event, not browser rendering.
    if (invalid) {
      for (const listener of form.events.get('invalid') || []) listener({ target: invalid });
    }
    return !invalid;
  };
  form.checkValidity = () => nodes.every((field) => field.checkValidity());
  form.resetCount = 0;
  form.reset = () => {
    form.resetCount += 1;
    nodes.forEach((field) => { field.value = field.defaultValue; });
  };
  const body = makeNode();
  const document = {
    documentElement: { lang: locale }, body, activeElement: null,
    addEventListener() {},
    querySelector: (selector) => selector === '.contact-form' ? form : null,
    querySelectorAll: (selector) => {
      if (selector === '.contact-form') return [form];
      if (selector === '[data-custom-select]') return selects;
      if (selector === '[data-custom-select].is-open') return selects.filter((select) => select.classList.contains('is-open'));
      return [];
    }
  };
  class MockFormData {
    constructor(target) { this.values = new Map(target.elements.map((field) => [field.name, field.value])); }
    set(name, value) { this.values.set(name, value); }
    get(name) { return this.values.get(name) ?? null; }
    entries() { return this.values.entries(); }
    [Symbol.iterator]() { return this.values[Symbol.iterator](); }
  }
  const requests = [];
  const timers = new Map();
  let timerId = 0;
  const context = vm.createContext({
    document, FormData: MockFormData, AbortController, URL, console,
    window: {
      setTimeout(fn, ms) { const id = ++timerId; timers.set(id, { fn, ms }); return id; },
      clearTimeout(id) { timers.delete(id); }
    },
    fetch: async (url, options) => {
      requests.push({ url, options });
      return responseFactory(url, options);
    },
    alert() { throw new Error('Use the existing inline form status, not a modal alert'); },
    performance: { now: () => 1 }, isFormActive: true,
    seedPageEndVisuals() {}, draw() {}
  });
  vm.runInContext(`${formSource}\ninitCustomSelects();`, context, { filename: 'isolated-contact-form.js' });
  fields.name.value = locale === 'en' ? 'Jo / Studio' : '박민니 / 스튜디오';
  fields.email.value = 'client@example.com';
  fields.message.value = locale === 'en' ? 'Please discuss an interactive exhibition for our venue.' : '전시 공간에 맞는 인터랙티브 설치 제작을 문의합니다.';
  selects.forEach((select) => {
    select.input.value = select.options[0].dataset.value;
    select.trigger.textContent = select.input.value;
    select.classList.add('has-value');
    select.options[0].setAttribute('aria-selected', 'true');
  });
  const snapshot = () => Object.fromEntries(nodes.map((field) => [field.name, field.value]));
  return {
    html, markup, form, fields, selects, status, button, context, requests, timers, snapshot,
    submit: () => form.fire('submit'),
    directSubmit: () => context.submitContactForm(form)
  };
}

function response(payload, options = {}) {
  return {
    ok: options.ok ?? true, status: options.status ?? 200, redirected: options.redirected ?? false,
    headers: { get: () => options.contentType || 'application/json' },
    json: async () => {
      if (options.invalidJSON) throw new SyntaxError('Unexpected token <');
      return payload;
    }
  };
}

for (const locale of ['ko', 'en']) {
  for (const success of [true, 'true']) {
    test(`${locale}: legitimate submission and provider success ${JSON.stringify(success)}`, async () => {
      const h = buildHarness(locale, () => response({ success }));
      const before = h.snapshot();
      await h.submit();
      assert.equal(h.requests.length, 1);
      const request = h.requests[0];
      assert.equal(request.url, 'https://formsubmit.co/ajax/minniepark.studio@gmail.com');
      assert.equal(request.options.method, 'POST');
      assert.equal(request.options.headers.Accept, 'application/json');
      assert.equal(request.options.credentials, 'omit');
      assert.equal(request.options.redirect, 'error');
      assert(request.options.signal instanceof AbortSignal);
      for (const name of ['name', 'email', 'message', 'project_type', 'budget_range', 'language', '_subject', '_template', '_honey', '_url']) {
        assert.equal(request.options.body.get(name), before[name], `${name} retained in payload`);
      }
      assert.equal(request.options.body.get('language'), locale === 'en' ? 'English' : 'Korean');
      assert.equal(h.form.resetCount, 1);
      assert(h.status.classList.contains('is-success'));
      assert(!h.status.classList.contains('is-error'));
      assert.equal(h.button.disabled, false);
      assert.equal(h.timers.size, 0);
      for (const select of h.selects) {
        assert.equal(select.trigger.textContent, '');
        assert.equal(select.trigger.getAttribute('aria-expanded'), 'false');
        assert(!select.classList.contains('has-value'));
        assert(select.options.every((option) => option.getAttribute('aria-selected') === 'false'));
      }
    });
  }

  test(`${locale}: honeypot prevents fetch, including direct call`, async () => {
    const h = buildHarness(locale);
    h.fields._honey.value = 'robot website';
    await h.submit(); await h.directSubmit();
    assert.equal(h.requests.length, 0);
    assert.equal(h.form.resetCount, 0);
  });

  for (const field of ['name', 'email', 'message', 'project_type', 'budget_range']) {
    for (const value of ['', '   ']) {
      test(`${locale}: ${field} ${value ? 'whitespace' : 'empty'} is rejected`, async () => {
        const h = buildHarness(locale);
        h.fields[field].value = value;
        await h.submit();
        assert.equal(h.requests.length, 0);
        assert.equal(h.form.resetCount, 0);
        assert(h.status.classList.contains('is-error'));
        assert(h.status.textContent.length > 0);
      });
    }
  }

  for (const field of ['project_type', 'budget_range']) {
    test(`${locale}: forged ${field} is rejected, trigger focused`, async () => {
      const h = buildHarness(locale);
      h.fields[field].value = 'not an offered value';
      await h.directSubmit();
      assert.equal(h.requests.length, 0);
      const select = h.selects.find((item) => item.input === h.fields[field]);
      assert.equal(select.trigger.getAttribute('aria-expanded'), 'true');
      assert.equal(select.trigger.getAttribute('aria-invalid'), 'true');
      assert(select.trigger.focusCount > 0);
    });
  }

  for (const field of ['name', 'email', 'message']) {
    test(`${locale}: overlong ${field} is rejected`, async () => {
      const h = buildHarness(locale);
      assert(h.fields[field].maxLength > 0, `${field} has an explicit generous maximum`);
      h.fields[field].value = 'a'.repeat(h.fields[field].maxLength + 1);
      await h.directSubmit();
      assert.equal(h.requests.length, 0);
      assert.equal(h.form.resetCount, 0);
    });
  }

  test(`${locale}: invalid email is rejected`, async () => {
    const h = buildHarness(locale);
    h.fields.email.value = 'not-an-email';
    await h.directSubmit();
    assert.equal(h.requests.length, 0);
    assert(h.form.reportValidityCount > 0);
    assert(h.status.classList.contains('is-error'));
    assert(h.status.textContent.length > 0);
  });

  test(`${locale}: transport trims surrounding whitespace without modifying visible inputs on failure`, async () => {
    const h = buildHarness(locale, () => response({ success: false }));
    h.fields.name.value = `  ${h.fields.name.value}  `;
    h.fields.message.value = `\n ${h.fields.message.value} \n`;
    const before = h.snapshot();
    await h.submit();
    assert.equal(h.requests.length, 1);
    assert.equal(h.requests[0].options.body.get('name'), before.name.trim());
    assert.equal(h.requests[0].options.body.get('message'), before.message.trim());
    assert.deepEqual(h.snapshot(), before);
  });

  test(`${locale}: declared HTML constraints and origin metadata remain aligned`, () => {
    const h = buildHarness(locale);
    for (const [name, length] of [['name', 200], ['email', 254], ['message', 20000]]) {
      assert.equal(h.fields[name].maxLength, length);
      assert.equal(h.fields[name].required, true);
    }
    assert.equal(h.fields._honey.getAttribute('tabindex'), '-1');
    assert.equal(h.fields._honey.getAttribute('autocomplete'), 'off');
    assert.equal(h.fields._honey.getAttribute('aria-hidden'), 'true');
    assert(!h.fields._captcha, 'No disabling CAPTCHA flag is reintroduced');
    assert.equal(h.fields._url.value, `https://work.minniepark.art/${locale === 'en' ? 'en/' : ''}`);
    assert.equal(h.fields.project_type.required, true);
    assert.equal(h.fields.budget_range.required, true);
  });

  test(`${locale}: concise Unicode name and message are not blanket-blocked`, async () => {
    const h = buildHarness(locale);
    h.fields.name.value = '李';
    h.fields.message.value = '문의 가능할까요?';
    await h.submit();
    assert.equal(h.requests.length, 1);
    assert.equal(h.form.resetCount, 1);
  });

  test(`${locale}: custom select still opens, selects, and closes`, async () => {
    const h = buildHarness(locale);
    const select = h.selects[0];
    await select.trigger.fire('click');
    assert.equal(select.trigger.getAttribute('aria-expanded'), 'true');
    await select.options[1].fire('click');
    assert.equal(select.input.value, select.options[1].dataset.value);
    assert.equal(select.trigger.textContent, select.options[1].dataset.value);
    assert.equal(select.trigger.getAttribute('aria-expanded'), 'false');
    assert.equal(select.options[1].getAttribute('aria-selected'), 'true');
  });

  test(`${locale}: corrected select clears accessibility error and can submit`, async () => {
    const h = buildHarness(locale);
    const select = h.selects[0];
    select.input.value = '';
    await h.submit();
    assert.equal(select.trigger.getAttribute('aria-invalid'), 'true');
    await select.options[1].fire('click');
    assert.equal(select.trigger.getAttribute('aria-invalid'), null);
    await h.submit();
    assert.equal(h.requests.length, 1);
    assert(h.status.classList.contains('is-success'));
  });

  const failures = [
    ['HTTP error', () => response({ success: true }, { ok: false, status: 500 })],
    ['JSON false', () => response({ success: false })],
    ['JSON string false', () => response({ success: 'false' })],
    ['missing success', () => response({ message: 'activation needed' })],
    ['numeric success', () => response({ success: 1 })],
    ['null body', () => response(null)],
    ['invalid JSON / HTML challenge', () => response(null, { invalidJSON: true, contentType: 'text/html' })],
    ['network exception', () => { throw new TypeError('Failed to fetch'); }],
    ['redirect denied', () => { throw new TypeError('Redirect forbidden by redirect:error'); }]
  ];
  for (const [label, factory] of failures) {
    test(`${locale}: ${label} preserves input and restores button without retry`, async () => {
      const h = buildHarness(locale, factory);
      const before = h.snapshot();
      await h.submit();
      assert.equal(h.requests.length, 1);
      assert.equal(h.form.resetCount, 0);
      assert.deepEqual(h.snapshot(), before);
      assert(h.status.classList.contains('is-error'));
      assert(!h.status.classList.contains('is-success'));
      assert.equal(h.button.disabled, false);
      assert.equal(h.button.textContent, locale === 'en' ? 'Send Project Inquiry' : '문의 보내기');
      assert.equal(h.timers.size, 0);
    });
  }

  test(`${locale}: repeated submit while request is pending sends only once`, async () => {
    let finish;
    const h = buildHarness(locale, () => new Promise((resolve) => { finish = resolve; }));
    const pending = h.directSubmit();
    await h.directSubmit();
    assert.equal(h.requests.length, 1);
    assert.equal(h.button.disabled, true);
    finish(response({ success: true }));
    await pending;
    assert.equal(h.form.resetCount, 1);
  });

  test(`${locale}: timeout aborts, preserves input, no automatic retry`, async () => {
    const h = buildHarness(locale, (_url, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => {
        const error = new Error('Request timed out');
        error.name = 'AbortError';
        reject(error);
      });
    }));
    const before = h.snapshot();
    const pending = h.directSubmit();
    const timeout = [...h.timers.values()].find((timer) => timer.ms === 30000);
    assert(timeout, 'Request has a 30-second timeout');
    timeout.fn();
    await pending;
    assert.equal(h.requests.length, 1);
    assert.equal(h.form.resetCount, 0);
    assert.deepEqual(h.snapshot(), before);
    assert(h.status.classList.contains('is-error'));
    assert.equal(h.button.disabled, false);
    assert.equal(h.timers.size, 0);
  });
}
