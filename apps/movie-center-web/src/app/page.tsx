'use client';
import { useRouter } from 'next/navigation';

export default function Index() {
  const router = useRouter();

  // Redirect to movie list page.
  router.push('/movies');

  return <></>;
}
