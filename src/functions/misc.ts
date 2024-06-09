import { JSONValues } from "@/types/generics";

// ::fixed = ["Const", ["MyConstant"]] -> { "fixed": "MyConstant" }
// ::fixed = ["Const", ["1", "2", { "3": 4 }]] -> { "fixed": ["1", "2", { "3": 4 }] }
export const fConst = (params: string[]): JSONValues => {
  // If it is a single element list:
  if (params.length === 1) return params[0];
  return params;
};

export const fConcat = (params: string[]): JSONValues => {
  // If it is a single element list:
  if (params.length === 1) return params[0];
  return params.join(" ");
};
