import axios from "axios";

/**
 * This is a isomorphic builder.
 */
const buildClient = (context) => {
  if (typeof window === "undefined") {
    // We are on the server

    return axios.create({
      baseURL: process.env.BASE_URL_SERVER,
      headers: context.req.headers,
    });
  } else {
    // We must be on the browser
    return axios.create({
      baseURL: process.env.BASE_URL_CLIENT,
    });
  }
};

export default buildClient;
