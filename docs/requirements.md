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
