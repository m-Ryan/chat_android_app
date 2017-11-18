import React from 'react';
import { Icon } from 'antd-mobile';
export default (sex ,size)=>(
        parseInt(sex)===0
        ?<Icon type={"\uE60F"} size={size} color='rgb(37,160,220)'/>
        : <Icon type={"\uE60E"} size={size} color='rgb(220,33,124)'/>
    )
