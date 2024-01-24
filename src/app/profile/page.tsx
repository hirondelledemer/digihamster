"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    setData(res.data.data._id);
  };
  return (
    <div>
      <h1>Profile</h1>
      <h2>{data === "nothing" ? "Nothing" : data}</h2>
      <button onClick={getUserDetails}>Details</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
