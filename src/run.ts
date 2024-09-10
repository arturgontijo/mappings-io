import { ApplyFunctionT, MappingsT } from "@/types/generics";
import { call } from "@/api/call";
import { preflight } from "@/preflight";
import { transformDataWithMapping } from "@/process";
import { applyFunctionDefault } from "@/functions";

export const run = async (
  mappings: MappingsT,
  replacer: Map<string, string> | undefined = undefined,
  applyFunction: ApplyFunctionT = applyFunctionDefault,
) => {
  let m = mappings;
  if (replacer) {
    m = preflight(mappings, replacer);
  }
  if (m.url) {
    const data = await call(m);
    return transformDataWithMapping(data, m.mappings, applyFunction);
  }
  return {};
};
