import { Link, useLocation } from "react-router-dom"; // Đổi từ wouter sang react-router-dom
import {  BookOpen, Calculator } from "lucide-react";
import { cn } from "../lib/utils";


export function Navigation() {
  // react-router-dom dùng hook useLocation trả về một object, lấy property pathname
  const { pathname } = useLocation(); 

  const navItems = [
    { href: "/", label: "Tính GPA", icon: Calculator },
    { href: "/study-material", label: "Tài Liệu", icon: BookOpen }, // Khớp với path trong router.tsx của bạn
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-1">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/logo.png" alt="logo" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-slate-800 hidden sm:block">
            UniHelper
          </span>
        </div>

        {/* Menu Items */}
        <div className="flex items-center p-1.5 bg-white/80 backdrop-blur-lg border border-white/50 rounded-full shadow-lg shadow-indigo-100/50">
          {navItems.map((item) => {
            const isActive = pathname === item.href; // Kiểm tra active dựa trên pathname
            return (
              <Link
                key={item.href}
                to={item.href} // react-router-dom dùng 'to' thay vì 'href'
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300",
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-slate-500 hover:text-primary hover:bg-indigo-50"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="w-10 sm:w-auto" /> {/* Spacer for balance */}
      </div>
    </nav>
  );
}