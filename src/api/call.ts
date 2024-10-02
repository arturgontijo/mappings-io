import { MappingsT } from "@/types";
import axios, { AxiosHeaders, AxiosRequestConfig, ResponseType } from "axios";
import { getPaginatedData } from "./pagination";

export const call = async <R>(m: MappingsT) => {
  const config: AxiosRequestConfig = {
    method: m.method || "GET",
    responseType: (m.responseType || "json") as ResponseType,
    url: m.url,
    params: m.params,
    headers: m.headers as AxiosHeaders,
    data: m.data,
  };
  let data;
  const r = await axios(config);
  data = r.data;
  if (data && m.pagination) {
    data = await getPaginatedData(config, m.pagination, data);
  }
  return data as R;
};
