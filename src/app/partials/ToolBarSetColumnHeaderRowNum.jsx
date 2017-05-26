/**
 * Created by zc1415926 on 2017/5/26.
 */
import React from 'react';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconRemove from 'material-ui/svg-icons/content/remove';
const electron = window.require('electron');
const {ipcRenderer} = electron;

const styles = {
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
        },
    },
    btnHeaderRowNum: {
        marginLeft: 20,
        marginRight: 20,
    },
};

export default class ToolBarSetColumnHeaderRowNum extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            colHeaderRowNum: this.props.colHeaderRowNum,
        }
        console.log('this.props.colHeaderRowNum');
        console.log(this.props.colHeaderRowNum);
    }

    isBtnHeaderRowNumDisabled(btnType) {
        if (btnType == 'add') {
            if (this.state.colHeaderRowNum == this.props.sourceDataLength) {
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
            this.state.colHeaderRowNum += 1;
        }
        else if (btnType == 'remove') {
            this.state.colHeaderRowNum -= 1;
        }

        this.setState({colHeaderRowNum: this.state.colHeaderRowNum});
        ipcRenderer.send('get-col-header', this.state.colHeaderRowNum);
    }

    render() {
        return (
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
                    <ToolbarTitle text={this.props.colHeader.toString()}/>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}