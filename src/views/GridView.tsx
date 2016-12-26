import * as React from 'react'; 

export interface GridViewProps {

}

export interface GridViewState {

}

export class GridView extends React.Component<GridViewProps,GridViewState>{
    constructor(props:GridViewProps){
        super(props); 
    }

    render(){
        return (
            <div className="react-ui-gridview">
                <div className="gridview-wrapper"> 
                    
                </div>
            </div>
        );
    }
}