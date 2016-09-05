import * as React from 'react';
import { BasicComponent } from './BasicComponent';
export class Combobox extends BasicComponent {
    constructor(props) {
        super(props);
        this.state = {
            searchVal: '',
            selected: null,
        };
        this._active = false;
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }
    onToggle() {
        let el = this.refs['dropDown'];
        el.setAttribute('data-active', (this._active = !this._active) + "");
    }
    onItemClick(e) {
        let el = e.target, index = -1;
        while ((!el.hasAttribute("data-index"))) {
            el = el.parentElement;
        }
        index = parseInt(el.getAttribute('data-index'));
        if (index !== -1) {
            let props = this.props, item = props.items[index];
            this.setState({
                selected: item
            }, () => {
                props.onItemClick(item);
            });
        }
    }
    onSearchChange(e) {
        let el = e.target;
        this.setState({
            searchVal: el.value
        });
    }
    render() {
        let props = this.props, state = this.state, selected = state.selected || {}, reg = new RegExp(state.searchVal, 'ig'), items = props.items.filter((e, i) => {
            reg.lastIndex = 0;
            e.$index = i;
            return reg.test(e.label || e.title || e.name);
        }).map((e) => {
            if (props.viewForItem) {
                return props.viewForItem(e, this.onItemClick);
            }
            else {
                let label = e.label || e.title || e.name;
                if (typeof props.labelForItem === "function") {
                    label = props.labelForItem(e);
                }
                return (React.createElement("div", {className: "dropdown-item", key: e.key || e.id || e.label || e.title || e.name, "data-selected": e === state.selected, "data-index": e.$index, "data-key": e.key || e.id || e.label || e.title || e.name, title: e.label || e.title || e.name, onClick: this.onItemClick}, (props.labelForItem ? (typeof props.labelForItem === "function" ? props.labelForItem(e) : e[props.labelForItem]) : (e.label || e.title || e.name))));
            }
        });
        return (React.createElement("div", {className: "react-ui-dropdown", "data-active": this._active, "data-visible": props.visible, ref: "dropDown"}, React.createElement("div", {className: "dropdown-label", onClick: this.onToggle}, props.labelForItem ? (typeof props.labelForItem === "function" ? props.labelForItem(state.selected) : state.selected[props.labelForItem]) : (selected.label || selected.title || selected.name)), React.createElement("div", {className: "dropdown-menu"}, props.hasSearch ? (React.createElement("div", {className: "dropdown-search"}, React.createElement("input", {type: "text", placeholder: props.placeholder || 'search...', onChange: this.onSearchChange, value: state.searchVal}))) : null, React.createElement("div", {className: "dropdown-item-wrapper"}, items))));
    }
}
