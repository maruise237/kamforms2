import { describe, expect, it } from "vitest";
import {
  createDefaultFieldV2,
  createDefaultFormSchemaV2,
  fieldTypesP0V2,
  formSchemaV2Schema,
  generateZodSchemaV2,
  migrateFormSchemaV1ToV2,
  normalizeFormSchemaV2,
} from "./schema";

describe("Kamforms V2 schema", () => {
  it("creates a stable schema contract with safe defaults", () => {
    const schema = createDefaultFormSchemaV2({
      title: "Demande de devis",
      description: "Collecte les informations client",
    });

    expect(schema.version).toBe(2);
    expect(schema.title).toBe("Demande de devis");
    expect(schema.description).toBe("Collecte les informations client");
    expect(schema.settings.mode).toBe("single_page");
    expect(schema.settings.submitLabel).toBe("Envoyer");
    expect(schema.pages).toEqual([{ id: "page-1", fields: [] }]);
    expect(formSchemaV2Schema.safeParse(schema).success).toBe(true);
  });

  it("defines a default field for every P0 field type", () => {
    for (const type of fieldTypesP0V2) {
      const field = createDefaultFieldV2(type);

      expect(field.type).toBe(type);
      expect(field.id).toMatch(new RegExp(`^${type}-`));
      expect(field.label.length).toBeGreaterThan(0);
      expect(field.ui?.width).toBe("full");
    }
  });

  it("generates Zod validation for required P0 fields", () => {
    const zodSchema = generateZodSchemaV2(
      createDefaultFormSchemaV2({
        title: "Inscription",
        pages: [
          {
            id: "page-1",
            fields: [
              {
                ...createDefaultFieldV2("email", { id: "email", label: "Email" }),
                required: true,
              },
              {
                ...createDefaultFieldV2("multi_select", {
                  id: "services",
                  label: "Services",
                }),
                required: true,
                options: [
                  { label: "Site web", value: "site-web" },
                  { label: "WhatsApp", value: "whatsapp" },
                ],
                validation: { minSelected: 2 },
              },
              {
                ...createDefaultFieldV2("rating", {
                  id: "satisfaction",
                  label: "Satisfaction",
                }),
                required: true,
                validation: { min: 1, max: 5 },
              },
            ],
          },
        ],
      })
    );

    expect(
      zodSchema.safeParse({
        email: "client@example.com",
        services: ["site-web", "whatsapp"],
        satisfaction: 5,
      }).success
    ).toBe(true);

    expect(
      zodSchema.safeParse({
        email: "client",
        services: ["site-web"],
        satisfaction: 6,
      }).success
    ).toBe(false);
  });

  it("normalizes AI output into a valid schema instead of trusting raw JSON", () => {
    const normalized = normalizeFormSchemaV2({
      version: 2,
      title: "Contact",
      settings: { mode: "multi_step" },
      pages: [
        {
          title: "Coordonnees",
          fields: [
            { type: "email", label: "Votre email", required: true },
            { type: "unknown", label: "Sujet" },
          ],
        },
      ],
    });

    expect(normalized.settings.mode).toBe("multi_step");
    expect(normalized.pages[0]?.id).toMatch(/^page-/);
    expect(normalized.pages[0]?.fields[0]?.id).toMatch(/^email-/);
    expect(normalized.pages[0]?.fields[1]?.type).toBe("short_text");
    expect(formSchemaV2Schema.safeParse(normalized).success).toBe(true);
  });

  it("migrates Kamforms V1 fields into pages without losing options", () => {
    const migrated = migrateFormSchemaV1ToV2({
      fields: [
        { id: "name", type: "text", label: "Nom", required: true },
        { id: "message", type: "textarea", label: "Message", required: false, step: 2 },
        {
          id: "offer",
          type: "select",
          label: "Offre",
          required: true,
          options: ["Starter", "Pro"],
        },
      ],
      steps: [{ title: "Profil" }, { title: "Projet" }],
    });

    expect(migrated.version).toBe(2);
    expect(migrated.settings.mode).toBe("multi_step");
    expect(migrated.pages).toHaveLength(2);
    expect(migrated.pages[0]?.fields[0]?.type).toBe("short_text");
    expect(migrated.pages[0]?.fields[1]?.options).toEqual([
      { label: "Starter", value: "Starter" },
      { label: "Pro", value: "Pro" },
    ]);
    expect(migrated.pages[1]?.fields[0]?.type).toBe("long_text");
  });
});
