import { JSONValues, JSONObject, ApplyFunctionT, MappingsByIdT, ReplacerT } from "@/types";
import { applyFunctionDefault } from "@/functions";
import { run } from "./run";

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

export const transformWithFunction = (data: JSONObject, specs: JSONObject, applyFunction: ApplyFunctionT) => {
  const func = specs[0] as string;
  const params = specs[1] as string[];
  let funcParams: JSONValues = [];
  for (const p of params) {
    // Check if p is a key from data or just a constant
    if (typeof p === "string") {
      // {VALUE} -> constant
      if (func === "Const" || (p.startsWith("{") && p.endsWith("}"))) {
        const c = p.replace("{", "").replace("}", "");
        funcParams.push(c);
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
      } else {
        funcParams.push(data[p]);
        continue;
      }
    }
    funcParams.push(p);
  }
  return applyFunction(func, funcParams);
};

export const transformDataWithMapping = async (
  data: JSONObject,
  mappings: JSONObject | undefined,
  mappingsById?: MappingsByIdT,
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
    if (key.startsWith("++") && mappingsById) {
      let mId = String(value.mId || value);
      let isSpread = false;
      target = String(value.target || "");
      if (mId.startsWith("...")) {
        mId = mId.replace("...", "");
        isSpread = true;
      }
      const m = mappingsById.get(mId);
      const mergedReplacer: ReplacerT = m?.replacer || new Map();
      if (m) {
        if (value.replacer) {
          for (const [rk, rv] of Object.entries(value.replacer)) {
            // It is not a constant so we need to fetch its value before use it.
            let rValue = rv.replace("{", "").replace("}", "");
            if (!(rv.startsWith("{") && rv.endsWith("}"))) {
              rValue = getValue(targetData, rValue);
            }
            mergedReplacer.set(`<${rk}>`, rValue);
          }
        }
        finalValue = await run(m.mappings, mergedReplacer, mappingsById, applyFunction);
        if (target) finalValue = finalValue[target] as JSONObject;
      }
      key = key.replace("++", "");
      if (!key || isSpread) {
        final = { ...final, ...finalValue };
        continue;
      }
    } else if (key.startsWith("::")) {
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
          innerData.push(await transformDataWithMapping(item, xforms, mappingsById, applyFunction));
        }
      }
      finalValue = innerData;
    } else if (Object.keys(xforms).length) {
      finalValue = await transformDataWithMapping(targetData, xforms, mappingsById, applyFunction);
    } else {
      const subtarget = mappings[key];
      if (Array.isArray(subtarget)) {
        const innerData = [];
        for (const st of subtarget) {
          if (typeof st === "object")
            innerData.push(await transformDataWithMapping(targetData, st as JSONObject, mappingsById, applyFunction));
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
