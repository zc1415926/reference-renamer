/**
 * Created by zc1415926 on 2017/5/26.
 */
import React from 'react';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
const electron = window.require('electron');
const {ipcRenderer} = electron;

const styles = {
    btn: {
        width: 220,
        height: 40,
    },
    btnLabel: {
        fontSize: 20,
    },
};

export default class ToolbarSelectTargetDir extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            excelPath: '',
            //colHeaderRowNum: 0,
        };
    }

    componentDidMount() {
        ipcRenderer.on('excel-path-reply', (event, filePath, sourceDataLength) => {
            this.setState({
                excelPath: filePath,
                sourceDataLength: sourceDataLength
            });

            if (sourceDataLength >= 1) {
                //deafualt header row number
                // this.setState({colHeaderRowNum: 1});
                this.props.getColHeader(1);
            } else {

            }

            this.props.onSelect(filePath, sourceDataLength);

            this.props.getColHeader(this.state.colHeaderRowNum);
        });

        ipcRenderer.on('col-header-reply', (event, colHeader) => {
            if (colHeader == null) {
                colHeader = [];
            }

            this.props.onGetColHeader(colHeader);
        });
    }

    btnExcelPathClicked() {
        ipcRenderer.send('open-excel-path');
    }

    render() {
        return (
            <Toolbar>
                <ToolbarGroup>
                    <RaisedButton style={styles.btn} labelStyle={styles.btnLabel} label="选择Excel文件" onClick={() => {
                        this.btnExcelPathClicked()
                    }}/>
                </ToolbarGroup>
                <ToolbarGroup>
                    <ToolbarTitle text={this.state.excelPath}/>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}