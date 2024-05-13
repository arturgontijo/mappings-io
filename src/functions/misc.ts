import { JSONValues } from "@/types/generics";

// ::fixed = ["Const", ["MyConstant"]] -> { "fixed": "MyConstant" }
// ::fixed = ["Const", ["1", "2", { "3": 4 }]] -> { "fixed": ["1", "2", { "3": 4 }] }
export const fConst = (params: string[]): JSONValues => {
  let value: JSONValues = [];
  for (const item of params) {
    value.push(item);
  }
  // If it is a single element list:
  if (value.length === 1) value = value[0];
  return value;
};
