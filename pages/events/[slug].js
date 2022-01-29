import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";
import styles from "@/styles/Event.module.css";
import Link from "next/link";
import Image from "next/image";
import { FaPencilAlt, FaTimes } from "react-icons/fa";

export default function EventsPage({ evt }) {
    const deleteEvent = (e)=>{
        console.log(e)
    }
  return (
    <Layout>
      <div className={styles.event}>
        <div className={styles.controls}>
          <Link href={`/events/edit/${evt.id}`}>
            <a>
              <FaPencilAlt> Edit Event</FaPencilAlt>
            </a>
          </Link>
          <a href="#" className={styles.delete} onClick={deleteEvent}>
            <FaTimes />
            Delete Event
          </a>
        </div>
        <span>
            {new Date(evt[0].attributes.date).toLocaleDateString('en-US')} at {evt[0].attributes.time}
        </span>
        <h1>{evt[0].attributes.Name}</h1>
        {evt[0].attributes.image.data && (
            <div className={styles.image}>
                <Image src={evt[0].attributes.image.data.attributes.formats.large.url} width={960} height={600}/>
            </div>
        )}

        <h3>Mentor:</h3>
        <p>{evt[0].attributes.mentor}</p>
        <h3>Description:</h3>
        <p>{evt[0].attributes.description}</p>
        <h3>Venue: {evt[0].attributes.venue}</h3>
        <p>{evt[0].attributes.address}</p>

        <Link href='/events'>
            <a className={styles.back}>{'<'} Go Back</a>
        </Link>

      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/api/events?&populate=*`);
  const events_with_data = await res.json();
  // console.log(events.data);
  const events = events_with_data.data;

  const paths = events.map((evt) => ({
    params: { slug: evt.attributes.slug },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const res = await fetch(`${API_URL}/api/events?filters[slug]=${slug}&_sort=date:ASC&_limit=3&populate=*`);
  const events_with_data = await res.json();
  // console.log(events.data);
  const events = events_with_data.data;
  return {
    props: {
      evt: events,
    },
    revalidate: 1,
  };
}
