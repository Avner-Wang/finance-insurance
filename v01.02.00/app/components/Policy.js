import React from 'react';
import Header from './common/Header';
import { jRedisId, getProductName, getCompnayCode, getInsperiodDesc, getRelationDesc, getPolicyStatusDesc } from './common/Utils';
import PolicyStore from '../stores/PolicyStore';
import PolicyActions from '../actions/PolicyActions';
import Config from '../config';
import LoadingToast from './common/LoadingToast';
import LoginDialog from './common/LoginDialog';

class Policy extends React.Component {

  constructor(props) {
    super(props);
    this.state = PolicyStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    PolicyStore.listen(this.onChange);

    PolicyActions.initState();
    
    $('#page-loading').show();
    this.state.insurancebaseid = this.props.params.id;
    PolicyActions.getPolicy({ jRedisId: jRedisId(), insurancebaseid: this.state.insurancebaseid });
  }

  componentWillUnmount() {
    PolicyStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  openPdfWindow(productCode, fileName) {
    let source = getCompnayCode(productCode);
    window.open(Config.basename + "pdf/viewer.html?file=./resource/" + source + "/" + productCode + "/" + fileName, "_self");
  }

  handleHeader(id, no) {
    if (no == '1') {
      $('#' + id + '-1').removeClass('hide').show();
      $('#' + id + '-2').hide();
      $('#' + id).hide();
    } else {
      $('#' + id + '-1').hide();
      $('#' + id + '-2').removeClass('hide').show();
      $('#' + id).removeClass('hide').show();
    }
  }

  insuredHeaderShow(index) {
    if (this.state.policy.insured.length > 1) {
      return (
        <li className={index > 0 ? 'list-group-item insured-title has-top-border' : 'list-group-item insured-title'}>
          <span>被保人-{index + 1}</span>
          <span>&nbsp;</span>
        </li>
      );
    }
  }
  
  render() {
    return (
      <div id="page-policy">
        <Header title='保单详情' goBack={true} />
        <div></div>
        <section className="policy-header">
          <ul className="list-group">
            <li className="list-group-item">
              <img className="company-logo" src={this.state.policy.productCode == null ? '' : "img/company-logo-" +  getCompnayCode(this.state.policy.productCode)  + ".png"} />
            </li>
            <li className="list-group-item product-name">{getProductName(this.state.policy.productCode)}</li>
            <li className="list-group-item product-no">
              <span className="order-status">{getPolicyStatusDesc(this.state.policy.status)}</span>
              <span>NO.{this.state.policy.insurancePolicyNo}</span>
            </li>
          </ul>
        </section>
        <div className="insured-header hide" id="policy-content-1" onClick={this.handleHeader.bind(this, 'policy-content', '2')}>
          <span>保单信息</span>
          <span className="insured-icon open"></span>
        </div>
        <div className="insured-header" id="policy-content-2" onClick={this.handleHeader.bind(this, 'policy-content', '1')}>
          <span>保单信息</span>
          <span className="insured-icon fold"></span>
        </div>
        <section className="policy-content" id="policy-content">
          <ul className="list-unstyled">
            <li className="list-group-item">
              <span>保单号</span>
              <span>{this.state.policy.insurancePolicyNo}</span>
            </li>
            <li className="list-group-item">
              <span>保费</span>
              <span className="amount-text">{this.state.policy.totalPremium}元</span>
            </li>
            <li className="list-group-item">
              <span>保额</span>
              <span className="amount-text">{this.state.policy.insuranceAmount ? this.state.policy.insuranceAmount + '元' : '-'}</span>
            </li>
            <li className="list-group-item">
              <span>保险起期</span>
              <span>{this.state.policy.insBeginDate}</span>
            </li>
            <li className="list-group-item">
              <span>保险止期</span>
              <span>{this.state.policy.insEndDate == null ? '终身' : this.state.policy.insEndDate}</span>
            </li>
            <li className="list-group-item">
              <span>保险期限</span>
              <span>{getInsperiodDesc(this.state.policy.insPeriodType, this.state.policy.insPeriod)}</span>
            </li>
            <li className="list-group-item">
              <span>投保人</span>
              <span>{this.state.policy.holderName}</span>
            </li>
          </ul>
        </section>
        <div className="insured-header" id="policy-info-1" onClick={this.handleHeader.bind(this, 'policy-info', '2')}>
          <span>被保人信息</span>
          <span className="insured-icon open"></span>
        </div>
        <div className="insured-header hide" id="policy-info-2" onClick={this.handleHeader.bind(this, 'policy-info', '1')}>
          <span>被保人信息</span>
          <span className="insured-icon fold"></span>
        </div>
        <section className="policy-content no-top-border hide" id="policy-info">
          <ul className="list-unstyled">
            {
              this.state.policy.insured.map(function(insured, index) {
                return (
                  <div key={index}>
                    {this.insuredHeaderShow(index)}
                    <li className="list-group-item">
                      <span className="insured-text">被保人姓名</span>
                      <span>{insured.insuredName}</span>
                    </li>
                    <li className="list-group-item">
                      <span className="insured-text">与投保人关系</span>
                      <span>{getRelationDesc(insured.holderRelation)}</span>
                    </li>
                    <li className="list-group-item">
                      <span className="insured-text">保额</span>
                      <span>{insured.insuranceAmount}</span>
                    </li>
                    <li className="list-group-item">
                      <span className="insured-text">保费</span>
                      <span>{insured.premium}</span>
                    </li>
                  </div>
                );
            }, this)}
          </ul> 
        </section>
        <div className="content-header flex-display">
          <span>受益人</span>
          <span>法定</span>
        </div>
        <div className="header-text">
          <span>附件</span>
          <span></span>
        </div>
        <section className="policy-content">
          <ul className="list-unstyled">
            {
              this.state.productFiles.map(function(item, index) {
                return (
                  <li className="list-group-item file-link" key={index} onClick={this.openPdfWindow.bind(this, this.state.policy.productCode, item.file)}>
                    <span>{index + 1}.&nbsp;&nbsp;{item.desc}</span>
                    <span>&nbsp;</span>
                  </li>
                );
              }, this)
            }
          </ul>
        </section>
        <LoadingToast tips="数据加载中, 请稍候" id="page-loading" />
        <LoginDialog />
      </div>
    );
  }
}

export default Policy;