import buildClient from "./build-client";

export const getCurrentUser = async (context) => {
  const client = buildClient(context);
  const response = await client.get("/api/users/currentuser");
  return response.data.currentUser;
};
