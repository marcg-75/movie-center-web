import { IMovie } from '@giron/shared-models';
import { getBackendClient } from '@giron/shared-data-access-api-client';
import { useQuery } from '@tanstack/react-query';
import { createMovieListQueryString } from '@giron/shared-util-helpers';
import { useMovieFilter } from './useMovieFilter';

const PATH_PREFIX = 'movie/list';

interface MovieListResponse {
  content: IMovie[];
}

export const useMovieListQuery = (
  sortOrder: string,
  sortDir: string,
  page: number,
  pageSize?: number,
) => {
  const { filter } = useMovieFilter();
  const client = getBackendClient();

  const queryKey = createMovieListQueryString(filter, sortOrder, sortDir, page, pageSize);

  return useQuery<MovieListResponse>({
    queryKey: ['movies', filter, queryKey],
    queryFn: async () => {
      return await client.get<MovieListResponse>(`${PATH_PREFIX}${queryKey}`);
    },
  });
};
