import type { ReactNode } from 'react';

export function PageShell({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <header className="page-header">
        <div className="page-header-row">
          <div>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          {action}
        </div>
      </header>
      {children}
    </>
  );
}
