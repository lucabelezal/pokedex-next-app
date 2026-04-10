// @vitest-environment jsdom

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFavorites } from "@/hooks/use-favorites";

describe("useFavorites", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should load favorites on mount", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ids: [1, 25] }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.favoriteIds).toEqual([1, 25]);
    expect(result.current.error).toBeNull();
  });

  it("should set error when initial fetch fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ ids: [] }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Nao foi possivel carregar favoritos.");
  });

  it("should update favorites when toggling a non-favorite", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ids: [1] }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ids: [1, 25] }),
      });

    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useFavorites());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.toggleFavorite(25);
    });

    expect(result.current.favoriteIds).toEqual([1, 25]);
    expect(result.current.error).toBeNull();
  });
});
