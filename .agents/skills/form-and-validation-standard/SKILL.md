---
name: form-and-validation-standard
description: Comprehensive standards for React Hook Form, Zod v4 validation, dynamic useFieldArray variant lists, backend validation error mapping, and form performance in SellDesk. Use whenever creating or modifying forms, Zod schemas, input components, or validation logic.
---

# 📝 Form & Validation Standard Skill (SellDesk Frontend)

In **SellDesk**, forms handle complex e-commerce operations: multi-attribute product variants, tiered wholesale pricing, zone-based delivery charge rules, and staff permissions.

Naively built forms cause serious UX issues: full-page lag on every keystroke, unmapped backend validation errors leaving users confused, and type mismatches (`string` vs `number` from `<input type="number" />`).

This skill establishes the standard for **high-performance, type-safe form management using React Hook Form + Zod v4**.

---

## 1. The Core Architecture Stack

- **Form State:** `react-hook-form` (v7+)
- **Schema Validation:** `zod` (v4+)
- **Resolver Bridge:** `@hookform/resolvers/zod`
- **UI Feedback:** Radix / Shadcn form primitives + `sonner` toasts

---

## 2. Dynamic Field Arrays (`useFieldArray`) for Product Variants

Product forms require adding arbitrary variants (e.g. Size, Color, Material) with independent prices, stock quantities, and SKUs.

> [!TIP]
> **Performance Golden Rule:** Never inline `fields.map()` with form inputs directly in the main form component!
> Every keystroke inside a row re-renders the whole form. **Always extract each array row into a dedicated memoized row component.**

### Dedicated Row Component Pattern:

```typescript
// features/products/components/ProductVariantRow.tsx
import React from "react";
import { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { ProductFormValues } from "../schemas/product.schema";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface VariantRowProps {
  index: number;
  register: UseFormRegister<ProductFormValues>;
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  onRemove: (index: number) => void;
}

export const ProductVariantRow: React.FC<VariantRowProps> = React.memo(
  ({ index, register, errors, onRemove }) => {
    const rowErrors = errors.variants?.[index];

    return (
      <div className="grid grid-cols-12 gap-3 items-start p-3 bg-neutral-50 rounded-lg border border-neutral-200">
        <div className="col-span-4">
          <input
            {...register(`variants.${index}.name`)}
            placeholder="e.g. Red / XL"
            className="w-full px-3 py-2 text-sm rounded-md border border-neutral-300"
          />
          {rowErrors?.name && (
            <span className="text-xs text-rose-500 mt-1 block">{rowErrors.name.message}</span>
          )}
        </div>

        <div className="col-span-3">
          <input
            type="number"
            {...register(`variants.${index}.price`)}
            placeholder="Price (BDT)"
            className="w-full px-3 py-2 text-sm rounded-md border border-neutral-300"
          />
          {rowErrors?.price && (
            <span className="text-xs text-rose-500 mt-1 block">{rowErrors.price.message}</span>
          )}
        </div>

        <div className="col-span-3">
          <input
            type="number"
            {...register(`variants.${index}.stock`)}
            placeholder="Stock Qty"
            className="w-full px-3 py-2 text-sm rounded-md border border-neutral-300"
          />
          {rowErrors?.stock && (
            <span className="text-xs text-rose-500 mt-1 block">{rowErrors.stock.message}</span>
          )}
        </div>

        <div className="col-span-2 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="text-neutral-400 hover:text-rose-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }
);

ProductVariantRow.displayName = "ProductVariantRow";
```

### Parent Form Usage:

```typescript
// features/products/components/ProductVariantSection.tsx
import { useFieldArray, Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { ProductFormValues } from "../schemas/product.schema";
import { ProductVariantRow } from "./ProductVariantRow";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const ProductVariantSection = ({
  control,
  register,
  errors,
}: {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-neutral-800">Product Variants</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: "", price: 0, stock: 0 })}
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Variant
        </Button>
      </div>

      {fields.map((field, index) => (
        <ProductVariantRow
          key={field.id} // ⭐ Always use field.id, never array index!
          index={index}
          register={register}
          control={control}
          errors={errors}
          onRemove={remove}
        />
      ))}
    </div>
  );
};
```

---

## 3. Backend Error to Form Field Mapping

When NestJS backend validation (`ValidationPipe`) throws a `400 Bad Request`, it returns field constraints. The frontend must map these directly to the respective inputs instead of showing a generic toast.

### Universal Error Mapper (`lib/form-errors.ts`)

```typescript
import { UseFormSetError, FieldValues, Path } from "react-hook-form";

export interface BackendValidationError {
  property?: string;
  field?: string;
  message: string | string[];
}

export function handleFormServerErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  error: any,
) {
  const response = error?.response?.data;
  if (!response) return;

  // 1. NestJS standard validation array: message: ["name must be longer...", "price must be positive"]
  if (Array.isArray(response.message)) {
    response.message.forEach((msg: string) => {
      // Extract field name from string e.g. "regularPrice must be a number"
      const firstWord = msg.split(" ")[0] as Path<T>;
      setError(firstWord, {
        type: "server",
        message: msg,
      });
    });
    return;
  }

  // 2. Structured errors array: [{ field: "phone", message: "Phone already in use" }]
  if (Array.isArray(response.errors)) {
    response.errors.forEach((err: BackendValidationError) => {
      const field = (err.field || err.property) as Path<T>;
      const message = Array.isArray(err.message) ? err.message[0] : err.message;
      if (field) {
        setError(field, { type: "server", message });
      }
    });
  }
}
```

---

## 4. Zod v4 Coercion & Domain Validators

`<input type="number" />` produces string values in DOM events. In Zod v4, always coerce numbers:

```typescript
// features/products/schemas/product.schema.ts
import { z } from "zod";

export const bdPhoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
export const subdomainRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createProductSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(120),
    description: z.string().optional(),

    // Coercion ensures string from number input becomes a real JS number
    regularPrice: z.coerce
      .number()
      .positive("Regular price must be greater than 0"),
    discountPrice: z.coerce
      .number()
      .nonnegative("Discount price cannot be negative")
      .optional(),
    stockQuantity: z.coerce
      .number()
      .int("Stock must be an integer")
      .min(0, "Stock cannot be negative"),

    categoryId: z.string().uuid("Invalid category selected"),
    brandId: z.string().uuid("Invalid brand selected").optional(),

    variants: z
      .array(
        z.object({
          name: z.string().min(1, "Variant name is required"),
          price: z.coerce.number().positive("Variant price must be positive"),
          stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
        }),
      )
      .default([]),
  })
  .refine(
    (data) => {
      if (
        data.discountPrice !== undefined &&
        data.discountPrice > data.regularPrice
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Discount price cannot exceed regular price",
      path: ["discountPrice"],
    },
  );

export type ProductFormValues = z.infer<typeof createProductSchema>;
```

---

## 5. Form UX & Submission Standard

Every production form in SellDesk must follow this submission flow:

```typescript
// features/products/components/ProductForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, ProductFormValues } from "../schemas/product.schema";
import { handleFormServerErrors } from "@/lib/form-errors";
import { toast } from "sonner";

export const ProductForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      regularPrice: 0,
      stockQuantity: 1,
      variants: [],
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      await createProductApi(values);
      toast.success("Product created successfully!");
      onSuccess();
    } catch (error: any) {
      handleFormServerErrors(form.setError, error);
      toast.error(error.response?.data?.message || "Failed to create product");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Inputs with form.register and field-level error messages */}
      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full py-2.5 px-4 rounded-lg bg-neutral-900 text-white font-medium disabled:opacity-50"
      >
        {form.formState.isSubmitting ? "Saving..." : "Create Product"}
      </button>
    </form>
  );
};
```

---

## 6. Form & Validation Checklist

- [ ] **Number Coercion:** All numeric inputs use `z.coerce.number()` to avoid string/number bugs.
- [ ] **Field Array Performance:** Rows in `useFieldArray` are extracted into memoized sub-components.
- [ ] **Stable Key:** Field arrays use `key={field.id}`, never `key={index}`.
- [ ] **Backend Error Mapping:** 400 validation errors from NestJS map directly to input fields with `handleFormServerErrors`.
- [ ] **Cross-field Validation:** Price comparisons (`discountPrice <= regularPrice`) use `.refine()`.
- [ ] **Disabled on Submit:** Submit button disables and indicates loading while `isSubmitting` is true.
