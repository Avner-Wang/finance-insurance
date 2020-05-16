import alt from '../alt';
import CompanyActions from '../actions/CompanyActions';

class CompanyStore {
  constructor() {
    this.bindActions(CompanyActions);
    this.companys = [];
  }

  onGetCompanysSuccess(data) {
    this.companys = data;
  }
  
  onGetCompanysFail() {
    this.companys = [];
  }
}

export default alt.createStore(CompanyStore, 'CompanyStore');