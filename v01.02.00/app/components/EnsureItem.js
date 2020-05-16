import React from 'react';
import Modal from 'react-modal';
import Header from './common/Header';

class EnsureItem extends React.Component {

  constructor(props) {
    super(props);
  }
  
  render() {

    return (
      <Modal className="ModalClass" overlayClassName="OverlayClass" {...this.props} >
        <Header title='保障责任' close={true} onClose={this.props.onHide} />
        <div className="article-content">
          <article>
            <section>
              <h2>糖尿病严重并发疾病保险金</h2>
              <h2>保额：10万元/20万元</h2>
              <p>自保险合同生效日或最后复效日（以较迟者为准）起180日内，被保险人首次发生糖尿病严重并发疾病*（无论一种或者多种），并经本公司指定或认可的医疗机构的专科医生明确诊断，本公司按投保人根据保险合同约定已支付的该被保险人对应的保险费，给付糖尿病严重并发疾病保险金，同时对该被保险人的保险责任终止。自保险合同生效日或最后复效日（以较迟者为准）起180日后，被保险人首次发生符合糖尿病严重并发疾病（无论一种或者多种），并经本公司指定或认可的医疗机构的专科医生明确诊断，本公司按保险合同约定的基本保险金额给付糖尿病严重并发疾病保险金，同时对该被保险人的保险责任终止。</p>
              <p><strong>*糖尿病严重并发疾病：脑中风后遗症、终末期肾病、截肢、双目失明</strong></p>
            </section>
            <section>
              <h2>身故保险金 </h2>
              <h2>保额：已支付的保险费</h2>
              <p>保险合同有效期内，被保险人身故，本公司按投保人根据本合同约定已支付的该被保险人对应的保险费给付身故保险金，同时对该被保险人的保险责任终止。</p>
            </section>
          </article>
        </div>
      </Modal>
    );
  }
}

export default EnsureItem;