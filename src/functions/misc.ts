import { JSONValues } from "@/types";

// ::fixed = ["Const", ["MyConstant"]] -> { "fixed": "MyConstant" }
// ::fixed = ["Const", ["1", "2", { "3": 4 }]] -> { "fixed": ["1", "2", { "3": 4 }] }
export const fConst = (params: string[]): JSONValues => {
  // If it is a single element list:
  if (params.length === 1) return params[0];
  return params;
};

// ::name = ["Concat", ["Foo", " ", "Bar"]] -> { "name": "Foo Bar" }
export const fConcat = (params: string[]): JSONValues => {
  // If it is a single element list:
  if (params.length === 1) return params[0];
  return params.join("");
};

// ::index1 = ["Index", [["Zero", "One", "Two"], 1]] -> { "index1": "One" }
export const fIndex = (params: string[]): JSONValues => {
  if (params.length !== 2) return undefined;
  const list = params[0];
  const idx = parseInt(params[1]);
  if (!Array.isArray(list)) return undefined;
  if (list.length <= idx) return undefined;
  return list[idx];
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

// { "exists": "value" }
// ::data = ["Or", ["nonExisting1", "nonExisting2", "exists"]] -> { "data": "value" }
export const fOr = (params: string[]): JSONValues => {
  let value: JSONValues = undefined;
  for (const item of params) {
    if (item == undefined) continue;
    value = item;
    break;
  }
  return value;
};
