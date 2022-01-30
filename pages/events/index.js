import Layout from "@/components/Layout";
import Eventitem from "@/components/EventItem";
import { API_URL, PER_PAGE } from "@/config/index";
import Link from "next/link";
import Pagination from "@/components/Pagination";

export default function EventsPage({ events, page, total }) {
  return (
    <Layout>
      <h1>Upcoming MeetUps</h1>
      {events.length === 0 && <h3>No events to show</h3>}
      {events.map((evt) => (
        <Eventitem key={evt.id} evt={evt} />
      ))}

      <Pagination page={page} total={total}/>

    </Layout>
  );
}

export async function getServerSideProps({query: {page = 1}}) {
  // Calculate start Page
  const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE

  // Fetch total
  const totalRes = await fetch(`${API_URL}/api/events?_sort=date:ASC&pagination[limit]=${PER_PAGE}&pagination[start]=${start}&populate=*`);
  const total_res = await totalRes.json();
  // console.log(events.data);
  const total_meta = total_res.meta;
  const total = total_meta.pagination.total;

  // Fetch events -------------------------------------------
  const eventRes = await fetch(`${API_URL}/api/events?_sort=date:ASC&pagination[limit]=${PER_PAGE}&pagination[start]=${start}&populate=*`);
  const events_with_data = await eventRes.json();
  // console.log(events.data);
  const events = events_with_data.data;

  return {
    props: { events, page: +page, total },
  };
}

