import { NextResponse } from "next/server";
import { removeFavorite } from "@/lib/favorites-store";
import { parseFavoriteIdParam } from "@/lib/runtime-validators";

type Params = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, { params }: Params) {
  const resolved = await params;
  try {
    const parsed = parseFavoriteIdParam(resolved.id);
    return NextResponse.json({ ids: removeFavorite(parsed) });
  } catch {
    return NextResponse.json({ error: "Id inválido." }, { status: 400 });
  }
}
