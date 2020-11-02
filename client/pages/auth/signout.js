import { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

import PageWrapper from "../../components/page-wrapper";
import { getCurrentUser } from "../../api/get-current-user";
const SignOut = ({ serverSideProps }) => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <PageWrapper serverSideProps={serverSideProps}>
      Signing you out...
    </PageWrapper>
  );
};

export async function getServerSideProps(context) {
  const currentUser = await getCurrentUser(context);

  console.log("[SRV] Signoutprops", currentUser);

  return {
    props: {
      serverSideProps: {
        currentUser,
      },
    },
  };
}

export default SignOut;
