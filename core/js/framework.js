/* ═══════════════════════════════════════════
   LearnKit Framework
   State management, navigation, sidebar
   ═══════════════════════════════════════════ */

const MODULES = window.COURSE_CONFIG.modules
const NUM_COLORS = window.COURSE_CONFIG.numColors
const STATE_KEY = window.COURSE_CONFIG.stateKey

const TAG_COLORS = {
  blue:   "background:var(--tag-blue-bg);color:var(--tag-blue);",
  green:  "background:var(--tag-green-bg);color:var(--tag-green);",
  amber:  "background:var(--tag-amber-bg);color:var(--tag-amber);",
  purple: "background:var(--tag-purple-bg);color:var(--tag-purple);",
  orange: "background:var(--tag-orange-bg);color:var(--tag-orange);",
}

// ─── STATE MANAGEMENT ─────────────────────────
let currentModuleId = null

function getState() {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    const state = raw ? JSON.parse(raw) : {}
    if (!state.modules) state.modules = {}
    if (!state.checkboxes) state.checkboxes = {}
    if (!state.lastLesson) state.lastLesson = {}
    if (!state.expandedLessons) state.expandedLessons = {}
    if (state.userName === undefined) state.userName = ""
    return state
  } catch (e) {
    return {
      modules: {},
      checkboxes: {},
      lastLesson: {},
      expandedLessons: {},
      userName: "",
    }
  }
}

function saveState(state) {
  state.version = 3
  state.updated = new Date().toISOString()
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn("Could not save state:", e)
  }
}

function getModuleStatus(id) {
  return getState().modules[id] || "pending"
}

function setModuleStatus(id, status) {
  const state = getState()
  state.modules[id] = status
  saveState(state)
}

function getCompletedCount() {
  const state = getState()
  return MODULES.filter((s) => state.modules[s.id] === "completed").length
}

// ─── CONTINUE MODULE ─────────────────────────
// Returns the module to resume: in-progress first, then first non-completed,
// then null if everything is completed.
function getContinueModule() {
  const state = getState()
  const inProgress = MODULES.find((s) => state.modules[s.id] === "in-progress")
  if (inProgress) return inProgress
  const nextUp = MODULES.find((s) => state.modules[s.id] !== "completed")
  if (nextUp) return nextUp
  return null
}

// ─── CHECKBOX MANAGEMENT ──────────────────────
function loadCheckboxes() {
  const state = getState()
  document.querySelectorAll(".checklist input[type=checkbox]").forEach((cb) => {
    cb.checked = !!state.checkboxes[cb.id]
    if (cb.checked) cb.closest("li")?.classList.add("done")
  })
}

function saveCheckbox(id, checked) {
  const state = getState()
  state.checkboxes[id] = checked
  saveState(state)
}

function bindCheckboxes() {
  document.querySelectorAll(".checklist input[type=checkbox]").forEach((cb) => {
    cb.addEventListener("change", () => {
      saveCheckbox(cb.id, cb.checked)
      const li = cb.closest("li")
      if (cb.checked) li?.classList.add("done")
      else li?.classList.remove("done")
    })
  })
  loadCheckboxes()
}

// ─── EXPORT / IMPORT ──────────────────────────
function exportState() {
  const state = getState()
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 16)
  const slug = STATE_KEY.replace(/_state$/, "")
  const filename = `${slug}-state-${ts}.json`
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  return filename
}

function importStateFromJSON(json) {
  try {
    const incoming = JSON.parse(json)
    if (!incoming.modules && !incoming.checkboxes) {
      throw new Error("Invalid state format — missing modules or checkboxes")
    }
    const state = getState()
    const incomingModules = incoming.modules || {}
    Object.assign(state.modules, incomingModules)
    if (incoming.checkboxes) Object.assign(state.checkboxes, incoming.checkboxes)
    saveState(state)
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

function replaceStateFromJSON(json) {
  try {
    const incoming = JSON.parse(json)
    if (!incoming.modules && !incoming.checkboxes) {
      throw new Error("Invalid state format")
    }
    if (!incoming.modules) incoming.modules = {}
    if (!incoming.checkboxes) incoming.checkboxes = {}
    saveState(incoming)
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

function clearState() {
  localStorage.removeItem(STATE_KEY)
}

// ─── PERSONALIZATION ──────────────────────────
function getUserName() {
  const n = getState().userName
  return n && n !== "__skipped__" ? n : null
}

function showNameModal() {
  const overlay = document.createElement("div")
  overlay.className = "name-modal-overlay"
  overlay.innerHTML = `
    <div class="name-modal">
      <div class="name-modal-title">Welcome to the course!</div>
      <p class="name-modal-desc">What should we call you? Your name will appear in greetings throughout the course.</p>
      <input class="name-modal-input" id="nameModalInput" type="text" placeholder="Your first name" maxlength="40" autocomplete="given-name">
      <div class="name-modal-actions">
        <button class="btn" onclick="skipNameModal()">Skip for now</button>
        <button class="btn btn-primary" onclick="submitNameModal()">Let's go</button>
      </div>
    </div>`
  document.body.appendChild(overlay)
  requestAnimationFrame(() => overlay.classList.add("active"))
  const input = document.getElementById("nameModalInput")
  if (input) {
    input.focus()
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submitNameModal()
    })
  }
}

function submitNameModal() {
  const name = (document.getElementById("nameModalInput")?.value || "").trim()
  const state = getState()
  state.userName = name || "__skipped__"
  saveState(state)
  const modal = document.querySelector(".name-modal")
  if (!modal) return
  const greeting = name ? `Got it, ${name}!` : "Good to go!"
  modal.innerHTML = `
    <div class="name-modal-title">${greeting}</div>
    <p class="name-modal-desc">One thing to know before you start:</p>
    <div class="name-modal-notice-box">
      <strong>Your progress stays in this browser.</strong> There's no account or server — everything is saved in localStorage.
      Switching browsers, clearing site data, or going incognito will erase it.
      <br><br>
      Use <a href="pages/settings.html">Settings</a> to back it up or move it to another device.
    </div>
    <div class="name-modal-actions">
      <button class="btn btn-primary" onclick="dismissNameModal()">Got it, let's go</button>
    </div>`
}

function dismissNameModal() {
  document.querySelector(".name-modal-overlay")?.remove()
  if (typeof initDashboard === "function") initDashboard()
}

function skipNameModal() {
  const state = getState()
  state.userName = "__skipped__"
  saveState(state)
  document.querySelector(".name-modal-overlay")?.remove()
}

// ─── GIST SHARING ─────────────────────────────
async function shareProgressAsGist() {
  const json = JSON.stringify(getState(), null, 2)
  const resp = await fetch("https://api.github.com/gists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      description: "LearnKit course progress",
      public: true,
      files: { "learnkit-progress.json": { content: json } },
    }),
  })
  if (!resp.ok) throw new Error("GitHub API error " + resp.status)
  const data = await resp.json()
  return {
    url: data.html_url,
    rawUrl: data.files["learnkit-progress.json"].raw_url,
  }
}

async function importProgressFromGist(url) {
  let rawUrl = url.trim()
  if (rawUrl.includes("gist.github.com/") && !rawUrl.includes("githubusercontent")) {
    const parts = rawUrl.replace(/\/$/, "").split("/")
    const id = parts[parts.length - 1]
    const user = parts[parts.length - 2]
    rawUrl = `https://gist.githubusercontent.com/${user}/${id}/raw/learnkit-progress.json`
  }
  const resp = await fetch(rawUrl)
  if (!resp.ok) throw new Error("Could not fetch gist: " + resp.status)
  return replaceStateFromJSON(await resp.text())
}

// ─── STATES DIRECTORY ────────────────────────
async function loadStatesManifest(basePath) {
  try {
    const resp = await fetch(basePath + "states/manifest.json", { cache: "no-store" })
    if (!resp.ok) return { states: [] }
    return await resp.json()
  } catch (e) {
    return { states: [] }
  }
}

async function loadStateFile(basePath, filename) {
  const resp = await fetch(basePath + "states/" + filename, { cache: "no-store" })
  if (!resp.ok) throw new Error("File not found: " + filename)
  return resp.json()
}

// ─── LESSON ACCORDIONS ───────────────────────
function toggleLesson(id) {
  const el = document.getElementById(id)
  if (!el) return
  const wasOpen = el.classList.contains("open")
  el.classList.toggle("open")
  if (!wasOpen && currentModuleId) {
    recordLessonExpanded(currentModuleId, id)
  }
}

function expandAll() {
  document.querySelectorAll(".lesson").forEach((s) => s.classList.add("open"))
}

function collapseAll() {
  document.querySelectorAll(".lesson").forEach((s) => s.classList.remove("open"))
}

function recordLessonExpanded(moduleId, lessonId) {
  const state = getState()

  state.lastLesson[moduleId] = lessonId

  if (!state.expandedLessons[moduleId]) state.expandedLessons[moduleId] = []
  if (!state.expandedLessons[moduleId].includes(lessonId)) {
    state.expandedLessons[moduleId].push(lessonId)
  }

  const currentStatus = state.modules[moduleId] || "pending"
  const totalLessons = document.querySelectorAll(".lesson").length

  if (state.expandedLessons[moduleId].length >= totalLessons) {
    state.modules[moduleId] = "completed"
    syncStatusUI(moduleId, "completed")
  } else if (currentStatus === "pending") {
    state.modules[moduleId] = "in-progress"
    syncStatusUI(moduleId, "in-progress")
  }

  saveState(state)
}

function syncStatusUI(moduleId, status) {
  const picker = document.querySelector(".status-picker")
  if (picker) {
    picker.querySelectorAll(".status-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.status === status)
    })
  }
  const sidebarDot = document.querySelector(".sidebar-link.active .sidebar-status")
  if (sidebarDot) sidebarDot.className = `sidebar-status ${status}`
  const pct = Math.round((getCompletedCount() / MODULES.length) * 100)
  const fill = document.querySelector(".sidebar-progress-fill")
  const count = document.querySelector(".sidebar-progress-count")
  if (fill) fill.style.width = pct + "%"
  if (count) count.textContent = getCompletedCount() + " / " + MODULES.length + " completed"
}

function restoreLastLesson(moduleId) {
  const state = getState()
  const lastLesson = state.lastLesson[moduleId]
  if (!lastLesson) return
  const el = document.getElementById(lastLesson)
  if (!el) return
  if (!el.classList.contains("open")) el.classList.add("open")
  setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 150)
}

function getLessonDisplay(moduleId, lessonId) {
  const module = MODULES.find((s) => s.id === moduleId)
  if (!module) return ""
  const lessonNum = lessonId.startsWith(moduleId + "-") ? lessonId.slice(moduleId.length + 1) : ""
  return lessonNum ? `${module.num}.${lessonNum}` : module.num
}

// ─── SIDEBAR ──────────────────────────────────
function renderSidebar(currentModuleId, basePath) {
  const state = getState()
  const completed = MODULES.filter((s) => state.modules[s.id] === "completed").length
  const pct = Math.round((completed / MODULES.length) * 100)

  const items = MODULES.map((s) => {
    const status = state.modules[s.id] || "pending"
    const isActive = s.id === currentModuleId
    return `
      <li class="sidebar-item">
        <a href="${basePath}pages/${s.file}" class="sidebar-link${isActive ? " active" : ""}">
          <span class="sidebar-num">${s.num}</span>
          <span class="sidebar-title">${s.title}</span>
          <span class="sidebar-status ${status}"></span>
        </a>
      </li>`
  }).join("")

  return `
    <nav class="sidebar" id="sidebar">
      <ul class="sidebar-module-list">
        ${items}
      </ul>
      <div class="sidebar-divider"></div>
      <div class="sidebar-footer">
        <div class="sidebar-progress-label">Progress</div>
        <div class="sidebar-progress-track">
          <div class="sidebar-progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="sidebar-progress-count">${completed} / ${MODULES.length} completed</div>
        <div class="sidebar-backup-note">
          <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="flex-shrink:0;color:var(--amber);">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span>Back up your progress — <a href="${basePath}pages/settings.html" style="color:var(--accent);">Export / Import</a></span>
        </div>
      </div>
    </nav>
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>`
}

function openSidebar() {
  document.getElementById("sidebar")?.classList.add("open")
  document.getElementById("sidebarOverlay")?.classList.add("active")
}

function closeSidebar() {
  document.getElementById("sidebar")?.classList.remove("open")
  document.getElementById("sidebarOverlay")?.classList.remove("active")
}

// ─── STATUS PICKER ────────────────────────────
function renderStatusPicker(moduleId) {
  const current = getModuleStatus(moduleId)
  const statuses = [
    { id: "pending", label: "Pending" },
    { id: "in-progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
  ]
  const buttons = statuses
    .map(
      (s) =>
        `<button class="status-btn${s.id === current ? " active" : ""}"
       data-status="${s.id}" data-module="${moduleId}"
       onclick="setStatus('${moduleId}','${s.id}',this)">
       <span class="dot"></span>${s.label}
     </button>`,
    )
    .join("")

  return `
    <div class="status-picker">
      <span class="status-picker-label">Status</span>
      ${buttons}
    </div>`
}

function setStatus(moduleId, status, btn) {
  setModuleStatus(moduleId, status)
  const picker = btn.closest(".status-picker")
  picker.querySelectorAll(".status-btn").forEach((b) => b.classList.remove("active"))
  btn.classList.add("active")
  const sidebarDot = document.querySelector(".sidebar-link.active .sidebar-status")
  if (sidebarDot) sidebarDot.className = `sidebar-status ${status}`
  const pct = Math.round((getCompletedCount() / MODULES.length) * 100)
  const fill = document.querySelector(".sidebar-progress-fill")
  const count = document.querySelector(".sidebar-progress-count")
  if (fill) fill.style.width = pct + "%"
  if (count) count.textContent = getCompletedCount() + " / " + MODULES.length + " completed"
}

// ─── PAGE HEADER ──────────────────────────────
function renderPageHeader(moduleId) {
  const s = MODULES.find((x) => x.id === moduleId)
  if (!s) return ""
  const numColor = (NUM_COLORS && NUM_COLORS[moduleId]) || "background:var(--bg3);color:var(--text2);"
  return `
    <div class="page-header">
      <div class="page-header-top">
        <div class="module-num-badge" style="${numColor}">${s.num}</div>
        <div class="page-header-info">
          <h1>${s.title}</h1>
          <div class="page-header-meta">
            <span class="tag" style="${TAG_COLORS[s.tagColor]}">${s.tag}</span>
          </div>
        </div>
      </div>
      ${renderStatusPicker(moduleId)}
    </div>`
}

// ─── MODULE NAV ───────────────────────────────
function renderModuleNav(moduleId, basePath) {
  const idx = MODULES.findIndex((s) => s.id === moduleId)
  const prev = MODULES[idx - 1]
  const next = MODULES[idx + 1]

  const prevBtn = prev
    ? `<a class="nav-btn" href="${basePath}pages/${prev.file}">
         <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
         <span>${prev.num}. ${prev.title.split(" ").slice(0, 4).join(" ")}…</span>
       </a>`
    : `<a class="nav-btn disabled" href="#">
         <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
         <span>Start of course</span>
       </a>`

  const nextBtn = next
    ? `<a class="nav-btn primary" href="${basePath}pages/${next.file}">
         <span>${next.num}. ${next.title.split(" ").slice(0, 4).join(" ")}…</span>
         <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
       </a>`
    : `<a class="nav-btn" href="${basePath}index.html">
         <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
         <span>Back to Dashboard</span>
       </a>`

  return `
    <div class="module-nav">
      ${prevBtn}
      <span class="nav-center">${idx + 1} / ${MODULES.length}</span>
      ${nextBtn}
    </div>`
}

// ─── HEADER ───────────────────────────────────
function renderHeader(basePath) {
  const cfg = window.COURSE_CONFIG
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
        <span class="logo-icon">${cfg.icon}</span>
        ${cfg.title}
      </a>
      <div class="header-spacer"></div>
      <div class="header-actions">
        <a href="${basePath}pages/settings.html" class="btn-icon" title="Settings">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </a>
      </div>
    </header>`
}

// ─── COPY BUTTONS ─────────────────────────────
function attachCopyButtons() {
  document.querySelectorAll("pre").forEach((pre) => {
    const code = pre.textContent
    const btn = document.createElement("button")
    btn.className = "copy-btn"
    btn.textContent = "Copy"
    btn.addEventListener("click", () => {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          btn.textContent = "Copied!"
          btn.classList.add("copied")
          setTimeout(() => {
            btn.textContent = "Copy"
            btn.classList.remove("copied")
          }, 1800)
        })
        .catch(() => {
          const ta = document.createElement("textarea")
          ta.value = code
          ta.style.cssText = "position:fixed;opacity:0;"
          document.body.appendChild(ta)
          ta.select()
          document.execCommand("copy")
          document.body.removeChild(ta)
          btn.textContent = "Copied!"
          btn.classList.add("copied")
          setTimeout(() => {
            btn.textContent = "Copy"
            btn.classList.remove("copied")
          }, 1800)
        })
    })
    pre.appendChild(btn)
  })
}

// ─── PAGE INIT ────────────────────────────────
function initPage(moduleId, basePath) {
  currentModuleId = moduleId
  basePath = basePath || "../"
  document.body.innerHTML =
    renderHeader(basePath) +
    `<div class="layout">
      ${renderSidebar(moduleId, basePath)}
      <main class="main">
        ${renderPageHeader(moduleId)}
        <div class="module-content" id="module-body">
          ${document.getElementById("page-content").innerHTML}
        </div>
        ${renderModuleNav(moduleId, basePath)}
        <div class="page-footer">${window.COURSE_CONFIG.footer}</div>
      </main>
    </div>`

  bindCheckboxes()
  attachCopyButtons()
  restoreLastLesson(moduleId)

  // Auto-track status for pages without lessons
  const hasLessons = document.querySelectorAll(".lesson").length > 0
  if (!hasLessons) {
    if (getModuleStatus(moduleId) === "pending") {
      setModuleStatus(moduleId, "in-progress")
      syncStatusUI(moduleId, "in-progress")
    }
    const navEl = document.querySelector(".module-nav")
    if (navEl) {
      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && getModuleStatus(moduleId) !== "completed") {
            setModuleStatus(moduleId, "completed")
            syncStatusUI(moduleId, "completed")
            obs.disconnect()
          }
        },
        { threshold: 0.5 },
      )
      obs.observe(navEl)
    }
  }
}

// ─── DASHBOARD INIT ───────────────────────────
function initDashboard() {
  const cfg = window.COURSE_CONFIG
  const state = getState()
  const name = state.userName && state.userName !== "__skipped__" ? state.userName : null
  const completed = getCompletedCount()
  const pct = Math.round((completed / MODULES.length) * 100)

  // Set page title
  document.title = cfg.title

  // Render course info card into sidebar (#dashHeader lives in <aside>)
  const header = document.getElementById("dashHeader")
  if (header) {
    const prereqItems = (cfg.prerequisites || []).map((p) => `<li>${p}</li>`).join("")
    header.innerHTML = `
      <div class="nav-card" style="margin-bottom:20px;">
        <div class="dash-course-identity">
          <span class="dash-course-icon">${cfg.icon}</span>
          <div class="dash-course-name">
            <div class="dash-course-title">${cfg.title}</div>
            ${cfg.subtitle ? `<div class="dash-course-subtitle">${cfg.subtitle}</div>` : ""}
          </div>
          <a href="pages/settings.html" class="btn-icon" title="Settings" style="flex-shrink:0;">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </a>
        </div>
        ${cfg.description ? `<p class="dash-course-desc">${cfg.description}</p>` : ""}
        <div class="dash-course-meta">
          ${prereqItems ? `
          <div class="dash-meta-item">
            <div class="dash-meta-label">Prerequisites</div>
            <ul class="prereq-list">${prereqItems}</ul>
          </div>` : ""}
          ${cfg.timeCommitment ? `
          <div class="dash-meta-item">
            <div class="dash-meta-label">Time commitment</div>
            <div class="dash-meta-value">${cfg.timeCommitment}</div>
          </div>` : ""}
          ${cfg.goal ? `
          <div class="dash-meta-item">
            <div class="dash-meta-label">Goal</div>
            <div class="dash-meta-value">${cfg.goal}</div>
          </div>` : ""}
        </div>
        <div class="dash-progress-section">
          <div class="dash-progress-label">Progress</div>
          <div class="hero-progress-track">
            <div class="hero-progress-fill" id="dashProgressFill"></div>
          </div>
          <div class="hero-progress-stats">
            <span class="hero-progress-count" id="dashProgressCount">0 / ? completed</span>
            <span id="dashProgressPercent">0%</span>
          </div>
          <div class="hero-kpi-row" id="dashKPIs"></div>
        </div>
        <div class="dash-course-actions">
          <div class="nav-card-warning" style="width:100%;border-radius:8px;padding:10px 12px;display:flex;gap:8px;align-items:flex-start;font-size:12px;color:var(--text2);line-height:1.5;">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:1px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span><strong>Progress stays in this browser.</strong> Switching browsers or clearing site data will erase it.</span>
          </div>
          <a href="pages/settings.html" class="module-grid-card-action-btn" style="width:100%;justify-content:center;">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
            Export / Import
          </a>
        </div>
      </div>`
  }

  // Update progress bar (hero section)
  const fill = document.getElementById("dashProgressFill")
  const count = document.getElementById("dashProgressCount")
  const percent = document.getElementById("dashProgressPercent")
  if (fill) fill.style.width = pct + "%"
  if (count) count.textContent = completed + " / " + MODULES.length + " completed"
  if (percent) percent.textContent = pct + "%"

  const inProgressCount = MODULES.filter((s) => state.modules[s.id] === "in-progress").length
  const remainingCount = MODULES.length - completed - inProgressCount
  const kpis = document.getElementById("dashKPIs")
  if (kpis) {
    kpis.innerHTML = `
      <span class="hero-kpi-chip done">
        <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        ${completed} done
      </span>
      <span class="hero-kpi-chip in-progress">
        <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        ${inProgressCount} in progress
      </span>
      <span class="hero-kpi-chip remaining">
        <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
        ${remainingCount} remaining
      </span>`
  }

  // Render footer
  const footer = document.getElementById("dashFooter")
  if (footer) footer.textContent = cfg.footer

  // Render "continue" banner
  const continueModule = getContinueModule()
  const banner = document.getElementById("continueBanner")
  if (banner) {
    if (continueModule) {
      const s = continueModule
      const moduleStatus = state.modules[s.id] || "pending"
      const isInProgress = moduleStatus === "in-progress"
      const verb = isInProgress ? "Continue" : completed === 0 ? "Start" : "Resume"
      const lastLesson = state.lastLesson[s.id]
      const lessonDisplay = lastLesson ? getLessonDisplay(s.id, lastLesson) : null
      const hint = isInProgress
        ? lessonDisplay
          ? `Last viewed: §${lessonDisplay}`
          : name
            ? `Ready to continue, ${name}`
            : "Pick up where you left off"
        : completed === 0
          ? name
            ? `Welcome, ${name} — let's start`
            : "Begin the course"
          : `Next up after ${completed} completed module${completed > 1 ? "s" : ""}`

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
        </a>`
      banner.style.display = "block"
    } else if (completed === MODULES.length) {
      banner.innerHTML = `
        <div class="continue-card continue-done">
          <div class="continue-icon" style="background:var(--green-bg);color:var(--green);">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="continue-body">
            <div class="continue-verb" style="color:var(--green);">All modules completed!</div>
            <div class="continue-title">${name ? `Incredible work, ${name}!` : "You've finished the entire course."}</div>
            <div class="continue-hint">Review any module from the list below.</div>
          </div>
        </div>`
      banner.style.display = "block"
    }
  }

  // Render module cards (grid layout)
  const list = document.getElementById("moduleList")
  if (list) {
    list.innerHTML = MODULES.map((s) => {
      const status = state.modules[s.id] || "pending"
      const statusLabel =
        status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)
      const isContinue = continueModule && continueModule.id === s.id
      const numColor = (NUM_COLORS && NUM_COLORS[s.id]) || "background:var(--bg3);color:var(--text2);"

      let buttonText = "Start"
      let buttonClass = "primary"
      if (status === "in-progress") {
        buttonText = "Resume"
      } else if (status === "completed") {
        buttonText = "Review"
        buttonClass = ""
      }
      const chevron = buttonClass === "primary"
        ? `<svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>`
        : ""

      return `
        <div class="module-grid-card">
          <div class="module-grid-card-header">
            <div class="module-grid-card-num" style="${numColor}">${s.num}</div>
            <div class="module-grid-card-info">
              <div class="module-grid-card-title">${s.title}</div>
              <div class="module-grid-card-meta">
                <span class="module-grid-card-tag" style="${TAG_COLORS[s.tagColor]}">${s.tag}</span>
                <span class="module-grid-card-status ${status}">${statusLabel}</span>
              </div>
            </div>
            <a href="pages/${s.file}" class="module-grid-card-action-btn ${buttonClass}">
              ${buttonText}${chevron}
            </a>
          </div>
          ${s.description ? `<div class="module-grid-card-body">${s.description}</div>` : ""}
          ${s.estimatedTime ? `<div class="module-grid-card-footer"><span class="module-grid-card-time">${s.estimatedTime}</span></div>` : ""}
        </div>`
    }).join("")
  }

  if (state.userName === "") showNameModal()
}
