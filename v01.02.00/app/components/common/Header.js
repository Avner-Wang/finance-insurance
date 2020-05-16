import React from 'react';
import { withRouter } from 'react-router';
import { goBankIndex } from './Utils'

class Header extends React.Component {
  handleForward() {
    if (this.props.goBack) {
      this.props.router.goBack();
    } else if (this.props.goBankIndex) {
      goBankIndex();
    } else if (this.props.externalUrl) {
      window.location.href = this.props.backUrl;
    } else if (this.props.close) {
      this.props.onClose();
    } else {
      this.props.router.push(this.props.backUrl);
    }
  }
  
  render() {
    let backRender = () => {
      if (this.props.hideBack) {
        return <span className="back">&#12288;</span>
      }
      let iconRender = <i className="iconfont">&#xe606;</i>;
      if (this.props.close) {
        iconRender = <i className="iconfont">&#xe66e;</i>;
      }
      return <a className="back" onClick={this.handleForward.bind(this)}>{iconRender}</a>;
    }
   
    return (
      <nav className="container page-nav">
        {backRender()}
        <span className="title">{this.props.title}</span>
        <span className="action">&#12288;</span>
      </nav>
    );
  }
}

export default withRouter(Header);