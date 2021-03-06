import { useState } from "react";
import useRequest from "../../hooks/use-request";
import PageWrapper from "../../components/page-wrapper";
import { getCurrentUser } from "../../api/get-current-user";
import Router from "next/router";

const NewTicket = ({ serverSideProps }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: (ticket) => Router.push("/"),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <PageWrapper serverSideProps={serverSideProps}>
      <h1>Create ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </PageWrapper>
  );
};

export async function getServerSideProps(context) {
  const currentUser = await getCurrentUser(context);

  console.log("[SRV] New Ticket props", currentUser);

  return {
    props: {
      serverSideProps: {
        currentUser,
      },
    },
  };
}

export default NewTicket;
