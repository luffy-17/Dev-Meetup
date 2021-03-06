import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import { API_URL } from "@/config/index";
import "react-toastify/dist/ReactToastify.css";
import styles from "@/styles/Form.module.css";
import Layout from "@/components/Layout";
import slugify from "slugify";

export default function AddEventPage() {
  const [data, setValues] = useState({
    Name: "",
    mentor: "",
    venue: "",
    address: "",
    date: "",
    time: "",
    description: "",
});

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
    data.slug = slugify(data.Name.toLowerCase())

    const res = await fetch(`${API_URL}/api/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({"data":data}),
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

  return (
    <Layout title="Add new Event">
      <Link href="/events">Go Back</Link>
      <h1>Add Event</h1>
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
              value={data.date}
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

        <input type="submit" value="Add Event" className="btn" />
      </form>
    </Layout>
  );
}
