import { beforeEach, describe, expect, it } from "vitest";
import { GET, POST } from "@/app/api/favorites/route";
import { resetFavoritesStore } from "@/lib/favorites-store";

describe("/api/favorites route", () => {
  beforeEach(() => {
    resetFavoritesStore();
  });

  it("should return empty ids list when store is empty", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ ids: [] });
  });

  it("should return 400 when post payload is invalid", async () => {
    const request = new Request("http://localhost/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "abc" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: "Payload inválido. Informe o campo id." });
  });

  it("should add id and return 201 when payload is valid", async () => {
    const request = new Request("http://localhost/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: 25 }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toEqual({ ids: [25] });
  });
});
