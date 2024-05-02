import { MappingsT } from "@/types/generics";
import { promises as fs } from "fs";
import { glob } from "glob";

export const JSON_DATA_DIR = "/tests/data/mappings/**/*.json";

/**
 * Loads JSON file from disk
 *
 * @param filename - The file's path to load
 * @returns Parsed JSON from file
 */
export const readJSON = async (filename: string) => {
  const j = await fs.readFile(filename);
  return JSON.parse(j.toString());
};

/**
 * Get given mapping from the existing ones
 *
 * @param mId - The ID of the map
 * @returns The chosen map or an empty one with id 'not-found'
 */
export const getOneMapping = async (mId: string): Promise<MappingsT> => {
  const mappings = await getMappings();
  for (const m of mappings) {
    if (m.id == mId) return m;
  }
  return {
    id: "not-found",
    url: "",
    params: {},
    headers: {},
    mappings: {},
  };
};

/**
 * List of all available mappings
 *
 * @returns List of mappings
 */
export const getMappings = async (): Promise<MappingsT[]> => {
  const jsonFiles = await glob(process.cwd() + JSON_DATA_DIR);
  const mappings = [];
  for (const filename of jsonFiles) {
    const m = await readJSON(filename);
    mappings.push(m);
  }
  return mappings;
};
