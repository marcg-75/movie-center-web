import {Component} from 'react';
import {SortModel} from "../../models/SortModel";

export interface IAbstractListState {
    componentName: string,
    sort: SortModel
}

export default class ListComponent<T, U> extends Component<T, IAbstractListState> {

    //componentName: string;

    constructor(props: any, componentName: string, sortByDefault = 'name') {
        super(props);

        this.state = {
            componentName,
            sort: SortModel.of(
                getQueryParamValue('sortBy', props.location.search) || sortByDefault,
                getQueryParamValue('sortDirection', props.location.search)
            )
        };

        //this.currentUser = props.currentUser as AuthUserModel;
    }

    scrollToTop() {
        window.scrollTo(0, 0);
    }
}

export const getQueryParamValue = (key: string, qpString: string): string => {
    const parameters: Array<string> = qpString.substring(1, qpString.length-1).split('&');
    const param: string = parameters.find((item: string) => item.startsWith(key));

    return param ? param.split('=')[1] : undefined;
};
