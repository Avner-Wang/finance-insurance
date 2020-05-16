import alt from '../alt';

class IntroductionActions {
  
  constructor() {
    this.generateActions (
      'getPartnersSuccess',
      'getPartnersFail'
    );
  }

  getPartners(callback) {
    $.ajax({ 
        url: 'resource/partners.json',
        dataType: 'json' })
      .done(data => {
        this.getPartnersSuccess(data);
        callback(null, data);
      })
      .fail(jqXhr => {
        this.getPartnersFail();
      });
    return true;
  }

}

export default alt.createActions(IntroductionActions);