import { JSONValues } from "@/types/generics";

// ::fixed = ["Const", ["MyConstant"]] -> { "fixed": "MyConstant" }
// ::fixed = ["Const", ["1", "2", { "3": 4 }]] -> { "fixed": ["1", "2", { "3": 4 }] }
export const fConst = (params: string[]): JSONValues => {
  // If it is a single element list:
  if (params.length === 1) return params[0];
  return params;
};

// ::name = ["Concant", ["Foo", " ", "Bar"]] -> { "name": "Foo Bar" }
export const fConcat = (params: string[]): JSONValues => {
  // If it is a single element list:
  if (params.length === 1) return params[0];
  return params.join("");
};

// ::data = ["SubString", ["DataNotImportant", 4]] -> { "data": "Data" }
// ::data = ["SubString", ["NotImportantData", -4]] -> { "data": "Data" }
export const fSubString = (params: string[]): JSONValues => {
  if (params.length === 2) {
    const idx = parseInt(params[1]);
    const value = params[0];
    if (idx > 0) return value.substring(0, idx);
    else return value.substring(value.length + idx);
  }
  return params[0];
};
