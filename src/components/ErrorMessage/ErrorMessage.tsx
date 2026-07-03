import type { ReactNode } from "react";

interface ErrorMessageProps {
  children?: ReactNode;
}

export default function ErrorMessage({ children }: ErrorMessageProps) {
  return (
    <p style={{ textAlign: "center", color: "red", margin: "10px 0" }}>
      {children || "Не вдалося завантажити нотатки. Спробуйте пізніше."}
    </p>
  );
}
