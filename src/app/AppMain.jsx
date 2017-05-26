/**
 * Created by zc1415926 on 2017/5/26.
 */
import React, {Component} from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Divider from 'material-ui/Divider';
import {cyan500} from 'material-ui/styles/colors';
const electron = window.require('electron');
const {ipcRenderer} = electron;
const muiTheme = getMuiTheme({
    palette: {
        accent1Color: cyan500,
    },

    fontFamily: 'source-Sans-light',
    toolbar: {
        height: 68
    },
});

import TitleBar from './partials/TitleBar';
import ToolbarSelectTargetDir from './partials/ToolbarSelectTargetDir';
import ToolbarSelectExcelPath from './partials/ToolbarSelectExcelPath';
import ToolbarSetColumnHeaderRowNum from './partials/ToolBarSetColumnHeaderRowNum';
import ToolbarSelectSourceColumn from './partials/ToolbarSelectSourceColumn';
import ToolbarSelectTargetColumn from './partials/ToolbarSelectTargetColumn';
import ToolbarStartToRename from  './partials/ToolbarStartToRename';
import TxtInfo from './partials/TxtInfo';
import ErrorDialog from './partials/ErrorDialog'


class AppMain extends Component{
    constructor(props) {
        super(props);
        this.state = {
            targetDir: '',
            excelPath: '',
            sourceDataLength: 0,
            colHeaderRowNum: 0,
            colHeader: [],
            sourceColNum: -1,
            targetColNum: -1,
        }
    }

    getSourceDir(targetDir){
        this.setState({targetDir: targetDir});
    }

    getExcelPath(excelPath, sourceDataLength){
        this.setState({excelPath: excelPath});
        this.setState({sourceDataLength: sourceDataLength});
    }

    getColHeader(colHeaderRowNum){
        ipcRenderer.send('get-col-header', colHeaderRowNum);
        this.setState({colHeaderRowNum: colHeaderRowNum})
    }

    onGetColHeader(colHeader){
        this.setState({colHeader: colHeader});
    }

    onGetSourceColNum(sourceColNum){
        this.setState({sourceColNum: sourceColNum});
    }

    onGetTargetColNum(targetColNum){
        this.setState({targetColNum: targetColNum});
    }

    onStartClicked(){
        console.log('onStartClicked');
        console.log(this.state.targetDir);
        console.log(this.state.excelPath);
        console.log(this.state.sourceDataLength);
        console.log(this.state.colHeader);
        console.log(this.state.sourceColNum);
        console.log(this.state.targetColNum);

        ipcRenderer.send('start-to-rename', this.state.sourceColNum, this.state.targetColNum);
    }

    render(){
        return(
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>

                    <TitleBar/>
                    <ToolbarSelectTargetDir
                        onSelect={(targetDir)=>{this.getSourceDir(targetDir)}} sb="sb1"/>
                    <Divider />
                    <ToolbarSelectExcelPath
                        onSelect={(excelPath, sourceDataLength)=>{this.getExcelPath(excelPath, sourceDataLength)}}
                        getColHeader={(rowNum)=>{this.getColHeader(rowNum)}}
                        onGetColHeader={(colHeader)=>{this.onGetColHeader(colHeader)}}/>
                    <ToolbarSetColumnHeaderRowNum
                        sourceDataLength={this.state.sourceDataLength}
                        colHeader={this.state.colHeader}
                        colHeaderRowNum={this.state.colHeaderRowNum}/>
                    <ToolbarSelectSourceColumn
                        colHeader={this.state.colHeader}
                        onGetSourceColNum={(sourceColNum)=>{this.onGetSourceColNum(sourceColNum)}}/>
                    <ToolbarSelectTargetColumn
                        colHeader={this.state.colHeader}
                        onGetTargetColNum={(targetColNum)=>{this.onGetTargetColNum(targetColNum)}}/>
                    <ToolbarStartToRename onStartClicked={()=>{this.onStartClicked()}}/>
                    <TxtInfo/>
                    <ErrorDialog/>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default AppMain