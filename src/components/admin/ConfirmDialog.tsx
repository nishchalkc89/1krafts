import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => unknown;
}) {
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[calc(100%-2rem)] sm:w-full">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display text-xl font-normal text-[color:var(--walnut)]">{title}</AlertDialogTitle>
          {description && <AlertDialogDescription className="text-[color:var(--walnut-soft)]">{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="admin-btn-ghost mt-0 border-[color:var(--walnut)]/16 text-[color:var(--walnut)]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              confirm();
            }}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[color:var(--sindoor)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Deleting…" : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Small helper so callers don't have to hand-roll the "which item is pending
 * deletion" state every time — just call `ask(item)` from a delete button,
 * render `<Dialog />`, and pass a `remove(item)` to `onConfirm`. */
export function useConfirmDelete<T>() {
  const [pending, setPending] = useState<T | null>(null);
  return {
    pending,
    ask: (item: T) => setPending(item),
    clear: () => setPending(null),
  };
}
