# SnapCal — Kodlamaya Başlarken

## İlk Komutlar

```bash
# Projeyi oluştur
npx create-next-app@latest snapcal --typescript --tailwind --app --src-dir

cd snapcal

# Temel paketler
npm install drizzle-orm drizzle-kit pg @auth/drizzle-adapter
npm install next-auth@beta
npm install @ai-sdk/openai ai
npm install stripe @stripe/stripe-js
npm install zustand @tanstack/react-query
npm install sharp                    # görsel optimizasyon
npm install zod                      # validasyon
npm install ioredis                  # Redis client

# shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input label tabs badge progress
npx shadcn@latest add dialog drawer sheet skeleton toast
npx shadcn@latest add chart                # kalori grafikleri için
```

## .env.local Şablonu

```env
# Database
DATABASE_URL=postgresql://snapcal:sifre@localhost:5432/snapcal

# Auth
AUTH_SECRET=                    # openssl rand -base64 32
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# OpenAI
OPENAI_API_KEY=

# Spoonacular
SPOONACULAR_API_KEY=

# Edamam
EDAMAM_APP_ID=
EDAMAM_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRO_MONTHLY_PRICE_ID=
STRIPE_PRO_YEARLY_PRICE_ID=

# Redis
REDIS_URL=redis://localhost:6379

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=snapcal-images
NEXT_PUBLIC_R2_PUBLIC_URL=
```

## docker-compose.yml

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3002:3000"
    env_file: .env.production
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: snapcal
      POSTGRES_USER: snapcal
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U snapcal"]
      interval: 10s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --maxmemory 128mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

## İlk Kodlanacak Şeyler (Sırayla)

### 1. Drizzle Şema (lib/db/schema.ts)
```typescript
// Önce bu tabloları oluştur:
// users, food_logs, weight_logs, subscriptions
```

### 2. Auth.js (auth.ts)
```typescript
// Google + Email provider
// Session'da user.id olsun
```

### 3. İlk API: Fotoğraf Analizi
```typescript
// app/api/ai/fotograf-analiz/route.ts
// POST: base64 image → GPT-4o Vision → JSON response
```

### 4. İlk Sayfa: Dashboard
```typescript
// app/(app)/dashboard/page.tsx
// Günlük kalori halka grafiği
// Öğün listesi
// Fotoğraf yükleme butonu
```

## API Maliyetleri Hatırlatma

| İşlem | Model | Maliyet |
|-------|-------|---------|
| Fotoğraf analizi | GPT-4o Vision | ~$0.005/foto |
| Tarif önerisi | GPT-4o | ~$0.002/istek |
| Haftalık plan | GPT-4o | ~$0.020/plan |
| Barkod lookup | Open Food Facts | Ücretsiz |
| Besin arama | Edamam | Ücretsiz (10K/ay) |
| Tarif arama | Spoonacular | $15/ay |

## Önemli Notlar

- Apple ile giriş: App Store'a yükleyince ZORUNLU
- Rate limiting: Redis ile baştan kur, sonra eklemek zor
- Fotoğrafları VPS'te SAKLAMA, Cloudflare R2'ye gönder
- Web'den abone ol → App Store komisyonu yok
- Yıllık plan → Churn %51 düşer, öne çıkar

## Nginx Konfigürasyonu (VPS'te)

```nginx
server {
    server_name snapcal.com www.snapcal.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# SSL
certbot --nginx -d snapcal.com -d www.snapcal.com
```
