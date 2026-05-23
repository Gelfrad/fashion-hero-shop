"use client";

interface PrintButtonProps {
  label?: string;
  className?: string;
}

export function PrintButton({ label = "Drukuj / Zapisz PDF", className }: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={
        className ??
        "hidden md:inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.5px] px-5 py-3 rounded bg-charcoal text-white hover:bg-charcoal-light transition-colors"
      }
    >
      ⎙ {label}
    </button>
  );
}
