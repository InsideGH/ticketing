/**
 * In this case we are using a 'build-client' which handles the fact that
 * we sometime need to have different base urls depending on where we initiate
 * the fetch from.
 *
 * However, for this file, we are only "need" server side fetch.
 */
import buildClient from "../api/build-client";

export default function Home(props) {
  console.log("[CLIENT] Home props", props);

  return (
    <div>
      <h1>Landing page</h1>
      {props.currentUser ? (
        <h1>You are signed in</h1>
      ) : (
        <h1>You are not signed in</h1>
      )}
    </div>
  );
}

/**
 *
 * Since we export this function, Next will call it on the server side and
 * pass in the props to the above component.
 *
 * Now the cool thing is that when there is a client side routing taking place
 * in the browser, the framework (next) will automatically fetch the props for us.
 * Note that we don't have any fetch in our component above.
 *
 */
export async function getServerSideProps(context) {
  const client = buildClient(context);
  const response = await client.get("/api/users/currentuser");

  console.log("[SRV] Home props", response.data);

  return {
    props: response.data,
  };
}
