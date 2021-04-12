import {Filter} from './Filter';
import {MovieFilter} from './MovieModel';

export enum FilterType {
    MOVIE = 'MOVIE',
    ACTOR = 'ACTOR'
}

export class FilterSettings {

    public id: number;
    public name: string;
    public isDefault: boolean;
    public filterType: FilterType;
    public filter: Filter<any>;

    constructor(rawData: FilterSettingsRaw, filter: Filter<any>) {
        this.id = rawData.id;
        this.name = rawData.name;
        this.isDefault = rawData.isDefault || false;
        this.filterType = rawData.filterType;
        this.filter = filter;
    }

    static fromRaw(rawData: FilterSettingsRaw): FilterSettings {
        switch (rawData.filterType) {
            case FilterType.MOVIE:
                return new FilterSettings(rawData, JSON.parse(rawData.filterValues) as MovieFilter);
            default:
                return new FilterSettings(rawData, JSON.parse(rawData.filterValues) as Filter<any>);
        }
    }

    public toRaw() {
        const rawData = new FilterSettingsRaw();
        rawData.id = this.id;
        rawData.name = this.name;
        rawData.isDefault = this.isDefault || false;
        rawData.filterType = this.filterType;
        rawData.filterValues = JSON.stringify(this.filter);

        return rawData;
    }
}

export class FilterSettingsRaw {

    public id: number;
    public name: string;
    public isDefault: boolean;
    public filterType: FilterType;
    public filterValues: string;
}
