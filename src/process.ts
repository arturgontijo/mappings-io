import { JSONValues, JSONObject, ApplyFunctionT } from "@/types/generics";
import { applyFunctionDefault } from "@/functions";

export const setValue = (obj: JSONObject, path: string, value: JSONValues) => {
  let schema = obj;
  const pList = path.split(".");
  const len = pList.length;
  for (let i = 0; i < len - 1; i++) {
    const elem = pList[i];
    if (!schema[elem]) schema[elem] = {};
    schema = schema[elem] as JSONObject;
  }
  schema[pList[len - 1]] = value;
};

export const getValue = (data: JSONValues, _target: string): JSONValues => {
  if (data == undefined) return;
  if (_target == undefined) return;
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
    if (currData == undefined) break;
  }
  return currData;
};

export const transformWithFunction = (
  data: JSONObject,
  specs: JSONObject,
  applyFunction: ApplyFunctionT,
) => {
  const func = specs[0] as string;
  const params = specs[1] as string[];
  let funcParams: JSONValues = [];
  for (const p of params) {
    // Check if p is a key from data or just a constant
    if (typeof p === "string") {
      // {VALUE} -> constant
      if (p.includes("{")) {
        const c = p.replace("{", "").replace("}", "");
        funcParams.push(c);
        continue;
      }
      if (Object.keys(data).includes(p)) {
        funcParams.push(data[p]);
        continue;
      }
      if (data[p.split(".")[0]!] || p.split(".").length > 1) {
        const values = getValue(data, p);
        if (Array.isArray(values)) {
          funcParams = funcParams.concat(...values);
        } else {
          funcParams.push(values);
        }
        continue;
      }
    }
    funcParams.push(p);
  }
  return applyFunction(func, funcParams);
};

export const transformDataWithMapping = (
  data: JSONObject,
  mappings: JSONObject | undefined,
  applyFunction: ApplyFunctionT = applyFunctionDefault,
) => {
  let final: JSONObject = {};

  // Nothing to do here...
  if (!mappings || Object.keys(mappings).length === 0) return data;

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
    if (targetData == undefined) {
      final[key] = targetData;
      continue;
    }
    if (key.startsWith("::")) {
      finalValue = transformWithFunction(targetData, value, applyFunction);
      key = key.replace("::", "");
    } else if (key.startsWith("...")) {
      target = key.replace("...", "");
      finalValue = getValue(targetData, target) as JSONObject;
      final = { ...final, ...finalValue };
      continue;
    } else if (Array.isArray(targetData)) {
      const innerData = [];
      for (const item of targetData) {
        if (Object.keys(xforms).length) {
          innerData.push(transformDataWithMapping(item, xforms, applyFunction));
        }
      }
      finalValue = innerData;
    } else if (Object.keys(xforms).length) {
      finalValue = transformDataWithMapping(targetData, xforms, applyFunction);
    } else {
      const subtarget = mappings[key];
      if (Array.isArray(subtarget)) {
        const innerData = [];
        for (const st of subtarget) {
          if (typeof st === "object")
            innerData.push(
              transformDataWithMapping(
                targetData,
                st as JSONObject,
                applyFunction,
              ),
            );
          else innerData.push(getValue(targetData, st as string));
        }
        finalValue = innerData;
      } else {
        finalValue = getValue(targetData, subtarget as string);
      }
    }
    final[key] = finalValue;
  }
  return final;
};
