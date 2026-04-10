import { NextResponse } from "next/server";
import { addFavorite, listFavoriteIds } from "@/lib/favorites-store";
import { parseFavoritePostPayload } from "@/lib/runtime-validators";

export async function GET() {
  return NextResponse.json({ ids: listFavoriteIds() });
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  try {
    const body = parseFavoritePostPayload(payload);
    return NextResponse.json({ ids: addFavorite(body.id) }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Payload inválido. Informe o campo id." },
      { status: 400 }
    );
  }
}
