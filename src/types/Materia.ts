export interface Material {
  id: string;
  title: string;
  description: string;
  category: string;
  code: string;
  downloadUrl: string;
  shopeeLink: string;
  secretCode: string; // Thêm trường này để so sánh
}