/**
 * Created by zc1415926 on 2017/5/26.
 */
import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
const electron = window.require('electron');
const {ipcRenderer} = electron;

const styles = {
    appBar:{
        titleStyle:{
            fontFamily: 'source-Serif-bold',
            fontSize: 28,
        },
        titleBarDrag: {
            '-webkit-app-region': 'drag',
        },
        noDrag: {
            '-webkit-app-region': 'no-drag',
        },
    },
};

export default class TitleBar extends React.Component {
    constructor(props) {
        super(props);
    }
    
    onBtnCloseAppClicked(){
        ipcRenderer.send('close-app');
    }

    render() {
        return (
            <AppBar title="参照批量重命名程序" titleStyle={styles.appBar.titleStyle} style={styles.appBar.titleBarDrag}
                    showMenuIconButton={false}
                    iconElementRight={
                        <IconButton style={styles.appBar.noDrag}
                                    onTouchTap={()=>{this.onBtnCloseAppClicked()}}><NavigationClose />
                        </IconButton>
                    }/>
        );
    }
}