// app/api/playlists/[id]/tracks/route.ts
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const res = await fetch(
      `http://127.0.0.1:5000/api/playlists/${id}/tracks`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json([], { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json([], { status: 200 });
  }
}
