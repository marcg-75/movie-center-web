export enum STORAGE_TYPE {
  SESSION = 'SESSION',
  LOCAL = 'LOCAL',
}

export interface StoredData {
  content: Object;
  timestamp: Date;
}
