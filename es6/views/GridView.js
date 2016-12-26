import * as React from 'react';
export class GridView extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement("div", {className: "react-ui-gridview"}, React.createElement("div", {className: "gridview-wrapper"})));
    }
}
