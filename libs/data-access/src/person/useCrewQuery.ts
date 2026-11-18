import { PersonRoleModel } from '@giron/shared-models';
import { getBackendClient } from '@giron/shared-data-access-api-client';
import { useQuery } from '@tanstack/react-query';
import { convertToMilliseconds } from '@giron/shared-util-helpers';

const PATH_PREFIX = 'person/crew';

export const useCrewQuery = () => {
  const client = getBackendClient();

  return useQuery<PersonRoleModel[]>({
    queryKey: ['crew'],
    queryFn: async () => {
      return await client.get<PersonRoleModel[]>(`${PATH_PREFIX}`);
    },
    staleTime: convertToMilliseconds(1, 'hours'),
  });
};
