import React from 'react';
import SuccessStore from '../stores/SuccessStore';
import SuccessActions from '../actions/SuccessActions';
import { Link } from 'react-router';
import Header from './common/Header';

class Success extends React.Component {

  constructor(props) {
    super(props);
    this.state = SuccessStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    SuccessStore.listen(this.onChange);
    Arg.coerceMode = false;
    SuccessActions.synchronizeCallback(Arg.query());
  }

  componentWillUnmount() {
    SuccessStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }
  
  render() {
    let policyRender;
    if (this.state.policy.policyNo) {
      policyRender = <li><span>保单号:</span><span>{this.state.policy.policyNo}</span></li>;
    }
    return (
      <div id="buy-success-page">
        <Header title='购买成功' hideBack={true} />
        <section className="delivery-info">
          <div className="title"><img src={this.state.policy.productCode == null ? '' : "img/" + this.state.policy.productCode + ".jpg"} /></div>
          <div className="receiver">
            <ul className="list-unstyled">
              {policyRender}
              <li>
                <span>订单号:</span>
                <span>{this.state.policy.orderId}</span>
              </li>
            </ul>
          </div>
          <div className="total-price">
            <span>总价:</span>
            <span>¥<strong>{this.state.policy.grossPremium.substring(0, this.state.policy.grossPremium.indexOf('.'))}</strong>{this.state.policy.grossPremium.substring(this.state.policy.grossPremium.indexOf('.'))}</span>
          </div>
          <div className="container action-group">
            <div className="col-xs-6">
              <Link to="/" className="btn btn-default">返回首页</Link>
            </div>
            <div className="col-xs-6">
              <Link to={`/order/${this.state.policy.orderInfoId}?from=list`} className="btn btn-default">查看订单</Link>
            </div>
          </div>
        </section>
        <section className="prompt-message">
          <div>
            <dl>
              <dt>安全小贴士</dt>
              <dd>付款成功后，客服不会以付款异常、系统升级等原因联系您。<strong>请勿泄露银行卡号、手机验证码，否则会造成钱款损失。谨访电话诈骗！</strong></dd>
            </dl>
          </div>
        </section>
      </div>
    );
  }
}

export default Success;