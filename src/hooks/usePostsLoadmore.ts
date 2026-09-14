import { InfiniteData, keepPreviousData, QueryKey, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface PostQuery {
  pageSize: number;
}

const usePostsLoadmore = (query: PostQuery) => {
  return useInfiniteQuery<Post[], Error, InfiniteData<Post[]>, QueryKey, number>({
    // /user/1/posts
    // queryKey: query ? ["users", userId, "posts"] : ["posts"],
    queryKey: ["posts", query],
    queryFn: ({ pageParam = 1 }) =>
      axios
        .get<Post[]>("https://jsonplaceholder.typicode.com/posts", {
          params: { _start: (pageParam - 1) * query.pageSize, _limit: query.pageSize },
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
    // refetchInterval: 1000, // 1s
    // gcTime: 5 * 60 * 1000, // default 5m
    staleTime: 1 * 60 * 1000, // 1m
    placeholderData: keepPreviousData,
    initialPageParam: 1,
    // lastPage = ข้อมูลของหน้าล่าสุดที่เพิ่ง fetch มา (เป็น array ของ Post[])
    // allPages = array รวมของทุกหน้าที่ fetch มาแล้วทั้งหมด (array ของ array)
    getNextPageParam: (lastPage, allPages) => {
      // 1 -> 2
      // lastPage.length > 0 = เช็คว่าหน้าล่าสุดที่ได้มามีข้อมูลจริงไหม (ถ้า API คืน array ว่าง แปลว่าหมดข้อมูลแล้ว ไม่มีหน้าต่อไป)
      // ถ้ามีข้อมูล (length > 0) → return allPages.length + 1 เช่น ตอนนี้ fetch มาแล้ว 1 หน้า (allPages.length === 1) ก็ return 2 เพื่อบอกว่า "หน้าถัดไปคือหน้า 2"
      // ถ้าไม่มีข้อมูล (lastPage.length === 0) → return undefined ซึ่งเป็นสัญญาณบอก React Query ว่า ไม่มีหน้าถัดไปแล้ว (hasNextPage จะกลายเป็น false)
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });
};

export default usePostsLoadmore;
