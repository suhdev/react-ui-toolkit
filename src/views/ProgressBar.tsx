import * as React from 'react'; 
import {BasicComponent,BasicComponentProps} from './BasicComponent';

export interface PropgressBarProps extends BasicComponentProps{
    labelForProgress?:(progress:number)=>React.ReactElement<any>|string;
    max?:number; 
}

export interface ProgressBarState{
    progress:number;
}

export class ProgressBar extends BasicComponent<PropgressBarProps,ProgressBarState>{
    constructor(props:PropgressBarProps){
        super(props); 
    }

    setProgress(value:number){
        this.setState({
            progress:value
        });
    }

    render(){
        let props = this.props,
            state = this.state,
            progress = state.progress/(props.max || 100)*100; 
        return (
            <div className="react-ui-progressbar">
                <div className="progressbar-bg"></div>
                <div className="progressbar-indicator" style={{width:progress+'%'}}></div>
                <div className="progressbar-label">{(props.labelForProgress && props.labelForProgress(state.progress))||(state.progress.toFixed(0)+"%")}</div>
            </div>
        );
    }
} 