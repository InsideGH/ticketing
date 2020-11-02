import buildClient from "./build-client";

export const getTickets = async (context) => {
  const client = buildClient(context);
  const response = await client.get("/api/tickets");
  return response.data;
};
