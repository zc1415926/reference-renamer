/**
 * Created by zc1415926 on 2017/5/15.
 */
import AppMain from './AppMain';
import React from 'react';
import {render} from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

render(<AppMain/>, document.getElementById('content'));