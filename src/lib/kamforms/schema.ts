import { z } from "zod";

export const fieldTypesP0V2 = [
  "short_text",
  "long_text",
  "email",
  "phone",
  "number",
  "select",
  "radio",
  "checkbox",
  "checkbox_group",
  "multi_select",
  "date",
  "file_upload",
  "rating",
] as const;

export const fieldTypesP1V2 = [
  "url",
  "password",
  "tags",
  "time",
  "datetime",
  "slider",
  "hidden",
  "section_title",
  "consent",
  "address",
  "signature",
] as const;

export const fieldTypeV2Schema = z.enum([...fieldTypesP0V2, ...fieldTypesP1V2]);

export const fieldOptionV2Schema = z.object({
  label: z.string(),
  value: z.string(),
});

export const fieldValidationV2Schema = z.object({
  minLength: z.number().int().nonnegative().optional(),
  maxLength: z.number().int().positive().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  customMessage: z.string().optional(),
  acceptedFileTypes: z.array(z.string()).optional(),
  maxFileSizeMb: z.number().positive().optional(),
  minSelected: z.number().int().nonnegative().optional(),
  maxSelected: z.number().int().positive().optional(),
});

export const fieldUiOptionsV2Schema = z.object({
  width: z.enum(["full", "half", "third"]).default("full"),
  visibility: z.enum(["visible", "hidden", "conditional"]).default("visible"),
  adminOnly: z.boolean().default(false),
});

export const conditionalRuleV2Schema = z.object({
  sourceFieldId: z.string(),
  operator: z.enum([
    "equals",
    "not_equals",
    "contains",
    "not_empty",
    "empty",
    "greater_than",
    "less_than",
  ]),
  value: z.unknown().optional(),
  action: z.enum(["show", "hide", "require", "skip_to_page"]),
  targetPageId: z.string().optional(),
});

export const formFieldV2Schema = z.object({
  id: z.string(),
  type: fieldTypeV2Schema,
  label: z.string(),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  defaultValue: z.unknown().optional(),
  options: z.array(fieldOptionV2Schema).optional(),
  validation: fieldValidationV2Schema.optional(),
  ui: fieldUiOptionsV2Schema.optional(),
  conditional: z.array(conditionalRuleV2Schema).optional(),
});

export const formPageV2Schema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  fields: z.array(formFieldV2Schema),
});

export const formSettingsV2Schema = z.object({
  mode: z.enum(["single_page", "multi_step"]),
  submitLabel: z.string(),
  successMessage: z.string(),
  redirectUrl: z.string().url().optional(),
  collectIp: z.boolean().optional(),
  allowMultipleSubmissions: z.boolean().optional(),
  notifications: z.object({
    enabled: z.boolean().optional(),
    email: z.boolean().optional(),
    recipientEmail: z.string().email().optional(),
    whatsapp: z.boolean().optional(),
    whatsappTo: z.string().optional(),
    webhook: z.boolean().optional(),
    webhookUrl: z.string().url().optional(),
    autoresponder: z.boolean().optional(),
    autoresponderFieldId: z.string().optional(),
    dailyDigest: z.boolean().optional(),
  }),
  theme: z.object({
    primaryColor: z.string().optional(),
    backgroundColor: z.string().optional(),
    font: z.string().optional(),
    radius: z.enum(["none", "sm", "md", "lg"]).optional(),
  }),
});

export const formSchemaV2Schema = z.object({
  version: z.literal(2),
  title: z.string(),
  description: z.string().optional(),
  settings: formSettingsV2Schema,
  pages: z.array(formPageV2Schema),
});

export type FieldTypeV2 = z.infer<typeof fieldTypeV2Schema>;
export type FieldOptionV2 = z.infer<typeof fieldOptionV2Schema>;
export type FieldValidationV2 = z.infer<typeof fieldValidationV2Schema>;
export type FieldUiOptionsV2 = z.infer<typeof fieldUiOptionsV2Schema>;
export type ConditionalRuleV2 = z.infer<typeof conditionalRuleV2Schema>;
export type FormFieldV2 = z.infer<typeof formFieldV2Schema>;
export type FormPageV2 = z.infer<typeof formPageV2Schema>;
export type FormSettingsV2 = z.infer<typeof formSettingsV2Schema>;
export type FormSchemaV2 = z.infer<typeof formSchemaV2Schema>;

export type FormSchemaV1 = {
  fields: Array<{
    id: string;
    type: string;
    label: string;
    description?: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
    condition?: {
      fieldId: string;
      value: string;
    };
    step?: number;
  }>;
  steps?: Array<{ title: string }>;
};

const defaultSettingsV2: FormSettingsV2 = {
  mode: "single_page",
  submitLabel: "Envoyer",
  successMessage: "Merci, votre reponse a bien ete envoyee.",
  collectIp: false,
  allowMultipleSubmissions: true,
  notifications: {
    enabled: true,
    email: true,
    recipientEmail: undefined,
    whatsapp: true,
    whatsappTo: undefined,
    webhook: false,
    webhookUrl: undefined,
    autoresponder: false,
    autoresponderFieldId: undefined,
    dailyDigest: false,
  },
  theme: {
    radius: "md",
  },
};

const defaultLabelsV2: Record<FieldTypeV2, string> = {
  short_text: "Texte court",
  long_text: "Texte long",
  email: "Email",
  phone: "Telephone",
  number: "Nombre",
  select: "Selection",
  radio: "Choix unique",
  checkbox: "Case a cocher",
  checkbox_group: "Choix multiples",
  multi_select: "Selection multiple",
  date: "Date",
  file_upload: "Fichier",
  rating: "Note",
  url: "URL",
  password: "Mot de passe",
  tags: "Tags",
  time: "Heure",
  datetime: "Date et heure",
  slider: "Curseur",
  hidden: "Champ cache",
  section_title: "Section",
  consent: "Consentement",
  address: "Adresse",
  signature: "Signature",
};

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function isFieldTypeV2(type: unknown): type is FieldTypeV2 {
  return typeof type === "string" && fieldTypeV2Schema.safeParse(type).success;
}

function normalizeOptions(options: unknown): FieldOptionV2[] | undefined {
  if (!Array.isArray(options)) return undefined;

  const normalized = options
    .map((option) => {
      if (typeof option === "string") return { label: option, value: option };
      if (!option || typeof option !== "object") return null;
      const raw = option as Record<string, unknown>;
      const label = String(raw.label ?? raw.value ?? "").trim();
      const value = String(raw.value ?? raw.label ?? "").trim();
      return label && value ? { label, value } : null;
    })
    .filter((option): option is FieldOptionV2 => option !== null);

  return normalized.length > 0 ? normalized : undefined;
}

export function createDefaultFieldV2(
  type: FieldTypeV2,
  overrides: Partial<FormFieldV2> = {}
): FormFieldV2 {
  const optionTypes = new Set<FieldTypeV2>([
    "select",
    "radio",
    "checkbox_group",
    "multi_select",
  ]);

  return {
    id: overrides.id ?? makeId(type),
    type,
    label: overrides.label ?? defaultLabelsV2[type],
    description: overrides.description,
    placeholder: overrides.placeholder,
    required: overrides.required ?? false,
    defaultValue: overrides.defaultValue,
    options:
      overrides.options ??
      (optionTypes.has(type) ? [{ label: "Option 1", value: "option-1" }] : undefined),
    validation: overrides.validation,
    ui: {
      width: "full",
      visibility: "visible",
      adminOnly: false,
      ...overrides.ui,
    },
    conditional: overrides.conditional,
  };
}

export function createDefaultFormSchemaV2(
  overrides: Partial<Omit<FormSchemaV2, "version" | "settings" | "pages">> & {
    settings?: Partial<FormSettingsV2>;
    pages?: FormPageV2[];
  } = {}
): FormSchemaV2 {
  return {
    version: 2,
    title: overrides.title ?? "Nouveau formulaire",
    description: overrides.description,
    settings: {
      ...defaultSettingsV2,
      ...overrides.settings,
      notifications: {
        ...defaultSettingsV2.notifications,
        ...overrides.settings?.notifications,
      },
      theme: {
        ...defaultSettingsV2.theme,
        ...overrides.settings?.theme,
      },
    },
    pages: overrides.pages ?? [{ id: "page-1", fields: [] }],
  };
}

export function normalizeFormSchemaV2(input: unknown): FormSchemaV2 {
  if (!input || typeof input !== "object") return createDefaultFormSchemaV2();

  const raw = input as Record<string, unknown>;
  const rawSettings =
    raw.settings && typeof raw.settings === "object"
      ? (raw.settings as Partial<FormSettingsV2>)
      : {};
  const rawPages = Array.isArray(raw.pages) ? raw.pages : [];

  const pages = rawPages.map((page): FormPageV2 => {
    const rawPage = page && typeof page === "object" ? (page as Record<string, unknown>) : {};
    const rawFields = Array.isArray(rawPage.fields) ? rawPage.fields : [];

    return {
      id: typeof rawPage.id === "string" && rawPage.id ? rawPage.id : makeId("page"),
      title: typeof rawPage.title === "string" ? rawPage.title : undefined,
      description: typeof rawPage.description === "string" ? rawPage.description : undefined,
      fields: rawFields.map((field, index) => {
        const rawField =
          field && typeof field === "object" ? (field as Record<string, unknown>) : {};
        const type = isFieldTypeV2(rawField.type) ? rawField.type : "short_text";
        return createDefaultFieldV2(type, {
          id: typeof rawField.id === "string" && rawField.id ? rawField.id : makeId(type),
          label:
            typeof rawField.label === "string" && rawField.label
              ? rawField.label
              : `Champ ${index + 1}`,
          description: typeof rawField.description === "string" ? rawField.description : undefined,
          placeholder: typeof rawField.placeholder === "string" ? rawField.placeholder : undefined,
          required: rawField.required === true,
          defaultValue: rawField.defaultValue,
          options: normalizeOptions(rawField.options),
          validation: fieldValidationV2Schema.safeParse(rawField.validation).success
            ? fieldValidationV2Schema.parse(rawField.validation)
            : undefined,
          ui: fieldUiOptionsV2Schema.partial().safeParse(rawField.ui).success
            ? fieldUiOptionsV2Schema.parse({
                width: "full",
                visibility: "visible",
                adminOnly: false,
                ...(rawField.ui as object),
              })
            : undefined,
          conditional: z.array(conditionalRuleV2Schema).safeParse(rawField.conditional).success
            ? z.array(conditionalRuleV2Schema).parse(rawField.conditional)
            : undefined,
        });
      }),
    };
  });

  return createDefaultFormSchemaV2({
    title: typeof raw.title === "string" && raw.title ? raw.title : "Nouveau formulaire",
    description: typeof raw.description === "string" ? raw.description : undefined,
    settings: {
      mode: rawSettings.mode === "multi_step" ? "multi_step" : "single_page",
      submitLabel:
        typeof rawSettings.submitLabel === "string"
          ? rawSettings.submitLabel
          : defaultSettingsV2.submitLabel,
      successMessage:
        typeof rawSettings.successMessage === "string"
          ? rawSettings.successMessage
          : defaultSettingsV2.successMessage,
      redirectUrl: typeof rawSettings.redirectUrl === "string" ? rawSettings.redirectUrl : undefined,
      collectIp: rawSettings.collectIp,
      allowMultipleSubmissions: rawSettings.allowMultipleSubmissions,
      notifications: rawSettings.notifications,
      theme: rawSettings.theme,
    },
    pages: pages.length > 0 ? pages : [{ id: "page-1", fields: [] }],
  });
}

function mapV1FieldTypeToV2(type: string): FieldTypeV2 {
  const mapping: Record<string, FieldTypeV2> = {
    text: "short_text",
    email: "email",
    phone: "phone",
    number: "number",
    textarea: "long_text",
    select: "select",
    radio: "radio",
    checkbox: "checkbox",
    date: "date",
    rating: "rating",
  };
  return mapping[type] ?? "short_text";
}

export function migrateFormSchemaV1ToV2(schema: FormSchemaV1): FormSchemaV2 {
  const hasSteps =
    (schema.steps?.length ?? 0) > 0 || schema.fields.some((field) => field.step !== undefined);
  const stepList = hasSteps ? schema.steps ?? [{ title: "Etape 1" }] : [{ title: undefined }];

  const pages = stepList.map((step, index): FormPageV2 => ({
    id: `page-${index + 1}`,
    title: step.title,
    fields: schema.fields
      .filter((field) => (hasSteps ? field.step ?? 1 : 1) === index + 1)
      .map((field) =>
        createDefaultFieldV2(mapV1FieldTypeToV2(field.type), {
          id: field.id,
          label: field.label,
          description: field.description,
          placeholder: field.placeholder,
          required: field.required,
          options: normalizeOptions(field.options),
          conditional: field.condition
            ? [
                {
                  sourceFieldId: field.condition.fieldId,
                  operator: "equals",
                  value: field.condition.value,
                  action: "show",
                },
              ]
            : undefined,
        })
      ),
  }));

  return createDefaultFormSchemaV2({
    title: "Formulaire migre",
    settings: { mode: hasSteps ? "multi_step" : "single_page" },
    pages,
  });
}

function optionalWhenEmpty(schema: z.ZodTypeAny) {
  return z.preprocess((value) => (value === "" ? undefined : value), schema.optional());
}

function applyStringValidation(base: z.ZodString, field: FormFieldV2) {
  let schema = base;
  const validation = field.validation;
  if (field.required) schema = schema.min(1, `${field.label} est requis`);
  if (validation?.minLength !== undefined) {
    schema = schema.min(validation.minLength, validation.customMessage);
  }
  if (validation?.maxLength !== undefined) {
    schema = schema.max(validation.maxLength, validation.customMessage);
  }
  if (validation?.pattern) {
    schema = schema.regex(new RegExp(validation.pattern), validation.customMessage);
  }
  return field.required ? schema : optionalWhenEmpty(schema);
}

function fieldToZodV2(field: FormFieldV2): z.ZodTypeAny {
  const validation = field.validation;

  switch (field.type) {
    case "email":
      return applyStringValidation(z.string().email("Email invalide"), field);
    case "url":
      return applyStringValidation(z.string().url("URL invalide"), field);
    case "short_text":
    case "long_text":
    case "phone":
    case "password":
    case "time":
    case "datetime":
    case "hidden":
    case "address":
    case "signature":
      return applyStringValidation(z.string(), field);
    case "number":
    case "rating":
    case "slider": {
      let schema = z.coerce.number({
        error: `${field.label} doit etre un nombre`,
      });
      if (validation?.min !== undefined) schema = schema.min(validation.min, validation.customMessage);
      if (validation?.max !== undefined) schema = schema.max(validation.max, validation.customMessage);
      return field.required ? schema : optionalWhenEmpty(schema);
    }
    case "checkbox":
    case "consent":
      return field.required
        ? z.literal(true, {
            error: `${field.label} est requis`,
          })
        : z.boolean().optional();
    case "select":
    case "radio":
    case "date":
      return field.required
        ? z.string().min(1, `${field.label} est requis`)
        : optionalWhenEmpty(z.string());
    case "checkbox_group":
    case "multi_select":
    case "tags": {
      let schema = z.array(z.string());
      if (field.required) schema = schema.min(validation?.minSelected ?? 1, `${field.label} est requis`);
      if (validation?.minSelected !== undefined) {
        schema = schema.min(validation.minSelected, validation.customMessage);
      }
      if (validation?.maxSelected !== undefined) {
        schema = schema.max(validation.maxSelected, validation.customMessage);
      }
      return field.required ? schema : schema.optional();
    }
    case "file_upload": {
      const schema = z.union([
        z.string().min(1),
        z.array(z.unknown()).min(1),
        z.record(z.string(), z.unknown()),
      ]);
      return field.required ? schema : schema.optional();
    }
    case "section_title":
      return z.unknown().optional();
    default:
      return z.unknown().optional();
  }
}

export function generateZodSchemaV2(
  schema: FormSchemaV2
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {
    _honeypot: z.string().optional(),
  };

  for (const page of schema.pages) {
    for (const field of page.fields) {
      if (field.type === "section_title") continue;
      if (field.ui?.adminOnly || field.ui?.visibility === "hidden") continue;
      shape[field.id] = fieldToZodV2(field);
    }
  }

  return z.object(shape);
}

export function isFormSchemaV2(schema: unknown): schema is FormSchemaV2 {
  return formSchemaV2Schema.safeParse(schema).success;
}
