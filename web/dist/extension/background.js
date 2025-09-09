/* Background Service Worker (MV3) */
/* global chrome */

const DEFAULT_PRIMARY = 'openai/gpt-oss-120b:free'
const DEFAULT_FALLBACK = 'google/gemini-2.5-flash-lite'

chrome.runtime.onInstalled.addListener(async () => {
  const current = await chrome.storage.local.get([
    'OPENROUTER_API_KEY',
    'OPENROUTER_MODEL_PRIMARY',
    'OPENROUTER_MODEL_FALLBACK',
  ])
  const patch = {}
  if (typeof current.OPENROUTER_MODEL_PRIMARY === 'undefined')
    patch.OPENROUTER_MODEL_PRIMARY = DEFAULT_PRIMARY
  if (typeof current.OPENROUTER_MODEL_FALLBACK === 'undefined')
    patch.OPENROUTER_MODEL_FALLBACK = DEFAULT_FALLBACK
  if (Object.keys(patch).length) await chrome.storage.local.set(patch)
})

async function callOpenRouter({ apiKey, model, messages }) {
  const url = 'https://openrouter.ai/api/v1/chat/completions'
  const toASCII = (s) => String(s).replace(/[^\x00-\x7F]/g, '')
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'X-Title': toASCII('Sahte Haber Uyarıcısı'), // non-ASCII karakterleri temizle
    // 'HTTP-Referer': 'https://example.com', // İsterseniz referer ekleyebiliriz
  }
  const body = JSON.stringify({
    model,
    messages,
  })
  const res = await fetch(url, { method: 'POST', headers, body })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenRouter ${res.status}: ${text}`)
  }
  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content ?? ''
  return { content, raw: data }
}

async function fetchOpenRouterModels(apiKey) {
  const CACHE_KEY = 'OR_MODELS_CACHE'
  const TTL_MS = 10 * 60 * 1000 // 10 minutes
  try {
    const cached = await chrome.storage.session.get([CACHE_KEY])
    const entry = cached?.[CACHE_KEY]
    if (entry && typeof entry.ts === 'number' && Date.now() - entry.ts < TTL_MS) {
      return Array.isArray(entry.items) ? entry.items : []
    }
  } catch {}

  const url = 'https://openrouter.ai/api/v1/models'
  const headers = {}
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`Models ${res.status}`)
  const data = await res.json()
  // Normalize: id ve name döndür
  const items = (data?.data || data?.models || [])
    .map((m) => {
      const id = m?.id || m?.name
      const name = m?.name || m?.id || ''
      const free = /:free\b/i.test(String(id)) || /:free\b/i.test(String(name))
      return { id, name, free }
    })
    .filter((x) => x.id)
  try {
    await chrome.storage.session.set({ [CACHE_KEY]: { ts: Date.now(), items } })
  } catch {}
  return items
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'PING') {
    sendResponse({ ok: true, pong: Date.now() })
    return true
  }

  if (message?.type === 'OPENROUTER_CHAT') {
    ;(async () => {
      try {
        const { messages, override } = message.payload || {}
        const { OPENROUTER_API_KEY, OPENROUTER_MODEL_PRIMARY, OPENROUTER_MODEL_FALLBACK } =
          await chrome.storage.local.get([
            'OPENROUTER_API_KEY',
            'OPENROUTER_MODEL_PRIMARY',
            'OPENROUTER_MODEL_FALLBACK',
          ])

        const apiKey = override?.apiKey || OPENROUTER_API_KEY
        const primary = override?.modelPrimary || OPENROUTER_MODEL_PRIMARY || DEFAULT_PRIMARY
        const fallback = override?.modelFallback || OPENROUTER_MODEL_FALLBACK || DEFAULT_FALLBACK

        if (!apiKey) throw new Error('OpenRouter API key eksik. Popup üzerinden kaydedin.')
        if (!Array.isArray(messages) || !messages.length)
          throw new Error('messages boş olmamalı. [{ role, content }] beklenir.')

        try {
          const r1 = await callOpenRouter({ apiKey, model: primary, messages })
          try {
            await chrome.storage.local.set({ LAST_MODEL: primary })
          } catch {}
          sendResponse({ ok: true, model: primary, ...r1 })
        } catch (err) {
          try {
            const r2 = await callOpenRouter({ apiKey, model: fallback, messages })
            try {
              await chrome.storage.local.set({ LAST_MODEL: fallback })
            } catch {}
            sendResponse({
              ok: true,
              model: fallback,
              ...r2,
              fallback: true,
              errorPrimary: String(err),
            })
          } catch (err2) {
            sendResponse({ ok: false, error: String(err2) })
          }
        }
      } catch (e) {
        sendResponse({ ok: false, error: String(e) })
      }
    })()
    return true
  }

  if (message?.type === 'OPENROUTER_MODELS') {
    ;(async () => {
      try {
        const { OPENROUTER_API_KEY } = await chrome.storage.local.get(['OPENROUTER_API_KEY'])
        const models = await fetchOpenRouterModels(OPENROUTER_API_KEY)
        sendResponse({ ok: true, models })
      } catch (e) {
        sendResponse({ ok: false, error: String(e) })
      }
    })()
    return true
  }
})
