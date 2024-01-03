import { IMovie, MovieFilter } from '@giron/shared-models';
import { getBackendClient } from '@giron/shared-data-access-api-client';
import { useQuery } from '@tanstack/react-query';
import { createMovieListQueryString } from '@giron/shared-util-helpers';
import { useMovieFilter } from '@giron/data-access';

const PATH_PREFIX = 'movie';

interface MovieListResponse {
  content: IMovie[];
}

export const useMovieListQuery = <T>(
  select: (data: MovieListResponse) => T,
  sortOrder: string,
  sortDir: string,
  page: number,
  pageSize?: number
) => {
  const [filter] = useMovieFilter();
  const client = getBackendClient();

  const queryKey = createMovieListQueryString(
    filter,
    sortOrder,
    sortDir,
    page,
    pageSize
  );

  return useQuery(
    ['movies', filter, queryKey],
    async () => {
      return await client.get<MovieListResponse>(`${PATH_PREFIX}/list${queryKey}`);
    }, {
      select
    }
  );
};
