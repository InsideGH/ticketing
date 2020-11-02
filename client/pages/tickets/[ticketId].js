import PageWrapper from "../../components/page-wrapper";
import { getCurrentUser } from "../../api/get-current-user";
import { getTicket } from "../../api/get-ticket";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const TicketShow = ({ serverSideProps }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: serverSideProps.ticket.id,
    },
    onSuccess: (order) => Router.push(`/orders/${order.id}`),
  });

  return (
    <PageWrapper serverSideProps={serverSideProps}>
      <h1>{serverSideProps.ticket.title}</h1>
      <h4>Price: {serverSideProps.ticket.price}</h4>
      {errors}
      <button className="btn btn-primary" onClick={() => doRequest()}>
        Purchase
      </button>
    </PageWrapper>
  );
};

export async function getServerSideProps(context) {
  const currentUser = await getCurrentUser(context);
  const ticket = await getTicket(context, context.query.ticketId);

  console.log("[SRV] Ticket props", currentUser, ticket);

  return {
    props: {
      serverSideProps: {
        currentUser,
        ticket,
      },
    },
  };
}

export default TicketShow;
