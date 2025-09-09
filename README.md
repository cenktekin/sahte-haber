# Sahte Haber ve Dolandırıcılık Girişimi Uyarıcı Tarayıcı Eklentisi

## Proje Tanımı
Bu proje, özellikle yaşlı kullanıcılar için tasarlanmış bir tarayıcı eklentisidir. Eklenti, ziyaret edilen web sitelerindeki sahte haberleri ve dolandırıcılık girişimlerini tespit ederek kullanıcıları görsel ve işitsel olarak uyarır. Amaç, savunmasız kullanıcıları çevrimiçi tehditlerden korumak ve daha güvenli bir internet deneyimi sunmaktır.

## Temel Özellikler
- Gerçek Zamanlı Analiz: Ziyaret edilen web sayfalarının içeriğini gerçek zamanlı olarak analiz ederek sahte haber ve dolandırıcılık belirtilerini tespit etme.
- Görsel Uyarılar: Şüpheli içerik tespit edildiğinde kullanıcıyı uyaran belirgin görsel uyarılar.
- İşitsel Uyarılar: Görsel uyarılara ek olarak, kullanıcının dikkatini çekmek için işitsel uyarılar.
- Güvenilirlik Derecelendirmesi: Web sitelerine ve haber kaynaklarına güvenilirlik derecelendirmesi atama ve gösterme.
- Kullanıcı Tarafından Bildirme: Kullanıcıların şüpheli içerikleri manuel olarak bildirmesi.
- Özelleştirilebilir Ayarlar: Uyarı hassasiyeti, görsel ve işitsel uyarı tercihleri gibi kullanıcı tarafından özelleştirilebilir ayarlar.
- Veritabanı Güncellemesi: Sahte haber ve dolandırıcılık örneklerini içeren veritabanını düzenli olarak güncelleme.
- Gizlilik Odaklı Tasarım: Kullanıcı verilerinin gizliliğini koruma ve minimum veri toplama.

## Teknoloji Yığını (Güncel)
- Chrome Extension (Manifest v3): `background.js` (service worker), `content.js` (overlay), `popup.html/js` (ayarlar)
- OpenRouter Chat API: Model tabanlı analiz (dinamik model listesi, birincil + yedek model)
- Web (opsiyonel geliştirme ortamı): Next.js + Turbopack, React 19, TypeScript, TailwindCSS
- Lint/Format: ESLint (Flat Config) + Prettier

## Anahtar Bileşenler (MV3)
- `content.js` – Sayfaya enjekte edilen overlay. Minimal Glass arayüzü, risk rozetleri, Detay/JSON görünümü, kopyalama, manuel mod, konum/tema, minimize ve geçici “Model seç” override.
- `background.js` – OpenRouter API çağrıları, birincil→yedek fallback, model listesi (`OPENROUTER_MODELS`) ve son kullanılan model (`LAST_MODEL`) yönetimi.
- `popup.html/js` – Ayarlar paneli. API anahtarı, birincil/yedek model, dinamik model listesi (arama, “yalnız free” filtresi), favoriler, hassasiyet, alan adı filtresi ve cache, panel/tema davranışı.

## Kullanıcı Deneyimi (UX) Hususları
- Basit ve sezgisel arayüz; büyük ve okunabilir yazı tipleri.
- Net ve eyleme dönük uyarılar.
- Erişilebilirlik (renk körlüğü vb. için uygun kontrast ve ARIA).
- Performans: Hızlı ve düşük kaynak tüketimi.

## Gizlilik ve Güvenlik
- Gizlilik odaklı tasarım, minimum veri toplama.
- Toplanan verilerin güvenli saklanması ve yetkisiz erişime karşı korunması.

## Dokümantasyon
- Gereksinimler: [docs/requirements.md](docs/requirements.md)
- Tasarım: [docs/design.md](docs/design.md)
- Görevler/Yol Haritası: [docs/tasks.md](docs/tasks.md)

## Durum
Çalışır bir MV3 eklenti prototipi mevcuttur. Overlay, manuel mod ve alan adı/önbellek politikaları uygulanmış; OpenRouter entegrasyonu dinamik model listesi, favoriler ve tek-seferlik model override ile zenginleştirilmiştir. Ayrıntılar için [docs/tasks.md](docs/tasks.md).

## Geliştirme

- Web uygulaması dizini: `web/`
- Temel komutlar (web/ klasöründe):
  - `npm run dev` – Next.js geliştirme sunucusu
  - `npm run lint` – ESLint kontrolü
  - `npm run typecheck` – TypeScript tür kontrolü
  - `npm run format:check` / `npm run format` – Prettier kontrolü / düzeltme

## Tarayıcı Eklentisi (Manifest v3)

- Eklenti dosyaları: `web/extension/`
- İçerik script’i (`content.js`) Minimal Glass bir overlay oluşturur, risk/özet/gerekçe gösterir.
- Overlay özellikleri: Detay/JSON görünümü, kopyalama, Esc ile kapatma, konum/tema/minimize, manuel analiz modu, tek-seferlik “Model seç” override.
- Alan adı filtresi (NEWS_ONLY + izinli liste) ve oturum önbelleği (CACHE_TTL) ile gereksiz çağrılar azaltılır.

### Eklentiyi yükleme (Chrome/Edge)

1. Chrome’da `chrome://extensions` sayfasını açın.
2. Sağ üstten “Geliştirici modu”nu açın.
3. “Paketlenmemiş öğe yükle” > `web/extension/` klasörünü seçin.
4. Her değişiklikten sonra sayfadan “Yenile” butonu ile eklentiyi yenileyin.

### Derleme klasörüne kopyalama (opsiyonel)

- `web/` klasöründe:
  - `npm run build:ext` — `extension` içeriğini `web/dist/extension/` altına kopyalar.

## DEBUG Yardımcıları

- `web/src/lib/debug.ts` içinde `DEBUG` bayrağı ve `dlog(...)` fonksiyonu bulunur.
- Geçici olarak tarayıcıda: `window.APP_DEBUG = true` yaparak etkinleştirebilirsiniz.

## OpenRouter Entegrasyonu

- Varsayılan: `openai/gpt-oss-120b:free` (birincil) ve `google/gemini-2.5-flash-lite` (yedek). Hata halinde otomatik fallback.
- Popup, `OPENROUTER_MODELS` ile dinamik model listesini çeker; arama ve “yalnız free” filtresi vardır.
- Favoriler: `FAVORITE_MODELS` olarak saklanır; “Son kullanılan model” `LAST_MODEL` ile hatırlanır ve varsayılanda önceliklenir.
- Overlay’deki “Model seç” menüsü yalnız ilgili analiz çağrısını geçici olarak seçilen modelle yapar (kalıcı ayarı etkilemez).
- API anahtarınız `chrome.storage.local`’da saklanır; analiz sonuçları `chrome.storage.session` üzerinde TTL (varsayılan 300 sn) ile önbelleğe alınır.

### Ayarlama
1. Eklentiyi yükledikten sonra popup’ı açın.
2. “OpenRouter Ayarları” bölümünde:
   - “API Key” alanına OpenRouter anahtarınızı girin (ör. `sk-or-...`).
   - “Birincil Model” ve “Yedek Model” alanlarını dinamik listeden seçin; arama ve “yalnız free” filtresini kullanabilirsiniz. Favori kutularıyla favorilere ekleyin.
   - “Kaydet”e basın.
3. “Test” butonuyla bir deneme çağrısı yapabilirsiniz. Çıktı aşağıdaki `out` panelinde listelenir.

Notlar:
- background service worker, birincil modelde hata oluşursa otomatik olarak fallback modele yeniden dener ve kullanılan modeli `LAST_MODEL` olarak kaydeder.
- content script, sayfa metnini 8000 karaktere kadar kırpar; alan adı filtresi ve oturum önbelleği (CACHE_TTL) uygular.
- Manuel mod açıkken analiz yalnızca “Analiz et” ile başlatılır; panel konumu/tema ve minimize davranışı ayarlardan yönetilir. 
