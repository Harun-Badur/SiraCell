# SıraCell — Dijital Sıra Yönetim Sistemi

> **Turkcell CodeNight 2026** hackathon projesi.  
> Geliştirici: [@Harun-Badur](https://github.com/Harun-Badur)

---

## 🚀 Proje Hakkında

SıraCell, Turkcell şubelerinde müşteri bekleme süreçlerini dijitalleştiren, mobil öncelikli bir **Dijital Sıra Yönetim Platformu**dur. Müşteriler fiziksel kuyruğa girmeden QR/link ile sıraya katılabilir, personel ise web panelinden gişe işlemlerini yönetebilir.

---

## 🌟 Yeni Özellikler (Advanced UX)

Premium Turkcell Uygulaması deneyimini sağlamak için (Case 20p UI/UX Kriteri) gelişmiş arayüz özellikleri entegre edilmiştir:

1. **Skeleton Loaders:**
   - Şube Listesi ve Bilet Takip ekranlarında veri yüklenirken uygulamanın layout kalıplarını (pulse) birebir taklit eden, `#002855` tabanlı Skeleton Loading ekranları.
2. **Branded Empty States:**
   - Şube bulunamadığında veya aktif bilet olmadığında devasa Lucide ikonları (`SearchX`, `TicketSlash`) ve kurumsal Turkcell metinleri ("Geleceği birlikte kodlayalım!") ile desteklenen şık Boş Durum tasarımları.
3. **Toast Feedback:**
   - `react-hot-toast` entegrasyonu ile "Sıraya Katılma" yükleme durumları ("Biletiniz hazırlanıyor..."), Başarı ("Sıra alındı!") ve "Personel Müşteri Çağırma" aksiyonlarında çıkan özelleştirilmiş, yuvarlak hatlı Sarı/Lacivert kurumsal bildirimler.
4. **Kurumlar Arası Geçiş (Scalability):**
   - Ölçeklenebilirlik odağıyla "Kurum Seçimi" (Telekom, Banka, Kamu vb.) ana girişi ve kategori tabanlı şube listeleme yapısı kuruldu.
5. **Geçmiş Biletler (User History):**
   - Kullanıcıların önceki işlem detaylarını ("Tamamlandı", "Gelmedi") görebileceği Geçmiş Bilet takibi özelliği eklendi.
6. **Engelsiz Erişim (Accessibility):**
   - Yaşlı ve engelli müşterilerimiz için erişilebilirlik odaklı "Müşteri Önceliği" bildirim sistemi entegre edildi.
7. **Turkcell Anten Loader:**
   - Standart yükleme ikonları yerine Turkcell'e özgü CSS bazlı dönen "Anten" logosu geliştirildi.

---

## ✅ Case Analiz Dokümanı Gereksinimleri

| Gereksinim | Durum | Detay |
|---|---|---|
| **GSM Girişi + Simüle OTP** | ✅ | Sabit kod: `1234` (demo) |
| **Leaflet Harita Entegrasyonu** | ✅ | OpenStreetMap üzerinde şube konumları |
| **FIFO Sıra Mantığı** | ✅ | Backend FIFO; `POST /counter/call-next` |
| **Tahmini Bekleme Formülü** | ✅ | $\lceil(\text{waiting\_count} \times 5) / \text{active\_counters}\rceil$ dk |
| **3 Saniyelik Canlı Polling** | ✅ | `refetchInterval: 3000` — final state'te otomatik durur |
| **Personel Paneli** | ✅ | Çağır / Tamamla / Gelmedi / Gişe Aç-Kapat |
| **JWT Kimlik Doğrulama** | ✅ | Axios interceptor ile `Bearer` token |
| **Turkcell Kurumsal Renkler** | ✅ | Lacivert `#002855` + Sarı `#ffcc00` |

---

## 🏗 Mimari & Tasarım Prensipleri (Design System)

- **Köşe Yuvarlaklıkları:** Kart ve butonlarda modern `rounded-3xl` tercih edilmiştir.
- **Birincil Buton:** Turkcell Sarısı (`#ffcc00`), iç yazısı Koyu Lacivert (`#002855`).
- **Geçiş Efektleri:** Tüm interaktif ve hover durumları `transition-all duration-300` ile yumuşak hale getirilmiştir.

```
siracell-frontend/
├── src/
│   ├── api/                 # Axios yapılandırması
│   ├── components/
│   │   ├── Navbar.tsx       # Navbar + Resmi Turkcell SVG
│   │   └── Feedback.tsx     # react-hot-toast ayarları
│   ├── pages/               # Routing sayfaları (Login, BranchList vb.)
│   ├── types/               # TypeScript interface'leri
│   ├── App.tsx              # React Router yapılandırması
│   ├── index.css            # Turkcell CSS Token Sistemi
│   └── main.tsx
├── tailwind.config.js       # Özel custom token paketi
└── package.json
```

---

## 🛠 Tech Stack (Technical Implementation)

| Alan | Teknoloji / Kütüphane |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v4 + Özel CSS Tokens |
| Data Fetching | TanStack Query (Polling, Mutations) |
| Geri Bildirim | `react-hot-toast` + Animate-Pulse Skeleton |
| Harita | React-Leaflet + CARTO Voyager Teması |
| İkonlar | Lucide React |

---

## ⚙️ Kurulum & Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde açılır.

---

## 🎯 Canlı Demo Akışı (Requirement 10.3)

1. `/login` — GSM gir → OTP `1234` ile doğrula.
2. `/` — "Kurum Seçimi" yapın (Telekomünikasyon, Bankacılık vb.)
3. `/branches` — Haritada şubeleri gör, Skeleton sonrası listeyle karşılaş ve doluluk renklerine göre filtrele.
4. `/branch/:id` — Hizmet seçip sıraya katıl. (Engelsiz Erişim destekli). Toast üzerinden bilet hazırlandığını gör.
5. `/my-ticket/:ticketId` — Bilet durumunu dev ekranda canlı (3s) takip et.
6. `/history` — Geçmiş biletlerinizi kontrol edin.
7. `/staff` — Personel panelinden müşteri çağır, gelen toast bildirimini onayla.

---

*Turkcell CodeNight 2026 — "Geleceği Kodluyoruz"* 🚀
