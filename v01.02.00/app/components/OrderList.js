import React from 'react';
import Navbar from './common/Navbar';
import Navtab from './common/Navtab';
import NotFound from './common/NotFound';
import Error from './common/Error';
import Loading from './common/Loading';
import { jRedisId, getProductName, ajaxPost, toggleClass, getPaymentMethod } from './common/Utils';
import { withRouter } from 'react-router';
import OrderListStore from '../stores/OrderListStore';
import OrderListActions from '../actions/OrderListActions';
import LoginDialog from './common/LoginDialog';
import LoadingToast from './common/LoadingToast';

class OrderList extends React.Component {

  constructor(props) {
    super(props);
    this.tabItems = [
      {code: 'policys', name: '保单列表'},
      {code: 'orders', name: '订单列表'} 
    ];
    this.itemStatusText = {'01':'处理中', '02':'交易成功','03':'交易失败'};
    this.state = OrderListStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    OrderListStore.listen(this.onChange);
    this.state.orders = [];
    this.state.currentPage = 1;
    this.state.jRedisId = jRedisId();

    this.waypoint = new Waypoint({
      element: $('.list-group'),
      handler: (function() {
        if (this.waypoint) {
          this.waypoint.destroy();
        }
        $('#page-loading').show();

        let data = {jRedisId: this.state.jRedisId, pageNo: this.state.currentPage, pageSize: this.state.pageSize};
        ajaxPost(data, '/insuranceApi/api/v1/queryUserOrder',
          (function(result) {
            let orders = result.list;
            this.state.orders.push(...orders);
            this.state.currentPage += 1;
            this.state.loading = true;
            this.onChange(this.state);
            if (orders.length == this.state.pageSize) {
              this.waypoint = new Waypoint(this.waypoint.options);
            }
          }).bind(this),
          (function() {
            if (this.state.orders == 0) {
              this.state.error = true;
            }
            this.onChange(this.state);
          }).bind(this), $('#page-loading'), null, this);
      }).bind(this),
      offset: 'bottom-in-view'
    }, this);

    if (this.waypoint) {
      this.waypoint.enable();
    }
  }

  componentWillUnmount() {
    OrderListStore.unlisten(this.onChange);
    this.waypoint.disable();
  }

  onChange(state) {
    this.setState(state);
  }

  handleClick(item) {
    this.props.router.push('/order/' + item.id + '?from=list');
  }

  gotoPay(item) {
    $('#submit-loading').show();
    OrderListActions.paySubmit({jRedisId: jRedisId(), orderInfoId: item.id, paymentMethod: getPaymentMethod()});
  }

  tabSwitch(page) {
    if (page = 'policys') {
      this.props.router.replace('/policys');
    }
  }

  payRender(item) {
    if (item.productCode === 'sweet' && item.orderStatus === '01') {
      return <span className="order-pay" onClick={this.gotoPay.bind(this, item)}>立即付款</span>;
    }
  }

  bottomRender(item) {
    if (item.productCode === 'sweet' && item.orderStatus === '01') {
      return (
        <div className="info" onClick={this.handleClick.bind(this, item)}>
          <span className="bottom-content">订单将于下单30分钟后关闭</span>
        </div>
      );
    }
    let statusClass = 'tips tips-' + item.status;
    return (
      <div className="info" onClick={this.handleClick.bind(this, item)}>
        <span className={statusClass}>{this.itemStatusText[item.status]}</span>
        <span className="content">下单时间&nbsp;&nbsp;<i className="iconfont">&#xe603;</i>&nbsp;{item.createDate}</span>
      </div>
    );
  }
  
  render() {
    let notFound;
    if (this.state.orders.length == 0 && this.state.loading) {
      notFound = <NotFound desc='还没有购买过产品!' linkUrl='/' linkText='去看看' />;
    }

    let errorMsg;
    if (this.state.error) {
      errorMsg = <Error />;
    }

    return (
      <div id="page-order-list">
        <Navtab active="orders" tabItems={this.tabItems} tabItemClick={this.tabSwitch.bind(this)} />
        <section className="order-list">
          <ul className="list-group">
          {
            this.state.orders.map(function(item, index) {
              return (
              <div key={index} onTouchStart={_.bind(toggleClass, this, 'grey-bg')} onTouchEnd={_.bind(toggleClass, this, 'grey-bg')} className="list-group-item">
                <div className="title">
                  <span className="order-name" onClick={this.handleClick.bind(this, item)}>{getProductName(item.productCode)}</span>
                  {this.payRender(item)}
                </div>
                {this.bottomRender(item)}
              </div>)
          }, this)}
          </ul>
        </section>
        <Loading />
        <LoginDialog />
        <LoadingToast tips="正在转向支付页面, 请稍候" id="submit-loading" />
        {notFound}
        {errorMsg}
        <Navbar page='My' />
      </div>
    );
  }
}

export default withRouter(OrderList);