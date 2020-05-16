import React from 'react';
import Header from './common/Header';
import Validate from './common/Validate';
import PolicyBuyStore from '../stores/PolicyBuyStore';
import PolicyBuyActions from '../actions/PolicyBuyActions';
import { withRouter } from 'react-router';
import LoadingToast from './common/LoadingToast';
import { jRedisId, showToastr, toggleClass } from './common/Utils';
import InsuredInfo from './InsuredInfo';
import LoginDialog from './common/LoginDialog';
import InsuredCondition from './InsuredCondition';
import Modal from 'react-modal';

class PolicyBuy extends React.Component {

  constructor(props) {
    super(props);
    this.state = PolicyBuyStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    PolicyBuyStore.listen(this.onChange);
    PolicyBuyActions.initState();
    this.state = PolicyBuyStore.getState();
    this.submitBtnDisabledSet(true);
    $('#page-loading').show();
    if (this.props.params.id) {
      async.waterfall([
        (function(callback) {
          PolicyBuyActions.getOrderInfo({jRedisId: jRedisId(), orderInfoId: this.props.params.id}, callback);
        }).bind(this)],
        (function (err, insured) {
          _.each(insured, _.bind(function(value, index) {
            this.insuredAmountSet(index, this.getInsuredOld(this.getBirthdayByIdNo(value.insuredDocumentNo)));
          }, this));
          this.submitBtnChange();
        }).bind(this), this);
    } else {
      async.waterfall([
        function(callback) {
          PolicyBuyActions.getUserInfo({jRedisId: jRedisId()}, callback);
        }],
        (function (err, idNo) {
          if (Validate.isIdCard(idNo)) {
            this.insuredAmountSet('0', this.getInsuredOld(this.getBirthdayByIdNo(idNo)));
          }
          this.submitBtnChange();
        }).bind(this), this);
    }
    this.onChange(this.state);
  }

  componentWillUnmount() {
    PolicyBuyStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleSubmit() {
    if (!this.checkInsuredAmount()) {
      return;
    }

    let data = {jRedisId: jRedisId(), productCode: 'sweet', holderDocumentType: '01', insureds: []};
    
    data.paymentType = this.state.paymentType;
    data.premium = this.state.premium;
    data.totalPremium = this.state.premium;
    data.orderInfoId = this.state.orderInfoId;
    data.holderName = this.state.postData[0].insuredName;
    data.holderEmail = this.state.postData[0].insuredEmail;
    data.holderDocumentNo = this.state.postData[0].insuredDocumentNo;
    data.holderMobile = this.state.postData[0].insuredMobile;
    data.holderAddress = this.state.postData[0].insuredAddress;
    data.insureds = this.state.postData;
    data.referrerId = localStorage.getItem('ins_referrerId');

    $('#submit-loading').show();
    PolicyBuyActions.orderSubmit(data, this.props.router);
  }

  handleChange(event) {
    let name = event.target.name.split('.');
    let keyIndex = name[1];
    let keyName = name[2];
    let value = $.trim(event.target.value);
    let stateObj = this.state.insuredList[keyIndex];
    let postObj = this.state.postData[keyIndex];

    switch (keyName) {
      case 'insuredDocumentNo':
        if (this.idNoValidate(postObj, event)) {
          this.insuredAmountSet(keyIndex, this.getInsuredOld(this.getBirthdayByIdNo(value)));
        }
        break;
      case 'insuredMobile':
        value = value.substring(0, 11);
        this.mobileNoChange(postObj, event);
        break;
      case 'insuredEmail':
        if (event.type == 'blur') {
          this.emailChange(postObj, event);
        }
        break;
      case 'healthClaim':
        postObj[keyName] = !postObj[keyName];
        value = postObj[keyName];
        break;
      default: 
        postObj[keyName] = value;
        break;
    }
    stateObj[keyName] = value;
    this.calPremium(keyIndex, keyName);
    this.submitBtnChange();
    this.onChange(this.state);
  }

  handleDelete(event) {
    let index = event.target.getAttribute('data-index');
    this.state.insuredList.splice(index, 1);
    this.state.postData.splice(index, 1);

    this.calTotalPremium();
    this.submitBtnChange();
    this.onChange(this.state);

    if (this.state.insuredList.length < 10) {
      $('#insured-add').show();
    }
  }

  payChange(event) {
    this.state.paymentType = event.target.value;
    for (let i = 0; i < this.state.postData.length; i++) {
      this.calPremium(i, 'insuredDocumentNo');
    }
    this.onChange(this.state);
  }

  calPremium(index, name) {
    if (name != 'insuredDocumentNo' && name != 'insuranceAmount') {
      return;
    }
    let postObj = this.state.postData[index];
    let stateObj = this.state.insuredList[index];

    let id = this.getSelectorName(index, 'premium');
    if (_.isEmpty(postObj['insuredDocumentNo'])
        || _.isEmpty(postObj['insuranceAmount'])
        || _.isEmpty(this.state.paymentType)) {
      stateObj.premium = '';
      postObj.premium = '';
      $(id).text('-');
      this.calTotalPremium();
      this.onChange(this.state);
      return;
    }
    let queryData = this.premiumQueryData(postObj);
    let totalPremium = 0;

    async.waterfall([
      (function(callback) {
        stateObj.premium = '';
        postObj.premium = '';
        this.onChange(this.state);
        $(id).text('');
        $("<img src='img/loading.gif' />").appendTo($(id));
        PolicyBuyActions.getPremium(queryData, callback);
      }).bind(this),
      (function(premium, callback) {
        $(id).text('');
        stateObj.premium = premium;
        postObj.premium = premium;
        this.onChange(this.state);
        callback(null, 'done');
      }).bind(this)],
      (function (err, result) {
        this.calTotalPremium();
      }).bind(this), this);
  }

  calTotalPremium() {
    this.state.premium = '';
    $('#premium').text('-');

    let totalPremium = 0;
    _.each(this.state.insuredList, function(ele) {
      totalPremium += Number(ele.premium);
    }, totalPremium);

    $('#premium').text(totalPremium.toFixed(2));
    this.state.premium = totalPremium.toFixed(2);
    this.onChange(this.state);
    this.submitBtnChange();
  }

  premiumQueryData(postObj) {
    let data = {};
    data.birthday = this.getBirthdayByIdNo(postObj.insuredDocumentNo);
    data.sex = this.getSexByIdNo(postObj.insuredDocumentNo);
    data.paymentType = this.state.paymentType;
    data.insuranceAmount = postObj.insuranceAmount;

    return data;
  }

  oldIsAllowed(birthday, target) {
    let old = this.getInsuredOld(birthday);
    if (old < 18 || old > 60) {
      showToastr('被保人只能18-60周岁', target);
      return false;
    }
    return true;
  }

  getInsuredOld(birthday) {
    let old = new Date().getFullYear() -  birthday.substring(0, 4) + 1;
    if (!(birthday.substring(5, 7) == 1 && birthday.substring(8) == 1)) {
      old -= 1;
    }
    return old;
  }

  insuredAmountSet(index, old) {
    let amount1 = this.getSelectorName(index, 'amount1');
    let amount2 = this.getSelectorName(index, 'amount2');
    if (old > 40) {
      $(amount1).click();
      $(amount2).attr('disabled', 'true');
    } else {
      $(amount2).removeAttr('disabled');
    }
  }

  checkInsuredAmount() {
    let mainAmount = this.state.postData[0].insuranceAmount;
    if (mainAmount === '02') {
      return true;
    }

    let index = 0;
    let insured = _.find(this.state.postData.slice(1), function(data) {
      index++;
      return data.insuranceAmount !== mainAmount;
    }, index);

    if (_.isUndefined(insured)) {
      return true;
    }

    showToastr('附属被保人'+index+'保额不能超过主被保人保额');
    return false;
  }

  submitBtnChange() {
    if (this.state.postData.length < 3) {
      this.submitBtnDisabledSet(true);
      return;
    }
    if(_.find(this.state.postData, this.hasEmptyElement)
      || _.isEmpty(this.state.paymentType)
      || $('#agreement').is(':checked') == false) {
      this.submitBtnDisabledSet(true);
      return;
    }

    this.submitBtnDisabledSet(false);
  }

  hasEmptyElement(object) {
    let emptyElement = _.find(object, function(value) {
      return !value ;
    });
    return !_.isUndefined(emptyElement);
  }

  submitBtnDisabledSet(disabled) {
    $('#policySubmit').attr('disabled', disabled);
  }

  idNoValidate(postObj, event) {
    let value = event.target.value.toUpperCase();
    let type = event.type;
    postObj['insuredDocumentNo'] = '';
    if (((type == 'change' && value.length == 18) || (type == 'blur' && value.length < 18 && !_.isEmpty(value)))
        && !Validate.isIdCard(value)) {
      showToastr('请填写有效的身份证号码', event.target);
      return false;
    }

    if (Validate.isIdCard(value) && this.idNoNotRepeat(value, event) && this.oldIsAllowed(this.getBirthdayByIdNo(value), event.target)) {
      event.target.blur();
      postObj['insuredDocumentNo'] = value;
      return true;
    }
    return false;
  }

  idNoNotRepeat(idNo, event) {
    let result = _.find(this.state.postData, function(insured) {
      return insured.insuredDocumentNo == idNo;
    }, idNo);
    if (!_.isUndefined(result)) {
      showToastr('被保人身份证号不能重复', event.target);
      return false;
    }
    return true;
  }

  getBirthdayByIdNo(value) {
    let birthday = value.length == 18 ? value.substring(6, 14) : '19' + value.substring(6, 12);
    return birthday.substring(0, 4) + '-' + birthday.substring(4, 6) + '-' + birthday.substring(6);
  }

  getSexByIdNo(value) {
    let sex = value.length == 18 ? value.charAt(value.length - 2) : value.charAt(value.length - 1);
    return sex % 2 == 0 ? '02' : '01';
  }

  mobileNoChange(postObj, event) {
    let value = event.target.value;
    postObj['insuredMobile'] = '';
    if (event.type == 'blur' && !Validate.isMobile(value) && !_.isEmpty(value))  {
      showToastr('请填写正确的手机号码', event.target);
      return;
    }

    if (Validate.isMobile(value)) {
      event.target.blur();
      postObj['insuredMobile'] = value;
    }
  }

  emailChange(postObj, event) {
    let value = event.target.value;
    postObj['insuredEmail'] = '';
    if (!Validate.isEmail(value) && !_.isEmpty(value))  {
      showToastr('请填写正确的电子邮箱', event.target);
      return;
    }
    postObj['insuredEmail'] = value;
  }

  getSelectorName(prefix, name) {
    return '#insured_' + prefix + '_' + name;
  }

  insuredAdd(event) {
    this.state.insuredList.push({
      insuranceAmount: '',
      insuredName: '',
      insuredDocumentType: '01',
      insuredDocumentNo: '',
      insuredMobile: '',
      holderRelation: '02',
      premium: '',
      healthClaim: false
    });
    this.state.postData.push({
      insuranceAmount: '',
      insuredName: '',
      insuredDocumentType: '01',
      insuredDocumentNo: '',
      insuredMobile: '',
      holderRelation: '02',
      premium: '',
      healthClaim: false
    });
    this.onChange(this.state);

    $('html, body').animate({ 
      scrollTop: $("#insured-add").offset().top - 100 + 'px'
    }, 500);

    if (this.state.insuredList.length == 10) {
      $('#insured-add').hide();
    }

    this.submitBtnDisabledSet(true);
  }

  openConditionModal() {
    this.state.modalShow = true;
    this.onChange(this.state);
  }


  
  render() {
    const InsuredConditionModal = React.createClass({
      render() {
        return (
          <Modal className="ModalClass system-bg" overlayClassName="OverlayClass" {...this.props} >
            <InsuredCondition modal={true} onHide={this.props.onHide} />
          </Modal>
        );
      }
    });

    let modalClose = () => this.setState({ modalShow: false });

    return (
      <div id="page-buy">
        <Header title="投保详情" goBack={true} />
        <div className="header-text">投保方案</div>
        <section className="policy-content">
          <ul className="list-unstyled">
            <li className="list-group-item">
              <div>缴费方式</div>
              <div>
                <label className="radio-inline radio-fix-width">
                  <input type="radio" name="insuredPlan.paymentType" id="single" value="01" checked={this.state.paymentType == '01'} onChange={this.payChange.bind(this)} />
                  <span className="virtual-radio" />
                  <span>趸交</span>
                </label>
                <label className="radio-inline radio-fix-width">
                  <input type="radio" name="insuredPlan.paymentType" id="5years" value="02" checked={this.state.paymentType == '02'} onChange={this.payChange.bind(this)} />
                  <span className="virtual-radio" />
                  <span>5年缴</span>
                </label>
                <label className="radio-inline radio-fix-width">
                  <input type="radio" name="insuredPlan.paymentType" id="10years" value="03" checked={this.state.paymentType == '03'} onChange={this.payChange.bind(this)} />
                  <span className="virtual-radio" />
                  <span>10年缴</span>
                </label>
              </div>
            </li>
          </ul>
        </section>
        {
          this.state.insuredList.map(function(insured, index) {
              return (
                <InsuredInfo key={index} id={index} insured={insured} mainInsured={index == 0 ? true : false} handleChange={this.handleChange.bind(this)} handleDelete={this.handleDelete.bind(this)} openModal={this.openConditionModal.bind(this)} />
              );
          }, this)
        }
        <section id="insured-add" className="insured-add">
          <div onTouchCancel={_.bind(toggleClass, this, 'grey-bg')} onTouchStart={_.bind(toggleClass, this, 'grey-bg')} onTouchEnd={_.bind(toggleClass, this, 'grey-bg')} onClick={this.insuredAdd.bind(this)} >
            +添加被保人<span className="policy-tips">不超过10人</span>
          </div>
        </section>

        <section className="info-confirm" id="info-confirm">
          <label className="checkbox-inline">
            <input type="checkbox" value="1" name="agreement.check" id="agreement" onChange={this.submitBtnChange.bind(this)} defaultChecked />
            <span className="virtual-checkbox" />
            <span>本人承诺所填写的信息真实有效</span>
          </label>
        </section>
        <div className="bottom-tab">
          <div>
            <span>保费</span>
            <span id="premium" className="premium-value">{this.state.premium ? this.state.premium : '-'}</span>
            <span>元</span>
          </div>
          <button className="btn btn-default" id="policySubmit" onClick={this.handleSubmit.bind(this)} >我要投保</button>
        </div>
        <div></div>
        <LoginDialog />
        <InsuredConditionModal isOpen={this.state.modalShow} onHide={modalClose} />
        <LoadingToast tips="正在核保中, 请稍候" id="submit-loading" />
        <LoadingToast tips="数据加载中, 请稍候" id="page-loading" />
      </div>
    );
  }
}

export default withRouter(PolicyBuy);