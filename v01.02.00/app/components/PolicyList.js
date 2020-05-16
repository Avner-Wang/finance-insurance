import React from 'react';
import Navbar from './common/Navbar';
import Navtab from './common/Navtab';
import NotFound from './common/NotFound';
import Error from './common/Error';
import Loading from './common/Loading';
import { Link, withRouter } from 'react-router';
import PolicyListStore from '../stores/PolicyListStore';
import PolicyListActions from '../actions/PolicyListActions';
import { jRedisId, getProductName, ajaxPost, toggleClass, getPolicyStatusDesc } from './common/Utils';
import LoginDialog from './common/LoginDialog';

class PolicyList extends React.Component {

  constructor(props) {
    super(props);
    this.tabItems = [
      {code: 'policys', name: '保单列表'},
      {code: 'orders', name: '订单列表'} 
    ];
    this.state = PolicyListStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    PolicyListStore.listen(this.onChange);
    this.state.orders = [];
    this.state.currentPage = 1;
    this.waypoint = new Waypoint({
      element: $('.list-group'),
      handler: (function() {
        if (this.waypoint) {
          this.waypoint.destroy();
        }
        $('#page-loading').show();

        let data = {jRedisId: jRedisId(), pageNo: this.state.currentPage, pageSize: this.state.pageSize};
        ajaxPost(data, '/insuranceApi/api/v1/queryUserInsurance',
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
    PolicyListStore.unlisten(this.onChange);
    this.waypoint.disable();
  }

  onChange(state) {
    this.setState(state);
  }

  tabSwitch(page) {
    if (page = 'orders') {
      this.props.router.replace('/orders');
    }
  }
  
  render() {
    let notFound;
    if (this.state.orders.length == 0 && this.state.loading) {
      notFound = <NotFound desc='还没有购买过保单!' linkUrl='/' linkText='去看看' />;
    }

    let errorMsg;
    if (this.state.error) {
      errorMsg = <Error />;
    }

    return (
      <div id="page-policy-list">
        <Navtab active="policys" tabItems={this.tabItems} tabItemClick={this.tabSwitch.bind(this)} />
        <section className="policy-list">
          <ul className="list-group">
            {
              this.state.orders.map(function(item, index) {
                return (<Link to={`/policy/${item.insuranceBaseId}`} onTouchCancel={_.bind(toggleClass, this, 'grey-bg')} onTouchStart={_.bind(toggleClass, this, 'grey-bg')} onTouchEnd={_.bind(toggleClass, this, 'grey-bg')} key={index} className="list-group-item" >
                          <div className="title">
                            <span>{getProductName(item.productCode)}</span>
                          </div>
                          <div className="info">
                            <span className={"tips tips-"+ item.status}>{getPolicyStatusDesc(item.status)}</span>
                            <span className="content">保障期限&nbsp;&nbsp;<i className="iconfont">&#xe603;</i>&nbsp;{item.insBeginDate} ~ <i className="iconfont">&#xe603;</i>&nbsp;{item.insEndDate == '' ? '终身' : item.insEndDate}</span>
                          </div>
                        </Link>
                        );
              }, this)}
          </ul>
        </section>
        <Loading />
        <LoginDialog />
        {notFound}
        {errorMsg}
        <Navbar page='My' />
      </div>
    );
  }
}

export default withRouter(PolicyList);