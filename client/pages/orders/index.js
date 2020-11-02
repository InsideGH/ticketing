import PageWrapper from "../../components/page-wrapper";
import { getCurrentUser } from "../../api/get-current-user";
import { getOrders } from "../../api/get-orders";
import Link from "next/link";

export default function Orders({ serverSideProps, tickets }) {
  return (
    <PageWrapper serverSideProps={serverSideProps}>
      <h1>Orders</h1>
      <table className="table">
        <thead>
          <tr>
            <th>title</th>
            <th>status</th>
            <th>price</th>
            <th>link</th>
          </tr>
        </thead>
        <tbody>
          {serverSideProps.orders.map((order) => (
            <tr key={order.id}>
              <td>{order.ticket.title}</td>
              <td>{order.status}</td>
              <td>{order.ticket.price}</td>
              <td>
                <Link href={`/orders/${order.id}`}>
                  <a>{order.ticket.title}</a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
  const orders = await getOrders(context);

  console.log("[SRV] Orders props", currentUser, orders.map(o => o.id));

  return {
    props: {
      serverSideProps: {
        currentUser,
        orders,
      },
    },
  };
}
