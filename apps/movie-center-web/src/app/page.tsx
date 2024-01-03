'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  // Wrapping the automatic redirect inside an effect hook. Otherwise the pre-build check will fail.
  useEffect(() => {
    // Redirect to movie list page.
    router.push('/movies');
  }, []);

  return <></>;
}
