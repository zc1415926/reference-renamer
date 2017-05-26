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

export default class ToolbarSelectSourceColumn extends React.Component {
    constructor() {
        super();
        this.state = {
            isSourceHeaderMenuOpen: false,
        }
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

    sourceHeaderMenuChanged(e, key) {
        console.log('source column number:');
        console.log(key);

        this.setState({
            sourceHeaderText: this.props.colHeader[key]
        });

        this.props.onGetSourceColNum(key);
    }

    createSourceRow(item, index) {
        return (<MenuItem key={index} value={index} primaryText={index + 1 + '. ' + item}/>);
    }

    render() {
        return (
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
                            {this.props.colHeader.map(this.createSourceRow, this)}
                        </Menu>
                    </Popover>
                </ToolbarGroup>
                <ToolbarGroup>
                    <ToolbarTitle text={this.state.sourceHeaderText}/>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}