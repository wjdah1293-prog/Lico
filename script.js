// 1) 데이터 (EDIT HERE: 실제 작업으로 교체)
const PROJECTS = [
  { id:'reel-2025', title:'미제사건 꼬꼬무 포트폴리오', categories:['Cut','Premiere Pro', 'After Effects'], thumb:'./mq2.jpg', youtubeId:'4iqhan3xk8k', description:'포트폴리오', tools:['Premiere Pro','After Effects'], role:'Editor', duration:'11:21' },
  { id:'ad-mock-juice', title:'짱구는 못말려 타이포그래피', categories:['After Effects', 'Illustrator'], thumb:'./mq3.jpg', youtubeId:'O4pFvJxioxE', description:'포트폴리오', tools:['After Effects', 'Illustrator'], role:'Editor', duration:'01:02' },
  { id:'ktype-typography', title:'NAVER VIBE 광고', categories:['Motion','After Effects'], thumb:'./mq1.jpg', youtubeId:'bzAPf19AYeQ', description:'포트폴리오', tools:['After Effects', 'Illustrator'], role:'Motion', duration:'00:25' },
  
];

// 2) 상태
const TAG_ALL = 'All';
let activeTag = TAG_ALL;
let keyword = '';

// 3) DOM 참조 (no $)
const chipsEl   = document.getElementById('chips');
const gridEl    = document.getElementById('grid');
const queryEl   = document.getElementById('query');
const yearEl    = document.getElementById('year');

const modalEl   = document.getElementById('modal');
const playerEl  = document.getElementById('player');
const modalTEl  = document.getElementById('mtitle');
const modalDEl  = document.getElementById('mdesc');
const closeEl   = document.getElementById('close');

const openReelEl    = document.getElementById('openReel');
const themeToggleEl = document.getElementById('themeToggle');
const paletteToggleEl = document.getElementById('paletteToggle');
const drawerEl = document.getElementById('paletteDrawer');

// 컬러피커
const cBG = document.getElementById('c_bg');
const cPanel = document.getElementById('c_panel');
const cMuted = document.getElementById('c_muted');
const cText = document.getElementById('c_text');
const cSub = document.getElementById('c_sub');
const cRing = document.getElementById('c_ring');
const cAccent = document.getElementById('c_accent');
const saveColorsBtn = document.getElementById('saveColors');
const resetColorsBtn = document.getElementById('resetColors');

yearEl.textContent = new Date().getFullYear();

// 4) 태그(필터) 구성
const tagSet = new Set();
PROJECTS.forEach(p => p.categories.forEach(c => tagSet.add(c)));
const TAGS = [TAG_ALL, ...Array.from(tagSet.values())];

function renderChips(){
  chipsEl.innerHTML = TAGS.map(t => (
    `<button class="chip ${activeTag===t?'active':''}" data-tag="${t}">${t}</button>`
  )).join('');
}

function getFiltered(){
  const ql = keyword.trim().toLowerCase();
  return PROJECTS.filter(p => {
    const matchTag = (activeTag===TAG_ALL) || p.categories.includes(activeTag);
    const matchQ = !ql || p.title.toLowerCase().includes(ql) || p.description.toLowerCase().includes(ql);
    return matchTag && matchQ;
  });
}

function cardTemplate(p){
  return `
    <article class="card" data-id="${p.id}">
      <img class="thumb" src="${p.thumb}" alt="${p.title}" />
      <div class="meta">
        <div class="title">${p.title}</div>
        <div class="desc">${p.description}</div>
        <div class="tags">${p.categories.map(c=>`<span class="tag">${c}</span>`).join('')}</div>
      </div>
    </article>
  `;
}

function renderGrid(){
  const items = getFiltered();
  gridEl.innerHTML = items.map(cardTemplate).join('');
}

// 5) 상호작용
chipsEl.addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if(!chip) return;
  activeTag = chip.dataset.tag;
  renderChips();
  renderGrid();
});

queryEl.addEventListener('input', (e) => {
  keyword = e.target.value;
  renderGrid();
});

function openModal(project){
  modalTEl.textContent = project.title;
  modalDEl.textContent  = project.description;
  playerEl.innerHTML = '';
  if(project.youtubeId){
    playerEl.innerHTML = `<iframe src="https://www.youtube.com/embed/${project.youtubeId}?rel=0" title="${project.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
  } else if(project.vimeo){
    playerEl.innerHTML = `<iframe src="${project.vimeo}" title="${project.title}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  } else if(project.src){
    playerEl.innerHTML = `<video src="${project.src}" controls></video>`;
  } else {
    playerEl.innerHTML = `<div style="display:grid;place-items:center;height:100%;color:#888">No media linked</div>`;
  }
  modalEl.classList.add('open');
  modalEl.setAttribute('aria-hidden','false');
}

gridEl.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if(!card) return;
  const id = card.dataset.id;
  const proj = PROJECTS.find(p=>p.id===id);
  if(proj) openModal(proj);
});

function closeModal(){
  modalEl.classList.remove('open');
  modalEl.setAttribute('aria-hidden','true');
  playerEl.innerHTML='';
}
closeEl.addEventListener('click', closeModal);
modalEl.addEventListener('click', (e) => { if(e.target===modalEl) closeModal(); });
window.addEventListener('keydown', (e) => { if(e.key==='Escape') closeModal(); });

openReelEl.addEventListener('click', () => {
  const proj = PROJECTS.find(p=>p.id==='reel-2025') || PROJECTS[0];
  openModal(proj);
});

// 6) 테마 토글
const THEME_KEY = 'bd_theme';
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}
function initTheme(){
  const saved = localStorage.getItem(THEME_KEY);
  if(saved==='light' || saved==='dark') applyTheme(saved);
}
themeToggleEl.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
  syncPickersFromCSS();
});

// 7) 팔레트(컬러 변수) 실시간 변경
const PALETTE_KEY = 'bd_palette';

function syncPickersFromCSS(){
  const styles = getComputedStyle(document.documentElement);
  cBG.value     = rgbToHex(styles.getPropertyValue('--bg'));
  cPanel.value  = rgbToHex(styles.getPropertyValue('--panel'));
  cMuted.value  = rgbToHex(styles.getPropertyValue('--muted'));
  cText.value   = rgbToHex(styles.getPropertyValue('--text'));
  cSub.value    = rgbToHex(styles.getPropertyValue('--sub'));
  cRing.value   = rgbToHex(styles.getPropertyValue('--ring'));
  cAccent.value = rgbToHex(styles.getPropertyValue('--accent'));
}

function rgbToHex(val){
  const v = val.trim();
  if(v.startsWith('#')) return v;
  const m = v.match(/rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\)/i);
  if(!m) return '#000000';
  const r = Number(m[1]), g = Number(m[2]), b = Number(m[3]);
  return '#' + [r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
}

function applyPalette(p){
  const root = document.documentElement;
  if(p.bg)     root.style.setProperty('--bg', p.bg);
  if(p.panel)  root.style.setProperty('--panel', p.panel);
  if(p.muted)  root.style.setProperty('--muted', p.muted);
  if(p.text)   root.style.setProperty('--text', p.text);
  if(p.sub)    root.style.setProperty('--sub', p.sub);
  if(p.ring)   root.style.setProperty('--ring', p.ring);
  if(p.accent) root.style.setProperty('--accent', p.accent);
}

function currentPalette(){
  return { bg:cBG.value, panel:cPanel.value, muted:cMuted.value, text:cText.value, sub:cSub.value, ring:cRing.value, accent:cAccent.value };
}

function loadSavedPalette(){
  const raw = localStorage.getItem(PALETTE_KEY);
  if(!raw) return;
  try { applyPalette(JSON.parse(raw)); } catch(e){}
}

[cBG, cPanel, cMuted, cText, cSub, cRing, cAccent].forEach(input => {
  input.addEventListener('input', () => applyPalette(currentPalette()));
});

saveColorsBtn.addEventListener('click', () => {
  localStorage.setItem(PALETTE_KEY, JSON.stringify(currentPalette()));
  alert('Saved!');
});
resetColorsBtn.addEventListener('click', () => {
  localStorage.removeItem(PALETTE_KEY);
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  document.documentElement.removeAttribute('style');
  applyTheme(theme);
  syncPickersFromCSS();
});
paletteToggleEl.addEventListener('click', () => {
  drawerEl.classList.toggle('open');
  if(drawerEl.classList.contains('open')) syncPickersFromCSS();
});

// 8) 초기화
function init(){
  initTheme();
  loadSavedPalette();
  syncPickersFromCSS();
  renderChips();
  renderGrid();
}

init();