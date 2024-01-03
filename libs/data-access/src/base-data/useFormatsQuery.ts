import { SelectableModel } from '@giron/shared-models';
import { useQuery } from '@tanstack/react-query';
import { getBackendClient } from '@giron/shared-data-access-api-client';
import { PATH_PREFIX } from './constants';

export const useFormatsQuery = <T>(select: (data: SelectableModel[]) => T) => {
  const client = getBackendClient();

  return useQuery(
    ['formats'],
    async () => {
      return await client.get<SelectableModel[]>(`${PATH_PREFIX}/formats`);
    }, {
      select
    }
  );
};
