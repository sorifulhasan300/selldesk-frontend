import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type LogoVariant = "full" | "icon";
export type LogoMode = "auto" | "light" | "dark";
export type LogoSize = "sm" | "md" | "lg" | "xl" | "custom";

export interface LogoProps {
  /**
   * 'full': Complete horizontal brand logo with typography
   * 'icon': Square brand icon mark
   * @default 'full'
   */
  variant?: LogoVariant;

  /**
   * 'auto': Uses CSS classes to seamlessly toggle between light and dark modes (0 CLS / 0 hydration mismatch)
   * 'light': Always renders the dark-text logo (for light backgrounds)
   * 'dark': Always renders the white-text logo (for dark backgrounds or dark footers)
   * @default 'auto'
   */
  mode?: LogoMode;

  /**
   * Predefined sizing presets
   * @default 'md'
   */
  size?: LogoSize;

  /**
   * Whether to wrap the logo in a Next.js Link component
   * @default true
   */
  asLink?: boolean;

  /**
   * Destination URL when asLink is true
   * @default '/'
   */
  href?: string;

  /**
   * Prioritize image loading for above-the-fold content (Navbar / Header LCP optimization)
   * @default false
   */
  priority?: boolean;

  /**
   * Optional manual width override for Next.js Image
   */
  width?: number;

  /**
   * Optional manual height override for Next.js Image
   */
  height?: number;

  /**
   * Additional classes for the container or link wrapper
   */
  className?: string;

  /**
   * Additional classes applied directly to the image elements
   */
  imageClassName?: string;

  /**
   * Image alt text
   * @default 'SellDesk'
   */
  alt?: string;

  /**
   * Optional click handler (e.g., closing mobile drawer on navigation)
   */
  onClick?: () => void;
}

const FULL_SIZE_CLASSES: Record<LogoSize, string> = {
  sm: "h-6",
  md: "h-8",
  lg: "h-10",
  xl: "h-12",
  custom: "",
};

const ICON_SIZE_CLASSES: Record<LogoSize, string> = {
  sm: "size-6",
  md: "size-8",
  lg: "size-10",
  xl: "size-12",
  custom: "",
};

/**
 * Reusable SellDesk Brand Logo Component
 * Supports light/dark mode auto-switching, full brand or square icon variants,
 * pre-scaled responsive sizes, and seamless Link wrapping.
 */
export function Logo({
  variant = "full",
  mode = "auto",
  size = "md",
  asLink = true,
  href = "/",
  priority = false,
  width,
  height,
  className,
  imageClassName,
  alt = "SellDesk",
  onClick,
}: LogoProps) {
  const isIcon = variant === "icon";
  const sizeClass = isIcon ? ICON_SIZE_CLASSES[size] : FULL_SIZE_CLASSES[size];

  const renderIcon = () => (
    <Image
      src="/brand/logo-icon.jpg"
      alt={alt}
      width={width ?? 128}
      height={height ?? 128}
      priority={priority}
      className={cn(
        sizeClass,
        "rounded-lg object-contain shrink-0",
        imageClassName,
      )}
    />
  );

  const renderFullLight = () => (
    <Image
      src="/brand/logo-dark.png"
      alt={alt}
      width={width ?? 288}
      height={height ?? 54}
      priority={priority}
      className={cn(
        sizeClass,
        "w-auto object-contain shrink-0",
        imageClassName,
      )}
    />
  );

  const renderFullDark = () => (
    <Image
      src="/brand/logo-white.png"
      alt={alt}
      width={width ?? 288}
      height={height ?? 54}
      priority={priority}
      className={cn(
        sizeClass,
        "w-auto object-contain shrink-0",
        imageClassName,
      )}
    />
  );

  const renderFullAuto = () => (
    <>
      <Image
        src="/brand/logo-dark.png"
        alt={alt}
        width={width ?? 288}
        height={height ?? 54}
        priority={priority}
        className={cn(
          sizeClass,
          "w-auto object-contain shrink-0 dark:hidden",
          imageClassName,
        )}
      />
      <Image
        src="/brand/logo-white.png"
        alt={alt}
        width={width ?? 288}
        height={height ?? 54}
        priority={priority}
        className={cn(
          sizeClass,
          "hidden w-auto object-contain shrink-0 dark:block",
          imageClassName,
        )}
      />
    </>
  );

  const content = (
    <>
      {isIcon
        ? renderIcon()
        : mode === "light"
          ? renderFullLight()
          : mode === "dark"
            ? renderFullDark()
            : renderFullAuto()}
    </>
  );

  if (asLink) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "inline-flex items-center select-none transition-opacity hover:opacity-90 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md",
          className,
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn("inline-flex items-center select-none", className)}
    >
      {content}
    </div>
  );
}
