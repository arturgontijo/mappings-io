import { MappingsT } from "@/types/generics";

export const preflight = (
  mappings: MappingsT,
  replacer: Map<string, string>,
): MappingsT => {
  let m = JSON.stringify(mappings);
  if (m) {
    replacer.forEach((value, tag) => {
      if (value !== undefined) {
        m = m.replaceAll(tag, value);
      }
    });
    return JSON.parse(m);
  }
  return {} as MappingsT;
};
