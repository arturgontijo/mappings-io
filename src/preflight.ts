import { JSONObject, MappingsT, ReplacerT } from "@/types";
import * as fs from "fs";
import FormData from "form-data";

export const preflight = (mappings: MappingsT, replacer?: ReplacerT): MappingsT => {
  let m = JSON.stringify({ ...mappings, headers: headersToLower(mappings.headers) });
  if (m) {
    replacer?.forEach((value, tag) => {
      if (value !== undefined) {
        m = m.replaceAll(tag, value);
      }
    });
    return JSON.parse(m);
  }
  return {} as MappingsT;
};

export const headersToLower = (headers?: JSONObject) => {
  if (!headers) return headers;
  const lowerCaseHeaders = { ...headers };
  for (const [key, value] of Object.entries(headers)) {
    lowerCaseHeaders[key.toLowerCase()] = value;
    delete lowerCaseHeaders[key];
  }
  return lowerCaseHeaders;
};

export const handleDataFields = async (data: JSONObject) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    const sValue = String(value);
    if (sValue.startsWith("@")) {
      const filePath = sValue.substring(1);
      formData.append(key, fs.createReadStream(filePath));
    } else formData.append(key, sValue);
  }
  return formData;
};
