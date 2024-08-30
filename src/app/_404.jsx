// app/404.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">Page Not Found</p>
      <Link href="/" className="mt-6 text-blue-600 hover:underline">
        Go back to Home
      </Link>
    </div>
  );
}
