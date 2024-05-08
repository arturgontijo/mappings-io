import { JSONValues } from "@/types/generics";
import { fSum, fDiv } from "./arithmetics";
import { fDateTsTz, fDateTzTs } from "./dates";

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
    case "Div":
      return fDiv(params);
    case "DateTsTz":
      return fDateTsTz(params);
    case "DateTzTs":
      return fDateTzTs(params);
    default:
  }
  return "";
};