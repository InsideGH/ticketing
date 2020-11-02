import buildClient from "./build-client";

export const getTicket = async (context, id) => {
  const client = buildClient(context);
  const response = await client.get(`/api/tickets/${id}`);
  return response.data;
};
