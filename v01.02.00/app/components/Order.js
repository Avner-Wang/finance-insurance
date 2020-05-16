import React from 'react';
import Header from './common/Header';
import { withRouter } from 'react-router';
import SystemDialog from './common/SystemDialog';
import LoadingToast from './common/LoadingToast';
import { getPaymentMethod } from './common/Utils';
import OrderStore from '../stores/OrderStore';
import OrderActions from '../actions/OrderActions';
import { jRedisId, getRelationDesc, getInsperiodDesc, getOrderStatusDesc, getProductName, getCompnayDesc, getCompnayCode} from './common/Utils';

class Order extends React.Component {

  constructor(props) {
    super(props);
    this.state = OrderStore.getState();
    this.onChange = this.onChange.bind(this);
    this.from = this.props.location.query.from;
  }

  routerWillLeave(nextLocation) {
    if (!this.state.leaveConfirm && !(this.from === 'list')) {
      $('#policy-confirm').show();
      return false;
    }
  }

  componentDidMount() {
    OrderStore.listen(this.onChange);
    $('#page-loading').show();

    this.state.leaveConfirm = false;
    this.props.router.setRouteLeaveHook(
      this.props.route,
      this.routerWillLeave.bind(this));

    OrderActions.getOrderInfo({ jRedisId: jRedisId(), orderInfoId: this.props.params.id });
  }

  componentWillUnmount() {
    OrderStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  goToPay() {
      this.state.leaveConfirm = true;
      $('#submit-loading').show();
      let data = {jRedisId: jRedisId(), orderInfoId: this.state.policy.orderInfoId, paymentMethod: getPaymentMethod()};
      OrderActions.paySubmit(data);
  }

  handleConfirm() {
    this.state.leaveConfirm = true;
    this.props.router.push('/');
  }

  leftHandle() {
    this.state.leaveConfirm = true;
    this.props.router.push('/policy/buy/sweet/' + this.state.policy.orderInfoId);
  }

  handleHeader(id, no) {
    $('#insured-header2-' + id).toggle();  
    if (no == '1') {
      $('#insured-header1-' + id).hide();
      $('#insured-content-' + id).hide();
    } else {
      $('#insured-header1-' + id).removeClass('hide').show();
      $('#insured-content-' + id).removeClass('hide').show();
    }
  }

  getHolderData() {
    let data = {};
    data.insuredName = this.state.policy.holderName;
    data.insuredDocumentNo = this.state.policy.holderDocumentNo;
    data.insuredMobile = this.state.policy.holderMobile;
    data.insuredAddress = this.state.policy.holderAddress;
    data.insuredEmail = this.state.policy.holderEmail;

    return data;
  }
  
  insuredInfo(index, item) {
    let headerText = () => {
      if (index === 'holder') {
        return '投保人';
      }
      if (this.state.policy.insured.length === 1) {
        return '被保人';
      }
      return '被保人-' + (index + 1);
    }

    let contactShow = () => {
      if (index === 'holder') {
        return (
          <div>
          <li>
            <div>联系地址</div>
            <div>{item.insuredAddress}</div>
          </li>
          <li>
            <div>电子邮箱</div>
            <div>{item.insuredEmail}</div>
          </li>
          </div>
        )
      }
    }

    let baseInfoShow = () => {
      if (index === 'holder' || item.holderRelation !== '01') {
        return (
          <div>
          <li>
            <div>姓名&#12288;&#12288;</div>
            <div>{item.insuredName}</div>
          </li>
          <li>
            <div>身份证号</div>
            <div>{item.insuredDocumentNo}</div>
          </li>
          <li>
            <div>手机号码</div>
            <div>{item.insuredMobile}</div>
          </li>
          </div>
        )
      }
    }

    let policyInfoShow = () => {
      if (index !== 'holder') {
        return (
          <div>
            <li>
              <div>保费&#12288;&#12288;</div>
              <div>{item.premium}元</div>
            </li>
            <li>
              <div>保额&#12288;&#12288;</div>
              <div>{item.insuranceAmount}元</div>
            </li>
            <li>
              <div>与投保人关系</div>
              <div>{getRelationDesc(item.holderRelation)}</div>
            </li>
          </div>
        )
      }
    }

    return (       
      <div key={index} id={'page-insured-info-' + index}>
        <div className="insured-header hide" id={'insured-header1-' + index} onClick={this.handleHeader.bind(this, index, '1')}>
          <span>{headerText()}</span>
          <span className="insured-icon fold"></span>
        </div>
        <div className="insured-header" id={'insured-header2-' + index} onClick={this.handleHeader.bind(this, index, '2')}>
          <span>{headerText()}</span>
          <span>{item.insuredName}</span>
          <span className="insured-icon open"></span>
        </div>
        <section className="item-content no-top-border hide" id={'insured-content-' + index}>
          <ul className="list-unstyled">
            {policyInfoShow()}
            {baseInfoShow()}
            {contactShow()}
          </ul>
        </section>
      </div>
    );
  }

  render() {

    let headerRender = () => {
      if (this.from === 'list') {
        return <Header title={headerText} backUrl="/orders" />;
      }
      return <Header title={headerText} goBack={true} />;
    }

    let payTypeDesc = ()　=> {
      switch(this.state.policy.paymentType) {
        case '01': return '趸缴'; break;
        case '02': return this.state.policy.paymentPeriod + '年缴'; break;
        default: return;
      }
    }

    let headerText = this.from === 'list' ? '订单信息' : '订单确认';

    let bottomTabRender =() => {
      if (this.from === 'list') {
        if (this.state.order.status === '01' && this.state.policy.productCode === 'sweet') {
          return (
            <div className="bottom-tab modify">
              <button className="btn btn-default btn-modify" onClick={this.leftHandle.bind(this)} >进入修改</button>
              <button className="btn btn-default" onClick={this.goToPay.bind(this)} >去支付</button>
            </div>
          ); 
        }
        return '';
      } else {
        return (
          <div className="bottom-tab pay">
            <div>
              <span>需支付</span>
              <span id="premium" className="premium-value">{this.state.policy.totalPremium}</span>
              <span>元</span>
            </div>
            <button className="btn btn-default" onClick={this.goToPay.bind(this)} >去支付</button>
          </div>
        );
      }

    }

    return (
      <div id="page-order">
        {headerRender()}
        <div></div>
        <section className="product-info">
          <div className="product-title">{getProductName(this.state.policy.productCode)}</div>
          <div>
            <span className="company-tag">{getCompnayDesc(getCompnayCode(this.state.policy.productCode))}</span>
          </div>
        </section>
        <div className="item-header">基本信息</div>
        <section className="item-content">
          <ul className="list-unstyled">
            <li>
              <div>订单金额</div>
              <div><span className="premium-value">{this.state.policy.totalPremium}</span>元</div>
            </li>
            <li>
              <div>订单号&#12288;</div>
              <div>{this.state.order.orderId}</div>
            </li>
            <li>
              <div>下单时间</div>
              <div>{this.state.order.purchaseTime}</div>
            </li>
            <li>
              <div>订单状态</div>
              <div>{getOrderStatusDesc(this.state.order.status)}</div>
            </li>
          </ul>
        </section>
        <div className="item-header">保单信息</div>
        <section className="item-content">
          <ul className="list-unstyled">
            <li>
              <div>缴费方式</div>
              <div>{payTypeDesc()}</div>
            </li>
            <li>
              <div>保障期限</div>
              <div>{getInsperiodDesc(this.state.policy.insPeriodType, this.state.policy.insPeriod)}</div>
            </li>
            <li>
              <div>生效日期</div>
              <div>{this.state.policy.insBeginDate}</div>
            </li>
            <li>
              <div>结束日期</div>
              <div>{this.state.policy.insEndDate}</div>
            </li>
          </ul>
        </section>
        {this.insuredInfo('holder', this.getHolderData())}
        {
          this.state.policy.insured.map(function(item, index) {
            return this.insuredInfo(index, item);
          }, this)
        }
        <div className="content-header flex-display">
          <span>受益人</span>
          <span>法定</span>
        </div>
        {bottomTabRender()}
        <div></div>
        <SystemDialog id="policy-confirm" handleConfirm={this.handleConfirm.bind(this)} content="未付款订单将在下单30分钟后关闭,可在&nbsp;[我的保险]-[保单列表]&nbsp;中继续支付。" footer="狠心离开" leftHandle={this.leftHandle.bind(this)} leftContent="订单修改" backClick={true} />
        <LoadingToast tips="正在转向支付页面, 请稍候" id="submit-loading" />
        <LoadingToast tips="数据加载中, 请稍候" id="page-loading" />
      </div>
    );
  }
}

export default withRouter(Order);