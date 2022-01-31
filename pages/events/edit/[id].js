import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { API_URL } from "@/config/index";
import "react-toastify/dist/ReactToastify.css";
import styles from "@/styles/Form.module.css";
import Layout from "@/components/Layout";
import Modal from "@/components/Modal";
import slugify from "slugify";
import moment from "moment";
import Image from "next/image";
import { FaImage } from "react-icons/fa";
import ImageUpload from "@/components/ImageUpload";

export default function EditEventPage(evt) {
  const [data, setValues] = useState({
    Name: evt.event.attributes.Name,
    mentor: evt.event.attributes.mentor,
    venue: evt.event.attributes.venue,
    address: evt.event.attributes.address,
    date: evt.event.attributes.date,
    time: evt.event.attributes.time,
    description: evt.event.attributes.description,
  });

  const [imagePreview, setImagePreview] = useState(
    evt.event.attributes.image.data
      ? evt.event.attributes.image.data.attributes.formats.thumbnail.url
      : null
  );

  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const hasEmptyFields = Object.values(data).some(
      (element) => element === ""
    );

    if (hasEmptyFields) {
      toast.error("Please fill in all fields");
    }

    // Slugify----------------------------------------------------------
    data.slug = slugify(data.Name.toLowerCase());

    // PUT ---------------------------------------------------------------
    const res = await fetch(`${API_URL}/api/events/${evt.event.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: data }),
    });

    if (!res.ok) {
      toast.error("Something Went Wrong");
    } else {
      const evt = await res.json();
      router.push(`/events/${evt.data.attributes.slug}`);
    }
    // const evt = await res.json();
    // console.log(evt.data.attributes.slug);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...data, [name]: value });
  };
  // Imageploaded         ------------------------------------------------------------
  const imageUploaded = async (e) => {
    const res = await fetch(`${API_URL}/api/events/${evt.event.id}?populate=*`);
    const events_with_data = await res.json();
    // console.log(events.data);
    const events = events_with_data.data;
    console.log(data)
    setImagePreview(
        events.attributes.image.data.attributes.formats.thumbnail.url
    );
    setShowModal(false);
    // console.log('Uploaded')
  };
  console.log(evt.event.id)
  return (
    <Layout title="Add new Event">
      <Link href="/events">Go Back</Link>
      <h1>Edit Event</h1>
      <ToastContainer />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor="Name">Event Name</label>
            <input
              type="text"
              id="Name"
              name="Name"
              value={data.Name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="mentor">Mentor</label>
            <input
              type="text"
              name="mentor"
              id="mentor"
              value={data.mentor}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="venue">Venue</label>
            <input
              type="text"
              name="venue"
              id="venue"
              value={data.venue}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              value={data.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              value={moment(data.date).format("yyyy-MM-DD")}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="time">Time</label>
            <input
              type="text"
              name="time"
              id="time"
              value={data.time}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description">Event Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            value={data.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <input type="submit" value="Update Event" className="btn" />
      </form>
      <h2>Event Image</h2>
      {imagePreview ? (
        <Image src={imagePreview} height={100} width={170} />
      ) : (
        <div>
          <p>No image uploaded</p>
        </div>
      )}
      <div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-secondary btn-icon"
        >
          <FaImage /> Set Image
        </button>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload
          evtWithImage={evt.event}
          imageUploaded={imageUploaded}
          //   token={token}
        />
      </Modal>
    </Layout>
  );
}

export async function getServerSideProps({ params: { id }, req }) {
  // const { token } = parseCookies(req)

  const res = await fetch(`${API_URL}/api/events/${id}?&populate=*`);
  const event_with_data = await res.json();
  const event = event_with_data.data;
  console.log(req.headers.cookie)
  return {
    props: {
      event,
      //   token,
    },
  };
}
