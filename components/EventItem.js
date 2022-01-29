import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/Eventitem.module.css";

export default function Eventitem({ evt }) {
  return (
    <div className={styles.event}>
      <div className={styles.img}>
        <Image
          src={
            evt.attributes.image.data
              ? evt.attributes.image.data.attributes.formats.thumbnail.url
              : "/images/sample/dev2.jpg"
          }
          width={170}
          height={100}
        />
      </div>
      <div className={styles.info}>
        <span>
          {new Date(evt.attributes.date).toLocaleDateString('en-US')} at {evt.attributes.time}
        </span>
        <h3>{evt.attributes.Name}</h3>
      </div>
      <div className={styles.link}>
        <Link href={`/events/${evt.attributes.slug}`}>
          <a className="btn">Details</a>
        </Link>
      </div>
    </div>
  );
}
