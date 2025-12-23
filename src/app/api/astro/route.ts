import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/astro
 * Body:
 * {
 *   name: string
 *   gender: string
 *   dob: string (YYYY-MM-DD)
 *   hour: number (0–23)
 *   minute: number (0–59)
 *   place: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      gender,
      dob,
      hour,
      minute,
      place,
    } = body;

    // ---- Basic validation ----
    if (
      !name ||
      !gender ||
      !dob ||
      hour === undefined ||
      minute === undefined ||
      !place
    ) {
      return NextResponse.json(
        { errors: ["Missing required fields"] },
        { status: 400 }
      );
    }

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return NextResponse.json(
        { errors: ["Invalid time provided"] },
        { status: 400 }
      );
    }

    // ---- Parse DOB ----
    const [year, month, day] = dob.split("-").map(Number);

    if (!year || !month || !day) {
      return NextResponse.json(
        { errors: ["Invalid date format"] },
        { status: 400 }
      );
    }

    // ---- Geocode place → lat/lon ----
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        place
      )}`,
      {
        headers: {
          "User-Agent": "astro-mvp/1.0",
        },
      }
    );

    const geoJson = await geoRes.json();

    if (!geoJson || geoJson.length === 0) {
      return NextResponse.json(
        { errors: ["Location not found"] },
        { status: 400 }
      );
    }

    const lat = parseFloat(geoJson[0].lat);
    const lon = parseFloat(geoJson[0].lon);

    // ---- Call Hugging Face Astro Engine ----
    const hfUrl =
      "https://sandyrob7-astro-engine.hf.space/v1/calculate" +
      `?name=${encodeURIComponent(name)}` +
      `&gender=${encodeURIComponent(gender)}` +
      `&year=${year}` +
      `&month=${month}` +
      `&day=${day}` +
      `&hour=${hour}` +
      `&minute=${minute}` +
      `&lat=${lat}` +
      `&lon=${lon}`;

    const hfRes = await fetch(hfUrl);
    const hfJson = await hfRes.json();

    return NextResponse.json({
      input: {
        name,
        gender,
        dob,
        hour,
        minute,
        place,
        lat,
        lon,
      },
      ...hfJson,
    });
  } catch (err) {
    return NextResponse.json(
      { errors: ["Internal server error"] },
      { status: 500 }
    );
  }
}
