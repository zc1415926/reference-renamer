/**
 * Created by zc1415926 on 2017/5/15.
 */
import React from 'react';
import {render} from 'react-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';
import DropDownMenu from 'material-ui/DropDownMenu';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';

import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import SelectField from 'material-ui/SelectField';
import {cyan500} from 'material-ui/styles/colors';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import FontIcon from 'material-ui/FontIcon';

const electron = window.require('electron');
const {ipcRenderer} = electron;
const muiTheme = getMuiTheme({
    palette: {
        accent1Color: cyan500,
    },
});
const styles = {
    container: {
        textAlign: 'center',
        paddingTop: 200,
    },
};
const standardActions = (
    <FlatButton
        label="Ok"
        primary={true}
        onTouchTap={()=>{this.handleRequestClose()}}
    />
);

import FlatButton from 'material-ui/FlatButton';
class App extends React.Component {

    constructor() {
        super();
        this.state = {
            targetDir: '',
            fileCount: '',
            excelPath: '',
            sourceDataLength: '',
            colHeaderRowNum: '',
            colHeader: [],
            sourceColNum: '',
            targetColNum: '',
            info: '',

            value: 1,

            isSourceHeaderMenuOpen: false,
            isTargetHeaderMenuOpen: false,
            dpValue: 0,
            //sourceHeaderText: "请选择原文件名列",
            //targetHeaderText: "请选择目标文件名列",
        }
    }

    componentDidMount() {
        ipcRenderer.on('target-dir-reply', (event, dirPath, fileCount) => {
                this.setState({
                    targetDir: dirPath,
                    fileCount: fileCount
                });
            }
        );
        ipcRenderer.on('excel-path-reply', (event, filePath) => {
                this.setState({excelPath: filePath});
            }
        );
        ipcRenderer.on('source-data-length-reply', (event, dataLength) => {
            this.setState({sourceDataLength: dataLength});
            }
        );
        ipcRenderer.on('col-header-reply', (event, colHeader) => {
            this.setState({colHeader: colHeader});
            }
        );
        ipcRenderer.on('start-to-rename-reply', (event, info) => {
            this.state.info += info + '\n';
            this.setState({info: this.state.info});
            }
        );
    }

    btnTargetDirClicked() {
        ipcRenderer.send('open-target-dir');
    }

    btnExcelPathClicked() {
        ipcRenderer.send('open-excel-path');
    }

    inputColHeaderRowNumChanged(e){
        this.setState({colHeaderRowNum: e.target.value});
        ipcRenderer.send('get-col-header', e.target.value);
    }

    createListRow(colHeaderItem){
        //let order = 0;
        return (
            <li>{colHeaderItem}</li>
        );
    }

    btnRenameClicked(){
        //检查数据输完没有
        //
        ipcRenderer.send('start-to-rename', this.state.sourceColNum, this.state.targetColNum);
    }
    handleChange (event, index, value){
        this.setState({value});
    }
    handleOpenMenu(){
        this.setState({
            openMenu: true,
        });
    }
    handleRequestClose(){
        this.setState({
            open: false,
        });
    }

    handleTouchTap(){
        this.setState({
            open: true,
        });
    }

    handleSourceHeaderMenu(event, isOpen){
        if(isOpen){
            event.preventDefault();
            this.setState({
                isSourceHeaderMenuOpen: isOpen,
                anchorEl: event.currentTarget,
            });
        }else {
            this.setState({
                isSourceHeaderMenuOpen: isOpen,
            });
        }
    }
    handleTargetHeaderMenu(event, isOpen){
        if(isOpen){
            event.preventDefault();
            this.setState({
                isTargetHeaderMenuOpen: isOpen,
                anchorEl: event.currentTarget,
            });
        }else {
            this.setState({
                isTargetHeaderMenuOpen: isOpen,
            });
        }
    }

    createSourceRow(item, index){

        return(<MenuItem key={index} value={index} primaryText={index+1 +'. '+item}/>);
    }
    createTargetRow(item, index){

        return(<MenuItem key={index} value={index} primaryText={index+1 +'. '+item}/>);
    }


    sourceHeaderMenuChanged(e, key){
        console.log('source column number:');
        console.log(key);

        this.setState({
            sourceColNum: key,
            sourceHeaderText: this.state.colHeader[key]});
    }
    targetHeaderMenuChanged(e, key){
        console.log('target column number:');
        console.log(key);

        this.setState({
            targetColNum: key,
            targetHeaderText: this.state.colHeader[key]});
    }

    render() {

        return (
            <div>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <AppBar title="参照批量重命名程序" />
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <Toolbar>
                        <ToolbarGroup>
                            <RaisedButton label="选择目标文件夹" onClick={() => {this.btnTargetDirClicked()}}/>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarTitle text={this.state.targetDir}/>
                        </ToolbarGroup>
                    </Toolbar>
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <Divider />
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <Toolbar>
                        <ToolbarGroup>
                            <RaisedButton label="选择Excel文件" onClick={() => {this.btnExcelPathClicked()}}/>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarTitle text={this.state.excelPath}/>
                        </ToolbarGroup>
                    </Toolbar>
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <Divider />
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <Toolbar>
                        <ToolbarGroup firstChild={true}>
                            <TextField
                                hintText="列标题在第几行？"
                                onChange={(e)=>{this.inputColHeaderRowNumChanged(e)}}
                            />

                            <ToolbarSeparator />

                        </ToolbarGroup>
                    </Toolbar>
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={muiTheme}>
                <Toolbar>
                    <ToolbarGroup>
                        <RaisedButton
                            onTouchTap={(e)=>{this.handleSourceHeaderMenu(e, true)}}
                            label="请选择原文件名列"
                        />
                        <Popover
                            open={this.state.isSourceHeaderMenuOpen}
                            anchorEl={this.state.anchorEl}
                            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                            targetOrigin={{horizontal: 'left', vertical: 'top'}}
                            onRequestClose={(e)=>{this.handleSourceHeaderMenu(e, false)}}
                        >
                            <Menu onChange={(e, key)=>{this.sourceHeaderMenuChanged(e, key)}}>
                                {this.state.colHeader.map(this.createSourceRow, this)}
                            </Menu>
                        </Popover>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <ToolbarTitle text={this.state.sourceHeaderText}/>
                    </ToolbarGroup>
                </Toolbar>
            </MuiThemeProvider>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <Toolbar>
                        <ToolbarGroup>
                            <RaisedButton
                                onTouchTap={(e)=>{this.handleTargetHeaderMenu(e, true)}}
                                label="请选择目标文件名列"
                            />
                            <Popover
                                open={this.state.isTargetHeaderMenuOpen}
                                anchorEl={this.state.anchorEl}
                                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                onRequestClose={(e)=>{this.handleTargetHeaderMenu(e, false)}}
                            >
                                <Menu onChange={(e, key)=>{this.targetHeaderMenuChanged(e, key)}}>
                                    {this.state.colHeader.map(this.createTargetRow, this)}
                                </Menu>
                            </Popover>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarTitle text={this.state.targetHeaderText}/>
                        </ToolbarGroup>
                    </Toolbar>
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <Toolbar>
                        <ToolbarGroup>
                            <RaisedButton label="开始" onClick={()=>{this.btnRenameClicked()}}/>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarTitle text=''/>
                        </ToolbarGroup>
                    </Toolbar>
                </MuiThemeProvider>

                <MuiThemeProvider muiTheme={muiTheme}>
                    <TextField value={this.state.info} fullWidth={true} multiLine={true} rows={4} rowsMax={4}/>
                </MuiThemeProvider>
            </div>
        );
    }
}

render(<App/>, document.getElementById('content'));
