# Chrome Web Mağazası Listeleme Taslağı

## Kısa Açıklama
Sahte haber/dolandırıcılık şüphesini anında değerlendirip uyarır. Minimal, erişilebilir ve gizlilik odaklı.

## Uzun Açıklama
Sahte Haber Uyarıcısı, ziyaret ettiğiniz sayfalardaki içeriği hızlıca analiz eder ve şüpheli durumlarda görsel bir uyarı gösterir. Minimal Glass tasarımıyla gözü yormaz, erişilebilirlik odaklıdır ve gizlilik ilkesine uygun çalışır.

### Öne Çıkan Özellikler
- Minimal Glass overlay: Koyu nötr arka plan, hafif blur, sol kenarda risk şeridi ve rozet.
- Risk seviyeleri: LOW / MEDIUM / HIGH — rozet ve başlıkta belirgin gösterim.
- Detay / JSON görünümü: Özet ve gerekçe ya da ham JSON verisini tek tıkla görün.
- Dinamik model listesi: OpenRouter `/models` ile güncel modeller; arama ve "yalnız free" filtresi.
- Favoriler ve son kullanılan: Sık kullandıklarınızı yıldızlayın; son kullanılan model otomatik hatırlanır.
- Tek seferlik model seçimi: Overlay içindeki "Model seç" ile kalıcı ayarı bozmadan farklı bir modeli deneyin.
- Manuel mod: İsterseniz analiz sadece siz tetiklediğinizde yapılır.
- Alan adı filtresi ve oturum önbelleği: Gereksiz çağrılar azaltılır (CACHE_TTL ile ayarlanabilir).
- Erişilebilirlik: Klavye ile kullanım, odak halkaları, Esc ile kapama, ARIA etiketleri.

### Nasıl Çalışır?
- İçerik betiği (content script) sayfadaki görünür metni alır (8000 karaktere kadar) ve arka plana iletir.
- Arka plan servis çalışanı (service worker), OpenRouter Chat API'ye çağrı yapar:
  - Birincil model başarısız olursa yedek modele otomatik düşer.
  - Kullanılan model `LAST_MODEL` olarak yerelde kaydedilir.
- Yanıt JSON'u overlay üzerinde gösterilir; Detay/JSON butonlarıyla görünümü değiştirebilirsiniz.

### İzinler (Permissions)
- `storage`: Ayarlar (API anahtarı, modeller, favoriler, tercihleri) yerelde saklanır.
- `tabs`: Etkin sekme URL bilgisini okumak için kullanılır (analiz ve önbellek anahtarı).
- `host_permissions`: `https://openrouter.ai/*` — OpenRouter API'ye çağrı yapmak için.
- `content_scripts` `<all_urls>`: Uyarı overlay'ini sayfalara enjekte etmek için.

### Gizlilik
- Kişisel veri toplamayız. API anahtarınız yalnızca tarayıcıda, `chrome.storage.local` içinde saklanır.
- Sayfa metni sadece anlık analiz için işlenir ve oturum önbelleği (`chrome.storage.session`) kullanılır.
- DEBUG varsayılan olarak kapalıdır; gürültülü loglar yoktur.

### Ekran Görüntüleri Önerisi
1. Overlay — "LOW" görünümü (yeşil şerit/rozet).
2. Overlay — "MEDIUM" görünümü (amber şerit/rozet).
3. Overlay — "HIGH" görünümü (kırmızı şerit/rozet).
4. Popup — OpenRouter Ayarları: model arama + "yalnız free" filtresi + favoriler.
5. Overlay — "Model seç" açılır menüsü ve Detay/JSON paneli.

### Sürüm Notu
Bu sürüm bir prototiptir (v0.1.0). Geri bildirimleriniz doğrultusunda özellikler geliştirilecektir.
