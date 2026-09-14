import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface PostQuery {
  page: number;
  pageSize: number;
}

const usePostsPagination = (query: PostQuery) => {
  return useQuery<Post[], Error>({
      queryKey: ["posts", query],
      queryFn: () =>
        axios
          .get<Post[]>("https://jsonplaceholder.typicode.com/posts", {
            params: { _start: (query.page - 1) * query.pageSize, _limit: query.pageSize },
          })
          .then((res) => res.data),
      // staleTime      → คุมมิติ "ความสด" (fresh/stale)
      //                  นับตั้งแต่ fetch สำเร็จ, ครบเวลาแล้วแค่ tag ว่า "stale" (ยังอยู่ใน cache)
      //                  ต้องมี trigger ถึง refetch (mount ใหม่ / focus / reconnect)
      //
      // gcTime         → คุมมิติ "การมีอยู่" ของ cache (exist/gone)
      //                  นับตั้งแต่ query ไม่มีคน mount ใช้แล้ว, ครบเวลาแล้วลบออกจาก cache จริง
      //                  ไม่เกี่ยวกับ fetch เลย แค่เคลียร์ memory เฉยๆ
      //
      // refetchInterval → ไม่คุมมิติไหน แค่ "ยิง" fetch ใหม่ตามรอบเวลา
      //                  ทำงานตอน query ยัง active (มี component mount ใช้อยู่)
      //                  เกิดทุกรอบเอง ไม่ต้องมี trigger (เหมือนนาฬิกาปลุก)
      //
      // Timeline ตัวอย่าง (staleTime 1m, gcTime 5m):
      // t=0      fetch เสร็จ → เข้า cache, fresh
      // t=0-1m   fresh → mount ใหม่/focus ก็ไม่ refetch ใช้ cache เดิม
      // t=1m+    กลายเป็น stale → มี trigger ถึงจะ refetch (ข้อมูลเก่ายังโชว์อยู่ระหว่างรอ ไม่มี spinner)
      // unmount  gcTime เริ่มนับจากตรงนี้ → ครบ 5m โดยไม่มีใคร mount ใช้ query นี้ → cache ถูกลบทิ้งจริง
      //          กลับมาก่อนครบ gcTime = ยังมี cache ใช้ทันที / กลับมาหลังครบ = fetch ใหม่หมด (loading เต็ม)
      staleTime: 1 * 60 * 1000, // 1m
      // refetchInterval: 1000, // 1s
      // gcTime: 5 * 60 * 1000, // default 5m
      placeholderData: keepPreviousData,
    }
  );
};

export default usePostsPagination;
