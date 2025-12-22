import { NextRequest } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { renderPdfHtml } from "@/lib/pdfTemplate";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const report = await req.json();

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  const page = await browser.newPage();

  await page.setContent(renderPdfHtml(report), {
    waitUntil: "networkidle0",
  });

  const pdfUint8 = await page.pdf({
    format: "A4",
    margin: {
      top: "24mm",
      bottom: "24mm",
      left: "20mm",
      right: "20mm",
    },
  });

  await browser.close();

  // ✅ THE ONLY RETURN TYPE NEXT.JS APP ROUTER NEVER ARGUES WITH
  const pdfBlob = new Blob([pdfUint8], {
    type: "application/pdf",
  });

  return new Response(pdfBlob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="astrology-report.pdf"',
    },
  });
}