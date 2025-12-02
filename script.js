// 1) 데이터
const PROJECTS = [
  {
    id: 'reel-2025',
    title: 'IF 포트폴리오',
    categories: ['Cut', 'Premiere Pro', 'After Effects', '촬영', '연출'],
    thumb: './IF 포스터 양정모.png',
    youtubeId: 'xXLmdcuTph4',
    description: '포트폴리오',
    // description: `<a href="./test.pdf" target="_blank" rel="noopener noreferrer">pdf</a>`,
    tools: ['Premiere Pro', 'After Effects'],
    role: 'Editor',
    duration: '04:25'
  },
  {
    id: 'ad-mock-juice',
    title: 'KANU 광고 포트폴리오',
    categories: ['After Effects', 'Premiere Pro', 'Cut', '촬영', '연출'],
    thumb: './카누 사진.png',
    youtubeId: 'RwGcRT29wzo',
    description: '포트폴리오',
    // description: `<a href="./test.pdf" target="_blank" rel="noopener noreferrer">pdf</a>`,
    tools: ['After Effects', 'Premiere Pro'],
    role: 'Editor',
    duration: '01:34'
  },
  {
    id: 'CF',
    title: '네이버 시리즈 광고 포트폴리오',
    categories: ['Motion', 'After Effects'],
    thumb: './네이버 시리즈 사진.png',
    youtubeId: 'R9ApaNg-3X8',
    description: '포트폴리오',
    // description: `<a href="./test.pdf" target="_blank" rel="noopener noreferrer">pdf</a>`,
    tools: ['After Effects', 'Illustrator'],
    role: 'Motion',
    duration: '01:14'
  },
  {
    id: 'ktype-typography',
    title:"How It's Done 타이포그래피",
    categories: ['Motion', 'After Effects'],
    thumb: "./How It's Done 사진.png",
    youtubeId: 'by6K_Iab9vc',
    description: '포트폴리오',
    // description: `<a href="./test.pdf" target="_blank" rel="noopener noreferrer">pdf</a>`,
    tools: ['After Effects', 'Illustrator'],
    role: 'Motion',
    duration: '00:28'
  },
  {
    id: 'age notice',
    title:'연령고지',
    categories: ['Cinema4D', 'After Effects'],
    thumb: './연령고지 사진.png',
    youtubeId: 'zMBDrxqgD_4',
    description: '포트폴리오',
    // description: `<a href="./test.pdf" target="_blank" rel="noopener noreferrer">pdf</a>`,
    tools: ['Cinema4D', 'After Effects'],
    role: '3D',
    duration: '00:18'
  },
  {
    id: 'Ddasd',
    title:'날 좀 좋아하시개 포트폴리오',
    categories: ['AI','PS','design'],
    thumb: './Plz.png',
    youtubeId: '',
    description: '포트폴리오',
    // description: `<a href="./test.pdf" target="_blank" rel="noopener noreferrer">pdf</a>`,
    tools: ['AI', 'PS'],
    role: '',
    duration: ''
  },
  {
    id: 'nelson museum',
    title:'넬슨신 애니메이션 아트 센터 로고 모션 그래픽',
    categories: ['after effects','design'],
    thumb: 'Nelson.png',
    youtubeId: '432-OD0KXG0',
    description: '포트폴리오',
    // description: `<a href="./test.pdf" target="_blank" rel="noopener noreferrer">pdf</a>`,
    tools: ['after effects'],
    role: '',
    duration: ''
  },
  {
    id: 'nelson museum2',
    title:'넬슨신 애니메이션 아트 센터 왕후 심청 트레일러 인트로',
    categories: ['after effects','design'],
    thumb: 'Nelson2.png',
    youtubeId: '-E3ZvVwMbKY',
    description: '포트폴리오',
    // description: `<a href="./test.pdf" target="_blank" rel="noopener noreferrer">pdf</a>`,
    tools: ['after effects'],
    role: '',
    duration: ''
  },
  {
    id: 'nelson museum3',
    title:'넬슨신 애니메이션 아트 센터 매직랜턴 모션그래픽',
    categories: ['after effects','motion'],
    thumb: 'Nelson3.png',
    youtubeId: 'ndFWscvHlDI',
    description: '포트폴리오',
    // description: `<a href="./test.pdf" target="_blank" rel="noopener noreferrer">pdf</a>`,
    tools: ['after effects'],
    role: '',
    duration: ''
  }
];
// 2) 상태
const TAG_ALL = 'All';
let activeTag = TAG_ALL;
let keyword = '';

// 3) DOM 참조
const chipsEl  = document.getElementById('chips');
const gridEl   = document.getElementById('grid');
const queryEl  = document.getElementById('query');
const yearEl   = document.getElementById('year');

const modalEl  = document.getElementById('modal');
const playerEl = document.getElementById('player');
const modalTEl = document.getElementById('mtitle');
const modalDEl = document.getElementById('mdesc');
const closeEl  = document.getElementById('close');

const themeToggleEl = document.getElementById('themeToggle');

// 연도 표시
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// 4) 태그(필터) 구성
const tagSet = new Set();
PROJECTS.forEach(p => p.categories.forEach(c => tagSet.add(c)));
const TAGS = [TAG_ALL, ...Array.from(tagSet.values())];

function renderChips() {
  if (!chipsEl) return;
  chipsEl.innerHTML = TAGS.map(t => (
    `<button class="chip ${activeTag === t ? 'active' : ''}" data-tag="${t}">${t}</button>`
  )).join('');
}

function getFiltered() {
  const ql = keyword.trim().toLowerCase();
  return PROJECTS.filter(p => {
    const matchTag = (activeTag === TAG_ALL) || p.categories.includes(activeTag);
    const matchQ =
      !ql ||
      p.title.toLowerCase().includes(ql) ||
      p.description.toLowerCase().includes(ql);
    return matchTag && matchQ;
  });
}

// 카드 템플릿 (툴별 색상 태그 유지)
function cardTemplate(p) {
  const tagHtml = p.categories.map((c) => {
    if (c === 'Premiere Pro') {
      return `<span class="tag" style="background:#00005b;color:#fff;">${c}</span>`;
    } else if (c === 'After Effects') {
      return `<span class="tag" style="background:#1f0040;color:#fff;">${c}</span>`;
    } else if (c === 'Illustrator') {
      return `<span class="tag" style="background:#330000;color:#fff;">${c}</span>`;
    } else if (c === 'Photoshop') {
      return `<span class="tag" style="background:#33adff;color:#fff;">${c}</span>`;
    } else {
      return `<span class="tag">${c}</span>`;
    }
  }).join('');

  return `
    <article class="card" data-id="${p.id}">
      <img class="thumb" src="${p.thumb}" alt="${p.title}" />
      <div class="meta">
        <div class="title">${p.title}</div>
        <div class="desc">${p.description}</div>
        <div class="tags">${tagHtml}</div>
      </div>
    </article>
  `;
}

function renderGrid() {
  if (!gridEl) return;
  const items = getFiltered();
  gridEl.innerHTML = items.map(cardTemplate).join('');
}

// 5) 상호작용 - 필터 칩
if (chipsEl) {
  chipsEl.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    activeTag = chip.dataset.tag;
    renderChips();
    renderGrid();
  });
}

// 6) 검색
if (queryEl) {
  queryEl.addEventListener('input', (e) => {
    keyword = e.target.value;
    renderGrid();
  });
}

// 7) 모달
function openModal(project) {
  if (!modalEl || !playerEl || !modalTEl || !modalDEl) return;

  modalTEl.textContent = project.title;
  
  if (project.description.includes('<a')) {
    modalDEl.innerHTML = project.description;
  } else {
    modalDEl.textContent = project.description;
  }

  playerEl.innerHTML = '';

  if (project.youtubeId) {
    playerEl.innerHTML = `
      <iframe
        src="https://www.youtube.com/embed/${project.youtubeId}?rel=0"
        title="${project.title}"
        frameborder="0"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>`;
    playerEl.style.paddingTop = '56.25%';
  } else if (project.vimeo) {
    playerEl.innerHTML = `
      <iframe
        src="${project.vimeo}"
        title="${project.title}"
        frameborder="0"
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
      ></iframe>`;
    playerEl.style.paddingTop = '56.25%';
  } else if (project.src) {
    playerEl.innerHTML = `<video src="${project.src}" controls></video>`;
    playerEl.style.paddingTop = '56.25%';
  } else if (project.youtubeId === "") {
    playerEl.innerHTML = `
      <img src=${project.thumb} alt="이미지 설명" style="width:100%;height: auto;object-fit:contain;" />
    `;
    playerEl.style.paddingTop = '0';

  } else {
    playerEl.innerHTML = `
      <div style="display:grid;place-items:center;height:100%;color:#888">
        No media linked
      </div>`;
    playerEl.style.paddingTop = '56.25%';
  }

  modalEl.classList.add('open');
  modalEl.setAttribute('aria-hidden', 'false');
}

if (gridEl) {
  gridEl.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    const id = card.dataset.id;
    const proj = PROJECTS.find(p => p.id === id);
    if (proj) openModal(proj);
  });
}

function closeModal() {
  if (!modalEl || !playerEl) return;
  modalEl.classList.remove('open');
  modalEl.setAttribute('aria-hidden', 'true');
  playerEl.innerHTML = '';
}

if (closeEl) {
  closeEl.addEventListener('click', closeModal);
}

if (modalEl) {
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// 8) 테마 토글 (다크/라이트)
const THEME_KEY = 'bd_theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') {
    applyTheme(saved);
  }
}

if (themeToggleEl) {
  themeToggleEl.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// 9) 초기화
function init() {
  initTheme();
  renderChips();
  renderGrid();
}

init();
