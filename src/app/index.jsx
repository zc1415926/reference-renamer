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
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconRemove from 'material-ui/svg-icons/content/remove';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import {cyan500} from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

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
const styles = {
    container: {
        textAlign: 'center',
        paddingTop: 200,
    },
    appBar:{
        titleStyle:{
            fontFamily: 'source-Serif-bold',
            fontSize: 28,
        }
    },
    btnHeaderRowNum: {
        marginLeft: 20,
        marginRight: 20,
    },
    titleBarDrag: {
        '-webkit-app-region': 'drag',
    },
    noDrag: {
        '-webkit-app-region': 'no-drag',
    },
    btn: {
         width: 220,
         height: 40,
    },
    btnLabel: {
        fontSize: 20,
    },
    txtColHeaderRowNum: {
        width: 120,
        disabled: true,
        floatingLabelStyle: {
            color: '#717171',
            fontSize: 18,
            width: 150,
        },
        inputStyle: {
            fontSize: 20,
            marginTop: 8,
        }
    },
};

import FlatButton from 'material-ui/FlatButton';
class App extends React.Component {

    constructor() {
        super();
        this.state = {
            targetDir: '',
            fileCount: '',
            excelPath: '',
            sourceDataLength: '',
            colHeaderRowNum: 0,
            colHeader: [],
            sourceColNum: -1,
            targetColNum: -1,
            info: '',

            value: 1,

            isSourceHeaderMenuOpen: false,
            isTargetHeaderMenuOpen: false,
            dpValue: 0,
            isRenameErrorDialog: false,
            renameErrorMessage: '',
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
        ipcRenderer.on('excel-path-reply', (event, filePath, sourceDataLength) => {
            this.setState({
                excelPath: filePath,
                sourceDataLength: sourceDataLength
            });

            if (sourceDataLength >= 1) {
                this.setState({colHeaderRowNum: 1});
            } else {

            }

            //deafualt header row number
            ipcRenderer.send('get-col-header', this.state.colHeaderRowNum);
        });

        // ipcRenderer.on('source-data-length-reply', (event, dataLength) => {
        //     this.setState({sourceDataLength: dataLength});
        // });

        ipcRenderer.on('col-header-reply', (event, colHeader) => {
            console.log('colHeader');
            console.log(colHeader);
            if (colHeader == null) {
                colHeader = [];
            }
            this.setState({colHeader: colHeader});
        });

        ipcRenderer.on('start-to-rename-reply', (event, info) => {
                this.state.info += '    '+info + '\n';
                this.setState({info: this.state.info});
            }
        );

        ipcRenderer.on('rename-error-reply', (event, errorMessageArray) => {
                //this.state.info += info + '\n';
                //this.setState({info: this.state.info});
            this.setState({
                isRenameErrorDialog: true,
                renameErrorMessage: errorMessageArray.toString()
            });
        });
    }

    btnTargetDirClicked() {
        ipcRenderer.send('open-target-dir');
    }

    btnExcelPathClicked() {
        ipcRenderer.send('open-excel-path');
    }

    inputColHeaderRowNumChanged(e) {
        this.setState({colHeaderRowNum: e.target.value});
        ipcRenderer.send('get-col-header', e.target.value);
    }

    createListRow(colHeaderItem) {
        return (
            <li>{colHeaderItem}</li>
        );
    }

    btnRenameClicked() {
        ipcRenderer.send('start-to-rename', this.state.sourceColNum, this.state.targetColNum);
    }

    handleChange(event, index, value) {
        this.setState({value});
    }

    handleOpenMenu() {
        this.setState({
            openMenu: true,
        });
    }

    handleRequestClose() {
        this.setState({
            open: false,
        });
    }

    handleTouchTap() {
        this.setState({
            open: true,
        });
    }

    handleSourceHeaderMenu(event, isOpen) {
        if (isOpen) {
            event.preventDefault();
            this.setState({
                isSourceHeaderMenuOpen: isOpen,
                anchorEl: event.currentTarget,
            });
        } else {
            this.setState({
                isSourceHeaderMenuOpen: isOpen,
            });
        }
    }

    handleTargetHeaderMenu(event, isOpen) {
        if (isOpen) {
            event.preventDefault();
            this.setState({
                isTargetHeaderMenuOpen: isOpen,
                anchorEl: event.currentTarget,
            });
        } else {
            this.setState({
                isTargetHeaderMenuOpen: isOpen,
            });
        }
    }

    createSourceRow(item, index) {

        return (<MenuItem key={index} value={index} primaryText={index + 1 + '. ' + item}/>);
    }

    createTargetRow(item, index) {

        return (<MenuItem key={index} value={index} primaryText={index + 1 + '. ' + item}/>);
    }


    sourceHeaderMenuChanged(e, key) {
        console.log('source column number:');
        console.log(key);

        this.setState({
            sourceColNum: key,
            sourceHeaderText: this.state.colHeader[key]
        });
    }

    targetHeaderMenuChanged(e, key) {
        console.log('target column number:');
        console.log(key);

        this.setState({
            targetColNum: key,
            targetHeaderText: this.state.colHeader[key]
        });
    }

    isBtnHeaderRowNumDisabled(btnType) {

        if (btnType == 'add') {
            if (this.state.colHeaderRowNum == this.state.sourceDataLength) {

                console.log('this.state.colHeaderRowNum');
                console.log(this.state.colHeaderRowNum);
                return true;
            }
        } else if (btnType == 'remove') {
            if (this.state.colHeaderRowNum == 0) {
                return true;
            }
        }
    }

    btnHeaderRowNumBtnClicked(btnType) {

        if (btnType == 'add') {
            this.setState({colHeaderRowNum: this.state.colHeaderRowNum + 1});

            ipcRenderer.send('get-col-header', this.state.colHeaderRowNum + 1);
        } else if (btnType == 'remove') {
            this.setState({colHeaderRowNum: this.state.colHeaderRowNum - 1});

            ipcRenderer.send('get-col-header', this.state.colHeaderRowNum - 1);
        }
    }

    onBtnCloseAppClicked(){
        ipcRenderer.send('close-app');
    }

    render() {

        const renameErrorActions = [
            <FlatButton label="知道了" primary={true}
                        onTouchTap={()=>{this.setState({isRenameErrorDialog: false})}} />
        ];

        return (
            <div className="mainBody">
                <MuiThemeProvider muiTheme={muiTheme}>
                    <AppBar title="参照批量重命名程序" titleStyle={styles.appBar.titleStyle} style={styles.titleBarDrag}
                            showMenuIconButton={false}
                            iconElementRight={<IconButton style={styles.noDrag}
                                                          onTouchTap={()=>{this.onBtnCloseAppClicked()}}><NavigationClose /></IconButton>}/>
                </MuiThemeProvider>

                <MuiThemeProvider muiTheme={muiTheme}>
                    <Toolbar>
                        <ToolbarGroup>
                            <RaisedButton style={styles.btn} labelStyle={styles.btnLabel} label="选择目标文件夹" onClick={() => {
                                this.btnTargetDirClicked()
                            }}/>
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
                            <RaisedButton style={styles.btn} labelStyle={styles.btnLabel} label="选择Excel文件" onClick={() => {
                                this.btnExcelPathClicked()
                            }}/>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarTitle text={this.state.excelPath}/>
                        </ToolbarGroup>
                    </Toolbar>
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <Divider />
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <Toolbar>
                        <ToolbarGroup>

                            <FloatingActionButton mini={true} style={styles.btnHeaderRowNum}
                                                  disabled={this.isBtnHeaderRowNumDisabled('add')}
                                                  onTouchTap={() => {
                                                      this.btnHeaderRowNumBtnClicked('add')
                                                  }}>
                                <IconAdd />
                            </FloatingActionButton>

                            <TextField value={this.state.colHeaderRowNum} floatingLabelText="列标题在第几行"
                                       style={styles.txtColHeaderRowNum} floatingLabelStyle={styles.txtColHeaderRowNum.floatingLabelStyle}
                                       inputStyle={styles.txtColHeaderRowNum.inputStyle}
                                       onChange={(e) => {
                                           this.inputColHeaderRowNumChanged(e)
                                       }}
                            />

                            <FloatingActionButton mini={true}
                                                  disabled={this.isBtnHeaderRowNumDisabled('remove')}
                                                  onTouchTap={() => {
                                                      this.btnHeaderRowNumBtnClicked('remove')
                                                  }}>
                                <IconRemove />
                            </FloatingActionButton>


                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarTitle text={this.state.colHeader.toString()}/>
                        </ToolbarGroup>
                    </Toolbar>
                </MuiThemeProvider>
                <MuiThemeProvider muiTheme={muiTheme}>
                    <Toolbar>
                        <ToolbarGroup>
                            <RaisedButton style={styles.btn} labelStyle={styles.btnLabel}
                                onTouchTap={(e) => {
                                    this.handleSourceHeaderMenu(e, true)
                                }}
                                label="请选择原文件名列"
                            />
                            <Popover
                                open={this.state.isSourceHeaderMenuOpen}
                                anchorEl={this.state.anchorEl}
                                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                onRequestClose={(e) => {
                                    this.handleSourceHeaderMenu(e, false)
                                }}
                            >
                                <Menu onChange={(e, key) => {
                                    this.sourceHeaderMenuChanged(e, key);
                                    this.handleSourceHeaderMenu(e, false);
                                }}>
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
                            <RaisedButton style={styles.btn} labelStyle={styles.btnLabel}
                                onTouchTap={(e) => {
                                    this.handleTargetHeaderMenu(e, true)
                                }}
                                label="请选择目标文件名列"
                            />
                            <Popover
                                open={this.state.isTargetHeaderMenuOpen}
                                anchorEl={this.state.anchorEl}
                                anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                                onRequestClose={(e) => {
                                    this.handleTargetHeaderMenu(e, false)
                                }}
                            >
                                <Menu onChange={(e, key) => {
                                    this.targetHeaderMenuChanged(e, key);
                                    this.handleTargetHeaderMenu(e, false);
                                }}>
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
                            <RaisedButton style={styles.btn} labelStyle={styles.btnLabel} label="开始" onClick={() => {
                                this.btnRenameClicked()
                            }}/>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarTitle text=''/>
                        </ToolbarGroup>
                    </Toolbar>
                </MuiThemeProvider>

                <MuiThemeProvider muiTheme={muiTheme}>
                    <TextField id="txtInfo"
                               value={this.state.info} fullWidth={true} multiLine={true} rows={4}
                               rowsMax={4}/>
                </MuiThemeProvider>

                <MuiThemeProvider muiTheme={muiTheme}>
                    <Dialog title="缺少参数" actions={renameErrorActions}
                            modal={true} open={this.state.isRenameErrorDialog}>
                        {this.state.renameErrorMessage}
                    </Dialog>
                </MuiThemeProvider>
            </div>
        );
    }
}

render(<App/>, document.getElementById('content'));
