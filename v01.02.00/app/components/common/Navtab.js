import React from 'react';

class Navtab extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    var mySwiper = new Swiper ('.nav-tab', {
      freeMode : true,
      slidesPerView : 'auto'
    });
  }
  render() {
    return (
      <nav className="nav-tab">
        <div className="swiper-wrapper">
          {
            this.props.tabItems.map(function(item, index) {
              return (
                <div key={index} className={this.props.active === item.code ? 'swiper-slide active' : 'swiper-slide'} onClick={this.props.tabItemClick.bind(this, item.code)}>{item.name}</div>
              );
          }, this)}
        </div>
      </nav>
    );
  }
}

export default Navtab;