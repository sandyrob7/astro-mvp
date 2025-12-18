"use client";

import { useState } from "react";

export default function Home() {
  const [data, setData] = useState<any>(null);

  async function submit(e: any) {
    e.preventDefault();
    const form = new FormData(e.target);

    const res = await fetch("/api/astro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        dob: form.get("dob"),
        place: form.get("place"),
      }),
    });

    setData(await res.json());
  }

  return (
    <main style={{ maxWidth: 500, margin: "50px auto" }}>
      <h2>Astrology Demo</h2>

      <form onSubmit={submit}>
        <input name="name" placeholder="Name" required /><br />
        <input type="date" name="dob" required /><br />
        <input name="place" placeholder="Place of Birth" required /><br />
        <button type="submit">Generate</button>
      </form>

      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </main>
  );
}
