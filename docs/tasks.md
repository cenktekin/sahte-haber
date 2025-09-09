# Görevler ve Uygulama Planı

## Durum Özeti (Güncel)
 - [x] MV3 eklenti prototipi çalışıyor (overlay + background + popup).
 - [x] Minimal Glass UI (nötr arka plan, blur, outline; risk rengi sol şerit/rozet).
 - [x] Manuel analiz modu (otomatik kapalı, "Analiz et" ile tetik).
 - [x] Panel ayarları: konum, minimize, tema/aksan.
 - [x] Alan adı filtresi: NEWS_ONLY + DOMAIN_ALLOWLIST.
 - [x] Önbellek: analiz sonuçları `chrome.storage.session` üzerinde `CACHE_TTL` sn.
 - [x] Dinamik model listesi (`OPENROUTER_MODELS`), arama + "yalnız free" filtresi.
 - [x] Favoriler (`FAVORITE_MODELS`) ve son kullanılan (`LAST_MODEL`).
 - [x] Overlay'de tek seferlik "Model seç" override.
 - [x] Model listesi 10 dk TTL ile session cache.
 - [x] JSON/Detay panelleri, kopyalama, Esc ile kapatma, odak halkaları.

## Güncel Sprint (1–2 hafta)

Sprint Goal: Overlay ve popup üzerinde model seçimi/tercihleriyle akıcı bir deneyim; görsel ve erişilebilirlik polish.

### In Progress
- [ ] Model aramada debounce (250 ms) ve favorileri listede en üste alma.
- [ ] Overlay buton/select mikro hover/active animasyonları (reduced-motion’a saygı).

### Next
- [ ] Paneli sürüklenebilir yapmak (başlıktan drag-n-drop) ve tek satır rozete minimize/expand mikro etkileşimleri.
- [ ] Favori modelleri overlay "Model seç" menüsünde üstte sıralama.
- [ ] Lint/format temizliği ve küçük Prettier satır kırma uyarılarının giderilmesi.
- [ ] Basit e2e akış testi: manuel modda tetikleme + cache hit + model override doğrulaması.
- [ ] Paketleme ve mağaza ön kontrol listesi (gizlilik beyanı, ikonlar, kısa açıklama).

### Done (son iterasyon)
- [x] `background.js`: `OPENROUTER_MODELS` + 10 dk session TTL cache.
- [x] `background.js`: Birincil→Yedek fallback, `LAST_MODEL` yazımı.
- [x] `popup.js`: Dinamik model listesi, arama, "yalnız free", favoriler; Kaydet’te session temizleme.
- [x] `content.js`: Minimal Glass, Detay/JSON ayrımı, model override select, odak halkaları.
- [x] JSON ham çıktının düzgün girintilenmesi ve meta (url, model) ile gösterimi.

## Sprint Planı (2 hafta/sprint)

Notlar:
- WIP ≤ 3 kuralı uygulanır; görevler atomik tutulur.
- DEBUG günlükleri kapalı varsayılan; sadece inceleme sırasında etkinleştirilir.
- Hiçbir sır/máhrem bilgi repoya koyulmaz (.env, secret manager).

### Sprint 1 — Proje ve Eklenti İskeleti
Hedef: Çalışır bir Next.js tabanı, Manifest v3 eklenti iskeleti ve temel UI iskeleti.

Görevler:
- [ ] Next.js + TypeScript + ESLint + Prettier yapılandırması (repo hijyeni).
- [ ] Tailwind CSS ve ShadCN UI kurulumu; temel tema ve buton/alert bileşenleri.
- [ ] Manifest v3 ile eklenti iskeleti: background service worker, content script, popup.
- [ ] UyarıPaneli için placeholder overlay (content script ile sayfaya enjekte).
- [ ] CI: GitHub Actions (lint + build) pipeline’ı.
- [ ] Geliştirici deneyimi: dlog/DEBUG bayrağı (README’ye kullanım notu).
- [ ] Dokümantasyon: README kurulum/çalıştırma; ADR: “Eklenti + Next.js mimarisi”.

Bağımlılıklar:
- ShadCN UI ve Tailwind, Next.js kurulumuna bağlıdır.
- Overlay için content script hazır olmalıdır.

DoD/AC:
- Proje local’de build eder; eklenti Chrome’da yüklenir ve “hello overlay” görünür.
- Lint/format temiz geçer; CI yeşildir.
- README güncel; DEBUG varsayılan kapalıdır.

### Sprint 2 — Veri Katmanı ve Temel Özellikler
Hedef: Firestore entegrasyonu, veri modelleri ve ilk kullanıcı akışları.

Görevler:
- [ ] Firebase Firestore entegrasyonu; .env.example ve güvenli config akışı.
- [ ] Veri modelleri: SahteHaber, DolandiricilikGirisimi, KullaniciBildirimi (tipler/interface’ler).
- [ ] Kullanıcı Bildirim Formu: content script/popup üzerinden gönderim; Firestore’a yazma.
- [ ] GüvenilirlikGöstergesi: sahte skor/placeholder ile temel gösterge.
- [ ] AyarlarPaneli iskeleti: hassasiyet ve uyarı türleri için toggle’lar (persist local).
- [ ] Gizlilik notu ve veri minimizasyonu dokümantasyonu.

Bağımlılıklar:
- Sprint 1 tamamlanmış temel UI ve eklenti iskeleti.
- Firestore erişim anahtarlarının güvenli yönetimi.

DoD/AC:
- Firestore’a başarılı okuma/yazma; hata yönetimi ve basit retry.
- Bildirim gönderimleri koleksiyona düşer; temel gösterge görünür.
- Ayarlar local’de kalıcıdır; DEBUG kapalıyken gürültü yok.
- Dokümantasyon günceldir (README, ADR veri katmanı kararı).

### Sprint 3 — Analiz, Uyarılar ve Performans
Hedef: İçerik analizi hattı, görsel/işitsel uyarılar ve temel performans iyileştirmeleri.

Görevler:
- [ ] İçerik çıkarımı: content script sayfa metnini çıkarır ve arka plana iletir.
- [ ] API katmanı: Next.js API route; analiz isteği/yanıt sözleşmesi.
- [ ] Genkit entegrasyonu (isim/kontrat sabit; anahtarlar env üzerinden).
- [ ] Görsel uyarılar: belirgin ama erişilebilir overlay; ARIA ve kontrast.
- [ ] İşitsel uyarılar: sessize alma ve seviye ayarı; kullanıcı tercihine saygı.
- [ ] Ayarlar hassasiyetinin analiz eşiğine etkisi; debounce/throttle.
- [ ] Temel manuel akış testleri ve hataların giderilmesi.

Bağımlılıklar:
- Sprint 2 veri ve ayar altyapısı.

DoD/AC:
- Şüpheli içerikte görsel+işitsel uyarılar tetiklenir; kullanıcı kontrol edebilir.
- Performans kabul edilebilir (kayda değer yavaşlama yok); throttle/debounce etkin.
- Loglar temiz ve seviyeli; DEBUG kapalı durumda sessiz.
- Yayın hazırlığı: mağaza gereklilikleri kontrol listesi, gizlilik beyanı taslağı.

Daha fazla detay için: Gereksinimler belgesi (docs/requirements.md) ve Tasarım belgesi (docs/design.md).
