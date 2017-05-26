/**
 * Created by zc1415926 on 2017/5/26.
 */
import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
const electron = window.require('electron');
const {ipcRenderer} = electron;

export default class ErrorDialog extends React.Component {
    constructor() {
        super();
        this.state = {
            isRenameErrorDialog: false,
            renameErrorMessage: '',
        }
    }

    componentDidMount(){
        ipcRenderer.on('rename-error-reply', (event, errorMessageArray) => {
            this.setState({
                isRenameErrorDialog: true,
                renameErrorMessage: errorMessageArray.toString()
            });
        });
    }

    render() {
        const renameErrorActions = [
            <FlatButton label="知道了" primary={true}
                        onTouchTap={()=>{this.setState({isRenameErrorDialog: false})}} />
        ];

        return (
            <Dialog title="缺少参数" actions={renameErrorActions}
                    modal={true} open={this.state.isRenameErrorDialog}>
                {this.state.renameErrorMessage}
            </Dialog>
        );
    }
}