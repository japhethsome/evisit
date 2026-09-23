import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color: "primary" | "success" | "warning" | "info";
  trend?: string;
}

const colorMap = {
  primary: {
    bg: "var(--color-primary-muted)",
    icon: "var(--color-primary-hover)",
    border: "rgba(99, 102, 241, 0.2)",
  },
  success: {
    bg: "var(--color-success-muted)",
    icon: "var(--color-success)",
    border: "rgba(16, 185, 129, 0.2)",
  },
  warning: {
    bg: "var(--color-warning-muted)",
    icon: "var(--color-warning)",
    border: "rgba(245, 158, 11, 0.2)",
  },
  info: {
    bg: "var(--color-info-muted)",
    icon: "var(--color-info)",
    border: "rgba(59, 130, 246, 0.2)",
  },
};

export default function StatsCard({
  label,
  value,
  icon: Icon,
  color,
  trend,
}: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className="glass-card animate-fade-in-up"
      style={{ padding: "20px 24px" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "var(--color-text-secondary)",
              marginBottom: 8,
            }}
          >
            {label}
          </p>
          <p
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "var(--color-text-primary)",
              lineHeight: 1,
            }}
          >
            {value}
          </p>
          {trend && (
            <p
              style={{
                fontSize: 12,
                color: "var(--color-text-muted)",
                marginTop: 6,
              }}
            >
              {trend}
            </p>
          )}
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: colors.bg,
            border: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={20} color={colors.icon} />
        </div>
      </div>
    </div>
  );
}
