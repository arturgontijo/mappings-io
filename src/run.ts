import { ApplyFunctionT, JSONObject, MappingsByIdT, MappingsT, ReplacerT } from "@/types";
import { call } from "@/api/call";
import { preflight, handleDataFields } from "@/preflight";
import { transformDataWithMapping } from "@/process";
import { applyFunctionDefault } from "@/functions";

export const run = async <R = JSONObject>(
  mappings: MappingsT,
  replacer?: ReplacerT,
  mappingsById?: MappingsByIdT,
  applyFunction: ApplyFunctionT = applyFunctionDefault,
) => {
  const m = preflight(mappings, replacer);
  if (m.url) {
    if (m.data) {
      m.data = await handleDataFields(m.data as JSONObject);
      // We need to modify the headers
      if (JSON.stringify(m.headers || {}).includes("multipart/form-data")) {
        m.headers = { ...m.headers, ...m.data.getHeaders() };
      }
    }
    const data = await call<R>(m);
    const mappedData = await transformDataWithMapping(data as JSONObject, m.mappings, mappingsById, applyFunction);
    if (m.version) mappedData.version = m.version;
    return mappedData as R;
  }
  return {} as R;
};
