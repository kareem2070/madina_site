import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const LocationSchema = z.object({
  address: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const validatedData = LocationSchema.safeParse(data);

    if (!validatedData.success) {
      return NextResponse.json({ error: validatedData.error.flatten().fieldErrors }, { status: 400 });
    }

    const { address } = validatedData.data;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch location data from Google Maps' }, { status: 500 });
    }

    const locationData = await response.json();

    return NextResponse.json(locationData);
  } catch (error) {
    console.error("Error fetching location data:", error);
    return NextResponse.json({ error: 'Error fetching location data' }, { status: 500 });
  }
}