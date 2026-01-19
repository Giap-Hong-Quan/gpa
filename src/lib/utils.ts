import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Hàm cn giúp kết hợp các class Tailwind một cách thông minh,
 * tự động loại bỏ các class bị trùng lặp hoặc xung đột.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}