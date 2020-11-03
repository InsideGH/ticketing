import PageWrapper from "../components/page-wrapper";
import { getCurrentUser } from "../api/get-current-user";
import { getTickets } from "../api/get-tickets";
import Link from "next/link";

export default function Home({ serverSideProps, tickets }) {
  return (
    <PageWrapper serverSideProps={serverSideProps}>
      <h1>Landing page!!</h1>
      {serverSideProps.currentUser ? (
        <h1>You are signed in</h1>
      ) : (
        <h1>You are not signed in</h1>
      )}
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>title</th>
            <th>price</th>
            <th>link</th>
          </tr>
        </thead>
        <tbody>
          {serverSideProps.tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.title}</td>
              <td>{ticket.price}</td>
              <td>
                <Link href={`/tickets/${ticket.id}`}>
                  <a>{ticket.title}</a>
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
  const tickets = await getTickets(context);

  console.log("[SRV] Home props", currentUser, tickets);

  return {
    props: {
      serverSideProps: {
        currentUser,
        tickets,
      },
    },
  };
}
