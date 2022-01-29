import Layout from "@/components/Layout";
import Eventitem from "@/components/EventItem";
import { API_URL } from "@/config/index";
import Link from "next/link";

export default function HomePage({ events }) {
  return (
    <Layout>
      <h1>Upcoming MeetUps</h1>
      {events.length === 0 && <h3>No events to show</h3>}
      {events.map((evt) => (
        <Eventitem key={evt.id} evt={evt} />
      ))}
      {events.length > 0 && (
        <Link href='/events'>
          <a className="btn-secondary">View All Events</a>
        </Link>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const res = await fetch(`${API_URL}/api/events?_sort=date:ASC&_limit=3&populate=*`);
  const events_with_data = await res.json();
  // console.log(events.data);
  const events = events_with_data.data;
  return {
    props: {events},
    revalidate: 1,
  };
}
