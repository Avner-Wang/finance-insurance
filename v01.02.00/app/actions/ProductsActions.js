import alt from '../alt';
import { ajaxPost, jRedisId } from '../components/common/Utils';

class ProductsActions {
  
  constructor() {
    this.generateActions (
      'getProductsSuccess',
      'getProductsFail',
      'getMessagesNumberSuccess',
      'getMessagesNumberFail',
      'getUserSuccess',
      'getUserFail',
      'setFilterProducts',
      'setFilter'
    );
  }

  getProducts(callback) {
    $.ajax({ 
        url: 'resource/products.json',
        dataType: 'json' })
      .done(data => {
        $('#page-loading').hide();
        this.getProductsSuccess(data);
        callback(null, null);
      })
      .fail(jqXhr => {
        $('#page-loading').hide();
        this.getProductsFail(jqXhr.responseJSON.message);
      });
    return true;
  }

  getMessagesNumber() {
    $.ajax({ url: '/api/messages/number' })
      .done(data => {
        this.getMessagesNumberSuccess(data);
      })
      .fail(jqXhr => {
        this.getMessagesNumberFail(jqXhr.responseJSON.message);
      });
    return true;
  }

  getUserInfo(callback) {
    let data = { jRedisId: jRedisId() };
    ajaxPost(data, '/insuranceApi/api/v1/queryUserLoginInfo',
      (function(result, callback) {
        this.getUserSuccess(result);
        callback(null, result);
      }).bind(this),
      (function() {
        this.getUserFail();
      }).bind(this),
      $('page-loading'), callback, this);
    return true;
  }
}

export default alt.createActions(ProductsActions);