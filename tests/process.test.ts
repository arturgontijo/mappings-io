import { getValue, setValue, transformDataWithMapping } from "@/process";
import { JSONValues, MappingsT } from "@/types";
import { getOneMapping } from "./data/load";
import { META_ADS_CAMPAIGNS_DATA, SHOPIFY_ORDERS_DATA, STRIPE_PAYMENT_INTENTS_DATA } from "./data";

describe("Mappings(Process) - transformDataWithMapping(shopify-orders)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = await getOneMapping("mock-shopify-orders");
    const data = await transformDataWithMapping(SHOPIFY_ORDERS_DATA, m.mappings);
    expect(data).toEqual({
      sales: [
        {
          email: "alice.norman@mail.example.com",
          price: "598.94",
          products: ["IPod Nano - 8gb - green", "IPod Nano - 8gb - red", "IPod Nano - 8gb - black"],
          status: "paid",
        },
        {
          email: "bob.norman@mail.example.com",
          price: "598.94",
          products: ["IPod Nano - 8gb - green", "IPod Nano - 8gb - red", "IPod Nano - 8gb - black"],
          status: "partially_refunded",
        },
      ],
    });
  });
});

describe("Mappings(Process) - transformDataWithMapping(shopify-summary)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = await getOneMapping("mock-shopify-orders-summary");
    const data = await transformDataWithMapping(SHOPIFY_ORDERS_DATA, m.mappings);
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
    const data = await transformDataWithMapping(SHOPIFY_ORDERS_DATA, m.mappings);
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

describe("Mappings(Process) - transformDataWithMapping(shopify-concat-nested)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = {
      id: "nested",
      url: "",
      mappings: {
        data: {
          "-target": "orders",
          "-xforms": {
            customer: {
              "-xforms": {
                "::name": ["Concat", ["customer.first_name", "{ }", "customer.last_name"]],
                "::hyphen": ["Concat", ["invalid_field1", "{-}", "invalid_field2"]],
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
    const data = await transformDataWithMapping(SHOPIFY_ORDERS_DATA, m.mappings);
    expect(data).toEqual({
      data: [
        {
          customer: {
            name: "Alice Norman",
            hyphen: "-",
            email: "alice.norman@mail.example.com",
            phone: "+16136120707",
            browser: {
              ip: "0.0.0.1",
              userAgent: "Mozilla/5.0 (Linux)",
            },
          },
          customerNameArray: [{ customerName1: "Alice" }, { customerName2: { name: "Alice" } }, "Alice"],
        },
        {
          customer: {
            name: "Bob Norman",
            hyphen: "-",
            email: "bob.norman@mail.example.com",
            phone: "+16136120707",
            browser: null,
          },
          customerNameArray: [{ customerName1: "Bob" }, { customerName2: { name: "Bob" } }, "Bob"],
        },
      ],
    });
  });
});

describe("Mappings(Process) - transformDataWithMapping(stripe-payment-intents)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = await getOneMapping("stripe-payment-intents");
    const data = await transformDataWithMapping(STRIPE_PAYMENT_INTENTS_DATA, m.mappings);
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
    const data = await transformDataWithMapping(STRIPE_PAYMENT_INTENTS_DATA, m.mappings);
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
    const data = await transformDataWithMapping(STRIPE_PAYMENT_INTENTS_DATA, m.mappings);
    expect(data).toEqual({
      sales: STRIPE_PAYMENT_INTENTS_DATA.data,
    });
  });
});

describe("Mappings(Process) - transformDataWithMapping(stripe-no-mappings)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = await getOneMapping("mock-stripe-no-mappings");
    const data = await transformDataWithMapping(STRIPE_PAYMENT_INTENTS_DATA, m.mappings);
    expect(data).toEqual(STRIPE_PAYMENT_INTENTS_DATA);
  });
});

describe("Mappings(Process) - transformDataWithMapping(facebook)", () => {
  it("return an xform object of a given data and target", async () => {
    const m: MappingsT = await getOneMapping("meta-ads-campaigns");
    const data = await transformDataWithMapping(META_ADS_CAMPAIGNS_DATA, m.mappings);
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
            "::constantThree": ["Const", ["TestFive", "TestSix", [1, 2], { status: true }]],
            "::subStringOne": ["SubString", ["{OneTest}", 3]],
            "::subStringTwo": ["SubString", ["{TestTwo}", -3]],
            "::subStringThree": ["SubString", ["{Three}", 10]],
          },
        },
      },
    };
    const data = await transformDataWithMapping(STRIPE_PAYMENT_INTENTS_DATA, m.mappings);
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
    let data = await transformDataWithMapping(mockData, m.mappings);
    expect(data).toEqual({ data: undefined });

    m.mappings = {
      data: "field.subfield",
    };
    data = await transformDataWithMapping(mockData, m.mappings);
    expect(data).toEqual({ data: undefined });

    m.mappings = {
      data: "field.subfield.subsubfield.subsubsubfield",
    };
    data = await transformDataWithMapping(mockData, m.mappings);
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

describe("Mappings(Process) - '...' fields", () => {
  it("return processed data that uses ... on its fields", async () => {
    const mockData = {
      field1: 1,
      field2: {
        field2_1: "inner1",
        field2_2: "inner2",
        field2_3: "inner3",
        field2_4: "inner4",
        field2_5: ["inner5", "inner6"],
        field2_6: {
          field2_6_1: "inner7",
          field2_6_2: "inner8",
          field2_6_3: ["inner9", "inner10", "inner11"],
          field2_6_4: 12,
        },
        field2_7: 13,
      },
    };

    const m1: MappingsT = {
      url: "",
      id: "",
      mappings: {
        "...field2": "this_will_be_ignored",
      },
    };
    const data1 = await transformDataWithMapping(mockData, m1.mappings);
    expect(data1).toEqual(mockData.field2);

    const m2: MappingsT = {
      url: "",
      id: "",
      mappings: {
        fields: {
          "-target": "field2",
          "-xforms": {
            field1: "field2_1",
            field2: "field2_2",
            "...field2_6": "this_will_be_ignored",
          },
        },
      },
    };
    const data2 = await transformDataWithMapping(mockData, m2.mappings);
    expect(data2).toEqual({
      fields: {
        field1: "inner1",
        field2: "inner2",
        field2_6_1: "inner7",
        field2_6_2: "inner8",
        field2_6_3: ["inner9", "inner10", "inner11"],
        field2_6_4: 12,
      },
    });
  });
});
