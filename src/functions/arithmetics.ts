import { JSONValues } from "@/types";

// ::total = ['Sum', [1, 2, 3]] -> { "total": 6 }
export const fSum = (params: string[]): JSONValues => {
  let result = parseFloat(params[0]!);
  for (const item of params.slice(1)) {
    result += parseFloat(item);
  }
  return result.toFixed(2);
};

// ::total = ['Sub', [1, 2, 3]] -> { "total": -4 }
export const fSub = (params: string[]): JSONValues => {
  let result = parseFloat(params[0]!);
  for (const item of params.slice(1)) {
    result -= parseFloat(item);
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

// ::total = ['Mull', [3, 4, 5]] -> { "total": 60 }
export const fMul = (params: string[]): JSONValues => {
  let result = parseFloat(params[0]!);
  for (const item of params.slice(1)) {
    result *= parseFloat(item);
  }
  return result.toFixed(2);
};
