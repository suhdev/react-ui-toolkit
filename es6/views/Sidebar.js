import * as React from 'react';
import { BasicComponent } from './BasicComponent';
export class Sidebar extends BasicComponent {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: '',
            selKey: null,
        };
        this._visible = true;
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.onFieldFocus = this.onFieldFocus.bind(this);
        this.onFieldBlur = this.onFieldBlur.bind(this);
        this.onToggleSidebar = this.onToggleSidebar.bind(this);
    }
    onToggleSidebar() {
        this._visible = !this._visible;
        this.props.onToggle && this.props.onToggle(this._visible);
        this.refs['sidebar'].setAttribute('data-visible', (this._visible).toString());
    }
    onFieldFocus(e) {
        let el = e.target;
        el.setAttribute("data-focused", "true");
    }
    onFieldBlur(e) {
        let el = e.target;
        el.setAttribute("data-focused", "false");
    }
    onSearchChange(e) {
        let el = e.target;
        this.setState({
            searchValue: el.value
        });
    }
    onItemClick(e) {
        let el = e.target, item = this._items[parseInt(el.getAttribute("data-index"))];
        this.props.onItemSelected(item);
        this.setState({
            selKey: item,
        });
    }
    render() {
        let state = this.state, props = this.props, reg = new RegExp('.*' + state.searchValue + '.*', 'ig'), items = props.items.filter((v) => {
            reg.lastIndex = 0;
            return reg.test(v.label);
        });
        this._items = items;
        return (React.createElement("div", {className: "of-sidebar " + props.className, ref: "sidebar"}, React.createElement("div", {className: "of-sidebar-toggle", onClick: this.onToggleSidebar}, React.createElement("i", {className: "fa fa-ellipsis-v"})), React.createElement("div", {className: "of-sidebar-wrapper"}, React.createElement("div", {className: "of-sidebar-search"}, React.createElement("input", {type: "search", onChange: this.onSearchChange, placeholder: props.placeholder, onFocus: this.onFieldFocus, onBlur: this.onFieldBlur, value: state.searchValue})), React.createElement("div", {className: "of-sidebar-list"}, items.map((e, i) => {
            return (React.createElement("div", {key: e.key, "data-index": i, "data-selected": e === state.selKey, onClick: this.onItemClick, className: "of-sidebar-item"}, React.createElement("div", {"data-index": i, className: "of-sidebar-icon"}, React.createElement("i", {"data-index": i, className: e.icon})), React.createElement("div", {"data-index": i, className: "of-sidebar-label"}, e.label)));
        })))));
    }
}
