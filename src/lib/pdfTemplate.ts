export function renderPdfHtml(report: any) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      color: #111;
    }

    h1, h2, h3 {
      font-family: Georgia, serif;
      margin-bottom: 6px;
    }

    h1 { font-size: 26px; }
    h2 { font-size: 18px; margin-top: 36px; }
    h3 { font-size: 14px; margin-top: 18px; }

    .section { margin-bottom: 30px; }
    .muted { color: #555; }
    .line {
      border-top: 1px solid #ccc;
      margin: 20px 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    td {
      padding: 6px 4px;
      vertical-align: top;
    }

    .label {
      color: #555;
      width: 35%;
    }
  </style>
</head>

<body>

  <!-- COVER -->
  <div class="section" style="text-align:center;">
    <h1>Birth Chart Analysis</h1>
    <p class="muted">For ${report.meta.name}</p>
    <div class="line"></div>
    <p class="muted">
      Generated on ${new Date(report.meta.generated_at).toDateString()}<br/>
      Report Version: ${report.report_version}
    </p>
  </div>

  <!-- BIRTH DATA -->
  <div class="section">
    <h2>Birth Data</h2>
    <table>
      <tr>
        <td class="label">Date of Birth</td>
        <td>${report.birth.dob}</td>
      </tr>
      <tr>
        <td class="label">Time of Birth</td>
        <td>${String(report.birth.time.hour).padStart(2, "0")}:${String(
          report.birth.time.minute
        ).padStart(2, "0")}</td>
      </tr>
      <tr>
        <td class="label">Place of Birth</td>
        <td>${report.birth.place}</td>
      </tr>
      <tr>
        <td class="label">Latitude</td>
        <td>${report.birth.latitude}</td>
      </tr>
      <tr>
        <td class="label">Longitude</td>
        <td>${report.birth.longitude}</td>
      </tr>
      <tr>
        <td class="label">Gender</td>
        <td>${report.meta.gender}</td>
      </tr>
    </table>
  </div>

  <!-- PLANETS -->
  <div class="section">
    <h2>Planetary Positions</h2>
    ${report.planets
      .map(
        (p: any) => `
      <h3>${p.planet.toUpperCase()} in ${p.sign}</h3>
      <p class="muted">Longitude: ${p.longitude.toFixed(2)}°</p>
    `
      )
      .join("")}
  </div>

  <!-- ASPECTS -->
  <div class="section">
    <h2>Planetary Aspects</h2>
    ${report.aspects.length === 0
      ? `<p class="muted">No major aspects detected.</p>`
      : report.aspects
          .map(
            (a: any) => `
        <h3>${a.between}</h3>
        <p class="muted">
          Aspect: ${a.type} &nbsp;|&nbsp; Orb: ${a.orb}°
        </p>
      `
          )
          .join("")}
  </div>

  <!-- NOTES -->
  <div class="section">
    <h2>Notes</h2>
    <p class="muted">
      Astrology describes tendencies and patterns, not fixed outcomes.
      Interpretations should be considered alongside free will and personal judgment.
    </p>
  </div>

  <div class="section" style="text-align:center;">
    <p class="muted">— End of Report —</p>
  </div>

</body>
</html>
`;
}
