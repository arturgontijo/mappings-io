export type JSONObject = { [index: string]: JSONValues };
export type JSONValues = string | number | boolean | null | undefined | JSONValues[] | JSONObject;

export type MappingsT = {
  id: string;
  url: string;
  method?: string;
  params?: JSONObject;
  headers?: JSONObject;
  data?: JSONObject;
  pagination?: JSONObject;
  mappings?: JSONObject;
  version?: number;
};

export type ReplacerT = Map<string, string>;

export type MappingsByIdT = Map<string, { mappings: MappingsT; replacer: ReplacerT | undefined }>;

export type ApplyFunctionT = (func: string, params: JSONValues[]) => JSONValues;
