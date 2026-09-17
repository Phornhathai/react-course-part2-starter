interface Active {
  type: "INCREMENT" | "DECREMENT" | "RESET";
}

const counterReducer = (state: number, active: Active) => {
  if (active.type === "INCREMENT") return state + 1;
  if (active.type === "DECREMENT") return state - 1;
  if (active.type === "RESET") return 0;
  return state;
};

export default counterReducer;
