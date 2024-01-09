import { MovieDetailsComponent } from '@giron/feature-movie';

export default function Page({ params }: { params: { slug: string } }) {
  const movieId = parseInt(params.slug, 10);

  return !isNaN(movieId) ? (
    <MovieDetailsComponent movieId={movieId} />
  ) : (
    <div>Filmen kan inte hittas.</div>
  );
}
