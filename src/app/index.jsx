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
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';

import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import FontIcon from 'material-ui/FontIcon';

const electron = window.require('electron');
const {ipcRenderer} = electron;

class App extends React.Component {

    constructor() {
        super();
        this.state = {
            targetDir: '',
            fileCount: '',
            excelPath: '',
            sourceDataLength: '',
            colHeaderNum: '',
            colHeader: [],
            sourceColOrder: '',
            targetColOrder: '',
            info: '',

            value: 1,
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

    inputColHeaderNumChanged(e){
        this.setState({colHeaderNum: e.target.value});
        ipcRenderer.send('get-col-header', e.target.value);
    }

    createListRow(colHeaderItem){
        //let order = 0;
        return (
            <li>{colHeaderItem}</li>
        );
    }

    createList() {

        if(this.state.colHeader == []){
            return;
        }else{
            let list = '';
            let order = 0;
            //console.log(this.state.colHeader);
            this.state.colHeader.forEach((item)=>{
                //console.log(item)
                list += '<li key={'+order+'}>'+item+'</li>';
                //console.log(list);
                order++;
            });

            //能不能直接进行jsx拼接
            return <div dangerouslySetInnerHTML={{__html: list}} />;

        }
    }

    inputSourceColOrderChanged(e){
        this.setState({sourceColOrder: e.target.value});
        console.log(e.target.value);
    }

    inputTargetColOrderChanged(e){
        this.setState({targetColOrder: e.target.value});
        console.log(e.target.value);
    }

    btnRenameClicked(){
        //检查数据输完没有
        //
        ipcRenderer.send('start-to-rename', this.state.sourceColOrder, this.state.targetColOrder);
    }
    handleChange (event, index, value){
        this.setState({value});
    }
    handleOpenMenu(){
        this.setState({
            openMenu: true,
        });
    }
    render() {

        return (
            <div>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <AppBar title="Hello, Material-UI!" />
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <Toolbar>
                        <ToolbarGroup>
                            <RaisedButton label="选择目标文件夹" onClick={() => {this.btnTargetDirClicked()}}/>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarTitle text={this.state.targetDir}/>
                        </ToolbarGroup>
                    </Toolbar>
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <Divider />
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
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
                            <DropDownMenu value={this.state.value} onChange={this.handleChange}>
                                <MenuItem value={1} primaryText="All Broadcasts" />
                                <MenuItem value={2} primaryText="All Voice" />
                                <MenuItem value={3} primaryText="All Text" />
                                <MenuItem value={4} primaryText="Complete Voice" />
                                <MenuItem value={5} primaryText="Complete Text" />
                                <MenuItem value={6} primaryText="Active Voice" />
                                <MenuItem value={7} primaryText="Active Text" />
                            </DropDownMenu>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarTitle text="Options" />
                            <FontIcon className="muidocs-icon-custom-sort" />
                            <ToolbarSeparator />
                            <RaisedButton label="Create Broadcast" primary={true} />
                            <IconMenu
                                iconButtonElement={
                                    <IconButton touch={true}>
                                        <NavigationExpandMoreIcon />
                                    </IconButton>
                                }
                            >
                                <MenuItem primaryText="Download" />
                                <MenuItem primaryText="More Info" />
                            </IconMenu>
                        </ToolbarGroup>
                    </Toolbar>
                </MuiThemeProvider>

                <div><h1>Reference Renamer</h1></div>
                <div>
                    <button onClick={() => {this.btnTargetDirClicked()}}>打开文件夹</button>
                    <label>{this.state.targetDir}</label>
                    <label>共有{this.state.fileCount}个文件或文件夹</label>
                </div>
                <div>
                    <button onClick={() => {this.btnExcelPathClicked()}}>打开Excel文件</button>
                    <label>{this.state.excelPath}</label>
                </div>
                <div>
                    <label>列标题在第几行？（0 到 {this.state.sourceDataLength}）</label>
                    <input onChange={(e)=>{this.inputColHeaderNumChanged(e)}}/>
                </div>
                <div>
                    <ol>{this.createList()}</ol>
                </div>
                <div>
                    <label>原文件名列数</label>
                    <input type="text" onChange={(e)=>{this.inputSourceColOrderChanged(e)}}/>
                    <label>目标文件名列数</label>
                    <input type="text" onChange={(e)=>{this.inputTargetColOrderChanged(e)}}/>
                </div>
                <div>
                    <button onClick={()=>{this.btnRenameClicked()}}>开始转换</button>
                </div>
                <div>
                    <textarea value={this.state.info}></textarea>
                </div>
            </div>
        );
    }
}

render(<App/>, document.getElementById('content'));
