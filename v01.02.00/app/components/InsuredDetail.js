import React from 'react';
import Header from './common/Header';
import { Link } from 'react-router';
import Config from '../Config';
import EnsureItem from './EnsureItem';

class InsuredDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {modalShow: false}
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    let referrerId = this.props.location.query.referrerId;
    referrerId = referrerId ? referrerId : '';
    localStorage.setItem('ins_referrerId', referrerId)
  }

  onChange(state) {
    this.setState(state);
  }

  openPdfWindow(source, productCode, fileName) {
    window.open(Config.basename + "pdf/viewer.html?file=./resource/" + source + "/" + productCode + "/" + fileName, "_self");
  }

  showItemModal() {
    this.state.modalShow = true;
    this.onChange(this.state);
  }
  
  render() {
    let modalClose = () => this.setState({ modalShow: false });
    return (
      <div id="page-ensure-detail">
        <Header title="投保详情" goBack={true} />
        <div></div>
        <section className="product-info">
          <div className="product-title">太平盛世甜蜜蜜壹号团体特定疾病保险</div>
          <div>
            <span className="company-tag">太平养老保险股份有限公司</span>
          </div>
        </section>
        <div className="header-text">投保规则</div>
        <section className="detail-content">
          <ul className="list-unstyled">
            <li className="list-group-item">
              <div>被保人年龄</div>
              <div>18-60周岁</div>
            </li>
            <li className="list-group-item">
              <div>参保人数</div>
              <div>3人成团模式(投保人数需&#62;&#61;3人)</div>
            </li>
            <li className="list-group-item">
              <div>投保金额</div>
              <div>40周岁(含)以下10或20万元<br/>41周岁(含)以上限制10万元</div>
            </li>
          </ul>
        </section>
        <div className="header-text">保障计划</div>
        <section className="detail-content">
          <ul className="list-unstyled">
            <li className="list-group-item">
              <div>投保范围</div>
              <div>糖尿病患者或健康人群</div>
            </li>
            <li className="list-group-item">
              <div>保障年限</div>
              <div>10年</div>
            </li>
            <li className="list-group-item" onClick={this.showItemModal.bind(this)}>
              <div>保障责任</div>
              <div className="select-bd"></div>
            </li>
          </ul>
        </section>
        <section className="header-text">
          <div>本人已充分了解本保险产品，同意并接受<a onClick={this.openPdfWindow.bind(this, 'cntaiping', 'sweet', '1.pdf')}>《保险条款》</a></div>
        </section>
        <div className="bottom-tab">
          <a className="btn btn-default btn-tel" href="tel:4000082159" ><i className="iconfont">&#xe622;</i><span>400-008-2159</span></a>
          <Link className="btn btn-default btn-continue" to="/insured/condition" id="policySubmit">我要投保</Link>
        </div>
        <div></div>
        <EnsureItem isOpen={this.state.modalShow} onHide={modalClose} />
      </div>
    );
  }
}

export default InsuredDetail;