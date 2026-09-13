"use client";

import React from "react";
import { Toaster as Sonner, ToasterProps } from "sonner";

export interface ToastProviderProps extends ToasterProps {
  children?: React.ReactNode;
}

/**
 * ToastProvider
 * Configures Sonner with SellDesk's design system tokens and CSS variables.
 * Can be used as a standalone Toaster or as a wrapper component around layout children.
 */
export function ToastProvider({ children, ...props }: ToastProviderProps) {
  return (
    <>
      {children}
      <Sonner
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl font-sans",
            description: "group-[.toast]:text-muted-foreground",
            actionButton:
              "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-medium text-xs px-3 py-1.5 rounded-md transition-colors",
            cancelButton:
              "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-medium text-xs px-3 py-1.5 rounded-md transition-colors",
            success:
              "group-[.toaster]:text-foreground group-[.toaster]:border-border",
            error:
              "group-[.toaster]:text-destructive group-[.toaster]:border-destructive/20",
            warning:
              "group-[.toaster]:text-amber-600 dark:group-[.toaster]:text-amber-400 group-[.toaster]:border-amber-500/20",
            info: "group-[.toaster]:text-primary group-[.toaster]:border-primary/20",
          },
        }}
        position="top-right"
        richColors
        closeButton
        duration={4000}
        {...props}
      />
    </>
  );
}

export { toast } from "sonner";
export default ToastProvider;
