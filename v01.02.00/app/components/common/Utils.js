import Config from '../../config';

export function jRedisId() {
  let jRedisId = $.cookie('JREDISID');
  if (!jRedisId) {
    jRedisId = localStorage.getItem('JREDISID');
  }
  return jRedisId;
}

export function goBankPage(url) {
  if (localStorage.getItem('browserType')) {
    window.history.go(sessionStorage.getItem("baseLength") - history.length - 1);
  } else {
    location.href = url;
  }
}

export function goBankIndex() {
  goBankPage(Config.bankHomeUrl + Config.bankIndexUrl);
}

export function goBankLogin() {
  goBankPage(Config.bankHomeUrl + Config.bankLoginUrl);
}

export function goBuyPage(product, router) {
  if (product.channel === 'xuanyuan') {
    let data = {};

    data.jRedisId = jRedisId();
    data.insuranceCompanyCode = product.company;
    data.productCode = product.code;
    data.terminalType = product.type;
    data.productSource = product.source;
    
    $('#checkUser-loading').show();
    checkUserLogin(data);
  } else if (product.code === 'sweet'){
    router.push('/insured/detail');
  }
}

export function checkUserLogin(data) {
  $.ajax({
    url: '/insuranceApi/api/v1/checkUserLogin',
    dataType: 'json',
    data: data
  })
    .done(data => {
      $('#checkUser-loading').hide();
      if (data.retCode == 'INS000000') {
        location.href = data.url;
      }
      else if (data.retCode == 'INS000019') {
        $("#login-dialog").show();
      }
    })
    .fail(jqXhr => {
      goBankLogin();
    });
}

const PRODUCT_NAME = {
  'ENTML': '复星保德信爱家e守护定期寿险',
  'ENDAB': '复星保德信养老e守护年金保险',
  'ENSBC': '复星保德信俪人守护A款',
  'ENSFC': '复星保德信俪人守护B款',
  'sweet': '太平盛世团体甜蜜蜜壹号'
};

export function getProductName(code) {
  return PRODUCT_NAME[code];
}

const PRODUCT_FILE = {
  'ENTML': [{file: '1.pdf', desc: '复星保德信爱家e守护定期寿险条款.pdf'}, {file: '2.pdf', desc: '复星保德信理赔申请表(2).pdf'}, {file: '3.pdf', desc: '健康e守护投保提示书.pdf'}],
  'ENDAB': [{file: '1.pdf', desc: 'e生守护年金投保声明.pdf'}, {file: '2.pdf', desc: 'TK_ENDAB-e生守护年金保险条款.pdf'}, {file: '3.pdf', desc: '复星保德信理赔申请表(4).pdf'}, {file: '4.pdf', desc: '人身险投保提示书-北京(3).pdf'}, {file: '5.pdf', desc: '人身险投保提示书-上海(3).pdf'}],
  'ENSBC': [{file: '1.pdf', desc: '复星保德信理赔申请表(3).pdf'}, {file: '2.pdf', desc: '人身险投保提示书-北京(2).pdf'}, {file: '3.pdf', desc: '人身险投保提示书-上海(2).pdf'}],
  'ENSFC': [{file: '1.pdf', desc: 'ENSFC-俪人B条款.pdf'}, {file: '2.pdf', desc: '复星保德信理赔申请表(1).pdf'}, {file: '3.pdf', desc: '复星保德信俪人守护B款女性特定危重疾病保险费率表.pdf'}, {file: '4.pdf', desc: '俪人守护B款女性特定危重疾病保险投保提示.pdf'}, {file: '5.pdf', desc: '人身险投保提示书-北京(1).pdf'}, {file: '6.pdf', desc: '人身险投保提示书-上海(1).pdf'}],
  'sweet': [{file: '1.pdf', desc: '太平盛世甜蜜蜜壹号团体特定疾病保险条款.pdf'}]
};

export function getProductFiles(code) {
  return PRODUCT_FILE[code];
}

const COMPANY_CODE = {
  'ENTML': 'pflife',
  'ENDAB': 'pflife',
  'ENSBC': 'pflife',
  'ENSFC': 'pflife',
  'sweet': 'cntaiping'
};

export function getCompnayCode(code) {
  return COMPANY_CODE[code];
}

const COMPANY_DESC = {
  'pflife': '复星保德信人寿保险有限公司',
  'cntaiping': '太平养老保险股份有限公司'
};

export function getCompnayDesc(code) {
  return COMPANY_DESC[code];
}

const RELATION_CODE = {
  '01': '本人',
  '02': '父母',
  '03': '配偶',
  '04': '子女',
  '05': '兄弟姐妹'
};

export function getRelationDesc(code) {
  return RELATION_CODE[code];
}

export function getInsperiodDesc (type, value) {
  switch(type) {
    case '00': return '无关'; break;
    case '01': return '保终身'; break;
    case '02': return value +　'年'; break;
    case '03': return value +　'周岁'; break;
    case '04': return value +　'个月'; break;
    case '05': return value +　'天'; break;
    default: return;
  }
}

const ORDER_STATUS = {
  '00': '新建',
  '01': '核保通过',
  '02': '核保失败',
  '03': '支付处理中',
  '04': '支付成功',
  '05': '支付失败',
  '06': '成功',
  '07': '失败',
  '08': '处理中',
  '09': '关闭',
  '99': '失败'
};

export function getOrderStatusDesc(code) {
  return ORDER_STATUS[code];
}

const POLICY_STATUS = {
  '01': '未生效',
  '02': '保障中',
  '03': '已失效'
};

export function getPolicyStatusDesc(code) {
  return POLICY_STATUS[code];
}

const PARTNER_LIST = [
  {id: 1, code: 'xuanyuan', name: '玄元保险代理公司'},
  {id: 2, code: 'zhenglong', name: '正隆（北京）保险经纪股份有限公司'}
];

export function getPartnerList() {
  return PARTNER_LIST;
}

export function showToastr(msg, target) {
  toastr.remove();
  toastr.error(msg, null, {timeOut: 3000, positionClass: 'toast-top-full-width', hideDuration: 0, showDuration: 0});
  if (target) {
    target.focus();
  }
}

export function toggleClass(style, event) {
  $(event.currentTarget).toggleClass(style);
}

export function ajaxPost(data, url, success, error, loading, object) {
  ajaxRequest('POST', data, url, success, error, loading, object);
}

export function ajaxGet(data, url, success, error, loading, object) {
  ajaxRequest('GET', data, url, success, error, loading, object);
}

export function ajaxRequest(type, data, url, success, error, loading, object) {
  $.ajax({
    type: type,
    url: url,
    contentType: "application/json",
    dataType: 'json',
    data: JSON.stringify(data) })
  .done(result => {
    if (loading) {
      loading.hide();
    }
    if (result.retCode == 'INS000000') {
      success(result, object);
    } else if (result.retCode == 'INS000019') {
      $('#login-dialog').show();
    } else {
      if (error) {
        error();
      }
      showToastr(result.retMessage ? result.retMessage : '系统异常，请稍后再试');
    }   
  })
  .fail(jqXhr => {
    if (error) {
      error();
    }
    if (loading) {
      loading.hide();
    }
    showToastr('系统异常，请稍后再试');
  });
}

export function getPaymentMethod() {
  let paymentMethod = '02';
  if (navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
    paymentMethod = '03';
  }
  return paymentMethod;
}