export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div>Movie {params.slug}</div>
  )
};
