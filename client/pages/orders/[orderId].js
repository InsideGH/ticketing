import React, { useEffect, useState } from "react";
import PageWrapper from "../../components/page-wrapper";
import { getCurrentUser } from "../../api/get-current-user";
import { getOrder } from "../../api/get-order";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import StripeCheckout from "react-stripe-checkout";

const OrderShow = ({ serverSideProps }) => {
  const { order } = serverSideProps;
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (order) => Router.push(`/orders`),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timer = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  if (timeLeft < 0) {
    return (
      <PageWrapper serverSideProps={serverSideProps}>
        <h1>Order expired</h1>
      </PageWrapper>
    );
  }

  const onToken = (token) => {
    doRequest({
      token: token.id,
    });
  };

  return (
    <PageWrapper serverSideProps={serverSideProps}>
      <h1>Order</h1>
      <h4>Time left: {timeLeft}</h4>
      <StripeCheckout
        token={onToken}
        stripeKey="pk_test_51Hij5pDpYqo5qlSLRD9FLFZ46eWUnnEe58EIKQ4Qi7HQlOcxkx7ktaz1CNFAlTsUwBeIVAeQvs6aRNELwVsqs8to00B8jB2w7Y"
        amount={order.ticket.price * 100}
        email={serverSideProps.currentUser.email}
      />
      {errors}
    </PageWrapper>
  );
};

export async function getServerSideProps(context) {
  const currentUser = await getCurrentUser(context);
  const order = await getOrder(context, context.query.orderId);

  console.log("[SRV] Order props", currentUser, order);

  return {
    props: {
      serverSideProps: {
        currentUser,
        order,
      },
    },
  };
}

export default OrderShow;
