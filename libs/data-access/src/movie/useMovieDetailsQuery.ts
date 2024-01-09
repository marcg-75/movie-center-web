import { IMovie } from '@giron/shared-models';
import { getBackendClient } from '@giron/shared-data-access-api-client';
import { useQuery } from '@tanstack/react-query';
import { transformToInnerModel } from '@giron/shared-util-helpers';

const PATH_PREFIX = 'movie';

export const useMovieDetailsQuery = <T>(
  select: (data: IMovie) => T,
  movieId: number
) => {
  const client = getBackendClient();

  return useQuery(
    ['movie', movieId],
    async () => {
      return await client.get<IMovie>(`${PATH_PREFIX}/${movieId}`);
    },
    {
      select: (data) => select(transformToInnerModel(data)),
      enabled: !!movieId && movieId !== 0,
    }
  );
};
