import { getValue, setValue, transformDataWithMapping } from "@/process";
import { JSONValues, MappingsT } from "@/types/generics";
import { getOneMapping } from "./data/load";
import {
  META_ADS_CAMPAIGNS_DATA,
  SHOPIFY_ORDERS_DATA,
  STRIPE_PAYMENT_INTENTS_DATA,
} from "./data";

describe("Mappings(Process) - transformDataWithMapping(shopify-orders)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = await getOneMapping("mock-shopify-orders");
    const data = transformDataWithMapping(SHOPIFY_ORDERS_DATA, m.mappings);
    expect(data).toEqual({
      sales: [
        {
          email: "alice.norman@mail.example.com",
          price: "598.94",
          products: [
            "IPod Nano - 8gb - green",
            "IPod Nano - 8gb - red",
            "IPod Nano - 8gb - black",
          ],
          status: "paid",
        },
        {
          email: "bob.norman@mail.example.com",
          price: "598.94",
          products: [
            "IPod Nano - 8gb - green",
            "IPod Nano - 8gb - red",
            "IPod Nano - 8gb - black",
          ],
          status: "partially_refunded",
        },
      ],
    });
  });
});

describe("Mappings(Process) - transformDataWithMapping(shopify-summary)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = await getOneMapping("mock-shopify-orders-summary");
    const data = transformDataWithMapping(SHOPIFY_ORDERS_DATA, m.mappings);
    expect(data).toEqual({
      summary: {
        items: "6.00",
        total: "1197.88",
      },
    });
  });
});

describe("Mappings(Process) - transformDataWithMapping(shopify-complex)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = await getOneMapping("mock-shopify-orders-complex");
    const data = transformDataWithMapping(SHOPIFY_ORDERS_DATA, m.mappings);
    expect(data).toEqual({
      sales: {
        products: [
          {
            details: [
              {
                name: "IPod Nano - 8gb - green",
                rate: [0.06],
              },
              {
                name: "IPod Nano - 8gb - red",
                rate: [0.06],
              },
              {
                name: "IPod Nano - 8gb - black",
                rate: [0.06],
              },
            ],
          },
          {
            details: [
              {
                name: "IPod Nano - 8gb - green",
                rate: [0.06],
              },
              {
                name: "IPod Nano - 8gb - red",
                rate: [0.06],
              },
              {
                name: "IPod Nano - 8gb - black",
                rate: [0.06],
              },
            ],
          },
        ],
      },
    });
  });
});

describe("Mappings(Process) - transformDataWithMapping(functions)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = await getOneMapping("mock-functions");
    const data = transformDataWithMapping({}, m.mappings);
    expect(data).toEqual({
      functions: {
        sumInt: "6.00",
        sumStr: "6.00",
        sum: "0.00",
        sub: "200.00",
        div: "5.00",
        mul: "50000.00",
        dateTzTs1: [1711977010000, 1714039627000],
        dateTzTs2: [1711977010000, 1714039627000],
        dateTsTz1: ["2024-04-01T13:10:10.000Z", "2024-04-25T10:07:07.000Z"],
        dateTsTz2: ["2024-04-01T13:10:10.000Z", "2024-04-25T10:07:07.000Z"],
        dateTsTz3: null,
        IntFromStr: 50,
        IntfromHex: 119,
        floatFromFloat: "50.50",
        floatFromStr: "50.123",
      },
    });
  });
});

describe("Mappings(Process) - transformDataWithMapping(shopify-function)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = await getOneMapping("mock-shopify-orders-function");
    const data = transformDataWithMapping(SHOPIFY_ORDERS_DATA, m.mappings);
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

describe("Mappings(Process) - transformDataWithMapping(shopify-concat-nested)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = {
      id: "nexted",
      url: "",
      mappings: {
        data: {
          "-target": "orders",
          "-xforms": {
            customer: {
              "-xforms": {
                "::name": [
                  "Concat",
                  ["customer.first_name", " ", "customer.last_name"],
                ],
                email: "customer.email",
                phone: "customer.phone",
                browser: {
                  "-target": "client_details",
                  "-xforms": {
                    ip: "browser_ip",
                    userAgent: "user_agent",
                  },
                },
              },
            },
            customerNameArray: [
              {
                customerName1: "customer.first_name",
              },
              {
                customerName2: {
                  "-xforms": {
                    name: "customer.first_name",
                  },
                },
              },
              "customer.first_name",
            ],
          },
        },
      },
    };
    const data = transformDataWithMapping(SHOPIFY_ORDERS_DATA, m.mappings);
    expect(data).toEqual({
      data: [
        {
          customer: {
            name: "Alice Norman",
            email: "alice.norman@mail.example.com",
            phone: "+16136120707",
            browser: {
              ip: "0.0.0.1",
              userAgent: "Mozilla/5.0 (Linux)",
            },
          },
          customerNameArray: [
            { customerName1: "Alice" },
            { customerName2: { name: "Alice" } },
            "Alice",
          ],
        },
        {
          customer: {
            name: "Bob Norman",
            email: "bob.norman@mail.example.com",
            phone: "+16136120707",
            browser: null,
          },
          customerNameArray: [
            { customerName1: "Bob" },
            { customerName2: { name: "Bob" } },
            "Bob",
          ],
        },
      ],
    });
  });
});

describe("Mappings(Process) - transformDataWithMapping(stripe-payment-intents)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = await getOneMapping("stripe-payment-intents");
    const data = transformDataWithMapping(
      STRIPE_PAYMENT_INTENTS_DATA,
      m.mappings,
    );
    expect(data).toEqual({
      sales: [
        {
          uid: "pi_3MtwBwLkdIwHu7ix28a3tqPa",
          value: 1000,
          date: "2023-04-06T17:01:44.000Z",
        },
        {
          uid: "pi_3MtwBwLkdIwHu7ix28a3tqPb",
          value: 2000,
          date: "2023-04-07T20:48:24.000Z",
        },
        {
          uid: "pi_3MtwBwLkdIwHu7ix28a3tqPc",
          value: 3000,
          date: "2023-04-09T00:35:04.000Z",
        },
      ],
    });
  });
});

describe("Mappings(Process) - transformDataWithMapping(stripe-payment-intents-summary)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = await getOneMapping("stripe-payment-intents-summary");
    const data = transformDataWithMapping(
      STRIPE_PAYMENT_INTENTS_DATA,
      m.mappings,
    );
    expect(data).toEqual({
      summary: {
        sales: "6000.00",
      },
    });
  });
});

describe("Mappings(Process) - transformDataWithMapping(stripe-no-xforms)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = await getOneMapping("mock-stripe-no-xforms");
    const data = transformDataWithMapping(
      STRIPE_PAYMENT_INTENTS_DATA,
      m.mappings,
    );
    expect(data).toEqual({
      sales: STRIPE_PAYMENT_INTENTS_DATA.data,
    });
  });
});

describe("Mappings(Process) - transformDataWithMapping(stripe-no-mappings)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = await getOneMapping("mock-stripe-no-mappings");
    const data = transformDataWithMapping(
      STRIPE_PAYMENT_INTENTS_DATA,
      m.mappings,
    );
    expect(data).toEqual(STRIPE_PAYMENT_INTENTS_DATA);
  });
});

describe("Mappings(Process) - transformDataWithMapping(facebook)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = await getOneMapping("meta-ads-campaigns");
    const data = transformDataWithMapping(META_ADS_CAMPAIGNS_DATA, m.mappings);
    expect(data).toEqual({
      campaigns: {
        campaignId: "6042147342661",
        campaignName: "My Like Campaign",
        campaignStatus: "ACTIVE",
        campaignStartAt: "2024-04-01T12:44:28-0000",
        campaignStopAt: undefined,
        campaignInsights: [
          {
            spend: "119.12",
            impressions: "2703",
            clicks: "53",
            reach: "2112",
            cpm: "44.069552",
            cpc: "2.247547",
            date_start: "2024-04-02",
            date_stop: "2024-05-01",
          },
        ],
      },
    });
  });
});

describe("Mappings(Process) - transformDataWithMapping(Mul and Const)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = {
      id: "mul-and-const",
      url: "",
      mappings: {
        data: {
          "-xforms": {
            "::multiply": ["Mul", [5, 6, 7]],
            "::multiplyAgain": ["Mul", [8, 1]],
            "::constantOne": ["Const", ["TestOne"]],
            "::constantTwo": ["Const", ["TestTwo", 3, 4]],
            "::constantThree": [
              "Const",
              ["TestFive", "TestSix", [1, 2], { status: true }],
            ],
            "::subStringOne": ["SubString", ["OneTest", 3]],
            "::subStringTwo": ["SubString", ["TestTwo", -3]],
            "::subStringThree": ["SubString", ["Three", 10]],
          },
        },
      },
    };
    const data = transformDataWithMapping(
      STRIPE_PAYMENT_INTENTS_DATA,
      m.mappings,
    );
    expect(data).toEqual({
      data: {
        multiply: "210.00",
        multiplyAgain: "8.00",
        constantOne: "TestOne",
        constantTwo: ["TestTwo", 3, 4],
        constantThree: ["TestFive", "TestSix", [1, 2], { status: true }],
        subStringOne: "One",
        subStringTwo: "Two",
        subStringThree: "Three",
      },
    });
  });
});

describe("Mappings(Process) - transformDataWithMapping(non-existing-target)", () => {
  it("return an xform object of a given data and target", async () => {
    const mockData = { data: { status: true } };
    const m: MappingsT = {
      id: "non-existing-target",
      url: "",
      mappings: {
        data: "field",
      },
    };
    let data = transformDataWithMapping(mockData, m.mappings);
    expect(data).toEqual({ data: undefined });

    m.mappings = {
      data: "field.subfield",
    };
    data = transformDataWithMapping(mockData, m.mappings);
    expect(data).toEqual({ data: undefined });

    m.mappings = {
      data: "field.subfield.subsubfield.subsubsubfield",
    };
    data = transformDataWithMapping(mockData, m.mappings);
    expect(data).toEqual({ data: undefined });
  });
});

describe("Mappings(Process) - getValue()", () => {
  it("return a value of a given data[target]", async () => {
    const data = {
      field1: 1,
      field2: 2,
      field3: [3, 4, 5],
      field4: {
        field4_1: 1,
        field4_2: 2,
        field4_3: [3, 4, 5],
        field4_4: {
          nested: "nested",
        },
      },
    };
    let value = getValue(data, "field1");
    expect(value).toEqual(data.field1);
    value = getValue(data, "field3") as JSONValues[];
    expect(value[1]).toEqual(4);
    value = getValue(data, "field4.field4_4.nested") as string;
    expect(value).toEqual("nested");
  });
});

describe("Mappings(Process) - setValue()", () => {
  it("sets a value of a given data[target] = value", async () => {
    const data = {
      field1: 1,
      field2: 2,
      field3: [3, 4, 5],
      field4: {
        field4_1: 1,
        field4_2: 2,
        field4_3: [3, 4, 5],
      },
    };
    let value = getValue(data, "field5.field5_1");
    expect(value).toBeUndefined();

    setValue(data, "field5.field5_1", { value: 0 });
    value = getValue(data, "field5.field5_1");
    expect(value).toEqual({ value: 0 });
  });
});
