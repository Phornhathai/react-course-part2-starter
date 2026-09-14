import { keepPreviousData, QueryKey, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const usePost = (userId: number | undefined) => {
  return useQuery<Post[], Error, QueryKey>({
    // queryKey ยิง userId -> ถ้า userId เปลี่ยน จะกลายเป็น query คนละตัว,
    // จะ fetch ใหม่เฉพาะตอนที่ query นั้นยังไม่มี cahce หรือ cache เก่าเกิน staleTime แล้ว
    queryKey: userId ? ["users", userId, "posts"] : ["posts"],
    queryFn: () =>
      axios
        .get<Post[]>("https://jsonplaceholder.typicode.com/posts", {
          params: {
            userId,
          },
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
    // refetchInterval: 1000, // 1s ยิง refetch หมดไม่สน trigger หรืออะไรทั้งนั้น
    // gcTime: 5 * 60 * 1000, // default 5m เพื่อ clear cache ที่ไม่ได้ active แล้วลบใน memory เลย
    // keepPreviousData = คุมว่า key เปลี่ยน query จะกลายเป็นคนละตัว จะโชว์อะไรระหว่างรอข้อมูลใหม่ - ป้องกัน UI กระพริบ/loading spinner
    // ตอนเปลี่ยนหน้า pagination หรือเปลี่ยน filter
    placeholderData: keepPreviousData,
  });
};

export default usePost;
