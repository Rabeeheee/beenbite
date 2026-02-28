import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Search, Edit2, Trash2, X, Image, DollarSign, Eye, EyeOff } from 'lucide-react';

const mockProducts = [
  { id: '1', name: 'Cappuccino', category: 'Beverages', price: 180, pointsEarned: 18, stock: 'In Stock', image: '', isActive: true },
  { id: '2', name: 'Margherita Pizza', category: 'Food', price: 350, pointsEarned: 35, stock: 'In Stock', image: '', isActive: true },
  { id: '3', name: 'Caesar Salad', category: 'Food', price: 220, pointsEarned: 22, stock: 'Low Stock', image: '', isActive: true },
  { id: '4', name: 'Espresso', category: 'Beverages', price: 120, pointsEarned: 12, stock: 'In Stock', image: '', isActive: true },
  { id: '5', name: 'Cheesecake', category: 'Desserts', price: 250, pointsEarned: 25, stock: 'Out of Stock', image: '', isActive: false },
  { id: '6', name: 'Craft Beer', category: 'Beverages', price: 400, pointsEarned: 40, stock: 'In Stock', image: '', isActive: true },
  { id: '7', name: 'Garlic Bread', category: 'Food', price: 150, pointsEarned: 15, stock: 'In Stock', image: '', isActive: true },
  { id: '8', name: 'Iced Latte', category: 'Beverages', price: 200, pointsEarned: 20, stock: 'In Stock', image: '', isActive: true },
];

const stockColors: Record<string, string> = {
  'In Stock': 'bg-green-100 text-green-700',
  'Low Stock': 'bg-yellow-100 text-yellow-700',
  'Out of Stock': 'bg-red-100 text-red-700',
};

interface ProductForm {
  name: string; category: string; price: string; pointsEarned: string; description: string;
}

const emptyForm: ProductForm = { name: '', category: '', price: '', pointsEarned: '', description: '' };

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const categories = [...new Set(mockProducts.map((p) => p.category))];

  const filtered = mockProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory ? p.category === filterCategory : true;
    return matchSearch && matchCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    setForm(emptyForm);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your product catalog</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="input-field pl-10 text-sm" />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="input-field w-auto text-sm">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}>Grid</button>
          <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}>List</button>
        </div>
      </div>

      {/* Products Grid */}
      {viewMode === 'grid' ? (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((product) => (
              <motion.div key={product.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card hover:shadow-lg transition-shadow">
                <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl flex items-center justify-center mb-3">
                  <Package className="w-10 h-10 text-gray-300" />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${stockColors[product.stock]}`}>{product.stock}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                  <span className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">+{product.pointsEarned} pts</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                  <button className="flex-1 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-1"><Edit2 className="w-3 h-3" /> Edit</button>
                  <button className="flex-1 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card overflow-hidden p-0">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Points</th>
                <th className="px-6 py-3 font-medium">Stock</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{product.category}</td>
                  <td className="px-6 py-4 font-semibold">₹{product.price}</td>
                  <td className="px-6 py-4 text-primary-600 text-sm">+{product.pointsEarned}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded-full text-xs ${stockColors[product.stock]}`}>{product.stock}</span></td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{product.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-6 py-4 flex gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100"><Edit2 className="w-4 h-4 text-gray-400" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4 text-red-400" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Add Product Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Add Product</h2>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field text-sm" placeholder="e.g. Cappuccino" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field text-sm" required>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field text-sm" placeholder="0" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Points Earned</label>
                    <input type="number" value={form.pointsEarned} onChange={(e) => setForm({ ...form, pointsEarned: e.target.value })} className="input-field text-sm" placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field text-sm resize-none" placeholder="Product description..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary text-sm">Add Product</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
