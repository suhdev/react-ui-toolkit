import * as React from 'react';
import { BasicComponent } from './BasicComponent';
export class Dialog extends BasicComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }
    componentWillReceiveProps(props) {
        if (this.state.visible !== props.visible) {
            this.setState({
                visible: props.visible
            });
        }
    }
    render() {
        let props = this.props;
        return (React.createElement("div", {className: "react-ui-dialog", "data-visible": this.state.visible}, React.createElement("div", {className: "dialog-backdrop", onClick: (props.closeOnBackdrop) ? props.onClose : undefined}, React.createElement("div", {className: "dialog-container"}, React.createElement("div", {className: "dialog-close-button", onClick: props.onClose}, props.viewForCloseButton ? props.viewForCloseButton() : (React.createElement("i", {className: "fa fa-lg fa-times"}))), React.createElement("div", {className: "dialog-content-container"}, props.children)))));
    }
}
