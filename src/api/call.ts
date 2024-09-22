import { JSONObject, MappingsT } from "@/types";
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
  const r = await axios(config);
  data = r.data;
  if (data && m.pagination) {
    data = await getPaginatedData(config, m.pagination, data);
  }
  return data;
};
