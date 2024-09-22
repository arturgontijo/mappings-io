import { JSONValues } from "@/types";

// Note:  This function looks for a mappings Id (myMappingsId) in the MappingsById Map.
//        So you need to create it and send it via run()

// ::data = ["Api", ["myMappingsId"]] -> { "data": { <RETURNED DATA FROM MAPPINGS> } }
export const fApi = (params: string[]): JSONValues => {
  // If it is a single element list:
  if (params.length === 1) return params[0];
  return params;
};
