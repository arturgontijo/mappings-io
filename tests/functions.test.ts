import { transformDataWithMapping } from "@/process";
import { ApplyFunctionT, JSONValues, MappingsT } from "@/types";
import { getOneMapping } from "./data/load";
import { SHOPIFY_ORDERS_DATA } from "./data";

describe("Functions(Process) - transformDataWithMapping()", () => {
  it("return an xform object of a given data and target - using a custom applyFunction", async () => {
    const m: MappingsT = {
      id: "custom-applyfunctions-I",
      url: "",
      mappings: {
        functions: {
          "-xforms": {
            "::output1": ["Prod", [1, 2, 3]],
            "::output2": ["Test", ["{3.141592}"]],
            "::output3": ["Anything", ["Else"]],
          },
        },
      },
    };

    const myApplyFunction: ApplyFunctionT = (f: string, params: JSONValues[]) => {
      const _params = params as string[];
      if (f === "Test") return `testing: ${_params}`;
      else if (f === "Prod") return "mappings-io";
      return -1;
    };

    const data = await transformDataWithMapping({}, m.mappings, undefined, myApplyFunction);
    expect(data).toEqual({
      functions: {
        output1: "mappings-io",
        output2: "testing: 3.141592",
        output3: -1,
      },
    });
  });
});

describe("Mappings(Process) - transformDataWithMapping(functions)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = await getOneMapping("mock-functions");
    const data = await transformDataWithMapping({}, m.mappings);
    expect(data).toEqual({
      functions: {
        const: 1,
        constStr: ["One", "Two"],
        constNested: [1, "2", { 3: [4, 5] }],
        sumInt: "6.00",
        sumStr: "6.00",
        sum: "0.00",
        sub: "200.00",
        div: "5.00",
        mul: "50000.00",
        dateTzTs1: [1711977010000, 1714039627000],
        dateTzTs2: [1711977010000, 1714039627000],
        dateTsTz1: ["2024-04-01T13:10:10.000Z", "2024-04-25T10:07:07.000Z"],
        dateTsTz2: undefined,
        IntFromStr: 50,
        IntfromHex: 119,
        floatFromFloat: "50.50",
        floatFromStr: "50.123",
        index1: 3,
        indexOut: undefined,
        indexInvalid: undefined,
      },
    });
  });
});

describe("Mappings(Process) - transformDataWithMapping(shopify-function)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = await getOneMapping("mock-shopify-orders-function");
    const data = await transformDataWithMapping(SHOPIFY_ORDERS_DATA, m.mappings);
    expect(data).toEqual({
      functions: {
        total: "1197.88",
        tax: "23.88",
        dates: [1199980800000, 1202659200000],
      },
      newFunctions: [
        {
          ip1: "0.0.0.1",
          ip2: "0.0.0.1",
          ip3: "0.0.0.1",
          ip4: "0.0.0.1",
          multipleOr: "paid",
          multipleOrWithCont: "NotFound",
        },
        {
          ip1: null,
          ip2: "127.0.0.1",
          ip3: "0.0.0.2",
          ip4: "0.0.0.2",
          multipleOr: "partially_refunded",
          multipleOrWithCont: "NotFound",
        },
      ],
    });
  });
});
