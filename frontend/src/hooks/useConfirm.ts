import { useState } from "react";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "warning" | "info";
}

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: "",
    message: "",
  });
  const [onConfirmCallback, setOnConfirmCallback] = useState<() => Promise<void>>(() => async () => {});

  function confirm(opts: ConfirmOptions, callback: () => Promise<void>) {
    setOptions(opts);
    setOnConfirmCallback(() => callback);
    setIsOpen(true);
  }

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirmCallback();
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setIsOpen(false);
  }

  return {
    isOpen,
    loading,
    options,
    confirm,
    handleConfirm,
    handleCancel,
  };
}