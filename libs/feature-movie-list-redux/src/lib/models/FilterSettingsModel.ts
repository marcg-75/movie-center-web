import { Filter } from './Filter';

export enum FilterType {
  MOVIE = 'MOVIE',
  ACTOR = 'ACTOR',
}

export class FilterSettings<T> {
  public id: number;
  public name: string;
  public isDefault: boolean;
  public filterType: FilterType;
  public filter: Filter<T>;

  constructor(rawData: FilterSettingsRaw, filter: Filter<T>) {
    this.id = rawData.id;
    this.name = rawData.name;
    this.isDefault = rawData.isDefault || false;
    this.filterType = rawData.filterType;
    this.filter = filter;
  }

  static fromRaw<T>(rawData: FilterSettingsRaw): FilterSettings<T> {
    switch (rawData.filterType) {
      case FilterType.MOVIE:
        return new FilterSettings(
          rawData,
          JSON.parse(rawData.filterValues) as Filter<T>
        );
      default:
        return new FilterSettings(
          rawData,
          JSON.parse(rawData.filterValues) as Filter<T>
        );
    }
  }

  public toRaw(): FilterSettingsRaw {
    return {
      id: this.id,
      name: this.name,
      isDefault: this.isDefault || false,
      filterType: this.filterType,
      filterValues: JSON.stringify(this.filter),
    };
  }
}

export interface FilterSettingsRaw {
  id: number;
  name: string;
  isDefault: boolean;
  filterType: FilterType;
  filterValues: string;
}
