import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}
const FROM = process.env.EMAIL_FROM || "MunchLens <noreply@munchlens.app>";

export async function sendWelcomeEmail(to: string, name: string) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    await getResend().emails.send({
      from: FROM,
      to,
      subject: "MunchLens'e Hoş Geldiniz! 🍽️",
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: system-ui, sans-serif; background: #f9fafb; margin: 0; padding: 24px;">
  <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 32px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 8px;">🍽️</div>
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800;">MunchLens</h1>
    </div>
    <div style="padding: 32px;">
      <h2 style="margin: 0 0 12px; font-size: 20px; color: #1c1917;">Merhaba, ${name}! 👋</h2>
      <p style="color: #57534e; line-height: 1.6; margin: 0 0 20px;">
        MunchLens ailesine katıldığınız için teşekkürler! Artık yapay zeka destekli beslenme takibinin tüm özelliklerini kullanabilirsiniz.
      </p>
      <div style="background: #fff7ed; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 12px; font-weight: 600; color: #9a3412;">Başlamak için:</p>
        <ul style="margin: 0; padding-left: 20px; color: #78350f; line-height: 1.8;">
          <li>Profilinizi tamamlayın (boy, kilo, hedef)</li>
          <li>İlk yemeğinizi fotoğraflayın</li>
          <li>AI ile haftalık beslenme planı oluşturun</li>
        </ul>
      </div>
      <a href="${process.env.NEXTAUTH_URL || "https://munchlens.app"}/dashboard"
         style="display: inline-block; background: #f97316; color: white; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 15px;">
        Uygulamaya Git →
      </a>
    </div>
    <div style="padding: 16px 32px; border-top: 1px solid #f5f5f4; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #a8a29e;">
        Bu e-posta ${to} adresine gönderildi. MunchLens © 2026
      </p>
    </div>
  </div>
</body>
</html>
      `,
    });
  } catch (err) {
    console.error("Welcome email failed:", err);
  }
}

export async function sendProActivatedEmail(to: string, name: string) {
  if (!process.env.RESEND_API_KEY) return;

  try {
    await getResend().emails.send({
      from: FROM,
      to,
      subject: "Pro üyeliğiniz aktif! 🎉",
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: system-ui, sans-serif; background: #f9fafb; margin: 0; padding: 24px;">
  <div style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #f97316, #ea580c); padding: 32px; text-align: center;">
      <div style="font-size: 48px; margin-bottom: 8px;">👑</div>
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800;">Pro Üyelik Aktif!</h1>
    </div>
    <div style="padding: 32px;">
      <h2 style="margin: 0 0 12px; font-size: 20px; color: #1c1917;">Tebrikler, ${name}! 🎉</h2>
      <p style="color: #57534e; line-height: 1.6; margin: 0 0 20px;">
        MunchLens Pro üyeliğiniz başarıyla aktive edildi. Artık tüm premium özelliklere erişiminiz var.
      </p>
      <div style="background: #fff7ed; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 12px; font-weight: 600; color: #9a3412;">Pro avantajlarınız:</p>
        <ul style="margin: 0; padding-left: 20px; color: #78350f; line-height: 1.8;">
          <li>Günde 50 fotoğraf analizi (5 yerine)</li>
          <li>100 AI tarif önerisi</li>
          <li>Sınırsız haftalık plan oluşturma</li>
          <li>Öncelikli destek</li>
        </ul>
      </div>
      <a href="${process.env.NEXTAUTH_URL || "https://munchlens.app"}/dashboard"
         style="display: inline-block; background: #f97316; color: white; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 600; font-size: 15px;">
        Hemen Kullanmaya Başla →
      </a>
    </div>
    <div style="padding: 16px 32px; border-top: 1px solid #f5f5f4; text-align: center;">
      <p style="margin: 0; font-size: 12px; color: #a8a29e;">
        Aboneliğinizi yönetmek için profil sayfanızı ziyaret edin. MunchLens © 2026
      </p>
    </div>
  </div>
</body>
</html>
      `,
    });
  } catch (err) {
    console.error("Pro activated email failed:", err);
  }
}
