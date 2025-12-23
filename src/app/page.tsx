"use client";

import { useState } from "react";

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validateForm(form: FormData) {
    const dob = new Date(form.get("dob") as string);
    const hour = Number(form.get("hour"));
    const minute = Number(form.get("minute"));

    const now = new Date();
    const oldest = new Date();
    oldest.setFullYear(now.getFullYear() - 110);

    if (dob > now) return "Date of birth cannot be in the future.";
    if (dob < oldest) return "Date of birth cannot be older than 110 years.";

    if (hour < 0 || hour > 23) return "Hour must be between 0 and 23.";
    if (minute < 0 || minute > 59) return "Minute must be between 0 and 59.";

    return null;
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const validationError = validateForm(form);

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const res = await fetch("/api/astro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        gender: form.get("gender"),
        dob: form.get("dob"),
        hour: Number(form.get("hour")),
        minute: Number(form.get("minute")),
        place: form.get("place"),
      }),
    });

    const json = await res.json();
    setData(json);
    setReport(json);
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
        padding: 20,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#020617",
          border: "1px solid #1e293b",
          borderRadius: 12,
          padding: 24,
          color: "#e5e7eb",
        }}
      >
        <h2 style={{ fontSize: 22, marginBottom: 6 }}>
          Astrology Demo
        </h2>
        <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>
          Accurate birth chart calculation
        </p>

        <form onSubmit={submit}>
          <label style={labelStyle}>Name</label>
          <input name="name" required style={inputStyle} />

          <label style={labelStyle}>Gender</label>
          <select name="gender" required style={inputStyle}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <label style={labelStyle}>Date of Birth</label>
          <input type="date" name="dob" required style={inputStyle} />

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Hour (0–23)</label>
              <input
                type="number"
                name="hour"
                min={0}
                max={23}
                required
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Minute (0–59)</label>
              <input
                type="number"
                name="minute"
                min={0}
                max={59}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <label style={labelStyle}>Place of Birth</label>
          <input name="place" required style={inputStyle} />

          {error && (
            <p style={{ color: "#f87171", marginTop: 10 }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              marginTop: 18,
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
            {loading ? "Generating…" : "Generate Report"}
          </button>
        </form>

        {data && (
          <>
            <div
              style={{
                marginTop: 20,
                paddingTop: 12,
                borderTop: "1px solid #1e293b",
                fontSize: 13,
                color: "#cbd5f5",
              }}
            >
              Chart generated successfully.
            </div>

            <button
              onClick={() => downloadPdf(report)}
              style={{
                marginTop: 14,
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

const labelStyle = {
  display: "block",
  fontSize: 12,
  marginTop: 12,
  marginBottom: 4,
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
