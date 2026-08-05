import { describe, expect, it } from "vitest";
import { getAllTypeMetadata, getTypeMetadata } from "@/lib/type-metadata";

describe("type-metadata", () => {
  describe("getTypeMetadata", () => {
    it("should return metadata for all 18 types", () => {
      const types = [
        "bug", "dark", "dragon", "electric", "fairy", "fighting",
        "fire", "flying", "ghost", "grass", "ground", "ice",
        "normal", "poison", "psychic", "rock", "steel", "water",
      ];

      for (const key of types) {
        const meta = getTypeMetadata(key);
        expect(meta.key).toBe(key);
        expect(meta.label).toBeTruthy();
        expect(meta.color).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(meta.textColor).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(meta.cardColor).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(meta.heroColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    });

    it("should return normal type as fallback for unknown key", () => {
      const meta = getTypeMetadata("nonexistent");

      expect(meta.key).toBe("normal");
      expect(meta.label).toBe("Normal");
    });

    it("should have PT-BR labels for all types", () => {
      expect(getTypeMetadata("water").label).toBe("Água");
      expect(getTypeMetadata("fire").label).toBe("Fogo");
      expect(getTypeMetadata("grass").label).toBe("Grama");
      expect(getTypeMetadata("electric").label).toBe("Elétrico");
      expect(getTypeMetadata("psychic").label).toBe("Psíquico");
      expect(getTypeMetadata("dragon").label).toBe("Dragão");
    });
  });

  describe("getAllTypeMetadata", () => {
    it("should return exactly 18 types", () => {
      const all = getAllTypeMetadata();
      expect(all).toHaveLength(18);
    });

    it("should return unique keys", () => {
      const all = getAllTypeMetadata();
      const keys = all.map((t) => t.key);
      expect(new Set(keys).size).toBe(18);
    });

    it("should include basic types", () => {
      const all = getAllTypeMetadata();
      const keys = all.map((t) => t.key);
      expect(keys).toContain("normal");
      expect(keys).toContain("water");
      expect(keys).toContain("grass");
      expect(keys).toContain("fire");
    });
  });
});
