import { MovieDetailsComponent } from '@giron/feature-movie';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const movieId = parseInt(slug, 10);

  return !isNaN(movieId) ? (
    <MovieDetailsComponent movieId={movieId} />
  ) : (
    <div>Filmen kan inte hittas.</div>
  );
}
