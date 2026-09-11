// Rebuild service landing pages and shared search metadata without changing the homepage layout.
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const origin = "https://work.minniepark.art/";
const artist = "https://minniepark.art/";
const esc = value => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
const read = name => fs.readFileSync(path.join(root, name), "utf8");
const write = (name, content) => { const file = path.join(root, name); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content.replace(/[\t ]+$/gm, "")); };
const services = [
  {
    slug: "interactive-installations", image: "installation1.png",
    en: {
      title: "Interactive Installation & Media Art Production | Minnie Park",
      description: "Artist-led interactive installations for exhibitions, pop-ups and brand spaces. TouchDesigner, touch and sensor-based audio-visual systems by Minnie Park, Seoul and Melbourne.",
      heading: "Interactive installation & media art production",
      intro: "Touch, objects and sensors become the inputs to a responsive environment. Minnie Park develops interactive audio-visual installations for exhibitions, brand pop-ups and cultural spaces, working between Seoul and Melbourne and collaborating internationally.",
      scopeTitle: "From the encounter to the system",
      scope: ["Interaction concept and the participant’s journey through the work.", "TouchDesigner development connecting tactile or sensor input with real-time sound and visuals.", "Visual direction and the adaptation of media to the agreed display and sound system.", "Testing, documentation and installation support, scoped to the venue and production team."],
      proofTitle: "Developed through Meta Rose",
      proof: "Meta Rose is Park’s ongoing artistic body of work, begun in 2024. Living roses act as tactile interfaces in distinct installations. The Meta Rose: Shared Resonance (2026) requires two or more participants to connect to activate sound, visuals and light. This practice informs the relationship between participation, material and response in commissioned work; a new commission is developed around its own context.",
      proofUrl: "works/shared-resonance/", proofLabel: "See Shared Resonance",
      alt: "Interactive installation using objects as interfaces",
      brief: "Share the venue, dates, audience, desired interaction, available floor area, display and sound specifications, budget range and on-site production arrangements.",
      questions: [["Can this be developed for a pop-up or exhibition?", "Yes. The interaction, materials and media can be developed for the setting. Visitor flow, accessibility, reset behaviour and the venue’s technical conditions need to be agreed before production."], ["Does a quote include equipment and on-site operation?", "These are separate scope decisions. The proposal identifies content and system development, hardware supply or rental, installation, travel and operational support as applicable. A fixed price is not listed because the production requirements differ."], ["Can the project be developed remotely?", "Remote development and documented handover can be discussed with a local production team. On-site testing and support requirements depend on the system and venue."]]
    },
    ko: {
      title: "인터랙티브 미디어아트 제작 · 전시·팝업 설치 | Minnie Park",
      description: "전시·브랜드 팝업·문화공간을 위한 인터랙티브 미디어아트 제작. Minnie Park가 TouchDesigner, 터치와 센서 기반 실시간 비주얼·사운드 시스템을 설계합니다. 서울·멜버른 및 국제 협업.",
      heading: "인터랙티브 미디어아트 제작",
      intro: "터치, 오브젝트와 센서 입력이 공간의 사운드와 비주얼을 변화시키는 설치를 만듭니다. Minnie Park는 서울과 멜버른을 기반으로 전시, 브랜드 팝업과 문화공간을 위한 인터랙티브 오디오비주얼 작업을 제작하며 국내외 팀과 협업합니다.",
      scopeTitle: "관객의 경험부터 시스템 설계까지",
      scope: ["인터랙션 콘셉트와 관객의 참여 흐름 설계", "터치·센서 입력을 실시간 사운드와 비주얼에 연결하는 TouchDesigner 개발", "비주얼 디렉션과 합의된 디스플레이·음향 환경에 맞춘 미디어 제작", "공간과 제작팀의 역할에 맞춘 테스트, 문서화 및 설치 지원"],
      proofTitle: "Meta Rose에서 축적한 실천",
      proof: "Meta Rose는 2024년부터 이어온 Minnie Park의 작업군으로, 생장미를 촉각 인터페이스로 사용하는 서로 다른 설치들로 전개됩니다. The Meta Rose: Shared Resonance(2026)는 두 명 이상의 참여자가 연결되어야 사운드, 비주얼과 빛이 작동합니다. 이러한 실천에서 탐구한 참여·재료·반응의 관계를 바탕으로, 커미션에서는 해당 공간과 프로젝트의 조건에 맞는 경험을 개발합니다.",
      proofUrl: "works/shared-resonance/", proofLabel: "Shared Resonance 작품 보기",
      alt: "오브젝트를 인터페이스로 사용하는 인터랙티브 설치",
      brief: "장소, 일정, 관객층, 원하는 참여 방식, 사용 가능한 면적, 디스플레이·음향 사양, 예산 범위와 현장 제작팀의 역할을 알려주세요.",
      questions: [["팝업이나 전시에 맞춰 제작할 수 있나요?", "공간의 목적에 맞춰 인터랙션, 재료와 미디어를 개발할 수 있습니다. 제작 전 관객 동선, 접근성, 반복 작동 방식과 현장 기술 조건을 함께 확인합니다."], ["장비와 현장 운영도 견적에 포함되나요?", "프로젝트마다 별도로 협의합니다. 콘텐츠·시스템 개발, 장비 공급 또는 대여, 설치, 이동과 현장 운영의 포함 여부를 제안서에서 구분합니다. 제작 조건이 다르므로 일괄 가격을 제시하지 않습니다."], ["원격 협업이 가능한가요?", "현지 제작팀과 원격 개발 및 문서화된 시스템 인계를 논의할 수 있습니다. 현장 테스트와 지원의 범위는 시스템 및 장소에 따라 결정합니다."]]
    }
  },
  {
    slug: "event-visuals", image: "fashionrunway.png",
    en: {
      title: "Event Visuals & Audio-Reactive Content Production | Minnie Park",
      description: "Moving-image and audio-reactive visual production for fashion runways, listening sessions, launches and event screens. Selected commissions by Minnie Park, Seoul and Melbourne.",
      heading: "Event visuals & audio-reactive content",
      intro: "Moving-image sequences and responsive visual systems for runway screens, album listening sessions, launches and cultural events. Minnie Park develops visual direction and media that respond to the project’s sound, screen format and setting.",
      scopeTitle: "Content designed for its presentation",
      scope: ["Visual concept, colour direction and motion studies.", "Pre-rendered sequences or real-time audio-reactive systems, according to the event’s requirements.", "Screen-format adaptation and delivery specifications agreed with the AV team.", "Technical review, playback testing and any rehearsal support agreed in the production scope."],
      proofTitle: "Selected commissions",
      proof: "For the 2025 PayPal Melbourne Fashion Festival Premium Runways, Park produced sixteen moving-image sequences developed from Meta Rose. For XIA’s Gravity album listening session (2026), she created a thirty-minute audio-reactive visual system. These are separate commissions with different presentation conditions and deliverables.",
      proofUrl: "works/melbourne-fashion-festival/", proofLabel: "See Melbourne Fashion Festival",
      alt: "Minnie Park’s moving-image work presented on a Melbourne Fashion Festival runway screen",
      brief: "Include the event format and date, screen dimensions and pixel resolution, required duration, music or audio inputs, playback system, content rights, review schedule and budget range.",
      questions: [["Do we need a live system or rendered video?", "Rendered sequences suit a defined playback programme. A real-time system is relevant when the image needs to respond to live audio or other input. The choice depends on the experience and the AV setup."], ["Can the visuals be adapted to an existing screen?", "The screen’s resolution, aspect ratio, mapping and playback specifications should be confirmed with the AV supplier before final production."], ["Is usage included in the production fee?", "Usage period, presentation sites, online use, exclusivity and later adaptations are agreed as part of the commission. A new project should not assume unrestricted reuse of an existing artwork."]]
    },
    ko: {
      title: "행사·런웨이 비주얼 제작 · 오디오리액티브 콘텐츠 | Minnie Park",
      description: "패션 런웨이, 청음회, 브랜드 론칭과 행사 스크린을 위한 비주얼 제작. Minnie Park의 무빙이미지·오디오리액티브 콘텐츠와 Melbourne Fashion Festival, XIA 청음회 사례.",
      heading: "행사·런웨이 비주얼 제작",
      intro: "런웨이 스크린, 앨범 청음회, 브랜드 론칭과 문화행사를 위한 무빙이미지 시퀀스와 오디오리액티브 비주얼을 제작합니다. Minnie Park는 사운드, 화면 형식과 공간의 조건을 바탕으로 비주얼 디렉션과 미디어를 개발합니다.",
      scopeTitle: "상영 환경에 맞춘 콘텐츠",
      scope: ["비주얼 콘셉트, 컬러 디렉션과 모션 스터디", "행사 조건에 따른 렌더 영상 또는 실시간 오디오 반응형 시스템 제작", "AV팀과 합의한 화면 형식 및 납품 사양에 맞춘 출력", "제작 범위에 포함된 기술 검토, 재생 테스트 및 리허설 지원"],
      proofTitle: "주요 커미션 사례",
      proof: "2025 PayPal Melbourne Fashion Festival의 Premium Runways를 위해 Meta Rose에서 발전시킨 16개의 무빙이미지 시퀀스를 제작했습니다. 2026년 XIA의 Gravity 앨범 청음회에는 30분 길이의 오디오 반응형 비주얼 시스템을 제작했습니다. 두 작업은 상영 조건과 결과물의 형식이 서로 다른 별개의 커미션입니다.",
      proofUrl: "works/melbourne-fashion-festival/", proofLabel: "Melbourne Fashion Festival 사례 보기",
      alt: "Melbourne Fashion Festival 런웨이 스크린에 상영된 Minnie Park의 무빙이미지",
      brief: "행사 형식과 일정, 스크린 크기와 픽셀 해상도, 필요한 영상 길이, 음악·오디오 입력, 재생 시스템, 콘텐츠 사용 범위, 검토 일정과 예산을 알려주세요.",
      questions: [["실시간 시스템과 렌더 영상 중 무엇이 필요한가요?", "정해진 순서로 상영한다면 렌더 영상이 적합할 수 있습니다. 라이브 사운드나 다른 입력에 따라 화면이 반응해야 한다면 실시간 시스템을 검토합니다. 원하는 경험과 AV 환경을 기준으로 결정합니다."], ["기존 스크린에도 맞출 수 있나요?", "최종 제작 전 AV 공급사와 스크린 해상도, 화면 비율, 매핑 및 재생 사양을 확인하고 해당 조건에 맞춰 제작합니다."], ["제작비에 사용권도 포함되나요?", "사용 기간, 상영 장소, 온라인 사용, 독점 여부와 이후 변형 범위를 커미션 계약에서 정합니다. 기존 작품의 무제한 재사용을 전제로 하지 않습니다."]]
    }
  },
  {
    slug: "touchdesigner-workshops", image: "workshop.png",
    en: {
      title: "TouchDesigner Workshops & Artist-Led Creative Technology | Minnie Park",
      description: "TouchDesigner workshops for galleries, cultural organisations and creative teams. Real-time visuals, conductive touch and participatory systems with Minnie Park, TouchCollective co-founder.",
      heading: "TouchDesigner workshops & creative technology",
      intro: "Artist-led sessions connecting real-time media with tactile participation. Minnie Park works with galleries, cultural organisations and creative teams to develop workshops around TouchDesigner, conductive touch, sensors and audio-visual systems.",
      scopeTitle: "A programme shaped for the participants",
      scope: ["Learning objectives and session format matched to participants’ experience.", "TouchDesigner demonstrations and guided practical exercises.", "Tactile interfaces, sensor experiments or participatory audio-visual systems, according to the brief.", "Equipment, software requirements, accessibility and the balance of individual and collective work agreed in advance."],
      proofTitle: "Individual and collective practice",
      proof: "Park led Touching Resonance at Seventh Gallery, Melbourne, on 15 April 2026 as an individual artist workshop. Artists, Machines and the Space Between was presented with TouchCollective at Science Gallery Melbourne in October 2025. As a TouchCollective co-founder, she also contributes to peer learning and creative technology community practice. These activities have distinct organisers and credits.",
      proofUrl: "works/artist-workshops/", proofLabel: "See workshop records",
      alt: "Participants in an artist-led TouchCollective creative technology workshop",
      brief: "Share the organisation, participant number and experience, learning goals, preferred dates and duration, online or in-person format, available computers and equipment, and budget range.",
      questions: [["Can a workshop be designed for beginners?", "The programme can be scoped around participants’ prior experience. An introduction to real-time visuals differs from a sensor-prototyping session, so learning goals are agreed first."], ["Are online sessions possible?", "Online teaching can be discussed. Software versions, computer requirements and any physical interface kits should be checked before confirming the format."], ["Are all workshops delivered by TouchCollective?", "No. Park’s individual artist workshops and TouchCollective programmes are separate. The proposal and publicity should identify the relevant organiser and collaborators."]]
    },
    ko: {
      title: "TouchDesigner 워크숍·출강 · 크리에이티브 테크놀로지 | Minnie Park",
      description: "갤러리·문화기관·크리에이티브 팀을 위한 TouchDesigner 워크숍과 출강. Minnie Park의 실시간 비주얼, 전도성 터치와 참여형 시스템 교육. TouchCollective 공동 설립자.",
      heading: "TouchDesigner 워크숍·출강",
      intro: "실시간 미디어와 촉각적 참여를 연결하는 아티스트 주도형 워크숍입니다. Minnie Park는 갤러리, 문화기관과 크리에이티브 팀을 대상으로 TouchDesigner, 전도성 터치, 센서와 오디오비주얼 시스템을 다루는 세션을 구성합니다.",
      scopeTitle: "참여자에 맞춘 프로그램",
      scope: ["참여자의 경험과 목적에 맞는 학습 목표 및 세션 형식 설계", "TouchDesigner 시연과 단계별 실습", "요청에 따른 촉각 인터페이스, 센서 실험 또는 참여형 오디오비주얼 시스템 구성", "장비·소프트웨어 조건, 접근성 및 개인·공동 작업의 비중 사전 협의"],
      proofTitle: "개인 워크숍과 커뮤니티 활동",
      proof: "Touching Resonance는 2026년 4월 15일 멜버른 Seventh Gallery에서 Minnie Park 개인 아티스트 워크숍으로 진행했습니다. Artists, Machines and the Space Between은 2025년 10월 Science Gallery Melbourne에서 TouchCollective와 함께 진행했습니다. TouchCollective 공동 설립자로서 동료 학습과 크리에이티브 테크놀로지 커뮤니티 활동에도 참여합니다. 각 활동의 주최 및 협업 크레딧은 구분합니다.",
      proofUrl: "works/artist-workshops/", proofLabel: "워크숍 이력 보기",
      alt: "TouchCollective 아티스트 주도형 크리에이티브 테크놀로지 워크숍 참여자들",
      brief: "기관명, 인원과 사전 경험, 학습 목표, 희망 일정과 시간, 온라인·대면 여부, 사용 가능한 컴퓨터와 장비, 예산 범위를 알려주세요.",
      questions: [["초보자를 위한 워크숍도 가능한가요?", "참여자의 경험에 맞춰 범위를 정할 수 있습니다. 실시간 비주얼 입문과 센서 프로토타이핑은 준비 조건이 다르므로 학습 목표부터 협의합니다."], ["온라인 진행도 가능한가요?", "온라인 세션을 논의할 수 있습니다. 형식 확정 전 소프트웨어 버전, 컴퓨터 사양과 물리적 인터페이스 키트의 필요 여부를 확인합니다."], ["모든 워크숍이 TouchCollective 프로그램인가요?", "아닙니다. Minnie Park 개인의 아티스트 워크숍과 TouchCollective 프로그램은 구분합니다. 제안서와 홍보물에는 해당 프로그램의 주최 및 협업자를 명확히 표기합니다."]]
    }
  }
];
const home = {
  ko: { title: "인터랙티브 미디어아트·행사 비주얼 제작 | Minnie Park", description: "Minnie Park의 인터랙티브 미디어아트 제작, 행사·런웨이 비주얼, TouchDesigner 워크숍. 전시·팝업·브랜드 공간을 위한 작업과 Melbourne Fashion Festival, XIA 청음회 사례. 서울·멜버른 및 국제 협업." },
  en: { title: "Interactive Media Art & Event Visual Production | Minnie Park", description: "Minnie Park creates interactive installations, event visuals and TouchDesigner workshops for exhibitions, pop-ups, brands and cultural organisations. Based in Seoul and Melbourne, working internationally." }
};
function url(locale, slug = "") { return origin + (locale === "en" ? "en/" : "") + (slug ? `${slug}/` : ""); }
function graph(locale, item) {
  const page = item ? item[locale] : home[locale];
  const pageUrl = url(locale, item?.slug);
  const person = { "@type": "Person", "@id": artist + "#artist", name: "Minnie Park", url: artist,
    jobTitle: "Interactive Audio-Visual Artist and Creative Technologist", sameAs: ["https://www.instagram.com/minniepark.studio/"],
    knowsAbout: ["TouchDesigner", "Interactive installations", "Audio-reactive visuals", "Media art", "Creative technology workshops"] };
  const service = s => ({ "@type": "Service", "@id": url(locale, s.slug) + "#service", name: s[locale].heading,
    description: s[locale].description, url: url(locale, s.slug), provider: { "@id": artist + "#artist" },
    areaServed: ["South Korea", "Australia"], availableChannel: { "@type": "ServiceChannel", serviceUrl: url(locale) + "#contact" } });
  return { "@context": "https://schema.org", "@graph": [person,
    { "@type": "WebSite", "@id": origin + "#website", url: origin, name: "Minnie Park — Creative Studio M.", inLanguage: ["ko", "en"], publisher: { "@id": artist + "#artist" } },
    { "@type": "WebPage", "@id": pageUrl + "#webpage", url: pageUrl, name: page.title, description: page.description, inLanguage: locale,
      isPartOf: { "@id": origin + "#website" }, about: { "@id": artist + "#artist" }, ...(item ? { mainEntity: { "@id": pageUrl + "#service" } } : {}) },
    ...(item ? [service(item)] : services.map(service))
  ] };
}
function head(locale, item) {
  const page = item ? item[locale] : home[locale];
  const pageUrl = url(locale, item?.slug);
  const depth = (locale === "en" ? 1 : 0) + (item ? 1 : 0);
  const relative = "../".repeat(depth) || "./";
  return `<meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}" />
  <meta name="author" content="Minnie Park" />
  <meta name="msvalidate.01" content="20B9C3E42F618F8AFA82E2EDB595B31F" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="${pageUrl}" />
  <link rel="alternate" hreflang="ko" href="${url("ko", item?.slug)}" />
  <link rel="alternate" hreflang="en" href="${url("en", item?.slug)}" />
  <link rel="alternate" hreflang="x-default" href="${url("ko", item?.slug)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Minnie Park — Creative Studio M." />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:title" content="${esc(page.title)}" />
  <meta property="og:description" content="${esc(page.description)}" />
  <meta property="og:locale" content="${locale === "ko" ? "ko_KR" : "en_US"}" />
  <meta property="og:image" content="${origin}images/og-cover.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(page.title)}" />
  <meta name="twitter:description" content="${esc(page.description)}" />
  <meta name="twitter:image" content="${origin}images/og-cover.jpg" />
  <link rel="icon" href="${relative}favicon.svg" type="image/svg+xml" />
  <link rel="icon" href="${relative}favicon.ico" sizes="32x32" />
  <link rel="apple-touch-icon" href="${relative}apple-touch-icon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
  <link rel="stylesheet" href="${relative}style.css?v=20260715-1" />
  ${item ? `<link rel="stylesheet" href="${relative}service-pages.css?v=20260911-1" />` : ""}
  <script type="application/ld+json">${JSON.stringify(graph(locale, item)).replaceAll("<", "\\u003c")}</script>`;
}
for (const locale of ["ko", "en"]) {
  const homePath = locale === "en" ? "en/index.html" : "index.html";
  write(homePath, read(homePath).replace(/<head>[\s\S]*?<\/head>/, `<head>\n  ${head(locale)}\n</head>`));
  for (const item of services) {
    const p = item[locale];
    const base = locale === "en" ? "../../" : "../";
    const homeLink = base + (locale === "en" ? "en/" : "");
    const otherLanguage = base + (locale === "ko" ? "en/" : "") + item.slug + "/";
    const t = (en, ko) => locale === "en" ? en : ko;
    const content = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  ${head(locale, item)}
</head>
<body class="service-page">
  <header class="service-header"><a href="${homeLink}">Minnie Park <span>Creative Studio M.</span></a><a href="${otherLanguage}" lang="${locale === "ko" ? "en" : "ko"}">${t("한국어", "English")} ↗</a></header>
  <main>
    <section class="service-hero">
      <p class="section-kicker">${t("Commissioned work", "커미션 · 제작 문의")}</p>
      <h1>${esc(p.heading)}</h1>
      <p>${esc(p.intro)}</p>
      <div class="contact-actions"><a href="${homeLink}#contact">${t("Discuss your project", "프로젝트 문의")}</a><a href="${homeLink}#selected-work">${t("Selected work", "주요 작업 보기")}</a></div>
    </section>
    <figure class="service-image"><img src="${base}images/${item.image}" alt="${esc(p.alt)}" loading="eager" decoding="async" /></figure>
    <section class="service-detail"><h2>${esc(p.scopeTitle)}</h2><ul>${p.scope.map(line => `<li>${esc(line)}</li>`).join("")}</ul></section>
    <section class="service-detail"><h2>${esc(p.proofTitle)}</h2><p>${esc(p.proof)}</p><a href="${artist}${locale === "ko" ? "ko/" : ""}${p.proofUrl}">${esc(p.proofLabel)} ↗</a></section>
    <section class="service-detail"><h2>${t("Before we begin", "문의에 필요한 정보")}</h2><p>${esc(p.brief)}</p><p>${t("Following the initial brief, scope, deliverables, technical responsibilities, schedule and usage are agreed before production begins.", "초기 브리프를 검토한 후 제작 범위, 결과물, 기술적 역할 분담, 일정과 사용 범위를 합의하고 제작을 시작합니다.")}</p></section>
    <section class="service-detail"><h2>${t("Practical questions", "진행 안내")}</h2>${p.questions.map(([q, a]) => `<article><h3>${esc(q)}</h3><p>${esc(a)}</p></article>`).join("")}</section>
    <section class="service-detail"><h2>${t("Related services", "함께 살펴볼 제작 분야")}</h2><ul>${services.filter(s => s.slug !== item.slug).map(s => `<li><a href="../${s.slug}/">${esc(s[locale].heading)}</a></li>`).join("")}</ul><div class="contact-actions"><a href="${homeLink}#contact">${t("Send a project enquiry", "프로젝트 문의하기")}</a></div></section>
  </main>
  <footer class="service-footer"><a href="${homeLink}">Minnie Park — Creative Studio M.</a><p>Seoul / Melbourne · Working internationally</p><a href="${artist}${locale === "ko" ? "ko/" : ""}">${t("Artist portfolio", "아티스트 포트폴리오")} ↗</a><p>© 2026 Minnie Park</p></footer>
</body>
</html>
`;
    write(`${locale === "en" ? "en/" : ""}${item.slug}/index.html`, content);
  }
}
const urls = ["ko", "en"].flatMap(locale => [url(locale), ...services.map(s => url(locale, s.slug))]);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>\n`);
console.log(`Built ${urls.length} commercial search pages and sitemap.`);
