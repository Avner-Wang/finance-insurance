import React from 'react';

class InsuredInfo extends React.Component {

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

  handleHeader(id, no) {
    $('#insured-header1-' + id).toggle();
    $('#insured-content-' + id).toggle();
    if (no == '1') {
      $('#insured-header2-' + id).removeClass('hide').show();
    } else {
      $('#insured-header2-' + id).hide();
    }
  }
 
  render() {
    let nPrefix = 'insured.' + this.props.id;
    let idPrefix = 'insured_' + this.props.id;
    let headerText = '附属被保人-' + this.props.id;
    let relationRender = (
      <li className="list-group-item">
        <div>与主被保人关系</div>
        <div className="select-bd">
          <select name={nPrefix + '.holderRelation'} onChange={this.props.handleChange} value={this.props.insured.holderRelation}>
            <option value="02">父母</option>
            <option value="03">配偶</option>
            <option value="04">子女</option>
            <option value="05">兄弟姐妹</option>
          </select>
        </div>
      </li>
    );

    let emailRender = (
      <li className="list-group-item">
        <div>电子邮箱</div>
        <div>
          <input type="text" name={nPrefix + '.insuredEmail'} maxLength="30" placeholder="请输入电子邮箱" onChange={this.props.handleChange} onBlur={this.props.handleChange} value={this.props.insured.insuredEmail} />
        </div>
      </li>
    );

    let addressRender = (
      <li className="list-group-item">
        <div>联系地址</div>
        <div><input type="text" name={nPrefix + '.insuredAddress'} maxLength="100" placeholder="请输入联系地址" onChange={this.props.handleChange} value={this.props.insured.insuredAddress} /></div>
      </li>      
    );

    if (this.props.mainInsured) {
      headerText = '主被保人';
      relationRender = '';
    } else {
      emailRender = '';
      addressRender = '';
    }

    return (
      <div id={'page-insured-info-' + this.props.id}>
        <div className="insured-header" id={'insured-header1-' + this.props.id}>
          <span onClick={this.handleHeader.bind(this, this.props.id, '1')}><i className="iconfont">&#xe609;</i>{headerText}</span>
          <span onClick={this.handleHeader.bind(this, this.props.id, '1')} className="insured-icon fold"></span>
          <span className={this.props.id > 2 ? 'insured-icon delete show' : 'insured-icon delete hide'} data-index={this.props.id} onClick={this.props.handleDelete}></span>
        </div>
        <div className="insured-header hide" id={'insured-header2-' + this.props.id} onClick={this.handleHeader.bind(this, this.props.id, '2')}>
          <span><i className="iconfont">&#xe609;</i>{headerText}</span>
          <span>{this.props.insured.insuredName}</span>
          <span className="insured-icon open"></span>
        </div>
        <section className="policy-content no-top-border" id={'insured-content-' + this.props.id}>
          <ul className="list-unstyled">
            <li className="list-group-item">
              <div>
                <span>保额</span>
                <span className="policy-tips">41-60周岁限10万</span>
              </div>
              <div>
                <label className="radio-inline radio-fix-width">
                  <input type="radio" name={nPrefix + '.insuranceAmount'} id={idPrefix + '_amount1'} value="01" checked={this.props.insured.insuranceAmount == '01'} onChange={this.props.handleChange} />
                  <span className="virtual-radio" />
                  <span>10万元</span>
                </label>
                <label className="radio-inline radio-fix-width">
                  <input type="radio" name={nPrefix + '.insuranceAmount'} id={idPrefix + '_amount2'} value="02" checked={this.props.insured.insuranceAmount == '02'} onChange={this.props.handleChange} />
                  <span className="virtual-radio" />
                  <span>20万元</span>
                </label>
              </div>
            </li>
            {relationRender}
            <li className="list-group-item">
              <div>姓名&#12288;&#12288;</div>
              <div><input name={nPrefix + '.insuredName'} maxLength="30" type="text" placeholder="请输入姓名" onChange={this.props.handleChange} value={this.props.insured.insuredName} /></div>
            </li>
            <li className="list-group-item">
              <div>身份证号</div>
              <div><input type="text" name={nPrefix + '.insuredDocumentNo'} maxLength="18" placeholder="请输入身份证号码" onChange={this.props.handleChange} onBlur={this.props.handleChange} value={this.props.insured.insuredDocumentNo} /></div>
            </li>
            <li className="list-group-item">
              <div>手机号码</div>
              <div><input type="tel" name={nPrefix + '.insuredMobile'} placeholder="请输入手机号码" onChange={this.props.handleChange} onBlur={this.props.handleChange} value={this.props.insured.insuredMobile} /></div>
            </li>
            {addressRender}
            {emailRender}
            <li className="list-group-item">
              <div>保费&#12288;&#12288;</div>
              <div className="premium-value"><input type="text" readOnly onChange={this.props.handleChange} value={this.props.insured.premium} /><span id={idPrefix + '_premium'} >{this.props.insured.premium ? '' : '-'}</span>元</div>
            </li>
            <li className="list-group-item health-claim">
              <label className="checkbox-inline">
                <input type="checkbox" name={nPrefix + '.healthClaim'} checked={this.props.insured.healthClaim} onChange={this.props.handleChange} />
                <span className="virtual-checkbox" />
              </label>
              <span>本人已阅读&nbsp;<a onClick={this.props.openModal}>被保人健康告知</a>&nbsp;条款，并承诺符合投保条件。</span>
            </li>
          </ul>
        </section>
      </div>
    );
  }
}

export default InsuredInfo;