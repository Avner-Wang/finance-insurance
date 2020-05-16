import alt from '../alt';

class SuccessActions {
  
  constructor() {
    this.generateActions (
      'callbackSuccess',
      'callbackFail'
    );
  }

  synchronizeCallback(data) {
    $.ajax({
      url: '/insuranceApi/api/v1/synchronizeCallback',
      dataType: 'json',
      data: data
    })
      .done(data => {
        this.callbackSuccess(data);
      })
      .fail(jqXhr => {
        this.callbackFail();
      });

    return true;
  }
}

export default alt.createActions(SuccessActions);