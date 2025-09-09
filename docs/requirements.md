# Gereksinimler

## Giriş
Bu belge, Sahte Haber ve Dolandırıcılık Girişimi Uyarıcı Tarayıcı Eklentisi projesi için gereksinimleri detaylandırmaktadır. Projenin amacı, özellikle yaşlı kullanıcıları çevrimiçi sahte haberlerden ve dolandırıcılık girişimlerinden korumaktır.

## Gereksinimler

### Gereksinim 1: Gerçek Zamanlı Analiz
**User Story:** Bir kullanıcı olarak, ziyaret ettiğim web sayfalarının gerçek zamanlı olarak analiz edilmesini istiyorum, böylece sahte haber ve dolandırıcılık girişimlerinden haberdar olayım.

#### Kabul Kriterleri
1. WHEN kullanıcı bir web sayfasını ziyaret eder, THEN eklenti sayfa içeriğini otomatik olarak analiz etmelidir.
1. WHEN sahte haber veya dolandırıcılık belirtileri tespit edilirse, THEN sistem uyarı vermelidir.
1. WHEN analiz tamamlanırsa, THEN kullanıcının performansı etkilenmemelidir.

### Gereksinim 2: Görsel Uyarılar
**User Story:** Bir kullanıcı olarak, şüpheli içerik tespit edildiğinde belirgin görsel uyarılar görmek istiyorum, böylece dikkatimi çeksin ve tehlikeden haberdar olayım.

#### Kabul Kriterleri
1. WHEN şüpheli içerik tespit edilirse, THEN sayfa üzerinde belirgin bir uyarı mesajı veya simge belirmelidir.
1. WHEN görsel uyarı görüntülenirse, THEN kullanıcı uyarıyı kolayca fark etmelidir.
1. WHEN uyarı mesajı görüntülenirse, THEN mesaj açık ve anlaşılır olmalıdır.

### Gereksinim 3: İşitsel Uyarılar
**User Story:** Bir kullanıcı olarak, görsel uyarılara ek olarak işitsel uyarılar duymak istiyorum, böylece dikkatimi daha da çeksin ve tehlikeden haberdar olayım.

#### Kabul Kriterleri
1. WHEN şüpheli içerik tespit edilirse, THEN görsel uyarılara ek olarak bir uyarı sesi çalınmalıdır.
1. WHEN uyarı sesi çalarsa, THEN ses yüksek ve belirgin olmalıdır.
1. WHEN uyarı sesi çalarsa, THEN kullanıcı sesin ne anlama geldiğini bilmelidir.

### Gereksinim 4: Güvenilirlik Derecelendirmesi
**User Story:** Bir kullanıcı olarak, web sitelerinin ve haber kaynaklarının güvenilirlik derecelendirmesini görmek istiyorum, böylece hangi kaynaklara güvenebileceğimi bileyim.

#### Kabul Kriterleri
1. WHEN kullanıcı bir web sitesini ziyaret ederse, THEN eklenti sitenin güvenilirlik derecesini göstermelidir.
1. WHEN bir haber kaynağı görüntülenirse, THEN haber kaynağının güvenilirlik derecesi gösterilmelidir.
1. WHEN güvenilirlik derecesi görüntülenirse, THEN derecelendirme kaynağı belirtilmelidir.

### Gereksinim 5: Kullanıcı Tarafından Bildirme
**User Story:** Bir kullanıcı olarak, şüpheli içerikleri manuel olarak bildirebilmek istiyorum, böylece diğer kullanıcıları da koruyabileyim.

#### Kabul Kriterleri
1. WHEN kullanıcı şüpheli bir içerik görürse, THEN içeriği bildirme seçeneği sunulmalıdır.
1. WHEN kullanıcı bir içerik bildirirse, THEN bildirim sistemi tarafından alınmalı ve kaydedilmelidir.
1. WHEN bir içerik bildirildikten sonra, THEN yetkililer bildirimi incelemelidir.

### Gereksinim 6: Özelleştirilebilir Ayarlar
**User Story:** Bir kullanıcı olarak, uyarı hassasiyeti, görsel ve işitsel uyarı tercihleri gibi ayarları özelleştirebilmek istiyorum, böylece eklentiyi kendi ihtiyaçlarıma göre ayarlayabileyim.

#### Kabul Kriterleri
1. WHEN kullanıcı ayarlar paneline erişirse, THEN uyarı hassasiyetini ayarlayabilmelidir.
1. WHEN kullanıcı ayarlar paneline erişirse, THEN görsel ve işitsel uyarı tercihlerini değiştirebilmelidir.
1. WHEN kullanıcı ayarları kaydederse, THEN ayarlar uygulanmalıdır.

### Gereksinim 7: Veritabanı Güncellemesi
**User Story:** Bir kullanıcı olarak, sahte haber ve dolandırıcılık örneklerini içeren veritabanının düzenli olarak güncellendiğinden emin olmak istiyorum, böylece eklenti güncel tehditlere karşı etkili olsun.

#### Kabul Kriterleri
1. WHEN yeni sahte haberler veya dolandırıcılık girişimleri tespit edilirse, THEN veritabanı güncellenmelidir.
1. WHEN veritabanı güncellenirse, THEN eklenti yeni tehditleri tanımalıdır.
1. WHEN veritabanı güncellenirse, THEN performans etkilenmemelidir.

### Gereksinim 8: Gizlilik Odaklı Tasarım
**User Story:** Bir kullanıcı olarak, verilerimin gizliliğinin korunduğundan ve minimum veri toplandığından emin olmak istiyorum, böylece gizliliğime saygı duyulsun.

#### Kabul Kriterleri
1. WHEN eklenti çalışırsa, THEN minimum veri toplanmalıdır.
1. WHEN veri toplanırsa, THEN veri güvenli bir şekilde saklanmalıdır.
1. WHEN kullanıcı verileri talep ederse, THEN kullanıcıya verileri verilmelidir.

### Gereksinim 9: Manuel Analiz Modu
**User Story:** Bir kullanıcı olarak, analizlerin yalnızca ben istersem çalışmasını istiyorum, böylece gereksiz çağrıları ve dikkat dağınıklığını önleyeyim.

#### Kabul Kriterleri
1. WHEN Manuel Mod açıksa, THEN otomatik analiz yapılmamalıdır.
1. WHEN kullanıcı “Analiz et”e tıklarsa, THEN analiz başlatılmalıdır.
1. WHEN manuel mod aktifse, THEN panel bu durumu net mesaj ve buton ile göstermelidir.

### Gereksinim 10: Alan Adı Filtresi ve Önbellek (CACHE_TTL)
**User Story:** Bir kullanıcı olarak, yalnızca haber sitelerinde çalışmasını ve gereksiz tekrar çağrıların önlenmesini istiyorum.

#### Kabul Kriterleri
1. WHEN NEWS_ONLY açıksa, THEN sadece haber/doğrulama sitelerinde çalışmalıdır.
1. WHEN DOMAIN_ALLOWLIST tanımlıysa, THEN sadece listelenen alan adlarında analiz yapılmalıdır.
1. WHEN CACHE_TTL > 0 ise, THEN aynı URL için sonuçlar oturumda TTL süresince kullanılmalıdır.

### Gereksinim 11: Dinamik Model Listesi
**User Story:** Bir kullanıcı olarak, OpenRouter’daki modellerin güncel listesini görüp seçim yapabilmek istiyorum.

#### Kabul Kriterleri
1. WHEN popup açılırsa, THEN model listesi OpenRouter `/models` üzerinden çekilmelidir.
1. THEN liste en az `id`, `name` ve `free` bilgisini içermelidir.
1. THEN model listesi 10 dakika süreyle `storage.session` üzerinde cache’lenmelidir.

### Gereksinim 12: Favoriler ve Son Kullanılan Model
**User Story:** Bir kullanıcı olarak, sık kullandığım modelleri favorileyebilmek ve eklentinin son kullandığımı hatırlamasını istiyorum.

#### Kabul Kriterleri
1. WHEN kullanıcı favori işaretlerse, THEN `FAVORITE_MODELS` altında kalıcı olarak saklanmalıdır.
1. WHEN bir analiz başarıyla sonuçlanırsa, THEN kullanılan model `LAST_MODEL` olarak saklanmalıdır.
1. WHEN popup açılırsa, THEN birincil model seçiminde `LAST_MODEL` önceliklendirilebilir.

### Gereksinim 13: Tek Seferlik Model Override (Overlay)
**User Story:** Bir kullanıcı olarak, kalıcı ayarı değiştirmeden tek bir analiz için farklı model seçebilmek istiyorum.

#### Kabul Kriterleri
1. WHEN overlay üzerindeki “Model seç”ten bir değer seçilirse, THEN yalnızca o çağrıda bu model kullanılmalıdır.
1. THEN kalıcı birincil/yedek model ayarları değişmemelidir.

### Gereksinim 14: Panel Davranışları (Konum, Tema, Minimize)
**User Story:** Bir kullanıcı olarak, panelin konumunu/temasını ayarlamak ve minimal görünümle çalışmak istiyorum.

#### Kabul Kriterleri
1. THEN panel konumu `top-right/top-left/bottom-right/bottom-left` seçeneklerini desteklemelidir.
1. THEN tema/aksan panelin outline ve rozetlerinde yansıtılmalıdır (arka plan nötr kalabilir).
1. THEN minimize aktifken içerik/aksiyon bölümü gizlenebilir; manuel modda analiz butonu erişilebilir kalmalıdır.

### Gereksinim 15: Erişilebilirlik
**User Story:** Bir kullanıcı olarak, klavyeyle paneli kullanabilmek, odak halkalarını görebilmek ve Esc ile kapatabilmek istiyorum.

#### Kabul Kriterleri
1. THEN buton ve seçim kutuları klavyeyle erişilebilir ve belirgin odak halkasına sahip olmalıdır.
1. THEN Esc ile panel kapatılabilmelidir.
1. THEN ARIA nitelikleri (rol, aria-label) uygun şekilde tanımlanmalıdır.

### Gereksinim 16: Minimal Glass UI
**User Story:** Bir kullanıcı olarak, göz yormayan modern bir arayüz istiyorum.

#### Kabul Kriterleri
1. THEN panel koyu nötr arka plan, hafif blur (`backdrop-filter`) ve ince outline ile görünmelidir.
1. THEN risk rengi sol şerit ve rozet üzerinden gösterilmelidir.
1. THEN Detay ve JSON görünümleri ayrı butonlarla açılıp kapanmalıdır.
