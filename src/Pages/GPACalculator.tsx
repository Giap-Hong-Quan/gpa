import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw, AlertCircle, ShoppingBag, CheckCircle2, Info } from "lucide-react";
import { Navigation } from "../components/Navigation";
import { toast } from "sonner";

const TARGET_LEVELS = [
  { label: "Xuất sắc (3.6 - 4.0)", value: 3.6, sys: 4 },
  { label: "Giỏi (3.2 - 3.59)", value: 3.2, sys: 4 },
  { label: "Khá (2.5 - 3.19)", value: 2.5, sys: 4 },
  { label: "Trung bình (2.0 - 2.49)", value: 2.0, sys: 4 },
];

const TARGET_LEVELS_10 = [
  { label: "Xuất sắc (9.0 - 10)", value: 9.0, sys: 10 },
  { label: "Giỏi (8.0 - 8.9)", value: 8.0, sys: 10 },
  { label: "Khá (6.5 - 7.9)", value: 6.5, sys: 10 },
  { label: "Trung bình (5.0 - 6.4)", value: 5.0, sys: 10 },
];

export default function GPACalculator() {
  const [system, setSystem] = useState<4 | 10>(4);
  const linkshope="https://s.shopee.vn/3LKiA01HTq"
  const [formData, setFormData] = useState({
    currentGpa: "",
    totalCredits: "120",
    earnedCredits: "",
    targetGpa: "3.2",
    shopeeCode: "",
  });
  const [result, setResult] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCalculate = (e: React.FormEvent) => {
    const MASTER_CODE = "UNI123";
    e.preventDefault();
    if (formData.shopeeCode !== MASTER_CODE && formData.shopeeCode !== "AUH-SEP-GEY") {
     toast.error("Vui lòng nhập mã xác nhận hoặc không chính xác")
      return;
    }

    const currentGpa = parseFloat(formData.currentGpa) || 0;
    const totalCredits = parseInt(formData.totalCredits) || 0;
    const earnedCredits = parseInt(formData.earnedCredits) || 0;
    const targetGpa = parseFloat(formData.targetGpa) || 0;
    const remainingCredits = totalCredits - earnedCredits;
    
    if (remainingCredits <= 0) {
      setResult("Bạn đã hoàn thành chương trình học!");
      return;
    }

    const currentPoints = currentGpa * earnedCredits;
    const targetTotalPoints = targetGpa * totalCredits;
    const requiredPoints = targetTotalPoints - currentPoints;
    const requiredGpa = requiredPoints / remainingCredits;

    const maxGrade = system === 4 ? 4.0 : 10.0;

   const suggest3 = Math.min(maxGrade, requiredGpa + 0.2).toFixed(2);
  const suggest2 = Math.max(0, requiredGpa - 0.3).toFixed(2);

  if (requiredGpa > maxGrade) {
    setResult(`
      <div className="space-y-4">
        <h3 className="text-2xl font-black">🚧 ĐƯỜNG CÒN DÀI, TA ĐỔI HƯỚNG ĐI!</h3>
        <p>Mức điểm **${requiredGpa.toFixed(2)}** hiện tại giống như leo núi mà không có dây bảo hiểm. Đừng cố quá thành quá cố!</p>
        <div className="bg-white/20 p-4 rounded-2xl border border-white/30">
          <p className="font-bold">💡 Chiến thuật "Hồi sinh":</p>
          <ul className="text-sm list-disc ml-5 mt-2">
            <li>Đăng ký <b>học cải thiện</b> các môn điểm D, F ở kỳ trước.</li>
            <li>Đây là cách "hack" điểm nhanh nhất để giảm áp lực cho các môn mới.</li>
          </ul>
        </div>
      </div>
    `);
  } else if (requiredGpa > maxGrade * 0.85) {
    setResult(`
      <div className="space-y-4">
        <h3 className="text-2xl font-black">🔥 CHẾ ĐỘ "SINH TỒN": TIẾN LÊN HOẶC DỪNG LẠI!</h3>
        <p>GPA mục tiêu: **${requiredGpa.toFixed(2)}**. Bạn đang ở ngưỡng cửa của những huyền thoại.</p>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <p className="text-xs uppercase opacity-70">Môn 3 tín chỉ</p>
            <p className="text-xl font-black">Target: ${suggest3}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-xl">
            <p className="text-xs uppercase opacity-70">Môn 2 tín chỉ</p>
            <p className="text-xl font-black">Target: ${suggest2}</p>
          </div>
        </div>
        <p className="text-sm italic">"Kỷ luật là cầu nối giữa mục tiêu và thành tựu." Hãy tập trung tối đa vào các môn 3 tín - chúng là 'trùm cuối' quyết định cuộc chơi này!</p>
      </div>
    `);
  } else {
    setResult(`
      <div className="space-y-4">
        <h3 className="text-2xl font-black">🚀 TĂNG TỐC VỀ ĐÍCH: DỄ NHƯ ĂN BÁNH!</h3>
        <p>Chỉ cần **${requiredGpa.toFixed(2)}**, tấm bằng ${formData.targetGpa} đã nằm chắc trong tay bạn.</p>
        <div className="bg-white/20 p-4 rounded-2xl">
          <p className="font-bold">✨ Công thức chiến thắng:</p>
          <p className="text-sm mt-2">Môn 3 tín chỉ đạt <b>${requiredGpa.toFixed(1)}</b>, môn 2 tín chỉ chỉ cần <b>${(requiredGpa - 0.2).toFixed(1)}</b> là dư sức cán đích!</p>
        </div>
        <p className="text-sm">Hãy giữ vững phong độ. Đừng chỉ học để đạt mục tiêu, hãy học để trở thành phiên bản xuất sắc nhất của chính mình!</p>
      </div>
    `);
  }
  };

  return (
    <div className="min-h-screen pb-20 pt-28 px-4 bg-[#f8fafc]">
      <Navigation />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Tính GPA Mục Tiêu
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Lên kế hoạch học tập chi tiết để đạt được tấm bằng mơ ước.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* PHẦN NHẬP LIỆU */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 transition-all">
              
              {/* Selector hệ điểm nằm ngay trong card */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
                <div>
                  <h2 className="font-bold text-slate-800">Cấu hình tính toán</h2>
                  <p className="text-xs text-slate-400">Chọn hệ điểm trường bạn đang sử dụng</p>
                </div>
                <div className="inline-flex p-1 bg-slate-100 rounded-xl">
                  <button 
                    onClick={() => setSystem(4)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${system === 4 ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
                  >Hệ 4.0</button>
                  <button 
                    onClick={() => setSystem(10)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${system === 10 ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
                  >Hệ 10</button>
                </div>
              </div>

              <form onSubmit={handleCalculate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-2">GPA Hiện Tại (Hệ {system})</label>
                    <input name="currentGpa" value={formData.currentGpa} onChange={handleChange} type="number" step="0.01" className="w-full p-4 bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white border-2 rounded-2xl outline-none transition-all" placeholder={`Ví dụ: ${system === 4 ? '3.0' : '7.5'}`} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-2">Tổng Tín Chỉ Toàn Khóa</label>
                    <input name="totalCredits" value={formData.totalCredits} onChange={handleChange} type="number" className="w-full p-4 bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white border-2 rounded-2xl outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-2">Tín Chỉ Đã Tích Lũy</label>
                    <input name="earnedCredits" value={formData.earnedCredits} onChange={handleChange} type="number" className="w-full p-4 bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white border-2 rounded-2xl outline-none transition-all" placeholder="Ví dụ: 60" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-2">Mục Tiêu Xếp Loại Bằng</label>
                    <select 
                      name="targetGpa" 
                      value={formData.targetGpa} 
                      onChange={handleChange}
                      className="w-full p-4 bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white border-2 rounded-2xl outline-none appearance-none transition-all cursor-pointer"
                    >
                      {(system === 4 ? TARGET_LEVELS : TARGET_LEVELS_10).map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50">
                   <div className="flex justify-between items-end mb-2 px-2">
                      <label className="text-sm font-bold text-slate-700">Mã Xác Nhận (Shopee)</label>
                      <button type="button" className="text-[10px] text-orange-500 font-black uppercase tracking-wider hover:opacity-80">Hướng dẫn lấy mã</button>
                   </div>
                   <div className="flex gap-3">
                      <input name="shopeeCode" value={formData.shopeeCode} onChange={handleChange} type="text" className="flex-1 p-4 bg-orange-50/30 border-2 border-dashed border-orange-200 text-orange-700 font-mono rounded-2xl outline-none focus:border-orange-400 transition-all text-center tracking-[0.2em] uppercase" placeholder="NHẬP MÃ TẠI ĐÂY" autoComplete="off" />
                      <a href={linkshope} target="_blank"  className="p-4 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-transform active:scale-95 shadow-md shadow-orange-200">
                        <ShoppingBag className="w-6 h-6" />
                      </a>
                   </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button type="submit" className="flex-[3] py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2">
                    Tính Kết Quả <ArrowRight className="w-5 h-5" />
                  </button>
                  <button type="button" onClick={() => {setResult(null); setFormData({...formData, currentGpa: "", earnedCredits: "", shopeeCode: ""})}} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center">
                    <RotateCcw className="w-5 h-5" /> Làm mới
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* CỘT HỖ TRỢ & KẾT QUẢ */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="p-8 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10">
                    <CheckCircle2 className="w-10 h-10 mb-4 text-indigo-200" />
                    <h3 className="text-xl font-bold mb-2">Phân tích lộ trình</h3>
                    <div className="text-lg opacity-90 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: result.replace(/\*\*(.*?)\*\*/g, '<span class="text-2xl text-white font-black border-b-2 border-indigo-300">$1</span>') }} />
                  </div>
                </motion.div>
              ) : (
                <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 space-y-4">
                  <h3 className="font-bold text-indigo-900 flex items-center gap-2">
                    <Info className="w-5 h-5" /> Thông tin hỗ trợ
                  </h3>
                  <p className="text-sm text-indigo-700/80 leading-relaxed">
                    Hệ thống tự động trừ đi số tín chỉ bạn đã học để đưa ra mục tiêu chính xác nhất cho các kỳ còn lại.
                  </p>
                  <div className="pt-4 border-t border-indigo-100">
                     <p className="text-[10px] uppercase tracking-widest font-black text-indigo-300 mb-3">Quy đổi xếp loại</p>
                     <div className="space-y-2">
                        <div className="flex justify-between text-xs"><span className="text-indigo-600 font-bold">Xuất sắc</span> <span className="font-mono text-indigo-900">3.60 | 9.00</span></div>
                        <div className="flex justify-between text-xs"><span className="text-indigo-600 font-bold">Giỏi</span> <span className="font-mono text-indigo-900">3.20 | 8.00</span></div>
                        <div className="flex justify-between text-xs"><span className="text-indigo-600 font-bold">Khá</span> <span className="font-mono text-indigo-900">2.50 | 6.50</span></div>
                     </div>
                  </div>
                </div>
              )}
            </AnimatePresence>

            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" /> Nhận mã miễn phí
              </h3>
              <div className="space-y-4">
               <div className="space-y-4">
  {["Vào link Shopee UniHelper", "Chọn nút chia sẻ", "Nhấn copy code để lấy mã", "Nhập mã để xem kết quả"].map((step, i) => (
    <div key={i} className="space-y-3"> {/* Thêm space-y để tạo khoảng cách với ảnh */}
      <div className="flex gap-4 items-center">
        <span className="w-6 h-6 rounded-lg bg-slate-50 text-slate-400 text-[10px] font-black flex items-center justify-center shrink-0 border border-slate-100">
          {i + 1}
        </span>
        <p className="text-xs text-slate-500 font-medium">{step}</p>
      </div>

      {/* Kiểm tra nếu là bước 2 (i === 1) thì hiển thị ảnh */}
      {i === 1 && (
        <div className="ml-10"> {/* Đẩy vào lề để thẳng hàng với text */}
          <img 
            src="/step2.jpg" // Thay bằng đường dẫn ảnh của bạn
            alt="Hướng dẫn chia sẻ Shopee"
            className="rounded-xl border border-slate-100 shadow-sm w-full max-w-[200px] object-cover"
          />
        </div>
      )}
    </div>
  ))}
</div>
                <a 
                   href={linkshope}
                    target="_blank"
                    className="w-full btn-secondary text-center text-sm py-3"
                  >
                    Đến Shopee Lấy Mã Ngay
                  </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}