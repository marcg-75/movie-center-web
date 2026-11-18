import { SelectableModel } from '@giron/shared-models';
import { useQuery } from '@tanstack/react-query';
import { getBackendClient } from '@giron/shared-data-access-api-client';
import { PATH_PREFIX } from './constants';
import { convertToMilliseconds } from '@giron/shared-util-helpers';

export const useFormatsQuery = () => {
  const client = getBackendClient();

  return useQuery<SelectableModel[]>({
    queryKey: ['formats'],
    queryFn: async () => {
      return await client.get<SelectableModel[]>(`${PATH_PREFIX}/formats`);
    },
    staleTime: convertToMilliseconds(1, 'days'),
  });
};
