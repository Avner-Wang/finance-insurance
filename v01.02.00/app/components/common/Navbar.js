import React from 'react';
import {Link} from 'react-router';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div id="page-nav-bar">
        <div />
        <nav>
          <ul className="list list-unstyled">
            <li className={this.props.page == 'Home' ? 'active' : ''}>
              <Link to='/'>
                  <p className="iconfont nav-icon">&#xe601;</p>
                  <p>首页</p>
              </Link>
            </li>
            <li className={this.props.page == 'Products' ? 'active' : ''}>
              <Link to='/products'>
                  <p className="iconfont nav-icon">&#xe605;</p>
                  <p>产品精选</p>
              </Link>
            </li>
            <li className={this.props.page == 'My' ? 'active' : ''}>
              <Link to='/policys'>
                  <p className="iconfont nav-icon">&#xe600;</p>
                  <p>我的保险</p>
              </Link>
            </li>
            <li className={this.props.page == 'Partners' ? 'active' : ''}>
              <Link to='/partners'>
                <p className="iconfont nav-icon">&#xe607;</p>
                <p>信息披露</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Navbar;