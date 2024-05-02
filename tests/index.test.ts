import { call } from "@/api/call";
import { getOneMapping } from "./data/load";
import { MappingsT } from "@/types/generics";
import { describe, expect, it } from "@jest/globals";

import express, { Request, Response } from "express";
import { Server } from "http";
import BodyParser from "body-parser";

const PORT = 4444;
const API_URL = `http://0.0.0.0:${PORT}/api/v1`;

describe("Setting API Server up...", () => {
  let server: Server;
  beforeAll((done) => {
    const app = express();
    app.use(BodyParser.json());

    app.get("/api/v1/status", async (_req: Request, res: Response) => {
      res.send(true);
    });

    app.get("/api/v1/orders", async (req: Request, res: Response) => {
      const { query } = req;
      res.send(
        [
          { id: 0, status: "approved", product: "table", price: "80.75" },
          { id: 1, status: "refunded", product: "chair", price: "40.75" },
          { id: 2, status: "canceled", product: "television", price: "749.99" },
          { id: 3, status: "approved", product: "laptop", price: "1,250.00" },
        ].filter((item) => item.status === query.status),
      );
    });
    server = app.listen(PORT, done);
  });

  afterAll(() => {
    return server && server.close();
  });

  describe("API(get) - get() /status", () => {
    it("return a GET response from an endpoint in a mappings JSON file", async () => {
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

  describe("API(get) - get(refunded) /orders", () => {
    it("return a GET response from an endpoint in a mappings JSON file", async () => {
      const m: MappingsT = {
        id: "test",
        url: `${API_URL}/orders`,
        params: { status: "refunded" },
        headers: { "Content-Type": "application/json" },
        mappings: {},
      };
      const data = await call(m);
      expect(data).toHaveLength(1);
    });
  });

  describe("API(get) - get(mock-local-orders) /orders", () => {
    it("return a GET response from an endpoint in a mappings JSON file", async () => {
      const m: MappingsT = await getOneMapping("mock-local-orders");
      const data = await call(m);
      expect(data).toHaveLength(2);
    });
  });

  describe("API(get) - get(canceled) /orders", () => {
    it("return a GET response from an endpoint in a mappings JSON file filtering by canceled", async () => {
      const m: MappingsT = {
        id: "test",
        url: `${API_URL}/orders`,
        params: { status: "canceled" },
        headers: { "Content-Type": "application/json" },
        mappings: {},
      };
      const data = await call(m);
      expect(data).toHaveLength(1);
    });
  });
});
