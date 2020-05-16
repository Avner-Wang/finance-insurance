import alt from '../alt';

class BarrageActions {
  
  constructor() {
    this.generateActions (
      'updateBarrageMessages',
      'increaseSkip',
      'increasePage',
      'updateState'
    );
  }

  getBarrageMessages(type, page, skip, loop) {
    $.ajax({
      url: '/api/messages/'+ type,
      data:{ page: page, skip: skip }
    })
      .done(data => {
        data.loop = loop;
        this.updateBarrageMessages(data);
      })
      .fail(jqXhr => {
        console.log('jqXhr', jqXhr);
      });

    return true;
  }

}

export default alt.createActions(BarrageActions);