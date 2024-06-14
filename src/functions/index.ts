import { JSONValues } from "@/types/generics";
import { fSum, fDiv, fMul, fSub } from "./arithmetics";
import { fDateTsTz, fDateTzTs } from "./dates";
import { fConcat, fConst, fOr, fSubString } from "./misc";
import { fToFloat, fToInt } from "./numbers";

/**
 * Processors for the mappings -- runs on every :: encountered on the mapping
 *
 * @param func - The function name
 * @param _params - function parameters
 * @returns - Json with the result key:value pair with processed result
 */
export const applyFunction = (
  func: string,
  _params: JSONValues[],
): JSONValues => {
  // TODO: works but Hacky!
  const params = _params as string[];
  switch (func) {
    case "Sum":
      return fSum(params);
    case "Sub":
      return fSub(params);
    case "Div":
      return fDiv(params);
    case "Mul":
      return fMul(params);
    case "DateTsTz":
      return fDateTsTz(params);
    case "DateTzTs":
      return fDateTzTs(params);
    case "Const":
      return fConst(params);
    case "Concat":
      return fConcat(params);
    case "SubString":
      return fSubString(params);
    case "Or":
      return fOr(params);
    case "ToInt":
      return fToInt(params);
    case "ToFloat":
      return fToFloat(params);
    default:
  }
  return "";
};
