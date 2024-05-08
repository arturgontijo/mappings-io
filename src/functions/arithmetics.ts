import { JSONValues } from "@/types/generics";

// ::total = ['Sum', [1, 2, 3]] -> { "total": 6 }
export const fSum = (params: string[]): JSONValues => {
  let result = 0;
  for (const item of params) {
    result += parseFloat(item);
  }
  return result.toFixed(2);
};

// ::result = ['Div', [29700, 100]] -> { "result": "297.00" }
export const fDiv = (params: string[]): JSONValues => {
  let result = parseFloat(params[0]!);
  for (const item of params.slice(1)) {
    result /= parseFloat(item);
  }
  return result.toFixed(2);
};
