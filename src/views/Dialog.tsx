import * as React from 'react';
import {BasicComponent,BasicComponentProps} from './BasicComponent';  

export interface DialogProps extends BasicComponentProps{
    onClose:Function;
    closeOnBackdrop?:boolean; 
    viewForCloseButton:()=>React.ReactElement<any>;
}

export interface DialogState {
    visible:boolean;
}

export class Dialog extends BasicComponent<DialogProps,DialogState>{
    constructor(props:DialogProps){
        super(props); 
        this.state = {
            visible:false,
        }; 
    }

    componentWillReceiveProps(props:DialogProps){
        if (this.state.visible !== props.visible){
            this.setState({
                visible:props.visible
            }); 
        }
    }

    render(){
        let props = this.props;
        return (
            <div className="of-dialog" data-visible={this.state.visible}>
                <div className="of-backdrop" onClick={(props.closeOnBackdrop)?props.onClose:undefined}>
                    <div className="of-dialog-container">
                        <div className="of-close-button" onClick={props.onClose}>
                            {props.viewForCloseButton?props.viewForCloseButton():(<i className="fa fa-lg fa-times"></i>)}
                        </div>
                        <div className="of-content-container">
                        {props.children}
                        </div>
                    </div>
                </div>
            </div>
        ); 
    }
}