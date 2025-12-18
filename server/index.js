require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Импорт моделей
const Product = require('./Models/Product');
const User = require('./Models/User');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_moda_2025"; // В реальности храни в .env

// --- 1. ПОДКЛЮЧЕНИЕ К MONGODB ---
// Если в .env нет адреса, используем локальный (должен быть установлен MongoDB) или Atlas
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/moda_store";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));


// --- 2. AUTH API (РЕАЛЬНАЯ АВТОРИЗАЦИЯ) ---

// Регистрация
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Проверка, есть ли такой email
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    // Шифрование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "Account created! Please login." });
  } catch (err) {
    res.status(500).json({ error: "Server error during registration" });
  }
});

// Логин
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ищем пользователя
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Сравниваем пароли
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Создаем токен
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, cart: user.cart, wishlist: user.wishlist } 
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// --- 3. PRODUCTS API ---

// Получить все товары из Базы Данных
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch products" });
  }
});

// Получить один товар
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// СЛУЖЕБНЫЙ РОУТ: Заполнить пустую базу товарами (вызвать один раз)
app.get('/api/seed', async (req, res) => {
  const INITIAL_PRODUCTS = [
    { id: 1, brand: "Massimo Dutti", name_en: "Wool Blend Camel Coat", name_ua: "Вовняне пальто Camel", price: 375, category: "Outerwear", gender: "Women", img: "/images/MassimoDuttiTrenchCoat.jpg", sizes: ["XS", "S", "M", "L"], desc_en: "Exquisite wool coat...", desc_ua: "Вишукане пальто..." },
    { id: 2, brand: "Burberry", name_en: "Detachable Sleeve Puffer Jacket", name_ua: "Пуховик зі знімними рукавами", price: 1500, category: "Outerwear", gender: "Unisex", img: "/images/BurberryJacket.jpg", sizes: ["S", "M", "L", "XL"], desc_en: "Versatile puffer...", desc_ua: "Універсальний пуховик..." },
    { id: 3, brand: "Arcteryx", name_en: "Beta SL Rain Jacket", name_ua: "Дощовик Beta SL", price: 365, category: "Outerwear", gender: "Men", img: "/images/ArcteryxJacket.jpg", sizes: ["S", "M", "L", "XL"], desc_en: "Superlight GORE-TEX...", desc_ua: "Надлегка куртка..." },
    { id: 4, brand: "Off-White", name_en: "Out Of Office Calf Leather", name_ua: "Шкіряні кросівки Out Of Office", price: 610, category: "Shoes", gender: "Unisex", img: "/images/OFFWhiteOffice.jpg", sizes: ["39", "40", "41", "44"], desc_en: "Iconic arrow motif...", desc_ua: "Низькі кросівки..." },
    { id: 5, brand: "Dr. Martens", name_en: "1460 Black Boots", name_ua: "Черевики 1460 Black", price: 225, category: "Shoes", gender: "Unisex", img: "/images/DrMartensBoots2.jpg", sizes: ["36", "38", "40", "42"], desc_en: "The original boot...", desc_ua: "Оригінальні черевики..." },
    { id: 6, brand: "Hugo", name_en: "Silk Black Dress", name_ua: "Шовкова чорна сукня", price: 230, category: "Dresses", gender: "Women", img: "/images/HugoBossDress2.jpg", sizes: ["XS", "S", "M"], desc_en: "Elegant silk dress...", desc_ua: "Елегантна сукня..." },
    { id: 7, brand: "Boss", name_en: "Grey Suit", name_ua: "Сірий костюм", price: 915, category: "Suits", gender: "Men", img: "/images/HugoBossSuit2.jpg", sizes: ["48", "50", "52"], desc_en: "Modern slim-fit suit...", desc_ua: "Сучасний костюм..." },
    { id: 8, brand: "Gucci", name_en: "Dionysus Mini Bag", name_ua: "Міні-сумка Dionysus", price: 1125, category: "Accessories", gender: "Women", img: "/images/GucciDionysus2.jpg", sizes: ["One Size"], desc_en: "Textured tiger head...", desc_ua: "Міні-сумка з застібкою..." },
    { id: 9, brand: "Tissot", name_en: "PRX Powermatic 80 35mm", name_ua: "Годинник PRX Powermatic 80", price: 395, category: "Accessories", gender: "Men", img: "/images/TissotPrx.jpg", sizes: ["35mm"], desc_en: "Flagship design...", desc_ua: "Дизайн 1978 року..." },
    { id: 10, brand: "Ray-Ban", name_en: "Round Metal Sunglasses", name_ua: "Круглі металеві окуляри", price: 160, category: "Accessories", gender: "Unisex", img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", sizes: ["Standard"], desc_en: "Retro-inspired...", desc_ua: "Ретро-стиль..." },
  ];
  
  await Product.deleteMany({}); // Очистить старое
  await Product.insertMany(INITIAL_PRODUCTS); // Вставить новое
  res.send("Database Seeded Successfully!");
});


// --- 4. NOVA AI (С ГИБРИДНОЙ ЛОГИКОЙ) ---
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const CANDIDATE_MODELS = ["gemini-1.5-flash", "gemini-pro"]; 

function getOfflineSuggestion(userText) {
  const txt = userText.toLowerCase();
  let reply = "I'm offline but here are some matches:";
  let ids = [];
  if (txt.includes('women') || txt.includes('dress')) { ids = [1, 6, 8]; reply = "Elegant choices for women."; }
  else if (txt.includes('men') || txt.includes('suit')) { ids = [3, 7, 9]; reply = "Stylish picks for men."; }
  else if (txt.includes('shoe')) { ids = [4, 5]; reply = "Check our footwear."; }
  else { ids = [2, 10]; reply = "Popular items."; }
  return { reply, products: ids };
}

app.post('/api/chat-stylist', async (req, res) => {
  const { messages } = req.body;
  const lastUserMessage = messages[messages.length - 1].content;
  
  // Достаем актуальные товары из базы для промпта
  const allProducts = await Product.find({}, 'id name_en gender category');

  if (!genAI) return res.json(getOfflineSuggestion(lastUserMessage));

  const prompt = `
    You are Nova, AI Stylist. 
    Catalog: ${JSON.stringify(allProducts)}
    User Request: "${lastUserMessage}"
    Return JSON: { "reply": "text", "products": [ids] }
  `;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json|```/g, '').trim();
      return res.json(JSON.parse(text));
    } catch (e) { console.log(`Model ${modelName} failed.`); }
  }
  res.json(getOfflineSuggestion(lastUserMessage));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));