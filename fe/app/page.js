"use client";
import axios from "axios";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar/page";
import Listfield from "@/components/Listfield/page";
import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState({ username: "", userId: "", tasks: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("checkliste24_token");
    const username = sessionStorage.getItem("checkliste24_username");

    if (!token || !username) {
      redirect("/login");
    } else {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      axios
        .post("http://localhost:8002/api/getUserAccount", { username })
        .then((res) => {
          setUser({
            username: res.data.username,
            userId: res.data.userId,
            tasks: res.data.tasks,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="overflow-hidden">
        <Navbar appName="Checkliste24" username={user.username} />
        <Listfield user={user} />
      </div>
    </>
  );
}
