import * as React  from 'react';
import {BasicComponent,BasicComponentProps} from './BasicComponent'; 

export interface ComboboxItemDef{
    label?:string;
    name?:string;
    title?:string;
    key?:string;
    id?:string;
    $index?:number;
}

export interface LabelGeneratorFn{
    (item:ComboboxItemDef):React.ReactElement<any>; 
    (item:ComboboxItemDef):string; 
}


export interface ComboboxProps extends BasicComponentProps{
    items:ComboboxItemDef[];
    hasSearch?:boolean;
    placeholder?:string;
    viewForItem?:(item:ComboboxItemDef,onClick:Function)=>React.Component<any,any>;
    labelForItem?:LabelGeneratorFn|string;
    visible:boolean; 
    onItemClick:(item:ComboboxItemDef)=>void; 
} 

export interface ComboboState {
    searchVal?:string;
    selected?:ComboboxItemDef;
}

export class Combobox extends BasicComponent<ComboboxProps,ComboboState>{
    _active:boolean; 
    constructor(props:ComboboxProps){
        super(props);
        this.state = {
            searchVal:'',
            selected:null,
        }; 
        this._active = false; 
        this.onSearchChange = this.onSearchChange.bind(this); 
        this.onItemClick = this.onItemClick.bind(this); 
        this.onToggle = this.onToggle.bind(this); 
    }

    onToggle(){
        let el = this.refs['dropDown'] as HTMLElement; 
        el.setAttribute('data-active',(this._active = !this._active)+"");
    }

    onItemClick(e:React.SyntheticEvent){
        let el = e.target as HTMLElement,index = -1;
        while((!el.hasAttribute("data-index"))){
            el = el.parentElement; 
        } 
        index = parseInt(el.getAttribute('data-index'));
        if (index !== -1){
            let props = this.props, 
                item = props.items[index]; 
            this.setState({
                selected:item
            },()=>{
                props.onItemClick(item);
            });
        }
    }

    onSearchChange(e:React.SyntheticEvent){
        let el = e.target as HTMLInputElement; 
        this.setState({
            searchVal:el.value
        });
    }

    render(){
        let props = this.props,
            state = this.state,
            selected = state.selected || {},
            reg = new RegExp(state.searchVal,'ig'),
            items = props.items.filter((e,i)=>{
                reg.lastIndex = 0; 
                e.$index = i;
                return reg.test(e.label || e.title || e.name);
            }).map((e)=>{
                if (props.viewForItem){
                    return props.viewForItem(e,this.onItemClick); 
                }else {
                    let label = e.label || e.title || e.name; 
                    if (typeof props.labelForItem === "function"){
                        label = (props.labelForItem as LabelGeneratorFn)(e) as any; 
                    }
                    return (<div className="dropdown-item" key={e.key || e.id || e.label || e.title || e.name}
                        data-selected={e === state.selected}
                        data-index={e.$index}
                        data-key={e.key || e.id || e.label || e.title || e.name} title={e.label || e.title || e.name}
                        onClick={this.onItemClick}>{(props.labelForItem?(typeof props.labelForItem === "function"?(props.labelForItem as any)(e):e[props.labelForItem as string]):(e.label || e.title || e.name))}</div>);
                }
            });
        return (
            <div className="react-ui-dropdown"
                data-active={this._active} 
                data-visible={props.visible}
                ref="dropDown">
                <div className="dropdown-label" onClick={this.onToggle}>{props.labelForItem?(typeof props.labelForItem === "function"?(props.labelForItem as any)(state.selected):state.selected[props.labelForItem as string]):(selected.label || selected.title || selected.name)}</div>
                <div className="dropdown-menu">
                    {props.hasSearch?(
                        <div className="dropdown-search">
                            <input type="text" placeholder={props.placeholder || 'search...'} 
                                onChange={this.onSearchChange} value={state.searchVal}/>
                        </div>
                    ):null}
                    <div className="dropdown-item-wrapper">
                        {items}
                    </div>
                </div>
            </div>
        );
    }
}