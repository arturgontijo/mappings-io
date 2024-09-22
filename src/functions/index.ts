import { JSONValues } from "@/types";
import { fSum, fDiv, fMul, fSub } from "./arithmetics";
import { fDateTsTz, fDateTzTs } from "./dates";
import { fConcat, fConst, fIndex, fOr, fSubString } from "./misc";
import { fToFloat, fToInt } from "./numbers";

type FunctionT = (params: string[]) => JSONValues;

const FunctionsMap = new Map<string, FunctionT>([
  ["Sum", fSum],
  ["Sub", fSub],
  ["Div", fDiv],
  ["Mul", fMul],
  ["DateTsTz", fDateTsTz],
  ["DateTzTs", fDateTzTs],
  ["Const", fConst],
  ["Concat", fConcat],
  ["Index", fIndex],
  ["SubString", fSubString],
  ["Or", fOr],
  ["ToInt", fToInt],
  ["ToFloat", fToFloat],
]);

/**
 * Processors for the mappings -- runs on every :: encountered on the mapping
 *
 * @param func - The function name
 * @param _params - function parameters
 * @returns - Json with the result key:value pair with processed result
 */
export const applyFunctionDefault = (func: string, params: JSONValues[]): JSONValues => {
  const f = FunctionsMap.get(func);
  return f ? f(params as string[]) : "";
};
