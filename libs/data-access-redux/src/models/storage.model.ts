export enum STORAGE_TYPE {
  SESSION = 'SESSION',
  LOCAL = 'LOCAL',
}

export interface StoredData {
  content: unknown;
  timestamp: Date;
}
