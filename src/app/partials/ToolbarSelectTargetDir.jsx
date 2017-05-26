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
            targetDir: '',
        }
    }

    componentDidMount() {
        ipcRenderer.on('target-dir-reply', (event, dirPath, fileCount) => {
                this.setState({
                    targetDir: dirPath,
                    //fileCount: fileCount
                });

                this.props.onSelect(dirPath);
            }
        );
    }

    btnTargetDirClicked() {
        ipcRenderer.send('open-target-dir');
    }

    render() {
        return (
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
        );
    }
}