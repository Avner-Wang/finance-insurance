import React from 'react';
import Config from '../../config';

class Product extends React.Component {
  
  constructor(props) {
    super(props);
    this.product = this.props.product;
    this.state = {show: false};
    this.badgeClassName = 'badge';
  }

  componentWillMount() {
    this.badgeClassName = this.getBadgeClassName(this.props.messageNumber);
    this.badgeDisplay = Config.openBarrage ? '' : 'badge-none';
  }

  componentDidMount() {
    $('img.lazy').lazyload({
      threshold : 99999999,
      placeholder: 'img/pic_loading.png'
    });
  }

  componentWillReceiveProps(nextProps) {
    this.badgeClassName = this.getBadgeClassName(nextProps.messageNumber);
  }

  onChange(state) {
    this.setState(state);
  }

  getBadgeNumber(number) {
    return number > 99 ? 99 : number;
  }

  getBadgeClassName(number) {
    if (number > 99) {
      return 'badge badge-text-small';
    } else if (number > 0) {
      return 'badge';
    }
  }

  render() {
    let qrcodeRender;
    if (this.product.code === 'sweet') {
      qrcodeRender = <span className="iconfont" onClick={this.props.gotoQrcode}>&#xe602;</span>;
    }
    return (
      <div id="insurance-product">
        <div className="product-title">
          <span>{this.product.title}</span>
          <span className={this.badgeDisplay} onClick={this.props.handleShowBarrage}><i className="iconfont">&#xe604;</i><span className={this.badgeClassName}>{this.props.messageNumber}</span></span>
          {qrcodeRender}
        </div>
        <div onClick={this.props.handleForward}>
          <div className="product-poster">
            <img data-original={this.product.img} className="lazy"></img>
          </div>
          <div className="product-detail">
            <div className="price">
              价格<em>¥</em><span>{this.product.price}</span>元起
            </div>
            <div className="introduction">
              <ol className="list-group">
              {
                this.product.description.map(function(item) {
                  return <li key={item.id} className="list-group-item"><span>{item.content}</span></li>;
                })
              }
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Product;