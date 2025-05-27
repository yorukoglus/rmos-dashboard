# RMOS Dashboard

## 🚀 Teknolojiler

- **Next.js 14** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Stil ve tasarım
- **i18next** - Çoklu dil desteği
- **Recharts** - Grafik ve veri görselleştirme
- **React Context** - State yönetimi
- **Zustand** - State yönetimi

## 📁 Klasör Yapısı

```
src/
├── app/                       # Next.js 14 app router yapısı
│   ├── (auth)/                # Kimlik doğrulama ile ilgili sayfalar
│   ├── (dashboard)/           # Dashboard sayfaları
│   │   ├── forecast/          # Tahmin sayfası
│   │   └── ...                # Diğer dashboard sayfaları
│   ├── api/                   # API route'ları
│   └── layout.tsx             # Ana layout
├── components/                # Yeniden kullanılabilir bileşenler
│   ├── FormField.tsx          # Form alanı bileşeni
│   └── ...                    # Diğer bileşenler
├── stores/                    # React context'leri
│   └── AuthContext.tsx        # Kimlik doğrulama context'i
│   └── notificationStore.ts   # Bildirim store'u
├── types/                     # TypeScript tip tanımlamaları
│   └── api.ts                 # API ile ilgili tipler
├── utils/                     # Yardımcı fonksiyonlar
│   ├── api.ts                 # API istekleri için yardımcı fonksiyonlar
│   └── utils.ts               # Genel yardımcı fonksiyonlar
└── public/                    # Statik dosyalar
    └── locales/               # Dil dosyaları
```

## 🏗️ Mimari Yapı

### App Router Yapısı

- `(auth)` ve `(dashboard)` grupları ile sayfalar mantıksal olarak ayrılmıştır
- Her sayfa kendi içinde bağımsız ve modüler yapıdadır
- Layout'lar ile ortak UI elementleri yönetilmektedir

### Bileşen Yapısı

- Bileşenler `components` klasöründe organize edilmiştir
- Her bileşen kendi sorumluluğuna sahiptir
- FormField gibi yeniden kullanılabilir bileşenler özelleştirilebilir

### Durum Yönetimi

- React Context API kullanılarak global durum yönetimi sağlanmıştır
- AuthContext ile kimlik doğrulama durumu yönetilmektedir

### API İletişimi

- Merkezi bir API yapısı kullanılmaktadır
- TypeScript ile tip güvenliği sağlanmıştır
- API endpoint'leri `types/api.ts` içinde tanımlanmıştır

### Çoklu Dil Desteği

- i18next ile çoklu dil desteği sağlanmıştır
- Dil dosyaları `public/locales` klasöründe bulunmaktadır

## 🎨 Stil ve Tasarım

- Tailwind CSS ile modern ve responsive tasarım
- Tutarlı renk şeması ve tipografi
- Özelleştirilebilir tema yapısı

## 🔧 Geliştirme

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build'i al
npm run build
```

## 📝 Notlar

- TypeScript strict mode aktif
- ESLint ve Prettier ile kod kalitesi kontrolü
- Modüler ve sürdürülebilir kod yapısı
- Performans optimizasyonları
