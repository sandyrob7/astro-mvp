"use client";

import { useState } from "react";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [report, setReport] = useState<any>(null);

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

    const json = await res.json();
    setData(json);

    // For now, use API response directly as report
    // Later, you can transform this into a structured report
    setReport(json);
  }

  async function downloadPdf(report: any) {
    const res = await fetch("/api/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "astrology-report.pdf";
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main style={{ maxWidth: 500, margin: "50px auto" }}>
      <h2>Astrology Demo</h2>

      <form onSubmit={submit}>
        <input name="name" placeholder="Name" required />
        <br />
        <input type="date" name="dob" required />
        <br />
        <input name="place" placeholder="Place of Birth" required />
        <br />
        <button type="submit">Generate</button>
      </form>

      {data && (
        <>
          <pre>{JSON.stringify(data, null, 2)}</pre>

          <button
            onClick={() => downloadPdf(report)}
            style={{
              marginTop: 20,
              padding: "8px 16px",
              background: "green",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Download PDF
          </button>
        </>
      )}
    </main>
  );
}