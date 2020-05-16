/**
 * Created by guyeke on 16/8/19.
 */
import React from 'react';
import Header from './common/Header';
import IntroductionStore from '../stores/IntroductionStore';
import IntroductionActions from '../actions/IntroductionActions';

class Introduction extends React.Component {
  constructor(props) {
    super(props);
    this.state = IntroductionStore.getState();
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    IntroductionStore.listen(this.onChange);

    if (this.state.partners.length > 0) {
      this.findCurrentPartner(this.state.partners);
      return;
    }

    async.waterfall([
      function(callback) {
        IntroductionActions.getPartners(callback);
      }],
      (function (err, partners) {
        this.findCurrentPartner(partners);
      }).bind(this), this);
  }

  componentWillUnmount() {
    IntroductionStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  findCurrentPartner(partners) {
    this.state.partner = _.find(partners, _.bind(function(value, index) {
      return value.code === this.props.params.code;
    }, this));
    this.onChange(this.state);
  }

  render() {

    return (
      <div id="page-introduction">
        <Header title='信息披露' goBack={true} />
        <article>
          <section>
              <h1>上海华瑞银行保险业务<br/>备案信息披露</h1>
              <h2>备案信息:</h2>
              <p>第三方网络平台全称：上海华瑞银行（APP）</p>
              <p>第三方网络平台简称：上海华瑞银行（APP）</p>
              <p>第三方网络平台网站地址：上海市浦东新区世纪大道100号环球金融中心20楼</p>
              <p>第三方网络平台备案信息：上海华瑞银行股份有限公司</p>
              <p>业务合作起始日期：{this.state.partner.startTime}</p>
              <p>业务合作终止日期：{this.state.partner.endTime}</p>
          </section>
          <section>
            <table>
              <thead>
              <tr>
                <th colSpan="2">当前合作保险产品情况</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>合作保险产品实际销售名称</td>
                <td>合作保险产品中国保监会报备名称</td>
              </tr>
              {
                this.state.partner.products.map(function(product, index) {
                  return (
                    <tr key={index}>
                      <td>{product.sellName}</td>
                      <td>{product.registerName}</td>
                    </tr>
                  );
                })
              }
              </tbody>
            </table>
          </section>
          <section>
            <p>备案信息链接：<a href="http://icid.iachina.cn/">http://icid.iachina.cn/</a></p>
            <p>{this.state.partner.declaration}</p>
          </section>
          {
            this.state.partner.productCompanys.map(function(company, index) {
              return (
                <section key={index}>
                  <h2>{company.shortName}介绍：</h2>
                  <p>{company.desc}</p>
                </section>
              );
            })
          }
          <section>
            <h2>{this.state.partner.shortName}介绍：</h2>
            <p>{this.state.partner.desc}</p>
          </section>
        </article>
      </div>
    );
  }
}

export default Introduction;
