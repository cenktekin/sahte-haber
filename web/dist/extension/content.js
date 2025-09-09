/* Content Script */
;(function () {
  if (window.__SHU_OVERLAY__) return
  window.__SHU_OVERLAY__ = true

  function createOverlay() {
    const wrap = document.createElement('div')
    wrap.setAttribute('role', 'region')
    wrap.setAttribute('aria-label', 'Uyarı Paneli')
    wrap.style.position = 'fixed'
    wrap.style.top = '12px'
    wrap.style.right = '12px'
    wrap.style.zIndex = '2147483647'
    wrap.style.maxWidth = '380px'
    wrap.style.padding = '12px 14px'
    wrap.style.borderRadius = '10px'
    wrap.style.background = 'rgba(0, 0, 0, 0.85)'
    wrap.style.color = '#fff'
    wrap.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)'
    wrap.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    wrap.style.backdropFilter = 'blur(6px) saturate(120%)'
    wrap.style.border = '1px solid #ffffff22'

    wrap.innerHTML = `
      <div style="display:flex; align-items:flex-start; gap:10px;">
        <div style="display:flex; flex-direction:column; gap:8px; flex:1">
          <div style="display:flex; align-items:center; gap:8px;">
            <span id="shu-badge" style="display:inline-flex;align-items:center;gap:6px;padding:2px 8px;border-radius:999px;background:rgba(255,255,255,0.15);font-weight:700">⏳ Analiz</span>
            <small id="shu-meta" style="opacity:.9"></small>
          </div>
          <div id="shu-title" style="font-weight:700; font-size:14px">Analiz ediliyor…</div>
          <div id="shu-summary" style="opacity:.95; font-size:13px; line-height:1.4">
            Sayfa içeriği güvenlik açısından değerlendiriliyor.
          </div>
          <div id="shu-reason" style="opacity:.9; font-size:12px"></div>
          <div id="shu-actions" style="display:flex; gap:8px; align-items:center; flex-wrap:wrap">
            <select id="shu-model" aria-label="Model seç" title="Model seç"
              style="max-width:100%;padding:6px 8px;border-radius:8px;background:#ffffff0f;color:#fff;border:1px solid #ffffff22;cursor:pointer">
              <option value="">(varsayılan)</option>
            </select>
            <button id="shu-detail-btn" style="padding:6px 8px;border-radius:8px;background:#ffffff1a;color:#fff;border:1px solid #ffffff22;cursor:pointer">Detay</button>
            <button id="shu-json-btn" style="padding:6px 8px;border-radius:8px;background:#ffffff1a;color:#fff;border:1px solid #ffffff22;cursor:pointer">JSON</button>
            <button id="shu-copy" style="padding:6px 8px;border-radius:8px;background:#ffffff1a;color:#fff;border:1px solid #ffffff22;cursor:pointer">Kopyala</button>
            <button id="shu-retry" style="padding:6px 8px;border-radius:8px;background:#ffffff1a;color:#fff;border:1px solid #ffffff22;cursor:pointer">Yeniden</button>
          </div>
          <div id="shu-detail" style="display:none;background:#ffffff12;border:1px solid #ffffff22;border-radius:8px;padding:10px;line-height:1.4;max-height:260px;overflow:auto">
            <div style="display:grid;grid-template-columns:88px 1fr;gap:6px 10px;font-size:12px">
              <div style="opacity:.9">Model</div><div id="shu-detail-model" style="opacity:.95"></div>
              <div style="opacity:.9">URL</div><div id="shu-detail-url" style="opacity:.95;word-break:break-all"></div>
              <div style="opacity:.9">Özet</div><div id="shu-detail-summary" style="opacity:.95"></div>
              <div style="opacity:.9">Gerekçe</div><div id="shu-detail-reason" style="opacity:.95"></div>
            </div>
          </div>
          <pre id="shu-raw" style="display:none;background:#00000033;border:1px solid #ffffff22;border-radius:8px;padding:8px;white-space:pre;max-height:260px;overflow:auto;tab-size:2;font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"></pre>
        </div>
        <button id="shu-close" aria-label="Uyarıyı kapat" style="margin-left:auto;background:transparent;border:0;color:#fff;font-weight:700;font-size:16px;cursor:pointer">×</button>
      </div>
    `

    wrap.querySelector('#shu-close')?.addEventListener('click', () => wrap.remove())
    // Actions
    wrap.querySelector('#shu-detail-btn')?.addEventListener('click', () => {
      const detail = wrap.querySelector('#shu-detail')
      const raw = wrap.querySelector('#shu-raw')
      if (!detail) return
      if (raw) raw.style.display = 'none'
      detail.style.display = detail.style.display === 'none' ? 'block' : 'none'
    })
    wrap.querySelector('#shu-json-btn')?.addEventListener('click', () => {
      const detail = wrap.querySelector('#shu-detail')
      const raw = wrap.querySelector('#shu-raw')
      if (!raw) return
      if (detail) detail.style.display = 'none'
      raw.style.display = raw.style.display === 'none' ? 'block' : 'none'
    })
    wrap.querySelector('#shu-copy')?.addEventListener('click', async () => {
      const t = wrap.querySelector('#shu-title')?.textContent || ''
      const s = wrap.querySelector('#shu-summary')?.textContent || ''
      const r = wrap.querySelector('#shu-reason')?.textContent || ''
      const m = wrap.querySelector('#shu-meta')?.textContent || ''
      const payload = `Title: ${t}\n${s}\n${r}\n${m}\nURL: ${location.href}`
      try {
        await navigator.clipboard.writeText(payload)
      } catch {
        const ta = document.createElement('textarea')
        ta.value = payload
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        ta.remove()
      }
    })
    wrap
      .querySelector('#shu-retry')
      ?.addEventListener('click', () => analyze(wrap, { userInitiated: true }))

    // Focus rings for buttons (keyboard accessibility)
    const focusables = wrap.querySelectorAll('#shu-actions button, #shu-actions select')
    focusables.forEach((el) => {
      el.addEventListener('focus', () => {
        el.style.outline = '2px solid #fff'
        el.style.outlineOffset = '2px'
      })
      el.addEventListener('blur', () => {
        el.style.outline = 'none'
      })
    })

    // Micro interactions (hover/active) with reduced-motion respect
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    focusables.forEach((el) => {
      const isSelect = el.tagName === 'SELECT'
      const base = isSelect ? '#ffffff0f' : '#ffffff1a'
      const hover = isSelect ? '#ffffff1c' : '#ffffff2a'
      el.style.transition = prefersReduced
        ? 'none'
        : 'background-color 120ms ease, transform 80ms ease'
      el.addEventListener('mouseenter', () => {
        el.style.background = hover
      })
      el.addEventListener('mouseleave', () => {
        el.style.background = base
        el.style.transform = 'none'
      })
      el.addEventListener('mousedown', () => {
        if (!prefersReduced) el.style.transform = 'scale(0.98)'
      })
      el.addEventListener('mouseup', () => {
        el.style.transform = 'none'
      })
    })
    return wrap
  }

  function applyPosition(el, pos) {
    const p = String(pos || 'top-right')
    el.style.top = ''
    el.style.right = ''
    el.style.bottom = ''
    el.style.left = ''
    if (p === 'top-right') {
      el.style.top = '12px'
      el.style.right = '12px'
    } else if (p === 'top-left') {
      el.style.top = '12px'
      el.style.left = '12px'
    } else if (p === 'bottom-right') {
      el.style.bottom = '12px'
      el.style.right = '12px'
    } else if (p === 'bottom-left') {
      el.style.bottom = '12px'
      el.style.left = '12px'
    }
  }

  function applyAccent(el, accent) {
    const map = {
      auto: '#ffffff22',
      orange: '#f59e0b66',
      blue: '#3b82f666',
      green: '#10b98166',
      red: '#ef444466',
    }
    const outline = map[String(accent || 'auto')] || map.auto
    // Sadece ince outline; arkaplan nötr kalır
    el.style.boxShadow = `0 8px 20px rgba(0,0,0,0.25), 0 0 0 1px ${outline}`
  }

  function setMinimized(el, minimized) {
    const summaryEl = el.querySelector('#shu-summary')
    const reasonEl = el.querySelector('#shu-reason')
    const actionsEl = el.querySelector('#shu-actions')
    const rawEl = el.querySelector('#shu-raw')
    const detailEl = el.querySelector('#shu-detail')
    const display = minimized ? 'none' : ''
    if (summaryEl) summaryEl.style.display = display
    if (reasonEl) reasonEl.style.display = display
    if (actionsEl) actionsEl.style.display = display
    if (rawEl) rawEl.style.display = 'none'
    if (detailEl) detailEl.style.display = 'none'
  }

  const mount = async () => {
    // Read settings first
    const cfg = await chrome.storage.local.get([
      'MANUAL_MODE',
      'MINIMIZE_DEFAULT',
      'PANEL_POSITION',
      'PANEL_ACCENT',
      'OPENROUTER_MODEL_PRIMARY',
      'LAST_MODEL',
      'FAVORITE_MODELS',
    ])

    const el = createOverlay()
    ;(document.body || document.documentElement)?.appendChild(el)
    applyPosition(el, cfg.PANEL_POSITION || 'top-right')
    applyAccent(el, cfg.PANEL_ACCENT || 'auto')

    const retryBtn = el.querySelector('#shu-retry')
    const badgeEl = el.querySelector('#shu-badge')
    const titleEl = el.querySelector('#shu-title')
    const summaryEl = el.querySelector('#shu-summary')
    const modelSel = el.querySelector('#shu-model')

    if (titleEl) titleEl.textContent = 'Hazır'
    if (summaryEl) summaryEl.textContent = ''

    if (cfg.MINIMIZE_DEFAULT) {
      // Manuel modda aksiyonlar görünür kalsın ki kullanıcı tetikleyebilsin
      setMinimized(el, !cfg.MANUAL_MODE)
    }

    if (cfg.MANUAL_MODE) {
      if (retryBtn) retryBtn.textContent = 'Analiz et'
      if (badgeEl) badgeEl.textContent = '⏸️ Hazır'
      if (titleEl) titleEl.textContent = 'Manuel mod'
      if (summaryEl) summaryEl.textContent = 'Analiz için “Analiz et”e basın.'
    } else {
      analyze(el, { userInitiated: false })
    }

    // ESC to close
    const escListener = (ev) => {
      if (ev.key === 'Escape') {
        el.remove()
        window.removeEventListener('keydown', escListener)
      }
    }
    window.addEventListener('keydown', escListener)

    // Populate model select (from background models + defaults)
    const currentModel = cfg.LAST_MODEL || cfg.OPENROUTER_MODEL_PRIMARY || ''
    if (modelSel) {
      if (currentModel) modelSel.value = currentModel
      chrome.runtime.sendMessage({ type: 'OPENROUTER_MODELS' }, (resp) => {
        try {
          if (!resp || !resp.ok) return
          const models = Array.isArray(resp.models) ? resp.models : []
          const favSet = new Set(Array.isArray(cfg.FAVORITE_MODELS) ? cfg.FAVORITE_MODELS : [])
          const ordered = models.slice().sort((a, b) => {
            const af = favSet.has(a.id)
            const bf = favSet.has(b.id)
            if (af && !bf) return -1
            if (!af && bf) return 1
            return String(a.name || a.id).localeCompare(String(b.name || b.id))
          })

          // Keep current option and refill
          const seen = new Set()
          modelSel.innerHTML = ''
          // default option
          const defOpt = document.createElement('option')
          defOpt.value = ''
          defOpt.textContent = '(varsayılan)'
          modelSel.appendChild(defOpt)

          for (const m of ordered) {
            if (seen.has(m.id)) continue
            seen.add(m.id)
            const opt = document.createElement('option')
            opt.value = m.id
            const star = favSet.has(m.id) ? '★ ' : ''
            opt.textContent = star + (m.name || m.id) + (m.free ? ' (free)' : '')
            modelSel.appendChild(opt)
          }
          if (currentModel) modelSel.value = currentModel
        } catch {}
      })
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true })
  } else {
    mount()
  }

  function extractVisibleText() {
    try {
      const raw = document.body?.innerText || document.documentElement?.innerText || ''
      return raw.replace(/\s+/g, ' ').trim().slice(0, 8000)
    } catch {
      return ''
    }
  }

  function colorizeByRisk(wrap, risk) {
    // Panel arkaplanı nötr kalsın
    wrap.style.background = 'rgba(0, 0, 0, 0.85)'
    const map = {
      low: '#10b981', // green-500
      medium: '#f59e0b', // amber-500
      high: '#ef4444', // red-500
    }
    const color = map[risk] || '#6b7280' // gray-500 fallback
    wrap.style.borderLeft = `4px solid ${color}`
    const badge = wrap.querySelector('#shu-badge')
    if (badge) {
      badge.style.background = color
      badge.style.color = '#fff'
    }
  }

  function riskBadgeText(risk) {
    const r = String(risk || '').toLowerCase()
    if (r === 'high') return '🔴 HIGH'
    if (r === 'medium') return '🟡 MEDIUM'
    if (r === 'low') return '🟢 LOW'
    return '⏳ Analiz'
  }

  // Domain allowlist helpers
  function parseAllowlist(text) {
    return String(text || '')
      .split(/[\n,]/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  }

  function hostMatchesAllowlist(hostname, list) {
    const host = String(hostname || '')
      .toLowerCase()
      .replace(/^www\./, '')
    for (const token of list) {
      const t = token.replace(/^\./, '')
      if (host === t || host.endsWith('.' + t)) return true
    }
    return false
  }

  async function sessionGet(key) {
    try {
      const r = await chrome.storage.session.get([key])
      return r?.[key]
    } catch {
      return undefined
    }
  }

  async function sessionSet(key, value) {
    try {
      await chrome.storage.session.set({ [key]: value })
    } catch {}
  }

  // Remove markdown code fences and try to extract a JSON object
  function stripCodeFences(text) {
    if (!text) return ''
    // remove ```lang\n...``` wrappers
    let t = String(text).replace(/```[a-zA-Z]*\s*([\s\S]*?)```/g, '$1')
    // remove stray backticks and leading 'json ' labels
    t = t.replace(/```/g, '')
    t = t.replace(/^\s*json\s*/i, '')
    return t.trim()
  }

  function findJSONObject(text) {
    const s = String(text)
    const start = s.indexOf('{')
    if (start === -1) return null
    let depth = 0
    for (let i = start; i < s.length; i++) {
      const ch = s[i]
      if (ch === '{') depth++
      else if (ch === '}') {
        depth--
        if (depth === 0) return s.slice(start, i + 1)
      }
    }
    return null
  }

  function normalizePlain(text) {
    let t = stripCodeFences(text)
    // collapse whitespace
    t = t.replace(/\s+/g, ' ').trim()
    return t
  }

  function parseMaybeJSON(text) {
    const cleaned = stripCodeFences(text)
    try {
      if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
        const obj = JSON.parse(cleaned)
        return { ok: true, data: obj }
      }
    } catch {}
    // try to find first JSON object within the text
    const candidate = findJSONObject(cleaned)
    if (candidate) {
      try {
        const obj = JSON.parse(candidate)
        return { ok: true, data: obj }
      } catch {}
    }
    return {
      ok: false,
      data: {
        risk: 'medium',
        summary: normalizePlain(text).slice(0, 240),
        reason: 'Serbest metin',
      },
    }
  }

  function renderRaw(rawEl, payload) {
    if (!rawEl) return
    try {
      rawEl.textContent = JSON.stringify(payload, null, 2)
    } catch {
      rawEl.textContent = String(payload)
    }
  }

  function renderDetail(wrap, { url, model, data }) {
    const dUrl = wrap.querySelector('#shu-detail-url')
    const dModel = wrap.querySelector('#shu-detail-model')
    const dSummary = wrap.querySelector('#shu-detail-summary')
    const dReason = wrap.querySelector('#shu-detail-reason')
    if (dUrl) dUrl.textContent = String(url || '')
    if (dModel) dModel.textContent = String(model || '')
    if (dSummary) dSummary.textContent = String(data?.summary || '')
    if (dReason) dReason.textContent = String(data?.reason || '')
  }

  function updateDetails(wrap, { url, model, data }) {
    const rawEl = wrap.querySelector('#shu-raw')
    renderRaw(rawEl, { url, model, data })
    renderDetail(wrap, { url, model, data })
  }

  async function analyze(wrap, opts = {}) {
    const titleEl = wrap.querySelector('#shu-title')
    const summaryEl = wrap.querySelector('#shu-summary')
    const reasonEl = wrap.querySelector('#shu-reason')
    const badgeEl = wrap.querySelector('#shu-badge')
    const metaEl = wrap.querySelector('#shu-meta')
    const rawEl = wrap.querySelector('#shu-raw')
    if (!titleEl || !summaryEl || !badgeEl) return
    titleEl.textContent = 'Analiz ediliyor…'
    summaryEl.textContent = 'Sayfa metni hazırlanıyor'
    if (reasonEl) reasonEl.textContent = ''
    if (badgeEl) badgeEl.textContent = riskBadgeText('')
    if (metaEl) metaEl.textContent = ''
    if (rawEl) rawEl.textContent = ''
    const detailEl = wrap.querySelector('#shu-detail')
    if (detailEl) detailEl.style.display = 'none'

    const text = extractVisibleText()
    const url = location.href

    // Config fetch (filter + cache + manual)
    const cfg = await chrome.storage.local.get([
      'NEWS_ONLY',
      'DOMAIN_ALLOWLIST',
      'CACHE_TTL',
      'MANUAL_MODE',
    ])
    if (cfg.MANUAL_MODE && !opts.userInitiated) {
      titleEl.textContent = 'Manuel mod'
      summaryEl.textContent = 'Analiz için “Analiz et”e basın.'
      if (reasonEl) reasonEl.textContent = ''
      if (badgeEl) badgeEl.textContent = '⏸️ Hazır'
      if (metaEl) metaEl.textContent = ''
      if (rawEl) rawEl.textContent = ''
      return
    }
    const newsOnly = !!cfg.NEWS_ONLY
    const allowTokens = parseAllowlist(cfg.DOMAIN_ALLOWLIST)
    const cacheTtl = typeof cfg.CACHE_TTL === 'number' ? Math.max(0, cfg.CACHE_TTL) : 300

    // Domain filter check
    if (newsOnly && allowTokens.length) {
      if (!hostMatchesAllowlist(location.hostname, allowTokens)) {
        titleEl.textContent = 'Analiz pasif'
        summaryEl.textContent =
          'Bu alan adı izinli listede değil. Ayarlar > Alan Adı Filtresi bölümünden ekleyin.'
        if (reasonEl) reasonEl.textContent = ''
        if (badgeEl) badgeEl.textContent = '⏸️ Pasif'
        if (metaEl) metaEl.textContent = ''
        if (rawEl) rawEl.textContent = ''
        colorizeByRisk(wrap, 'low')
        return
      }
    }

    // Cache check
    const cacheKey = `AR_CACHE:${url}`
    if (cacheTtl > 0) {
      const cached = await sessionGet(cacheKey)
      if (cached && typeof cached.ts === 'number' && Date.now() - cached.ts < cacheTtl * 1000) {
        const data = cached.data || {}
        const riskStr = String(data.risk || '').toLowerCase()
        const riskUp = String(data.risk || 'unknown').toUpperCase()
        titleEl.textContent = `Risk: ${riskUp}`
        summaryEl.textContent = data.summary || ''
        if (reasonEl) reasonEl.textContent = data.reason ? '• ' + data.reason : ''
        if (badgeEl) badgeEl.textContent = riskBadgeText(riskStr)
        if (metaEl) metaEl.textContent = cached.model ? `Model: ${cached.model}` : '(cache)'
        updateDetails(wrap, { url, model: cached.model || '(cache)', data })
        colorizeByRisk(wrap, riskStr)
        return
      }
    }

    const messages = [
      {
        role: 'system',
        content:
          'Türkçe yanıt ver. Görevin: verilen web sayfası metninde sahte haber/dolandırıcılık şüphesi olup olmadığını hızlıca değerlendir. JSON döndür: {"risk":"low|medium|high","summary":"kısa özet","reason":"kısa gerekçe"}. Yalnızca JSON döndür; kod bloğu (``` ... ```) veya başka metin ekleme.',
      },
      {
        role: 'user',
        content: `URL: ${url}\n\nMETIN:\n${text}`,
      },
    ]

    summaryEl.textContent = 'OpenRouter çağrısı yapılıyor…'

    // Optional override from model select
    const override = {}
    const sel = wrap.querySelector('#shu-model')
    if (sel && sel.value) override.modelPrimary = sel.value

    chrome.runtime.sendMessage(
      { type: 'OPENROUTER_CHAT', payload: { messages, override } },
      (resp) => {
        try {
          if (!resp || !resp.ok) throw new Error(resp?.error || 'Bilinmeyen hata')
          const content = String(resp.content || '')
          const parsed = parseMaybeJSON(content)
          const data = parsed.data || {
            risk: 'medium',
            summary: normalizePlain(content).slice(0, 240),
            reason: 'Serbest metin',
          }
          const riskStr = String(data.risk || '').toLowerCase()
          const scoreMap = { low: 33, medium: 66, high: 100 }
          const riskScore = scoreMap[riskStr] ?? 50
          chrome.storage.local.get(['SENSITIVITY'], ({ SENSITIVITY }) => {
            const s = typeof SENSITIVITY === 'number' ? SENSITIVITY : 50
            const threshold = Math.max(0, Math.min(100, 100 - s)) // yüksek hassasiyet => düşük eşik
            if (riskScore < threshold) {
              titleEl.textContent = 'Risk: LOW'
              summaryEl.textContent = 'Seviye eşik altında'
              if (reasonEl) reasonEl.textContent = ''
              if (badgeEl) badgeEl.textContent = riskBadgeText('low')
              if (metaEl) metaEl.textContent = resp?.model ? `Model: ${resp.model}` : ''
              updateDetails(wrap, { url, model: resp?.model || '', data })
              colorizeByRisk(wrap, 'low')
            } else {
              const riskUp = String(data.risk || 'unknown').toUpperCase()
              titleEl.textContent = `Risk: ${riskUp}`
              summaryEl.textContent = data.summary || ''
              if (reasonEl) reasonEl.textContent = data.reason ? '• ' + data.reason : ''
              if (badgeEl) badgeEl.textContent = riskBadgeText(riskStr)
              if (metaEl) metaEl.textContent = resp?.model ? `Model: ${resp.model}` : ''
              if (rawEl) renderRaw(rawEl, { url, model: resp?.model || '', data })
              colorizeByRisk(wrap, riskStr)
            }

            // write cache
            if (cacheTtl > 0) {
              sessionSet(cacheKey, {
                ts: Date.now(),
                data,
                model: resp?.model || '',
              })
            }
          })
        } catch (e) {
          titleEl.textContent = 'Analiz hatası'
          summaryEl.textContent = String(e)
          if (reasonEl) reasonEl.textContent = ''
          if (badgeEl) badgeEl.textContent = '⚠️ Hata'
          colorizeByRisk(wrap, 'medium')
        }
      },
    )
  }
})()
