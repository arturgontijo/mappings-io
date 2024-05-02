import { JSONValues } from "@/types/generics";

/**
 * Processors for the mappings -- runs on every :: encountered on the mapping
 *
 * @param f - The function execution
 * @param value - (Se ele vai ser substituido, pq ele existe?)
 * @returns - Json with the result key:value pair with processed result
 */
export const applyFunction = (func: string, _params: JSONValues[]) => {
  let value: JSONValues = "";
  // TODO: works but Hacky!
  const params = _params as string[];

  // ::total = ['Sum', [1, 2, 3]] -> { "total": 6 }
  if (func === "Sum") {
    let result = 0;
    for (const item of params) {
      result += parseFloat(item);
    }
    value = result.toFixed(2);
  }

  // ::result = ['Div', [29700, 100]] -> { "result": "297.00" }
  if (func === "Div") {
    let result = parseFloat(params[0]);
    for (const item of params.slice(1)) {
      result /= parseFloat(item);
    }
    value = result.toFixed(2);
  }

  // ::date = ["DateTsTz", [1710909483]] -> { "date": "2024-03-20T04:38:03.000Z" }
  if (func === "DateTsTz") {
    value = [];
    for (const item of params) {
      let timestamp = parseInt(item);
      if (timestamp.toString().length <= 10) {
        timestamp = parseInt(timestamp.toString()) * 1000;
      }
      value.push(new Date(parseInt(timestamp.toString())).toISOString());
    }
    // If it is a single element list:
    if (value.length === 1) value = value[0];
  }

  // ::date = ["DateTzTs", [2024-03-20T04:38:03.000Z]] -> { "date": "1710909483" }
  if (func === "DateTzTs") {
    value = [];
    for (const item of params) {
      value.push(new Date(item).getTime());
    }
    // If it is a single element list:
    if (value.length === 1) value = value[0];
  }

  return value;
};
