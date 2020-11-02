import buildClient from "./build-client";

export const getOrders = async (context, id) => {
  const client = buildClient(context);
  const response = await client.get(`/api/orders`);
  return response.data;
};
