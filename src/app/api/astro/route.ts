import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  return NextResponse.json({
    status: "ok",
    input: body,
    result: {
      ascendant: "Virgo",
      moon: "Gemini",
      dasha: "Moon Mahadasha"
    }
  });
}
