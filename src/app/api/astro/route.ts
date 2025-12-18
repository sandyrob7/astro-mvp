import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(
    "https://sandyrob7-astro-engine.hf.space/calculate?year=1990&month=8&day=15&hour=10.5&lat=28.61&lon=77.2"
  );

  const astro = await res.json();

  return NextResponse.json({
    input: body,
    astro,
    source: "Swiss Ephemeris"
  });
}
