# SelimShop - Tam Veritabanı Tabanlı E-Ticaret Sistemi

## 🚀 Sistem Özellikleri

### 1. Kullanıcı Yönetimi (Tam Veritabanı Tabanlı)
- **Otomatik Kayıt**: İlk girişte kullanıcı otomatik kayıt olur
- **Güvenli Giriş**: Şifreler bcrypt ile hash'lenir
- **Session Yönetimi**: Express-session ile güvenli oturum
- **Otomatik Sepet**: Her kullanıcı için otomatik sepet oluşturulur

### 2. Ürün Yönetimi (MongoDB)
- **Dinamik Ürünler**: Tüm ürünler veritabanından çekilir
- **Kategori Filtreleme**: Backend API ile kategori bazlı filtreleme
- **Ürün Detayları**: Modal ile detaylı ürün görünümü
- **Stok Yönetimi**: Ürün stok bilgileri veritabanında

### 3. Sepet Sistemi (Tam Veritabanı)
- **Kullanıcı Bazlı Sepet**: Her kullanıcının kendi sepeti
- **Gerçek Zamanlı Güncelleme**: Sepet değişiklikleri anında veritabanına kaydedilir
- **Miktar Kontrolü**: Ürün miktarları dinamik olarak değiştirilebilir
- **Toplam Hesaplama**: Otomatik toplam fiyat hesaplama

### 4. API Endpoints
- `POST /api/login` - Giriş/Kayıt
- `GET /api/products` - Ürün listesi (kategori filtresi ile)
- `GET /api/cart` - Kullanıcı sepeti
- `POST /api/cart/add` - Sepete ürün ekleme
- `PUT /api/cart/update` - Sepet miktar güncelleme
- `DELETE /api/cart/remove/:productId` - Sepetten ürün çıkarma
- `DELETE /api/cart/clear` - Sepeti temizleme
- `POST /api/logout` - Çıkış yapma

## 📋 Kurulum Adımları

### 1. MongoDB Kurulumu
```bash
# MongoDB Community Server'ı indirin ve kurun
# https://www.mongodb.com/try/download/community
```

### 2. Proje Bağımlılıkları
```bash
npm install
```

### 3. Çevre Değişkenleri
Proje ana dizininde `.env` dosyası oluşturun:
```
MONGO_URI=mongodb://localhost:27017/selimshop
PORT=3000
```

### 4. Sunucuyu Başlatma
```bash
node server.js
```

## 🗄️ Veritabanı Yapısı

### Collections:

#### users
```javascript
{
  _id: ObjectId,
  username: String (unique),
  password: String (hashed)
}
```

#### products
```javascript
{
  _id: ObjectId,
  name: String,
  category: String,
  price: Number,
  description: String,
  imageUrl: String,
  stock: Number
}
```

#### carts
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  items: [{
    productId: ObjectId (ref: products),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Sistem Mimarisi

### Backend (Node.js + Express)
- **Session Yönetimi**: Express-session
- **Veritabanı**: MongoDB + Mongoose
- **Güvenlik**: bcrypt password hashing
- **API**: RESTful endpoints

### Frontend (HTML + CSS + JavaScript)
- **Dinamik İçerik**: Fetch API ile backend'den veri çekme
- **Responsive Design**: Modern CSS ile responsive tasarım
- **Modal Sistemi**: Ürün detayları için modal
- **Real-time Updates**: Sepet güncellemeleri anlık

## 🎯 Kullanım Senaryoları

### 1. Kullanıcı Girişi
1. Kullanıcı login sayfasına gider
2. Kullanıcı adı ve şifre girer
3. Sistem kullanıcıyı kontrol eder
4. İlk girişse otomatik kayıt olur
5. Başarılı girişte mağaza sayfasına yönlendirilir

### 2. Alışveriş Süreci
1. Kullanıcı ürünleri görüntüler
2. Kategori filtreleme yapar
3. Ürün detaylarını inceler
4. Miktar seçer ve sepete ekler
5. Sepet sayfasından sepeti yönetir

### 3. Sepet Yönetimi
1. Sepetteki ürünleri görüntüler
2. Miktarları artırır/azaltır
3. Ürünleri sepetten çıkarır
4. Sepeti tamamen temizler
5. Ana sayfaya döner

## 🔒 Güvenlik Özellikleri

- **Şifre Hashleme**: bcrypt ile güvenli şifre saklama
- **Session Yönetimi**: Güvenli oturum kontrolü
- **API Koruması**: Authentication middleware
- **Input Validation**: Giriş verilerinin doğrulanması

## 🚀 Performans Özellikleri

- **Veritabanı İndeksleme**: Hızlı sorgu performansı
- **Statik Dosya Sunumu**: Optimize edilmiş dosya servisi
- **Asenkron İşlemler**: Non-blocking API çağrıları
- **Error Handling**: Kapsamlı hata yönetimi

## 📱 Responsive Tasarım

- **Mobile First**: Mobil cihazlara uyumlu
- **Modern UI**: Kullanıcı dostu arayüz
- **Smooth Animations**: Akıcı geçişler
- **Cross-browser**: Tüm modern tarayıcılarda çalışır
