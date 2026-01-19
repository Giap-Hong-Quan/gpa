import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { ref, onValue } from "firebase/database";
import type { Material } from "../types/Materia";

// Hook lấy danh sách Category
export function useCategories() {
  const [categories, setCategories] = useState<string[]>(["Tất cả"]);
  useEffect(() => {
    const catRef = ref(db, 'categories');
    return onValue(catRef, (snapshot) => {
      const val = snapshot.val();
      if (val) setCategories(val);
    });
  }, []);
  return categories;
}

// Hook lấy Materials (Giữ nguyên logic của bạn)
export function useMaterials(search: string, category: string) {
  const [data, setData] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const materialsRef = ref(db, 'materials');
    return onValue(materialsRef, (snapshot) => {
      const val = snapshot.val();
      const list = val ? Object.keys(val).map(key => ({ id: key, ...val[key] })) : [];

      const filtered = list.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                             item.code.toLowerCase().includes(search.toLowerCase());
        const matchesCat = category === "Tất cả" || item.category === category;
        return matchesSearch && matchesCat;
      });

      setData(filtered);
      setIsLoading(false);
    });
  }, [search, category]);

  return { data, isLoading };
}