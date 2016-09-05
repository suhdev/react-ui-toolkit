import * as React from 'react'; 
import {BasicComponent,BasicComponentProps} from './BasicComponent' 

export interface SidebarItemDef{
    key?:string;
    id?:string;
    label?:string;
    name?:string;
    title?:string;
    icon:string;
    $index?:number;
}

export interface SidebarProps extends BasicComponentProps{
    items:SidebarItemDef[];
    onItemSelected:(item:SidebarItemDef)=>void;
    viewForItem:(item:SidebarItemDef)=>React.ReactElement<any>; 
    className:string; 
    placeholder:string;
    onToggle?:Function;
}

export interface SidebarState {
    selKey?:SidebarItemDef;
    searchValue?:string; 
}

export class Sidebar extends BasicComponent<SidebarProps,SidebarState>{
    _items:SidebarItemDef[]; 
    _visible:boolean;
    constructor(props:SidebarProps){
        super(props); 
        this.state = {
            searchValue:'',
            selKey:null,
        }; 
        this._visible = true; 
        this.onSearchChange = this.onSearchChange.bind(this); 
        this.onItemClick = this.onItemClick.bind(this);
        this.onFieldFocus = this.onFieldFocus.bind(this);
        this.onFieldBlur = this.onFieldBlur.bind(this); 
        this.onToggleSidebar = this.onToggleSidebar.bind(this); 
    }

    onToggleSidebar(){
        this._visible = !this._visible;
        this.props.onToggle && this.props.onToggle(this._visible);
        (this.refs['sidebar'] as HTMLElement).setAttribute('data-visible',(this._visible).toString());
    }

    onFieldFocus(e:React.SyntheticEvent){
        let el = e.target as HTMLElement; 
        el.setAttribute("data-focused","true");
    }
    onFieldBlur(e:React.SyntheticEvent){
        let el = e.target as HTMLElement; 
        el.setAttribute("data-focused","false");
    }

    onSearchChange(e:React.SyntheticEvent){
        let el = e.target as HTMLInputElement; 
        this.setState({
            searchValue:el.value
        });
    }

    onItemClick(e:React.SyntheticEvent){
        let el = e.target as HTMLInputElement,
            item = this._items[parseInt(el.getAttribute("data-index"))];
        this.props.onItemSelected(item);
        this.setState({
            selKey:item,
        });
    }

    render(){
        let state = this.state,
            props = this.props,
            reg = new RegExp('.*'+state.searchValue+'.*','ig'),
            items = props.items.filter((v)=>{
                reg.lastIndex = 0;
                return reg.test(v.label);
            });
        this._items = items; 
        return (
            <div className={"of-sidebar "+props.className} ref="sidebar">
                <div className="of-sidebar-toggle" onClick={this.onToggleSidebar}> 
                    <i className="fa fa-ellipsis-v"></i>
                </div>
                <div className="of-sidebar-wrapper">
                    <div className="of-sidebar-search">
                        <input type="search" onChange={this.onSearchChange}
                        placeholder={props.placeholder} 
                        onFocus={this.onFieldFocus}
                        onBlur={this.onFieldBlur} 
                        value={state.searchValue} /> 
                    </div>
                    <div className="of-sidebar-list">
                        {items.map((e,i)=>{
                            return (
                                <div key={e.key}  
                                data-index={i}
                                data-selected={e === state.selKey}
                                onClick={this.onItemClick}
                                className="of-sidebar-item">
                                <div data-index={i} className="of-sidebar-icon"><i data-index={i} className={e.icon}></i></div>
                                <div data-index={i} className="of-sidebar-label">{e.label}</div></div>
                            );
                        })}
                    </div>
                </div>
            </div>
        ); 
    }
}