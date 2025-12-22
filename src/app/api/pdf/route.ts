import { NextRequest } from "next/server";
import puppeteer from "puppeteer";
import { renderPdfHtml } from "@/lib/pdfTemplate";

export async function POST(req: NextRequest) {
  const report = await req.json();

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setContent(renderPdfHtml(report), {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "24mm",
      bottom: "24mm",
      left: "20mm",
      right: "20mm",
    },
  });

  await browser.close();

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="astrology-report.pdf"',
    },
  });
}
