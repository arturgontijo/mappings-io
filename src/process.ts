import { JSONValues, JSONObject } from "@/types/generics";
import { applyFunction } from "./functions";

export const getValue = (data: JSONValues, _target: string): JSONValues => {
  if (data === undefined) return;
  const targets = _target.split(".");
  let remainingFields = _target;
  let currData = data as JSONObject;
  for (const target of targets) {
    remainingFields = remainingFields.replace(target, "").substring(1);
    if (target === "") continue;
    if (Array.isArray(currData[target])) {
      const innerData = [];
      for (const subValue of currData[target] as JSONObject[]) {
        innerData.push(getValue(subValue, remainingFields));
      }
      return innerData;
    }
    currData = currData[target] as JSONObject;
  }
  return currData;
};

export const transformWithFunction = (data: JSONObject, specs: JSONObject) => {
  const func = specs[0] as string;
  const params = specs[1] as string[];
  let funcParams: JSONValues = [];
  for (const p of params) {
    // Check if p is a key from data or just a constant
    if (typeof p === "string" && data[p.split(".")[0]]) {
      const values = getValue(data, p);
      if (Array.isArray(values)) {
        funcParams = funcParams.concat(...values);
      } else {
        funcParams.push(values);
      }
    } else {
      funcParams.push(p);
    }
  }
  return applyFunction(func, funcParams);
};

export const transformDataWithMapping = (
  data: JSONObject,
  mappings: JSONObject,
) => {
  const final: JSONObject = {};

  // Nothing to do here...
  if (!mappings) return data;

  for (let key of Object.keys(mappings)) {
    let target = "";
    let xforms: JSONObject = {};
    let finalValue: JSONValues = {};
    const value = mappings[key] as JSONObject;
    if (typeof value === "object") {
      target = (value["-target"] as string) || "";
      xforms = (value["-xforms"] as JSONObject) || {};
    }
    const targetData = (target ? getValue(data, target) : data) as JSONObject;
    if (targetData === undefined) {
      final[key] = undefined;
      continue;
    }
    if (key.startsWith("::")) {
      finalValue = transformWithFunction(targetData, value);
      key = key.replace("::", "");
    } else if (Array.isArray(targetData)) {
      const innerData = [];
      for (const item of targetData) {
        if (Object.keys(xforms).length) {
          innerData.push(transformDataWithMapping(item, xforms));
        }
      }
      finalValue = innerData;
    } else if (Object.keys(xforms).length) {
      finalValue = transformDataWithMapping(targetData, xforms);
    } else {
      const subtarget = mappings[key];
      if (Array.isArray(subtarget)) {
        finalValue = [getValue(targetData, subtarget[0] as string)];
      } else {
        finalValue = getValue(targetData, subtarget as string);
      }
    }
    final[key] = finalValue;
  }
  return final;
};
