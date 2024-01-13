import { IMovie } from '@giron/shared-models';
import { getBackendClient } from '@giron/shared-data-access-api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export const useCreateMovieMutation = () => {
  const client = getBackendClient();
  const queryClient = useQueryClient();

  return useMutation(
    async (movie: IMovie) => {
      if (!movie) {
        throw new Error('Can not create movie. Movie is missing.');
      }
      if (!!movie.id && movie.id > 0) {
        throw new Error(
          'Can not create movie. It seems to already exist (id is > 0). Try updating it instead.'
        );
      }

      return await client.post<IMovie>(`${PATH_PREFIX}`, {
        body: movie,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['movies', 'actors', 'persons']);
      },
      onError: (error) => {
        console.error('Failed to create movie: ' + error);
      },
    }
  );
};

export const useUpdateMovieMutation = () => {
  const client = getBackendClient();
  const queryClient = useQueryClient();

  return useMutation(
    async (movie: IMovie) => {
      if (!movie || !movie.id || movie.id === 0) {
        throw new Error('Can not update movie. Movie Id is missing.');
      }

      return await client.put<IMovie>(`${PATH_PREFIX}/${movie.id}`, {
        body: movie,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['movies', 'movie', 'actors', 'persons']);
      },
      onError: (error) => {
        console.error('Failed to update movie: ' + error);
      },
    }
  );
};

export const useDeleteMovieMutation = () => {
  const client = getBackendClient();
  const queryClient = useQueryClient();

  return useMutation(
    async (movieId: number) => {
      if (!movieId || movieId === 0) {
        throw new Error('Can not delete movie. Movie Id is missing.');
      }

      return await client.delete<boolean>(`${PATH_PREFIX}/${movieId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['movies', 'movie', 'actors', 'persons']);
      },
      onError: (error) => {
        console.error('Failed to delete movie: ' + error);
      },
    }
  );
};
