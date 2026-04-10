import { NextResponse } from "next/server";
import { removeFavorite } from "@/lib/favorites-store";

type Params = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, { params }: Params) {
  const resolved = await params;
  const parsed = Number(resolved.id);

  if (Number.isNaN(parsed)) {
    return NextResponse.json({ error: "Id inválido." }, { status: 400 });
  }

  return NextResponse.json({ ids: removeFavorite(parsed) });
}
