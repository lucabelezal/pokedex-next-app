import { beforeEach, describe, expect, it } from "vitest";
import { DELETE } from "@/app/api/favorites/[id]/route";
import { addFavorite, resetFavoritesStore } from "@/lib/favorites-store";

describe("/api/favorites/[id] route", () => {
  beforeEach(() => {
    resetFavoritesStore();
  });

  it("should return 400 when id param is invalid", async () => {
    const response = await DELETE(new Request("http://localhost/api/favorites/abc"), {
      params: Promise.resolve({ id: "abc" }),
    });

    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: "Id inválido." });
  });

  it("should remove favorite id when param is valid", async () => {
    addFavorite(25);
    addFavorite(150);

    const response = await DELETE(new Request("http://localhost/api/favorites/25"), {
      params: Promise.resolve({ id: "25" }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ids: [150] });
  });
});
