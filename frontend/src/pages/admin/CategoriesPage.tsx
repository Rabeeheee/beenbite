import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderTree, Plus, Edit2, Trash2, X, ChevronRight, ChevronDown, Layers } from 'lucide-react';

interface Category {
  id: string; name: string; slug: string; description: string; parentId: string | null;
  productCount: number; isActive: boolean; children?: Category[];
}

const mockCategories: Category[] = [
  {
    id: '1', name: 'Beverages', slug: 'beverages', description: 'All drinks and beverages', parentId: null, productCount: 45, isActive: true,
    children: [
      { id: '1a', name: 'Hot Drinks', slug: 'hot-drinks', description: 'Coffee, tea, etc.', parentId: '1', productCount: 20, isActive: true },
      { id: '1b', name: 'Cold Drinks', slug: 'cold-drinks', description: 'Juices, smoothies, etc.', parentId: '1', productCount: 15, isActive: true },
      { id: '1c', name: 'Alcoholic', slug: 'alcoholic', description: 'Beer, wine, cocktails', parentId: '1', productCount: 10, isActive: true },
    ],
  },
  {
    id: '2', name: 'Food', slug: 'food', description: 'All food items', parentId: null, productCount: 62, isActive: true,
    children: [
      { id: '2a', name: 'Starters', slug: 'starters', description: 'Appetizers and starters', parentId: '2', productCount: 18, isActive: true },
      { id: '2b', name: 'Main Course', slug: 'main-course', description: 'Main dishes', parentId: '2', productCount: 30, isActive: true },
      { id: '2c', name: 'Sides', slug: 'sides', description: 'Side dishes', parentId: '2', productCount: 14, isActive: true },
    ],
  },
  {
    id: '3', name: 'Desserts', slug: 'desserts', description: 'Sweet treats', parentId: null, productCount: 18, isActive: true,
    children: [
      { id: '3a', name: 'Cakes', slug: 'cakes', description: 'All cakes', parentId: '3', productCount: 8, isActive: true },
      { id: '3b', name: 'Ice Cream', slug: 'ice-cream', description: 'All ice creams', parentId: '3', productCount: 10, isActive: true },
    ],
  },
  { id: '4', name: 'Merchandise', slug: 'merchandise', description: 'Branded merchandise', parentId: null, productCount: 5, isActive: false, children: [] },
];

function CategoryNode({ category, level = 0 }: { category: Category; level?: number }) {
  const [expanded, setExpanded] = useState(level === 0);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50/80 transition-colors border-b border-gray-50 ${level > 0 ? 'bg-gray-50/30' : ''}`}
        style={{ paddingLeft: `${16 + level * 32}px` }}
      >
        <button onClick={() => setExpanded(!expanded)} className={`p-0.5 rounded transition-colors ${hasChildren ? 'hover:bg-gray-200 text-gray-400' : 'text-transparent cursor-default'}`}>
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
        <div className={`p-1.5 rounded-lg ${level === 0 ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>
          {level === 0 ? <FolderTree className="w-4 h-4" /> : <Layers className="w-3.5 h-3.5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 text-sm">{category.name}</span>
            <span className="text-xs text-gray-400">/{category.slug}</span>
          </div>
          {category.description && <p className="text-xs text-gray-400 truncate">{category.description}</p>}
        </div>
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{category.productCount} items</span>
        <span className={`px-2 py-0.5 rounded-full text-xs ${category.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {category.isActive ? 'Active' : 'Inactive'}
        </span>
        <div className="flex gap-1">
          <button className="p-1.5 rounded-lg hover:bg-gray-100"><Edit2 className="w-3.5 h-3.5 text-gray-400" /></button>
          <button className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
        </div>
      </motion.div>
      <AnimatePresence>
        {expanded && hasChildren && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            {category.children!.map((child) => <CategoryNode key={child.id} category={child} level={level + 1} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CategoryForm {
  name: string; slug: string; parentId: string; description: string;
}

const emptyForm: CategoryForm = { name: '', slug: '', parentId: '', description: '' };

export default function CategoriesPage() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CategoryForm>(emptyForm);

  const handleNameChange = (name: string) => {
    setForm({ ...form, name, slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    setForm(emptyForm);
  };

  const totalProducts = mockCategories.reduce((sum, c) => sum + c.productCount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500">Organize your product catalog</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Categories', value: String(mockCategories.length) },
          { label: 'Sub-Categories', value: String(mockCategories.reduce((s, c) => s + (c.children?.length || 0), 0)) },
          { label: 'Total Products', value: String(totalProducts) },
          { label: 'Active', value: String(mockCategories.filter((c) => c.isActive).length) },
        ].map((s) => (
          <div key={s.label} className="card">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Category Tree */}
      <div className="card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
          <h3 className="font-semibold text-gray-700 text-sm">Category Tree</h3>
        </div>
        {mockCategories.map((category) => <CategoryNode key={category.id} category={category} />)}
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Add Category</h2>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input value={form.name} onChange={(e) => handleNameChange(e.target.value)} className="input-field text-sm" placeholder="e.g. Beverages" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input-field text-sm" placeholder="auto-generated" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                  <select value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })} className="input-field text-sm">
                    <option value="">None (Top Level)</option>
                    {mockCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field text-sm resize-none" placeholder="Category description..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 px-4 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 btn-primary text-sm">Add Category</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
