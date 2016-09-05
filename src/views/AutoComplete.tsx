import * as React from 'react'; 
import {BasicComponent,BasicComponentProps} from './BasicComponent';
export interface SuggestionItem{
    key?:string;
    id?:string;
    name?:string;
    label?:string;
    title?:string;
    $index?:number;
}
interface SuggestionCallbackFn{
    (searchTerm:string):string[]; 
    (searchTerm:string):SuggestionItem[];
}

interface LabelGeneratorFn{
    (item:SuggestionItem,index:number):React.ReactElement<any>|string;
}
export interface AutoCompleteProps extends BasicComponentProps{
    placeholder?:string;
    suggestionsForValue:SuggestionCallbackFn;
    items?:SuggestionItem[]|string[];
    viewForSuggestionItem:(item:SuggestionItem,index:number,onClick:Function)=>React.ReactElement<any>;
    labelForSuggestionItem:LabelGeneratorFn;
}

export interface AutoCompleteState {
    searchVal?:string;
    showMenu?:boolean;
}

export class AutoComplete extends BasicComponent<AutoCompleteProps,AutoCompleteState>{
    _items:any[];
    constructor(props:AutoCompleteProps){
        super(props); 
        this.onSearchChange = this.onSearchChange.bind(this); 
        this.onItemClick = this.onItemClick.bind(this); 
    }

    onItemClick(e:React.SyntheticEvent){
        let el = e.target as HTMLElement,
            props = this.props; 
        while((el.className.indexOf("autocomplete-item") === -1) && el.parentElement){
            el = el.parentElement; 
        }
        let v:any = el && el.getAttribute("data-index");
        if (v){
            v = parseInt(v);
            let item = this._items[v];  
            this.setState({
                searchVal:props.labelForSuggestionItem?props.labelForSuggestionItem(item,v):(item.label || item.title || item.key),
                showMenu:false,
            })
        }
    }

    onSearchChange(e:React.SyntheticEvent){
        let el = e.target as HTMLInputElement; 
        this.setState({
            searchVal:el.value,
            showMenu:true,
        });
    }

    render(){
        let props = this.props,
            state = this.state, 
            items = (props.items && props.items.length)?props.items:(props.suggestionsForValue?props.suggestionsForValue(state.searchVal):[]);
        this._items = items;  
        return (
            <div className="react-ui-autocomplete" data-visible={this._visible} data-active={state.showMenu}>
                <input className="autocomplate-field" type="text" 
                    placeholder={props.placeholder || 'search...'} 
                    onChange={this.onSearchChange} value={state.searchVal} />
                <div className="autocomplate-menu">
                    {(items as any[]).map((e,i)=>{
                        e.$index = i;
                        return (props.viewForSuggestionItem?props.viewForSuggestionItem(e as SuggestionItem,i,this.onItemClick):(
                            <div className="autocomplete-item" key={e.key || e.id || e.label || e.name || e.title} 
                                data-index={i} onClick={this.onItemClick}>{(props.labelForSuggestionItem && props.labelForSuggestionItem(e,i))||(e.label || e.title || e.name)}</div>
                        ))
                    })}
                </div>
            </div>
        );
    }
}