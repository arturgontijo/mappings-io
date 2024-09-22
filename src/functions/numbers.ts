import { JSONValues } from "@/types";

// ToInt(value, base) [We need to add { } when using "."]
// ::integer = ['ToInt', [1.234, 10]] -> { "integer": 1 }
// ::integer = ['ToInt', ["{1.234}", 10]] -> { "integer": 1 }
// ::integer = ['ToInt', ["0x20", 16] -> { "integer": 32}
// ::integer = ['ToInt', ["32", 16] -> { "integer": 50 }
export const fToInt = (params: string[]): JSONValues => {
  let base = 10;
  if (params.length === 2) base = parseInt(params[1]);
  if (params.length > 2) return;
  return parseInt(params[0], base);
};

// ToFloat(value, fixed) [We need to add { } when using "."]
// ::float = ['ToFloat', [1.234, 2]] -> { "float": "1.23" }
// ::float = ['ToFloat', ["{1.234}", 2]] -> { "float": "1.23" }
// ::float = ['ToFloat', [123.4, 2] -> { "float": "123.40" }
// ::float = ['ToFloat', [123.45, 1] -> { "float": "123.4" }
export const fToFloat = (params: string[]): JSONValues => {
  let fixedPoints = 2;
  if (params.length === 2) fixedPoints = parseInt(params[1]);
  if (params.length > 2) return;
  return parseFloat(params[0]).toFixed(fixedPoints);
};
