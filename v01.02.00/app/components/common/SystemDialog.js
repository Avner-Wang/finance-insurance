import React from 'react';
import { toggleClass } from './Utils';

class SystemDialog extends React.Component {

  close() {
    $('#' + this.props.id).hide();
  }

  backHandler() {
    if (this.props.backClick) {
      this.close();
    }
  }
  
  render() {
    let leftBtn;
    if (this.props.closeBtn) {
      leftBtn = <a className="default" onClick={this.close.bind(this)} onTouchCancel={_.bind(toggleClass, this, 'grey-bg')} onTouchStart={_.bind(toggleClass, this, 'grey-bg')} onTouchEnd={_.bind(toggleClass, this, 'grey-bg')}>再考虑下</a>;
    } else if (this.props.leftContent) {
      leftBtn = <a className="default" onClick={this.props.leftHandle} onTouchCancel={_.bind(toggleClass, this, 'grey-bg')} onTouchStart={_.bind(toggleClass, this, 'grey-bg')} onTouchEnd={_.bind(toggleClass, this, 'grey-bg')}>{this.props.leftContent}</a>;
    }
   
    return (
      <div className="system-dialog-alert" id={this.props.id}>
        <div className="system-mask" onClick={this.backHandler.bind(this)}></div>
        <div className="system-dialog">
          <div className="system-dialog-bd">{this.props.content}</div>
          <div className="system-dialog-ft">
            {leftBtn}
            <a onClick={this.props.handleConfirm} onTouchCancel={_.bind(toggleClass, this, 'grey-bg')} onTouchStart={_.bind(toggleClass, this, 'grey-bg')} onTouchEnd={_.bind(toggleClass, this, 'grey-bg')}>{this.props.footer}</a>
          </div>
        </div>
      </div>
    );
  }
}

export default SystemDialog;