/**
 * Created by zc1415926 on 2017/5/15.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {render} from 'react-dom';

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

    render() {

        return (
            <div>
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
