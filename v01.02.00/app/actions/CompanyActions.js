import alt from '../alt';

class CompanyActions {
  
  constructor() {
    this.generateActions (
      'getCompanysSuccess',
      'getCompanysFail'
    );
  }

  getCompanys() {
    $.ajax({ 
        url: 'resource/companys.json',
        dataType: 'json' })
      .done(data => {
        this.getCompanysSuccess(data);
      })
      .fail(jqXhr => {
        this.getCompanysFail();
      });
  }
}

export default alt.createActions(CompanyActions);