// src/components/SonnerToastProvider.jsx
import React from "react";
import { Toaster, toast } from "sonner";

// Esse componente envolve sua aplicação e exibe o Toaster (a área onde os toasts aparecem)
export function SonnerToastProvider({ children }) {
  return (
    <>
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
}

// Funções auxiliares para disparar notificações de forma padronizada

// Dispara uma notificação de sucesso
export function showSuccess(message) {
  toast.success(message);
}

// Dispara uma notificação de erro
export function showError(message) {
  toast.error(message);
}

// Exporta também a função toast para uso customizado, se necessário
export { toast };
