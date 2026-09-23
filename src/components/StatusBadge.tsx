import type { VisitorStatus } from "@/lib/visitors";

interface StatusBadgeProps {
  status: VisitorStatus;
}

const config: Record<VisitorStatus, { label: string; style: React.CSSProperties; dot: string }> = {
  "checked-in": {
    label: "Checked In",
    style: {
      background: "var(--color-success-muted)",
      color: "var(--color-success)",
      border: "1px solid rgba(16, 185, 129, 0.25)",
    },
    dot: "var(--color-success)",
  },
  "checked-out": {
    label: "Checked Out",
    style: {
      background: "var(--color-surface-3)",
      color: "var(--color-text-muted)",
      border: "1px solid var(--color-border)",
    },
    dot: "var(--color-text-muted)",
  },
  expected: {
    label: "Expected",
    style: {
      background: "var(--color-info-muted)",
      color: "var(--color-info)",
      border: "1px solid rgba(59, 130, 246, 0.25)",
    },
    dot: "var(--color-info)",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, style, dot } = config[status];
  return (
    <span
      style={{
        ...style,
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "12px",
        fontWeight: 500,
        padding: "4px 10px",
        borderRadius: "99px",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: dot,
          flexShrink: 0,
          ...(status === "checked-in"
            ? { animation: "pulse-glow 2s ease infinite" }
            : {}),
        }}
      />
      {label}
    </span>
  );
}
