"use client";

import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { PlanFormData } from "../schemas/plan.schema";

export interface PlanFormFieldsProps {
  register: UseFormRegister<PlanFormData>;
  errors: FieldErrors<PlanFormData>;
  isUnlimitedProduct: boolean;
}

export function PlanFormFields({
  register,
  errors,
  isUnlimitedProduct,
}: PlanFormFieldsProps) {
  const inputCls =
    "w-full px-3 py-2 bg-admin-surface border border-admin-line rounded-[8px] focus:outline-hidden focus:border-admin-brand text-[13px]";

  return (
    <div className="grid grid-cols-2 gap-3.5">
      <div className="col-span-2">
        <label className="block font-semibold text-admin-text mb-1">
          Plan Name *
        </label>
        <input
          {...register("name")}
          placeholder="e.g. Starter, Pro, Enterprise"
          className={inputCls}
        />
        {errors.name && (
          <p className="text-admin-red text-[11px] mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block font-semibold text-admin-text mb-1">
          Price (৳ BDT) *
        </label>
        <input
          type="number"
          step="any"
          {...register("price")}
          className={inputCls}
        />
        {errors.price && (
          <p className="text-admin-red text-[11px] mt-1">
            {errors.price.message}
          </p>
        )}
      </div>

      <div>
        <label className="block font-semibold text-admin-text mb-1">
          Duration (Days) *
        </label>
        <input
          type="number"
          {...register("durationDays")}
          className={inputCls}
        />
        {errors.durationDays && (
          <p className="text-admin-red text-[11px] mt-1">
            {errors.durationDays.message}
          </p>
        )}
      </div>

      <div>
        <label className="block font-semibold text-admin-text mb-1">
          Product Limit
        </label>
        <input
          type="number"
          disabled={isUnlimitedProduct}
          {...register("productLimit")}
          className={`${inputCls} disabled:opacity-50`}
        />
      </div>

      <div className="flex items-center gap-2 pt-6">
        <input
          type="checkbox"
          id="unlimited-prod"
          {...register("isUnlimitedProduct")}
          className="w-4 h-4 rounded text-admin-brand accent-admin-brand cursor-pointer"
        />
        <label
          htmlFor="unlimited-prod"
          className="font-medium text-admin-text cursor-pointer"
        >
          Unlimited Products
        </label>
      </div>

      <div>
        <label className="block font-semibold text-admin-text mb-1">
          Staff Limit
        </label>
        <input type="number" {...register("staffLimit")} className={inputCls} />
      </div>

      <div>
        <label className="block font-semibold text-admin-text mb-1">
          Free Orders
        </label>
        <input type="number" {...register("freeOrders")} className={inputCls} />
      </div>

      <div>
        <label className="block font-semibold text-admin-text mb-1">
          Extra Rate (৳)
        </label>
        <input
          type="number"
          step="any"
          {...register("extraOrderRate")}
          className={inputCls}
        />
      </div>

      <div>
        <label className="block font-semibold text-admin-text mb-1">
          Landing Pages
        </label>
        <input
          type="number"
          {...register("maxLandingPages")}
          className={inputCls}
        />
      </div>

      <div className="col-span-2">
        <label className="block font-semibold text-admin-text mb-1">
          Features (comma separated tags)
        </label>
        <input
          {...register("featuresInput")}
          placeholder="online_store, basic_analytics, manual_orders"
          className={inputCls}
        />
      </div>
    </div>
  );
}
