import React from 'react';
import BarrageStore from '../../stores/BarrageStore';
import BarrageActions from '../../actions/BarrageActions';
import Config from '../../config';
import Modal from 'react-modal';

class Barrage extends React.Component {
  constructor(props) {
    super(props);
    this.state = BarrageStore.getState();
    this.onChange = this.onChange.bind(this);
    this.socket = null;
  }
  componentDidMount() {
    BarrageStore.listen(this.onChange);
    this.timer = setInterval(function () {
      if (!this.state.show) {
        return;
      }
      if (this.state.barrageMessages.length > 0) {
        $('#message-list').append('<li><div class="message">' + this.state.barrageMessages.shift()['content'] + '</div></li>');
        if ($("#message-list li").size() > 3) {
          $("#message-list li:first").remove();
        }
      } else {
        if (this.state.show && this.state.hasMessage) {
          BarrageActions.increasePage();
          BarrageActions.getBarrageMessages(this.state.messageKey, this.state.page, this.state.skip);
        }
      }
    }.bind(this), 1700);
  }

  componentWillReceiveProps(nextProps) {
    let messageKey = nextProps.show ? 'barrage_'.concat(nextProps.project.id) : null;

    this.state.messageKey = messageKey;
    this.state.page = 1;
    this.state.skip = 0;
    this.state.barrageMessages = [];
    this.state.show = nextProps.show;
    this.state.hasMessage = true;

    BarrageActions.updateState.defer(this.state);

    if (nextProps.show) {
      BarrageActions.getBarrageMessages.defer(messageKey, this.state.page, this.state.skip);
      this.socket = io.connect(Config.socketServer);
      this.socket.on(messageKey, (data) => {
        BarrageActions.increaseSkip();
        BarrageActions.updateBarrageMessages(data);
      });
    } else {
      if (this.socket != null) {
        this.socket.disconnect();
      }
    }
  }

  componentWillUnmount() {
    BarrageStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  sendMessage()  {
    let content = $.trim($('#content').val());
    if (content == '') {
      $('#content').val('');
      return;
    }
    this.socket.emit('barrage_message', {
      "content": content,
      "key": this.state.messageKey});
    $('#content').val('');
  };
  
  render() {

    return (
      <Modal {...this.props}  className="barrage-modal-class" overlayClassName="barrage-overlay-class" >
        <div className="barrage-modal-header">
          <div className="modal-title">{this.props.project.title}</div>
        </div>
        <div className="barrage-modal-body">
          <ul id="message-list" className="list-unstyled">
          </ul>
        </div>
        <div className="barrage-modal-footer">
          <input id="content" className="form-control" type="text" placeholder="发布弹幕" maxLength="30" />
          <button type="button" onClick={this.sendMessage.bind(this)}>发送</button>
        </div>
      </Modal>
    );
  }
}

export default Barrage;