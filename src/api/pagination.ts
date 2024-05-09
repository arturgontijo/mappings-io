import { getValue } from "@/process";
import { JSONObject, JSONValues } from "@/types/generics";
import axios, { AxiosRequestConfig } from "axios";

export const getPaginatedData = async (
  config: AxiosRequestConfig,
  pagination: JSONObject,
  initData: JSONObject,
) => {
  const key = pagination["key"] as string;
  const sizeKey = pagination["size"] as string;
  const cursor = pagination["cursor"] as string;
  const target = pagination["target"] as string;

  // Get nextPage id|number (and bump it if necessary)
  let nextPage = getValue(initData, key) as string;
  if (nextPage && ["", "0", "1"].includes(nextPage.toString())) {
    nextPage = (parseInt(nextPage) + 1).toString();
  }
  let lastPage = nextPage;

  let allData = initData[target] as JSONValues[];

  // Get pagination size when available
  let size = 0;
  if (sizeKey) {
    size = parseInt((getValue(initData, sizeKey) as string) || "0");
    if (allData.length >= size) return { [target]: allData };
  }

  while (nextPage) {
    await new Promise((r) => setTimeout(r, 250));
    config.params[cursor] = nextPage;
    const rNext = await axios(config);
    if (rNext.status === 200) {
      const data = rNext.data as JSONObject;
      const targetData = data[target];
      // Check if there is more data
      if (Array.isArray(targetData)) {
        if (targetData.length > 0) allData = allData.concat(targetData);
        else break;
      } else if (Object.keys(targetData as JSONObject).length > 0)
        allData.push(targetData);
      else break;
      nextPage = getValue(data, key) as string;
      if (nextPage && nextPage.toString() === lastPage.toString()) {
        nextPage = (parseInt(nextPage) + 1).toString();
      }
      lastPage = nextPage;
    } else {
      break;
    }
    if (size && allData.length >= size) break;
  }
  const final: JSONObject = { [target]: allData };
  return final;
};
