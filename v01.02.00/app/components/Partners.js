import React from 'react';
import { Link, withRouter } from 'react-router';
import Header from './common/Header';
import Navbar from './common/Navbar';
import { getPartnerList, toggleClass } from './common/Utils';

class Partners extends React.Component {
  
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  componentWillUnmount() {
  }

  onChange(state) {
    this.setState(state);
  }

  render() {

    return (
      <div id="page-partners">
        <Header title='信息披露' goBankIndex={true} />
        <section className="partner-list">
          <ul className="list-unstyled">
          {
            getPartnerList().map(function(item, index) {
              return (
                <Link key={index} to={`/introduction/${item.code}`} onTouchCancel={_.bind(toggleClass, this, 'grey-bg')} onTouchStart={_.bind(toggleClass, this, 'grey-bg')} onTouchEnd={_.bind(toggleClass, this, 'grey-bg')} className="list-group-item select-bd">
                  <img className="logo" src={'img/' + item.code + '-logo.png'} />
                  <div className="desc">
                    <span className="company-tag">{item.name}</span>
                  </div>
                </Link>
              )
            }, this)
          }
          </ul>
        </section>
        <Navbar page='Partners' />
      </div>
    );
  }
}

export default withRouter(Partners);