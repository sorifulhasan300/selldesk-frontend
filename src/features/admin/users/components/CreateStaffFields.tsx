"use client";

import React from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { CreateStaffFormData } from "../schemas/admin-users.schemas";

export interface CreateStaffFieldsProps {
  register: UseFormRegister<CreateStaffFormData>;
  errors: FieldErrors<CreateStaffFormData>;
}

export function CreateStaffFields({
  register,
  errors,
}: CreateStaffFieldsProps) {
  const inputCls =
    "w-full px-3 py-2 bg-admin-surface border border-admin-line rounded-[8px] text-[13px] text-admin-text focus:outline-hidden focus:border-admin-brand transition-colors";

  return (
    <>
      <div>
        <label className="block text-[13px] font-semibold text-admin-text mb-1">
          Full Name *
        </label>
        <input
          type="text"
          {...register("name")}
          placeholder="e.g. Alice Smith"
          className={inputCls}
        />
        {errors.name && (
          <p className="text-admin-red text-[11px] mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-admin-text mb-1">
          Email Address *
        </label>
        <input
          type="email"
          {...register("email")}
          placeholder="e.g. staff@selldesk.com"
          className={inputCls}
        />
        {errors.email && (
          <p className="text-admin-red text-[11px] mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-admin-text mb-1">
          Temporary Password *
        </label>
        <input
          type="password"
          {...register("password")}
          placeholder="Minimum 6 characters"
          className={inputCls}
        />
        {errors.password && (
          <p className="text-admin-red text-[11px] mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-[13px] font-semibold text-admin-text mb-1">
          Staff Role *
        </label>
        <select {...register("role")} className={inputCls}>
          <option value="SUPER_STAFF">Super Staff (Platform Operations)</option>
          <option value="SUPER_ADMIN">
            Super Admin (Full Platform Control)
          </option>
        </select>
        {errors.role && (
          <p className="text-admin-red text-[11px] mt-1">
            {errors.role.message}
          </p>
        )}
      </div>
    </>
  );
}
