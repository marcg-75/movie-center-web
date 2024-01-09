import { PersonRoleModel } from '@giron/shared-models';
import { getBackendClient } from '@giron/shared-data-access-api-client';
import { useQuery } from '@tanstack/react-query';
import { convertToMilliseconds } from '@giron/shared-util-helpers';

const PATH_PREFIX = 'person/actors';

export const useActorsQuery = <T>(select: (data: PersonRoleModel[]) => T) => {
  const client = getBackendClient();

  return useQuery(
    ['actors'],
    async () => {
      return await client.get<PersonRoleModel[]>(`${PATH_PREFIX}`);
    },
    {
      select,
      staleTime: convertToMilliseconds(1, 'hours'),
    }
  );
};
