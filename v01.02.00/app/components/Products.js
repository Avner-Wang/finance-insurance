import React from 'react';
import { withRouter } from 'react-router';
import Product from './common/Product';
import Barrage from './common/Barrage';
import Navbar from './common/Navbar';
import Navtab from './common/Navtab';
import Qrcode from './common/Qrcode';
import ProductsStore from '../stores/ProductsStore';
import ProductsActions from '../actions/ProductsActions';
import Config from '../config';
import Loading from './common/Loading';
import { jRedisId, goBuyPage } from './common/Utils';
import LoginDialog from './common/LoginDialog';
import LoadingToast from './common/LoadingToast';

class Products extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = ProductsStore.getState();
    this.messagesNumber = {};
    this.onChange = this.onChange.bind(this);

    this.bankPathArg = {};
    this.tabItems = [
      {code: 'all', name: '全部'},
      {code: 'health', name: '健康'},
      {code: 'old', name: '养老'},
      {code: 'life', name: '寿险'},
      {code: 'sweet', name: '甜蜜蜜'}
    ];
  }

  componentDidMount() {
    ProductsStore.listen(this.onChange);
    async.waterfall([
      (function(callback) {
        if (this.state.products.length === 0) {
          ProductsActions.getProducts(callback);
        } else {
          $('#page-loading').hide();
          callback(null, null);
        }
      }).bind(this)],
      (function (err, result) {
        this.filterChange(this.props.location.query.filter);
      }).bind(this), this);

    if (Config.openBarrage) {
      ProductsActions.getMessagesNumber();
      async.waterfall([
        ProductsActions.getUserInfo,
      ]);
    }

    if (Config.openBarrage) {
      let socket = io.connect(Config.socketServer);
  
      socket.on("messages_number", (data) => {
        this.state.messagesNumber = data;
      });
    }
  }

  componentWillUnmount() {
    ProductsStore.unlisten(this.onChange);
  }

  componentWillReceiveProps(nextProps) {
    this.filterChange(nextProps.location.query.filter);
  }

  onChange(state) {
    this.setState(state);
  }

  handleShowBarrage(index) {
    if (this.state.user.flg == 'Y') {
      this.openBarrage(index, this.state.user.flg);
    } else {
      async.waterfall([
          ProductsActions.getUserInfo,
          this.openBarrage.bind(this, index),
        ]);
    }
  }

  openBarrage(index, loginFlag) {
    if (loginFlag != 'Y') {
      this.locationToLogin();
      return;
    }
    this.state.barrageShow = true;
    this.state.currentProject = this.state.products[index];
    this.onChange(this.state);
  }

  handleForward(product) {
    goBuyPage(product, this.props.router);
  }

  locationToLogin() {
    location.href = Config.bankHomeUrl.concat(Config.bankLoginUrl).concat('?').concat(Arg.stringify(this.bankPathArg));
  }

  gotoQrcode() {
    let url = Config.bankHomeUrl.concat('insurance/insured/detail');
    if (!_.isEmpty(this.state.user.userId)) {
      this.showQrcodePage(url, this.state.user.userId);
      return;
    }
    async.waterfall([
      function(callback) {
        ProductsActions.getUserInfo(callback);
      }],
      (function (err, result) {
        if (!_.isEmpty(result.userId) && result.retCode === 'INS000000') {
          this.showQrcodePage(url, result.userId);
        }
      }).bind(this), this);
  }

  showQrcodePage(url, userId) {
    this.state.qrcodeText = url.concat('?referrerId=').concat(userId);
    this.onChange(this.state);
    $('#productQrcode').show();
  }

  filterChange(filter) {
    this.state.filter = filter ? filter : 'all';
    ProductsActions.setFilter(this.state.filter);
    this.productsFilter(this.state.filter);    
  }

  productsFilter(filter) {
    if (filter === 'all') {
      this.state.filterProducts = this.state.products;
    } else {
      this.state.filterProducts = _.filter(this.state.products, function(product){
        return product.category === filter; });
    }
    ProductsActions.setFilterProducts(this.state.filterProducts);
    this.onChange(this.state);
  }

  tabSwitch(filter) {
    this.props.router.replace({
      pathname: '/products',
      query: { filter: filter }
    });
  }

  render() {
    let barrageClose = () => this.setState({ barrageShow: false });
    let barrageComponent;
    if (Config.openBarrage) {
      barrageComponent = <Barrage show={this.state.barrageShow} isOpen={this.state.barrageShow} project={this.state.currentProject} onRequestClose={barrageClose} />;
    }
    return (
      <div id="products-page">
        <Navtab active={this.state.filter} tabItems={this.tabItems} tabItemClick={this.tabSwitch.bind(this)} />
        <section className="insurance-list">
          <ul className="list-group">
            {
              this.state.filterProducts.map(function(product, index) {
                return (
                  <li key={product.id} className="list-group-item"><Product product={product} messageNumber={this.state.messagesNumber["barrage_".concat(product.id)]} handleForward={this.handleForward.bind(this, product)} handleShowBarrage={this.handleShowBarrage.bind(this, index)} gotoQrcode={this.gotoQrcode.bind(this, index)}/></li>
                );
            }, this)}
          </ul>
        </section>
        <Loading />
        <LoginDialog />
        <LoadingToast tips="页面跳转中, 请稍候" id="checkUser-loading" />
        <Navbar page='Products' />
        {barrageComponent}
        <Qrcode id="productQrcode" text={this.state.qrcodeText} desc="推荐专属二维码" />
      </div>
    );
  }
}

export default withRouter(Products);