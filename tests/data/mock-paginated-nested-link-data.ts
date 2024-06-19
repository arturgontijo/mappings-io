export const MOCK_PAGINATED_LINK_NESTED_DATA_PAG_1 = {
  response: {
    data: [
      {
        id: 1,
        createdAt: "2024-05-01T16:48:18-0000",
        status: "approved",
        product: "One",
        price: 1,
      },
      {
        id: 2,
        createdAt: "2024-05-02T16:48:18-0000",
        status: "approved",
        product: "Two",
        price: 2,
      },
      {
        id: 3,
        createdAt: "2024-05-03T16:48:18-0000",
        status: "canceled",
        product: "Three",
        price: 3,
      },
    ],
    paging: {
      total: 10,
      cursors: {
        before: null,
        after: "http://0.0.0.0:4444/api/v1/nested-page-2",
      },
    },
  },
};

export const MOCK_PAGINATED_LINK_NESTED_DATA_PAG_2 = {
  response: {
    data: [
      {
        id: 4,
        createdAt: "2024-05-04T16:48:18-0000",
        status: "paid",
        product: "Four",
        price: 4,
      },
      {
        id: 5,
        createdAt: "2024-05-05T16:48:18-0000",
        status: "approved",
        product: "Five",
        price: 5,
      },
    ],
    paging: {
      total: 10,
      cursors: {
        before: "http://0.0.0.0:4444/api/v1/nested-page-1",
        after: "http://0.0.0.0:4444/api/v1/nested-page-3",
      },
    },
  },
};

export const MOCK_PAGINATED_LINK_NESTED_DATA_PAG_3 = {
  response: {
    data: [
      {
        id: 6,
        createdAt: "2024-05-06T16:48:18-0000",
        status: "canceled",
        product: "Six",
        price: 6,
      },
      {
        id: 7,
        createdAt: "2024-05-07T16:48:18-0000",
        status: "paid",
        product: "Seven",
        price: 7,
      },
      {
        id: 8,
        createdAt: "2024-05-08T16:48:18-0000",
        status: "canceled",
        product: "Eight",
        price: 8,
      },
      {
        id: 9,
        createdAt: "2024-05-09T16:48:18-0000",
        status: "approved",
        product: "Nine",
        price: 9,
      },
      {
        id: 10,
        createdAt: "2024-05-10T16:48:18-0000",
        status: "approved",
        product: "Ten",
        price: 10,
      },
    ],
    paging: {
      total: 10,
      cursors: {
        before: "http://0.0.0.0:4444/api/v1/nested-page-2",
        after: null,
      },
    },
  },
};
