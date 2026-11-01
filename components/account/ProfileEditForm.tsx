"use client";

import React, { useState, useRef, useEffect, useActionState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { updateProfileAction, syncSessionUserAction } from "@/app/actions/customer.actions";
import { ActionState } from "@/lib/auth/types";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils/cn";

export interface ProfileEditFormProps {
  user: {
    id: string;
    name?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
    role?: string;
  };
}

/**
 * Modern luxury profile editor for Saayal Stories.
 * Supports direct avatar file upload to Cloudinary (up to 10MB) or image URL,
 * first/last name separation matching backend schema, and interactive 3D GSAP micro-animations.
 */
export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ user }) => {
  const [state, formAction, isPending] = useActionState<ActionState | null, FormData>(
    updateProfileAction,
    null
  );
  const router = useRouter();

  // Sync fresh profile details to session on initial mount if available from backend
  useEffect(() => {
    if (user.avatarUrl || user.name) {
      syncSessionUserAction({
        name: user.name || undefined,
        avatarUrl: user.avatarUrl || undefined,
        phone: user.phone || undefined,
      });
    }
  }, [user.avatarUrl, user.name, user.phone]);

  // Refresh router cache when profile is successfully saved so Header and Layout reflect changes immediately
  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state?.success, router]);

  // Split name for backend firstName & lastName validation
  const nameParts = (user.name || "").trim().split(/\s+/);
  const initialFirstName = user.firstName || nameParts[0] || "";
  const initialLastName = user.lastName || nameParts.slice(1).join(" ") || "";

  // Avatar state
  const [avatarMode, setAvatarMode] = useState<"file" | "url">("file");
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.avatarUrl || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  // 3D Avatar tilt refs
  const avatarCardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setClientError("File size exceeds 10MB limit. Please select a smaller photo.");
      e.target.value = "";
      return;
    }

    // Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setClientError("Invalid file type. Please select a JPEG, PNG, WEBP, or GIF image.");
      e.target.value = "";
      return;
    }

    setFileName(file.name);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClientError(null);
    const url = e.target.value.trim();
    setPreviewUrl(url || user.avatarUrl || null);
  };

  const handleClearAvatar = () => {
    setClientError(null);
    setFileName(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 3D Card Hover Perspective Tilt
  const handleAvatarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = avatarCardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    gsap.to(el, {
      rotateX,
      rotateY,
      transformPerspective: 800,
      duration: 0.25,
      ease: "power1.out",
      overwrite: "auto",
    });
  };

  const handleAvatarMouseLeave = () => {
    const el = avatarCardRef.current;
    if (!el) return;

    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  return (
    <div className="w-full">
      {/* Success Notification */}
      {state?.success && state?.message && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 p-4 rounded-xl border border-emerald-200 bg-emerald-50/80 text-emerald-800 text-sm flex items-start gap-3 shadow-2xs"
        >
          <svg className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
          <p className="font-medium">{state.message}</p>
        </div>
      )}

      {/* Client Validation Error */}
      {clientError && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-6 p-4 rounded-xl border border-rose-200 bg-rose-50/80 text-rose-800 text-sm flex items-start gap-3 shadow-2xs"
        >
          <svg className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
          <p className="font-medium">{clientError}</p>
        </div>
      )}

      {/* Server Error Notification */}
      {state?.message && !state.success && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-6 p-4 rounded-xl border border-rose-200 bg-rose-50/80 text-rose-800 text-sm flex items-start gap-3 shadow-2xs"
        >
          <svg className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-semibold">{state.message}</p>
          </div>
        </div>
      )}

      {/* Standard React 19 Server Action form (no explicit encType to avoid override warnings) */}
      <form action={formAction} className="space-y-8">
        {/* 1. 3D Avatar Profile Showcase & Uploader */}
        <div className="p-5 sm:p-6 rounded-2xl bg-surface-soft/60 border border-border/80 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* 3D Floating Avatar Circle */}
          <div
            ref={avatarCardRef}
            onMouseMove={handleAvatarMouseMove}
            onMouseLeave={handleAvatarMouseLeave}
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-accent/40 shadow-md overflow-hidden shrink-0 group [perspective:800px] cursor-pointer bg-surface-card flex items-center justify-center"
            onClick={() => {
              if (avatarMode === "file") {
                fileInputRef.current?.click();
              }
            }}
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={user.name || "Customer avatar"}
                fill
                sizes="112px"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            ) : (
              <span className="text-2xl sm:text-3xl font-serif font-bold text-primary">
                {user.name ? user.name.slice(0, 2).toUpperCase() : "SS"}
              </span>
            )}

            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-semibold tracking-wider uppercase">
              <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Change</span>
            </div>
          </div>

          {/* Avatar Options & Controls */}
          <div className="flex-1 w-full space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-serif font-bold text-primary">
                  Profile Portrait
                </h4>
                <p className="text-xs text-text-secondary mt-0.5">
                  Upload an image file directly (saved to Cloudinary, max 10MB) or enter an image URL.
                </p>
              </div>

              {/* Toggle Mode */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-card border border-border shrink-0 self-start">
                <button
                  type="button"
                  onClick={() => {
                    setAvatarMode("file");
                    setClientError(null);
                  }}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all",
                    avatarMode === "file"
                      ? "bg-primary text-primary-contrast shadow-xs"
                      : "text-text-secondary hover:text-primary"
                  )}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAvatarMode("url");
                    setClientError(null);
                  }}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-semibold tracking-wide transition-all",
                    avatarMode === "url"
                      ? "bg-primary text-primary-contrast shadow-xs"
                      : "text-text-secondary hover:text-primary"
                  )}
                >
                  Image URL
                </button>
              </div>
            </div>

            {/* Mode 1: File Upload */}
            {avatarMode === "file" ? (
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isPending}
                    className="px-4 py-2 rounded-xl border border-border bg-surface-card hover:border-accent text-xs font-semibold text-text-main transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Choose Photo</span>
                  </button>
                  <span className="text-xs text-text-muted truncate max-w-xs">
                    {fileName ? fileName : "Max 10MB (JPEG, PNG, WEBP, GIF)"}
                  </span>
                  {(fileName || previewUrl) && (
                    <button
                      type="button"
                      onClick={handleClearAvatar}
                      className="text-xs text-text-muted hover:text-rose-600 transition-colors underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Mode 2: Image URL */
              <div className="space-y-1">
                <Input
                  id="avatarUrl"
                  name="avatarUrl"
                  type="url"
                  label=""
                  placeholder="https://res.cloudinary.com/.../image.jpg"
                  defaultValue={user.avatarUrl || ""}
                  onChange={handleUrlChange}
                  disabled={isPending}
                  startIcon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* 2. First Name & Last Name (Required by Backend) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="firstName"
            name="firstName"
            type="text"
            label="First Name"
            required
            defaultValue={initialFirstName}
            disabled={isPending}
            error={state?.errors?.firstName?.[0]}
            startIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />

          <Input
            id="lastName"
            name="lastName"
            type="text"
            label="Last Name"
            required
            defaultValue={initialLastName}
            disabled={isPending}
            error={state?.errors?.lastName?.[0]}
            startIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
        </div>

        {/* 3. Email & Phone (Required / Optional) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            required
            defaultValue={user.email || ""}
            disabled={isPending}
            error={state?.errors?.email?.[0]}
            startIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />

          <Input
            id="phone"
            name="phone"
            type="tel"
            label="Phone Number"
            optional
            defaultValue={user.phone || ""}
            placeholder="+91 98765 43210"
            disabled={isPending}
            error={state?.errors?.phone?.[0]}
            hint="Format: +91 98765 43210 (7-20 digits)"
            startIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="py-3 px-7 rounded-xl bg-primary hover:bg-primary-hover text-primary-contrast font-medium text-xs uppercase tracking-widest transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer flex items-center gap-2.5 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <svg className="animate-spin w-4 h-4 text-current" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Profile Details</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm;
