import React from 'react';
import { Link } from 'react-router';
import Header from './common/Header';
import Navbar from './common/Navbar';
import CompanyStore from '../stores/CompanyStore';
import CompanyActions from '../actions/CompanyActions';
import { jRedisId, checkUserLogin } from './common/Utils';

class Company extends React.Component {
  constructor(props) {
    super(props);
    this.state = CompanyStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    CompanyStore.listen(this.onChange);
    CompanyActions.getCompanys();
  }

  componentWillUnmount() {
    CompanyStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  gotoProductBuy(companyIndex, productIndex) {
    let data = {};
    let company = this.state.companys[companyIndex];
  
    data.jRedisId = jRedisId();
    data.insuranceCompanyCode = company.code;
    data.productCode = company.products[productIndex].code;
    data.terminalType = company.products[productIndex].type;
    data.productSource = company.products[productIndex].source;
  
    checkUserLogin(data)
  }
  
  render() {

    return (
      <div id="page-company">
        <section className="company-list">
          <ul className="list-unstyled">
            {
              this.state.companys.map(function(item, index) {
                return (<li key={index} className="list-group-item">
                          <div className="company">
                            <Link to="/">
                              <div className="logo">
                                <img className="img-thumbnail" src={item.logo} />
                              </div>
                              <div className="desc">
                                <div>{item.name}</div>
                                <div>{item.description}</div>
                              </div>
                            </Link>
                          </div>
                          <div className="container">
                            <div className="col-xs-6 product hot-1" onClick={this.gotoProductBuy.bind(this, index, 0)}>
                              <img className="product-img" width="100%" src={item.products[0].img} />
                              <div className="product-title">{item.products[0].title}</div>
                              <div className="product-price">¥<span>{item.products[0].price}</span>元起</div>
                            </div>
                            <div className="col-xs-6 product hot-2" onClick={this.gotoProductBuy.bind(this, index, 1)}>
                              <img className="product-img" width="100%" src={item.products[1].img} />
                              <div className="product-title">{item.products[1].title}</div>
                              <div className="product-price">¥<span>{item.products[1].price}</span>元起</div>
                            </div>
                          </div>
                        </li>
                        );
              }, this)
            }
          </ul>
        </section>
        <Navbar page='Company' />
      </div>
    );
  }
}

export default Company;