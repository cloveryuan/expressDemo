function checkName(name, msg) {
  const pattern = /^[\u4E00-\u9FA5\uf900-\ufa2d·\.s]{2,20}$/
  let result = pattern.test(name)
  if(!result){
    throw msg
  }
  return result
}
function checkProv(val) {
  const pattern = /^[1-9][0-9]/;
  var provs = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门" };
  if (pattern.test(val)) {
    if (provs[val]) {
      return true;
    }
  }
  return false;
}
function checkDate(val) {
  var pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
  if (pattern.test(val)) {
    var year = val.substring(0, 4);
    var month = val.substring(4, 6);
    var date = val.substring(6, 8);
    var date2 = new Date(year + "-" + month + "-" + date);
    if (date2 && date2.getMonth() == (parseInt(month) - 1)) {
      return true;
    }
  }
  return false;
}
function checkPhone(phone, msg){ 
  if(!(/^1[3456789]\d{9}$/.test(phone))){ 
    throw msg
  } 
}
function checkCodeNew(val, msg){
  if(!val || !(/^.{6,20}$/.test(val))){ 
    throw msg
  } 
}

function checkCode(val, msg) {
  var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
  var code = val.substring(17);
  if (p.test(val)) {
    var sum = 0;
    for (var i = 0; i < 17; i++) {
      sum += val[i] * factor[i];
    }
    if (parity[sum % 11] == code.toUpperCase()) {
      return true;
    }
  }
  throw msg
}
function checkID(val, msg) {
  if (typeof (val) !== 'string') {
    throw new Error('ID is not string')
  }
  let result = false
  if (checkCode(val)) {
    var date = val.substring(6, 14);
    if (checkDate(date)) {
      if (checkProv(val.substring(0, 2))) {
        result = true;
      }
    }
  }
  if(!result){
    throw msg
  }
  return result;
}
function checkEmpty(val, msg) {
  if (val) {
    if(val.trim() === ''){
      throw msg
    }
  } else {
    throw msg
  }
}
function checkAddr() {
  let result = false
  return result
}
function checkCarId(vehicleNumber, msg) {
  vehicleNumber = vehicleNumber.toUpperCase()
  let reg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/
  var result = reg.test(vehicleNumber);
  if(!result){
    throw msg
  }
  return result;
}

function checkCompanyName(name, msg) {
  if(name && name.trim() !== ''){
    const pattern = /^.{2,20}$/;
    let result = pattern.test(name);
    if (!result) {
       throw msg;
    }
    return result;
  }
}
window.qs = {
  parse: (string) => {
    let obj = {}
    let keyValues = string.split('&')
    keyValues.map(_keyValue => {
      let key = _keyValue.split('=')[0]
      let value = decodeURIComponent(_keyValue.split('=')[1])
      obj[key] = value
    })
    return obj
  }
}

// 拷贝自 /js/util.js
function fillFormField(formField, jsonValue) {
  var _formFieldDom = $(formField);
  $.each(jsonValue, function (name, ival) {
    var $oinput = _formFieldDom.find("input[name=" + name + "]");
    if ($oinput.attr("type") == "checkbox") {
      if (ival !== null) {
        var checkboxObj = _formFieldDom.find("[name=" + name + "]");
        var checkArray = ival.split(";");
        for (var i = 0; i < checkboxObj.length; i++) {
          for (var j = 0; j < checkArray.length; j++) {
            if (checkboxObj[i].value == checkArray[j]) {
              $(checkboxObj[i]).click();
            }
          }
        }
      }
    }
    else if ($oinput.attr("type") == "radio") {
      $oinput.each(function () {
        var radioObj = _formFieldDom.find("[name=" + name + "]");
        for (var i = 0; i < radioObj.length; i++) {
          if (radioObj[i].value == ival) {
            $(radioObj[i]).click();
          }
        }
      });
    }
    else if ($oinput.attr("type") == "textarea") {
      _formFieldDom.find("[name=" + name + "]").html(ival);
    }
    else if (ival) {
      _formFieldDom.find("[name=" + name + "]").val(ival);
    }
  })
}


function checkLng(val, msg) {
  var lng = Number(val);
  if (!(lng >= -180 && lng <= 180)) {
    throw msg;
  }
}

function checkLat(val, msg) {
  var lat = Number(val);
  if (!(lat >= -90 && lat <= 90)) {
    throw msg;
  }
}



function getQuery(key){
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split("=");
    if (pair[0] === key) {
      return pair[1];
    }
  }
  return false;
};

function setCookie(name, value, day) {
  if (day !== 0) {
    //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
    var expires = day * 24 * 60 * 60 * 1000;
    var date = new Date(+new Date() + expires);
    document.cookie =
      name + '=' + escape(value) + ';expires=' + date.toUTCString() + ';path=/';
  } else {
    document.cookie = name + '=' + escape(value);
  }
}

function getCookie(name) {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  let arr = document.cookie.match(reg);
  if (arr && arr.length > 0) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}


function message(type, text) {
  let messageTmp = {
    success: `
      <div class="message-wrap">
        <div class="sui-msg msg-large msg-success message-content">
          <div class="msg-con">${text ? text : "--"}</div>
          <s class="msg-icon"></s>
        </div>
      </div>
    `,
    error: `
      <div class="message-wrap">
        <div class="sui-msg msg-large msg-error message-content">
          <div class="msg-con">${text ? text : "--"}</div>
          <s class="msg-icon"></s>
        </div>
      </div>
    `
  };
  $("body").append(messageTmp[type]);
  window.messageTime = null;
  window.messageTime = setTimeout(function() {
    $("body .message-wrap").remove();
  }, 2500);
}

function showLoading(show) {
  if (show) {
    $(".page-record").append(`<div class="loading-modal"><div class="spin-containter">
    <span class="ant-spin-dot ant-spin-dot-spin"><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i></span></div>
    </div>`);
  } else {
    $(".page-record .loading-modal").remove();
  }
}
window.REPORT_TYPE = {
  0: "普通检测通行",
  1: "上高速通行",
  2: "下高速通行",
  3: "进小区通行",
  4: "出小区通行",
  5: "上班进公司通行",
  6: "下班离开公司通行",
  7: "自主扫码检测",
  9: "异常情况隔离上报",
  10: "进学校通行",
  11: "出学校通行",
};
//  获取当前时间
function getNowFormatDate(number) {
  var oNumber = number ? number : 0;
  var date = new Date();
  var newDate = new Date(date);
  newDate.setDate(newDate.getDate() + oNumber);
  var seperator1 = "-";
  var year = newDate.getFullYear();
  var month = newDate.getMonth() + 1;
  var strDate = newDate.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
