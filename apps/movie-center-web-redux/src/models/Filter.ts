
export abstract class Filter<T> {

    public fromString(strJson: string): T {
        return JSON.parse(strJson) as T;
    }
}
