import { useRef } from "react";
import useAddTodo from "../hooks/useAddTodo";

const TodoForm = () => {
  const ref = useRef<HTMLInputElement>(null);

  const addTodo = useAddTodo(() => {
    if (ref.current) ref.current.value = "";
  });

  return (
    <>
      {addTodo.error && <div className="alert alert-danger">{addTodo.error.message}</div>}
      <form
        className="row mb-3"
        onSubmit={(event) => {
          event.preventDefault();
          // ใช้เทคนิค optimistic update คือเอา newTodo ที่เราสร้าง ยสฟแำ้นสกำพ ไว้ใน mutate ไปแปะเข้าใน cache ทันที
          // ui แสดงผลทันทีเหมือนเพิ่มสำเร็จแล้ว แล้วรอรับค่าจาก server มาทับอีกที
          addTodo.mutate({
            id: 0, // placeholder เพราะยังไม่มี id จริงจาก server
            title: ref.current?.value ?? "", // ค่าที่ผู้ใช้พิมพ์จริง
            completed: false, // todo ใหม่ยังไม่เสร็จ
            userId: 1, // hardcode ไว้ก่อน ในงานจริงจะเอา logged-in user มาใช้
          });
        }}
      >
        <div className="col">
          <input ref={ref} type="text" className="form-control" />
        </div>
        <div className="col">
          <button type="submit" className="btn btn-primary">
            Add
          </button>
        </div>
      </form>
    </>
  );
};

export default TodoForm;
