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
  
  // Kiểm tra mã xác nhận (Shopee Code)
  if (formData.shopeeCode !== MASTER_CODE && formData.shopeeCode !== "9" && formData.shopeeCode !== "12" ) {
    toast.error("Vui lòng nhập mã xác nhận chính xác để mở khóa lộ trình!");
    return;
  }

  // Chuyển đổi dữ liệu từ form
  const currentGpa = parseFloat(formData.currentGpa) || 0;
  const totalCredits = parseInt(formData.totalCredits) || 120;
  const earnedCredits = parseInt(formData.earnedCredits) || 0;
  const targetGpa = parseFloat(formData.targetGpa) || 0;
  const remainingCredits = totalCredits - earnedCredits;
  
  // Kiểm tra nếu đã hoàn thành chương trình học
  if (remainingCredits <= 0) {
    setResult(`
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-black text-green-400">🎓 HÀNH TRÌNH VIÊN MÃN!</h3>
        <p className="text-sm">Bạn đã hoàn thành đủ số tín chỉ rồi. Giờ là lúc tận hưởng thành quả và chờ ngày xướng tên nhận bằng thôi!</p>
      </div>
    `);
    return;
  }

  // Logic tính toán điểm cần đạt (Required GPA)
  const currentPoints = currentGpa * earnedCredits;
  const targetTotalPoints = targetGpa * totalCredits;
  const requiredPoints = targetTotalPoints - currentPoints;
  const requiredGpa = requiredPoints / remainingCredits;

  const maxGrade = system === 4 ? 4.0 : 10.0;
  
  // // Gợi ý mục tiêu môn học cụ thể
  // const suggest3 = Math.min(maxGrade, requiredGpa + 0.1).toFixed(2);
  // const suggest2 = Math.max(0, requiredGpa - 0.2).toFixed(2);

  // --- PHÂN LOẠI KẾT QUẢ VÀ HIỂN THỊ ---

  // TRƯỜNG HỢP 1: BẤT KHẢ THI (Điểm cần đạt > Hệ điểm tối đa)
  if (requiredGpa > maxGrade) {
    setResult(`
      <div className="space-y-4">
        <h3 className="text-xl md:text-2xl font-black uppercase text-yellow-300 text-center">🛑 TOANG RỒI ÔNG GIÁO Ạ!</h3>
        <p className="text-sm leading-relaxed text-center">
          Toán học không biết nói dối: Bạn cần đạt trung bình **${requiredGpa.toFixed(2)}** điểm mỗi kỳ tới. 
          Nhưng khổ nỗi hệ điểm của trường tối đa chỉ có **${maxGrade.toFixed(1)}** thôi! 
        </p>
        
        <div className="bg-red-500/30 p-4 rounded-2xl border border-red-400/50">
          <p className="font-bold text-sm mb-1 text-red-200">🧐 Tại sao lại thế?</p>
          <p className="text-[11px] opacity-90">Vì số tín chỉ còn lại quá ít, dù bạn có đạt điểm tuyệt đối tất cả các môn cũng không "gánh" nổi mục tiêu này.</p>
        </div>

        <div className="bg-white/20 p-4 rounded-2xl border border-white/30">
          <p className="font-bold text-sm text-indigo-200">💡 Kế hoạch "Hồi sinh":</p>
          <ul className="text-xs list-disc ml-5 mt-2 space-y-2">
            <li>Ưu tiên <b>đăng ký học cải thiện</b> các môn điểm D, F ở kỳ cũ để "hack" lại điểm tích lũy nhanh nhất.</li>
            <li>Điều chỉnh mục tiêu xuống một bậc (ví dụ từ Giỏi xuống Khá) để bảo toàn tâm lý cho các kỳ cuối.</li>
          </ul>
        </div>
      </div>
    `);
  } 
  
  // TRƯỜNG HỢP 2: RẤT KHÓ (Cần nỗ lực cực lớn - Chế độ sinh tồn)
  else if (requiredGpa > maxGrade * 0.85) {
    setResult(`
      <div className="space-y-4">
        <h3 className="text-xl md:text-2xl font-black uppercase text-orange-400 text-center">🔥 CHẾ ĐỘ "SUPER SAIYAN"</h3>
        <p className="text-sm text-center">
          GPA mục tiêu mỗi kỳ tới là **${requiredGpa.toFixed(2)}**. Bạn đang đứng giữa ranh giới của một sinh viên ưu tú và một huyền thoại "vượt khó" đấy!
        </p>
        
        <div className="grid grid-cols-2 gap-3 mt-4 text-center">
          <div className="bg-white/20 p-3 rounded-xl border border-white/40">
            <p className="text-[10px] uppercase opacity-70">Target Môn 3 Tín</p>
            <p className="text-lg font-black text-green-300">Điểm A / A+</p>
          </div>
          <div className="bg-white/20 p-3 rounded-xl border border-white/40">
            <p className="text-[10px] uppercase opacity-70">Target Môn 2 Tín</p>
            <p className="text-lg font-black text-green-300">Điểm B+ / A</p>
          </div>
        </div>

        <div className="p-3 bg-indigo-900/40 rounded-xl border border-indigo-400/30">
          <p className="text-[11px] italic leading-tight text-center">
            "Kỷ luật là ánh sáng cuối con đường." Hãy tập trung tiêu diệt các môn nhiều tín chỉ trước, chúng là 'trùm cuối' quyết định vận mệnh của bạn!
          </p>
        </div>
      </div>
    `);
  } 
  
  // TRƯỜNG HỢP 3: KHẢ THI (Dễ dàng đạt được)
  else {
    setResult(`
      <div className="space-y-4">
        <h3 className="text-xl md:text-2xl font-black uppercase text-green-400 text-center">🚀 ĐƯỜNG VỀ ĐÍCH CỰC GẦN!</h3>
        <p className="text-sm text-center">
          Chỉ cần duy trì mức **${requiredGpa.toFixed(2)}**, tấm bằng **${formData.targetGpa}** coi như đã nằm chắc trong tay bạn rồi.
        </p>

        <div className="bg-white/20 p-4 rounded-2xl border border-green-500/30">
          <p className="font-bold text-xs mb-2 tracking-wide text-center">✨ CÔNG THỨC CHIẾN THẮNG:</p>
          <div className="flex justify-between items-center text-xs font-medium">
            <span className="bg-green-500/20 px-2 py-1 rounded">Môn 3 Tín: ${requiredGpa.toFixed(1)}</span>
            <ArrowRight className="w-3 h-3 text-green-400" />
            <span className="bg-green-500/20 px-2 py-1 rounded">Môn 2 Tín: ${(requiredGpa - 0.2).toFixed(1)}</span>
          </div>
        </div>

        <p className="text-[11px] opacity-80 text-center italic leading-relaxed">
          "Phong độ là nhất thời, GPA là mãi mãi." Đừng để deadline hay crush làm xao nhãng nhé!
        </p>
      </div>
    `);
  }
};
  return (
    <div className="min-h-screen pb-10 pt-20 md:pt-28 px-4 bg-[#f8fafc]">
      <Navigation />

      <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10 md:mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="relative z-0 mt-10 md:mt-0" 
        >
          <h1 className="text-3xl md:text-5xl  lg:text-6xl font-extrabold text-slate-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 leading-tight">
            Tính GPA Mục Tiêu
          </h1>
          <p className="text-sm md:text-lg text-slate-500 max-w-2xl mx-auto px-6">
            Lên kế hoạch học tập chi tiết để đạt được tấm bằng mơ ước.
          </p>
        </motion.div>
      </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* PHẦN NHẬP LIỆU */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 shadow-sm border border-slate-100">
              
              <div className="flex items-center justify-between mb-6 md:mb-8 pb-4 border-b border-slate-50">
                <div>
                  <h2 className="text-sm md:text-base font-bold text-slate-800">Cấu hình</h2>
                  <p className="text-[10px] md:text-xs text-slate-400">Chọn hệ điểm của bạn</p>
                </div>
                <div className="inline-flex p-1 bg-slate-100 rounded-lg md:rounded-xl">
                  <button 
                    onClick={() => setSystem(4)}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all ${system === 4 ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
                  >Hệ 4.0</button>
                  <button 
                    onClick={() => setSystem(10)}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all ${system === 10 ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}
                  >Hệ 10</button>
                </div>
              </div>

              <form onSubmit={handleCalculate} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs md:text-sm font-bold text-slate-700 ml-1">GPA Hiện Tại (Hệ {system})</label>
                    <input name="currentGpa" value={formData.currentGpa} onChange={handleChange} type="number" step="0.01" className="w-full p-3.5 md:p-4 bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white border-2 rounded-xl md:rounded-2xl outline-none transition-all text-sm" placeholder={`Ví dụ: ${system === 4 ? '3.0' : '7.5'}`} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs md:text-sm font-bold text-slate-700 ml-1">Tổng Tín Chỉ Toàn Khóa</label>
                    <input name="totalCredits" value={formData.totalCredits} onChange={handleChange} type="number" className="w-full p-3.5 md:p-4 bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white border-2 rounded-xl md:rounded-2xl outline-none transition-all text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs md:text-sm font-bold text-slate-700 ml-1">Tín Chỉ Đã Tích Lũy</label>
                    <input name="earnedCredits" value={formData.earnedCredits} onChange={handleChange} type="number" className="w-full p-3.5 md:p-4 bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white border-2 rounded-xl md:rounded-2xl outline-none transition-all text-sm" placeholder="Ví dụ: 60" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs md:text-sm font-bold text-slate-700 ml-1">Mục Tiêu Xếp Loại</label>
                    <select 
                      name="targetGpa" 
                      value={formData.targetGpa} 
                      onChange={handleChange}
                      className="w-full p-3.5 md:p-4 bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white border-2 rounded-xl md:rounded-2xl outline-none appearance-none transition-all cursor-pointer text-sm"
                    >
                      {(system === 4 ? TARGET_LEVELS : TARGET_LEVELS_10).map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50">
                   <div className="flex justify-between items-end mb-2 px-1">
                      <label className="text-xs font-bold text-slate-700">Mã Xác Nhận (Shopee)</label>
                      <button type="button" className="text-[9px] text-orange-500 font-black uppercase tracking-wider hover:opacity-80">Hướng dẫn</button>
                   </div>
                   <div className="flex gap-2 md:gap-3">
                      <input name="shopeeCode" value={formData.shopeeCode} onChange={handleChange} type="text" className="flex-1 p-3.5 md:p-4 bg-orange-50/30 border-2 border-dashed border-orange-200 text-orange-700 font-mono rounded-xl md:rounded-2xl outline-none focus:border-orange-400 transition-all text-center tracking-widest uppercase text-sm" placeholder="NHẬP MÃ" autoComplete="off" />
                      <a href={linkshope} target="_blank"  className="p-3.5 md:p-4 bg-orange-500 text-white rounded-xl md:rounded-2xl hover:bg-orange-600 shadow-md shadow-orange-200 shrink-0">
                        <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                      </a>
                   </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button type="submit" className="flex-[3] py-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm md:text-base">
                    Tính Kết Quả <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button type="button" onClick={() => {setResult(null); setFormData({...formData, currentGpa: "", earnedCredits: "", shopeeCode: ""})}} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl md:rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center text-sm md:text-base">
                    <RotateCcw className="w-4 h-4 md:w-5 md:h-5 sm:mr-0 mr-2" /> <span className="sm:hidden">Làm mới</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* CỘT HỖ TRỢ & KẾT QUẢ */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="p-6 md:p-8 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[1.5rem] md:rounded-[2.5rem] text-white shadow-xl">
                  <div className="relative z-10">
                    <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 mb-4 text-indigo-200" />
                    <h3 className="text-lg md:text-xl font-bold mb-3">Phân tích lộ trình</h3>
                    <div className="text-sm md:text-lg opacity-90 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: result.replace(/\*\*(.*?)\*\*/g, '<span class="text-xl md:text-2xl text-white font-black border-b-2 border-indigo-300">$1</span>') }} />
                  </div>
                </motion.div>
              ) : (
                <div className="p-6 md:p-8 bg-indigo-50/50 rounded-[1.5rem] md:rounded-[2.5rem] border border-indigo-100 space-y-4">
                  <h3 className="font-bold text-indigo-900 flex items-center gap-2 text-sm md:text-base">
                    <Info className="w-4 h-4 md:w-5 md:h-5" /> Thông tin hỗ trợ
                  </h3>
                  <p className="text-xs md:text-sm text-indigo-700/80 leading-relaxed">
                    Hệ thống tự động tính toán số tín chỉ còn lại để đưa ra mục tiêu sát thực tế nhất.
                  </p>
                  <div className="pt-4 border-t border-indigo-100">
                     <p className="text-[10px] uppercase tracking-widest font-black text-indigo-300 mb-3">Quy đổi xếp loại</p>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[11px] md:text-xs"><span className="text-indigo-600 font-bold">Xuất sắc</span> <span className="font-mono text-indigo-900">3.60 | 9.00</span></div>
                        <div className="flex justify-between text-[11px] md:text-xs"><span className="text-indigo-600 font-bold">Giỏi</span> <span className="font-mono text-indigo-900">3.20 | 8.00</span></div>
                        <div className="flex justify-between text-[11px] md:text-xs"><span className="text-indigo-600 font-bold">Khá</span> <span className="font-mono text-indigo-900">2.50 | 6.50</span></div>
                     </div>
                  </div>
                </div>
              )}
            </AnimatePresence>

            <div className="p-6 md:p-8 bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm md:text-base">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-orange-500" /> Nhận mã miễn phí
              </h3>
              <div className="space-y-4">
                <div className="space-y-3">
                  {["Vào link Shopee UniHelper", "Xem số lượng ảnh sản phẩm", "Lưu ý lấy số sau /", "Nhập số ảnh xem kết quả"].map((step, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex gap-3 items-center">
                        <span className="w-5 h-5 rounded-md bg-slate-50 text-slate-400 text-[9px] font-black flex items-center justify-center shrink-0 border border-slate-100">
                          {i + 1}
                        </span>
                        <p className="text-[11px] md:text-xs text-slate-500 font-medium">{step}</p>
                      </div>
                      {i === 1 && (
                        <div className="ml-8">
                          <img 
                            src="/step2.jpg"
                            alt="Hướng dẫn"
                            className="rounded-lg border border-slate-100 shadow-sm w-32 md:w-full max-w-[180px] object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <a 
                   href={linkshope}
                    target="_blank"
                    className="w-full inline-block bg-slate-800 text-white rounded-xl text-center text-[11px] md:text-sm py-3 font-bold hover:bg-slate-900 transition-colors"
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