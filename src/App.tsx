import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import { 
  Search, 
  Menu, 
  ShoppingBag, 
  Home, 
  Grid, 
  MessageSquare, 
  User, 
  ChevronLeft, 
  ChevronRight,
  X,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Truck,
  Settings,
  Camera,
  Package,
  List,
  Facebook,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { divisions, districts, upazilas, getDefaultUpazilas } from './data/bangladesh';

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCxO0RedANiZZz91p5VwWhXmfIowPKMFDc",
  authDomain: "profit-4b313.firebaseapp.com",
  databaseURL: "https://profit-4b313-default-rtdb.firebaseio.com",
  projectId: "profit-4b313",
  storageBucket: "profit-4b313.firebasestorage.app",
  messagingSenderId: "169304347902",
  appId: "1:169304347902:web:02cf5536a9301f4c2701af"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  purchasePrice: number;
  overheadCost: number;
  discount?: number;
  image: string;
  category: string;
  description: string;
  stock: number;
  inStock: boolean;
  colors?: string[];
  sizes?: string[];
}

interface Category {
  id: string;
  name: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  address: string;
  phone: string;
  city: string;
  items: CartItem[];
  total: number;
  deliveryCharge: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  timestamp: number;
}

interface DeliverySetting {
  city: string;
  charge: number;
}

interface AppSettings {
  deliveryCharges: DeliverySetting[];
  banners: string[];
  adminPass: string;
  fbMessageLink: string;
  phone: string;
  email: string;
  address: string;
  fbLink: string;
  igLink: string;
  ytLink: string;
  tkLink: string;
}

// Initial Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: "Kids Premium Hijab Set",
    price: 1250,
    oldPrice: 1450,
    discount: 14,
    image: "https://picsum.photos/seed/hijab1/400/500",
    category: "Kids Collection",
    description: "High quality breathable fabric for kids.",
    stock: 50,
    inStock: true,
    purchasePrice: 800,
    overheadCost: 50
  },
  {
    id: 'p2',
    name: "Girls Floral Abaya",
    price: 1800,
    oldPrice: 2000,
    discount: 10,
    image: "https://picsum.photos/seed/abaya1/400/500",
    category: "Kids Collection",
    description: "Beautiful floral design with soft material.",
    stock: 30,
    inStock: true,
    purchasePrice: 1200,
    overheadCost: 100
  },
  {
    id: 'p3',
    name: "Boys Panjabi Collection",
    price: 950,
    oldPrice: 1100,
    discount: 13,
    image: "https://picsum.photos/seed/panjabi1/400/500",
    category: "Men Collection",
    description: "Elegant panjabi for boys.",
    stock: 4,
    inStock: true,
    purchasePrice: 600,
    overheadCost: 50
  }
];

const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: "Kids Collection", image: "https://picsum.photos/seed/cat1/200/200" },
  { id: 'c2', name: "Women Collection", image: "https://picsum.photos/seed/cat2/200/200" },
  { id: 'c3', name: "Men Collection", image: "https://picsum.photos/seed/cat3/200/200" },
  { id: 'c4', name: "All Products", image: "https://picsum.photos/seed/cat4/200/200" }
];

// UI Components
function ProductCard({ product, addToCart, setView, setSelectedProduct }: any) {
  return (
    <div 
      onClick={() => { setSelectedProduct(product); setView('product'); window.scrollTo(0, 0); }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded">
            {product.discount}%
          </div>
        )}
        {(product.stock === 0 || product.inStock === false) && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-red-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 h-10 mb-1">{product.name}</h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-[#e62e04] font-bold">৳{product.price}</span>
          {product.oldPrice && (
            <span className="text-gray-400 text-xs line-through">৳{product.oldPrice}</span>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            disabled={product.stock === 0 || product.inStock === false}
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
            className={`flex-1 text-[10px] font-bold py-2 rounded-lg transition-colors ${
              (product.stock === 0 || product.inStock === false)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            Add to Cart
          </button>
          <button 
            disabled={product.stock === 0 || product.inStock === false}
            onClick={(e) => { e.stopPropagation(); addToCart(product); setView('checkout'); }}
            className={`flex-1 text-[10px] font-bold py-2 rounded-lg transition-colors ${
              (product.stock === 0 || product.inStock === false)
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-[#e62e04] text-white hover:bg-[#c42703]'
            }`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

const ProductCarousel = ({ products, setView, setSelectedProduct }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselProducts = products.filter((p: any) => p.image).slice(0, 10);

  useEffect(() => {
    if (carouselProducts.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselProducts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselProducts.length]);

  if (carouselProducts.length === 0) return null;

  return (
    <div className="px-4 mb-6">
      <div className="relative rounded-2xl overflow-hidden aspect-[16/9] shadow-md bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-full h-full cursor-pointer"
            onClick={() => { setSelectedProduct(carouselProducts[currentIndex]); setView('product'); window.scrollTo(0,0); }}
          >
            <img
              src={carouselProducts[currentIndex].image}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
              <p className="text-white font-bold text-sm line-clamp-1">{carouselProducts[currentIndex].name}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {carouselProducts.map((_: any, i: number) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-white w-4' : 'bg-white/40'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductDetailsPage = ({ product, addToCart, setView }: any) => {
  if (!product) return null;

  return (
    <div className="pt-32 pb-24 px-4 max-w-md mx-auto animate-in">
      <button onClick={() => setView('home')} className="mb-6 flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Back to Home
      </button>
      
      <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 mb-8">
        <img src={product.image} className="w-full aspect-square object-cover" referrerPolicy="no-referrer" />
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-[10px] font-black text-[#e62e04] uppercase tracking-[0.2em] mb-2">{product.category}</p>
          <h1 className="text-2xl font-black text-gray-800 leading-tight mb-3">{product.name}</h1>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black text-[#e62e04]">৳{product.price}</span>
            {product.oldPrice && (
              <span className="text-gray-400 text-lg line-through font-bold">৳{product.oldPrice}</span>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            onClick={() => addToCart(product)}
            className="flex-1 bg-gray-100 text-gray-800 py-4 rounded-2xl font-black text-sm active:scale-95 transition-all"
          >
            Add to Cart
          </button>
          <button 
            onClick={() => { addToCart(product); setView('checkout'); }}
            className="flex-1 bg-[#e62e04] text-white py-4 rounded-2xl font-black text-sm shadow-lg shadow-red-200 active:scale-95 transition-all"
          >
            Buy Now
          </button>
        </div>

        <div className="pt-10">
          <h3 className="text-sm font-black text-gray-800 mb-4 uppercase tracking-widest border-b pb-2">Product Description</h3>
          <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap font-medium bg-gray-50 p-6 rounded-[24px]">
            {product.description || "No description available for this product."}
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = ({ settings, categories, products, addToCart, setView, setSelectedCategory, setSelectedProduct }: any) => (
  <div className="pt-32 pb-10">
    {/* Product Image Carousel */}
    <ProductCarousel products={products} setView={setView} setSelectedProduct={setSelectedProduct} />

    {/* Categories */}
    <div className="px-4 mb-8">
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((cat: any) => (
          <div 
            key={cat.id} 
            onClick={() => { setSelectedCategory(cat.name); setView('category'); window.scrollTo(0,0); }}
            className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#ffe8e4] p-2 flex items-center justify-center shadow-sm overflow-hidden">
              <img src={cat.image} className="w-full h-full object-cover rounded-lg" />
            </div>
            <span className="text-[11px] font-bold text-center text-gray-700 leading-tight">{cat.name}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Best Selling */}
    <div className="px-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Best Selling Product</h2>
        <button onClick={() => { setSelectedCategory("All Products"); setView('category'); window.scrollTo(0,0); }} className="text-[#e62e04] text-sm font-bold">View All</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {products.slice(0, 4).map((p: any) => (
          <ProductCard key={p.id} product={p} addToCart={addToCart} setView={setView} setSelectedProduct={setSelectedProduct} />
        ))}
      </div>
    </div>

    {/* New Arrivals */}
    <div className="px-4 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">New Arrivals</h2>
        <button onClick={() => { setSelectedCategory("All Products"); setView('category'); window.scrollTo(0,0); }} className="text-[#e62e04] text-sm font-bold">View All</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {products.slice(4, 8).map((p: any) => (
          <ProductCard key={p.id} product={p} addToCart={addToCart} setView={setView} setSelectedProduct={setSelectedProduct} />
        ))}
      </div>
    </div>
  </div>
);

const CategoryPage = ({ setView, selectedCategory, products, addToCart, categories, setSelectedCategory, setSelectedProduct }: any) => (
  <div className="pt-32 pb-24 px-4">
    <div className="flex items-center gap-4 mb-6">
      <button onClick={() => setView('home')} className="p-2 bg-gray-100 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
      <h2 className="text-xl font-bold">{selectedCategory || "All Categories"}</h2>
    </div>
    
    {!selectedCategory ? (
      <div className="grid grid-cols-3 gap-4">
        {categories.map((cat: any) => (
          <div 
            key={cat.id} 
            onClick={() => setSelectedCategory(cat.name)}
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className="w-full aspect-square rounded-2xl bg-[#ffe8e4] p-3 flex items-center justify-center shadow-sm overflow-hidden">
              <img src={cat.image} className="w-full h-full object-cover rounded-lg" />
            </div>
            <span className="text-[11px] font-bold text-center text-gray-700 leading-tight">{cat.name}</span>
          </div>
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-4">
        {products
          .filter((p: any) => selectedCategory === "All Products" || p.category === selectedCategory)
          .map((p: any) => (
            <ProductCard key={p.id} product={p} addToCart={addToCart} setView={setView} setSelectedProduct={setSelectedProduct} />
          ))}
      </div>
    )}
  </div>
);

const CartPage = ({ cart, setView, updateQuantity, removeFromCart, cartTotal }: any) => (
  <div className="pt-32 pb-24 px-4">
    <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
    {cart.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-20">
        <ShoppingBag className="w-20 h-20 text-gray-200 mb-4" />
        <p className="text-gray-500 mb-6">Your cart is empty</p>
        <button onClick={() => setView('home')} className="bg-[#e62e04] text-white px-8 py-3 rounded-xl font-bold">Shop Now</button>
      </div>
    ) : (
      <div className="space-y-4">
        {cart.map((item: any) => (
          <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl border">
            <img src={item.image} className="w-20 h-20 object-cover rounded-lg" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h3>
              <p className="text-[#e62e04] font-bold text-sm mb-2">৳{item.price}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-2 py-1">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1"><Minus className="w-4 h-4" /></button>
                  <span className="font-bold text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1"><Plus className="w-4 h-4" /></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500"><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        ))}
        <div className="bg-white p-4 rounded-xl border mt-6 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>৳{cartTotal}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-3 border-t">
            <span>Total</span>
            <span className="text-[#e62e04]">৳{cartTotal}</span>
          </div>
          <button onClick={() => setView('checkout')} className="w-full bg-[#e62e04] text-white py-4 rounded-xl font-bold mt-4">Proceed to Checkout</button>
        </div>
      </div>
    )}
  </div>
);

const CheckoutPage = ({ settings, cartTotal, placeOrder, isPlacingOrder, showToast }: any) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    division: '', 
    district: '', 
    upazila: '', 
    address: '' 
  });

  const selectedDivision = divisions.find(d => d.name === formData.division);
  const availableDistricts = selectedDivision ? districts.filter(d => d.divisionId === selectedDivision.id) : [];
  const selectedDistrict = districts.find(d => d.name === formData.district && (selectedDivision ? d.divisionId === selectedDivision.id : true));
  const availableUpazilas = selectedDistrict ? (upazilas[selectedDistrict.id] || getDefaultUpazilas(selectedDistrict.name)) : [];

  const deliveryCharge = formData.district === 'Dhaka' 
    ? (settings.deliveryCharges.find((c: any) => c.city === 'Dhaka')?.charge || 60)
    : (settings.deliveryCharges.find((c: any) => c.city === 'Outside Dhaka')?.charge || 120);

  const total = cartTotal + deliveryCharge;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.division || !formData.district || !formData.upazila || !formData.address) {
      showToast("Please fill all fields!");
      return;
    }
    placeOrder({
      ...formData,
      city: formData.district,
      address: `${formData.address}, ${formData.upazila}, ${formData.district}, ${formData.division}`,
      deliveryCharge,
      total
    });
  };

  return (
    <div className="pt-32 pb-24 px-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-[#e62e04]" /> Checkout
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2"><User className="w-5 h-5 text-[#e62e04]" /> Shipping Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 ring-[#e62e04]/10 text-sm font-bold" 
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 ring-[#e62e04]/10 text-sm font-bold" 
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Division</label>
                <select 
                  required
                  value={formData.division}
                  onChange={e => setFormData({ ...formData, division: e.target.value, district: '', upazila: '' })}
                  className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 ring-[#e62e04]/10 text-sm font-bold appearance-none"
                >
                  <option value="">Select Division</option>
                  {divisions.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">District</label>
                <select 
                  required
                  disabled={!formData.division}
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value, upazila: '' })}
                  className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 ring-[#e62e04]/10 text-sm font-bold appearance-none disabled:opacity-50"
                >
                  <option value="">Select District</option>
                  {availableDistricts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Upazila/Thana</label>
                <select 
                  required
                  disabled={!formData.district}
                  value={formData.upazila}
                  onChange={e => setFormData({ ...formData, upazila: e.target.value })}
                  className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 ring-[#e62e04]/10 text-sm font-bold appearance-none disabled:opacity-50"
                >
                  <option value="">Select Upazila</option>
                  {availableUpazilas.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Detailed Address</label>
              <textarea 
                required
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 ring-[#e62e04]/10 h-24 text-sm font-bold" 
                placeholder="House no, Road no, Area..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold mb-4 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-[#e62e04]" /> Order Summary</h3>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-gray-600 text-sm font-bold">
              <span>Items Total</span>
              <span>৳{cartTotal}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-sm font-bold">
              <span>Delivery Charge</span>
              <span>৳{deliveryCharge}</span>
            </div>
            <div className="flex justify-between font-black text-xl pt-3 border-t">
              <span>Total Amount</span>
              <span className="text-[#e62e04]">৳{total}</span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 mb-6">
            <p className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-2">
              <Truck className="w-3 h-3" /> Cash on Delivery
            </p>
            <p className="text-[10px] text-blue-400 mt-1 font-bold">Pay when you receive the product.</p>
          </div>

          <button 
            type="submit"
            disabled={isPlacingOrder}
            className={`w-full bg-[#001529] text-white py-4 rounded-2xl font-black shadow-lg shadow-[#001529]/20 flex items-center justify-center gap-2 transition-all active:scale-95 ${isPlacingOrder ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isPlacingOrder ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Placing Order...
              </>
            ) : "Confirm Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

const OrderSuccessPage = ({ orderResult, setView }: any) => (
  <div className="pt-32 pb-24 px-6 text-center">
    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <CheckCircle className="w-12 h-12 text-green-600" />
    </div>
    <h2 className="text-2xl font-bold mb-2">Order Successful!</h2>
    <p className="text-gray-500 mb-8">Thank you for shopping with ShishuMela. Your order has been placed.</p>
    
    <div className="bg-white border rounded-2xl p-6 text-left mb-8">
      <div className="flex justify-between mb-4 pb-4 border-b">
        <span className="text-gray-500">Order ID</span>
        <span className="font-bold text-[#e62e04]">{orderResult?.id}</span>
      </div>
      <div className="space-y-2 mb-4">
        <p className="text-sm font-bold">Shipping Details:</p>
        <p className="text-sm text-gray-600">{orderResult?.customerName}</p>
        <p className="text-sm text-gray-600">{orderResult?.phone}</p>
        <p className="text-sm text-gray-600">{orderResult?.address}, {orderResult?.city}</p>
      </div>
      <div className="pt-4 border-t">
        <div className="flex justify-between font-bold">
          <span>Paid Amount</span>
          <span>৳{orderResult?.total}</span>
        </div>
      </div>
    </div>

    <button onClick={() => setView('home')} className="w-full bg-[#001529] text-white py-4 rounded-xl font-bold">Continue Shopping</button>
  </div>
);

const TrackingPage = ({ trackingId, setTrackingId, trackOrder, trackedOrder }: any) => (
  <div className="pt-32 pb-24 px-4">
    <h2 className="text-2xl font-bold mb-6">Track Your Order</h2>
    <div className="bg-white p-6 rounded-2xl border shadow-sm mb-6">
      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Order ID</label>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={trackingId}
          onChange={e => setTrackingId(e.target.value)}
          className="flex-1 p-3 bg-gray-50 border-0 rounded-xl outline-none" 
          placeholder="SM-XXXXXXXXX"
        />
        <button onClick={trackOrder} className="bg-[#001529] text-white px-6 rounded-xl font-bold">Track</button>
      </div>
    </div>

    {trackedOrder && (
      <div className="bg-white p-6 rounded-2xl border shadow-sm animate-in">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-gray-500">Status</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            trackedOrder.status === 'Delivered' ? 'bg-green-100 text-green-600' :
            trackedOrder.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
            'bg-blue-100 text-blue-600'
          }`}>{trackedOrder.status}</span>
        </div>
        <div className="space-y-4">
          {trackedOrder.items.map((item: any) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.name} x {item.quantity}</span>
              <span>৳{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="pt-4 border-t flex justify-between font-bold">
            <span>Total Paid</span>
            <span className="text-[#e62e04]">৳{trackedOrder.total}</span>
          </div>
        </div>
      </div>
    )}
  </div>
);

const ImageUploader = ({ onUpload, currentImage }: { onUpload: (url: string) => void, currentImage?: string }) => {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex gap-3 items-center">
      {currentImage && (
        <img src={currentImage} className="w-16 h-16 object-cover rounded-xl border" referrerPolicy="no-referrer" />
      )}
      <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
        <Camera className="w-6 h-6 text-gray-300 mb-1" />
        <span className="text-[10px] font-black text-gray-400 uppercase">Upload Photo</span>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleImageUpload} 
        />
      </label>
    </div>
  );
};

const PageContent = ({ title, content }: { title: string, content: string }) => (
  <div className="pt-24 pb-24 px-6 min-h-[70vh]">
    <h2 className="text-3xl font-black text-[#001529] mb-6 italic">{title}</h2>
    <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
      {content}
    </div>
  </div>
);

const DeveloperModal = ({ isOpen, onClose, devInfo }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl"
      >
        <div className="bg-[#006b3c] p-8 text-center relative">
          <button onClick={onClose} className="absolute top-6 right-6 text-white/60 hover:text-white"><X className="w-6 h-6" /></button>
          <div className="w-28 h-28 mx-auto rounded-full border-4 border-white overflow-hidden mb-4 shadow-lg">
            <img src={devInfo.photo || "https://via.placeholder.com/150"} alt="Dev" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <h3 className="text-2xl font-black text-white flex items-center justify-center gap-3">
            <span className="w-6 h-[2px] bg-white/30"></span>
            {devInfo.name}
            <span className="w-6 h-[2px] bg-white/30"></span>
          </h3>
        </div>
        <div className="p-8">
          <p className="text-gray-600 text-sm leading-relaxed text-center mb-8">
            {devInfo.bio}
          </p>
          <div className="flex justify-center gap-4 mb-8">
            {devInfo.fbLink && (
              <a href={devInfo.fbLink} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200 active:scale-90 transition-all">
                <Facebook className="w-6 h-6" />
              </a>
            )}
            {devInfo.phone && (
              <a href={`tel:${devInfo.phone}`} className="w-12 h-12 rounded-2xl bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-200 active:scale-90 transition-all">
                <Phone className="w-6 h-6" />
              </a>
            )}
            {devInfo.email && (
              <a href={`mailto:${devInfo.email}`} className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-200 active:scale-90 transition-all">
                <Mail className="w-6 h-6" />
              </a>
            )}
          </div>
          <button 
            onClick={onClose}
            className="w-full py-4 border-t text-[#006b3c] font-black text-lg active:bg-gray-50 transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AdminPanel = ({ isAdminLoggedIn, setIsAdminLoggedIn, adminPassInput, setAdminPassInput, settings, products, showToast, categories, updateSettings, adminPass, setAdminPass, updateAdminPassword, pages, updatePage, devInfo, updateDevInfo }: any) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories' | 'accounting' | 'settings' | 'pages'>('orders');
  const [isDevEditorOpen, setIsDevEditorOpen] = useState(false);
  const [devPassInput, setDevPassInput] = useState('');
  const [isDevAuthenticated, setIsDevAuthenticated] = useState(false);
  const [productFilter, setProductFilter] = useState<'All' | 'LowStock'>('All');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', image: '' });
  
  // Filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [orderCityFilter, setOrderCityFilter] = useState<string>('All');
  const [orderDateFilter, setOrderDateFilter] = useState<string>('');

  useEffect(() => {
    db.ref('shishumela/orders').on('value', snapshot => {
      const val = snapshot.val();
      if (val) setOrders(Object.values(val));
      else setOrders([]);
    });
    return () => db.ref('shishumela/orders').off();
  }, []);

  const updateOrderStatus = (id: string, status: Order['status']) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    // If status is changing to Delivered, decrease stock
    if (status === 'Delivered' && order.status !== 'Delivered') {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
          const newStock = Math.max(0, (product.stock || 0) - item.quantity);
          db.ref('shishumela/products').child(product.id).update({ 
            stock: newStock,
            inStock: newStock > 0
          });
        }
      });
    }

    db.ref('shishumela/orders').child(id).update({ status });
    showToast("Order status updated!");
  };

  const deleteOrder = (id: string) => {
    console.log("Attempting to delete order:", id);
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this order?")) {
      db.ref('shishumela/orders').child(id).remove()
        .then(() => {
          console.log("Order deleted successfully:", id);
          showToast("Order deleted successfully");
        })
        .catch(err => {
          console.error("Error deleting order:", err);
          showToast("Error: " + err.message);
        });
    }
  };

  const deleteProduct = (id: string) => {
    console.log("Attempting to delete product:", id);
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this product?")) {
      db.ref('shishumela/products').child(id).remove()
        .then(() => {
          console.log("Product deleted successfully:", id);
          showToast("Product deleted successfully");
        })
        .catch(err => {
          console.error("Error deleting product:", err);
          showToast("Error: " + err.message);
        });
    }
  };

  const deleteCategory = (id: string) => {
    console.log("Attempting to delete category:", id);
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this category?")) {
      db.ref('shishumela/categories').child(id).remove()
        .then(() => {
          console.log("Category deleted successfully:", id);
          showToast("Category deleted successfully");
        })
        .catch(err => {
          console.error("Error deleting category:", err);
          showToast("Error: " + err.message);
        });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProduct = (product: any) => {
    if (!product.name || !product.price || !product.image) {
      alert("Please fill all required fields!");
      return;
    }
    const id = product.id || 'p' + Date.now();
    db.ref('shishumela/products').child(id).set({ ...product, id });
    setEditingProduct(null);
    setIsAddingProduct(false);
    showToast("Product saved!");
  };

  const saveCategory = () => {
    if (!newCategory.name || !newCategory.image) {
      alert("Please fill all fields!");
      return;
    }
    const id = 'c' + Date.now();
    db.ref('shishumela/categories').child(id).set({ ...newCategory, id });
    setNewCategory({ name: '', image: '' });
    setIsAddingCategory(false);
    showToast("Category added!");
  };

  const filteredOrders = orders
    .filter(o => orderStatusFilter === 'All' || o.status === orderStatusFilter)
    .filter(o => orderCityFilter === 'All' || o.city === orderCityFilter)
    .filter(o => !orderDateFilter || new Date(o.timestamp).toLocaleDateString() === new Date(orderDateFilter).toLocaleDateString())
    .sort((a, b) => b.timestamp - a.timestamp);

  const stats = {
    total: orders.length,
    today: orders.filter(o => new Date(o.timestamp).toLocaleDateString() === new Date().toLocaleDateString()).length,
    pending: orders.filter(o => o.status === 'Pending').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
    return: orders.filter(o => o.status === 'Return' as any).length,
    lowStock: products.filter(p => p.stock <= 5).length,
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="pt-32 pb-24 px-6 flex flex-col items-center justify-center min-h-[80vh] bg-gray-50">
        <div className="w-full max-w-sm bg-white p-8 rounded-3xl border shadow-xl text-center">
          <div className="w-20 h-20 bg-[#001529] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
            <Settings className="w-10 h-10 text-white animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-black text-[#001529] mb-2 italic">Admin Access</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Restricted Area</p>
          
          <div className="space-y-4">
            <div className="relative">
              <input 
                type="password" 
                value={adminPassInput}
                onChange={e => setAdminPassInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    if (adminPassInput === adminPass) {
                      setIsAdminLoggedIn(true);
                      localStorage.setItem('shishumela_admin_auth', 'true');
                      showToast("Login Successful!");
                    } else {
                      showToast("Wrong Password!");
                    }
                  }
                }}
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-center text-lg font-black tracking-[0.5em] outline-none focus:border-[#001529]/20 transition-all"
                placeholder="••••••••"
              />
            </div>
            <button 
              onClick={() => {
                if (adminPassInput === adminPass) {
                  setIsAdminLoggedIn(true);
                  localStorage.setItem('shishumela_admin_auth', 'true');
                  showToast("Login Successful!");
                } else {
                  showToast("Wrong Password!");
                }
              }}
              className="w-full bg-[#001529] text-white py-4 rounded-2xl font-black shadow-lg shadow-[#001529]/20 active:scale-95 transition-all"
            >
              Enter Dashboard
            </button>
          </div>
          <p className="mt-8 text-[10px] text-gray-300 font-bold uppercase">Authorized Personnel Only</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black italic text-[#001529]">Admin Panel</h2>
        <button onClick={() => { setIsAdminLoggedIn(false); localStorage.removeItem('shishumela_admin_auth'); }} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-xs shadow-sm">Logout</button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        <div className="bg-white p-2 rounded-2xl border shadow-sm text-center">
          <p className="text-[8px] font-bold text-gray-400 uppercase">Today</p>
          <p className="text-lg font-black text-[#001529]">{stats.today}</p>
        </div>
        <div className="bg-white p-2 rounded-2xl border shadow-sm text-center">
          <p className="text-[8px] font-bold text-gray-400 uppercase">Pending</p>
          <p className="text-lg font-black text-orange-500">{stats.pending}</p>
        </div>
        <div className="bg-white p-2 rounded-2xl border shadow-sm text-center">
          <p className="text-[8px] font-bold text-gray-400 uppercase">Delivered</p>
          <p className="text-lg font-black text-green-500">{stats.delivered}</p>
        </div>
        <button 
          onClick={() => { setActiveTab('products'); setProductFilter('LowStock'); }}
          className={`bg-white p-2 rounded-2xl border shadow-sm text-center transition-all active:scale-95 ${stats.lowStock > 0 ? 'border-red-200 bg-red-50' : ''}`}
        >
          <p className="text-[8px] font-bold text-gray-400 uppercase">Low Stock</p>
          <p className={`text-lg font-black ${stats.lowStock > 0 ? 'text-red-600 animate-pulse' : 'text-gray-400'}`}>{stats.lowStock}</p>
        </button>
      </div>

      <div className="flex gap-1 mb-6 bg-white p-1 rounded-2xl border shadow-sm overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab('orders')} className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'orders' ? 'bg-[#001529] text-white shadow-md' : 'text-gray-500'}`}>Orders</button>
        <button onClick={() => setActiveTab('products')} className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'products' ? 'bg-[#001529] text-white shadow-md' : 'text-gray-500'}`}>Products</button>
        <button onClick={() => setActiveTab('categories')} className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'categories' ? 'bg-[#001529] text-white shadow-md' : 'text-gray-500'}`}>Categories</button>
        <button onClick={() => setActiveTab('accounting')} className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'accounting' ? 'bg-[#001529] text-white shadow-md' : 'text-gray-500'}`}>Accounting</button>
        <button onClick={() => setActiveTab('settings')} className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'settings' ? 'bg-[#001529] text-white shadow-md' : 'text-gray-500'}`}>Settings</button>
        <button onClick={() => setActiveTab('pages')} className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'pages' ? 'bg-[#001529] text-white shadow-md' : 'text-gray-500'}`}>Pages</button>
      </div>

      {activeTab === 'pages' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="text-lg font-black text-[#001529] mb-5 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" /> Manage Pages
            </h3>
            <div className="space-y-6">
              {Object.entries(pages).map(([id, content]: [string, any]) => (
                <div key={id} className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase block">{id.replace('_', ' ')} Page</label>
                  <textarea 
                    value={content}
                    onChange={(e) => updatePage(id, e.target.value)}
                    className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-medium outline-none h-32 focus:ring-2 ring-blue-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Order Filters */}
          <div className="bg-white p-4 rounded-2xl border shadow-sm space-y-3">
            <div className="flex gap-2">
              <select 
                value={orderStatusFilter}
                onChange={e => setOrderStatusFilter(e.target.value)}
                className="flex-1 p-2 bg-gray-50 border rounded-xl text-xs font-bold outline-none"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Return">Return</option>
              </select>
              <select 
                value={orderCityFilter}
                onChange={e => setOrderCityFilter(e.target.value)}
                className="flex-1 p-2 bg-gray-50 border rounded-xl text-xs font-bold outline-none"
              >
                <option value="All">All Cities</option>
                {Array.from(new Set(orders.map(o => o.city))).filter(Boolean).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <input 
              type="date" 
              value={orderDateFilter}
              onChange={e => setOrderDateFilter(e.target.value)}
              className="w-full p-2 bg-gray-50 border rounded-xl text-xs font-bold outline-none"
            />
          </div>

          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white p-4 rounded-2xl border shadow-sm relative overflow-hidden">
                <div className={`absolute top-0 right-0 px-3 py-1 text-[8px] font-black uppercase rounded-bl-xl ${
                  order.status === 'Delivered' ? 'bg-green-500 text-white' :
                  order.status === 'Cancelled' ? 'bg-red-500 text-white' :
                  'bg-orange-500 text-white'
                }`}>{order.status}</div>
                
                <div className="flex justify-between mb-3">
                  <span className="font-black text-[#e62e04] text-sm">{order.id}</span>
                  <span className="text-[10px] text-gray-400 font-bold">{new Date(order.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-sm mb-4">
                  <p className="font-black text-[#001529]">{order.customerName}</p>
                  <p className="text-gray-500 font-bold text-xs">{order.phone}</p>
                  <p className="text-gray-400 text-[11px] mt-1">{order.address}, {order.city}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <select 
                      value={order.status}
                      onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                      className="text-[10px] font-black p-2 border rounded-xl bg-gray-50 outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Return">Return</option>
                    </select>
                    <button 
                      onClick={() => deleteOrder(order.id)}
                      className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all active:scale-90"
                      title="Delete Order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Total Amount</p>
                    <p className="font-black text-lg text-[#001529]">৳{order.total}</p>
                  </div>
                </div>
              </div>
            ))}
            {filteredOrders.length === 0 && (
              <div className="text-center py-10 bg-white rounded-2xl border border-dashed">
                <p className="text-gray-400 font-bold text-sm">No orders found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-4">
          {!editingProduct && !isAddingProduct ? (
            <>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsAddingProduct(true)}
                  className="flex-1 bg-[#001529] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-[#001529]/20"
                >
                  <Plus className="w-5 h-5" /> Add Product
                </button>
                <select 
                  value={productFilter}
                  onChange={e => setProductFilter(e.target.value as any)}
                  className="bg-white border rounded-2xl px-4 text-xs font-bold outline-none shadow-sm"
                >
                  <option value="All">All Items</option>
                  <option value="LowStock">Low Stock</option>
                </select>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {products
                  .filter((p: any) => productFilter === 'All' || (p.stock <= 5))
                  .map((p: any) => (
                  <div key={p.id} className="flex gap-4 bg-white p-3 rounded-2xl border shadow-sm">
                    <img src={p.image} className="w-20 h-20 object-cover rounded-xl shadow-sm" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-black text-[#001529] line-clamp-1">{p.name}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-[#e62e04] font-black text-sm">৳{p.price}</p>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${p.stock <= 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            Stock: {p.stock || 0}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{p.category}</p>
                      </div>
                      <div className="flex gap-3 mt-2">
                        <button onClick={() => setEditingProduct(p)} className="text-[11px] text-blue-600 font-black uppercase tracking-wider">Edit</button>
                        <button onClick={() => deleteProduct(p.id)} className="text-[11px] text-red-600 font-black uppercase tracking-wider bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 transition-all">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-5">
              <h3 className="text-xl font-black text-[#001529]">{isAddingProduct ? "Add Product" : "Edit Product"}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Product Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter product name" 
                    className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none focus:ring-2 ring-[#001529]/10"
                    value={editingProduct?.name || ''}
                    onChange={e => setEditingProduct({ ...(editingProduct || {}), name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Price</label>
                    <input 
                      type="number" 
                      placeholder="৳0.00" 
                      className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none focus:ring-2 ring-[#001529]/10"
                      value={editingProduct?.price || ''}
                      onChange={e => setEditingProduct({ ...(editingProduct || {}), price: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Old Price</label>
                    <input 
                      type="number" 
                      placeholder="৳0.00" 
                      className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none focus:ring-2 ring-[#001529]/10"
                      value={editingProduct?.oldPrice || ''}
                      onChange={e => setEditingProduct({ ...(editingProduct || {}), oldPrice: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Stock (Qty)</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none focus:ring-2 ring-[#001529]/10"
                      value={editingProduct?.stock || 0}
                      onChange={e => setEditingProduct({ ...(editingProduct || {}), stock: parseInt(e.target.value), inStock: parseInt(e.target.value) > 0 })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Product Image</label>
                  <ImageUploader 
                    onUpload={(base64) => setEditingProduct({ ...(editingProduct || {}), image: base64 })} 
                    currentImage={editingProduct?.image} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Purchase Price (ক্রয় মূল্য)</label>
                    <input 
                      type="number" 
                      placeholder="৳0.00" 
                      className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none focus:ring-2 ring-[#001529]/10"
                      value={editingProduct?.purchasePrice || ''}
                      onChange={e => setEditingProduct({ ...(editingProduct || {}), purchasePrice: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Overhead Cost (খরচ)</label>
                    <input 
                      type="number" 
                      placeholder="৳0.00" 
                      className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none focus:ring-2 ring-[#001529]/10"
                      value={editingProduct?.overheadCost || ''}
                      onChange={e => setEditingProduct({ ...(editingProduct || {}), overheadCost: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Category</label>
                    <select 
                      className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none focus:ring-2 ring-[#001529]/10"
                      value={editingProduct?.category || ''}
                      onChange={e => setEditingProduct({ ...(editingProduct || {}), category: e.target.value })}
                    >
                      <option value="">Select</option>
                      {categories.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Stock Status</label>
                    <select 
                      className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none focus:ring-2 ring-[#001529]/10"
                      value={editingProduct?.inStock !== false ? 'true' : 'false'}
                      onChange={e => setEditingProduct({ ...(editingProduct || {}), inStock: e.target.value === 'true' })}
                    >
                      <option value="true">In Stock</option>
                      <option value="false">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Colors (Comma separated)</label>
                    <input 
                      type="text" 
                      placeholder="Red, Blue, Green" 
                      className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none focus:ring-2 ring-[#001529]/10"
                      value={editingProduct?.colors?.join(', ') || ''}
                      onChange={e => setEditingProduct({ ...(editingProduct || {}), colors: e.target.value.split(',').map(s => s.trim()) })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Sizes (Comma separated)</label>
                    <input 
                      type="text" 
                      placeholder="S, M, L, XL" 
                      className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none focus:ring-2 ring-[#001529]/10"
                      value={editingProduct?.sizes?.join(', ') || ''}
                      onChange={e => setEditingProduct({ ...(editingProduct || {}), sizes: e.target.value.split(',').map(s => s.trim()) })}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Description</label>
                  <textarea 
                    placeholder="Enter product description" 
                    className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none focus:ring-2 ring-[#001529]/10 h-28"
                    value={editingProduct?.description || ''}
                    onChange={e => setEditingProduct({ ...(editingProduct || {}), description: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button onClick={() => { setEditingProduct(null); setIsAddingProduct(false); }} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-gray-500 transition-all active:scale-95">Cancel</button>
                <button onClick={() => saveProduct(editingProduct)} className="flex-1 py-4 bg-[#001529] text-white rounded-2xl font-black shadow-lg shadow-[#001529]/20 transition-all active:scale-95">Save Product</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-4">
          {!isAddingCategory ? (
            <>
              <button 
                onClick={() => setIsAddingCategory(true)}
                className="w-full bg-[#001529] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-[#001529]/20"
              >
                <Plus className="w-5 h-5" /> Add New Category
              </button>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((c: any) => (
                  <div key={c.id} className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col items-center gap-3 relative">
                    <button 
                      onClick={() => deleteCategory(c.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg active:scale-90 transition-all z-10"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="w-16 h-16 rounded-2xl bg-[#ffe8e4] p-2 flex items-center justify-center overflow-hidden">
                      <img src={c.image} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <span className="text-xs font-black text-[#001529]">{c.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-5">
              <h3 className="text-xl font-black text-[#001529]">Add Category</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Category Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter category name" 
                    className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none"
                    value={newCategory.name}
                    onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Category Image</label>
                  <ImageUploader 
                    onUpload={(base64) => setNewCategory({ ...newCategory, image: base64 })} 
                    currentImage={newCategory.image} 
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsAddingCategory(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-black text-gray-500">Cancel</button>
                <button onClick={saveCategory} className="flex-1 py-4 bg-[#001529] text-white rounded-2xl font-black shadow-lg shadow-[#001529]/20">Save Category</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'accounting' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-[#001529] flex items-center gap-2">
                <List className="w-5 h-5 text-[#e62e04]" /> Profit & Loss Summary
              </h3>
              <div className="text-[10px] font-bold text-gray-400 uppercase bg-gray-50 px-3 py-1 rounded-full">
                Based on Delivered Orders
              </div>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Total Revenue</p>
                <p className="text-xl font-black text-blue-700">
                  ৳{orders.filter(o => o.status === 'Delivered').reduce((acc, o) => acc + o.total, 0)}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                <p className="text-[10px] font-bold text-orange-400 uppercase mb-1">Total Cost</p>
                <p className="text-xl font-black text-orange-700">
                  ৳{orders.filter(o => o.status === 'Delivered').reduce((acc, o) => {
                    return acc + o.items.reduce((pAcc, item) => {
                      const product = products.find(p => p.id === item.id);
                      if (!product) return pAcc;
                      return pAcc + (((product.purchasePrice || 0) + (product.overheadCost || 0)) * item.quantity);
                    }, 0);
                  }, 0)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                <p className="text-[10px] font-bold text-green-400 uppercase mb-1">Total Profit</p>
                <p className="text-xl font-black text-green-700">
                  ৳{orders.filter(o => o.status === 'Delivered').reduce((acc, o) => {
                    const orderProfit = o.items.reduce((pAcc, item) => {
                      const product = products.find(p => p.id === item.id);
                      if (!product) return pAcc;
                      const costPerUnit = (product.purchasePrice || 0) + (product.overheadCost || 0);
                      return pAcc + ((product.price - costPerUnit) * item.quantity);
                    }, 0);
                    return acc + orderProfit;
                  }, 0)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                <p className="text-[10px] font-bold text-purple-400 uppercase mb-1">Delivered Orders</p>
                <p className="text-xl font-black text-purple-700">
                  {orders.filter(o => o.status === 'Delivered').length}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-gray-400 uppercase">Product Performance</h4>
              </div>
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead>
                    <tr className="border-b text-gray-400">
                      <th className="pb-3 font-black uppercase">Product</th>
                      <th className="pb-3 font-black uppercase text-center">Sold</th>
                      <th className="pb-3 font-black uppercase text-right">Revenue</th>
                      <th className="pb-3 font-black uppercase text-right">Total Cost</th>
                      <th className="pb-3 font-black uppercase text-right">Profit</th>
                      <th className="pb-3 font-black uppercase text-right">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products.map((p: any) => {
                      const sold = orders.filter(o => o.status === 'Delivered')
                        .reduce((acc, o) => acc + o.items.filter(i => i.id === p.id).reduce((iAcc, i) => iAcc + i.quantity, 0), 0);
                      const revenue = sold * p.price;
                      const costPerUnit = (p.purchasePrice || 0) + (p.overheadCost || 0);
                      const totalCost = sold * costPerUnit;
                      const profit = revenue - totalCost;
                      const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;
                      
                      return (
                        <tr key={p.id} className="hover:bg-gray-50 group">
                          <td className="py-4">
                            <p className="font-bold text-[#001529]">{p.name}</p>
                            <p className="text-[10px] text-gray-400">৳{p.price} / unit</p>
                          </td>
                          <td className="py-4 text-center font-black text-gray-600">{sold}</td>
                          <td className="py-4 text-right font-bold text-blue-600">৳{revenue}</td>
                          <td className="py-4 text-right font-bold text-gray-500">৳{totalCost}</td>
                          <td className={`py-4 text-right font-black ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ৳{profit}
                          </td>
                          <td className="py-4 text-right">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              margin > 20 ? 'bg-green-100 text-green-600' : 
                              margin > 0 ? 'bg-blue-100 text-blue-600' : 
                              'bg-red-100 text-red-600'
                            }`}>
                              {margin}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h3 className="text-lg font-black text-[#001529] mb-5 flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#e62e04]" /> General Settings
            </h3>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Admin Password</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={adminPass} 
                    onChange={e => setAdminPass(e.target.value)}
                    className="flex-1 p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none" 
                  />
                  <button 
                    onClick={() => updateAdminPassword(adminPass)}
                    className="px-4 bg-[#001529] text-white rounded-xl text-xs font-bold"
                  >
                    Update
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Banners (Photos)</label>
                <div className="grid grid-cols-2 gap-4">
                  {settings.banners.map((banner, i) => (
                    <div key={i} className="relative group">
                      <div className="aspect-video bg-gray-50 border rounded-2xl overflow-hidden">
                        <img src={banner} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <button 
                        onClick={() => {
                          const newBanners = settings.banners.filter((_, idx) => idx !== i);
                          updateSettings({ ...settings, banners: newBanners });
                        }} 
                        className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-video bg-gray-50 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all">
                    <Plus className="w-6 h-6 text-gray-300 mb-1" />
                    <span className="text-[10px] font-black text-gray-400 uppercase">Add Banner</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={e => handleImageUpload(e, (base64) => updateSettings({ ...settings, banners: [...settings.banners, base64] }))} 
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">FB Messenger Link</label>
                <input 
                  type="text" 
                  value={settings.fbMessageLink} 
                  onChange={e => updateSettings({ ...settings, fbMessageLink: e.target.value })}
                  className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none" 
                  placeholder="https://m.me/yourpage"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Phone Number</label>
                <input 
                  type="text" 
                  value={settings.phone} 
                  onChange={e => updateSettings({ ...settings, phone: e.target.value })}
                  className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Email Address</label>
                <input 
                  type="text" 
                  value={settings.email} 
                  onChange={e => updateSettings({ ...settings, email: e.target.value })}
                  className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Office Address</label>
                <textarea 
                  value={settings.address} 
                  onChange={e => updateSettings({ ...settings, address: e.target.value })}
                  className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none h-20" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Facebook Link</label>
                  <input 
                    type="text" 
                    value={settings.fbLink} 
                    onChange={e => updateSettings({ ...settings, fbLink: e.target.value })}
                    className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Instagram Link</label>
                  <input 
                    type="text" 
                    value={settings.igLink} 
                    onChange={e => updateSettings({ ...settings, igLink: e.target.value })}
                    className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Youtube Link</label>
                  <input 
                    type="text" 
                    value={settings.ytLink} 
                    onChange={e => updateSettings({ ...settings, ytLink: e.target.value })}
                    className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">TikTok Link</label>
                  <input 
                    type="text" 
                    value={settings.tkLink} 
                    onChange={e => updateSettings({ ...settings, tkLink: e.target.value })}
                    className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-[#001529] flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#e62e04]" /> Delivery Charges
              </h3>
              <button 
                onClick={() => updateSettings({ 
                  ...settings, 
                  deliveryCharges: [...settings.deliveryCharges, { city: 'New Area', charge: 0 }] 
                })}
                className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase hover:bg-blue-100 transition-colors"
              >
                + Add Area
              </button>
            </div>
            <div className="space-y-3">
              {settings.deliveryCharges.map((d: any, i: number) => (
                <div key={i} className="flex gap-3 items-center group">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={d.city} 
                      onChange={e => {
                        const newCharges = [...settings.deliveryCharges];
                        newCharges[i].city = e.target.value;
                        updateSettings({ ...settings, deliveryCharges: newCharges });
                      }}
                      className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none focus:border-blue-200" 
                    />
                  </div>
                  <div className="relative w-28">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">৳</span>
                    <input 
                      type="number" 
                      value={d.charge} 
                      onChange={e => {
                        const newCharges = [...settings.deliveryCharges];
                        newCharges[i].charge = parseInt(e.target.value) || 0;
                        updateSettings({ ...settings, deliveryCharges: newCharges });
                      }}
                      className="w-full p-3 pl-7 bg-gray-50 border rounded-xl text-sm font-black outline-none focus:border-blue-200" 
                    />
                  </div>
                  <button 
                    onClick={() => {
                      const newCharges = settings.deliveryCharges.filter((_: any, idx: number) => idx !== i);
                      updateSettings({ ...settings, deliveryCharges: newCharges });
                    }}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="pt-10 flex justify-center">
              <button 
                onClick={() => setIsDevEditorOpen(true)}
                className="text-[8px] text-gray-100 hover:text-gray-300 transition-colors uppercase font-black tracking-widest"
              >
                Dev Settings
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isDevEditorOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-[#001529]">Developer Editor</h3>
                <button onClick={() => { setIsDevEditorOpen(false); setIsDevAuthenticated(false); setDevPassInput(''); }} className="text-gray-400"><X className="w-6 h-6" /></button>
              </div>

              {!isDevAuthenticated ? (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase">Enter Developer Password</p>
                  <input 
                    type="password" 
                    value={devPassInput}
                    onChange={(e) => setDevPassInput(e.target.value)}
                    className="w-full p-4 bg-gray-50 border rounded-2xl text-sm font-bold outline-none"
                    placeholder="••••••••"
                  />
                  <button 
                    onClick={() => {
                      if (devPassInput === devInfo.devPass) {
                        setIsDevAuthenticated(true);
                      } else {
                        showToast("Wrong Dev Password!");
                      }
                    }}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-200"
                  >
                    Authenticate
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 no-scrollbar">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Developer Name</label>
                    <input value={devInfo.name} onChange={e => updateDevInfo({...devInfo, name: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Bio</label>
                    <textarea value={devInfo.bio} onChange={e => updateDevInfo({...devInfo, bio: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none h-24" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Photo</label>
                    <ImageUploader onUpload={(url) => updateDevInfo({...devInfo, photo: url})} currentImage={devInfo.photo} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Facebook Link</label>
                    <input value={devInfo.fbLink} onChange={e => updateDevInfo({...devInfo, fbLink: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Phone</label>
                    <input value={devInfo.phone} onChange={e => updateDevInfo({...devInfo, phone: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Email</label>
                    <input value={devInfo.email} onChange={e => updateDevInfo({...devInfo, email: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase">Change Dev Password</label>
                    <input value={devInfo.devPass} onChange={e => updateDevInfo({...devInfo, devPass: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl text-sm font-bold outline-none" />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// UI Components
const TopNav = ({ setView, cartCount, searchQuery, setSearchQuery, view }: any) => (
  <div className="fixed top-0 left-0 right-0 bg-white z-50 shadow-md px-4 py-2 flex flex-col gap-2 max-w-md mx-auto">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button onClick={() => setView('home')} className="p-1">
          <Menu className="w-6 h-6 text-[#001529]" />
        </button>
        <div className="flex flex-col cursor-pointer" onClick={() => setView('home')}>
          <span className="text-lg font-black text-[#001529] leading-none italic">ShishuMela</span>
          <span className="text-[7px] text-gray-500 font-bold uppercase tracking-widest">Trust in every trust</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => setView('tracking')} className="relative p-1">
          <Truck className="w-6 h-6 text-[#001529]" />
        </button>
        <button onClick={() => setView('cart')} className="relative p-1">
          <ShoppingBag className="w-6 h-6 text-[#001529]" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#e62e04] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
    <div className="relative pb-1">
      <input 
        type="text"
        placeholder="Search for products..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          if (e.target.value.trim()) {
            setView('search');
          } else if (view === 'search') {
            setView('home');
          }
        }}
        className="w-full bg-gray-100 border-0 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 ring-[#e62e04]/20 transition-all"
      />
      <Search className="w-4 h-4 text-gray-400 absolute left-4 top-[35%] -translate-y-1/2" />
    </div>
  </div>
);

const BottomNav = ({ setView, view, setSelectedCategory, cartCount, settings }: any) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white z-50 border-t flex items-center justify-around py-2 px-1 max-w-md mx-auto h-16">
    <button onClick={() => setView('home')} className={`flex flex-col items-center justify-center w-16 ${view === 'home' ? 'text-[#e62e04]' : 'text-gray-500'}`}>
      <Home className="w-6 h-6" />
      <span className="text-[10px] font-medium">Home</span>
    </button>
    <button 
      onClick={() => { setSelectedCategory(null); setView('category'); }} 
      className={`flex flex-col items-center justify-center w-16 ${view === 'category' ? 'text-[#e62e04]' : 'text-gray-500'}`}
    >
      <Grid className="w-6 h-6" />
      <span className="text-[10px] font-medium">Categories</span>
    </button>
    <div className="relative flex flex-col items-center justify-center w-20">
      <button 
        onClick={() => setView('cart')}
        className="w-14 h-14 bg-[#e62e04] rounded-full flex items-center justify-center shadow-lg border-4 border-white -mt-10 mb-1"
      >
        <ShoppingBag className="w-6 h-6 text-white" />
      </button>
      <span className="text-[10px] font-bold text-gray-700">Cart ({cartCount})</span>
    </div>
    <button 
      onClick={() => window.open(settings.fbMessageLink, '_blank')}
      className="flex flex-col items-center justify-center w-16 text-gray-500"
    >
      <MessageSquare className="w-6 h-6" />
      <span className="text-[10px] font-medium">Message</span>
    </button>
    <button 
      onClick={() => setView('customerAccount')}
      className={`flex flex-col items-center justify-center w-16 ${view === 'customerAccount' ? 'text-[#e62e04]' : 'text-gray-500'}`}
    >
      <User className="w-6 h-6" />
      <span className="text-[10px] font-medium">Account</span>
    </button>
  </div>
);

const SearchResults = ({ searchQuery, products, addToCart, setView, setSelectedProduct, setSearchQuery }: any) => {
  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-24 px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Search Results for "{searchQuery}"</h2>
        <button onClick={() => { setSearchQuery(""); setView('home'); }} className="text-sm text-gray-500">Clear</button>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No products found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((p: any) => (
            <ProductCard key={p.id} product={p} addToCart={addToCart} setView={setView} setSelectedProduct={setSelectedProduct} />
          ))}
        </div>
      )}
    </div>
  );
};

const Footer = ({ settings, categories, setSelectedCategory, setView, pages, setSelectedPage, setIsDevModalOpen }: any) => {
  const handlePageClick = (id: string, title: string) => {
    setSelectedPage({ title, content: pages[id] || 'Content coming soon...' });
    setView('page');
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-[#0b1221] text-white px-6 py-12 pb-24">
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
          <ShoppingBag className="w-10 h-10 text-[#0b1221]" />
        </div>
        <h2 className="text-3xl font-black italic tracking-tighter">ShishuMela.com</h2>
        <p className="text-gray-400 text-center text-sm mt-6 leading-relaxed max-w-xs">
          ShishuMela is a growing digital commerce brand delivering quality products and a trusted shopping experience across Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-10 mb-12">
        <div>
          <h3 className="font-bold mb-6 text-lg border-b border-white/10 pb-2">Shop by Category</h3>
          <ul className="space-y-3 text-gray-400 text-sm font-medium">
            {categories.map((c: any) => (
              <li key={c.id} onClick={() => { setSelectedCategory(c.name); setView('category'); window.scrollTo(0,0); }} className="cursor-pointer hover:text-white transition-colors">{c.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-6 text-lg border-b border-white/10 pb-2">Information</h3>
          <ul className="space-y-3 text-gray-400 text-sm font-medium">
            <li onClick={() => handlePageClick('about', 'About Us')} className="cursor-pointer hover:text-white transition-colors">About Us</li>
            <li onClick={() => handlePageClick('contact', 'Contact Us')} className="cursor-pointer hover:text-white transition-colors">Contact Us</li>
            <li onClick={() => handlePageClick('privacy', 'Privacy Policy')} className="cursor-pointer hover:text-white transition-colors">Privacy Policy</li>
            <li onClick={() => handlePageClick('terms', 'Terms & Condition')} className="cursor-pointer hover:text-white transition-colors">Terms & Condition</li>
            <li onClick={() => handlePageClick('help', 'Help Center')} className="cursor-pointer hover:text-white transition-colors">Help Center</li>
            <li onClick={() => handlePageClick('faq', 'FAQ')} className="cursor-pointer hover:text-white transition-colors">FAQ</li>
          </ul>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="font-bold mb-6 text-lg border-b border-white/10 pb-2 text-center">Get in Touch</h3>
        <div className="flex flex-col items-center space-y-4 text-gray-400 text-sm font-medium">
          <a href={`tel:${settings.phone}`} className="flex items-center gap-3 hover:text-white transition-colors">
            <Phone className="w-4 h-4 text-yellow-500" />
            <span className="text-lg text-white">{settings.phone}</span>
          </a>
          <a href={`mailto:${settings.email}`} className="flex items-center gap-3 hover:text-white transition-colors">
            <Mail className="w-4 h-4 text-yellow-500" />
            <span className="text-white">{settings.email}</span>
          </a>
          <div className="flex items-start gap-3 text-center max-w-xs">
            <MapPin className="w-4 h-4 mt-1 text-yellow-500 flex-shrink-0" />
            <span className="text-white">{settings.address}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-5">
        <a href={settings.fbLink} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#0b1221] transition-all cursor-pointer"><Facebook className="w-5 h-5" /></a>
        <a href={settings.igLink} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#0b1221] transition-all cursor-pointer"><Instagram className="w-5 h-5" /></a>
        <a href={settings.ytLink} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#0b1221] transition-all cursor-pointer"><Youtube className="w-5 h-5" /></a>
        <a href={settings.tkLink} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#0b1221] transition-all cursor-pointer">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
        </a>
      </div>
      
      <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center">
        <button 
          onClick={() => setIsDevModalOpen(true)}
          className="text-[10px] font-black text-gray-600 hover:text-yellow-500 transition-all uppercase tracking-[0.3em] flex items-center gap-4"
        >
          <span className="w-12 h-[1px] bg-gray-800/50"></span>
          Created by CM Rabbi
          <span className="w-12 h-[1px] bg-gray-800/50"></span>
        </button>
      </div>
    </div>
  );
};

const CustomerAccountPage = ({ setView }: any) => (
  <div className="pt-32 pb-24 px-6 text-center">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <User className="w-12 h-12 text-gray-400" />
    </div>
    <h2 className="text-2xl font-black text-[#001529] mb-2">Welcome to ShishuMela</h2>
    <p className="text-gray-500 text-sm mb-8 font-medium">Manage your orders and profile information here.</p>
    
    <div className="space-y-3">
      <button onClick={() => setView('tracking')} className="w-full bg-white border-2 border-gray-100 p-4 rounded-2xl flex items-center justify-between hover:border-[#e62e04]/20 transition-all group">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
            <Truck className="w-5 h-5" />
          </div>
          <span className="font-bold text-[#001529]">Track My Order</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#e62e04]" />
      </button>
      
      <button onClick={() => setView('cart')} className="w-full bg-white border-2 border-gray-100 p-4 rounded-2xl flex items-center justify-between hover:border-[#e62e04]/20 transition-all group">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="font-bold text-[#001529]">My Shopping Cart</span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#e62e04]" />
      </button>

      <div className="pt-10">
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Premium Shopping Experience</p>
      </div>
    </div>
  </div>
);

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    deliveryCharges: [{ city: 'Dhaka', charge: 60 }, { city: 'Outside Dhaka', charge: 120 }],
    banners: ["https://picsum.photos/seed/banner1/1200/400", "https://picsum.photos/seed/banner2/1200/400"],
    adminPass: "As@04004",
    fbMessageLink: "https://m.me/shishumela",
    phone: "01886927101",
    email: "support@shishumela.com",
    address: "Head Office: Uttara, sector-9, Road 3F, house 18, Dhaka, Bangladesh",
    fbLink: "#",
    igLink: "#",
    ytLink: "#",
    tkLink: "#"
  });
  
  const [view, setView] = useState<'home' | 'category' | 'cart' | 'checkout' | 'orderSuccess' | 'admin' | 'tracking' | 'search' | 'page' | 'product' | 'customerAccount'>('home');

  // Handle URL Routing for /admin
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setView('admin');
    }
  }, []);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<{ title: string, content: string } | null>(null);
  const [pages, setPages] = useState<Record<string, string>>({
    'about': 'ShishuMela is your one-stop shop for kids and family products.',
    'privacy': 'Your privacy is important to us.',
    'terms': 'Terms and conditions for using ShishuMela.',
    'contact': 'Contact us at support@shishumela.com',
    'help': 'How can we help you?',
    'faq': 'Frequently Asked Questions'
  });
  const [devInfo, setDevInfo] = useState({
    name: 'CM Rabbi',
    bio: 'I am currently learning web and app development...',
    photo: '',
    fbLink: '',
    phone: '',
    email: '',
    devPass: 'As@02920'
  });
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderResult, setOrderResult] = useState<Order | null>(null);
  const [trackingId, setTrackingId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => localStorage.getItem('shishumela_admin_auth') === 'true');
  const [adminPassInput, setAdminPassInput] = useState("");
  const [adminPass, setAdminPass] = useState("");

  // Firebase Sync
  useEffect(() => {
    const productsRef = db.ref('shishumela/products');
    const categoriesRef = db.ref('shishumela/categories');
    const settingsRef = db.ref('shishumela/settings');
    const adminAuthRef = db.ref('shishumela/adminAuth');
    const pagesRef = db.ref('shishumela/pages');
    const devInfoRef = db.ref('shishumela/devInfo');

    productsRef.on('value', (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setProducts(Object.values(val));
      } else {
        INITIAL_PRODUCTS.forEach(p => productsRef.child(p.id).set(p));
      }
    });

    categoriesRef.on('value', (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setCategories(Object.values(val));
      } else {
        INITIAL_CATEGORIES.forEach(c => categoriesRef.child(c.id).set(c));
      }
    });

    settingsRef.on('value', (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setSettings(val);
      } else {
        settingsRef.set(settings);
      }
    });

    adminAuthRef.on('value', (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setAdminPass(val.password);
      } else {
        adminAuthRef.set({ password: 'As@04004' });
      }
    });

    pagesRef.on('value', (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setPages(val);
      } else {
        pagesRef.set(pages);
      }
    });

    devInfoRef.on('value', (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setDevInfo(val);
      } else {
        devInfoRef.set(devInfo);
      }
    });

    return () => {
      productsRef.off();
      categoriesRef.off();
      settingsRef.off();
      adminAuthRef.off();
      pagesRef.off();
      devInfoRef.off();
    };
  }, []);

  const updateSettings = (newSettings: any) => {
    // Remove adminPass from settings if it accidentally got there
    const { adminPass: _, ...publicSettings } = newSettings;
    db.ref('shishumela/settings').set(publicSettings);
    showToast("Settings updated!");
  };

  const updateAdminPassword = (newPass: string) => {
    db.ref('shishumela/adminAuth').update({ password: newPass });
    setAdminPass(newPass);
    showToast("Admin password updated!");
  };

  const updatePage = (id: string, content: string) => {
    db.ref('shishumela/pages').child(id).set(content);
    showToast("Page updated!");
  };

  const updateDevInfo = (info: any) => {
    db.ref('shishumela/devInfo').set(info);
    showToast("Developer Info updated!");
  };

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast("Product added to cart successfully!");
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Order Logic
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const placeOrder = async (customerData: { name: string, address: string, phone: string, city: string }) => {
    if (cart.length === 0) {
      showToast("Your cart is empty!");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const delivery = settings.deliveryCharges.find(d => d.city === customerData.city) || settings.deliveryCharges[0];
      const orderId = 'SM-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      const newOrder: Order = {
        id: orderId,
        customerName: customerData.name,
        address: customerData.address,
        phone: customerData.phone,
        city: customerData.city,
        items: cart,
        total: cartTotal + delivery.charge,
        deliveryCharge: delivery.charge,
        status: 'Pending',
        timestamp: Date.now()
      };

      await db.ref('shishumela/orders').child(orderId).set(newOrder);
      setOrderResult(newOrder);
      setCart([]);
      setView('orderSuccess');
      showToast("Order placed successfully!");
    } catch (error) {
      console.error("Order error:", error);
      showToast("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const trackOrder = () => {
    db.ref('shishumela/orders').child(trackingId).once('value', (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setTrackedOrder(val);
      } else {
        alert("Order ID not found!");
      }
    });
  };

  // UI Components
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };















  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      <TopNav setView={setView} cartCount={cartCount} searchQuery={searchQuery} setSearchQuery={setSearchQuery} view={view} />
      
      <main className="max-w-md mx-auto bg-white min-h-screen shadow-xl relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {view === 'search' && <SearchResults searchQuery={searchQuery} products={products} addToCart={addToCart} setView={setView} setSelectedProduct={setSelectedProduct} setSearchQuery={setSearchQuery} />}
            {view === 'page' && selectedPage && <PageContent title={selectedPage.title} content={selectedPage.content} />}
            {view === 'home' && <HomePage settings={settings} categories={categories} products={products} addToCart={addToCart} setView={setView} setSelectedCategory={setSelectedCategory} setSelectedProduct={setSelectedProduct} />}
            {view === 'category' && <CategoryPage setView={setView} selectedCategory={selectedCategory} products={products} addToCart={addToCart} categories={categories} setSelectedCategory={setSelectedCategory} setSelectedProduct={setSelectedProduct} />}
            {view === 'product' && <ProductDetailsPage product={selectedProduct} addToCart={addToCart} setView={setView} />}
            {view === 'cart' && <CartPage cart={cart} setView={setView} updateQuantity={updateQuantity} removeFromCart={removeFromCart} cartTotal={cartTotal} />}
            {view === 'checkout' && <CheckoutPage settings={settings} cartTotal={cartTotal} placeOrder={placeOrder} isPlacingOrder={isPlacingOrder} showToast={showToast} />}
            {view === 'orderSuccess' && <OrderSuccessPage orderResult={orderResult} setView={setView} />}
            {view === 'tracking' && <TrackingPage trackingId={trackingId} setTrackingId={setTrackingId} trackOrder={trackOrder} trackedOrder={trackedOrder} />}
            {view === 'customerAccount' && <CustomerAccountPage setView={setView} />}
            {view === 'admin' && <AdminPanel isAdminLoggedIn={isAdminLoggedIn} setIsAdminLoggedIn={setIsAdminLoggedIn} adminPassInput={adminPassInput} setAdminPassInput={setAdminPassInput} settings={settings} products={products} showToast={showToast} categories={categories} updateSettings={updateSettings} adminPass={adminPass} setAdminPass={setAdminPass} updateAdminPassword={updateAdminPassword} pages={pages} updatePage={updatePage} devInfo={devInfo} updateDevInfo={updateDevInfo} />}
          </motion.div>
        </AnimatePresence>

        <Footer settings={settings} categories={categories} setSelectedCategory={setSelectedCategory} setView={setView} pages={pages} setSelectedPage={setSelectedPage} setIsDevModalOpen={setIsDevModalOpen} />
        <DeveloperModal isOpen={isDevModalOpen} onClose={() => setIsDevModalOpen(false)} devInfo={devInfo} />
      </main>

      <BottomNav setView={setView} view={view} setSelectedCategory={setSelectedCategory} cartCount={cartCount} settings={settings} />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] bg-black/80 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl backdrop-blur-md flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
