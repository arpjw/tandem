
import { Handshake } from 'lucide-react'; // Changed icon
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <Handshake className="h-7 w-7 text-primary" /> {/* Changed icon */}
      <span className="text-xl font-semibold text-primary">SubConnect</span>
    </Link>
  );
}
