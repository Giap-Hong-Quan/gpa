import { useState } from "react";
import {Download, ShoppingBag, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Material } from "../types/Materia";

export function MaterialCard({ material }: { material: Material }) {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");

  const handleUnlock = () => {
    if (code === "UNI123" || code === "FREE") { // Mã test của bạn
      window.open(material.downloadUrl, "_blank");
      setIsOpen(false);
      setCode("");
    } else {
      alert("Mã không đúng, vui lòng kiểm tra lại trên Shopee!");
    }
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -8 }}
        className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col h-full group transition-all hover:shadow-xl hover:shadow-indigo-100/50"
      >
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg">
            {material.category}
          </span>
          <span className="text-slate-300 font-mono text-xs">{material.code}</span>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">
          {material.title}
        </h3>
        <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-3">{material.description}</p>

        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" /> Lấy Tài Liệu
        </button>
      </motion.div>

      {/* Dialog tùy biến không cần thư viện ngoài (cho nhanh) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Mã Xác Nhận</h2>
                <p className="text-sm text-slate-500 mt-1">Lấy mã miễn phí tại link Shopee bên dưới</p>
              </div>

              <a 
                href={material.shopeeLink} target="_blank"
                className="flex items-center justify-center gap-3 p-4 bg-orange-50 text-orange-600 rounded-2xl font-black mb-6 hover:bg-orange-100 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" /> ĐẾN SHOPEE LẤY MÃ
              </a>

              <input
                type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="NHẬP MÃ TẠI ĐÂY"
                className="w-full p-4 bg-slate-100 rounded-2xl text-center font-mono text-xl tracking-[0.3em] outline-none focus:ring-2 focus:ring-primary mb-6"
              />

              <div className="flex gap-3">
                <button onClick={handleUnlock} className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold">XÁC NHẬN</button>
                <button onClick={() => setIsOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold">ĐÓNG</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}