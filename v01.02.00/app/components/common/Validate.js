/** JavaScript 常见数据验证方法
    其它验证请使用undercore库
*/

/**
  isEmail 验证是否为Email
  isZip 验证是否为邮编
  isMobile 验证是否为手机号码
  isMobile 验证是否为手机号码
  isDate 验证是否为日期YYYY-MM-DD或YYYY/MM/DD
  isIdCard 是否为身份证 15位和18位
*/

class Validate {

  static isEmail(value) {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );
  }

  static isZip(value) {
    return /^\d{6}$/.test( value );
  }

  static isMobile(value) {
    return /^1\d{10}$/.test( value );
  }

  static isDateISO(value) {
    return /^(\d{4})(-|\/)(0[1-9]|1[12])\2(0[1-9]|[12]\d|3[01])$/.test( value );
  }

  static isCertNum(value) {
    return /^[0-9a-zA-Z]*$/.test( value );
  }

  static isIdCard(value) {
    return /^\d{15}|d{18}$/.test( value );
  }

  /**
    身份证组成：4位地址码+8位出生日期+3位顺序码+1位校验码
  */
  static isIdCard(value) {
    const PROVINCE = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北 ', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 81: '香港', 82: '澳门'};
    if (value.length != 18 && value.length != 15) {
      return false;
    }
    if (!/^\d{6}(19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)?$/.test( value )) {
      return false;
    }
    if (!PROVINCE[value.substr(0,2)]) {
      return false;
    }
    if (value.length === 18) {
      return value.charAt(17) === this.card18Tail(value);
    }
    return true;    
  }

  /**
    18位身份证校验规则[GB11643]
    ∑(ai×Wi)(mod 11)
    取尾数
  */
  static card18Tail(value){
    const FACTOR = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    const PARITY  = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    let sum = 0;
    for(let i = 0; i < 17; i++){
      sum += value.charAt(i) * FACTOR[i];
    }
    return PARITY[sum % 11];
  }
}

export default Validate;
