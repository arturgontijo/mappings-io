import { ApplyFunctionT, JSONObject, MappingsByIdT, MappingsT, ReplacerT } from "@/types";
import { call } from "@/api/call";
import { preflight, handleDataFields } from "@/preflight";
import { transformDataWithMapping } from "@/process";
import { applyFunctionDefault } from "@/functions";

export const run = async (
  mappings: MappingsT,
  replacer: ReplacerT | undefined = undefined,
  mappingsById?: MappingsByIdT,
  applyFunction: ApplyFunctionT = applyFunctionDefault,
) => {
  let m = mappings;
  if (replacer) m = preflight(mappings, replacer);
  if (m.url) {
    if (m.data) m.data = await handleDataFields(m.data as JSONObject);
    const data = await call(m);
    const mappedData = await transformDataWithMapping(data, m.mappings, mappingsById, applyFunction);
    if (m.version) mappedData.version = m.version;
    return mappedData;
  }
  return {};
};
