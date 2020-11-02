import buildClient from "./build-client";

export const getOrder = async (context, id) => {
  const client = buildClient(context);
  const response = await client.get(`/api/orders/${id}`);
  return response.data;
};
