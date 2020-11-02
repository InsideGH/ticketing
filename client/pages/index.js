import PageWrapper from "../components/page-wrapper";
import { getCurrentUser } from "../api/get-current-user";

export default function Home({ serverSideProps }) {
  console.log("[CLIENT] Home serverSideProps", serverSideProps);
  return (
    <PageWrapper serverSideProps={serverSideProps}>
      <h1>Landing page</h1>
      {serverSideProps.currentUser ? (
        <h1>You are signed in</h1>
      ) : (
        <h1>You are not signed in</h1>
      )}
    </PageWrapper>
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
  const currentUser = await getCurrentUser(context);

  console.log("[SRV] Home props", currentUser);

  return {
    props: {
      serverSideProps: {
        currentUser,
      },
    },
  };
}
