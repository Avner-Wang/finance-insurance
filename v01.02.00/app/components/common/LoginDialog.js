import React from 'react';
import Config from '../../config';
import { goBankLogin, toggleClass } from './Utils';

class LoginDialog extends React.Component {

  handleGoBankLogin() {
    $("#login-dialog").hide();
    goBankLogin();
  }
  
  render() {
   
    return (
      <div className="system-dialog-alert" id="login-dialog">
        <div className="system-mask"></div>
        <div className="system-dialog">
          <div className="system-dialog-bd">您还未登录，需返回首页重新登录</div>
          <div className="system-dialog-ft">
              <a onClick={this.handleGoBankLogin.bind(this)} onTouchCancel={_.bind(toggleClass, this, 'grey-bg')} onTouchStart={_.bind(toggleClass, this, 'grey-bg')} onTouchEnd={_.bind(toggleClass, this, 'grey-bg')}>返回首页</a>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginDialog;