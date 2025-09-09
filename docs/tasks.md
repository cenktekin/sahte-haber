# Görevler ve Uygulama Planı

- [ ] Next.js projesi oluştur ve temel bileşenleri kur.
- [ ] Firebase Firestore'u projeye entegre et.
- [ ] SahteHaberler, DolandiricilikGirisimleri ve KullaniciBildirimleri koleksiyonlarını Firebase'de oluştur.
- [ ] UyarıPaneli React bileşenini geliştir.
  - _İlgili gereksinimler: Görsel Uyarılar, İşitsel Uyarılar_
- [ ] GüvenilirlikGöstergesi React bileşenini geliştir.
  - _İlgili gereksinimler: Güvenilirlik Derecelendirmesi_
- [ ] AyarlarPaneli React bileşenini geliştir.
  - _İlgili gereksinimler: Özelleştirilebilir Ayarlar_
- [ ] BildirimFormu React bileşenini geliştir.
  - _İlgili gereksinimler: Kullanıcı Tarafından Bildirme_
- [ ] ArkaPlanServisi'ni (Next.js API Routes kullanarak) geliştir.
  - _İlgili gereksinimler: Gerçek Zamanlı Analiz, Veritabanı Güncellemesi_
- [ ] Genkit'i entegre ederek AI modellerini sahte haber ve dolandırıcılık tespiti için kullan.
  - _İlgili gereksinimler: Gerçek Zamanlı Analiz_
- [ ] Chrome Extension API veya benzeri bir API kullanarak tarayıcı eklentisini geliştir.
- [ ] Kullanıcı arayüzünü (ShadCN UI ve Tailwind CSS) tasarla ve geliştir.
  - _İlgili gereksinimler: Basit ve Sezgisel Arayüz, Okunabilirlik, Net Uyarılar, Erişilebilirlik_
- [ ] Eklentinin performansını optimize et.
  - _İlgili gereksinimler: Performans_
- [ ] Eklentiyi test et ve hataları gider.
- [ ] Eklentiyi yayınla.

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
