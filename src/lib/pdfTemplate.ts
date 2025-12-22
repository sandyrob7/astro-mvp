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
    }
    h1 { font-size: 26px; }
    h2 { font-size: 18px; margin-top: 40px; }
    h3 { font-size: 14px; margin-top: 20px; }

    .section { margin-bottom: 30px; }
    .muted { color: #555; }
    .line { border-top: 1px solid #ccc; margin: 20px 0; }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    td {
      padding: 6px 4px;
      border-bottom: 1px solid #ddd;
    }
  </style>
</head>

<body>

  <div class="section" style="text-align:center;">
    <h1>${report.cover.title}</h1>
    <p class="muted">For ${report.cover.name}</p>
    <div class="line"></div>
    <p class="muted">
      Generated on ${new Date(report.cover.generated_at).toDateString()}<br/>
      Zodiac: ${report.cover.chart_system.zodiac} |
      Houses: ${report.cover.chart_system.houses}
    </p>
  </div>

  <div class="section">
    <h2>Birth Data</h2>
    <table>
      <tr><td>Date</td><td>${report.birth_data.date?.year}-${report.birth_data.date?.month}-${report.birth_data.date?.day}</td></tr>
      <tr><td>Time</td><td>${report.birth_data.time?.hour}:${report.birth_data.time?.minute}</td></tr>
      <tr><td>Ascendant</td><td>${report.birth_data.ascendant.sign}</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Planetary Placements</h2>
    ${report.planetary_placements.map((p: any) => `
      <h3>${p.planet.toUpperCase()} in ${p.sign} (House ${p.house})</h3>
      <p>${p.interpretation}</p>
    `).join("")}
  </div>

  <div class="section">
    <h2>Aspects</h2>
    ${report.aspects.map((a: any) => `
      <h3>${a.title}</h3>
      <p class="muted">Orb: ${a.orb}°</p>
      <p>${a.interpretation}</p>
    `).join("")}
  </div>

  <div class="section">
    <h2>Notes</h2>
    <p class="muted">
      Astrology describes tendencies, not certainties.
      Free will plays an important role.
    </p>
  </div>

</body>
</html>
`;
}
