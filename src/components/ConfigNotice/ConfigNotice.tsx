import { TriangleAlertIcon } from 'lucide-react';

import type { ConfigIssue } from '@/types/schedule';

const NOTICE_TITLE = 'Não foi possível abrir o link por completo';

export function ConfigNotice({ issues }: { issues: ConfigIssue[] }) {
  if (issues.length === 0) return null;
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm"
    >
      <TriangleAlertIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-destructive" />
      <div className="flex flex-col gap-1">
        <p className="font-medium">{NOTICE_TITLE}</p>
        <ul className="flex flex-col gap-1">
          {issues.map((issue) => (
            <li key={`${issue.code}:${issue.field ?? ''}`}>{issue.message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
