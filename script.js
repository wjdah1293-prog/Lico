// 1) 데이터
const PROJECTS = [
  {
    id: 'reel-2025',
    title: '미제사건 꼬꼬무 포트폴리오',
    categories: ['Cut', 'Premiere Pro', 'After Effects'],
    thumb: './mq5.png',
    youtubeId: '4iqhan3xk8k',
    description: '포트폴리오',
    tools: ['Premiere Pro', 'After Effects'],
    role: 'Editor',
    duration: '11:21'
  },
  {
    id: 'r',
    title: '미제사건 꼬꼬무 포트폴리오',
    categories: ['AI'],
    thumb: './mq5.png',
    youtubeId: '',
    description: '이미지',
    tools: ['AI'],
    role: 'Editor',
    duration: '11:21'
  },
  {
    id: 'ad-mock-juice',
    title: '짱구는 못말려 타이포그래피',
    categories: ['After Effects', 'Illustrator'],
    thumb: './mq3.jpg',
    youtubeId: 'O4pFvJxioxE',
    description: `<a href="./test.pdf" target="_blank" rel="noopener noreferrer">스토리보드</a><br/><a href="./test.pdf" target="_blank" rel="noopener noreferrer">기획</a>`,
    tools: ['After Effects', 'Illustrator'],
    role: 'Motion',
    duration: '01:02'
  },
  {
    id: 'ktype-typography',
    title: 'NAVER VIBE 광고',
    categories: ['Motion', 'After Effects'],
    thumb: './mq2.png',
    youtubeId: 'bzAPf19AYeQ',
    description: '포트폴리오',
    tools: ['After Effects', 'Illustrator'],
    role: 'Motion',
    duration: '00:25'
  },
  {
    id: 'c4d',
    title: 'c4d 연령고지',
    categories: ['Cinema4D'],
    thumb: './mq4.png',
    youtubeId: 'JPXQbL-Vsy0',
    description: '포트폴리오',
    tools: ['Cinema4D'],
    role: 'modeling',
    duration: '00:30'
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
