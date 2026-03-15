import { JSX } from "react";
import {
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiActivity,
} from "react-icons/fi";

interface DashboardCardProps {
  tab: {
    key: string;
    label: string;
    value: string | number;
  };
  activeTab: string;
  onClick: () => void;
}

/* ================= ICON MAP ================= */
const ICON_MAP: Record<string, JSX.Element> = {
  orders: <FiShoppingBag />,
  users: <FiUsers />,
  revenue: <FiDollarSign />,
  activity: <FiActivity />,
  wallet: <FiDollarSign />,
  account: <FiUsers />,
  query: <FiActivity />,
};

export default function DashboardCard({
  tab,
  activeTab,
  onClick,
}: DashboardCardProps) {
  const isActive = activeTab === tab.key;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className={`group p-5 rounded-2xl cursor-pointer border
                  transition-all duration-300
                  active:scale-[0.98]
                  shadow-sm hover:shadow-lg
        ${isActive
          ? "border-[var(--accent)] bg-[var(--card)]"
          : "border-[var(--border)] bg-[var(--card)]/60 hover:bg-[var(--card)]"
        }`}
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">
          {tab.label}
        </p>

        <div
          className={`p-2 rounded-xl text-lg transition
            ${isActive
              ? "bg-[var(--accent)]/15 text-[var(--accent)]"
              : "bg-black/10 text-[var(--muted)] group-hover:text-[var(--accent)]"
            }`}
        >
          {ICON_MAP[tab.key] || <FiActivity />}
        </div>
      </div>

      {/* ================= VALUE ================= */}
      <h2 className="text-2xl font-bold mt-3 tracking-tight">
        {tab.value}
      </h2>

      {/* ================= ACTIVE INDICATOR ================= */}
      {isActive && (
        <div className="mt-3 h-1 w-10 rounded-full bg-[var(--accent)]" />
      )}
    </div>
  );
}
