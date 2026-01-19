// src/components/MaterialCard.tsx

import { useState } from "react";
import { Download, ShoppingBag, Lock, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner"; // Hoặc thư viện thông báo bạn đang dùng
import type { Material } from "../types/Materia";


export function MaterialCard({ material }: { material: Material }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isError, setIsError] = useState(false);

  const handleUnlock = () => {
    // So sánh khớp hoàn toàn (Case-sensitive) theo yêu cầu của bạn
    // material.code lấy từ Firebase (ví dụ: "DSA001")
    if (userInput.trim() === material.code) {
      toast.success("Mã xác nhận chính xác!");
      window.open(material.downloadUrl, "_blank");
      setIsOpen(false);
      setUserInput("");
    } else {
      // Hiệu ứng rung khi sai mã
      setIsError(true);
      toast.error("Mã không khớp. Vui lòng kiểm tra lại từng ký tự!");
      setTimeout(() => setIsError(false), 500);
    }
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -8 }}
        className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col h-full group transition-all"
      >
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg">
            {material.category}
          </span>
          <span className="text-slate-300 font-mono text-xs">ID: {material.id}</span>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
          {material.title}
        </h3>
        <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-3">{material.description}</p>

        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center gap-2 shadow-lg"
        >
          <Download className="w-4 h-4" /> Lấy Tài Liệu
        </button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={isError ? { 
                scale: 1, 
                opacity: 1,
                x: [-10, 10, -10, 10, 0] // Hiệu ứng rung lắc khi sai
              } : { scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: isError ? 0.4 : 0.2 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative border border-slate-100"
            >
              <div className="text-center mb-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${isError ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-600'}`}>
                  {isError ? <AlertCircle className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Xác Nhận Quyền Tải</h2>
                <p className="text-sm text-slate-500 mt-1">Vui lòng nhập đúng mã của môn học này</p>
              </div>

              <a 
                href={material.shopeeLink} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 bg-orange-50 text-orange-600 rounded-2xl font-black mb-6 hover:bg-orange-100 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" /> LẤY MÃ TRÊN SHOPEE
              </a>

  <a 
                   href="/"
                    target="_blank"
                    className="flex items-center justify-center gap-3 rounded-xl btn-secondary text-center text-sm py-3 mb-3 transition-colors"
                  >
                    Hướng dẫn Lấy Mã 
                  </a>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                autoComplete="off"
                spellCheck="false"
                placeholder="Nhập mã xác nhận..."
                className={`w-full p-4 rounded-2xl text-center font-mono text-xl outline-none border-2 transition-all mb-6 ${isError ? 'border-red-500 bg-red-50' : 'bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500'}`}
              />

              <div className="flex gap-3">
                <button onClick={handleUnlock} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors">
                  XÁC NHẬN
                </button>
                <button onClick={() => { setIsOpen(false); setUserInput(""); }} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200">
                  HỦY
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}