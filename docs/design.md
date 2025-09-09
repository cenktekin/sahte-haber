# Tasarım Dokümanı

## Genel Bakış
Bu doküman, Sahte Haber ve Dolandırıcılık Girişimi Uyarıcı Tarayıcı Eklentisi'nin teknik tasarımını açıklar. Tasarım, modüler ve ölçeklenebilir bir yaklaşıma dayanır.

## Mimari

```mermaid
flowchart LR
  subgraph MV3[Chrome Extension (MV3)]
    CS[content.js\nOverlay UI] -- runtime.message --> BG[background.js\nService Worker]
    PP[popup.html/js\nAyarlar] -- runtime.message --> BG
    BG -- storage.local/session --> ST[(Chrome Storage)]
  end
  BG -- HTTPS --> OR[(OpenRouter API)]
```

## Çekirdek Bileşenler
1. UyarıPaneli: Şüpheli içerik tespitinde uyarıları gösterir.
1. GüvenilirlikGöstergesi: Sitenin güvenilirlik derecesini gösterir.
1. AyarlarPaneli: Kullanıcı ayarlarını özelleştirir.
1. BildirimFormu: Şüpheli içerik bildirimini sağlar.
1. ArkaPlanServisi: Analiz ve veritabanı güncellemelerini yürütür.

## Veri Akışları

- İçerik çıkarımı: `content.js` görünür metni alır (8000 karaktere kadar), manuel mod ve domain filtresi kontrollerinden sonra `OPENROUTER_CHAT` mesajı gönderir.
- OpenRouter çağrısı: `background.js` birincil model ile dener, hata olursa yedek modele düşer; kullanılan modeli `LAST_MODEL` olarak yazar.
- Sonuç işleme: `content.js` dönen JSON’u parse eder, eşik/hassasiyet ile LOW/MEDIUM/HIGH kararı verir, overlay’i günceller. Detay/JSON panelleri doldurulur.
- Önbellek: Analiz sonuçları `chrome.storage.session` üzerinde `CACHE_TTL` saniye saklanır. Model listesi `OPENROUTER_MODELS` çağrısı, `storage.session` üzerinde 10 dk TTL ile cache’lenir.

## Ayarlar (chrome.storage.local)

- OPENROUTER_API_KEY: Kullanıcı anahtarı.
- OPENROUTER_MODEL_PRIMARY / OPENROUTER_MODEL_FALLBACK: Kalıcı model seçimleri.
- FAVORITE_MODELS: Kullanıcı favorileri.
- LAST_MODEL: En son başarılı çağrıda kullanılan model (background tarafından güncellenir).
- SENSITIVITY: 0–100 arası hassasiyet; eşik hesaplamasında kullanılır.
- NEWS_ONLY, DOMAIN_ALLOWLIST: Domain tabanlı kısıtlama.
- CACHE_TTL: Analiz sonucu için oturum önbellek süresi (sn).
- MANUAL_MODE, MINIMIZE_DEFAULT: Davranış ayarları.
- PANEL_POSITION, PANEL_ACCENT: Görsel/konum ayarları.

## UI/UX Notları

- Minimal Glass: koyu nötr arka plan + `backdrop-filter: blur()` ve ince kenar; risk rengi yalnız sol şerit ve rozet.
- Detay/JSON: ayrı düğmelerle aç/kapa; JSON monospace ve girintili.
- “Model seç” açılırı: tek seferlik override (kalıcı ayarı etkilemez).
- Erişilebilirlik: Esc ile kapatma, buton/select odak halkası, ARIA nitelikleri; klavye ile gezilebilirlik.

## Hata Yönetimi ve Performans

- Fallback zinciri: Birincil model hatasında otomatik yedek model denemesi.
- Başlık ASCII temizliği: OpenRouter `X-Title` başlığında ASCII dışı karakterler arındırılır.
- Kısıtlama ve küçültme: Metin 8000 karakter ile sınırlandırılır; domain filtresi ve manuel mod gereksiz çağrıları önler.
- Önbellek: `CACHE_TTL` (analiz) ve 10 dk (model listesi) ile ağ çağrıları azaltılır.

## Veri Modelleri
```typescript
interface SahteHaber {
  url: string;
  baslik: string;
  aciklama: string;
  kaynak: string;
  eklenmeTarihi: Date;
}

interface DolandiricilikGirisimi {
  url: string;
  baslik: string;
  aciklama: string;
  tur: string;
  eklenmeTarihi: Date;
}

interface KullaniciBildirimi {
  url: string;
  kullaniciId: string;
  aciklama: string;
  bildirimTarihi: Date;
}
```

## Güvenlik Hususları
- Kullanıcı verileri şifrelenmeli ve yetkisiz erişime karşı korunmalıdır.
- Kimlik doğrulama güvenli şekilde yapılmalı, hassas veriler korunmalıdır.
- Düzenli güvenlik açığı taramaları yapılmalıdır.
