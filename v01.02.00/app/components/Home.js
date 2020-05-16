import React from 'react';
import Header from './common/Header';
import Navbar from './common/Navbar';
import { Link, withRouter } from 'react-router';
import { toggleClass, goBuyPage } from './common/Utils';
import LoadingToast from './common/LoadingToast';
import LoginDialog from './common/LoginDialog';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.banner = [
      {id: '0', code: 'sweet', channel: 'zhenglong', img: 'img/sweet.jpg'},
      {id: '1', code: 'ENDAB', channel: 'xuanyuan', company: 'FUXING', type: '1', source: 'pflife', img: 'img/ENDAB.jpg'}
    ];
    this.grid = [
      {code: 'health', header: '健康守护', desc: '给TA一份呵护', icon: 'icon-health'},
      {code: 'old', header: '养老保障', desc: '让您老有所依', icon: 'icon-baoxian'},
      {code: 'life', header: '生命保障', desc: '只为给您安心', icon: 'icon-umbra'},
      {code: 'sweet', header: '甜蜜蜜', desc: '享受“甜蜜”生活', icon: 'icon-qunti'}
    ];
    this.select = [
      {id: '0', code: 'ENSBC', channel: 'xuanyuan', company: 'FUXING', type: '1', source: 'pflife', price: '5', desc: '免体验 | 最高30万保额', img: 'img/ENSBC.jpg'},
      {id: '1', code: 'ENSFC', channel: 'xuanyuan', company: 'FUXING', type: '1', source: 'pflife', price: '150', desc: '10万保障最低仅需150元', img: 'img/ENSFC.jpg'}
    ]
  }

  componentDidMount() {
    $("img.lazy").lazyload({
      threshold : 200,
      placeholder: 'img/pic_loading.png'
    });
    
    $(document).ready(function () {
      var mySwiper = new Swiper ('.swiper-container', {
        autoplay: 3000,
        speed: 200,
        autoplayDisableOnInteraction: false,
        pagination : '.swiper-pagination'
      });
    });
  }
  linkTo(){
    window.location.href='/home.html';
  }
  goBuyPage(item) {
    goBuyPage(item, this.props.router);
  }
  
  render() {
    return (
      <div id="page-home">
        <Header title='保险首页' goBankIndex={true} />
        <div className="swiper-container">
          <div className="swiper-wrapper">
          {
            this.banner.map(function(item) {
              return (
                <div key={item.id} className="swiper-slide">
                  <img data-original={item.img} className="lazy" width="100%" onClick={this.goBuyPage.bind(this, item)}></img>
                </div>
              );
            }, this)
          }
          </div>
          <div className="swiper-pagination"></div>
        </div>
        <div className="row category-grid">
        {
          this.grid.map(function(item, index) {
            return (
              <Link key={index} to={`/products?filter=${item.code}`} onTouchCancel={_.bind(toggleClass, this, 'grey-bg')} onTouchStart={_.bind(toggleClass, this, 'grey-bg')} onTouchEnd={_.bind(toggleClass, this, 'grey-bg')} className="col-xs-6 item-grid">
                <i className={'iconfont ' + item.icon + ' grid-icon'}></i>
                <div>
                  <span>{item.header}</span>
                  <span>{item.desc}</span>
                </div>
              </Link>
            );
          })
        }
        </div>
        <section className="select-list">
          <ul className="list-unstyled">
            <li className="list-group-item header">
              <span>热门精选</span>
              <Link to="/products">更多</Link>
            </li>
            {
              this.select.map(function(item) {
                return (
                  <li key={item.id} className="list-group-item product" onClick={this.goBuyPage.bind(this, item)}>
                    <div className="product-poster">
                      <img data-original={item.img} className="lazy" width="100%"></img>
                    </div>
                    <div className="product-desc">
                      <div>价格<em>¥</em><span>{item.price}</span>元起</div>
                      <div>{item.desc}</div>
                    </div>
                  </li>
                );
              }, this)
            }
          </ul>
        </section>
        <div className="home-bottom">
          <span></span>
          <button className='btn btn-danger' onClick={this.linkTo.bind(this)}>link</button>
          {/* <Link to="/products">更多产品</Link> */}
          <span></span>
        </div>
        <LoginDialog />
        <LoadingToast tips="页面跳转中, 请稍候" id="checkUser-loading" />
        <Navbar page='Home' />
      </div>
    );
  }
}

export default withRouter(Home);