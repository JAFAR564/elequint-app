import { ThemeToggle } from "@/components/ui/curtain-theme-toggle";

export default function Demo() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen gap-6 bg-neutral-100 dark:bg-neutral-900">
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Click the button to see the curtain animation.
      </p>

      {/* Icon variant — needs a dark surface so the cream button reads clearly */}
      <div className="bg-neutral-900 dark:bg-neutral-800 p-5 rounded-2xl shadow-xl border border-white/10 flex flex-col items-center gap-3">
        <span className="text-xs text-neutral-500 uppercase tracking-widest">icon variant</span>
        <ThemeToggle variant="icon" defaultTheme="light" duration={600} />
      </div>

      {/* Default variant — full bar with hanging button */}
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700">
        <ThemeToggle variant="default" defaultTheme="light" duration={600}>
          <div className="flex items-center justify-center h-24 text-sm opacity-50">
            Page content goes here
          </div>
        </ThemeToggle>
      </div>
    </div>
  );
}
