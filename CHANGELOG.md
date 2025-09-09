# Changelog

## v0.1.0 — 2025-09-09

### Added
- MV3 eklenti prototipi: `background.js`, `content.js`, `popup.html/js`.
- Minimal Glass overlay: koyu nötr arka plan, blur, sol risk şeridi, rozet.
- Detay/JSON görünümleri, kopyalama, Esc ile kapama, odak halkaları.
- OpenRouter entegrasyonu: birincil + yedek model, hata halinde otomatik fallback.
- Dinamik model listesi: `/models` ile arama, "yalnız free" filtresi, favoriler, son kullanılan model (`LAST_MODEL`).
- Overlay tek seferlik model override (kalıcı ayarı etkilemeden çağrı modeli seçimi).
- Domain filtresi (`NEWS_ONLY` + `DOMAIN_ALLOWLIST`) ve analiz önbelleği (`CACHE_TTL`, session storage).
- Model listesi önbelleği: 10 dk `chrome.storage.session` TTL.
- Popup: favoriler üstte, arama 250 ms debounce.
- Paketleme script'leri: `npm run build:ext`, `npm run package:ext` (zip içinde manifest kökte).
- Dokümantasyon: README, requirements, design, tasks güncellendi; `STORE_LISTING.md` eklendi.

### Security & QA
- Gizli veri taraması: sonuç yok.
- `npm audit`: 0 zafiyet.
- Lint/format temiz.
