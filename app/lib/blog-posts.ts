export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readMinutes: number;
  publishedAt: string;
  emoji: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "kalori-nasil-hesaplanir",
    title: "Kalori Nasıl Hesaplanır? Kapsamlı Rehber",
    excerpt:
      "Kalori hesaplama yöntemleri, bazal metabolizma hızı ve günlük kalori ihtiyacınızı nasıl belirleyeceğinizi öğrenin.",
    emoji: "🔥",
    category: "Beslenme",
    readMinutes: 6,
    publishedAt: "2026-03-10",
    content: `
## Kalori Nedir?

Kalori, besinlerdeki enerji miktarını ölçen bir birimdir. Teknik olarak 1 kalori, 1 gram suyu 1°C ısıtmak için gereken enerji miktarıdır. Beslenme biliminde kullandığımız "kalori" aslında kilokalori (kcal) anlamına gelir.

## Mifflin-St Jeor Formülü

Günlük kalori ihtiyacını hesaplamak için en yaygın kullanılan yöntemlerden biri Mifflin-St Jeor formülüdür:

**Erkekler için:**
\`\`\`
BMH = (10 × ağırlık kg) + (6.25 × boy cm) - (5 × yaş) + 5
\`\`\`

**Kadınlar için:**
\`\`\`
BMH = (10 × ağırlık kg) + (6.25 × boy cm) - (5 × yaş) - 161
\`\`\`

## Aktivite Çarpanları

Bazal metabolizma hızınızı (BMH) hesapladıktan sonra, günlük enerji harcamanızı bulmak için aktivite çarpanını kullanın:

- **Hareketsiz** (masa başı iş): BMH × 1.2
- **Az aktif** (haftada 1-3 gün egzersiz): BMH × 1.375
- **Orta aktif** (haftada 3-5 gün): BMH × 1.55
- **Çok aktif** (haftada 6-7 gün): BMH × 1.725

## Pratik İpuçları

1. Hedef kilo vermek istiyorsanız günlük 300-500 kcal açık yaratın
2. Kilo almak için 300-500 kcal fazlası tüketin
3. Aşırı kısıtlama (günde 1200 kcal altı) metabolizmayı yavaşlatır
4. MunchLens gibi uygulamalar kalori takibini kolaylaştırır

## Makro Besinlerin Katkısı

- **1g Karbonhidrat** = 4 kcal
- **1g Protein** = 4 kcal
- **1g Yağ** = 9 kcal
- **1g Alkol** = 7 kcal

Kalori sayımı başlangıçta karmaşık gelebilir, ancak birkaç hafta düzenli takip ile alışkanlık haline gelir.
    `,
  },
  {
    slug: "protein-neden-onemli",
    title: "Protein Neden Bu Kadar Önemli?",
    excerpt:
      "Proteinin vücuttaki rolü, günlük ihtiyacınız ve en iyi protein kaynakları hakkında bilmeniz gereken her şey.",
    emoji: "💪",
    category: "Beslenme",
    readMinutes: 5,
    publishedAt: "2026-03-12",
    content: `
## Proteinin Temel Görevleri

Protein, vücudun yapı taşıdır. Kas dokusu, enzimler, hormonlar ve bağışıklık sistemi proteinlerden oluşur. Günlük protein ihtiyacınızı karşılamak, uzun vadeli sağlığınız için kritik önem taşır.

## Günlük Protein İhtiyacı

Araştırmalar, sağlıklı yetişkinler için şu miktarları önermektedir:

- **Sedanter bireyler**: 0.8g / kg vücut ağırlığı
- **Aktif bireyler**: 1.2 - 1.6g / kg
- **Kas geliştirme hedefi**: 1.6 - 2.2g / kg
- **Kilo verme diyeti**: 1.6 - 2.4g / kg (kas kaybını önlemek için)

## En İyi Protein Kaynakları

### Hayvansal Kaynaklar
- Tavuk göğsü (100g = 31g protein)
- Yumurta (1 adet = 6g protein)
- Somon (100g = 25g protein)
- Yoğurt (150g = 10g protein)

### Bitkisel Kaynaklar
- Mercimek (100g pişmiş = 9g protein)
- Nohut (100g pişmiş = 9g protein)
- Edamame (100g = 11g protein)
- Tofu (100g = 8g protein)

## Protein Zamanlaması

Araştırmalar, proteini gün içine eşit dağıtmanın kas sentezi açısından daha etkili olduğunu göstermektedir. Her öğünde 20-40g protein hedefleyin.

## Çok Protein Zararlı mı?

Sağlıklı bireyler için günde 2g/kg'a kadar olan protein tüketimi güvenlidir. Böbrek hastalığı olanlar doktor kontrolünde beslenmelidir.
    `,
  },
  {
    slug: "araliksiz-oruc-rehberi",
    title: "Aralıklı Oruç: Başlayanlar İçin Tam Rehber",
    excerpt:
      "16/8, 5:2 ve diğer aralıklı oruç yöntemlerini, avantajlarını ve nasıl başlayacağınızı keşfedin.",
    emoji: "⏰",
    category: "Diyet",
    readMinutes: 7,
    publishedAt: "2026-03-15",
    content: `
## Aralıklı Oruç Nedir?

Aralıklı oruç (Intermittent Fasting / IF), belirli zaman dilimlerinde yemek yeme ile orucun dönüşümlü olarak uygulandığı bir beslenme yaklaşımıdır. Ne yediğinizden çok ne zaman yediğinize odaklanır.

## Popüler Yöntemler

### 16/8 Metodu
En yaygın yöntemdir. 16 saat oruç, 8 saat yeme penceresi. Örneğin 12:00-20:00 arası yemek, geri kalan 16 saat oruç.

### 5:2 Diyeti
Haftanın 5 günü normal beslenme, 2 günü 500-600 kcal ile kısıtlı beslenme.

### OMAD (One Meal A Day)
Günde tek öğün. İleri düzey uygulayıcılar için.

## Aralıklı Orucun Faydaları

- **Kilo yönetimi**: Kalori alımını doğal olarak azaltır
- **İnsülin duyarlılığı**: Kan şekeri kontrolünü iyileştirir
- **Otofaji**: Hücresel temizlik mekanizmasını aktive eder
- **Zihinsel netlik**: Çoğu kullanıcı odak artışı bildiriyor

## Kimler Yapmamalı?

- Hamile veya emziren anneler
- Yeme bozukluğu geçmişi olanlar
- Tip 1 diyabetikler
- 18 yaş altı bireyler

## Başlarken İpuçları

1. 12/12 ile başlayın, zamanla 16/8'e geçin
2. Yeme pencerenizi sabah öğünü atlayarak oluşturun
3. Oruç saatlerinde su, çay ve sade kahve içebilirsiniz
4. İlk 2-3 hafta uyum sürecidir, baş ağrısı normaldir

## Oruç Kırma Öğünleri

Oruç kırarken sağlıklı, dengeli bir öğün tercih edin. Yüksek şekerli veya ultra-işlenmiş gıdalarla başlamak sindirim sorunlarına yol açabilir.
    `,
  },
  {
    slug: "kilo-takibi-ipuclari",
    title: "Etkili Kilo Takibi: 10 Altın Kural",
    excerpt:
      "Kilo takibini tutarlı ve motive edici hale getirmek için kanıta dayalı stratejiler ve pratik öneriler.",
    emoji: "⚖️",
    category: "Takip",
    readMinutes: 4,
    publishedAt: "2026-03-18",
    content: `
## Neden Kilo Takibi Önemli?

Düzenli kilo takibi, hedeflerinize doğru ilerlediğinizi görmenizi sağlar. Araştırmalar, tartılan bireylerin tartılmayanlara göre %66 daha başarılı kilo yönetimi sağladığını göstermektedir.

## 10 Altın Kural

### 1. Her Sabah Tartılın
Sabah kalktıktan sonra, tuvaletten çıkıp bir şey yemeden tartılmak en tutarlı ölçümü verir.

### 2. Haftalık Ortalamaya Bakın
Günlük dalgalanmalar normaldir (su tutma, sindirim vb.). Gerçek ilerlemeyi haftalık ortalamada görürsünüz.

### 3. Aynı Teraziyi Kullanın
Farklı teraziler farklı değerler gösterebilir. Aynı terazi ile ölçüm yapın.

### 4. Aynı Kıyafetle Tartılın
Tercihan çıplak veya iç çamaşırıyla tartılmak daha tutarlı sonuç verir.

### 5. Sabah vs Akşam Farkı
Gün içinde 1-3 kg ağırlık değişimi normaldir. Paniklemeyind.

### 6. Platolar Normaldir
2-3 haftalık plato dönemleri herkesin yaşadığı normal bir süreçtir. Devam edin.

### 7. Ölçümlerle Destekleyin
Bel, kalça ve göğüs ölçümleri bazen tartıdan daha güvenilir ilerleme göstergesidir.

### 8. Fotoğraf Çekin
Aylık "ilerleme fotoğrafları" motivasyonu yüksek tutar.

### 9. Trend Çizgisine Odaklanın
Kısa vadeli dalgalanmalar değil, uzun vadeli trend önemlidir.

### 10. Şeffaf Olun
MunchLens gibi uygulamalarla hem beslenmenizi hem kilonuzu takip edin.

## Ne Zaman Endişelenmeli?

- 2 haftada 1 kg'dan fazla kayıp veya artış
- Kontrolsüz kilo kaybı (kasıtsız)
- Ani kilo değişimleri

Bu durumlarda bir doktora başvurun.
    `,
  },
  {
    slug: "beslenme-gunlugu-tutmak",
    title: "Beslenme Günlüğü Tutmanın Sırları",
    excerpt:
      "Beslenme günlüğü tutmak kilo yönetiminde en etkili yöntemlerden biri. İşte bunu kolaylaştıracak stratejiler.",
    emoji: "📔",
    category: "İpuçları",
    readMinutes: 4,
    publishedAt: "2026-03-20",
    content: `
## Beslenme Günlüğü Neden İşe Yarar?

Araştırmalar, beslenme takibi yapan bireylerin yapmayanlara göre 2 kat daha fazla kilo verdiğini göstermektedir. Yediğinizi kayıt altına almak, farkındalığınızı artırır ve "görünmez kaloriler"i açığa çıkarır.

## Yaygın Hatalar

### 1. Hafıza Yanılsatması
"Öğleden sonra biraz atıştırdım" derken aslında 300 kalori alınmış olabilir. Her şeyi anında kaydedin.

### 2. Pişirme Yağını Atlamak
Zeytinyağı ile kavurma işlemi tabloya 100-200 kcal ekleyebilir.

### 3. İçecekleri Unutmak
Meyve suyu, süt, çay şekeri... Bunlar da kalori içerir.

### 4. Hafta Sonu İstisnası
"Pazartesi başlarım" mentalitesi. Hafta sonu kalori ihtiyacı değişmez.

## Kolaylaştırıcı Stratejiler

**Fotoğraf ile Kayıt**
MunchLens'in AI fotoğraf analizi gibi özelliklerle, tabağınızı fotoğraflayarak anında besin analizi yapabilirsiniz.

**Yemek Hazırlarken Kaydet**
Tabakta ne varsa hafızanız daha taze iken kaydedin.

**Sık Kullanılanları Favorile**
Sürekli yediğiniz besinleri favorilere ekleyin.

**Haftalık Değerlendirme**
Her Pazar akşamı geçen haftanızı gözden geçirin. Kalıpları fark edin.

## Hedefler Gerçekçi Olsun

Beslenme takibi stresli hale gelirse ters etki yaratabilir. Mükemmeliyetçilikten kaçının; %80 uyum %100 uyumdan daha sürdürülebilirdir.
    `,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
