import { describe, expect, it } from "vitest";
import {
  parseFavoriteIdParam,
  parseFavoriteIdsResponse,
  parseFavoritePostPayload,
} from "@/lib/runtime-validators";

describe("runtime-validators", () => {
  describe("parseFavoriteIdsResponse", () => {
    it("should return ids when response shape is valid", () => {
      const ids = parseFavoriteIdsResponse({ ids: [1, 7, 25] });

      expect(ids).toEqual([1, 7, 25]);
    });

    it("should throw when ids field is invalid", () => {
      expect(() => parseFavoriteIdsResponse({ ids: [1, "7"] })).toThrow(
        "Resposta invalida da API de favoritos."
      );
    });

    it("should throw when ids include non-positive integers", () => {
      expect(() => parseFavoriteIdsResponse({ ids: [1, -5] })).toThrow(
        "Resposta invalida da API de favoritos."
      );
    });
  });

  describe("parseFavoritePostPayload", () => {
    it("should return id when payload is valid", () => {
      const payload = parseFavoritePostPayload({ id: 25 });

      expect(payload).toEqual({ id: 25 });
    });

    it("should throw when payload has invalid id", () => {
      expect(() => parseFavoritePostPayload({ id: 0 })).toThrow(
        "Payload invalido. Informe um id numerico positivo."
      );
    });

    it("should throw when payload has decimal id", () => {
      expect(() => parseFavoritePostPayload({ id: 2.5 })).toThrow(
        "Payload invalido. Informe um id numerico positivo."
      );
    });
  });

  describe("parseFavoriteIdParam", () => {
    it("should parse valid id param", () => {
      const id = parseFavoriteIdParam("150");

      expect(id).toBe(150);
    });

    it("should throw when id param is invalid", () => {
      expect(() => parseFavoriteIdParam("abc")).toThrow(
        "Id invalido. Informe um id numerico positivo."
      );
    });
  });
});
