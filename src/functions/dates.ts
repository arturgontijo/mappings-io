import { JSONValues } from "@/types";

// ::date = ["DateTsTz", [1710909483]] -> { "date": "2024-03-20T04:38:03.000Z" }
export const fDateTsTz = (params: string[]): JSONValues => {
  let value: JSONValues = [];
  for (const item of params) {
    try {
      let timestamp = parseInt(item);
      if (timestamp.toString().length <= 10) {
        timestamp = parseInt(timestamp.toString()) * 1000;
      }
      value.push(new Date(parseInt(timestamp.toString())).toISOString());
    } catch {
      value.push(item || undefined);
    }
  }
  // If it is a single element list:
  if (value.length === 1) value = value[0];
  return value;
};

// ::date = ["DateTzTs", [{2024-03-20T04:38:03.000Z}]] -> { "date": "1710909483" }
export const fDateTzTs = (params: string[]): JSONValues => {
  let value: JSONValues = [];
  for (const item of params) {
    try {
      value.push(new Date(item).getTime());
    } catch {
      value.push(item || undefined);
    }
  }
  // If it is a single element list:
  if (value.length === 1) value = value[0];
  return value;
};
