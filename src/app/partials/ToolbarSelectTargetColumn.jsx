/**
 * Created by zc1415926 on 2017/5/26.
 */
import React from 'react';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

const styles = {
    btn: {
        width: 220,
        height: 40,
    },
    btnLabel: {
        fontSize: 20,
    },
};

export default class ToolbarTargetSourceColumn extends React.Component {
    constructor() {
        super();
        this.state = {
            isTargetHeaderMenuOpen: false,
        }
    }

    componentDidMount() {
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

    targetHeaderMenuChanged(e, key) {
        console.log('target column number:');
        console.log(key);

        this.setState({
            //targetColNum: key,
            targetHeaderText: this.props.colHeader[key]
        });

        this.props.onGetTargetColNum(key);
    }

    createTargetRow(item, index) {
        return (<MenuItem key={index} value={index} primaryText={index + 1 + '. ' + item}/>);
    }

    render() {
        return (
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
                            {this.props.colHeader.map(this.createTargetRow, this)}
                        </Menu>
                    </Popover>
                </ToolbarGroup>
                <ToolbarGroup>
                    <ToolbarTitle text={this.state.targetHeaderText}/>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}