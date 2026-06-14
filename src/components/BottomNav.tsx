import type { PageKey } from "../types/navigation";

type BottomNavProps = {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
};

const items: Array<{ page: PageKey; label: string; icon: string }> = [
  { page: "home", label: "首頁", icon: "⌂" },
  { page: "articleNode", label: "法條", icon: "§" },
  { page: "conceptMap", label: "考法", icon: "◎" },
  { page: "favorites", label: "收藏", icon: "☆" },
];

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="主要導覽">
      {items.map((item) => (
        <button key={item.page} className={currentPage === item.page ? "active" : ""} onClick={() => onNavigate(item.page)}>
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
