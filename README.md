# SıraCell — Dijital Sıra Yönetim Sistemi

> **Turkcell CodeNight 2026** hackathon projesi.  
> Geliştirici: [@Harun-Badur](https://github.com/Harun-Badur)

---

## 🚀 Proje Hakkında

SıraCell, Turkcell şubelerinde müşteri bekleme süreçlerini dijitalleştiren, mobil öncelikli bir **Dijital Sıra Yönetim Platformu**dur. Müşteriler fiziksel kuyruğa girmeden QR/link ile sıraya katılabilir, personel ise web panelinden gişe işlemlerini yönetebilir.

---

## ✅ Case Analiz Dokümanı Gereksinimleri

| Gereksinim | Durum | Detay |
|---|---|---|
| **GSM Girişi + Simüle OTP** | ✅ | Sabit kod: `1234` (demo) |
| **Leaflet Harita Entegrasyonu** | ✅ | OpenStreetMap üzerinde şube konumları |
| **FIFO Sıra Mantığı** | ✅ | Backend FIFO; `POST /counter/call-next` |
| **Tahmini Bekleme Formülü** | ✅ | `⌈(waitingCount × 5) / activeCounters⌉` dk |
| **3 Saniyelik Canlı Polling** | ✅ | `refetchInterval: 3000` — final state'te otomatik durur |
| **Personel Paneli** | ✅ | Çağır / Tamamla / Gelmedi / Gişe Aç-Kapat |
| **JWT Kimlik Doğrulama** | ✅ | Axios interceptor ile `Bearer` token |
| **Turkcell Kurumsal Renkler** | ✅ | Lacivert `#002855` + Sarı `#ffcc00` |

---

## 🏗 Mimari

```
siracell-frontend/
├── src/
│   ├── api/
│   │   └── axiosInstance.ts      # JWT interceptor, base URL
│   ├── components/
│   │   └── Navbar.tsx            # Logo, logout
│   ├── pages/
│   │   ├── LoginPage.tsx         # GSM + OTP (2 adım)
│   │   ├── BranchListPage.tsx    # Harita + şube listesi (doluluk rengi)
│   │   ├── BranchDetailPage.tsx  # Hizmet seçimi + sıraya katıl
│   │   ├── TicketStatusPage.tsx  # Canlı bilet takibi (3s polling)
│   │   └── StaffPanelPage.tsx    # Personel işlem paneli
│   ├── types/
│   │   └── index.ts              # Branch, QueueTicket, User, UserRole
│   ├── App.tsx                   # Routing + ProtectedRoute
│   └── main.tsx
├── .gitignore
├── tailwind.config.js            # turkcell + darkblue renk token'ları
├── postcss.config.js
├── vite.config.ts
└── package.json
```

---

## 🛠 Tech Stack

| Alan | Teknoloji |
|---|---|
| Framework | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v4 |
| Data Fetching | TanStack Query (polling, mutations) |
| HTTP | Axios (JWT interceptor) |
| Harita | React-Leaflet + OpenStreetMap |
| İkonlar | Lucide React |
| Router | React Router v6 |

---

## ⚙️ Kurulum & Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde açılır.

### Ortam Değişkenleri

```env
# .env.local
VITE_API_URL=http://localhost:8000/api/v1
```

---

## 🎯 Canlı Demo Akışı (Requirement 10.3)

1. `/login` — GSM gir → OTP `1234` ile doğrula
2. `/` — Haritada şubeleri gör, doluluk renklerine göre filtrele
3. `/branch/:id` — Hizmet seçip sıraya katıl, tahmini süreyi gör
4. `/my-ticket/:ticketId` — Bilet durumunu 3s'de bir otomatik takip et
5. `/staff` — Personel panelinden müşteri çağır, işlemi tamamla veya gelmedi işaretle

---

## 📌 Demo Notları

- **OTP Kodu:** `1234` (simülasyon)
- **Backend:** FastAPI — `c:\siracell` dizininde, `http://localhost:8000`
- **Veritabanı:** SQLite (`siracell.db`) — `queue_tickets` tablosunda `branch_id + status` bileşik indeksi mevcut

---

*Turkcell CodeNight 2026 — "Geleceği Kodluyoruz"* 🚀
