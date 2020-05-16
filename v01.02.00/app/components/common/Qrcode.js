import React from 'react';

class Qrcode extends React.Component {

  constructor(props) {
    super(props);
  }

  close() {
    $('#' + this.props.id).hide();
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (_.isEmpty(nextProps.text)) {
      return;
    }
    $('#qrcode').empty();
    $('#qrcode').qrcode({
      render: 'image',
      text: nextProps.text,
      size: screen.width * 1.7 - 100
    });
  }
  
  render() {

    return (
      <div className="system-dialog-alert page-qrcode" id={this.props.id}>
        <div className="system-mask" onClick={this.close.bind(this)}></div>
        <div className="system-dialog">
          <div className="closeBtn"><i className="iconfont" onClick={this.close.bind(this)}>&#xe66e;</i></div>
          <div id="qrcode" className="code"></div>
          <div className="desc">{this.props.desc}</div>
        </div>
      </div>
    );
  }
}

export default Qrcode;