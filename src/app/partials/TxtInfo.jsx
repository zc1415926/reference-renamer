/**
 * Created by zc1415926 on 2017/5/26.
 */
import React from 'react';
import TextField from 'material-ui/TextField';
const electron = window.require('electron');
const {ipcRenderer} = electron;

export default class TxtInfo extends React.Component {
    constructor() {
        super();
        this.state = {
            info: '',
        }
    }

    componentDidMount() {
        ipcRenderer.on('start-to-rename-reply', (event, info) => {
                this.state.info += '    '+info + '\n';
                this.setState({info: this.state.info});
            }
        );
    }

    render() {
        return (
            <TextField id="txtInfo"
                       value={this.state.info} fullWidth={true} multiLine={true} rows={4}
                       rowsMax={4}/>
        );
    }
}