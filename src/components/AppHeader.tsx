type AppHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionAriaLabel?: string;
};

export function AppHeader({ title, subtitle, actionLabel, onAction, actionAriaLabel }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="header-title">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actionLabel && onAction && (
        <button className="header-action-button" onClick={onAction} aria-label={actionAriaLabel ?? actionLabel}>
          {actionLabel}
        </button>
      )}
    </header>
  );
}
