// Локальный генератор изображений товаров.
// Все картинки — SVG в data-URI: ничего не загружается из интернета и ничего не пропадёт после публикации.
// У каждого товара три разных кадра: основной вид, ракурс и карточка с характеристиками.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const trunc = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const fan = (cx, cy, r, c, blades = 7) => {
  let b = '';
  for (let i = 0; i < blades; i++) {
    b += `<path d="M${cx} ${cy} Q${cx + r * 0.55} ${cy - r * 0.15} ${cx + r * 0.82} ${cy - r * 0.62}" transform="rotate(${(i * 360) / blades} ${cx} ${cy})" fill="none" stroke="#cbd5e1" stroke-width="${Math.max(4, r * 0.12)}" stroke-linecap="round" opacity=".88"/>`;
  }
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#0b0e14" stroke="${c}" stroke-width="3"/>${b}<circle cx="${cx}" cy="${cy}" r="${r * 0.16}" fill="${c}"/>`;
};

const drawings = {
  gpu: (c) => `
    <rect x="70" y="210" width="460" height="175" rx="18" fill="url(#body)" stroke="#3b4252" stroke-width="2"/>
    <rect x="70" y="210" width="14" height="175" rx="6" fill="#9aa3b2"/>
    ${fan(205, 297, 60, c)}${fan(395, 297, 60, c)}
    <rect x="140" y="385" width="290" height="14" rx="3" fill="#d4a94a"/>
    <rect x="470" y="228" width="42" height="6" rx="3" fill="${c}"/>
    <rect x="470" y="244" width="26" height="6" rx="3" fill="#475569"/>`,
  cpu: (c) => {
    let pins = '';
    for (let i = 0; i < 12; i++) {
      const p = 218 + i * 15;
      pins += `<rect x="${p}" y="168" width="6" height="22" fill="#d4a94a"/><rect x="${p}" y="410" width="6" height="22" fill="#d4a94a"/><rect x="168" y="${p}" width="22" height="6" fill="#d4a94a"/><rect x="410" y="${p}" width="22" height="6" fill="#d4a94a"/>`;
    }
    return `${pins}
    <rect x="190" y="190" width="220" height="220" rx="14" fill="#1e2330" stroke="#475569" stroke-width="2"/>
    <rect x="215" y="215" width="170" height="170" rx="10" fill="url(#metal)"/>
    <rect x="240" y="240" width="120" height="120" rx="6" fill="none" stroke="${c}" stroke-width="3"/>
    <circle cx="300" cy="300" r="22" fill="${c}" opacity=".9"/>`;
  },
  motherboards: (c) => {
    let slots = '';
    for (let i = 0; i < 4; i++) slots += `<rect x="${380 + i * 20}" y="150" width="10" height="150" rx="3" fill="#0b0e14" stroke="#64748b"/>`;
    return `<rect x="125" y="115" width="350" height="370" rx="12" fill="#161a23" stroke="#3b4252" stroke-width="2"/>
    <rect x="160" y="150" width="90" height="90" rx="6" fill="#1f2531" stroke="${c}" stroke-width="3"/>
    <rect x="178" y="168" width="54" height="54" rx="4" fill="#cbd5e1"/>
    <rect x="150" y="260" width="150" height="26" rx="5" fill="#2b3240"/><rect x="262" y="145" width="100" height="14" rx="3" fill="#2b3240"/>
    ${slots}
    <rect x="160" y="320" width="270" height="10" rx="3" fill="#0b0e14" stroke="#64748b"/>
    <rect x="160" y="360" width="270" height="10" rx="3" fill="#0b0e14" stroke="#64748b"/>
    <rect x="160" y="400" width="130" height="22" rx="4" fill="${c}" opacity=".85"/>
    <rect x="320" y="395" width="110" height="60" rx="6" fill="#2b3240"/>
    <circle cx="150" cy="140" r="5" fill="#64748b"/><circle cx="450" cy="460" r="5" fill="#64748b"/>`;
  },
  ram: (c) => {
    let chips = '';
    for (let i = 0; i < 6; i++) chips += `<rect x="${140 + i * 56}" y="222" width="42" height="40" rx="4" fill="#0b0e14" opacity=".55"/><rect x="${140 + i * 56}" y="352" width="42" height="40" rx="4" fill="#0b0e14" opacity=".55"/>`;
    return `<rect x="90" y="200" width="420" height="86" rx="10" fill="url(#body)" stroke="#3b4252" stroke-width="2"/>
    <rect x="90" y="200" width="420" height="14" rx="6" fill="${c}"/>${chips}
    <rect x="90" y="330" width="420" height="86" rx="10" fill="url(#body)" stroke="#3b4252" stroke-width="2"/>
    <rect x="90" y="330" width="420" height="14" rx="6" fill="${c}"/>
    <rect x="110" y="286" width="380" height="8" fill="#d4a94a"/><rect x="110" y="416" width="380" height="8" fill="#d4a94a"/>`;
  },
  ssdM2: (c) => `
    <rect x="70" y="255" width="460" height="90" rx="10" fill="#14532d" stroke="#22c55e" stroke-width="2" opacity=".95"/>
    <rect x="70" y="255" width="40" height="90" rx="6" fill="#d4a94a"/>
    <rect x="135" y="270" width="110" height="60" rx="6" fill="#0b0e14"/><rect x="262" y="270" width="110" height="60" rx="6" fill="#0b0e14"/>
    <rect x="388" y="270" width="110" height="60" rx="6" fill="${c}" opacity=".9"/>
    <circle cx="512" cy="300" r="8" fill="#0b0e14"/>`,
  ssdSata: (c) => `
    <rect x="130" y="150" width="340" height="300" rx="22" fill="url(#body)" stroke="#475569" stroke-width="2"/>
    <rect x="130" y="150" width="340" height="40" rx="18" fill="${c}"/>
    <rect x="165" y="230" width="170" height="14" rx="4" fill="#94a3b8"/><rect x="165" y="260" width="110" height="10" rx="4" fill="#64748b"/>
    <rect x="420" y="410" width="30" height="22" rx="3" fill="#d4a94a"/>`,
  hdd: (c) => `
    <rect x="120" y="140" width="360" height="320" rx="16" fill="url(#metal)" stroke="#64748b" stroke-width="2"/>
    <circle cx="285" cy="300" r="115" fill="#0b0e14" opacity=".35"/>
    <circle cx="285" cy="300" r="85" fill="#cbd5e1" opacity=".5"/><circle cx="285" cy="300" r="30" fill="#475569"/><circle cx="285" cy="300" r="8" fill="${c}"/>
    <path d="M420 190 L330 290" stroke="#1e293b" stroke-width="9" stroke-linecap="round"/><circle cx="425" cy="185" r="14" fill="${c}"/>
    <rect x="140" y="425" width="120" height="14" rx="3" fill="#1e293b" opacity=".6"/>`,
  psu: (c) => `
    <rect x="100" y="160" width="400" height="280" rx="18" fill="url(#body)" stroke="#3b4252" stroke-width="2"/>
    ${fan(260, 300, 100, c, 9)}
    <rect x="395" y="205" width="70" height="40" rx="5" fill="#0b0e14" stroke="#64748b"/><rect x="395" y="265" width="70" height="40" rx="5" fill="#0b0e14" stroke="#64748b"/><rect x="395" y="325" width="70" height="40" rx="5" fill="#0b0e14" stroke="#64748b"/>
    <rect x="395" y="385" width="70" height="30" rx="5" fill="${c}" opacity=".85"/>`,
  cases: (c) => `
    <rect x="165" y="80" width="270" height="440" rx="18" fill="url(#body)" stroke="#3b4252" stroke-width="2"/>
    <rect x="188" y="105" width="224" height="330" rx="10" fill="#0b0e14" stroke="#334155"/>
    ${fan(300, 175, 44, c, 7)}${fan(300, 290, 44, c, 7)}${fan(300, 405, 40, c, 7)}
    <rect x="188" y="455" width="224" height="40" rx="8" fill="#12151c" stroke="#334155"/>
    <circle cx="214" cy="475" r="9" fill="${c}"/>
    <rect x="195" y="520" width="26" height="10" fill="#475569"/><rect x="379" y="520" width="26" height="10" fill="#475569"/>`,
  monitors: (c) => `
    <rect x="70" y="130" width="460" height="285" rx="16" fill="#0b0e14" stroke="#475569" stroke-width="5"/>
    <rect x="86" y="146" width="428" height="253" rx="8" fill="url(#screen)"/>
    <path d="M86 340 Q220 250 330 310 T514 250 L514 399 L86 399Z" fill="${c}" opacity=".35"/>
    <circle cx="410" cy="215" r="34" fill="${c}" opacity=".5"/>
    <path d="M270 415 L255 480 H345 L330 415Z" fill="#334155"/><rect x="210" y="480" width="180" height="14" rx="7" fill="#475569"/>`,
  keyboards: (c) => {
    let keys = '';
    for (let r = 0; r < 4; r++) {
      for (let i = 0; i < 12; i++) {
        const lit = (i + r * 2) % 5 === 0;
        keys += `<rect x="${100 + i * 34 + (r === 3 ? 17 : 0)}" y="${185 + r * 42}" width="30" height="32" rx="6" fill="${lit ? c : '#2b3240'}" stroke="#475569"/>`;
      }
    }
    const bottom = [[100, 40], [144, 40], [188, 40], [232, 140], [378, 40], [422, 40], [466, 34]];
    bottom.forEach(([x, w]) => {
      keys += `<rect x="${x}" y="353" width="${w}" height="32" rx="6" fill="#2b3240" stroke="#475569"/>`;
    });
    return `<rect x="75" y="160" width="450" height="250" rx="18" fill="#12151c" stroke="#3b4252" stroke-width="2"/>${keys}`;
  },
  mice: (c) => `
    <path d="M300 95 C210 95 170 175 170 285 C170 415 225 500 300 500 C375 500 430 415 430 285 C430 175 390 95 300 95Z" fill="url(#body)" stroke="#475569" stroke-width="3"/>
    <path d="M300 95 V260" stroke="#475569" stroke-width="3"/><path d="M175 255 C240 270 360 270 425 255" fill="none" stroke="#475569" stroke-width="3"/>
    <rect x="285" y="150" width="30" height="62" rx="15" fill="${c}"/>
    <path d="M200 380 C230 440 370 440 400 380" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" opacity=".85"/>`,
  headsets: (c) => `
    <path d="M150 310 C150 130 450 130 450 310" fill="none" stroke="#475569" stroke-width="22" stroke-linecap="round"/>
    <path d="M150 310 C150 130 450 130 450 310" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round" opacity=".85"/>
    <rect x="105" y="270" width="95" height="170" rx="40" fill="url(#body)" stroke="#475569" stroke-width="3"/>
    <rect x="400" y="270" width="95" height="170" rx="40" fill="url(#body)" stroke="#475569" stroke-width="3"/>
    <circle cx="152" cy="355" r="22" fill="${c}" opacity=".85"/><circle cx="448" cy="355" r="22" fill="${c}" opacity=".85"/>
    <path d="M130 430 C110 490 170 500 220 490" fill="none" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/><circle cx="228" cy="490" r="12" fill="${c}"/>`,
  microphones: (c) => {
    let g = '';
    for (let i = 0; i < 9; i++) g += `<line x1="225" y1="${135 + i * 26}" x2="375" y2="${135 + i * 26}" stroke="#334155" stroke-width="3"/>`;
    return `<rect x="215" y="100" width="170" height="270" rx="85" fill="url(#body)" stroke="#475569" stroke-width="3"/>${g}
    <rect x="215" y="300" width="170" height="14" fill="${c}"/>
    <path d="M165 290 C165 420 435 420 435 290" fill="none" stroke="#64748b" stroke-width="10" stroke-linecap="round"/>
    <rect x="290" y="408" width="20" height="60" fill="#64748b"/><rect x="225" y="468" width="150" height="16" rx="8" fill="#475569"/>`;
  },
  webcams: (c) => `
    <rect x="130" y="170" width="340" height="190" rx="46" fill="url(#body)" stroke="#475569" stroke-width="3"/>
    <circle cx="300" cy="265" r="78" fill="#0b0e14" stroke="#64748b" stroke-width="6"/><circle cx="300" cy="265" r="52" fill="#1e293b" stroke="${c}" stroke-width="4"/><circle cx="300" cy="265" r="22" fill="#0b0e14"/><circle cx="283" cy="250" r="7" fill="#fff" opacity=".7"/>
    <circle cx="430" cy="205" r="8" fill="${c}"/>
    <path d="M255 360 H345 L370 430 H230Z" fill="#334155"/><rect x="190" y="430" width="220" height="18" rx="9" fill="#475569"/>`,
  routers: (c) => `
    <rect x="125" y="40" width="22" height="210" rx="10" fill="#334155"/><rect x="453" y="40" width="22" height="210" rx="10" fill="#334155"/><rect x="289" y="25" width="22" height="225" rx="10" fill="#334155"/>
    <rect x="80" y="240" width="440" height="170" rx="26" fill="url(#body)" stroke="#475569" stroke-width="3"/>
    <circle cx="140" cy="300" r="8" fill="${c}"/><circle cx="170" cy="300" r="8" fill="#22c55e"/><circle cx="200" cy="300" r="8" fill="#22c55e"/><circle cx="230" cy="300" r="8" fill="#475569"/>
    <rect x="360" y="285" width="130" height="14" rx="7" fill="#475569"/>
    <rect x="110" y="410" width="20" height="14" fill="#334155"/><rect x="470" y="410" width="20" height="14" fill="#334155"/>
    <path d="M250 345 q50 -45 100 0 M268 362 q32 -28 64 0" fill="none" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`,
  cable: (c) => `
    <path d="M90 420 C90 180 300 180 300 300 C300 420 510 420 510 180" fill="none" stroke="#1e293b" stroke-width="22" stroke-linecap="round"/>
    <path d="M90 420 C90 180 300 180 300 300 C300 420 510 420 510 180" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/>
    <rect x="62" y="418" width="56" height="64" rx="10" fill="#cbd5e1" stroke="#64748b" stroke-width="3"/><rect x="74" y="482" width="32" height="26" fill="#94a3b8"/>
    <rect x="482" y="118" width="56" height="64" rx="10" fill="#cbd5e1" stroke="#64748b" stroke-width="3"/><rect x="494" y="96" width="32" height="26" fill="#94a3b8"/>`,
  pad: (c) => `
    <rect x="55" y="170" width="490" height="260" rx="28" fill="#161a23" stroke="#334155" stroke-width="3"/>
    <rect x="75" y="190" width="450" height="220" rx="18" fill="url(#screen)"/>
    <path d="M75 370 Q200 280 300 340 T525 290 L525 392 Q525 410 507 410 H93 Q75 410 75 392Z" fill="${c}" opacity=".4"/>
    <ellipse cx="350" cy="300" rx="52" ry="68" fill="#0b0e14" stroke="#64748b" stroke-width="3"/><rect x="342" y="255" width="16" height="34" rx="8" fill="${c}"/>`,
  paste: (c) => `
    <rect x="150" y="270" width="300" height="76" rx="12" fill="url(#body)" stroke="#475569" stroke-width="3"/>
    <rect x="150" y="270" width="300" height="20" rx="10" fill="${c}"/>
    <path d="M450 296 L520 313 L450 330Z" fill="#cbd5e1" stroke="#64748b" stroke-width="3"/>
    <rect x="90" y="276" width="62" height="64" rx="8" fill="#334155"/>
    <circle cx="300" cy="440" r="48" fill="#94a3b8" opacity=".6"/><circle cx="300" cy="440" r="26" fill="${c}" opacity=".85"/>`,
  cooler: (c) => {
    let fins = '';
    for (let i = 0; i < 10; i++) fins += `<rect x="${150 + i * 30}" y="115" width="22" height="270" rx="4" fill="url(#metal)" stroke="#64748b"/>`;
    return `<rect x="170" y="385" width="260" height="30" rx="8" fill="#b45309"/>
    <rect x="180" y="385" width="14" height="110" fill="#b45309"/><rect x="250" y="385" width="14" height="110" fill="#b45309"/><rect x="340" y="385" width="14" height="110" fill="#b45309"/><rect x="410" y="385" width="14" height="110" fill="#b45309"/>
    ${fins}${fan(300, 250, 70, c, 9)}`;
  },
  hub: (c) => `
    <rect x="90" y="230" width="420" height="140" rx="28" fill="url(#body)" stroke="#475569" stroke-width="3"/>
    <rect x="125" y="285" width="62" height="26" rx="4" fill="#0b0e14" stroke="#64748b"/><rect x="205" y="285" width="62" height="26" rx="4" fill="#0b0e14" stroke="#64748b"/><rect x="285" y="285" width="62" height="26" rx="4" fill="#0b0e14" stroke="#64748b"/><rect x="365" y="285" width="62" height="26" rx="4" fill="${c}" opacity=".9"/>
    <path d="M300 230 V150 C300 110 240 110 240 70" fill="none" stroke="#334155" stroke-width="16" stroke-linecap="round"/><rect x="215" y="40" width="50" height="34" rx="6" fill="#cbd5e1"/>`,
};

function pickDrawing(p) {
  const cat = p.categorySlug;
  const t = (p.specifications[Object.keys(p.specifications)[0]] || '') + ' ' + p.name;
  if (cat === 'ssd') return (p.specifications[Object.keys(p.specifications)[1]] || '').includes('M.2') ? drawings.ssdM2 : drawings.ssdSata;
  if (cat === 'accessories') {
    if (/коврик/i.test(t)) return drawings.pad;
    if (/термопаст/i.test(t)) return drawings.paste;
    if (/кулер/i.test(t) || /Башенный/i.test(t)) return drawings.cooler;
    if (/вентилятор/i.test(t)) return (c) => fan(300, 300, 150, c, 9);
    if (/хаб/i.test(t)) return drawings.hub;
    return drawings.cable;
  }
  return drawings[cat] || drawings.cable;
}

const defs = (h) => `<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h},45%,18%)"/><stop offset="1" stop-color="#0b0d12"/></linearGradient>
  <radialGradient id="glow" cx=".5" cy=".5" r=".55"><stop offset="0" stop-color="hsl(${h},90%,60%)" stop-opacity=".38"/><stop offset="1" stop-color="hsl(${h},90%,60%)" stop-opacity="0"/></radialGradient>
  <linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d3340"/><stop offset="1" stop-color="#12151c"/></linearGradient>
  <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2e8f0"/><stop offset=".5" stop-color="#94a3b8"/><stop offset="1" stop-color="#cbd5e1"/></linearGradient>
  <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#111827"/><stop offset="1" stop-color="hsl(${h},60%,22%)"/></linearGradient>
</defs>`;

function render(p, variant) {
  const h = hashStr(p.brand) % 360;
  const accent = `hsl(${(h + 20) % 360},90%,62%)`;
  const draw = pickDrawing(p)(accent);
  const specs = Object.values(p.specifications);
  const brand = esc(p.brand.toUpperCase());
  let body;
  if (variant === 0) {
    body = `<g transform="translate(0,-14)">${draw}</g>
      <text x="300" y="548" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="24" font-weight="700" letter-spacing="6" fill="#94a3b8">${brand}</text>`;
  } else if (variant === 1) {
    body = `<circle cx="300" cy="300" r="250" fill="url(#glow)"/>
      <g transform="translate(300 300) rotate(-9) scale(.94) translate(-300 -300)">${draw}</g>
      <text x="300" y="548" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="22" font-weight="600" letter-spacing="3" fill="#94a3b8">${esc(trunc(p.name, 34))}</text>`;
  } else {
    body = `<g transform="translate(150 30) scale(.5)">${draw}</g>
      <text x="300" y="360" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="40" font-weight="800" fill="#f8fafc">${esc(trunc(String(specs[0] || ''), 24))}</text>
      <text x="300" y="410" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="26" font-weight="600" fill="${accent}">${esc(trunc(String(specs[1] || ''), 32))}</text>
      <text x="300" y="452" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="22" fill="#94a3b8">${esc(trunc(String(specs[2] || ''), 38))}</text>
      <text x="300" y="548" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="24" font-weight="700" letter-spacing="6" fill="#64748b">${brand}</text>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">${defs(h)}<rect width="600" height="600" fill="url(#bg)"/>${variant === 1 ? '' : '<circle cx="300" cy="290" r="240" fill="url(#glow)"/>'}${body}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function makeImages(product) {
  return [0, 1, 2].map((v) => render(product, v));
}
