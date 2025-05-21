import type { ReactNode } from 'react';

interface PageTitleProps {
  title: string;
  description?: string | ReactNode;
  action?: ReactNode;
}

export function PageTitle({ title, description, action }: PageTitleProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="sm:ml-auto">{action}</div>}
    </div>
  );
}
