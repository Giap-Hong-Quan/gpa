import { useState } from "react";


import { motion } from "framer-motion";
import { Search, Loader2, BookOpen } from "lucide-react";
import { useCategories, useMaterials } from "../lib/use-materials";
import { Navigation } from "../components/Navigation";
import { MaterialCard } from "../components/MaterialCard";

export default function StudyMaterials() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");
  
  const categories = useCategories(); // Lấy từ Firebase
  const { data: materials, isLoading } = useMaterials(search, category);

  return (
    <div className="min-h-screen pb-20 pt-28 px-4 bg-[#f8fafc]">
      <Navigation />

      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              Tài Liệu Học Tập
            </h1>
            <p className="text-slate-500 text-lg mt-2">Kho tài liệu chất lượng cao cho sinh viên.</p>
          </motion.div>

          <div className="w-full md:w-96 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
        </header>

        {/* Tab Categories động */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                category === cat 
                ? "bg-slate-800 text-white shadow-lg scale-105" 
                : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid hiển thị tài liệu */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-slate-400 font-medium">Đang lấy dữ liệu từ Cloud...</p>
          </div>
        ) : materials.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold text-xl">Không tìm thấy tài liệu phù hợp</p>
          </div>
        )}
      </div>
    </div>
  );
}