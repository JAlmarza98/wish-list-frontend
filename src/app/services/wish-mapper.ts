import { Wish } from '@components/list/list.component';
import { environment } from '@envs/environment';

interface RawWish {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  image_path: string | null;
  created_at: string;
  reserved_at?: string | null;
  reserved_by_username?: string | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function mapWish(raw: RawWish): Wish {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? '',
    url: raw.url ?? '',
    image: raw.image_path ? `${environment.apiUrl}/uploads/${raw.image_path}` : undefined,
    date: formatDate(raw.created_at),
    reserved: raw.reserved_by_username
      ? { reservedBy: raw.reserved_by_username, date: formatDate(raw.reserved_at!) }
      : undefined,
  };
}
