/* ═══════════════════════════════════════════
   C++ Drone Tutorial — App Core
   State management, navigation, sidebar
   ═══════════════════════════════════════════ */

// ─── SECTION MANIFEST ────────────────────────
const SECTIONS = [
  {
    id: 's1', num: '1',
    title: 'Understanding the Drone Software Stack',
    tag: 'Read first', tagColor: 'blue',
    file: 'section-1.html'
  },
  {
    id: 's2', num: '2',
    title: 'Environment Setup',
    tag: 'Do first', tagColor: 'green',
    file: 'section-2.html'
  },
  {
    id: 's25', num: '2.5',
    title: 'C Fundamentals Refresher',
    tag: 'Skip if confident', tagColor: 'orange',
    file: 'section-2-5.html'
  },
  {
    id: 's3', num: '3',
    title: 'C++ Fundamentals for Drone Development',
    tag: 'Core skill', tagColor: 'blue',
    file: 'section-3.html'
  },
  {
    id: 's4', num: '4',
    title: 'Understanding ROS2',
    tag: 'Core framework', tagColor: 'purple',
    file: 'section-4.html'
  },
  {
    id: 's5', num: '5',
    title: 'First ROS2 Node in C++',
    tag: 'Memorize this', tagColor: 'blue',
    file: 'section-5.html'
  },
  {
    id: 's6', num: '6',
    title: 'Portfolio Projects',
    tag: '4 projects', tagColor: 'green',
    file: 'section-6.html'
  },
  {
    id: 's7', num: '7',
    title: 'Reading Real Drone Code',
    tag: 'Month 3+', tagColor: 'amber',
    file: 'section-7.html'
  },
  {
    id: 's8', num: '8',
    title: 'Open Source Contributions',
    tag: 'Portfolio booster', tagColor: 'purple',
    file: 'section-8.html'
  },
  {
    id: 's9', num: '9',
    title: 'Milestones and Schedule',
    tag: 'Track progress', tagColor: 'green',
    file: 'section-9.html'
  },
  {
    id: 's10', num: '10',
    title: 'Key Resources and Error Reference',
    tag: 'Quick reference', tagColor: 'blue',
    file: 'section-10.html'
  },
];

// Num badge colors per section
const NUM_COLORS = {
  s1:  'background:#eff6ff;color:#1d4ed8;',
  s2:  'background:#f0fdf4;color:#16a34a;',
  s25: 'background:#fff7ed;color:#c2410c;',
  s3:  'background:#eff6ff;color:#1d4ed8;',
  s4:  'background:#f3e8ff;color:#6b21a8;',
  s5:  'background:#eff6ff;color:#1d4ed8;',
  s6:  'background:#f0fdf4;color:#16a34a;',
  s7:  'background:#fef3c7;color:#92400e;',
  s8:  'background:#f3e8ff;color:#6b21a8;',
  s9:  'background:#f0fdf4;color:#16a34a;',
  s10: 'background:#eff6ff;color:#1d4ed8;',
};

const TAG_COLORS = {
  blue:   'background:var(--tag-blue-bg);color:var(--tag-blue);',
  green:  'background:var(--tag-green-bg);color:var(--tag-green);',
  amber:  'background:var(--tag-amber-bg);color:var(--tag-amber);',
  purple: 'background:var(--tag-purple-bg);color:var(--tag-purple);',
  orange: 'background:var(--tag-orange-bg);color:var(--tag-orange);',
};

// ─── STATE MANAGEMENT ─────────────────────────
const STATE_KEY = 'drone_tutorial_state';
let currentSectionId = null;

function getState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    const state = raw ? JSON.parse(raw) : {};
    if (!state.sections) state.sections = {};
    if (!state.checkboxes) state.checkboxes = {};
    if (!state.lastSubSection) state.lastSubSection = {};
    if (!state.expandedSubSections) state.expandedSubSections = {};
    return state;
  } catch(e) {
    return { sections: {}, checkboxes: {}, lastSubSection: {}, expandedSubSections: {} };
  }
}

function saveState(state) {
  state.version = 2;
  state.updated = new Date().toISOString();
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch(e) {
    console.warn('Could not save state:', e);
  }
}

function getSectionStatus(id) {
  return getState().sections[id] || 'pending';
}

function setSectionStatus(id, status) {
  const state = getState();
  state.sections[id] = status;
  saveState(state);
}

function getCompletedCount() {
  const state = getState();
  return SECTIONS.filter(s => state.sections[s.id] === 'completed').length;
}

// ─── CONTINUE SECTION ────────────────────────
// Returns the section to resume: in-progress first, then first non-completed,
// then null if everything is completed.
function getContinueSection() {
  const state = getState();
  // 1. First in-progress section
  const inProgress = SECTIONS.find(s => state.sections[s.id] === 'in-progress');
  if (inProgress) return inProgress;
  // 2. First section that is not completed
  const nextUp = SECTIONS.find(s => state.sections[s.id] !== 'completed');
  if (nextUp) return nextUp;
  // 3. All done
  return null;
}

// ─── CHECKBOX MANAGEMENT ──────────────────────
function loadCheckboxes() {
  const state = getState();
  document.querySelectorAll('.checklist input[type=checkbox]').forEach(cb => {
    cb.checked = !!state.checkboxes[cb.id];
    if (cb.checked) cb.closest('li')?.classList.add('done');
  });
}

function saveCheckbox(id, checked) {
  const state = getState();
  state.checkboxes[id] = checked;
  saveState(state);
}

function bindCheckboxes() {
  document.querySelectorAll('.checklist input[type=checkbox]').forEach(cb => {
    cb.addEventListener('change', () => {
      saveCheckbox(cb.id, cb.checked);
      const li = cb.closest('li');
      if (cb.checked) li?.classList.add('done');
      else li?.classList.remove('done');
    });
  });
  loadCheckboxes();
}

// ─── EXPORT / IMPORT ──────────────────────────
function exportState() {
  const state = getState();
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
  const filename = `drone-tutorial-state-${ts}.json`;
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  return filename;
}

function importStateFromJSON(json) {
  try {
    const incoming = JSON.parse(json);
    if (!incoming.sections && !incoming.checkboxes) {
      throw new Error('Invalid state format — missing sections or checkboxes');
    }
    const state = getState();
    if (incoming.sections) Object.assign(state.sections, incoming.sections);
    if (incoming.checkboxes) Object.assign(state.checkboxes, incoming.checkboxes);
    saveState(state);
    return { ok: true };
  } catch(e) {
    return { ok: false, error: e.message };
  }
}

function replaceStateFromJSON(json) {
  try {
    const incoming = JSON.parse(json);
    if (!incoming.sections && !incoming.checkboxes) {
      throw new Error('Invalid state format');
    }
    if (!incoming.sections) incoming.sections = {};
    if (!incoming.checkboxes) incoming.checkboxes = {};
    saveState(incoming);
    return { ok: true };
  } catch(e) {
    return { ok: false, error: e.message };
  }
}

function clearState() {
  localStorage.removeItem(STATE_KEY);
}

// ─── STATES DIRECTORY ────────────────────────
async function loadStatesManifest(basePath) {
  try {
    const resp = await fetch(basePath + 'states/manifest.json', { cache: 'no-store' });
    if (!resp.ok) return { states: [] };
    return await resp.json();
  } catch(e) {
    return { states: [] };
  }
}

async function loadStateFile(basePath, filename) {
  const resp = await fetch(basePath + 'states/' + filename, { cache: 'no-store' });
  if (!resp.ok) throw new Error('File not found: ' + filename);
  return resp.json();
}

// ─── SUB-SECTION ACCORDIONS ──────────────────
function toggleSub(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const wasOpen = el.classList.contains('open');
  el.classList.toggle('open');
  if (!wasOpen && currentSectionId) {
    recordSubSectionExpanded(currentSectionId, id);
  }
}

function expandAll() {
  document.querySelectorAll('.sub-section').forEach(s => s.classList.add('open'));
}

function collapseAll() {
  document.querySelectorAll('.sub-section').forEach(s => s.classList.remove('open'));
}

function recordSubSectionExpanded(sectionId, subId) {
  const state = getState();

  state.lastSubSection[sectionId] = subId;

  if (!state.expandedSubSections[sectionId]) state.expandedSubSections[sectionId] = [];
  if (!state.expandedSubSections[sectionId].includes(subId)) {
    state.expandedSubSections[sectionId].push(subId);
  }

  const currentStatus = state.sections[sectionId] || 'pending';
  const totalSubSections = document.querySelectorAll('.sub-section').length;

  if (state.expandedSubSections[sectionId].length >= totalSubSections) {
    state.sections[sectionId] = 'completed';
    syncStatusUI(sectionId, 'completed');
  } else if (currentStatus === 'pending') {
    state.sections[sectionId] = 'in-progress';
    syncStatusUI(sectionId, 'in-progress');
  }

  saveState(state);
}

function syncStatusUI(sectionId, status) {
  const picker = document.querySelector('.status-picker');
  if (picker) {
    picker.querySelectorAll('.status-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.status === status);
    });
  }
  const sidebarDot = document.querySelector('.sidebar-link.active .sidebar-status');
  if (sidebarDot) sidebarDot.className = `sidebar-status ${status}`;
  const pct = Math.round((getCompletedCount() / SECTIONS.length) * 100);
  const fill = document.querySelector('.sidebar-progress-fill');
  const count = document.querySelector('.sidebar-progress-count');
  if (fill) fill.style.width = pct + '%';
  if (count) count.textContent = getCompletedCount() + ' / ' + SECTIONS.length + ' completed';
}

function restoreLastSubSection(sectionId) {
  const state = getState();
  const lastSub = state.lastSubSection[sectionId];
  if (!lastSub) return;
  const el = document.getElementById(lastSub);
  if (!el) return;
  if (!el.classList.contains('open')) el.classList.add('open');
  setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
}

function getSubSectionDisplay(sectionId, subId) {
  const section = SECTIONS.find(s => s.id === sectionId);
  if (!section) return '';
  const subNum = subId.startsWith(sectionId + '-') ? subId.slice(sectionId.length + 1) : '';
  return subNum ? `${section.num}.${subNum}` : section.num;
}

// ─── SIDEBAR ──────────────────────────────────
function renderSidebar(currentSectionId, basePath) {
  const state = getState();
  const completed = SECTIONS.filter(s => state.sections[s.id] === 'completed').length;
  const pct = Math.round((completed / SECTIONS.length) * 100);

  const items = SECTIONS.map(s => {
    const status = state.sections[s.id] || 'pending';
    const isActive = s.id === currentSectionId;
    return `
      <li class="sidebar-item">
        <a href="${basePath}pages/${s.file}" class="sidebar-link${isActive ? ' active' : ''}">
          <span class="sidebar-num">${s.num}</span>
          <span class="sidebar-title">${s.title}</span>
          <span class="sidebar-status ${status}"></span>
        </a>
      </li>`;
  }).join('');

  return `
    <nav class="sidebar" id="sidebar">
      <ul class="sidebar-section-list">
        ${items}
      </ul>
      <div class="sidebar-divider"></div>
      <a href="${basePath}pages/settings.html" class="sidebar-link" style="margin-bottom:4px;">
        <span class="sidebar-num" style="background:var(--bg3);">⚙</span>
        <span class="sidebar-title">Export / Import State</span>
      </a>
      <div class="sidebar-footer">
        <div class="sidebar-progress-label">Progress</div>
        <div class="sidebar-progress-track">
          <div class="sidebar-progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="sidebar-progress-count">${completed} / ${SECTIONS.length} completed</div>
      </div>
    </nav>
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>`;
}

function openSidebar() {
  document.getElementById('sidebar')?.classList.add('open');
  document.getElementById('sidebarOverlay')?.classList.add('active');
}

function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebarOverlay')?.classList.remove('active');
}

// ─── STATUS PICKER ────────────────────────────
function renderStatusPicker(sectionId) {
  const current = getSectionStatus(sectionId);
  const statuses = [
    { id: 'pending',     label: 'Pending' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed',   label: 'Completed' },
  ];
  const buttons = statuses.map(s =>
    `<button class="status-btn${s.id === current ? ' active' : ''}"
       data-status="${s.id}" data-section="${sectionId}"
       onclick="setStatus('${sectionId}','${s.id}',this)">
       <span class="dot"></span>${s.label}
     </button>`
  ).join('');

  return `
    <div class="status-picker">
      <span class="status-picker-label">Status</span>
      ${buttons}
    </div>`;
}

function setStatus(sectionId, status, btn) {
  setSectionStatus(sectionId, status);
  const picker = btn.closest('.status-picker');
  picker.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // Update sidebar dot
  const sidebarDot = document.querySelector('.sidebar-link.active .sidebar-status');
  if (sidebarDot) sidebarDot.className = `sidebar-status ${status}`;
  // Update sidebar progress
  const pct = Math.round((getCompletedCount() / SECTIONS.length) * 100);
  const fill = document.querySelector('.sidebar-progress-fill');
  const count = document.querySelector('.sidebar-progress-count');
  if (fill) fill.style.width = pct + '%';
  if (count) count.textContent = getCompletedCount() + ' / ' + SECTIONS.length + ' completed';
}

// ─── PAGE HEADER ──────────────────────────────
function renderPageHeader(sectionId) {
  const s = SECTIONS.find(x => x.id === sectionId);
  if (!s) return '';
  return `
    <div class="page-header">
      <div class="page-header-top">
        <div class="section-num-badge" style="${NUM_COLORS[sectionId]}">${s.num}</div>
        <div class="page-header-info">
          <h1>${s.title}</h1>
          <div class="page-header-meta">
            <span class="tag" style="${TAG_COLORS[s.tagColor]}">${s.tag}</span>
          </div>
        </div>
      </div>
      ${renderStatusPicker(sectionId)}
    </div>`;
}

// ─── SECTION NAV ──────────────────────────────
function renderSectionNav(sectionId, basePath) {
  const idx = SECTIONS.findIndex(s => s.id === sectionId);
  const prev = SECTIONS[idx - 1];
  const next = SECTIONS[idx + 1];

  const prevBtn = prev
    ? `<a class="nav-btn" href="${basePath}pages/${prev.file}">
         <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
         <span>${prev.num}. ${prev.title.split(' ').slice(0,4).join(' ')}…</span>
       </a>`
    : `<a class="nav-btn disabled" href="#">
         <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
         <span>Start of course</span>
       </a>`;

  const nextBtn = next
    ? `<a class="nav-btn primary" href="${basePath}pages/${next.file}">
         <span>${next.num}. ${next.title.split(' ').slice(0,4).join(' ')}…</span>
         <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
       </a>`
    : `<a class="nav-btn" href="${basePath}index.html">
         <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
         <span>Back to Dashboard</span>
       </a>`;

  return `
    <div class="section-nav">
      ${prevBtn}
      <span class="nav-center">${idx + 1} / ${SECTIONS.length}</span>
      ${nextBtn}
    </div>`;
}

// ─── HEADER ───────────────────────────────────
function renderHeader(basePath) {
  return `
    <header class="site-header">
      <button class="btn-menu" onclick="openSidebar()" title="Toggle menu">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <a href="${basePath}index.html" class="header-logo">
        <span class="logo-icon">🚁</span>
        C++ Drone Tutorial
      </a>
      <div class="header-spacer"></div>
      <div class="header-actions">
        <a href="${basePath}pages/settings.html" class="btn-icon" title="Export / Import State">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </a>
      </div>
    </header>`;
}

// ─── COPY BUTTONS ─────────────────────────────
function attachCopyButtons() {
  document.querySelectorAll('pre').forEach(pre => {
    const code = pre.textContent;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1800);
      }).catch(() => {
        // fallback for non-https / older browsers
        const ta = document.createElement('textarea');
        ta.value = code;
        ta.style.cssText = 'position:fixed;opacity:0;';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1800);
      });
    });
    pre.appendChild(btn);
  });
}

// ─── PAGE INIT ────────────────────────────────
function initPage(sectionId, basePath) {
  currentSectionId = sectionId;
  basePath = basePath || '../';
  document.body.innerHTML =
    renderHeader(basePath) +
    `<div class="layout">
      ${renderSidebar(sectionId, basePath)}
      <main class="main">
        ${renderPageHeader(sectionId)}
        <div class="section-content" id="section-body">
          ${document.getElementById('page-content').innerHTML}
        </div>
        ${renderSectionNav(sectionId, basePath)}
        <div class="page-footer">C++ for Drone Engineering · v1.0 · April 2026</div>
      </main>
    </div>`;

  bindCheckboxes();
  attachCopyButtons();
  restoreLastSubSection(sectionId);
}

// ─── DASHBOARD INIT ───────────────────────────
function initDashboard() {
  const state = getState();
  const completed = getCompletedCount();
  const pct = Math.round((completed / SECTIONS.length) * 100);

  // Update progress bar
  const fill = document.getElementById('dashProgressFill');
  const count = document.getElementById('dashProgressCount');
  if (fill) fill.style.width = pct + '%';
  if (count) count.textContent = completed + ' / ' + SECTIONS.length + ' completed';

  // Render "continue" banner
  const continueSection = getContinueSection();
  const banner = document.getElementById('continueBanner');
  if (banner) {
    if (continueSection && completed > 0 || continueSection) {
      const s = continueSection;
      const sectionStatus = state.sections[s.id] || 'pending';
      const isInProgress = sectionStatus === 'in-progress';
      const verb = isInProgress ? 'Continue' : (completed === 0 ? 'Start' : 'Resume');
      const lastSub = state.lastSubSection[s.id];
      const subDisplay = lastSub ? getSubSectionDisplay(s.id, lastSub) : null;
      const hint = isInProgress
        ? (subDisplay ? `Last viewed: §${subDisplay}` : 'Pick up where you left off')
        : completed === 0
          ? 'Begin the tutorial'
          : `Next up after ${completed} completed section${completed > 1 ? 's' : ''}`;

      banner.innerHTML = `
        <a href="pages/${s.file}" class="continue-card">
          <div class="continue-icon">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
          <div class="continue-body">
            <div class="continue-verb">${verb} learning</div>
            <div class="continue-title">${s.num}. ${s.title}</div>
            <div class="continue-hint">${hint}</div>
          </div>
          <svg class="continue-arrow" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </a>`;
      banner.style.display = 'block';
    } else if (completed === SECTIONS.length) {
      // All done
      banner.innerHTML = `
        <div class="continue-card continue-done">
          <div class="continue-icon" style="background:var(--green-bg);color:var(--green);">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="continue-body">
            <div class="continue-verb" style="color:var(--green);">All sections completed!</div>
            <div class="continue-title">You've finished the entire tutorial.</div>
            <div class="continue-hint">Review any section from the list below.</div>
          </div>
        </div>`;
      banner.style.display = 'block';
    }
  }

  // Render section cards
  const list = document.getElementById('sectionList');
  if (!list) return;

  list.innerHTML = SECTIONS.map(s => {
    const status = state.sections[s.id] || 'pending';
    const statusLabel = status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);
    const isContinue = continueSection && continueSection.id === s.id;
    return `
      <a href="pages/${s.file}" class="section-card${isContinue ? ' section-card-current' : ''}">
        <div class="snum" style="${NUM_COLORS[s.id]}">${s.num}</div>
        <div class="section-card-body">
          <div class="section-card-title">${s.title}</div>
          <div class="section-card-meta">
            <span class="tag" style="${TAG_COLORS[s.tagColor]}">${s.tag}</span>
          </div>
        </div>
        <span class="section-card-status ${status}">${statusLabel}</span>
        <svg class="section-card-arrow" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </a>`;
  }).join('');
}
