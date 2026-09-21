import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3.5 bg-white/80 backdrop-blur-md border-b border-slate-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100/60 p-1.5 group-hover:scale-105 transition-transform">
            <img src="/logo.png" alt="logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-xl tracking-tight text-slate-800">
              UniHelper
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100/80">
              GPA Calculator
            </span>
          </div>
        </Link>
      </div>
    </nav>
  );
}