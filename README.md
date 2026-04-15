# 🚀 SiraCell – Turkcell CodeNight 2026 (Final Boss Sürümü)

SiraCell, Turkcell mağazalarının yoğunluğunu dijital ortamda yönetmek, mağaza içi operasyonları şeffaflaştırmak ve fiziksel sıraları optimize etmek amacıyla **Turkcell CodeNight 2026** için geliştirilmiş Premium Uçtan Uca Bilet/Sıra Yönetim platformudur.

## 🌟 Öne Çıkan Core Strengths

Projemiz, teknik gereksinimlerin çok ötesine geçerek iki dev konsepti merkeze almıştır:

1. **Accessibility (Öncelikli Sıra Erişimi):** Proje, dezavantajlı grupları unutmadan, `Yaşlı ve Engelli` kullanıcılarımız için görsel olarak özelleştirilmiş, fiziksel mağazaya VIP uyarısı gönderen **"Engelsiz Erişim"** Priority Toggle sistemini gururla sunar.
2. **Live Polling (Gerçek Zamanlı Takip):** Sıradaki kullanıcıların durumunu ve önlerindeki kişi sayısını statik bırakmak yerine güçlü `TanStack Query` polling mekanizmasıyla anlık verilerle canlı tutarak müthiş bir pürüzsüzlük sağlar.

---

## ✅ Mandatory Features (Zorunlu Gereksinimler)

Tüm CodeNight 2026 gereksinimleri katı biçimde karşılanmıştır:

- [x] **Şube Listeleme (Harita & Yoğunluk):** `BranchListPage` üzerinde interaktif `React-Leaflet` haritası ve dinamik yoğunluk renklendirmeleriyle ("Çok Yoğun", "Normal", "Sakin") İstanbul şubeleri listelenmektedir.
- [x] **Bilet Alma & Kuyruğa Katılma:** Mağaza detaylarında hizmet kategorileri listelenip bilet oluşturma isteği (Engelsiz Erişim destekli) atılabilmektedir.
- [x] **Tahmini Bekleme Süresi Algoritması:** Sistem bekleme süresini CodeNight belgesindeki formüle göre matematiğe döker:
  >`Tahmini Süre = ⌈ (Bekleyen Müşteri Sayısı × 5 Dk) / Aktif Gişe Sayısı ⌉`
- [x] **Canlı Bilet Statüsü (Oturum Yönetimi):** QR bilet no, aktif sıra ve gişe çağırmaları "Live Polling" ile anlık yansıtılır.
- [x] **Staff Analytics Dashboard:** Personelin aktif müşteriyi çağırdığı, Bitirdiği (DONE) veya "Gelmedi" (NO-SHOW) çektiği Staff paneline "Gelişmiş personel performans paneli (Dashboard)" entegre edilmiştir.
- [x] **Kurumlar Arası Geçiş (Scalability):** Birden fazla endüstriyi (Banka, Kamu, Telekom) barındırabilen ana menü altyapısı mevcuttur.

---

## 🏆 Bonus & UI/UX Features (Jüri Magnet)

Projenin jüriyi "Wow" efektiyle etkilemesi için yüksek eforlu geliştirmeler yapılmıştır:

*   **Turkcell Anten Loader:** Standart UI loader'ları yerine tüm projeye Turkcell'in SVG tabanlı "dönen anten" çizimi yedeklenmiştir.
*   **Skeleton Loading & Empty States:** Şube verileri yüklenirken arayüz elementlerinin formunu taklit eden *Pulse Skeleton* ekranları ve verisiz durumlar için kreatif "Boş Durum" illüstrasyonları (Retry destekli).
*   **Smart Toast Notifications:** Müşterinin önünde 2 kişiden az kaldığında tetiklenen, göz alıcı titreşimli "Sıranız Yaklaşıyor!" alert'i.
*   **NPS Sistemi (Hizmetimizi Puanlayın):** Bilet işlemi `DONE` olduğu saniye anında beliren tam ekran Glassmorphism yıldız değerlendirmesi modal'i.
*   **User History (Geçmiş Biletler):** Kullanıcıların geçmiş işlem verilerini kontrol edebileceği şık bilet arşivi.

> [!NOTE] 
> **Kapsam Dışı (Out of Scope) Bildirimi:** CodeNight dokümantasyonu uyarınca "Ödeme İşlemleri (Payment Gateway)" projenin MVP kapsamı dışındadır ve implemente edilmemiştir.

---

## 🛠 Teknik Mimari & Test Mimarisi

*   **Frontend Teknolojileri:** React 18, Vite, TypeScript, TailwindCSS (Sıkı `#002855` / `#ffcc00` palet uyumu), TanStack Query, React Router, Lucide Icons, Leaflet.
*   **Interceptor Mock Layer:** Proje, içerisinde direkt olarak `axiosInstance.ts` tabanlı profesyonel bir **Fake Mock Katmanı** barındırır. Backend henüz ayağa kalkmasa bile gecikmeli yüklenme senaryoları, Skeletons, Bilet statü değişimleri ve Dashboard rakamları izole şekilde mükemmel test edilebilir.

### 🎯 Kurulum ve Çalıştırma

```bash
git clone https://github.com/Harun-Badur/SiraCell.git
cd siracell-frontend
npm install
npm run dev
```

*(Projeye "Final Boss" statüsüne kadar tüm eklentiler yapılmıştır. Terminal üzerinden `http://localhost:5173` tıklanarak lokal sunucu gezilebilir.)*
