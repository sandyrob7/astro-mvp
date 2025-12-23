"use client";

import { useState } from "react";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

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
    setReport(json); // still temporary
    setLoading(false);
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
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#020617",
          border: "1px solid #1e293b",
          borderRadius: 12,
          padding: 24,
          color: "#e5e7eb",
        }}
      >
        <h2 style={{ fontSize: 22, marginBottom: 4 }}>
          Astrology Demo
        </h2>
        <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>
          Birth chart generation preview
        </p>

        <form onSubmit={submit}>
          <label style={labelStyle}>Name</label>
          <input name="name" required style={inputStyle} />

          <label style={labelStyle}>Date of Birth</label>
          <input type="date" name="dob" required style={inputStyle} />

          <label style={labelStyle}>Place of Birth</label>
          <input name="place" required style={inputStyle} />

          <button
            type="submit"
            style={{
              marginTop: 16,
              width: "100%",
              padding: "10px 0",
              background: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </form>

        {data && (
          <>
            <div
              style={{
                marginTop: 24,
                paddingTop: 16,
                borderTop: "1px solid #1e293b",
                fontSize: 13,
                color: "#cbd5f5",
              }}
            >
              <b>Chart generated successfully.</b>
            </div>

            <button
              onClick={() => downloadPdf(report)}
              style={{
                marginTop: 16,
                width: "100%",
                padding: "10px 0",
                background: "#16a34a",
                color: "white",
                border: "none",
                borderRadius: 6,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Download PDF
            </button>
          </>
        )}
      </div>
    </main>
  );
}

/* ---------- styles ---------- */

const labelStyle = {
  display: "block",
  fontSize: 12,
  marginBottom: 4,
  marginTop: 12,
  color: "#cbd5f5",
};

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #334155",
  background: "#020617",
  color: "#e5e7eb",
};
