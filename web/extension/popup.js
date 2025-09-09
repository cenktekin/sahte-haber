/* global chrome */
const t = document.getElementById('debugToggle')
const out = document.getElementById('out')
const pingBtn = document.getElementById('ping')

const apiKeyEl = document.getElementById('apiKey')
const primaryEl = document.getElementById('primaryModel')
const fallbackEl = document.getElementById('fallbackModel')
const saveBtn = document.getElementById('saveOpenRouter')
const testBtn = document.getElementById('testOpenRouter')

const sensEl = document.getElementById('sensitivity')
const sensValEl = document.getElementById('sensitivityValue')

// New: domain filter + cache
const newsOnlyEl = document.getElementById('newsOnly')
const allowlistEl = document.getElementById('allowlist')
const cacheTtlEl = document.getElementById('cacheTtl')

// New: panel/behavior
const manualModeEl = document.getElementById('manualMode')
const minimizeDefaultEl = document.getElementById('minimizeDefault')
const panelPositionEl = document.getElementById('panelPosition')
const panelAccentEl = document.getElementById('panelAccent')
// Model search/filter/favorites
const modelSearchEl = document.getElementById('modelSearch')
const onlyFreeEl = document.getElementById('onlyFree')
const favPrimaryEl = document.getElementById('favPrimary')
const favFallbackEl = document.getElementById('favFallback')
const favoritesWrap = document.getElementById('favorites')
let ALL_MODELS = []
let FAVORITES = []

// Load settings
;(async () => {
  const cfg = await chrome.storage.local.get([
    'APP_DEBUG',
    'OPENROUTER_API_KEY',
    'OPENROUTER_MODEL_PRIMARY',
    'OPENROUTER_MODEL_FALLBACK',
    'SENSITIVITY',
    'NEWS_ONLY',
    'DOMAIN_ALLOWLIST',
    'CACHE_TTL',
    'MANUAL_MODE',
    'MINIMIZE_DEFAULT',
    'PANEL_POSITION',
    'PANEL_ACCENT',
    'FAVORITE_MODELS',
    'LAST_MODEL',
  ])
  const { APP_DEBUG, OPENROUTER_API_KEY, OPENROUTER_MODEL_PRIMARY, OPENROUTER_MODEL_FALLBACK } = cfg
  t.checked = !!APP_DEBUG
  if (OPENROUTER_API_KEY) apiKeyEl.value = OPENROUTER_API_KEY
  if (OPENROUTER_MODEL_PRIMARY) primaryEl.value = OPENROUTER_MODEL_PRIMARY
  if (OPENROUTER_MODEL_FALLBACK) fallbackEl.value = OPENROUTER_MODEL_FALLBACK

  const sens = typeof cfg.SENSITIVITY === 'number' ? cfg.SENSITIVITY : 50
  sensEl.value = String(sens)
  sensValEl.textContent = String(sens)

  newsOnlyEl.checked = !!cfg.NEWS_ONLY
  allowlistEl.value = cfg.DOMAIN_ALLOWLIST || ''
  cacheTtlEl.value = String(typeof cfg.CACHE_TTL === 'number' ? cfg.CACHE_TTL : 300)

  manualModeEl.checked = !!cfg.MANUAL_MODE
  minimizeDefaultEl.checked = !!cfg.MINIMIZE_DEFAULT
  panelPositionEl.value = cfg.PANEL_POSITION || 'top-right'
  panelAccentEl.value = cfg.PANEL_ACCENT || 'auto'

  // Fetch dynamic model list from background (OpenRouter /models)
  FAVORITES = Array.isArray(cfg.FAVORITE_MODELS) ? cfg.FAVORITE_MODELS : []
  const lastUsed = cfg.LAST_MODEL

  chrome.runtime.sendMessage({ type: 'OPENROUTER_MODELS' }, (resp) => {
    try {
      if (!resp || !resp.ok) return
      ALL_MODELS = Array.isArray(resp.models) ? resp.models : []
      const currentPrimary = lastUsed || cfg.OPENROUTER_MODEL_PRIMARY || primaryEl.value
      const currentFallback = cfg.OPENROUTER_MODEL_FALLBACK || fallbackEl.value
      renderModelSelects({ primary: currentPrimary, fallback: currentFallback })
      renderFavorites()
      updateFavCheckboxes()
    } catch {}
  })
})()

// Save DEBUG toggle
t.addEventListener('change', async () => {
  await chrome.storage.local.set({ APP_DEBUG: t.checked })
  out.textContent = `DEBUG: ${t.checked ? 'ON' : 'OFF'}`
})

// Save OpenRouter settings
saveBtn.addEventListener('click', async () => {
  try {
    const apiKey = apiKeyEl.value.trim()
    const modelPrimary = primaryEl.value
    const modelFallback = fallbackEl.value
    await chrome.storage.local.set({
      OPENROUTER_API_KEY: apiKey,
      OPENROUTER_MODEL_PRIMARY: modelPrimary,
      OPENROUTER_MODEL_FALLBACK: modelFallback,
      FAVORITE_MODELS: FAVORITES,
    })
    // Clear session cache so model change is effective immediately
    try {
      await chrome.storage.session.clear()
    } catch {}
    out.textContent = 'OpenRouter ayarları kaydedildi.'
  } catch (e) {
    out.textContent = String(e)
  }
})

function filterModels() {
  const q = (modelSearchEl?.value || '').toLowerCase().trim()
  const only = !!onlyFreeEl?.checked
  return ALL_MODELS.filter((m) => {
    if (only && !m.free) return false
    if (!q) return true
    return String(m.id).toLowerCase().includes(q) || String(m.name).toLowerCase().includes(q)
  })
}

function renderModelSelects({ primary, fallback }) {
  // Favorileri en üste al
  const favSet = new Set(FAVORITES)
  const list = filterModels()
    .slice()
    .sort((a, b) => {
      const af = favSet.has(a.id)
      const bf = favSet.has(b.id)
      if (af && !bf) return -1
      if (!af && bf) return 1
      return String(a.name || a.id).localeCompare(String(b.name || b.id))
    })
  const fill = (el, current) => {
    const val = current
    el.innerHTML = ''
    for (const m of list) {
      const opt = document.createElement('option')
      opt.value = m.id
      const star = favSet.has(m.id) ? '★ ' : ''
      opt.textContent = star + (m.name || m.id) + (m.free ? ' (free)' : '')
      el.appendChild(opt)
    }
    if (val && !list.find((m) => m.id === val)) {
      const opt = document.createElement('option')
      opt.value = val
      opt.textContent = val
      el.appendChild(opt)
    }
    el.value = val || ''
  }
  fill(primaryEl, primary)
  fill(fallbackEl, fallback)
}

function renderFavorites() {
  if (!favoritesWrap) return
  favoritesWrap.innerHTML = ''
  for (const id of FAVORITES) {
    const badge = document.createElement('button')
    badge.textContent = id
    badge.className = 'btn'
    badge.style.padding = '4px 8px'
    badge.style.fontSize = '12px'
    badge.style.background = '#00000022'
    badge.addEventListener('click', () => {
      primaryEl.value = id
      updateFavCheckboxes()
    })
    favoritesWrap.appendChild(badge)
  }
}

function updateFavCheckboxes() {
  if (favPrimaryEl) favPrimaryEl.checked = FAVORITES.includes(primaryEl.value)
  if (favFallbackEl) favFallbackEl.checked = FAVORITES.includes(fallbackEl.value)
}

// Debounce helper
function debounce(fn, ms) {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }
}
const rerenderDebounced = debounce(() => {
  renderModelSelects({ primary: primaryEl.value, fallback: fallbackEl.value })
}, 250)

modelSearchEl?.addEventListener('input', rerenderDebounced)
onlyFreeEl?.addEventListener('change', rerenderDebounced)

favPrimaryEl?.addEventListener('change', async () => {
  const id = primaryEl.value
  const idx = FAVORITES.indexOf(id)
  if (favPrimaryEl.checked && idx === -1) FAVORITES.push(id)
  if (!favPrimaryEl.checked && idx !== -1) FAVORITES.splice(idx, 1)
  renderFavorites()
  await chrome.storage.local.set({ FAVORITE_MODELS: FAVORITES })
})

favFallbackEl?.addEventListener('change', async () => {
  const id = fallbackEl.value
  const idx = FAVORITES.indexOf(id)
  if (favFallbackEl.checked && idx === -1) FAVORITES.push(id)
  if (!favFallbackEl.checked && idx !== -1) FAVORITES.splice(idx, 1)
  renderFavorites()
  await chrome.storage.local.set({ FAVORITE_MODELS: FAVORITES })
})

// Test OpenRouter call
testBtn.addEventListener('click', async () => {
  try {
    const messages = [
      { role: 'system', content: 'You are a concise assistant.' },
      { role: 'user', content: 'Merhaba! Kısaca kendini tanıt.' },
    ]
    chrome.runtime.sendMessage(
      {
        type: 'OPENROUTER_CHAT',
        payload: {
          messages,
        },
      },
      (resp) => {
        out.textContent = JSON.stringify(resp, null, 2)
      },
    )
  } catch (e) {
    out.textContent = String(e)
  }
})

// Sensitivity change
sensEl.addEventListener('input', async () => {
  const v = Number(sensEl.value)
  sensValEl.textContent = String(v)
  try {
    await chrome.storage.local.set({ SENSITIVITY: v })
  } catch (e) {
    out.textContent = String(e)
  }
})

// News only toggle
newsOnlyEl.addEventListener('change', async () => {
  try {
    await chrome.storage.local.set({ NEWS_ONLY: newsOnlyEl.checked })
  } catch (e) {
    out.textContent = String(e)
  }
})

// Allowlist change (on blur to reduce writes)
allowlistEl.addEventListener('blur', async () => {
  try {
    await chrome.storage.local.set({ DOMAIN_ALLOWLIST: allowlistEl.value })
  } catch (e) {
    out.textContent = String(e)
  }
})

// Cache TTL change
cacheTtlEl.addEventListener('change', async () => {
  try {
    const v = Math.max(0, Number(cacheTtlEl.value) || 0)
    cacheTtlEl.value = String(v)
    await chrome.storage.local.set({ CACHE_TTL: v })
  } catch (e) {
    out.textContent = String(e)
  }
})

// Panel/behavior settings
manualModeEl.addEventListener('change', async () => {
  try {
    await chrome.storage.local.set({ MANUAL_MODE: manualModeEl.checked })
  } catch (e) {
    out.textContent = String(e)
  }
})

minimizeDefaultEl.addEventListener('change', async () => {
  try {
    await chrome.storage.local.set({ MINIMIZE_DEFAULT: minimizeDefaultEl.checked })
  } catch (e) {
    out.textContent = String(e)
  }
})

panelPositionEl.addEventListener('change', async () => {
  try {
    await chrome.storage.local.set({ PANEL_POSITION: panelPositionEl.value })
  } catch (e) {
    out.textContent = String(e)
  }
})

panelAccentEl.addEventListener('change', async () => {
  try {
    await chrome.storage.local.set({ PANEL_ACCENT: panelAccentEl.value })
  } catch (e) {
    out.textContent = String(e)
  }
})

// Ping background
pingBtn.addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    chrome.tabs.sendMessage(tab.id, { type: 'PING' }, (resp) => {
      out.textContent = JSON.stringify(resp)
    })
  } catch (e) {
    out.textContent = String(e)
  }
})
