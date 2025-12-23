export const runtime = "nodejs";
import { NextRequest } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { renderPdfHtml } from "@/lib/pdfTemplate";


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

  const pdfBytes = await page.pdf({
    format: "A4",
    margin: {
      top: "24mm",
      bottom: "24mm",
      left: "20mm",
      right: "20mm",
    },
  });

  await browser.close();

  // ✅ STREAM: Turbopack + TS + App Router safe
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(pdfBytes);
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="astrology-report.pdf"',
    },
  });
}
