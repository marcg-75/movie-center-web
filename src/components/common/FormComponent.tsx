import {Component} from 'react';

export interface IAbstractFormMode {
    isCreateMode: boolean
}

export interface IAbstractFormState {
    mode: string
}

export default class FormComponent<T, U> extends Component<T, IAbstractFormState> {

    constructor(props: any) {
        super(props);

        this.state = {
            mode: props.isCreateMode ? 'CREATE' : 'VIEW'
        };
    }

    inViewMode() {
        return this.state.mode === 'VIEW';
    }

    inCreateMode() {
        return this.state.mode === 'CREATE';
    }

    inEditMode() {
        return this.state.mode === 'EDIT';
    }
}
