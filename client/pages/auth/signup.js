import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
import PageWrapper from "../../components/page-wrapper";
import { getCurrentUser } from "../../api/get-current-user";

const Signup = ({ serverSideProps }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (event) => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <PageWrapper serverSideProps={serverSideProps}>
      <form onSubmit={onSubmit}>
        <h1>Sign Up</h1>
        <div className="form-group">
          <label>Email Address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Sign Up</button>
      </form>
    </PageWrapper>
  );
};

export async function getServerSideProps(context) {
  const currentUser = await getCurrentUser(context);

  console.log("[SRV] Signup props", currentUser);

  return {
    props: {
      serverSideProps: {
        currentUser,
      },
    },
  };
}

export default Signup;
