import React from 'react';
import Header from './common/Header';
import { withRouter } from 'react-router';
import SystemDialog from './common/SystemDialog';
import LoadingToast from './common/LoadingToast';
import { jRedisId } from './common/Utils';
import InsuredStore from '../stores/InsuredStore';
import InsuredActions from '../actions/InsuredActions';
import LoginDialog from './common/LoginDialog';

class InsuredCondition extends React.Component {

  constructor(props) {
    super(props);
    this.state = InsuredStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    InsuredStore.listen(this.onChange);
  }

  componentWillUnmount() {
    InsuredStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  showDialog() {
    $('#insured-confrim').show();
  }

  goProductPage() {
    this.props.router.push('/products');
  }

  gotoInsurePage() {
    $('#query-loading').show();
      async.waterfall([
        function(callback) {
          InsuredActions.getUnpaidOrder({jRedisId: jRedisId()}, callback);
        }],
        (function (err, data) {
          if (data.orderNum === 0) {
            this.props.router.push('/policy/buy/sweet');
          } else {
            this.state.orderNum = data.orderNum;
            this.state.orderInfoId = data.orderInfoId;
            if (data.orderNum > 1) {
              this.state.confirmFooter = '订单列表';
            }
            this.onChange(this.state);
          }
          
          $('#unPaidOrder-confirm').show();
        }).bind(this), this);
  }

  handleConfirm() {
    if (this.state.orderNum === 1) {
      this.props.router.push('/policy/buy/sweet/' + this.state.orderInfoId);
    } else {
      this.props.router.push('/orders');
    }
  }

  leftHandle() {
    this.props.router.push('/policy/buy/sweet');
  }
  
  render() {
    let bottomRender = () => {
      if (this.props.modal) {
        return (
          <div>
            <section className="info-confirm" id="info-confirm">
              <label className="checkbox-inline">
                <input type="checkbox" value="1" name="agreement.check" id="agreement" readOnly checked />
                <span className="virtual-checkbox" />
                <span>本人承诺不存在上述情况，符合投保条件。</span>
              </label>
            </section>
            <div className="bottom-tab">
              <a className="btn btn-default btn-tel" href="tel:4000082159" ><i className="iconfont">&#xe622;</i><span>400-008-2159</span></a>
              <button className="btn btn-default btn-continue" onClick={this.props.onHide} >确定</button>
            </div>
            <div></div>
          </div>
        );
      }
      return (
        <div>
          <div className="bottom-tab">
            <button className="btn btn-default btn-stop" onClick={this.showDialog.bind(this)} >存在以上情况</button>
            <button className="btn btn-default btn-continue" onClick={this.gotoInsurePage.bind(this)} >不存在, 继续</button>
          </div>
          <div></div>
        </div>
      );
    }

    return (
      <div id="page-insured-condition">
        <Header title='被保人健康告知' goBack={!this.props.modal} close={this.props.modal} onClose={this.props.onHide} />
        <div></div>
        <section className="condition-items">
          <ul className="list-unstyled">
            <li className="list-group-item">
              <div className="header-text">请确认是否存在以下问题：</div>
            </li>
            <li className="list-group-item">
              <span>1</span>
              <span>您确诊糖尿病是否达到10年？</span>
            </li>
            <li className="list-group-item">
              <span>2</span>
              <span>您是否存在以下一种或几种情况：肢体末端变黑或组织溃烂，视力下降，反复头痛、晕厥、昏迷，尿蛋白阳性？</span>
            </li>
            <li className="list-group-item">
              <span>3</span>
              <span>您是否曾经患有、正患有或者被怀疑患有以下一种或几种疾病：糖尿病视网膜病变、视神经病变、失明、脑血管病变、短暂性脑缺血发作、脑中风、糖尿病酮症酸中毒、高渗性昏迷、慢性肾脏疾病、肾功能衰竭、糖尿病酮症酸中毒、高渗性昏迷、慢性肾脏疾病、肾功能衰竭、糖尿病足或糖尿病足截肢术后、糖尿病外周神经病变？</span>
            </li>
          </ul>
        </section>
        {bottomRender()}
        <SystemDialog id="insured-confrim" handleConfirm={this.goProductPage.bind(this)} content="很抱歉，由于不符合投保条件，不能投保。" footer="查看其他产品" />
        <SystemDialog id="unPaidOrder-confirm" handleConfirm={this.handleConfirm.bind(this)} content={'存在'+this.state.orderNum+'笔未支付订单'} footer={this.state.confirmFooter} leftHandle={this.leftHandle.bind(this)} leftContent="忽略" />
        <LoadingToast tips="数据查询中, 请稍候" id="query-loading" />
        <LoginDialog />
      </div>
    );
  }
}

export default withRouter(InsuredCondition);