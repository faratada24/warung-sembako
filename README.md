# Manajemen Keuangan Sembako & Hutang

Aplikasi **PWA (Progressive Web App)** untuk mengelola keuangan toko sembako dan hutang pelanggan dengan antarmuka yang sederhana, minimalis, dan elegan. Dioptimalkan untuk perangkat Android low-end.

## 🎯 Fitur Utama

### 📊 Dashboard
- **Ringkasan Finansial**: Tampilkan saldo akhir, pemasukan, dan pengeluaran
- **Status Hutang**: Total hutang aktif, hutang terbayar, dan hutang jatuh tempo
- **Transaksi Terbaru**: Daftar 5 transaksi terakhir
- **Quick Actions**: Tombol cepat untuk menambah transaksi dan hutang

### 💳 Pencatatan Transaksi
- **Tipe Transaksi**: Pemasukan dan pengeluaran
- **Kategori**: Beras, minyak, gula, telur, bumbu, dll
- **Metode Pembayaran**: Tunai, transfer, debit
- **Daftar Transaksi**: Lihat semua transaksi dengan opsi hapus
- **Filter & Cari**: (akan ditambahkan di versi mendatang)

### 📝 Pengelolaan Hutang
- **Kelola Pelanggan**: Tambah dan lihat daftar pelanggan
- **Catat Hutang**: Input hutang baru dengan tanggal jatuh tempo
- **Status Hutang**: Pending, jatuh tempo, lunas
- **Tandai Lunas**: Ubah status hutang menjadi lunas

### 📈 Laporan & Analisis
- **Filter Periode**: Tampilkan data berdasarkan tanggal
- **Summary Report**: Total pemasukan, pengeluaran, laba/rugi
- **Breakdown Kategori**: Analisis transaksi per kategori
- **Summary Harian**: Ringkasan harian dengan detail
- **Export Data**: Unduh laporan dalam format CSV atau JSON
- **Print**: Cetak laporan untuk dokumentasi

## 🛠️ Teknologi

- **Vue.js 3**: Framework JavaScript modern
- **Vite**: Build tool cepat
- **Dexie.js**: Database IndexedDB wrapper
- **Pinia**: State management
- **Tailwind CSS**: Styling minimalis dan responsif
- **PWA**: Progressive Web App untuk akses offline

## 📱 Kompatibilitas

- ✅ Berjalan di browser modern (Chrome, Firefox, Safari)
- ✅ Instalasi di home screen Android/iOS
- ✅ Akses offline-first
- ✅ Ukuran aplikasi sangat kecil (~2-3MB)
- ✅ Optimal untuk perangkat low-end (RAM 512MB+)

## 🚀 Instalasi & Penggunaan

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Akses di http://localhost:5173
```

### Production
```bash
# Build
npm run build

# Preview build
npm run preview

# Deploy file di folder 'dist' ke web server
```

### Instalasi di Android
1. Buka aplikasi di Chrome/Firefox
2. Tap menu (⋮) → "Install app" atau "Add to Home screen"
3. Aplikasi akan tersimpan di home screen seperti aplikasi native

## 📂 Struktur Folder

```
src/
├── main.js              # Entry point
├── App.vue              # Root component
├── css/
│   └── main.css        # Tailwind & custom styles
├── db/
│   └── init.js         # Database initialization
├── stores/
│   ├── transactionStore.js  # Transaction state
│   └── debtStore.js         # Debt state
├── pages/
│   ├── Dashboard.vue        # Dashboard page
│   ├── TransactionForm.vue  # Transaction page
│   ├── DebtManagement.vue   # Debt management page
│   └── Reports.vue          # Reports page
└── services/            # Helper functions
```

## 💾 Database Schema

### Transactions Table
```
- id (auto increment)
- date (YYYY-MM-DD)
- type (income|expense)
- categoryId (number)
- amount (number)
- description (string)
- paymentMethod (cash|transfer|debit)
```

### Debts Table
```
- id (auto increment)
- customerId (number)
- amount (number)
- dueDate (YYYY-MM-DD)
- status (pending|paid|overdue)
- notes (string)
- createdAt (YYYY-MM-DD)
```

### Customers Table
```
- id (auto increment)
- name (string)
- phone (string)
- address (string)
- totalDebt (number)
```

### Categories Table
```
- id (auto increment)
- name (string)
- type (income|expense)
```

## 🎨 Desain UI

- **Warna Tema**: Cyan (#06B6D4), Green (#10B981)
- **Layout**: Mobile-first, responsif
- **Aksesibilitas**: Font besar, kontras tinggi
- **Performance**: Minimal JS, CSS minimal

## 🔒 Keamanan & Privasi

- ✅ **Offline-first**: Data tersimpan lokal di device
- ✅ **No Cloud Sync**: Data tidak dikirim ke server
- ✅ **Enkripsi**: Dapat ditambahkan untuk backup
- ✅ **Permission**: Tidak meminta akses khusus

## 📊 Tips Penggunaan

1. **Awal Bulan**: Buka laporan untuk ringkasan bulan lalu
2. **Harian**: Catat transaksi langsung di hari itu
3. **Hutang**: Update status hutang saat pelanggan membayar
4. **Backup**: Export data CSV setiap minggu
5. **Audit**: Bandingkan laporan dengan catatan fisik

## 🐛 Troubleshooting

### Data Hilang?
- Data disimpan di IndexedDB browser
- Clear cache browser akan menghapus data
- Gunakan export untuk backup

### Aplikasi Crash?
- Refresh browser (Ctrl+R)
- Clear cache dan cookies
- Reinstall PWA

### Service Worker Offline?
- Pastikan manifest.json ada
- Check browser DevTools > Application

## 📈 Roadmap Fitur Mendatang

- [ ] Search & filter transaksi
- [ ] Backup & restore otomatis
- [ ] Chart & grafik visual
- [ ] Multi-user dengan PIN
- [ ] Backup ke cloud (Google Drive, Dropbox)
- [ ] Notifikasi hutang jatuh tempo
- [ ] Export ke Excel dengan formatting
- [ ] Kategori custom
- [ ] Invoice generator

## 📞 Dukungan

Untuk bug report atau fitur request, buat issue di repository ini.

---

**Versi**: 1.0.0  
**Lisensi**: MIT  
**Pembuat**: Keuangan Sembako Team
