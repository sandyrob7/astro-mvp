"use client";

import { useState } from "react";

/* ---------- helpers ---------- */

const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

function signFromLongitude(lon: number) {
  return SIGNS[Math.floor(((lon % 360) + 360) / 30)];
}

function buildReport(api: any) {
  const chart = api.chart;

  return {
    meta: {
      name: api.input?.name,
      generatedAt: new Date().toISOString(),
    },

    birth: {
      date: api.input?.dob,
      place: api.input?.place,
      ascendant: {
        longitude: chart.houses.ascendant,
        sign: signFromLongitude(chart.houses.ascendant),
      },
    },

    planets: Object.entries(chart.planets).map(
      ([planet, p]: any) => ({
        planet,
        sign: signFromLongitude(p.longitude),
        house: p.house,
      })
    ),

    aspects: chart.aspects.map((a: any) => ({
      between: a.between.join(" – "),
      type: a.type,
      orb: a.orb,
    })),
  };
}

/* ---------- component ---------- */

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [report, setReport] = useState<any>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

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
    setReport(buildReport(json)); // ✅ fixed
  }

  async function downloadPdf(rep: any) {
    const res = await fetch("/api/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rep),
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
    <main style={{ maxWidth: 600, margin: "50px auto", fontFamily: "sans-serif" }}>
      <h2>Astrology Demo</h2>

      <form onSubmit={submit}>
        <input name="name" placeholder="Name" required />
        <br /><br />
        <input type="date" name="dob" required />
        <br /><br />
        <input name="place" placeholder="Place of Birth" required />
        <br /><br />
        <button type="submit">Generate</button>
      </form>

      {report && (
        <>
          <hr style={{ margin: "30px 0" }} />

          <h3>Birth Summary</h3>
          <p><b>Name:</b> {report.meta.name}</p>
          <p><b>Date:</b> {report.birth.date}</p>
          <p><b>Place:</b> {report.birth.place}</p>
          <p>
            <b>Ascendant:</b> {report.birth.ascendant.sign}
          </p>

          <h3>Planets</h3>
          <ul>
            {report.planets.map((p: any) => (
              <li key={p.planet}>
                {p.planet}: {p.sign}, House {p.house}
              </li>
            ))}
          </ul>

          <h3>Aspects</h3>
          <ul>
            {report.aspects.map((a: any, i: number) => (
              <li key={i}>
                {a.between} ({a.type}, orb {a.orb}°)
              </li>
            ))}
          </ul>

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