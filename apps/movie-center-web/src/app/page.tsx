import { Suspense } from 'react';
import { MovieListComponent } from '@giron/feature-movie-list';

export default function Index() {
  return (
    <Suspense fallback={null}>
      <MovieListComponent />
    </Suspense>
  );
}
