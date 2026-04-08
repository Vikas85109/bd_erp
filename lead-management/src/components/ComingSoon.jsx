import { Construction } from 'lucide-react';

export default function ComingSoon({ title = 'Module' }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">{title}</h1>
        <p className="text-sm text-surface-muted mt-1">This page is under development</p>
      </div>

      <div className="rounded-2xl border border-surface-border bg-white px-6 py-16">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-bg mb-5">
            <Construction className="h-8 w-8 text-secondary-800" />
          </div>
          <h2 className="text-lg font-semibold text-secondary-900">Coming Soon</h2>
          <p className="mt-2 max-w-md text-sm text-surface-muted">
            This module is currently being developed. Check back soon for updates.
          </p>
        </div>
      </div>
    </div>
  );
}
