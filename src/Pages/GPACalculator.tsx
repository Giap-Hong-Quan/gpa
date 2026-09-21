import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calculator, 
  RotateCcw,
  ArrowRight,
  CheckCircle2, 
  BookOpen, 
  HelpCircle,
  TrendingUp,
  Award,
  Sparkles,
  Layers,
  BarChart3
} from "lucide-react";
import { Navigation } from "../components/Navigation";
import { toast } from "sonner";

// Bảng thang điểm quy đổi
const GRADE_CONVERSION_TABLE = [
  { scale10: "8.95 – 10", scale4: "4.0", letter: "A+", label: "Xuất sắc", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { scale10: "8.45 – 8.94", scale4: "3.7", letter: "A", label: "Giỏi xuất sắc", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { scale10: "7.95 – 8.44", scale4: "3.5", letter: "B+", label: "Khá giỏi", color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  { scale10: "6.95 – 7.94", scale4: "3.0", letter: "B", label: "Khá", color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  { scale10: "6.45 – 6.94", scale4: "2.5", letter: "C+", label: "Trung bình khá", color: "text-amber-600 bg-amber-50 border-amber-200" },
  { scale10: "5.45 – 6.44", scale4: "2.0", letter: "C", label: "Trung bình", color: "text-amber-600 bg-amber-50 border-amber-200" },
  { scale10: "4.95 – 5.44", scale4: "1.5", letter: "D+", label: "Trung bình yếu", color: "text-orange-600 bg-orange-50 border-orange-200" },
  { scale10: "3.95 – 4.94", scale4: "1.0", letter: "D", label: "Yếu", color: "text-rose-600 bg-rose-50 border-rose-200" },
  { scale10: "0 – 3.94", scale4: "0.0", letter: "F", label: "Kém (Học lại)", color: "text-red-700 bg-red-100 border-red-200" },
];

// Helper format số thập phân dạng phẩy VN
const formatVN = (num: number, digits: number = 2) => {
  if (isNaN(num)) return "0,00";
  return num.toFixed(digits).replace(".", ",");
};

export default function GPACalculator() {
  const [cumInputs, setCumInputs] = useState({
    currentGpa: "3.0",
    completedCredits: "60",
    newGpa: "3.2",
    newCredits: "12",
  });

  const [cumResult, setCumResult] = useState<{
    currentGpa: number;
    completedCredits: number;
    newGpa: number;
    newCredits: number;
    currentQP: number;
    newQP: number;
    totalCredits: number;
    totalQP: number;
    cumulativeGpa: number;
  } | null>({
    currentGpa: 3.0,
    completedCredits: 60,
    newGpa: 3.2,
    newCredits: 12,
    currentQP: 180.0,
    newQP: 38.4,
    totalCredits: 72,
    totalQP: 218.4,
    cumulativeGpa: 3.0333,
  });

  // Cơ chế tự động mở link trong tab mới sau 5 giây đầu tiên khi mở web
  useEffect(() => {
    let hasOpened = false;
    let timerPassed = false;

    const openShopeeTab = () => {
      if (hasOpened) return;
      hasOpened = true;
      window.open("https://s.shopee.vn/6L4blHqS7v", "_blank", "noopener,noreferrer");
    };

    // Đếm 5 giây đầu tiên
    const timer = setTimeout(() => {
      timerPassed = true;
      openShopeeTab();
    }, 5000);

    // Bắt tương tác để vượt qua cơ chế chặn Popup (Popup Blocker) của Chrome/Safari
    const handleUserInteraction = () => {
      if (timerPassed && !hasOpened) {
        openShopeeTab();
      }
    };

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  const handleCumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCumInputs({
      ...cumInputs,
      [e.target.name]: e.target.value,
    });
  };

  const handleCalculateCumulative = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const curGpa = parseFloat(cumInputs.currentGpa.replace(",", "."));
    const curCredits = parseFloat(cumInputs.completedCredits);
    const nGpa = parseFloat(cumInputs.newGpa.replace(",", "."));
    const nCredits = parseFloat(cumInputs.newCredits);

    if (isNaN(curGpa) || isNaN(curCredits) || isNaN(nGpa) || isNaN(nCredits)) {
      toast.error("Vui lòng nhập đầy đủ các trường thông tin!");
      return;
    }

    if (curGpa < 0 || curGpa > 4.0 || nGpa < 0 || nGpa > 4.0) {
      toast.warning("Điểm GPA phải nằm trong thang điểm 4.0 (từ 0 đến 4.0)!");
    }

    if (curCredits < 0 || nCredits < 0) {
      toast.error("Số tín chỉ không thể là số âm!");
      return;
    }

    const currentQP = curGpa * curCredits;
    const newQP = nGpa * nCredits;
    const totalCredits = curCredits + nCredits;
    const totalQP = currentQP + newQP;
    const cumulativeGpa = totalCredits > 0 ? totalQP / totalCredits : 0;

    setCumResult({
      currentGpa: curGpa,
      completedCredits: curCredits,
      newGpa: nGpa,
      newCredits: nCredits,
      currentQP,
      newQP,
      totalCredits,
      totalQP,
      cumulativeGpa,
    });

    toast.success("Tính toán hoàn tất!");
  };

  const handleResetCumulative = () => {
    setCumInputs({
      currentGpa: "",
      completedCredits: "",
      newGpa: "",
      newCredits: "",
    });
    setCumResult(null);
    toast.info("Đã làm mới các trường nhập liệu");
  };

  return (
    <div className="min-h-screen pb-20 pt-24 md:pt-28 lg:pt-32 px-4 bg-[#f8fafc]">
      <Navigation />

      <div className="max-w-6xl mx-auto">
        {/* Header Title */}
        <div className="text-center mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-0"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 leading-tight">
              Công cụ tính GPA Tích luỹ
            </h1>
            <p className="text-sm md:text-lg text-slate-500 max-w-2xl mx-auto px-6">
              Tính toán và dự báo điểm trung bình tích luỹ (Cumulative GPA) khi thêm môn hoặc học kỳ mới nhanh chóng và chính xác.
            </p>
          </motion.div>
        </div>

        {/* 2 Cột Tính Toán & Kết Quả theo Design System chuẩn của Web */}
        <div className="grid lg:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* CỘT TRÁI: NHẬP PHÉP TÍNH */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              Nhập phép tính
            </h2>

            <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-sm border border-slate-100">
              <form onSubmit={handleCalculateCumulative} className="space-y-4 md:space-y-6">
                {/* GPA hiện tại */}
                <div className="space-y-1.5">
                  <label className="text-xs md:text-sm font-bold text-slate-700 ml-1">
                    GPA hiện tại:
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    name="currentGpa"
                    value={cumInputs.currentGpa}
                    onChange={handleCumChange}
                    placeholder="3.0"
                    className="w-full p-3.5 md:p-4 bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white border-2 rounded-xl md:rounded-2xl outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
                  />
                  <p className="text-[11px] md:text-xs text-slate-400 ml-1">
                    Nhập GPA hiện tại của bạn (thang 4.0)
                  </p>
                </div>

                {/* Tổng số tín chỉ đã hoàn thành */}
                <div className="space-y-1.5">
                  <label className="text-xs md:text-sm font-bold text-slate-700 ml-1">
                    Tổng số tín chỉ đã hoàn thành:
                  </label>
                  <input
                    type="number"
                    name="completedCredits"
                    value={cumInputs.completedCredits}
                    onChange={handleCumChange}
                    placeholder="60"
                    min="0"
                    className="w-full p-3.5 md:p-4 bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white border-2 rounded-xl md:rounded-2xl outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
                  />
                  <p className="text-[11px] md:text-xs text-slate-400 ml-1">
                    Tổng số tín chỉ bạn đã tích lũy
                  </p>
                </div>

                {/* GPA dự kiến của môn/học kỳ mới */}
                <div className="space-y-1.5">
                  <label className="text-xs md:text-sm font-bold text-slate-700 ml-1">
                    GPA dự kiến của môn/học kỳ mới:
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    name="newGpa"
                    value={cumInputs.newGpa}
                    onChange={handleCumChange}
                    placeholder="3.2"
                    className="w-full p-3.5 md:p-4 bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white border-2 rounded-xl md:rounded-2xl outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
                  />
                  <p className="text-[11px] md:text-xs text-slate-400 ml-1">
                    GPA bạn mong đợi cho các tín chỉ mới
                  </p>
                </div>

                {/* Số tín chỉ của môn/học kỳ mới */}
                <div className="space-y-1.5">
                  <label className="text-xs md:text-sm font-bold text-slate-700 ml-1">
                    Số tín chỉ của môn/học kỳ mới:
                  </label>
                  <input
                    type="number"
                    name="newCredits"
                    value={cumInputs.newCredits}
                    onChange={handleCumChange}
                    placeholder="12"
                    min="0"
                    className="w-full p-3.5 md:p-4 bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white border-2 rounded-xl md:rounded-2xl outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
                  />
                  <p className="text-[11px] md:text-xs text-slate-400 ml-1">
                    Số tín chỉ của các khóa học mới
                  </p>
                </div>

                {/* Nút hành động */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="flex-[3] py-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer"
                  >
                    Tính toán <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetCumulative}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-bold hover:bg-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Làm mới</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* CỘT PHẢI: KẾT QUẢ */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Kết quả
            </h2>

            {cumResult ? (
              <div className="space-y-6">
                {/* Khối Điểm GPA Tích Luỹ nổi bật */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 md:p-8 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-[1.5rem] md:rounded-[2.5rem] text-white shadow-xl shadow-indigo-200/50"
                >
                  <div className="text-center space-y-2">
                    <p className="text-indigo-200 text-xs md:text-sm font-bold uppercase tracking-wider">
                      GPA Tích Lũy (Cumulative GPA)
                    </p>
                    <div className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight">
                      {formatVN(cumResult.cumulativeGpa, 2)}
                    </div>
                    <p className="text-indigo-100/80 text-xs md:text-sm font-medium pt-1">
                      Dựa trên {cumResult.totalCredits} tín chỉ tích luỹ toàn khóa
                    </p>
                  </div>
                </motion.div>

                {/* Bảng Tóm tắt đầu vào */}
                <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 border border-slate-100 shadow-sm space-y-3">
                  <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" /> Tóm tắt đầu vào
                  </h3>
                  <div className="overflow-hidden rounded-xl border border-slate-100">
                    <table className="w-full text-left text-xs md:text-sm">
                      <thead>
                        <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                          <th className="py-2.5 px-4">Thông tin</th>
                          <th className="py-2.5 px-4 text-right">Giá trị</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-4 text-slate-600 font-medium">GPA hiện tại</td>
                          <td className="py-2.5 px-4 text-right font-bold text-indigo-600 font-mono">
                            {formatVN(cumResult.currentGpa, 2)}
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-4 text-slate-600 font-medium">Tổng tín chỉ đã hoàn thành</td>
                          <td className="py-2.5 px-4 text-right font-bold text-slate-800 font-mono">
                            {cumResult.completedCredits}
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-4 text-slate-600 font-medium">GPA dự kiến mới</td>
                          <td className="py-2.5 px-4 text-right font-bold text-indigo-600 font-mono">
                            {formatVN(cumResult.newGpa, 2)}
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-4 text-slate-600 font-medium">Số tín chỉ mới</td>
                          <td className="py-2.5 px-4 text-right font-bold text-slate-800 font-mono">
                            {cumResult.newCredits}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bảng Chi tiết tính toán */}
                <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 border border-slate-100 shadow-sm space-y-3">
                  <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-violet-600" /> Chi tiết tính toán
                  </h3>
                  <div className="overflow-hidden rounded-xl border border-slate-100">
                    <table className="w-full text-left text-xs md:text-sm">
                      <thead>
                        <tr className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-100">
                          <th className="py-2.5 px-4">Phép tính</th>
                          <th className="py-2.5 px-4 text-right">Giá trị</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-4 text-slate-600 font-medium">Tổng điểm chất lượng hiện tại (QP)</td>
                          <td className="py-2.5 px-4 text-right font-bold text-slate-800 font-mono">
                            {formatVN(cumResult.currentQP, 1)}
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-4 text-slate-600 font-medium">Điểm chất lượng mới (QP)</td>
                          <td className="py-2.5 px-4 text-right font-bold text-slate-800 font-mono">
                            {formatVN(cumResult.newQP, 1)}
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-4 text-slate-600 font-medium">Tổng tín chỉ mới</td>
                          <td className="py-2.5 px-4 text-right font-bold text-slate-800 font-mono">
                            {cumResult.totalCredits}
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50 transition-colors bg-indigo-50/40">
                          <td className="py-2.5 px-4 text-indigo-900 font-bold">Tổng điểm chất lượng mới (QP)</td>
                          <td className="py-2.5 px-4 text-right font-bold text-indigo-700 font-mono">
                            {formatVN(cumResult.totalQP, 1)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-dashed border-slate-200 text-center text-slate-400 space-y-3">
                <Calculator className="w-12 h-12 mx-auto text-slate-300" />
                <p className="font-semibold text-slate-600">Chưa có kết quả tính toán</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Hãy nhập các thông số ở bên trái và bấm &quot;Tính toán&quot; để nhận bảng phân tích.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* BÀI VIẾT GIẢI THÍCH CHI TIẾT ĐIỂM GPA TÍCH LUỸ */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-sm space-y-8 mt-12 md:mt-16">
          <div className="border-b border-slate-100 pb-6">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-3">
              Giải thích về Điểm GPA Tích Lũy (Cumulative GPA)
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Điểm GPA Tích Lũy (Cumulative Grade Point Average – CGPA hoặc thường gọi tắt là GPA) là một chỉ số quan trọng phản ánh kết quả học tập tổng thể của một sinh viên/học sinh trong suốt một khoảng thời gian nhất định (ví dụ: toàn bộ quá trình học đại học, một năm học, một học kỳ). Nó là điểm trung bình của tất cả các môn học bạn đã hoàn thành, có tính đến trọng số là số tín chỉ (hoặc đơn vị học trình) của mỗi môn.
            </p>
          </div>

          {/* Mục 1: GPA là gì? */}
          <div className="space-y-4">
            <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
                1
              </span>
              GPA là gì?
            </h3>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              GPA là viết tắt của <strong>&ldquo;Grade Point Average&rdquo;</strong> – Điểm trung bình học tập. Nó thể hiện mức độ thành công chung của bạn trong các khóa học đã tham gia.
            </p>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed">
              Thang điểm phổ biến nhất là thang 4.0 (ở Mỹ và nhiều trường đại học tại Việt Nam), nhưng cũng có thể là thang 10 tùy thuộc vào hệ thống giáo dục. Công cụ tính này sử dụng <strong>thang 4.0</strong> chuẩn.
            </p>

            {/* Bảng quy đổi thang điểm hệ 10, hệ 4 và điểm chữ */}
            <div className="mt-4 pt-2">
              <h4 className="text-sm md:text-base font-bold text-slate-700 mb-3">
                Thang điểm hệ 10, hệ 4 và điểm dạng chữ:
              </h4>
              <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-xs">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
                      <th className="py-3 px-4">Điểm hệ 10</th>
                      <th className="py-3 px-4">Điểm hệ 4</th>
                      <th className="py-3 px-4">Điểm dạng chữ</th>
                      <th className="py-3 px-4">Xếp loại học lực</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {GRADE_CONVERSION_TABLE.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-slate-700 font-mono">
                          {row.scale10}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-indigo-600 font-mono">
                          {row.scale4}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-md font-bold font-mono text-xs border ${row.color}`}>
                            {row.letter}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 font-medium">
                          {row.label}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Mục 2: Cumulative GPA khác gì GPA Học Kỳ */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
                2
              </span>
              Cumulative GPA (GPA Tích Lũy) khác gì GPA Học Kỳ?
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-800 text-sm mb-1 text-indigo-700">
                  GPA Học Kỳ (Semester GPA):
                </h4>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Chỉ tính điểm trung bình của các môn học trong <strong>một học kỳ cụ thể</strong>.
                </p>
              </div>
              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                <h4 className="font-bold text-slate-800 text-sm mb-1 text-indigo-700">
                  GPA Tích Lũy (Cumulative GPA):
                </h4>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  Tính điểm trung bình của <strong>tất cả</strong> các môn học bạn đã hoàn thành (từ khi bắt đầu chương trình học cho đến thời điểm hiện tại), bao gồm điểm của nhiều học kỳ cộng lại.
                </p>
              </div>
            </div>
          </div>

          {/* Mục 3: Tại sao GPA Tích Lũy lại quan trọng? */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
                3
              </span>
              Tại sao GPA Tích Lũy lại quan trọng?
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-1">
                <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600" /> Đánh giá năng lực
                </p>
                <p className="text-xs text-slate-600">
                  Là thước đo tổng quát về năng lực học tập và sự nỗ lực bền bỉ của sinh viên.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-1">
                <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" /> Xét tốt nghiệp
                </p>
                <p className="text-xs text-slate-600">
                  Các trường đại học luôn yêu cầu sinh viên đạt mức GPA tích lũy tối thiểu để được cấp bằng.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-1">
                <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" /> Học bổng & Khen thưởng
                </p>
                <p className="text-xs text-slate-600">
                  Tiêu chí quyết định để nhận học bổng khuyến khích học tập, danh hiệu sinh viên giỏi, xuất sắc.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-1">
                <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" /> Chuyển tiếp & Học cao học
                </p>
                <p className="text-xs text-slate-600">
                  Yếu tố then chốt khi ứng tuyển học bổng du học hoặc xét tuyển chương trình thạc sĩ, tiến sĩ.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-1">
                <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-600" /> Tuyển dụng việc làm
                </p>
                <p className="text-xs text-slate-600">
                  Nhiều tập đoàn và công ty lớn ưu tiên các ứng viên có GPA tốt cho các vị trí Fresher, Management Trainee.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-1">
                <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-rose-500" /> Theo dõi tiến độ
                </p>
                <p className="text-xs text-slate-600">
                  Giúp bạn tự đánh giá quá trình học tập của mình để kịp thời cải thiện trước khi ra trường.
                </p>
              </div>
            </div>
          </div>

          {/* Mục 4: Cách tính GPA Tích Lũy */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
                4
              </span>
              Cách tính GPA Tích Lũy (Nguyên tắc chung)
            </h3>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5">
              <p className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">
                Công thức cơ bản:
              </p>
              <p className="text-base md:text-lg font-mono font-bold text-indigo-700">
                GPA Tích Lũy = Tổng Điểm Chất Lượng (QP) / Tổng Số Tín Chỉ
              </p>
            </div>

            <div className="text-sm md:text-base text-slate-600 space-y-2 leading-relaxed">
              <p>
                <strong>Điểm Chất Lượng (Quality Points – QP)</strong> của một môn học: Được tính bằng cách nhân điểm số (quy đổi ra thang điểm 4.0) của môn đó với số tín chỉ của môn đó.
              </p>
              <ul className="list-disc ml-6 space-y-1.5 text-xs md:text-sm">
                <li>
                  Ví dụ: Môn học 3 tín chỉ, bạn đạt điểm A (tương đương 4.0 trên thang 4). Điểm chất lượng = 4.0 * 3 = <strong>12.0 QP</strong>.
                </li>
                <li>
                  Môn học 2 tín chỉ, bạn đạt điểm B (tương đương 3.0 trên thang 4). Điểm chất lượng = 3.0 * 2 = <strong>6.0 QP</strong>.
                </li>
              </ul>
              <p className="text-xs md:text-sm font-semibold text-slate-700 pt-2">
                Công cụ tính này hoạt động theo 5 bước logic:
              </p>
              <ol className="list-decimal ml-6 space-y-1 text-xs md:text-sm">
                <li><strong>Tính Tổng điểm chất lượng hiện tại:</strong> GPA hiện tại × Tổng tín chỉ đã hoàn thành</li>
                <li><strong>Tính Điểm chất lượng mới:</strong> GPA dự kiến mới × Số tín chỉ mới</li>
                <li><strong>Tính Tổng tín chỉ mới:</strong> Tổng tín chỉ đã hoàn thành + Số tín chỉ mới</li>
                <li><strong>Tính Tổng điểm chất lượng mới:</strong> Tổng điểm chất lượng hiện tại + Điểm chất lượng mới</li>
                <li><strong>Tính GPA Tích Lũy mới:</strong> Tổng điểm chất lượng mới ÷ Tổng tín chỉ mới</li>
              </ol>
            </div>
          </div>

          {/* Mục 5: Giải thích các chỉ số trong kết quả */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-sm">
                5
              </span>
              Giải thích các chỉ số trong kết quả
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-xs md:text-sm">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <strong>GPA Tích Lũy (Cumulative GPA):</strong> Điểm trung bình học tập tổng thể mới của bạn sau khi tính cả các tín chỉ và điểm số mới.
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <strong>Tóm tắt đầu vào:</strong> Nhắc lại chính xác các giá trị bạn đã nhập để bạn dễ đối chiếu.
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <strong>Tổng điểm chất lượng hiện tại (QP):</strong> Tổng số điểm chất lượng bạn đã tích lũy trước khi thêm các môn học mới.
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <strong>Điểm chất lượng mới (QP):</strong> Điểm chất lượng được tính riêng cho các môn học/học kỳ mới.
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <strong>Tổng tín chỉ mới:</strong> Tổng số tín chỉ bạn sẽ có sau khi hoàn thành các môn học mới.
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <strong>Tổng điểm chất lượng mới (QP):</strong> Tổng điểm chất lượng mới, bao gồm cả điểm cũ và điểm mới.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}