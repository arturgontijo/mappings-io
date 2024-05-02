import { MappingsT } from "@/types/generics";
import { call } from "./call";
import { preflight } from "./preflight";
import { transformDataWithMapping } from "./process";

export const run = async (
  mappings: MappingsT,
  replacer: Map<string, string>,
) => {
  const m: MappingsT = await preflight(mappings, replacer);
  if (m.url) {
    const data = await call(m);
    return transformDataWithMapping(data, m.mappings);
  }
  return {};
};
