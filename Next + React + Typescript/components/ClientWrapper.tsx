"use client";
import { ToastProvider, useToast } from "../hooks/useToast";
import { ToastContainer } from "./Toast";

function ToastDisplay() {
  const { toasts, removeToast } = useToast();
  return <ToastContainer toasts={toasts} onRemoveToast={removeToast} />;
}

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  return (
    <ToastProvider>
      {children}
      <ToastDisplay />
    </ToastProvider>
  );
}
