import React from 'react';
import { Link } from 'react-router';

class Error extends React.Component {
  
  render() {
    
    return (
        <div className="system-error">
          <div>
            <img src="img/error.png"></img>
            <div>对不起，系统异常，请稍后再试</div>
            <div>您可以去<Link to='/'>首页</Link>&nbsp;先看看</div>
          </div>
        </div>
    );
  }
}

export default Error;