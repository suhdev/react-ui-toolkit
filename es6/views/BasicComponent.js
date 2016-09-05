import * as React from 'react';
import * as ReactDOM from 'react-dom';
export class BasicComponent extends React.Component {
    constructor(props) {
        super(props);
        this._visible = true;
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }
    _updateVisible() {
        let el = ReactDOM.findDOMNode(this);
        el.setAttribute("data-visible", this._visible + "");
    }
    show() {
        this._visible = true;
        this._updateVisible();
    }
    hide() {
        this._visible = false;
        this._updateVisible();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.visible !== this.props.visible) {
            this._visible = nextProps.visible;
            this._updateVisible();
        }
    }
}
