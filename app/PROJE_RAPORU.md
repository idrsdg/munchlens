# SnapCal — AI Beslenme & Tarif Asistanı
## Proje Analiz Raporu (Mart 2026)

---

## 1. PROJE OZETI

**Ürün Adı:** SnapCal (öneri — değiştirilebilir)
**Slogan:** "Fotoğrafla, takip et, sağlıklı yaşa."
**Platform:** Web (önce) → iOS + Android (sonra)
**Model:** Freemium + Abonelik
**Hedef Kitle:** Global, 18-45 yaş, sağlıklı beslenmeye ilgi duyan bireyler
**Fiyat:** $0 (ücretsiz) / $4.99/ay / $29.99/yıl
**Dil:** Türkçe + İngilizce (MVP'de ikisi birden)

---

## 2. PAZAR DURUMU

| Metrik | Değer |
|--------|-------|
| Küresel AI beslenme pazarı (2026) | $2.7 milyar |
| 2033 tahmini | $5.37 milyar |
| Yıllık büyüme | %13.5 CAGR |
| Aktif tarif app kullanıcısı (dünya) | 1 milyar+ |
| Yummly kapandı | Aralık 2024 — boşluk açıldı |

### Rakip Analizi

| Uygulama | Fiyat | Zayıf Nokta |
|----------|-------|-------------|
| MyFitnessPal | $80/yıl | Karmaşık UI, barkod ücretli, eski tasarım |
| Cronometer | Ücretsiz/premium | Full-screen reklam = review bombing 2025 |
| Lose It! | $40/yıl | Barkod scanner ücretli yapıldı |
| Cal AI | Satın alındı | MyFitnessPal satın aldı (Mart 2026) |
| Noom | $60+/ay | Çok pahalı |
| Yummly | KAPANDI | — |

### Cal AI Referansı
17 yaşındaki bir kurucu aynı konsepti yaptı:
- 4 ayda $1M MRR
- Mart 2026'da MyFitnessPal ~$40M'a satın aldı
- Konsept doğrulanmış, pazar var

### Açık Nişler (Rakipsiz)
1. Türkçe gıda veritabanı — hiçbir app yok
2. GLP-1/Ozempic kullanıcıları için beslenme planı — büyüyen segment
3. Aile modu (farklı diyetler aynı uygulamada) — zayıf rakipler
4. Kültürel mutfak takibi (Türk, Orta Doğu, Güney Asya) — eksik

---

## 3. GELIR MODELI

### Fiyatlandırma Planları

| Plan | Fiyat | Limitler |
|------|-------|----------|
| Ücretsiz | $0/ay | Günde 1 fotoğraf analizi, günde 3 tarif önerisi, 7 günlük geçmiş |
| Pro Aylık | $4.99/ay | Sınırsız her şey, AI haftalık plan, alışveriş listesi |
| Pro Yıllık | $29.99/yıl ($2.50/ay) | Pro + öncelikli destek + gelişmiş analitik |

### Gelir Senaryoları

| Kullanıcı | Aylık Gelir | AI Maliyeti | Altyapı | Net Kâr | Marj |
|-----------|-------------|-------------|---------|---------|------|
| 500 | $2.495 | -$60 | -$71 | ~$2.277 | %91 |
| 2.000 | $9.980 | -$240 | -$150 | ~$9.241 | %93 |
| 5.000 | $24.950 | -$600 | -$200 | ~$23.500 | %94 |
| 10.000 | $49.900 | -$1.200 | -$320 | ~$42.890 | %86 |

### Ek Gelir Kaynakları

| Kaynak | Komisyon | Nasıl |
|--------|----------|-------|
| Instacart affiliate | %5 sepet değeri | Tarif malzemeleri "Sepete Ekle" butonu |
| HelloFresh / meal kit | $15-30/üyelik | Meal kit öneri |
| Thrive Market | $40/üyelik | Sağlıklı gıda kitlesi |
| Reklam (ücretsiz kullanıcı) | $10-50 eCPM | Yalnızca ücretsiz planda, zorunlu değil |

---

## 4. MALIYET ANALIZI

### Sabit Aylık Giderler

| Kalem | MVP Aşaması | Büyüme Aşaması |
|-------|-------------|----------------|
| Hetzner CX22 VPS (yeni, ayrı) | $7 | $14 (CX32'ye upgrade) |
| Supabase Pro | $25 | $75 |
| Vercel Pro (opsiyonel) | $20 | $40 |
| Spoonacular API | $15 | $30-75 |
| Edamam API | $0 | $19 |
| Cloudflare R2 (görseller) | $0 | $1-5 |
| Cookiebot/GDPR | $10 | $10 |
| Apple Developer hesabı | $8/ay ($99/yıl) | $8/ay |
| Google Play hesabı | $2/ay ($25 tek) | $2/ay |
| Domain | $1 | $1 |
| **TOPLAM** | **~$88/ay** | **~$250/ay** |

### Değişken Giderler (kullanıcı başına/ay)

| İşlem | Birim Maliyet | Açıklama |
|-------|---------------|---------|
| Fotoğraf analizi | $0.003-0.005 | GPT-4o Vision, high-detail |
| Tarif önerisi (text) | $0.001-0.002 | GPT-4o text |
| AI haftalık plan | $0.015-0.02 | Uzun GPT-4o çağrısı |
| Barcode lookup | $0 | Open Food Facts ücretsiz |
| Besin arama | $0 (ücretsiz tier) | Edamam 10K/ay ücretsiz |
| **Kullanıcı başına tahmini** | **~$0.15-0.30/ay** | Günde 2 kez kullanan kullanıcı |

### App Store Komisyonları

| Platform | 1. Yıl | Sonraki Yıllar | Küçük iş programı |
|----------|--------|----------------|-------------------|
| Apple | %30 | %15 | %15 (gelir < $1M) |
| Google Play | %15 | %15 | %15 |
| Web (Stripe) | %3.5 | %3.5 | — |

**Strateji:** Kullanıcıları web üzerinden abone yaptır → App Store komisyonu %0.

---

## 5. OZELLIK LISTESI (TAM)

### 5.1 Kimlik Dogrulama & Profil

- [ ] E-posta + şifre ile kayıt
- [ ] Google ile giriş (OAuth)
- [ ] Apple ile giriş (iOS zorunluluğu)
- [ ] E-posta doğrulaması
- [ ] Şifre sıfırlama
- [ ] Profil fotoğrafı yükleme
- [ ] Ad, soyad, yaş, cinsiyet, boy, kilo girişi
- [ ] Hedef belirleme (kilo ver / koru / al)
- [ ] Günlük kalori hedefi (otomatik hesaplama veya manuel)
- [ ] Makro hedefleri (protein, karbonhidrat, yağ gram veya %)
- [ ] Diyet tercihi seçimi (normal / vegan / vejetaryen / keto / paleo / glutensiz / helal / kosher)
- [ ] Alerji seçimi (fıstık, süt, yumurta, gluten, deniz ürünü vb.)
- [ ] Aktivite seviyesi seçimi (hareketsiz / az aktif / orta / çok aktif)
- [ ] Dil tercihi (Türkçe / İngilizce)
- [ ] Hesap silme

### 5.2 Yemek Kaylama & Takip

- [ ] Öğün seçimi (kahvaltı / öğle / akşam / ara öğün)
- [ ] **Fotoğrafla kaydetme** — kamera veya galeritden fotoğraf yükle
  - [ ] GPT-4o Vision ile otomatik yemek tanıma
  - [ ] Tespit edilen yemeklerin listesi + kalori/makro
  - [ ] Kullanıcı düzenleme/onaylama ekranı
  - [ ] Porsiyon miktarı ayarlama (x0.5, x1, x2 vb.)
- [ ] **Barkod tarayıcı** — paketli ürünler için
  - [ ] Kamera ile barkod okuma
  - [ ] Open Food Facts veritabanından otomatik bilgi çekme
  - [ ] Bulunamayan barkod için manuel giriş seçeneği
- [ ] **Metin arama** — yemek ismiyle ara
  - [ ] Edamam API ile besin değeri arama
  - [ ] Türkçe yemek özel veritabanı (köfte, mantı, çorba vb.)
  - [ ] Porsiyon seçimi (1 porsiyon, 100g, 1 bardak vb.)
- [ ] **Manuel giriş** — isim + kalori/makro elle gir
- [ ] Sık kullanılanlar listesi
- [ ] Son kullanılanlar listesi
- [ ] Öğün kopyalama (dünün kahvaltısını bugüne kopyala)
- [ ] Log silme ve düzenleme
- [ ] Hızlı log (+100 kcal butonu)

### 5.3 Günlük Dashboard

- [ ] Günlük kalori özeti (hedef / alınan / kalan)
- [ ] Makro halka grafiği (protein / karbo / yağ)
- [ ] Öğünler özeti (sabah/öğle/akşam/ara öğün tek bakışta)
- [ ] Su takibi (bardak sayısı, hedef 8 bardak)
- [ ] Tarih gezginle geçmiş günlere bakış
- [ ] Haftalık kalori grafiği
- [ ] Günlük streak (kaç gün üst üste loglandı)
- [ ] Hedef vs gerçek karşılaştırma grafiği

### 5.4 Kilo & Beden Takibi

- [ ] Kilo girişi (kg veya lbs)
- [ ] Kilo grafiği (zaman içinde değişim)
- [ ] Hedef kiloya kalan miktar
- [ ] Tahmini hedefe ulaşma tarihi (mevcut gidişata göre)
- [ ] Bel, kalça, göğüs ölçümü takibi (opsiyonel)
- [ ] Önce/sonra fotoğrafı (gizli, kullanıcı galerisine gider)
- [ ] BMI hesaplama ve gösterimi

### 5.5 Tarif Ozellikleri

- [ ] **Malzemeye göre tarif ara** — "evdekilerle ne yapabilirim?"
  - [ ] Malzeme listesi girişi (yazarak veya fotoğrafla)
  - [ ] Spoonacular API ile eşleşen tarifler
  - [ ] Eksik malzeme gösterimi ("sadece 2 malzemen eksik")
  - [ ] Kalori/porsiyon bilgisi
- [ ] **Tarif keşfet** — kategoriye göre gözat
  - [ ] Kahvaltı, öğle, akşam, tatlı, içecek
  - [ ] Diyet tipine göre filtre
  - [ ] Hazırlama süresine göre filtre
  - [ ] Kalori aralığına göre filtre
  - [ ] Malzeme sayısına göre filtre
- [ ] **Tarif detay sayfası**
  - [ ] Malzeme listesi (porsiyon sayısına göre ayarlanabilir)
  - [ ] Adım adım yapılış
  - [ ] Toplam kalori + makrolar
  - [ ] Hazırlama + pişirme süresi
  - [ ] Zorluk seviyesi
- [ ] Tarif kaydetme (favoriler)
- [ ] Tarif loglama (yaptım, bugünkü öğünüme ekle)
- [ ] Tarif paylaşma (link veya görsel kart)
- [ ] Kendi tarifini ekle
- [ ] Malzeme değiştirme önerisi (alerjen yerine alternatif)

### 5.6 AI Haftalık Beslenme Plani

- [ ] Tek tıkla haftalık plan oluştur
  - [ ] Kalori hedefine göre
  - [ ] Diyet tercihine göre
  - [ ] Alerjileri dikkate alarak
  - [ ] Bütçeye göre (opsiyonel filtre)
- [ ] Plan içeriği:
  - [ ] 7 gün × 4 öğün (kahvaltı/öğle/akşam/ara öğün)
  - [ ] Her öğün için tarif veya basit yemek önerisi
  - [ ] Günlük toplam kalori gösterimi
  - [ ] Haftalık makro özeti
- [ ] Plan düzenleme (tek öğünü değiştir)
- [ ] Plan yenileme (beğenmedim, yeniden oluştur)
- [ ] Plandan alışveriş listesi oluştur
- [ ] Geçmiş planları görüntüle
- [ ] Planı arkadaşa gönder

### 5.7 Alisveris Listesi

- [ ] Haftalık beslenme planından otomatik oluştur
  - [ ] Pantry'deki malzemeleri çıkar (opsiyonel)
  - [ ] Kategoriye göre grupla (sebze, et, süt ürünleri vb.)
- [ ] Manuel öğe ekle/sil
- [ ] Öğeleri işaretle (alındı/alınmadı)
- [ ] Liste paylaşma (WhatsApp, link)
- [ ] **Instacart entegrasyonu** — "Hepsini sepete ekle" (affiliate)
- [ ] Tahmini bütçe hesaplama

### 5.8 Bildirimler & Hatirlaticilar

- [ ] Öğün saati hatırlatıcısı (özelleştirilebilir)
- [ ] Su içme hatırlatıcısı (her 2 saatte bir)
- [ ] Günlük log tamamlanmadıysa akşam bildirimi
- [ ] Streak kırılma uyarısı
- [ ] Haftalık ilerleme özeti (her Pazar)
- [ ] Kilo kayıt hatırlatıcısı (haftada bir)
- [ ] Abonelik yenileme hatırlatıcısı

### 5.9 Analizler & Raporlar

- [ ] Haftalık besin özeti (kalori, protein, karbo, yağ ortalaması)
- [ ] Aylık trend grafiği
- [ ] En sık yenen yemekler
- [ ] Öğün dağılımı analizi (kahvaltı mı atlıyorsun?)
- [ ] Makro dağılımı analizi (protein yeterince alıyor musun?)
- [ ] Mikro besin takibi (Pro: demir, kalsiyum, C vitamini vb.)
- [ ] Kalori açığı/fazlası hesabı (kilo hedefe göre)
- [ ] Paylaşılabilir haftalık rapor kartı (görsel, sosyal medya için)

### 5.10 Sosyal & Viral Ozellikler

- [ ] Paylaşılabilir günlük özet kartı
  - [ ] "Bugün hedefime ulaştım 🎯" kartı
  - [ ] Yaptığım tarif kartı
  - [ ] Streak kartı
- [ ] Arkadaşı davet et (referral)
  - [ ] "1 hafta ücretsiz Pro kazan" mekanizması
- [ ] Başarı rozetleri (7 gün streak, 30 gün streak, ilk kilo hedefi vb.)
- [ ] Genel liderboard (opsiyonel, gizlilik öncelikli)

### 5.11 Abonelik & Odeme

- [ ] Stripe entegrasyonu
- [ ] Aylık plan satın alma
- [ ] Yıllık plan satın alma (%50 indirim vurgusu)
- [ ] 7 günlük ücretsiz deneme (kredi kartı gerektirir)
- [ ] Abonelik iptali (uygulama içinden)
- [ ] Abonelik dondurma (1-3 ay)
- [ ] Fatura geçmişi
- [ ] Ödeme yöntemi güncelleme
- [ ] Web üzerinden abone ol → App Store komisyonu yok

### 5.12 Ayarlar & Hesap

- [ ] Profil düzenleme
- [ ] Hedef güncelleme
- [ ] Birim seçimi (kg/lbs, cm/ft)
- [ ] Gizlilik ayarları
- [ ] Veri dışa aktarma (CSV, JSON)
- [ ] Hesap silme (GDPR)
- [ ] Dil değiştirme
- [ ] Tema (açık / koyu)
- [ ] Bildirim ayarları

### 5.13 PWA / Uygulama Ozellikleri

- [ ] Progressive Web App (PWA) — web'de "Ana ekrana ekle"
- [ ] Offline mod — son 7 günlük log okunabilir
- [ ] Offline log girişi — internet gelince sync
- [ ] Kamera erişimi (fotoğraf çekme)
- [ ] Push notification (PWA'da)

---

## 6. TEKNIK MIMARI

### Stack

| Katman | Teknoloji | Notlar |
|--------|-----------|--------|
| Frontend | Next.js 15, React 19, Tailwind v4 | App Router |
| UI bileşenleri | shadcn/ui | Hazır, erişilebilir |
| State (server) | React Query (TanStack Query) | Cache + sync |
| State (client) | Zustand | Minimal |
| AI streaming | Vercel AI SDK v6 | Akıcı yanıtlar |
| Backend | Next.js API Routes | Ayrı backend yok |
| Auth | Auth.js v5 | Email + Google + Apple |
| ORM | Drizzle ORM | Type-safe |
| Veritabanı | PostgreSQL 16 | Docker container |
| Cache | Redis 7 | Rate limit + cache |
| Depolama | Cloudflare R2 | Fotoğraflar |
| Deploy | Docker Compose + Nginx | Hetzner VPS |

### Harici API'lar

| API | Amaç | Ücretsiz Limit | Ücretli |
|-----|------|----------------|---------|
| OpenAI GPT-4o Vision | Fotoğraf analizi | Yok (pay-as-you-go) | ~$0.003-0.005/foto |
| OpenAI GPT-4o | Tarif önerisi, plan | Yok (pay-as-you-go) | ~$0.001-0.002/istek |
| Spoonacular | Tarif veritabanı | 150 istek/gün | $15/ay (1500/gün) |
| Edamam | Besin değerleri | 10.000/ay | $19/ay |
| Open Food Facts | Barkod | Sınırsız | Ücretsiz |
| Stripe | Ödeme | — | %2.9 + $0.30 |
| Cloudflare R2 | Görsel depolama | 10GB/ay | $0.015/GB sonrası |

### Klasor Yapisi

```
snapcal/
├── app/
│   ├── (auth)/
│   │   ├── giris/
│   │   └── kayit/
│   ├── (app)/
│   │   ├── dashboard/
│   │   ├── fotograf/
│   │   ├── tarifler/
│   │   ├── plan/
│   │   ├── takip/
│   │   ├── alisveris/
│   │   ├── analizler/
│   │   └── profil/
│   └── api/
│       ├── auth/
│       ├── ai/
│       │   ├── fotograf-analiz/
│       │   ├── tarif-oner/
│       │   └── plan-olustur/
│       ├── tarifler/
│       ├── besin/
│       ├── barkod/
│       ├── log/
│       ├── kilo/
│       └── stripe/
├── components/
│   ├── ui/               (shadcn)
│   ├── fotograf-yukle/
│   ├── kalori-halka/
│   ├── tarif-karti/
│   ├── makro-grafik/
│   └── alisveris-listesi/
├── lib/
│   ├── db/               (Drizzle schema + migrations)
│   ├── auth.ts
│   ├── openai.ts
│   ├── spoonacular.ts
│   ├── edamam.ts
│   ├── openfoodfacts.ts
│   └── stripe.ts
├── docker-compose.yml
├── Dockerfile
└── .env.local
```

### Veritabani Seması

```sql
users               -- Kullanıcı profilleri + hedefler
food_logs           -- Günlük yemek kayıtları (ana tablo)
weight_logs         -- Kilo kayıtları
saved_recipes       -- Kaydedilen tarifler
custom_recipes      -- Kullanıcı tarifleri
meal_plans          -- AI haftalık planlar
shopping_lists      -- Alışveriş listeleri
subscriptions       -- Stripe abonelik bilgileri
user_achievements   -- Rozetler
referrals           -- Referral takibi
```

---

## 7. VPS & ALTYAPI

### Mevcut VPS Durumu (openclawbot — 77.42.67.36)

```
CPU:  2 vCPU
RAM:  3.7GB toplam, 2.0GB kullanımda
SWAP: 1.1GB kullanımda (UYARI: baskı altında)
Disk: 75GB, 32GB kullanımda (%45)

Çalışan containerlar:
  siteluma-app      (91MB RAM, %8.6 CPU)
  peakvoria-backend (179MB RAM)
  peakvoria-postgres(30MB RAM)
  peakvoria-frontend(1MB RAM)
```

### Oneri: Yeni Ayri Sunucu

```
Hetzner CX22 (yeni):
  2 vCPU, 4GB RAM, 40GB disk
  ~$7/ay (Helsinki veya Nuremberg)
  Sadece SnapCal için
  Mevcut sunucuya hiç dokunulmaz

Containerlar:
  snapcal-app     → Next.js (port 3002)
  snapcal-postgres→ PostgreSQL 16
  snapcal-redis   → Redis 7
  nginx           → Reverse proxy + SSL
```

### Büyüme ile Upgrade Planı

| Aşama | Kullanıcı | Sunucu | Maliyet |
|-------|-----------|--------|---------|
| MVP | 0-500 | Hetzner CX22 | $7/ay |
| Büyüme | 500-2000 | Hetzner CX32 (4vCPU/8GB) | $14/ay |
| Scale | 2000-10000 | CX42 (8vCPU/16GB) | $28/ay |
| Enterprise | 10000+ | Load balancer + cluster | $50+/ay |

---

## 8. MOBIL UYGULAMA PLANI

### Aşama 1 — Hızlı (Capacitor.js, 1-2 hafta)

Mevcut Next.js web appını native shell içine sarma:
- iOS ve Android'e yüklenebilir
- Kamera erişimi çalışır
- Push notification çalışır
- %90-95 kod yeniden kullanımı
- Tam native hissi vermez ama başlangıç için yeterli
- App Store'da erken kullanıcı topla, geri bildirim al

### Aşama 2 — Gerçek Native (Expo, 6-10 hafta)

Turborepo monorepo: web + mobile aynı repo
- Expo SDK 52 + Expo Router
- NativeWind (Tailwind syntax React Native'de)
- Web koduyla %60-70 paylaşım
- Gerçek native performans
- Apple Health / Google Fit entegrasyonu

### App Store Gereksinimleri

Apple:
- Apple Developer Account: $99/yıl
- Apple ile giriş zorunlu (third-party auth varsa)
- Gizlilik politikası zorunlu
- Uygulama içi satın alma için App Store ödeme kullanılmalı (kullanıcı telefondan abone olursa)

Google Play:
- $25 tek seferlik
- Play Billing API (uygulama içi satın alma için)

Strateji: Kullanıcıyı web'den abone yap → App Store komisyonu yok.

---

## 9. BUYUME STRATEJISI

### Kullanıcı Edinme (Sıfır Bütçe)

**TikTok (en önemli kanal):**
- Günde 1 video, sabah yayınla
- Format: "Türk yemekleri kaç kalori?" + app ile canlı test
- İlk 2 saniyede sonucu göster (sonuçla başla, sonra açıkla)
- Hedef: 12 hesap farklı açılarla (Cal AI stratejisi)

**Pinterest:**
- Her tarif için pin oluştur
- "1000 kalori altında akşam yemeği fikirleri" board'ları
- Organik trafik 6-12 ayda birikir

**Reddit:**
- r/MealPrepSunday (3M+ üye)
- r/EatCheapAndHealthy (1.5M+ üye)
- r/loseit (1M+ üye)
- Gerçekten faydalı içerik paylaş, reklam yapma

**SEO:**
- "evde ne pişirsem" — aranıyor
- "[yemek adı] kaç kalori" — çok aranıyor
- Turkish food calorie calculator — global

### Referral Mekanizması

- "Arkadaşını davet et → ikisi de 1 hafta ücretsiz Pro"
- Başarılı logdan sonra paylaşım kartı göster
- Streak milestone'larında otomatik paylaşım önerisi

### Churn Azaltma

| Taktik | Etki |
|--------|------|
| Yıllık plan sun | Churn %51 düşer |
| "Dondur" seçeneği (1-3 ay) | İptali %18 azaltır |
| İlk hafta onboarding mükemmel olmalı | Kullanıcının %30'u ilk ayda ayrılır |
| Günlük streak sistemi | Geri dönüşü artırır |
| Haftalık ilerleme raporu | Engagement yüksek tutar |

---

## 10. YASAL GEREKSINIMLER

### Zorunlu Disclaimer (her sağlık önerisi yanında)

```
"Bu bilgiler genel bilgi amaçlıdır ve tıbbi tavsiye niteliği
taşımaz. Diyet değişikliği yapmadan önce bir sağlık uzmanına
danışınız."
```

### GDPR / KVKK Uyumu

- Cookiebot veya Iubenda ($10/ay) — cookie consent banner
- Gizlilik politikası (yemek verileri hassas sayılabilir)
- Kullanıcı veri silme hakkı (hesap silme özelliği)
- OpenAI API kullanımı: API verileri eğitimde kullanılmıyor (GDPR uyumlu)
- Her API sağlayıcısı ile DPA (Data Processing Agreement) imzala

---

## 11. GELISTIRME TAKVIMI

### Hafta 1-2: Temel Altyapı
- [ ] Next.js 15 + Tailwind v4 + shadcn/ui kurulumu
- [ ] Auth.js v5 (email + Google)
- [ ] Drizzle ORM + PostgreSQL şema
- [ ] Docker Compose yapısı
- [ ] Hetzner VPS kurulum + Nginx + SSL
- [ ] CI/CD (GitHub Actions → VPS deploy)

### Hafta 3-4: Çekirdek Özellikler
- [ ] Kullanıcı profili + hedef belirleme
- [ ] GPT-4o Vision fotoğraf analizi
- [ ] Manuel yemek arama (Edamam)
- [ ] Barkod tarayıcı (Open Food Facts)
- [ ] Yemek loglama sistemi
- [ ] Günlük kalori dashboard

### Hafta 5-6: Para & Deploy
- [ ] Stripe abonelik entegrasyonu
- [ ] Ücretsiz/Pro plan ayrımı + rate limiting
- [ ] PWA manifest + service worker
- [ ] Production deploy
- [ ] Domain + SSL

### Hafta 7-8: Tarif & Plan
- [ ] Spoonacular API entegrasyon
- [ ] Malzemeye göre tarif arama
- [ ] AI haftalık beslenme planı
- [ ] Alışveriş listesi

### Hafta 9-10: Mobil & Büyüme
- [ ] Capacitor.js ile iOS/Android wrap
- [ ] App Store / Play Store gönderim
- [ ] Paylaşım kartları (viral)
- [ ] Referral sistemi
- [ ] TikTok içerik başlangıcı

---

## 12. GELECEK OZELLIKLER (Roadmap)

### 3-6 Ay Sonrası
- Aile/Hane modu (birden fazla profil)
- Türk mutfağı özel veritabanı
- Sesle yemek kaydetme
- Apple Health / Google Fit entegrasyonu
- Restoran menüsü kaydetme

### 6-12 Ay Sonrası
- GLP-1/Ozempic uyumlu özel beslenme planları
- Menopoz/hormonal sağlık beslenme modülü
- Mikro besin takibi (vitamin, mineral)
- Bütçeye göre yemek planlama
- AI yemek koçu (sohbet arayüzü)

### 1+ Yıl Sonrası
- Diyetisyenlere white-label lisans ($500-3000/ay)
- Kurumsal wellness programları
- Kilo takibi + akıllı tartı entegrasyonu
- Genetik beslenme önerileri (DNA testi entegrasyonu)

---

## 13. BASARI METRIKLERI

| Metrik | 3. Ay Hedefi | 6. Ay Hedefi | 12. Ay Hedefi |
|--------|-------------|-------------|--------------|
| Toplam kullanıcı | 1.000 | 5.000 | 20.000 |
| Ödeme yapan | 100 | 500 | 2.000 |
| MRR | $500 | $2.500 | $10.000 |
| Aylık churn | <%10 | <%8 | <%6 |
| Günlük aktif kullanıcı | %15 | %20 | %25 |
| App Store puanı | 4.0+ | 4.2+ | 4.5+ |

---

## 14. TEKNIK ONCLIKLER (Kodlamaya Baslarken)

1. **İlk kur:** `npx create-next-app@latest snapcal --typescript --tailwind --app`
2. **Auth:** Auth.js v5 + Google OAuth + email magic link
3. **DB:** Drizzle + PostgreSQL — food_logs tablosu önce gelsin
4. **İlk AI feature:** `/api/ai/fotograf-analiz` endpoint → GPT-4o Vision
5. **Önce web, sonra mobil** — Capacitor wrap hızlı ve yeterli
6. **Stripe önce, sonra özellik** — para kazanmak için ödeme sistemi kritik
7. **Rate limit baştan koy** — sonradan eklemek zor

---

*Rapor tarihi: Mart 2026*
*Hazırlayan: Claude Code (Anthropic)*
