import type { ReactNode } from 'react';
import { requireAdminPageAccess } from '@/lib/ait/access';

export default async function AdminAitLayout({ children }: { children: ReactNode }) {
  await requireAdminPageAccess();
  return children;
}