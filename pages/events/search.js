import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import Link from "next/link";
import Eventitem from "@/components/EventItem";
import { API_URL } from "@/config/index";
import qs from "qs";

export default function SearchPage({ events }) {
    const router = useRouter();
  return (
    <Layout title='Search Results'>
        <Link href="/events">Go Back</Link>
      <h1>Search Results for {router.query.term}</h1>
      {events.length === 0 && <h3>No events to show</h3>}
      {events.map((evt) => (
        <Eventitem key={evt.id} evt={evt} />
      ))}
    </Layout>
  );
}

export async function getServerSideProps({ query: { term } }) {
  const query = qs.stringify({
    filters: {
      $or: [
        {
          Name: {
            $contains: term,
          },
        },
        {
          Mentor: {
            $contains: term,
          },
        },
        {
          description: {
            $contains: term,
          },
        },
        {
            venue: {
              $contains: term,
            },
          },
      ],
    },
  });

  const res = await fetch(`${API_URL}/api/events?${query}&populate=*`);
  const events_with_data = await res.json();
  // console.log(events.data);
  const events = events_with_data.data;
  return {
    props: { events },
  };
}
