const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'selimshop-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 saat
}));

const path = require('path');

// Ana sayfa - login'e yönlendir
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Ürünleri veritabanına ekle (ilk çalıştırmada)
async function initializeProducts() {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const products = [
        {
          name: "Forma",
          category: "Spor",
          price: 2250,
          description: "Orjinal Fenerbahçe forması.",
          imageUrl: "İmages/forma.jpeg"
        },
        {
          name: "Top",
          category: "Spor",
          price: 1200,
          description: "Puma Süper Lig Topu.",
          imageUrl: "İmages/top.jpeg"
        },
        {
          name: "Krampon",
          category: "Spor",
          price: 1950,
          description: "Nike Air Krampon.",
          imageUrl: "İmages/krampon.jpeg"
        },
        {
          name: "Telefon",
          category: "Teknoloji",
          price: 119999,
          description: "İphone 16 Pro Max 1TB",
          imageUrl: "İmages/telefon.jpeg"
        },
        {
          name: "Kulaklık",
          category: "Teknoloji",
          price: 1400,
          description: "Huawei Freebuds SE2 Kablosuz Kulaklık",
          imageUrl: "İmages/kulaklık.jpeg"
        },
        {
          name: "Akıllı Saat",
          category: "Teknoloji",
          price: 7800,
          description: "Samsung Galaxy Ultra Watch 5 Su Geçirmez",
          imageUrl: "İmages/Akıllı saat.jpeg"
        },
        {
          name: "Oyuncu Faresi",
          category: "Teknoloji",
          price: 2800,
          description: "Razer Cobra Pro 30000 DPI RGB Kablosuz Gaming Mouse",
          imageUrl: "İmages/fare.jpg"
        },
        {
          name: "Oyuncu Monitörü",
          category: "Teknoloji",
          price: 12200,
          description: "GameBooster 27 inç 360Hz 0.5ms gecikme FHD Gaming Monitör",
          imageUrl: "İmages/monitör.png"
        },
        {
          name: "Oyuncu Klavyesi",
          category: "Teknoloji",
          price: 8890,
          description: "Logitech G915 X LightSpeed Siyah Kablosuz Oyuncu Klavyesi",
          imageUrl: "İmages/klavye.jpg"
        },
        {
          name: "Doğal Kaynak Suyu",
          category: "Yiyecekİçecek",
          price: 5,
          description: "500ml Erikli Doğal Kaynak Suyu",
          imageUrl: "İmages/su.jpeg"
        },
        {
          name: "Ülker Çikolatalı Gofret",
          category: "Yiyecekİçecek",
          price: 12,
          description: "Ülker Çikolatalı Gofret",
          imageUrl: "İmages/Gofret.jpeg"
        },
        {
          name: "Beypazarı Doğal Maden Suyu",
          category: "Yiyecekİçecek",
          price: 14,
          description: "Beypazarı Doğal Maden Suyu 250ml",
          imageUrl: "İmages/soda.png"
        },
        {
          name: "İzmit Simidi",
          category: "Yiyecekİçecek",
          price: 15,
          description: "İzmit Simidi Tadı Efsanedir İzmitli Olarak Üzerinde Tam 10.000 Susam Vardır (Saydım)",
          imageUrl: "İmages/simit.jpeg"
        },
        {
          name: "Çikolatalı Süt",
          category: "Yiyecekİçecek",
          price: 8,
          description: "200ml Çikolatalı Süt",
          imageUrl: "İmages/süt.jpg"
        },
        {
          name: "İkram Bisküvi",
          category: "Yiyecekİçecek",
          price: 19,
          description: "İkram Bisküvi 200gr",
          imageUrl: "İmages/bisküvi.jpeg"
        }
      ];
      
      await Product.insertMany(products);
      console.log("Ürünler veritabanına eklendi");
    }
  } catch (error) {
    console.error("Ürün ekleme hatası:", error);
  }
}

// Login/Register API
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      // Kullanıcı yok, yeni kullanıcı oluştur
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
      
      // Kullanıcı için sepet oluştur
      const newCart = new Cart({ userId: newUser._id, items: [], totalAmount: 0 });
      await newCart.save();
      
      req.session.userId = newUser._id;
      req.session.username = username;
      
      return res.json({ status: "registered", message: "Kayıt oldunuz, hoş geldiniz!" });
    }

    // Kullanıcı varsa şifre kontrolü
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ status: "wrong_password", message: "Şifreniz yanlış!" });
    }

    // Doğru şifre - session'a kaydet
    req.session.userId = user._id;
    req.session.username = username;
    
    return res.json({ status: "success", message: "Hoş geldiniz!" });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ status: "error", message: "Sunucu hatası." });
  }
});

// Kullanıcı kontrolü middleware
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Giriş yapmanız gerekiyor" });
  }
  next();
};

// Ürünleri getir API
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    if (category && category !== 'Tümü') {
      query.category = category;
    }
    
    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error('Ürün getirme hatası:', error);
    res.status(500).json({ error: "Ürünler yüklenirken hata oluştu" });
  }
});

// Sepeti getir API
app.get('/api/cart', requireAuth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.session.userId }).populate('items.productId');
    
    if (!cart) {
      cart = new Cart({ userId: req.session.userId, items: [], totalAmount: 0 });
      await cart.save();
    }
    
    res.json(cart);
  } catch (error) {
    console.error('Sepet getirme hatası:', error);
    res.status(500).json({ error: "Sepet yüklenirken hata oluştu" });
  }
});

// Sepete ürün ekle API
app.post('/api/cart/add', requireAuth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Ürün bulunamadı" });
    }
    
    let cart = await Cart.findOne({ userId: req.session.userId });
    if (!cart) {
      cart = new Cart({ userId: req.session.userId, items: [], totalAmount: 0 });
    }
    
    // Ürün sepette var mı kontrol et
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = product.price;
    } else {
      cart.items.push({
        productId: productId,
        quantity: quantity,
        price: product.price
      });
    }
    
    // Toplam tutarı hesapla
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    cart.updatedAt = new Date();
    
    await cart.save();
    
    // Populate edilmiş cart'ı döndür
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    
    res.json({ message: "Ürün sepete eklendi", cart: populatedCart });
  } catch (error) {
    console.error('Sepete ekleme hatası:', error);
    res.status(500).json({ error: "Ürün sepete eklenirken hata oluştu" });
  }
});

// Sepetten ürün çıkar API
app.delete('/api/cart/remove/:productId', requireAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    
    let cart = await Cart.findOne({ userId: req.session.userId });
    if (!cart) {
      return res.status(404).json({ error: "Sepet bulunamadı" });
    }
    
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    cart.updatedAt = new Date();
    
    await cart.save();
    
    // Populate edilmiş cart'ı döndür
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    
    res.json({ message: "Ürün sepetten çıkarıldı", cart: populatedCart });
  } catch (error) {
    console.error('Sepetten çıkarma hatası:', error);
    res.status(500).json({ error: "Ürün sepetten çıkarılırken hata oluştu" });
  }
});

// Sepeti temizle API
app.delete('/api/cart/clear', requireAuth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.session.userId });
    if (!cart) {
      return res.status(404).json({ error: "Sepet bulunamadı" });
    }
    
    cart.items = [];
    cart.totalAmount = 0;
    cart.updatedAt = new Date();
    
    await cart.save();
    
    // Populate edilmiş cart'ı döndür
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    
    res.json({ message: "Sepet temizlendi", cart: populatedCart });
  } catch (error) {
    console.error('Sepet temizleme hatası:', error);
    res.status(500).json({ error: "Sepet temizlenirken hata oluştu" });
  }
});

// Sepet miktarını güncelle API
app.put('/api/cart/update', requireAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    if (quantity <= 0) {
      return res.status(400).json({ error: "Miktar 0'dan büyük olmalı" });
    }
    
    let cart = await Cart.findOne({ userId: req.session.userId });
    if (!cart) {
      return res.status(404).json({ error: "Sepet bulunamadı" });
    }
    
    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ error: "Ürün sepette bulunamadı" });
    }
    
    item.quantity = quantity;
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    cart.updatedAt = new Date();
    
    await cart.save();
    
    // Populate edilmiş cart'ı döndür
    const populatedCart = await Cart.findById(cart._id).populate('items.productId');
    
    res.json({ message: "Miktar güncellendi", cart: populatedCart });
  } catch (error) {
    console.error('Miktar güncelleme hatası:', error);
    res.status(500).json({ error: "Miktar güncellenirken hata oluştu" });
  }
});

// Çıkış yap API
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Çıkış yapılırken hata oluştu" });
    }
    res.json({ message: "Başarıyla çıkış yapıldı" });
  });
});

// Statik dosyaları servis et
app.use(express.static('public'));

// Ürünleri başlat
initializeProducts();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));
