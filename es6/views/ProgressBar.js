import * as React from 'react';
import { BasicComponent } from './BasicComponent';
export class ProgressBar extends BasicComponent {
    constructor(props) {
        super(props);
    }
    setProgress(value) {
        this.setState({
            progress: value
        });
    }
    render() {
        let props = this.props, state = this.state, progress = state.progress / (props.max || 100) * 100;
        return (React.createElement("div", {className: "react-ui-progressbar"}, React.createElement("div", {className: "progressbar-bg"}), React.createElement("div", {className: "progressbar-indicator", style: { width: progress + '%' }}), React.createElement("div", {className: "progressbar-label"}, (props.labelForProgress && props.labelForProgress(state.progress)) || (state.progress.toFixed(0) + "%"))));
    }
}
