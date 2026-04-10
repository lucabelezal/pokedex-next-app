import { NextResponse } from "next/server";
import { addFavorite, listFavoriteIds } from "@/lib/favorites-store";

export async function GET() {
  return NextResponse.json({ ids: listFavoriteIds() });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { id?: number } | null;

  if (!body?.id || Number.isNaN(body.id)) {
    return NextResponse.json(
      { error: "Payload inválido. Informe o campo id." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ids: addFavorite(body.id) }, { status: 201 });
}
