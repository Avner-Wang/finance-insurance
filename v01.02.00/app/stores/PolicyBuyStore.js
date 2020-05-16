import alt from '../alt';
import PolicyBuyActions from '../actions/PolicyBuyActions';

class PolicyBuyStore {
  constructor() {
    this.bindActions(PolicyBuyActions);
    this.onInitState();
  }

  onInitState() {
    this.modalShow = false;
    this.agreement = {check: '1'};
    this.premium = '';
    this.paymentType = '';
    this.orderInfoId = '';
    /*
      todo: insuranceList = postData.concat();
      以上赋值会出现界面值修改时，insuranceList和postData同时修改，具体原因待查。
      onInitPolicyInfo()和onInitMainInsured()存在同样问题
    */
    this.postData = [
      { 
        insuranceAmount: '',
        insuredName: '',
        insuredDocumentType: '01',
        insuredDocumentNo: '',
        insuredMobile: '',
        insuredAddress: '',
        insuredEmail: '',
        holderRelation: '01',
        premium: '',
        healthClaim: false
      },
      { 
        insuranceAmount: '',
        insuredName: '',
        insuredDocumentType: '01',
        insuredDocumentNo: '',
        insuredMobile: '',
        holderRelation: '02',
        premium: '',
        healthClaim: false
      },
      { 
        insuranceAmount: '',
        insuredName: '',
        insuredDocumentType: '01',
        insuredDocumentNo: '',
        insuredMobile: '',
        holderRelation: '02',
        premium: '',
        healthClaim: false
      }
    ];

    this.insuredList = [
      { 
        insuranceAmount: '',
        insuredName: '',
        insuredDocumentType: '01',
        insuredDocumentNo: '',
        insuredMobile: '',
        insuredAddress: '',
        insuredEmail: '',
        holderRelation: '01',
        premium: '',
        healthClaim: false
      },
      { 
        insuranceAmount: '',
        insuredName: '',
        insuredDocumentType: '01',
        insuredDocumentNo: '',
        insuredMobile: '',
        holderRelation: '02',
        premium: '',
        healthClaim: false
      },
      { 
        insuranceAmount: '',
        insuredName: '',
        insuredDocumentType: '01',
        insuredDocumentNo: '',
        insuredMobile: '',
        holderRelation: '02',
        premium: '',
        healthClaim: false
      }
    ];
  }

  onInitPolicyInfo(data) {
    let policyInfo = data.policyInfo;
    this.paymentType = policyInfo.paymentType;
    this.premium = policyInfo.totalPremium;
    this.orderInfoId = policyInfo.orderInfoId;

    _.each(policyInfo.insured, _.bind(function(value, key) {
      value = _.pick(value,
        'insuranceAmount',
        'insuredName',
        'insuredDocumentNo',
        'insuredMobile',
        'insuredAddress',
        'insuredEmail',
        'holderRelation',
        'premium');
      value.insuredDocumentType = '01';
      value.healthClaim = true;
      value.insuranceAmount = value.insuranceAmount === '100000.00' ? '01' : '02'; 
      if (key !== 0) {
        value = _.omit(value, 'insuredEmail', 'insuredAddress')
      }
  
      this.postData[key] = value;
    }, this));

    _.each(this.postData, _.bind(function(value, key) {
      let insured = { };

      insured.insuranceAmount = value.insuranceAmount;
      insured.insuredName = value.insuredName;
      insured.insuredDocumentNo = value.insuredDocumentNo;
      insured.insuredMobile = value.insuredMobile;
      insured.premium = value.premium;
      insured.holderRelation = value.holderRelation;
      insured.healthClaim = true;

      if (key === 0) {
        insured.insuredEmail = value.insuredEmail;
        insured.insuredAddress = value.insuredAddress;
      }
  
      this.insuredList[key] = insured;
    }, this));
  }

  onInitMainInsured(data) {
    let insured = this.postData[0];

    insured.insuredName = data.realName;
    insured.insuredDocumentNo = data.idNumber;
    insured.insuredMobile = data.mobile;
    insured.insuredAddress = data.address;

    this.postData[0] = insured;

    let mainInsured = this.insuredList[0];

    mainInsured.insuredName = data.realName;
    mainInsured.insuredDocumentNo = data.idNumber;
    mainInsured.insuredMobile = data.mobile;
    mainInsured.insuredAddress = data.address;

    this.insuredList[0] = mainInsured;
  }
}

export default alt.createStore(PolicyBuyStore, 'PolicyBuyStore');