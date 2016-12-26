import * as React from 'react';
import * as ReactDOM from 'react-dom'; 
import {throttle} from '../Util';

export interface DataGetterFn {
    (rowIndex:number):string[];
    (rowIndex:number):any;
}
export interface ViewGetterFn {
    (rowIndex:number,item?:any,internalIndex?:number):React.ReactElement<any>; 
}

export interface CellDataGetterFn{
    (rowIndex:number,colIndex:number,internalIndex?:number):any;
}

export interface CellViewGetterFn{
    (rowIndex:number,colIndex:number,internalIndex?:number):React.ReactElement<any>;

}

export interface CellLabelGetterFn {
    (rowIndex:number,colIndex:number,internalIndex?:number,item?:any):React.ReactElement<any>;
}
export interface TableViewProps {
    itemHeight: number;
    itemSpacing: number;
    initialHeight:number;
    itemCount:()=>number|number;
    dataForRowAtIndex?:DataGetterFn;
    viewForRowAtIndex?:ViewGetterFn;
    dataForCellAtPosition?:CellDataGetterFn;
    labelForCellAtPosition?:CellLabelGetterFn; 
    viewForCellAtPosition?:CellViewGetterFn;
    items?:string[][]|any[];
}

export interface TableViewState {
    startIndex?:number;
    visibleItems?:number;
}
export class TableView extends React.Component<TableViewProps, TableViewState>{
    constructor(props:TableViewProps) {
        super(props);
        // console.log(Math.floor((props.initialHeight || 200)/(props.itemHeight+props.itemSpacing)));
        this.state = {
            startIndex:0,
            visibleItems:Math.floor((props.initialHeight || 200)/(props.itemHeight+props.itemSpacing)),
        };
        this.onScroll = this.onScroll.bind(this);
        this.onScroll = throttle(this.onScroll,300,null);
        this.onResize = this.onResize.bind(this);
        this.onResize = throttle(this.onResize,300,null);
    }

    onResize() {
        let props = this.props,
            el = this.refs['scroller'] as HTMLElement, 
            wrapperEl = this.refs['wrapper'] as HTMLElement,
            contentEl = this.refs['content'] as HTMLElement,
            //count = Math.floor(parseInt(el.style.height)/(props.itemHeight+props.itemSpacing)),
            bb = el.getBoundingClientRect();
        let count = Math.ceil(bb.height/(props.itemHeight+props.itemSpacing));
        contentEl.style.height = bb.height + 'px';
        wrapperEl.style.height = bb.height + 'px';  
        this.setState({
            visibleItems:count
        });
    }

    onScroll() {
        let props = this.props;
        let el = this.refs['scroller'] as HTMLElement;
        let w = this.refs['wrapper'] as HTMLElement;
        let sv = this.refs['scrollview'] as HTMLElement; 
        let contentEl = this.refs['content'] as HTMLElement;
        // contentEl.style.top = w.scrollTop + 'px';
        contentEl.style.transform = 'translate('+[0+'px',w.scrollTop+'px']+')';
        // console.log(Math.ceil(w.scrollTop / sv.getBoundingClientRect().height)*props.itemCount());
        this.setState({ startIndex: Math.floor(w.scrollTop / sv.getBoundingClientRect().height*props.itemCount())});
    }

    componentDidMount() {
        window.addEventListener('resize',this.onResize);
        let props = this.props; 
        document.getElementsByTagName("body")[0].addEventListener('resize',this.onResize);
        let el = this.refs['scroller'] as HTMLElement; 
        let contentEl = this.refs['content'] as HTMLElement;
        let scrollviewEl = this.refs['wrapper'] as HTMLElement; 
        var bb = contentEl.getBoundingClientRect();
        contentEl.style.height = bb.height+'px';  
        scrollviewEl.style.height = bb.height + 'px';
        //console.log(props.itemHeight,props.itemSpacing,contentEl.style.height);
        let count = Math.ceil(bb.height/(props.itemHeight+props.itemSpacing));
        this.setState({
            visibleItems:count
        });

    }

    componentDidUpdate(){
        let props = this.props; 
        let el = this.refs['scroller'] as HTMLElement; 
        let contentEl = this.refs['content'] as HTMLElement;
        if (contentEl.style.height !== el.style.height){
            contentEl.style.height = el.style.height;
        }
        
    }

    componentWillUnmount(){
        window.removeEventListener('resize',this.onResize);
    }

    viewForRowAtIndex(rowIndex:number,item:any,internalIndex:number):React.ReactElement<any>{
        let props = this.props, 
            isObject = typeof item === "object",
            isStringArray = isObject && item.length && typeof item[0] === "string"; 
        if (isStringArray) {
            // console.log('box');
            return (
                <div className="tableview-row" key={'item-'+internalIndex}>
                {(item as string[]).map((e,idx)=>{
                    return (<div className="tableview-column" key={'col-'+idx} 
                        data-column={e} data-col-index={idx}>{(props.dataForCellAtPosition && props.dataForCellAtPosition(rowIndex,idx,internalIndex))||
                            (props.labelForCellAtPosition && props.labelForCellAtPosition(rowIndex,idx,internalIndex,e)) || e}</div>);
                })}
                </div>
            );
        }else {
            var items = []; 
            for(var key in item){
                items.push((<div className="tableview-column" key={'col-'+key} 
                    data-column={item[key]} data-col-index={key}>{props.labelForCellAtPosition && props.labelForCellAtPosition(rowIndex ,key as any,internalIndex)}</div>))
            }
            return (
                <div className="tableview-row" key={'item-'+rowIndex}>
                {items}
                </div>
            );
        }
    }


    render() {
        // console.log(this.props.itemCount())
        let props = this.props,
            state = this.state,
            idx = state.startIndex || 0,
            dataItems = props.items,
            itemCount = typeof props.itemCount === "function"?props.itemCount():(typeof props.itemCount === "number"?props.itemCount as any:0), 
            items:any[] = [],
            currentIndex:number = idx;
        for (var j=0;j<state.visibleItems;j++){
            currentIndex = j + idx;  
            if (currentIndex >= itemCount){
                break;
            }
            items.push((typeof props.dataForRowAtIndex === "function"?props.dataForRowAtIndex(currentIndex):(dataItems && dataItems.length)?dataItems[currentIndex]:0));
        }
        // console.log(items)
        return (
            <div className="react-ui-tableview" ref="scroller">
                <div className="tableview-header">
                </div>
                <div className="tableview-wrapper" ref="wrapper" onScroll={this.onScroll}>
                    <div className="scrollview" ref="scrollview" style={{ height: (itemCount * (props.itemHeight+props.itemSpacing)) + 'px' }}> 
                        <div className="tableview-content" ref="content" >
                            {items.map((ev, i) => {
                                if (props.viewForRowAtIndex){
                                    // return 'Suhail';
                                    return props.viewForRowAtIndex(i+idx,ev,i); 
                                }else {
                                    // return ev;
                                    return this.viewForRowAtIndex(i+idx,ev,i); 
                                }
                            }) }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// let arr = (new Array(100000)).fill(0).map((e,i)=>{return [(i+100)+"",(i+102)+"",(i+104)+"",(i+106)+""]});
ReactDOM.render(<TableView initialHeight={400} 
    itemCount={function(){return 100000;}} itemHeight={42} 
    itemSpacing={2} dataForRowAtIndex={function(rowIndex:number){
        return [rowIndex+"",10+"",10+""];
    }} />,document.getElementById('SiteContainer'));