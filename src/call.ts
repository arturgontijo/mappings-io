import { JSONObject, MappingsT } from "@/types/generics";
import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import { getPaginatedData } from "./pagination";

export const call = async (m: MappingsT) => {
  const config: AxiosRequestConfig = {
    method: m.method || "GET",
    url: m.url,
    params: m.params,
    headers: m.headers as AxiosHeaders,
    data: m.data,
  };

  let data: JSONObject = {};
  try {
    const r = await axios(config);
    if (r.status === 200) {
      data = r.data;
      if (m.pagination) {
        data = await getPaginatedData(config, m.pagination, data);
      }
    }
  } catch (e) {
    console.log(`[ERROR][${config.method}] api::call(url=${m.url}) -> ${e}`);
  }

  return data;
};
