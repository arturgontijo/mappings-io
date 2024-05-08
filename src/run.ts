import { MappingsT } from "@/types/generics";
import { call } from "@/api/call";
import { preflight } from "@/preflight";
import { transformDataWithMapping } from "@/process";

export const run = async (
  mappings: MappingsT,
  replacer: Map<string, string> | undefined = undefined,
) => {
  let m = mappings;
  if (replacer) {
    m = await preflight(mappings, replacer);
  }
  if (m.url) {
    const data = await call(m);
    return transformDataWithMapping(data, m.mappings);
  }
  return {};
};
