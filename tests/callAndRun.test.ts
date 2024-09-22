import { call } from "@/api/call";
import { getOneMapping } from "./data/load";
import { MappingsByIdT, MappingsT } from "@/types";

import express, { Request, Response } from "express";
import { Server } from "http";
import BodyParser from "body-parser";
import { run } from "@/run";
import {
  META_ADS_CAMPAIGNS_DATA,
  SHOPIFY_ORDERS_DATA,
  STRIPE_PAYMENT_INTENTS_DATA,
  MOCK_PAGINATED_DATA_PAG_1,
  MOCK_PAGINATED_DATA_PAG_2,
  MOCK_PAGINATED_DATA_PAG_3,
  MOCK_PAGINATED_LINK_DATA_PAG_2,
  MOCK_PAGINATED_LINK_DATA_PAG_3,
  MOCK_PAGINATED_LINK_DATA_PAG_1,
  MOCK_PAGINATED_NESTED_DATA_PAG_1,
  MOCK_PAGINATED_NESTED_DATA_PAG_2,
  MOCK_PAGINATED_NESTED_DATA_PAG_3,
  MOCK_PAGINATED_LINK_NESTED_DATA_PAG_1,
  MOCK_PAGINATED_LINK_NESTED_DATA_PAG_2,
  MOCK_PAGINATED_LINK_NESTED_DATA_PAG_3,
} from "./data";

const PORT = 4444;
const API_URL = `http://0.0.0.0:${PORT}/api/v1`;

describe("Setting API Server up...", () => {
  let server: Server;
  beforeAll((done) => {
    const app = express();
    app.use(BodyParser.json());

    app.get("/api/v1/status", async (_req: Request, res: Response) => {
      return res.send(true);
    });

    app.get("/api/v1/validate", async (req: Request, res: Response) => {
      if (req.headers.authorization === "superSecretToken") {
        return res.send({ valid: true });
      }
      return res.status(400).send({ valid: false });
    });

    app.get("/api/v1/orders", async (req: Request, res: Response) => {
      if (req.headers.authorization === "superSecretToken") {
        const { query } = req;
        return res.send(
          [
            { id: 0, status: "approved", product: "table", price: "80.75" },
            { id: 1, status: "refunded", product: "chair", price: "40.75" },
            { id: 2, status: "canceled", product: "television", price: "749.99" },
            { id: 3, status: "approved", product: "laptop", price: "1,250.00" },
          ].filter((item) => item.status === query["status"]),
        );
      }
      return res.status(400).send({ valid: false });
    });

    app.get("/api/v1/meta/:campainId", async (_req: Request, res: Response) => {
      return res.send(META_ADS_CAMPAIGNS_DATA);
    });

    app.get("/api/v1/shopify/orders", async (_req: Request, res: Response) => {
      return res.send(SHOPIFY_ORDERS_DATA);
    });

    app.get("/api/v1/stripe/payment_intents", async (_req: Request, res: Response) => {
      return res.send(STRIPE_PAYMENT_INTENTS_DATA);
    });

    app.get("/api/v1/pages", async (req: Request, res: Response) => {
      const { page } = req.query;
      if (!page) return res.send(MOCK_PAGINATED_DATA_PAG_1);
      if (page === "2") return res.send(MOCK_PAGINATED_DATA_PAG_2);
      if (page === "3") return res.send(MOCK_PAGINATED_DATA_PAG_3);
      if (parseInt(page.toString() || "4") > 3) return res.status(404).send({});
    });

    app.get("/api/v1/page-1", async (_req: Request, res: Response) => {
      return res.send(MOCK_PAGINATED_LINK_DATA_PAG_1);
    });
    app.get("/api/v1/page-2", async (_req: Request, res: Response) => {
      return res.send(MOCK_PAGINATED_LINK_DATA_PAG_2);
    });
    app.get("/api/v1/page-3", async (_req: Request, res: Response) => {
      return res.send(MOCK_PAGINATED_LINK_DATA_PAG_3);
    });

    app.get("/api/v1/nested-pages", async (req: Request, res: Response) => {
      const { page } = req.query;
      if (!page) return res.send(MOCK_PAGINATED_NESTED_DATA_PAG_1);
      if (page === "2") return res.send(MOCK_PAGINATED_NESTED_DATA_PAG_2);
      if (page === "3") return res.send(MOCK_PAGINATED_NESTED_DATA_PAG_3);
      if (parseInt(page.toString() || "4") > 3) return res.status(404).send({});
    });

    app.get("/api/v1/nested-page-1", async (_req: Request, res: Response) => {
      return res.send(MOCK_PAGINATED_LINK_NESTED_DATA_PAG_1);
    });
    app.get("/api/v1/nested-page-2", async (_req: Request, res: Response) => {
      return res.send(MOCK_PAGINATED_LINK_NESTED_DATA_PAG_2);
    });
    app.get("/api/v1/nested-page-3", async (_req: Request, res: Response) => {
      return res.send(MOCK_PAGINATED_LINK_NESTED_DATA_PAG_3);
    });

    server = app.listen(PORT, done);
  });

  afterAll(() => {
    return server && server.close();
  });

  describe("API(get) - get() /status with call()", () => {
    it("return a GET response from an endpoint of a mapping", async () => {
      const m: MappingsT = {
        id: "test",
        url: `${API_URL}/status`,
        params: {},
        headers: {
          "Content-Type": "application/json",
        },
        mappings: {},
      };
      const data = await call(m);
      expect(data).toEqual(true);
    });
  });

  describe("API(get) - get() /status with run()", () => {
    it("return a GET response from an endpoint of a mapping", async () => {
      const m: MappingsT = {
        id: "test",
        url: `${API_URL}/status`,
        params: {},
        headers: {
          "Content-Type": "application/json",
        },
        mappings: {},
      };
      const data = await run(m);
      expect(data).toEqual(true);
    });
  });

  describe("API(get) - get(refunded) /orders", () => {
    it("return a GET response from an endpoint of a mapping", async () => {
      const m: MappingsT = {
        id: "test",
        url: `${API_URL}/orders`,
        params: { status: "refunded" },
        headers: {
          "Content-Type": "application/json",
          Authorization: "superSecretToken",
        },
        mappings: {},
      };
      const data = await call(m);
      expect(data).toHaveLength(1);
    });
  });

  describe("API(get) - get(mock-local-no-mappings-orders) /orders", () => {
    it("return a GET response from an endpoint in a mapping JSON file", async () => {
      const m: MappingsT = await getOneMapping("mock-local-no-mappings-orders");
      m.headers = { Authorization: "superSecretToken" };
      const data = await call(m);
      expect(data).toHaveLength(2);
    });
  });

  describe("API(get) - get() /validate with run() and replacer", () => {
    it("return a GET response from an endpoint in a mapping JSON file", async () => {
      const m: MappingsT = await getOneMapping("mock-local-no-mappings-validate");
      const replacer = new Map([["<ACCESS_TOKEN>", "superSecretToken"]]);
      const data = await run(m, replacer);
      expect(data).toEqual({ valid: true });
    });
  });

  describe("API(get) - get(canceled) /orders", () => {
    it("return a GET response from an endpoint of a mapping filtering by canceled", async () => {
      const m: MappingsT = {
        id: "test",
        url: `${API_URL}/orders`,
        params: { status: "canceled" },
        headers: {
          "Content-Type": "application/json",
          Authorization: "superSecretToken",
        },
        mappings: {},
      };
      const data = await call(m);
      expect(data).toHaveLength(1);
    });
  });

  describe("API(get) - get() invalid endpoint with call()", () => {
    it("return a GET response from an endpoint of a mapping", async () => {
      const m: MappingsT = {
        id: "test",
        url: `${API_URL}/invalid`,
        params: {},
        headers: {
          "Content-Type": "application/json",
        },
        mappings: {},
      };
      await call(m)
        .then()
        .catch((e) => {
          expect(e.toString()).toEqual("AxiosError: Request failed with status code 404");
        });
    });
  });

  describe("API(get) - get() MetaAds /campaigns with run() and replacer", () => {
    it("return a GET response from an endpoint in a mapping JSON file", async () => {
      const m: MappingsT = await getOneMapping("mock-meta-ads-campaigns");
      const replacer = new Map([
        ["<ACCESS_TOKEN>", "superSecretToken"],
        ["<API_VERSION>", "api/v1/meta"],
        ["<CAMPAIGN_ID>", "6042147342661"],
      ]);
      const data = await run(m, replacer);
      expect(data).toEqual({
        campaigns: {
          campaignId: "6042147342661",
          campaignStatus: "ACTIVE",
        },
      });
    });
  });

  describe("API(get) - get() Shopify /orders with run() and replacer", () => {
    it("return a GET response from an endpoint in a mapping JSON file", async () => {
      const m: MappingsT = await getOneMapping("mock-shopify-orders-function");
      m.url = `${API_URL}/shopify/orders`;
      const replacer = new Map([["<ACCESS_TOKEN>", "superSecretToken"]]);
      const data = await run(m, replacer);
      expect(data).toEqual({
        functions: {
          dates: [1199980800000, 1202659200000],
          tax: "23.88",
          total: "1197.88",
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

  describe("API(get) - get() Stripe /payment_intents with run() and replacer", () => {
    it("return a GET response from an endpoint in a mapping JSON file", async () => {
      const m: MappingsT = await getOneMapping("mock-stripe-no-xforms");
      m.url = `${API_URL}/stripe/payment_intents`;
      const replacer = new Map([
        ["<USERNAME>", "user"],
        ["<PASSWORD>", "pass"],
      ]);
      const data = await run(m, replacer);
      expect(data).toEqual({
        sales: STRIPE_PAYMENT_INTENTS_DATA.data,
      });
    });
  });

  describe("API(get) - get() local paginated /pages with run() and replacer", () => {
    it("return a GET response from an endpoint in a mapping JSON file", async () => {
      const m: MappingsT = await getOneMapping("mock-local-paginated");
      const replacer = new Map([["<ACCESS_TOKEN>", "superSecretToken"]]);
      let targetData = MOCK_PAGINATED_DATA_PAG_1.data;
      targetData = targetData.concat(MOCK_PAGINATED_DATA_PAG_2.data);
      targetData = targetData.concat(MOCK_PAGINATED_DATA_PAG_3.data);
      await run(m, replacer)
        .then((data) => expect(data).toEqual({ sales: targetData }))
        .catch((e) => expect(e).toBeUndefined());
    });
  });

  describe("API(get) - get() local paginated /pages (with link cursor) with run() and replacer", () => {
    it("return a GET response from an endpoint in a mapping JSON file", async () => {
      const m: MappingsT = await getOneMapping("mock-local-paginated-link");
      const replacer = new Map([["<ACCESS_TOKEN>", "superSecretToken"]]);
      let targetData = MOCK_PAGINATED_LINK_DATA_PAG_1.data;
      targetData = targetData.concat(MOCK_PAGINATED_LINK_DATA_PAG_2.data);
      targetData = targetData.concat(MOCK_PAGINATED_LINK_DATA_PAG_3.data);
      await run(m, replacer)
        .then((data) => expect(data).toEqual({ sales: targetData }))
        .catch((e) => expect(e).toBeUndefined());
    });
  });

  describe("API(get) - get() local paginated (nested data) /pages with run() and replacer", () => {
    it("return a GET response from an endpoint in a mapping JSON file", async () => {
      const m: MappingsT = await getOneMapping("mock-local-paginated-nested");
      const replacer = new Map([["<ACCESS_TOKEN>", "superSecretToken"]]);
      let targetData = MOCK_PAGINATED_NESTED_DATA_PAG_1.response.data;
      targetData = targetData.concat(MOCK_PAGINATED_NESTED_DATA_PAG_2.response.data);
      targetData = targetData.concat(MOCK_PAGINATED_NESTED_DATA_PAG_3.response.data);
      await run(m, replacer)
        .then((data) => expect(data).toEqual({ sales: targetData }))
        .catch((e) => expect(e).toBeUndefined());
    });
  });

  describe("API(get) - get() local paginated (nested data and link cursor) /pages with run() and replacer", () => {
    it("return a GET response from an endpoint in a mapping JSON file", async () => {
      const m: MappingsT = await getOneMapping("mock-local-paginated-nested-link");
      const replacer = new Map([["<ACCESS_TOKEN>", "superSecretToken"]]);
      let targetData = MOCK_PAGINATED_LINK_NESTED_DATA_PAG_1.response.data;
      targetData = targetData.concat(MOCK_PAGINATED_LINK_NESTED_DATA_PAG_2.response.data);
      targetData = targetData.concat(MOCK_PAGINATED_LINK_NESTED_DATA_PAG_3.response.data);
      await run(m, replacer)
        .then((data) => expect(data).toEqual({ sales: targetData }))
        .catch((e) => expect(e).toBeUndefined());
    });
  });

  describe("API(get) - get() local data calling multiple mappings by using nested logic (++)", () => {
    it("return a GET response from an endpoint in a mapping JSON file", async () => {
      const m: MappingsT = await getOneMapping("mock-nested");
      const m2: MappingsT = await getOneMapping("mock-functions");
      const m3: MappingsT = await getOneMapping("mock-local-simple");
      const m4: MappingsT = await getOneMapping("mock-local-no-mappings-validate");
      const replacer = new Map([["<ACCESS_TOKEN>", "superSecretToken"]]);
      const mappingsById: MappingsByIdT = new Map([
        ["mock-functions", { mappings: m2, replacer }],
        ["mock-local-simple", { mappings: m3, replacer }],
        ["mock-local-no-mappings-validate", { mappings: m4, replacer }],
      ]);
      await run(m, replacer, mappingsById)
        .then((data) =>
          expect(data).toEqual({
            normalField1: "Testing...",
            xFormsField2: [
              { key: 0, value: "80.75" },
              { key: 3, value: "1,250.00" },
            ],
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
              dateTsTz2: ["2024-04-01T13:10:10.000Z", "2024-04-25T10:07:07.000Z"],
              dateTsTz3: undefined,
              IntFromStr: 50,
              IntfromHex: 119,
              floatFromFloat: "50.50",
              floatFromStr: "50.123",
              index1: 3,
              indexOut: undefined,
              indexInvalid: undefined,
            },
            nestedRefunds: {
              refunds: [
                {
                  amount: "40.75",
                  name: "chair",
                  uuid: 1,
                },
              ],
            },
            valid: true,
          }),
        )
        .catch((e) => expect(e).toBeUndefined());
    });
  });
});
