/**
 * Created by zc1415926 on 2017/5/26.
 */
import React from 'react';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
    btn: {
        width: 220,
        height: 40,
    },
    btnLabel: {
        fontSize: 20,
    },
};

export default class ToolbarStartToRename extends React.Component {
    render() {
        return (
            <Toolbar>
                <ToolbarGroup>
                    <RaisedButton style={styles.btn} labelStyle={styles.btnLabel} label="开始" onClick={() => {
                        this.props.onStartClicked();
                    }}/>
                </ToolbarGroup>
                <ToolbarGroup>
                    <ToolbarTitle text=''/>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}