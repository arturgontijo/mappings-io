import { getOneMapping } from "./data/load";
import { describe, expect, it } from "@jest/globals";

describe("Mappings(Load) - getOneMapping()", () => {
  it("return one mappings object from a json file", async () => {
    const mId = "stripe-payment-intents";
    const jsonMappings = await getOneMapping(mId);
    expect(jsonMappings.id).toBe(mId);
  });
});

describe("Mappings(Load) - getOneMapping()", () => {
  it("return an empty mappings object from an invalid json file id", async () => {
    const mId = "invalid-id";
    const jsonMappings = await getOneMapping(mId);
    expect(jsonMappings.mappings).toEqual({});
  });
});
