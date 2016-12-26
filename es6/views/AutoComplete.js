import * as React from 'react';
import { BasicComponent } from './BasicComponent';
export class AutoComplete extends BasicComponent {
    constructor(props) {
        super(props);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
    }
    onItemClick(e) {
        let el = e.target, props = this.props;
        while ((el.className.indexOf("autocomplete-item") === -1) && el.parentElement) {
            el = el.parentElement;
        }
        let v = el && el.getAttribute("data-index");
        if (v) {
            v = parseInt(v);
            let item = this._items[v];
            this.setState({
                searchVal: props.labelForSuggestionItem ? props.labelForSuggestionItem(item, v) : (item.label || item.title || item.key),
                showMenu: false,
            });
        }
    }
    onSearchChange(e) {
        let el = e.target;
        this.setState({
            searchVal: el.value,
            showMenu: true,
        });
    }
    render() {
        let props = this.props, state = this.state, items = (props.items && props.items.length) ? props.items : (props.suggestionsForValue ? props.suggestionsForValue(state.searchVal) : []);
        this._items = items;
        return (React.createElement("div", {className: "react-ui-autocomplete", "data-visible": this._visible, "data-active": state.showMenu}, React.createElement("input", {className: "autocomplate-field", type: "text", placeholder: props.placeholder || 'search...', onChange: this.onSearchChange, value: state.searchVal}), React.createElement("div", {className: "autocomplate-menu"}, items.map((e, i) => {
            e.$index = i;
            return (props.viewForSuggestionItem ? props.viewForSuggestionItem(e, i, this.onItemClick) : (React.createElement("div", {className: "autocomplete-item", key: e.key || e.id || e.label || e.name || e.title, "data-index": i, onClick: this.onItemClick}, (props.labelForSuggestionItem && props.labelForSuggestionItem(e, i)) || (e.label || e.title || e.name))));
        }))));
    }
}
