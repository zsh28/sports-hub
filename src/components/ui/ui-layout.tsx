"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, Suspense, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { WalletButton } from "../solana/solana-provider";

export function UiLayout({
  children,
  links,
}: {
  children: ReactNode;
  links: { label: string; path: string }[];
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white max-w-[1920px] mx-auto">
      {/* Header */}
      <header className="bg-base-300 dark:text-neutral-content">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between py-4 space-y-2 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Link className="btn btn-ghost normal-case text-xl" href="/">
              <img
                src="/sportshub.webp"
                alt="SportsHub"
                className="h-24 w-24"
              />
            </Link>
            <ul className="menu menu-horizontal px-1 space-x-2">
              {links.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    className={pathname.startsWith(path) ? "active" : ""}
                    href={path}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-none">
            <WalletButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto p-4">
        <Suspense
          fallback={
            <div className="text-center my-32">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          }
        >
          {children}
        </Suspense>
        <Toaster position="bottom-right" />
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <aside className="text-center">
          <p>
            <a
              className="link hover:text-white"
              href="https://github.com/zsh28"
              target="_blank"
              rel="noopener noreferrer"
            >
              Developed by zsh28
            </a>
          </p>
        </aside>
      </footer>
    </div>
  );
}

export function AppModal({
  children,
  title,
  hide,
  show,
  submit,
  submitDisabled,
  submitLabel,
}: {
  children: ReactNode;
  title: string;
  hide: () => void;
  show: boolean;
  submit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialogRef.current) return;
    if (show) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [show]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box space-y-5">
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
        <div className="modal-action flex justify-end space-x-2">
          {submit && (
            <button
              className="btn btn-primary btn-md"
              onClick={submit}
              disabled={submitDisabled}
            >
              {submitLabel || "Save"}
            </button>
          )}
          <button onClick={hide} className="btn">
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}

export function AppHero({
  children,
  title,
  subtitle,
}: {
  children?: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
}) {
  return (
    <div className="hero py-5 text-center">
      <div className="hero-content text-center">
        <div className="max-w-2xl mx-auto">
          {typeof title === "string" ? (
            <h1 className="text-5xl font-bold">{title}</h1>
          ) : (
            title
          )}
          {typeof subtitle === "string" ? (
            <p className="py-6">{subtitle}</p>
          ) : (
            subtitle
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function ellipsify(str = "", len = 4) {
  if (str.length > 30) {
    return str.substring(0, len) + ".." + str.substring(str.length - len);
  }
  return str;
}

export function useTransactionToast() {
  return {
    showToast: (type: "success" | "error" | "info", message: string) => {
      if (type === "success") {
        toast.success(message);
      } else if (type === "error") {
        toast.error(message);
      } else {
        toast(message);
      }
    },
    showTransactionToast: (signature: string) => {
      toast.success(
        <div className="text-center">
          <div className="text-lg">Transaction sent</div>
        </div>
      );
    },
  };
}
