import { MappingsT } from "@/types/generics";

export const preflight = async (
  mappings: MappingsT,
  replacer: Map<string, string>,
): Promise<MappingsT> => {
  let m = JSON.stringify(mappings);
  if (m) {
    for (const [tag, value] of replacer) {
      if (value !== undefined) {
        m = m.replace(tag, value);
      }
    }
    return JSON.parse(m);
  }
  return {} as MappingsT;
};
