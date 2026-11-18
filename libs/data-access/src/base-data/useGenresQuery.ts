import { SelectableModel } from '@giron/shared-models';
import { useQuery } from '@tanstack/react-query';
import { getBackendClient } from '@giron/shared-data-access-api-client';
import { PATH_PREFIX } from './constants';
import { convertToMilliseconds } from '@giron/shared-util-helpers';

export const useGenresQuery = () => {
  const client = getBackendClient();

  return useQuery<SelectableModel[]>({
    queryKey: ['genres'],
    queryFn: async () => {
      return await client.get<SelectableModel[]>(`${PATH_PREFIX}/genres`);
    },
    staleTime: convertToMilliseconds(1, 'days'),
  });
};
