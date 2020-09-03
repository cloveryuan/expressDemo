// var httpPrefix = "http://101.37.158.195:8089";
var httpPrefix = '';
// var httpPrefix = 'http://120.26.58.230:8095/';

var token;
var userInfo = {};
var deletesRecord = [];
var defaultProvince = "";
var defaultCity = "";
var RECORD_SOURCE_TYPE = {
  1: "支付宝",
  2: "微信",
  3: "其他",
  10: "其他"
};

var allLabelsInfo = [];
var currentPage = 1;
var pageSize = 20;

var epidemicCurrentPage = 1;
var epidemicPageSize = 20;
var epidemicCurrentTableData = null; // 核验员表格当前的数据

var heYanJiLuPage = {
  pageNum: 1,
  pageSize: 20
};

var stationCheckerPage = {
  pageNum: 1,
  pageSize: 20,
  curStationId: "0",
  curStationChecker: [],
  checkerSearchValue: ""
};
window.stationCheckInfo = {
  pageNum: 1,
  pageSize: 20,
  stationId: ""
};


var personnelTypeArr = null; //人员类型
var oDistrictArr = [];

$(function(){
  loadArea(function(data) {
    window.areaList = data.pca;
  });
  loadStationArea(function(data) {
    window.stationAreaList = data.pca;
  });
});

function ajaxError(err){
  showLoading(false);
  if (err.status == 401) {
    toLogin();
    message("error", err.responseText);
  } else {
    message("error", "网络异常，请重试");
  }
}

window.onload = () => {
  token = getCookie("access_token");
  if (!token) {
    window.logOutRequest();
  }

  loadUser(token);
  init();
  // initModal()
};

function verificationModalLinkSearch({
  searchRegisterName,
  nameOfModalToHide
}) {
  if (!searchRegisterName) return;
  $("#uname").val(searchRegisterName);
  getDataList();
  $("a[href='#registerTabContent']").click();
  if (nameOfModalToHide) {
    $(nameOfModalToHide).modal("hide");
  }
}

function toLogin() {
  message("error", "请重新登录");
  setTimeout(() => {
    window.logOutRequest();
  }, 1000);
}

function loadUser(token) {
  $.ajax({
    url: httpPrefix + `/api/user/queryUserInfo?access_token=${token}`,
    withCredentials: true,
    success: function(res) {
      $(".header-user .user-info").html(res.data.username);
      userInfo = res.data;
      userInfo.watermarkConfig = {
        watermark_txt: `${res.data.username||""}${res.data.phone?"，":""}${res.data.phone||""}`,
        watermark_width: 200
      }
      /*初始化水印*/
      watermark.init(userInfo.watermarkConfig);
      // if (userInfo.role === "admin") {
      // $(".tbody-option-content .btn-delete").show();
      // $(".tbody-option-content .epidemic-btn-delete").show();
      // $(".tbody-option-content .epidemic-btn-forbit").show();
      // }
    },
    error: ajaxError
  });
}

  window.handleProvinces = () => {
  window.areaList && window.areaList.map(_item => {
    $(".provinces").each((_index, _dom) => {
      $(_dom).append(`
        <option value='${_item.value}'>${_item.value}</option>
      `);
    });
  });
  // 检测站区域筛选设置根据当前省设置城市
  $('select[name="stationProv"]')
    .val(window.config.pca_province)
    .each(function(i, e) {
      p_change(e, "请选择城市", "请选择区（县）");
    });
  // 新增检测站区域筛选设置根据当前省, 市设置
  $('select[name="suborProv"]')
    .val(window.config.pca_province)
    .each(function(i, e) {
      p_change(e, "请选择城市", "请选择区（县）", "请选择乡镇（街道）");
    });
  $('select[name="suborCity"]')
    .val(window.config.pca_city)
    .each(function(i, e) {
      c_change(e, "请选择区（县）", "请选择乡镇（街道）");
    });

  // 检测站区域筛选设置根据当前省, 市设置
  $(".register-search, .station-search").each(function() {
    p_change(
      $(this).find(".detail-filter select.provinces")
        .val(window.config.pca_province)
        .get(0),
      "请选择城市",
      "请选择区（县）",
      "请选择乡镇（街道）"
    );
    c_change(
      $(this).find(".detail-filter select.city")
        .val(window.config.pca_city)
        .get(0),
      "请选择区（县）",
      "请选择乡镇（街道）"
    );
  });
  stationQueryData();
};

// 省市区联动切换
window.p_change = (select, cityHint, areaHint, streetHint) => {
  cityHint = cityHint || "市（必填）";
  areaHint = areaHint || "区（必填）";
  streetHint = streetHint || "乡镇（街道)";
  // 市区清空
  if (defaultCity !== "" && defaultCity !== null && defaultCity !== undefined) {
    $("select[name=suborProv]").attr("disabled", true);
    $("select[name=suborCity]").attr("disabled", true);
  } else {
    $("select[name=suborProv]").removeAttr("disabled");
    $("select[name=suborCity]").removeAttr("disabled");
  }
  $(select)
    .parent()
    .find(".city")
    .html(
      `<option value='' disabled selected style='display:none;'>${cityHint}</option>`
    );
  $(select)
    .parent()
    .find(".area")
    .html(
      `<option value='' disabled selected style='display:none;'>${areaHint}</option>`
    );
  $(select)
    .parent()
    .find(".street")
    .html(
      `<option value='' disabled selected style='display:none;'>${streetHint}</option>`
    );
  let city = window.areaList && window.areaList.find(_item => {
    return _item.value === $(select).val();
  });
  city &&
  city.child.map(_item => {
    $(select)
      .parent()
      .find(".city").append(`
      <option value='${_item.value}'>${_item.value}</option>
    `);
  });
};

window.c_change = (select, areaHint, streetHint) => {
  areaHint = areaHint || "区（必填）";
  streetHint = streetHint || "乡镇（街道)";
  // 区清空
  $(select)
    .parent()
    .find(".area")
    .html(
      `<option value='' disabled selected style='display:none;'>${areaHint}</option>`
    );
  $(select)
    .parent()
    .find(".street")
    .html(
      `<option value='' disabled selected style='display:none;'>${streetHint}</option>`
    );
  let pDom = $(select)
    .parent()
    .find(".provinces")[0];
  let pName = (pDom && pDom.value || ''); // 获取这个省的名字
  let city = window.areaList && window.areaList.find(_item => {
    return _item.value === pName;
  });

  if (!city) {
    return;
  }
  let area = city && city.child.find(_item => {
    return _item.value === $(select).val();
  });
  if (!area) {
    return;
  }
  area && area.child.map(_item => {
    $(select)
      .parent()
      .find(".area").append(`
      <option value='${_item.value}'>${_item.value}</option>
    `);
  });
};

window.a_change = (select, streetHint) => {
  $(select)
    .parent()
    .find(".street")
    .html(
      `<option value='' disabled selected style='display:none;'>${streetHint}</option>`
    );
  let pName = $(select)
    .parent()
    .find(".provinces")[0].value; // 获取这个省的名字
  let province = window.areaList && window.areaList.find(_item => {
    return _item.value === pName;
  });


  if (!province) {
    return;
  }
  let cName = $(select)
    .parent()
    .find(".city")[0].value; // 获取这个市的名字
  let city = province && province.child.find(_item => {
    return _item.value === cName;
  });

  if (!city) {
    return;
  }
  let area = city && city.child.find(_item => {
    return _item.value === $(select).val();
  });
  if (area && area.child && area.child.length > 0) {
    area.child.map(_item => {
      $(select)
        .parent()
        .find(".street").append(`
        <option value='${_item.value}'>${_item.value}</option>
      `);
    });
  } else {
    $(select)
      .parent()
      .find(".street").html(`
        <option value="" disabled selected style="display:none;">暂无数据</option>
      `);
  }
};

// 检测站区域
window.handleStationProvinces = () => {
  window.stationAreaList &&
    window.stationAreaList.map(_item => {
      $(".provinces").each((_index, _dom) => {
        $(_dom).append(`
        <option value='${_item.value}'>${_item.value}</option>
      `);
      });
    });
  // 检测站区域筛选设置根据当前省设置城市
  $('select[name="stationProv"]')
    .val(window.config.pca_province)
    .each(function(i, e) {
      p_change_station(e, "请选择城市", "请选择区（县）");
    });
  // 新增检测站区域筛选设置根据当前省, 市设置
  $('select[name="suborProv"]')
    .val(window.config.pca_province)
    .each(function(i, e) {
      p_change_station(e, "请选择城市", "请选择区（县）", "请选择乡镇（街道）");
    });
  $('select[name="suborCity"]')
    .val(window.config.pca_city)
    .each(function(i, e) {
      c_change_station(e, "请选择区（县）", "请选择乡镇（街道）");
    });

  // 检测站区域筛选设置根据当前省, 市设置
  p_change_station(
    $(".station-search .detail-filter select.provinces")
      .val(window.config.pca_province)
      .get(0),
    "请选择城市",
    "请选择区（县）",
    "请选择乡镇（街道）"
  );
  c_change_station(
    $(".station-search .detail-filter select.city")
      .val(window.config.pca_city)
      .get(0),
    "请选择区（县）",
    "请选择乡镇（街道）"
  );
  stationQueryData();
};

window.p_change_station = (select, cityHint, areaHint, streetHint) => {

  cityHint = cityHint || "市（必填）";
  areaHint = areaHint || "区（必填）";
  streetHint = streetHint || "乡镇（街道)";
  // 市区清空
  if (defaultCity !== "" && defaultCity !== null && defaultCity !== undefined) {
    $("select[name=suborProv]").attr("disabled", true);
    $("select[name=suborCity]").attr("disabled", true);
  } else {
    $("select[name=suborProv]").removeAttr("disabled");
    $("select[name=suborCity]").removeAttr("disabled");
  }
  $(select)
    .parent()
    .find(".city")
    .html(
      `<option value='' disabled selected style='display:none;'>${cityHint}</option>`
    );
  $(select)
    .parent()
    .find(".area")
    .html(
      `<option value='' disabled selected style='display:none;'>${areaHint}</option>`
    );
  $(select)
    .parent()
    .find(".street")
    .html(
      `<option value='' disabled selected style='display:none;'>${streetHint}</option>`
    );
  let city =
    window.stationAreaList &&
    window.stationAreaList.find(_item => {
      return _item.value === $(select).val();
    });
  city &&
    city.child.map(_item => {
      $(select)
        .parent()
        .find(".city").append(`
      <option value='${_item.value}'>${_item.value}</option>
    `);
    });
};

window.c_change_station = (select, areaHint, streetHint) => {
  areaHint = areaHint || "区（必填）";
  streetHint = streetHint || "乡镇（街道)";
  // 区清空
  $(select)
    .parent()
    .find(".area")
    .html(
      `<option value='' disabled selected style='display:none;'>${areaHint}</option>`
    );
  $(select)
    .parent()
    .find(".street")
    .html(
      `<option value='' disabled selected style='display:none;'>${streetHint}</option>`
    );
  let pName = $(select)
    .parent()
    .find(".provinces")[0].value; // 获取这个省的名字
  let city =
    window.stationAreaList &&
    window.stationAreaList.find(_item => {
      return _item.value === pName;
    });

  if (!city) {
    return;
  }
  let area =
    city &&
    city.child.find(_item => {
      return _item.value === $(select).val();
    });
  if (!area) {
    return;
  }
  area &&
    area.child.map(_item => {
      $(select)
        .parent()
        .find(".area").append(`
      <option value='${_item.value}'>${_item.value}</option>
    `);
    });
};

window.a_change_station = (select, streetHint) => {
  $(select)
    .parent()
    .find(".street")
    .html(
      `<option value='' disabled selected style='display:none;'>${streetHint}</option>`
    );
  let pName = $(select)
    .parent()
    .find(".provinces")[0].value; // 获取这个省的名字
  let province =
    window.stationAreaList &&
    window.stationAreaList.find(_item => {
      return _item.value === pName;
    });

  if (!province) {
    return;
  }
  let cName = $(select)
    .parent()
    .find(".city")[0].value; // 获取这个市的名字
  let city =
    province &&
    province.child.find(_item => {
      return _item.value === cName;
    });

  if (!city) {
    return;
  }
  let area =
    city &&
    city.child.find(_item => {
      return _item.value === $(select).val();
    });
  if (area && area.child && area.child.length > 0) {
    area.child.map(_item => {
      $(select)
        .parent()
        .find(".street").append(`
        <option value='${_item.value}'>${_item.value}</option>
      `);
    });
  } else {
    $(select)
      .parent()
      .find(".street").html(`
        <option value="" disabled selected style="display:none;">暂无数据</option>
      `);
  }
};

// 表单校验
window.checkData = (data, isPeer, peerNo) => {
  try {
    checkName(
      data.uName,
      isPeer ? `同行人${peerNo}姓名格式有误` : "姓名格式有误"
    ); // 校验 name
    checkPhone(
      data.userPhone,
      isPeer ? `同行人${peerNo}手机号格式有误` : "手机号格式有误"
    ); // 校验手机号
    if (data.idCardType === "1") {
      checkCode(
        data.idCardNum,
        isPeer ? `同行人${peerNo}身份证格式有误` : `身份证格式有误`
      ); // 校验身份证
    } else {
      checkCodeNew(
        data.idCardNum,
        isPeer
          ? `同行人${peerNo}护照/回乡证/台胞证号码格式有误`
          : "护照/回乡证/台胞证号码格式有误"
      ); // 校验身份证
    }
    !isPeer &&
      checkEmpty(
        data.destDate,
        "来" + window.config.city_one_word + "日期不能为空"
      );
    checkEmpty(
      data.destProv,
      isPeer ? `同行人${peerNo}居住地省不能为空` : "居住地省不能为空"
    ); // 居住地省市区
    checkEmpty(
      data.destCity,
      isPeer ? `同行人${peerNo}居住地市不能为空` : "居住地市不能为空"
    ); // 居住地省市区
    checkEmpty(
      data.destDistrict,
      isPeer ? `同行人${peerNo}居住地区不能为空` : "居住地区不能为空"
    ); // 居住地省市区
    checkEmpty(
      data.destStreet,
      isPeer ? `同行人${peerNo}街道/乡镇不能为空` : "街道/乡镇不能为空"
    ); // 街道/乡镇不能为空
    checkEmpty(
      data.destArea,
      isPeer ? `同行人${peerNo}小区/村/酒店不能为空` : "小区/村/酒店不能为空"
    ); // 小区/村/酒店不能为空
    !isPeer && checkEmpty(data.departProv, "出发地省不能为空"); // 出发地省市区
    !isPeer && checkEmpty(data.departCity, "出发地市不能为空"); // 出发地省市区
    !isPeer && checkEmpty(data.departDistrict, "出发地区不能为空"); // 出发地省市区
    !isPeer && checkEmpty(data.travelNo, "车牌号码/航班号/车次不能为空"); // 校验车牌号码/航班号/车次不能为空
    if (!isPeer && data.travelType === "1") {
      checkCarId(data.travelNo, "车牌号码格式不对"); // 正则校验
    }
    isPeer && checkEmpty(data.relType, `同行人${peerNo}与我的关系不能为空`); // 与我的关系
  } catch (error) {
    message("error", error);
    return false;
  }
  return true;
};

$("#submit-form").on("click", function(e) {
  var optionType = $("#submit-form").attr("data-type");
  switch (optionType) {
    case "create":
      handleCreateOk();
      break;
    case "edit":
      handleEditOk();
      break;
    case "detail":
      handleHideDetail();
      break;
    default:
      break;
  }
});

// 表单提交确认
function handleCreateOk() {
  // showLoading(true)
  let data = qs.parse($("#userForm").serialize());
  if (!checkData(data, false)) {
    return;
  }
  data = submitFormate(data);
  data.source = 3;
  data.people = [
    {
      name: data.name,
      idCardType: data.idCardType,
      idCardNum: data.idCardNum,
      phone: data.phone,
      relType: data.relType,
      destProv: data.destProv,
      destCity: data.destCity,
      destDistrict: data.destDistrict,
      destStreet: data.destStreet,
      destArea: data.destArea,
      destAddr: data.destAddr,
      destDate: data.destDate
    }
  ];
  window.createSave(data, token); // 开始提交表单
}

function submitFormate(data) {
  data.name = data.uName;
  data.phone = data.userPhone;
  if (data.destDate) data.destDate = data.destDate + " 00:00:00"; // 补充时分秒
  delete data.uName;
  delete data.userPhone;
  return data;
}

window.createSave = data => {
  var token = getCookie("access_token");
  showLoading(true);
  $.ajax({
    type: "POST",
    url: httpPrefix + `/api/companionRecord/save?access_token=${token}`,
    data: JSON.stringify(data),
    //timeout: 300,
    async: true, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: function(res) {
      showLoading(false);
      handleHideDetail();
      getDataList();
    },
    error: ajaxError
  });
};

// 编辑信息确认
function handleEditOk() {
  let data = qs.parse($("#userForm").serialize());
  if (!checkData(data, false)) {
    return;
  }
  delete data.recordId;
  data = submitFormate(data);
  var person = [
    {
      id: data.id,
      recordId: data.recordId,
      name: data.uName,
      idCardType: data.idCardType,
      idCardNum: data.idCardNum,
      phone: data.userPhone,
      relType: data.relType,
      travelType: data.travelType,
      travelNo: data.travelNo,
      departProv: data.departProv,
      departCity: data.departCity,
      departDistrict: data.departDistrict,
      destProv: data.destProv,
      destCity: data.destCity,
      destDistrict: data.destDistrict,
      destStreet: data.destStreet,
      destArea: data.destArea,
      destAddr: data.destAddr,
      destDate: data.destDate,
      status: 0
    }
  ];

  var records = { update: person, create: [] };

  for (var i = 0; i < deletesRecord.length; i++) {
    records.update.push(deletesRecord[i]);
  }

  let flag = true;
  $("#peer_contain")
    .find('form[name="peerForm"]')
    .each((_index, _form) => {
      let d = qs.parse($(_form).serialize());
      flag = checkData(d, true, _index + 1); // 标志位
      d = submitFormate(d);
      if (d.recordId) {
        d.status = 0;
        d.travelType = data.travelType;
        d.travelNo = data.travelNo;
        d.departProv = data.departProv;
        d.departCity = data.departCity;
        d.departDistrict = data.departDistrict;
        d.destDate = data.destDate;

        records.update.push(d);
      } else {
        d.recordId = data.recordId;
        d.travelType = data.travelType;
        d.travelNo = data.travelNo;
        d.departProv = data.departProv;
        d.departCity = data.departCity;
        d.departDistrict = data.departDistrict;
        d.destDate = data.destDate;
        delete d.id;
        records.create.push(d);
      }
    });
  if (records.create.length < 1) delete records.create;

  if (!flag) {
    return;
  }
  window.editSave(records); // 开始提交表单
}

window.editSave = data => {
  var token = getCookie("access_token");

  showLoading(true);
  $.ajax({
    type: "PUT",
    contentType: "application/json",
    url: httpPrefix + `/api/companionRecord/update?access_token=${token}`,
    data: JSON.stringify(data),
    success: function(res) {
      showLoading(false);
      handleHideDetail();
      message("success", "保存成功");
      getDataList();
    },
    error: ajaxError
  });
};

function init() {
  // 全局
  loadConfig();
  bindLogoutEvent();
  // stat数据
  queryStatCount();
  // 登记人员管理
  resetSelect();
  $("#demo4.input-daterange")
    .datepicker({
      // 日期组件初始化
      endDate: getNowFormatDate(),
      format: "yyyy-mm-dd",
      Multidate: 2,
      size: "small",
      timepicker: true,
      autoclose: false //这里最好设置为false
    })
    .on("changeDate", handleDateChange);

  $("#station-record-filter .input-date").datepicker({
    endDate: getNowFormatDate(),
    format: "yyyy-mm-dd",
    Multidate: 2,
    size: "small",
    timepicker: true,
    autoclose: false //这里最好设置为false
  });

  $("#epidemic-record-filter .input-date").datepicker({
    endDate: getNowFormatDate(),
    format: "yyyy-mm-dd",
    Multidate: 2,
    size: "small",
    timepicker: true,
    autoclose: false //这里最好设置为false
  });

  $("#time").datepicker({
    endDate: getNowFormatDate(),
    format: "yyyy-mm-dd",
    Multidate: 2,
    size: "small",
    timepicker: false,
    autoclose: true,
    startView: 0,
  }).on('changeDate', function(ev){
    var dateTime = '';
    if (ev.date === undefined) {
      var myDate = new Date();
      dateTime = getFormatDate(myDate);
      $("#time").val(dateTime).datepicker('setDate', dateTime);
    } else {
      dateTime = getFormatDate(ev.date)
    }
    queryStatistics(dateTime);
  });
}

function getFormatDate (d) {
  var date = new Date(d);
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
function loadConfig() {
  // 文案配置
  loadSpecConfig(function(data) {
    window.oConfig = data;
    // 默认省份
    defaultProvince = data['fk.register.area.province'];
    // 默认地市
    defaultCity = data['fk.register.area.city'];

    if (defaultCity !== "" && defaultCity !== null && defaultCity !== undefined) {
      $("select[name=search_provinces]").attr("disabled", true);
      $("select[name=search_city]").attr("disabled", true);
    } else {
      $("select[name=search_provinces]").removeAttr("disabled");
      $("select[name=search_city]").removeAttr("disabled");
    }

    window.config = {
      pca_province: data['fk.register.area.province'],
      pca_city: data['fk.register.area.city'],
      city_two_word: data.city.replace(/市/g, ""),
      city_one_word: data.cityShortName,
      depart_country_type: data.depart_country_type, // 出发地类{0:"国内出发",1:"国外出发"}
      depart_country: data.depart_country, // 国外类型  {2:"韩国",3:"意大利",4:"伊朗",5:"日本",6:"巴林",7:"新加坡",8:"科威特",99:"其他国家或地区"}
    };
    document.title =
      data.backendSystemName || config.pca_city + "疫情防控登记系统";
    $(".header-title").text(document.title);
    // $(".list-header-title").text(data.backendTableName || document.title);
    $(".destProvLabel").text(
      data.returnCityResidence || `${window.config.city_two_word}居住地`
    );
    $("#destDateLabel").text(`来${window.config.city_one_word}日期`);
    $("input[name='destDate']").attr(
      "placeholder",
      `填写到达${window.config.city_one_word}日期（必填）`
    );
    $(".labelForGoHb").text(data.isInAddress);
    $(".labelForContactHb").text(data.isContactPeople);

    // 人员类型下拉选项配置
    if (data["back.person.type"]) {
      var arr = JSON.parse(data["back.person.type"]);
      personnelTypeArr = arr;
      var optionStringForModal = "";
      var optionStringForSearch = "";
      arr && arr.forEach(function(item) {
        optionStringForModal += `<option value="${item.key}">${item.name}</option>`;
        optionStringForSearch += `<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="${item.key}">${item.name}</a></li>`;
      });
      if (optionStringForModal) {
        $("#personnelTypeForModal").html(optionStringForModal);
      }
      if (optionStringForSearch) {
        $("#personnelTypeForSearch").append(optionStringForSearch);
        $("#ta-personnelTypeForSearch").append(optionStringForSearch);
      }
    }

    if (data["back.registration.export"] == "1") {
      $("#exportBtn").css("display", "bolck");
    } else {
      $("#exportBtn").css("display", "none");
    }

    if (data["color_definition"]) {
      try {
        let colorArr = JSON.parse(data["color_definition"]);
        let colorOptionStr = colorArr.reduce(function(str, cfg) {
          str += `<li role="presentation"><a role="menuitem" tabindex="-1" href="#" value="${cfg.color}">${cfg.text}</a></li>`;
          return str;
        }, '');
        $('#ta-codeColorList').append(colorOptionStr);
      } catch(e) {
        console.error(e);
      }
    }

    initModal();
    epidemicInitModal(data);
    window.configStationTypeList = data.stationType ? JSON.parse(data.stationType) : [];
    window.stationInitStationType();

    // 登记人管理初始化
    initPagination(0);
    queryData();
    searchEventBind();
    leaveRecord.initModal();

    // 检测站初始化
    stationInitPagination(0);
    stationSearchEventBind();
    stationInitModal();
    initStationCheckerModal();
    initPaginationForStationCheckList(0);

    // 核验员管理初始化
    epidemicInitPagination(0);
    epidemicSearchEventBind();
    epidemicInitSearchCity();
    epidemicQueryData();
    initEpidemicHeYanJiLuModal();

    // 通行码管理初始化
    labelAdmin.onload();

    // 今日疫情预警tab页
    todayAlertInitPagination(0);
    resetTodayAlertSelect();
    queryTodayAlertData();
    todayAlertSearchEventBind();

    // 数据统计
    //获取当前时间 年-月-日
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    var nowDate = year + "-" + month + "-" + day;
    $("#time").val(nowDate);
    queryStatistics(nowDate);

  }, '', '', true);
}
function resetSelect() {
  $("#source")
    .siblings("span")
    .text("全部");
  $("#personnelType")
    .siblings("span")
    .text("全部");
  $("#healthStatus")
    .siblings("span")
    .text("全部");
  $("#labelId")
    .siblings("span")
    .text("全部");
  if (window.config) {
    if (window.config.pca_province) {
      p_change(
        $(".register-search .detail-filter select.provinces")
          .val(window.config.pca_province)
          .get(0),
        "请选择城市",
        "请选择区（县）",
        "请选择乡镇（街道）"
      );
    }
    if (window.config.pca_city) {
      c_change(
        $(".register-search .detail-filter select.city")
          .val(window.config.pca_city)
          .get(0),
        "请选择区（县）",
        "请选择乡镇（街道）"
      );
    }
  }
}

function bindLogoutEvent() {
  $("#logout").click(function() {
    window.logOutRequest();
  });
}

function searchEventBind() {
  $("#resetBtn").bind("click", function() {
    $(".search-zone .detail-filter input").val("");
    $(".search-zone .dropdown-inner a span").text("");
    resetSelect();
    queryData();
  });
  $("#searchBtn").bind("click", function() {
    currentPage = 1;
    getDataList();
  });
  $("#exportBtn").bind("click", function() {
    exportData();
  });
}

// 分页组件初始化
function initPagination(itemsCount) {
  $("#registerTabContent .pagination-content .pagination").pagination({
    itemsCount: itemsCount,
    currentPage: currentPage,
    pageSize: pageSize,
    styleClass: ["pagination-large"],
    showCtrl: true,
    displayPage: 6,
    onSelect: handlePageChange
  });
  renderPageExtra(itemsCount);
  $("#pageSizeChange").change(function(e) {
    pageSize = $(e.currentTarget).val();
    currentPage = 1;
    getDataList();
  });
}

function renderStatCount(data) {
  $("#registrationsCounts").html(data.registrationsCount);
  $("#registrationsCountsToday").html(data.registrationsCountToday);
  $("#registrationsCountsCar").html(data.registrationsCountCar);
  $("#registrationsCountsCarToday").html(data.registrationsCountCarToday);
  $("#registrationsCountsTrain").html(data.registrationsCountTrain);
  $("#registrationsCountsTrainToday").html(data.registrationsCountTrainToday);
  $("#registrationsCountsPlane").html(data.registrationsCountPlane);
  $("#registrationsCountsPlaneToday").html(data.registrationsCountPlaneToday);
}

function renderPageExtra(num) {
  $("#registerTabContent .pagination-content .pagination-extra .label").html(num);
}

// 日期组件change
function handlePageChange(page) {
  currentPage = page;
  getDataList();
}

// 日期组件change
function handleDateChange() {
  // var startDate = $('.startDate').val()
  // var endDate = $('.endDate').val()
  // console.log('changeDate', startDate, endDate)
  // getDataList()
}

function getDataList() { // todo 查询、导出参数优化
  var params = {};
  params.page = currentPage;
  params.pageSize = pageSize;
  // 查询项值
  params.startRecordTime = $(".startDate").val()
    ? $(".startDate").val() + ":00"
    : $(".startDate").val();
  params.endRecordTime = $(".endDate").val()
    ? $(".endDate").val() + ":00"
    : $(".endDate").val();
  // params.travelNo = $("#travelNo").val();
  params.name = $("#uname").val();
  params.phone = $("#phone").val();
  params.source = $("#source").val();
  params.healthStatus = $("#healthStatus").val();
  params.personnelType = $("#personnelType").val();
  params.labelId = $("#labelId").val();
  params.idCardNum = $("#register-idCardNum").val();
  params.travelNo = $("#register-plate").val();
  params.destCity = $('.register-search .city').val();
  params.destDistrict = $('.register-search .area').val();
  params.destStreet = $('.register-search .street').val();
  params.idCardNum = $('#idCardNum').val();
  queryData(params);
}

function exportData() { // todo 查询、导出参数优化
  var personnelType = $("#personnelType").val() || '';
  var startRecordTime = $(".startDate").val()
    ? $(".startDate").val() + " 00:00:00"
    : '';
  var endRecordTime = $(".endDate").val()
    ? $(".endDate").val() + " 23:59:59"
    : '';
  var name = $("#uname").val() || '';
  var phone = $("#phone").val() || '';
  var source = $("#source").val() || '';
  var healthStatus = $("#healthStatus").val() || '';
  var labelId = $("#labelId").val() || '';
  var idCardNum = $("#register-idCardNum").val() || '';
  var travelNo = $("#register-plate").val() || '';
  var destCity = $('.register-search .city').val() || '';
  var destDistrict = $('.register-search .area').val() || '';
  var destStreet = $('.register-search .street').val() || '';

  var token = getCookie("access_token");
  var url =
    httpPrefix +
    "/api/companionRecord/export?access_token=" +
    token +
    "&personnelType=" +
    personnelType +
    "&startRecordTime=" +
    startRecordTime +
    "&endRecordTime=" +
    endRecordTime +
    "&name=" +
    name +
    "&phone=" +
    phone +
    "&source=" +
    source +
    "&healthStatus=" +
    healthStatus +
    "&labelId=" +
    labelId +
    "&idCardNum=" +
    idCardNum +
    "&travelNo=" +
    travelNo +
    "&destCity=" +
    destCity +
    "&destDistrict=" +
    destDistrict +
    "&destStreet=" +
    destStreet;

  console.log('导出url', url)
  window.location.href = url;
}

// 出行方式切换选择后，对应信息没有清空，还是原有默认
window.clearTravelNo = () => {
  $('input[name="travelNo"]').val(null);
};


// 列表请求
function queryData(paramet) {
  var token = getCookie("access_token");
  showLoading(true);
  $.ajax({
    type: "GET",
    url:
      httpPrefix +
      "/api/companionRecord/list?access_token=" +
      token +
      "&size=" +
      pageSize +
      "&current=" +
      currentPage,
    data: paramet,
    cache: false, //浏览器是否应该被允许缓存GET响应。
    success: function(res) {
      var data = res.data || {};
      $("#registerTabContent .pagination-content .pagination").pagination(
        "updateItemsCount",
        data.total,
        currentPage
      );
      $("#registerTabContent .pagination-content .pagination").pagination(
        "updatePages",
        parseInt((data.total - 1) / pageSize) + 1,
        currentPage
      );
      renderPageExtra(data.total);
      showLoading(false);
      changeList(data.data);
    },
    error: function(err) {
      showLoading(false);
      if (err.statusCode == 401) {
        toLogin();
      } else {
        message("error", "网络异常，请重试");
        changeList([]);
      }
    }
  });
}

function renderLabel(imgUrl) {
  /*
  var tagImgName = {
    "0": "./public/pass.png",
    "1": "./public/work.png",
    "2": "./public/isolation.png"
  };
  var src = tagImgName[String(labelType)];
  */
  return imgUrl ? '<img alt="" src="' + imgUrl + '">' : "无";
}

// 列表请求
function queryStatCount() {
  var token = getCookie("access_token");
  $.ajax({
    type: 'GET',
    url: httpPrefix + '/api/companionRecord/selectCount?access_token=' + token,
    cache: false, //浏览器是否应该被允许缓存GET响应。
    success: function(res) {
      var data = res || {};
      renderStatCount(data);
    },
    error: function(err) {
      showLoading(false);
    }
  });
}

// 列表渲染
// 操作逻辑需要同步到changeTodayAlertList
function changeList(data) {
  var auth = {
    '人员轨迹':false,
    '健康打卡':false,
    '核验记录':false,
    '详情':false,
    '删除':false,
    '导出':false,
  };
  window.btnAuth['登记人员'] && window.btnAuth['登记人员'].forEach(item=>{
    auth[`${item}`] = true;
  })
  auth['导出'] ? $('#exportBtn').show() : $('#exportBtn').hide();

  var content = "";
  var labelMap = {};
  if (!data || !data.length) {
    content = '<div style="text-align: center;">暂无数据</div>';
  } else {
    labelMap = (allLabelsInfo || []).reduce(function(lblMap, label) {
      lblMap[label.labelId] = label.iconPath;
      return lblMap;
    }, {});

    data.map(item => {
      let companionCount = item.companion;
      let companionString = companionCount;

      if (companionCount > 0) {
        let domId = `companion-tooltip-${item.recordId}-${item.id}`;
        companionString = `<a
          id="${domId}"
          style="cursor:pointer"
          >${companionCount}</a>`;
        renderCompanionList(item, `#${domId}`, companionCount);
      }

      // 添加方式 0-自主添加 !0-委托添加
      let addWayText =
        item.relType === 0
          ? `<span style="color:#28a3ef; cursor: pointer;" onclick="addWay('${item.parentRecordId}')">自主添加</span>`
          : `<span style="color:#28a3ef; cursor: pointer;" onclick="addWay('${item.parentRecordId}')">委托添加</span>`;

      // 0-健康，1-不健康
      let healthString =
        item.healthStatus === 1
          ? `<span style="color:red">${item.healthDescribe}</span>`
          : item.healthStatus === 0
          ? `${item.healthDescribe}`
          : "-";
      // let editString = `<a href="javascript:void(0);" class="sui-btn btn-link table-option" onclick="handleViewDetail('edit', '${item.recordId}')">编辑</a>`;
      let travelType =
        ["汽车", "火车", "飞机", "其他"][item.travelType - 1] ||
        ["私家车", "公交车", "电动车", "其他"][item.localTravelType - 1] ||
        "-";
      let travelNo = item.travelNo || item.localTravelNo || "-";
      let personnelTypeName = "";
      if (personnelTypeArr != null) {
        personnelTypeArr && personnelTypeArr.forEach(function(personnelType) {
          if (personnelType.key == item.personnelType) {
            personnelTypeName = personnelType.name;
          }
        });
      }
      let optionBtn = '';
      auth['人员轨迹'] && (optionBtn += `<a href="/map.html?id=${item.idCardNum}&recordId=${item.recordId}" target="map" class="sui-btn btn-link table-option">人员轨迹</a>`);
      (optionBtn += `<a href="javascript:void(0);" class="sui-btn btn-link table-option" onclick="leaveRecord.showModalAndFetch('${item.name}', '${item.recordId}')">离徐记录</a>`);
      auth['核验记录'] && (optionBtn += `<a href="javascript:void(0);" class="sui-btn btn-link table-option" onclick="verificationViewHealthDetail('${item.name}', '${item.recordId}')">核验记录</a>`);
      auth['健康打卡'] && (optionBtn += `<a href="javascript:void(0);" class="sui-btn btn-link table-option" onclick="handleViewHealthDetail('${item.name}', '${item.recordId}')">健康记录</a>`)
      auth['详情'] && (optionBtn += `<a href="javascript:void(0);" class="sui-btn btn-link table-option" onclick="handleViewDetail('detail', '${item.recordId}', '${item.updateCount}')">详情</a>`)
      auth['删除'] && (optionBtn += ` <a href="javascript:void(0);" data-id=${item.recordId} data-placement="top" data-trigger="click" data-type="confirm" data-toggle="tooltip" data-title="是否确定删除本条登记信息" class="sui-btn btn-link table-option btn-delete">删除</a>`);

      content += `
        <tr>
          <td class="td-id"><div class="tp" data-placement="top" data-toggle="tooltip" title="${
            item.recordId
          }">${item.recordId}</div></td>
          <td style="width:7%;">${item.name}</td>
          <td style="width:12%;word-break:break-all;">${item.idCardNum}</td>
          <td style="width:7%;word-break:break-all;">${addWayText}</td>
          <td style="width:10%;word-break:break-all;">${item.phone}</td>
          <td>${personnelTypeName}</td>
          <td>${travelType}</td>
          <td style="width:7%;word-break:break-all;">${travelNo}</td>
          <td class="companion-tooltip">${companionString}</td>
          <td style="width:10%;word-break:break-all;">${(item.recordTime || "").replace(
            "T",
            " "
          )}</td>
          <td>${RECORD_SOURCE_TYPE[item.source]}</td>
          <td data-labelId="${item.labelId}">${renderLabel(
        labelMap[item.labelId]
      )}</td>
          <td>${healthString}</td>
          <td style="width:8%;word-break:break-all;">${
        !item.reportName && !item.verificationDate && !item.verificationTime
          ? '-'
          : `<div style="display:flex;flex-direction: column;">
          <span>${item.reportName || ''}</span>
          <span>${item.verificationDate || ''}</span>
          <span>${item.verificationTime || ''}</span>
          </div>`
          }</td>
          <td class="tbody-option">
            <div class="tbody-option-content">
              <div>
                ${optionBtn || '-'}
              </div>
            </div>
          </td>
        </tr>
      `;
    });
  }
  $("#registerTabContent .tbody-list").html(content);
  $("#registerTabContent .btn-delete").tooltip({
    okHide: function() {
      handleDelete(this);
    }
  });
  $("#registerTabContent .tbody-list .td-id div").tooltip();
  refreshWatermark();
}

// 添加方式弹框
function addWay(parentRecordId) {
  var token = getCookie("access_token");
  showLoading(true);
  $.ajax({
    type: "GET",
    url: httpPrefix + "/api/companionRecord/list?access_token=" + token,
    data: { parentRecordId: parentRecordId },
    async: true,
    cache: false,
    contentType: "application/json",
    withCredentials: true,
    success: function(res) {
      $("#addWay_contain").empty();
      let data = res.data.data.reverse() || {};
      showLoading(false);
      var html = '';
      data.map(item => {
        // 添加方式 0-自主添加 !0-委托添加
        let addWayText = item.relType === 0 ? `<span>自主添加</span>` : `<span>委托添加</span>`;

        const getWayStr = `
          <tr>
            <td>${item.name}</td>
            <td>${addWayText}</td>
            <td>${item.phone || '-'}</td>
            <td style="color:#28a3ef; cursor: pointer;" onclick="getWaySearch('${item.idCardNum}')">${item.idCardNum || '-'}</td>
          </tr>
        `;
        html += getWayStr;
      });
      $('#addWay_contain').html(html);
      $("#addWay-create").modal("show");
    },
    error: ajaxError
  });
}

function getWaySearch(idCardNum) {
  $("#idCardNum").val(idCardNum);
  currentPage = 1;
  getDataList();
  $("#addWay-create").modal("hide");
}

// 渲染同行人数据
function renderCompanionList(item, domId, companionCount) {
  var token = getCookie("access_token");
  var recordId = item.recordId;
  var currentPersonId = item.id;
  showLoading(true);
  $.ajax({
    type: "GET",
    url: httpPrefix + "/api/companionRecord/list?access_token=" + token,
    data: { recordId: recordId },
    //timeout: 300,
    async: true, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: function(res) {
      let data = res.data || {};
      showLoading(false);
      let size = 0;
      let listString = data.data
        .filter(function(_item) {
          return _item.id !== currentPersonId;
        })
        .map(function(_item) {
          size++;
          let healthString =
            _item.healthStatus === 1
              ? `<span style="color:red">${_item.healthDescribe}</span>`
              : _item.healthStatus === 0
              ? `${_item.healthDescribe}`
              : "-";
          let travelType =
            ["汽车", "火车", "飞机", "其他"][_item.travelType - 1] ||
            ["私家车", "公交车", "电动车", "其他"][_item.localTravelType - 1] ||
            "-";
          let travelNo = _item.travelNo || _item.localTravelNo || "-";

          return `<tr>
          <td>${_item.recordId}</td>
          <td style="width:10%;">${_item.name}</td>
          <td style="width:12%;word-break:break-all;">${_item.idCardNum}</td>
          <td style="width:10%;word-break:break-all;">${_item.phone}</td>
          <td>${travelType}</td>
          <td style="word-break:break-all;">${travelNo}</td>
          <td style="width:10%;word-break:break-all;">${_item.recordTime.replace(
            "T",
            " "
          )}</td>
          <td>${RECORD_SOURCE_TYPE[_item.source]}</td>
          <td>${healthString}</td>
          </tr>`;
        })
        .join("");

        let remark = '';
        if (companionCount > size) {
            remark = '(部分数据无权限查看)';
        }

      let companionTable = `<div><table class="sui-table">
          <thead>
            <tr>
              <th>登记ID</th>
              <th style="width:10%;">姓名</th>
              <th style="width:12%;word-break:break-all;">证件号码</th>
              <th style="width:10%;word-break:break-all;">电话</th>
              <th style="word-break:break-all;">出行方式</th>
              <th>车次/航班/车牌</th>
              <th>登记时间</th>
              <th>登记来源</th>
              <th>健康状况</th>
            </tr>
          </thead>
          <tbody>${listString}</tbody>
        </table></div>`;
      $(`${domId}`).tooltip({
        title: `<div>
        <div style="text-align:center;"><span style="font-size: 18px;">同行人信息</span><span>${remark}</span></div>
        <div>${companionTable}</div>
        </div>`,
        html: true,
        placement: "bottom",
        width: "800px", // 1024屏的情况下要确保显示了tooltip的情况下，不需要操作横向滚动条就能看清楚
        trigger: "focus click hover",
        align: "center"
      });
    },
    error: ajaxError
  });
}

// 核验人员总表渲染
function totalCheckerList(totalData, curData) {
  var content = "";
  if (!(totalData || []).length) {
    content = '<div style="text-align: center;">核验人员总表渲染暂无数据</div>';
    $("#checkerToVerification_checkerList").html(content);
  } else {
    $("#checkerToVerification_checkerList").empty();
    totalData.map(item => {
      const isCommomtChecker = curData.some(curItem => {
        return item.id === curItem.id;
      });
      let p = $("<p>");
      let label =
        item.count >= 5 || isCommomtChecker
          ? $(`<label itemId="${item.id}" class="checkbox-pretty inline allCheckerList disabled" disabled="true">
          <input type="checkbox" disable="true"><span>${item.realName}   ${item.phone}</span>
          </label>`)
          : $(`<label itemId="${item.id}" class="checkbox-pretty inline allCheckerList">
          <input type="checkbox"><span>${item.realName}   ${item.phone}</span>
          </label>`);
      p.append(label);
      $("#checkerToVerification_checkerList").append(p);
    });
  }
}

// 当前核验站人员列表
function curCheckerList(curCheckerData) {
  var curCheckerList = "";
  if (!(curCheckerData || []).length) {
    curCheckerList =
      '<div style="text-align: center;">当前核验站人员列表暂无数据</div>';
    $("#checkerToVerification_verificationList").html(curCheckerList);
  } else {
    $("#checkerToVerification_verificationList").empty();
    curCheckerData.map(item => {
      let p = $("<p>");
      let label = $(`<label itemId="${item.id}" class="checkbox-pretty inline curCheckerList">
        <input type="checkbox" name="checker" checked="checked"><span>${item.realName}   ${item.phone}</span>
        </label>`);
      p.append(label);
      $("#checkerToVerification_verificationList").append(p);
    });
  }
}

$(".checkerToVerification_contain1").on("click", ".allCheckerList", function(
  e
) {
  if ($(this).attr("disabled")) {
    e.preventDefault();
  }
});

// 保存当前检疫员
function saveCurCheckers(curCheckerIds) {
  // console.log(
  //   JSON.stringify({
  //     stationId: 3,
  //     userIdList: curCheckerIds
  //   })
  // );
  $.ajax({
    type: "POST",
    url: httpPrefix + "/api/station/saveFkUser?access_token=" + token,
    data: JSON.stringify({
      stationId: stationCheckerPage.curStationId,
      userIdList: curCheckerIds
    }),
    contentType: "application/json",
    withCredentials: true,
    success: function(res) {
      queryCheckerList();
    }
  });
}

// 添加检疫员
$(".addCurChecker").click(function() {
  var curCheckerIds = $(".allCheckerList.checked")
    .map(function() {
      return $(this).attr("itemId");
    })
    .toArray();
  var allCheckerIds = $(".curCheckerList")
    .map(function() {
      return $(this).attr("itemId");
    })
    .toArray();
  saveCurCheckers(curCheckerIds.concat(allCheckerIds));
});

// 移除检疫员
$(".removeCurChecker").click(function() {
  if (stationCheckerPage.checkerSearchValue) {
    var curCheckerIds = $(".curCheckerList")
      .filter(function() {
        return $(this).hasClass("checked");
      })
      .map(function() {
        return $(this).attr("itemId");
      })
      .toArray();
    curCheckerIds = stationCheckerPage.curStationChecker
      .filter(function(item) {
        // console.log(item);
        return curCheckerIds.some(function(curCheckerIdsItem) {
          // console.log(item.id, curCheckerIdsItem);
          return item.id != curCheckerIdsItem;
        });
      })
      .map(function(item) {
        return item.id.toString();
      });
  } else {
    curCheckerIds = $(".curCheckerList")
      .filter(function() {
        return !$(this).hasClass("checked");
      })
      .map(function() {
        return $(this).attr("itemId");
      })
      .toArray();
  }
  saveCurCheckers(curCheckerIds);
});

// 为检测站批量处理检测员的弹出框hide
$("#checkerToVerification-btn-close-x")
  .off()
  .on("click", function(e) {
    $("#checkerToVerificationModal-create").modal("hide");
  });

// 总表搜索
var search_input = $('#totalCheckerSearch');
$(search_input).bind('input porpertychange', function(e) {
  //   if (e.which == 13) {
  // console.log(e);
  e.preventDefault();
  // console.log(search_input.val());
  var totalCheckerSearchValue = search_input.val();
  queryTotalCheckerSearch(totalCheckerSearchValue);
  //   }
});

// 总表搜索,并刷新页面
function queryTotalCheckerSearch(value) {
  var token = getCookie("access_token");
  showLoading(true);
  // 获取核验人员总表
  $.ajax({
    type: "POST",
    url:
      httpPrefix + "/api/station/fk/queryUserByCondition?access_token=" + token,
    data: JSON.stringify({
      isCount: true, // 是否返回该人员的监测站个数
      condition: value
    }),
    //timeout: 300,
    async: true, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: function(res) {
      var data = res.data || {};
      var totalCheckerData = data.data || [];
      showLoading(false);
      totalCheckerList(totalCheckerData, stationCheckerPage.curStationChecker);
    },
    error: ajaxError
  });
}

// 检测人员搜索,并刷新页面
var checker_search = $('#checkerSearch');
$(checker_search).bind('input porpertychange', function(e) {
  //   if (e.which == 13) {
  e.preventDefault();
  var checkerSearchValue = checker_search.val();
  stationCheckerPage.checkerSearchValue = checkerSearchValue;
  queryCheckerSearch(checkerSearchValue);
  //   }
});
function queryCheckerSearch(value) {
  var token = getCookie("access_token");
  showLoading(true);
  $.ajax({
    type: "POST",
    url:
      httpPrefix + "/api/station/fk/queryUserByCondition?access_token=" + token,
    data: JSON.stringify({
      stationId: stationCheckerPage.curStationId, // 监测站Id
      condition: value
    }),
    //timeout: 300,
    async: true, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: function(res) {
      var data = res.data || {};
      var curCheckerData = data.data || [];
      showLoading(false);
      curCheckerList(curCheckerData); // 924行代码
    },
    error: ajaxError
  });
}

function queryCheckerList() {
  var token = getCookie("access_token");
  // 获取核验人员总表
  $.ajax({
    type: "POST",
    url:
      httpPrefix + "/api/station/fk/queryUserByCondition?access_token=" + token,
    data: JSON.stringify({
      isCount: true // 是否返回该人员的监测站个数
    }),
    //timeout: 300,
    async: true, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: function(res) {
      var data = res.data || {};
      var totalCheckerData = data.data || [];
      showLoading(false);
      // 获取核验站人员列表
      $.ajax({
        type: "POST",
        url:
          httpPrefix +
          "/api/station/fk/queryUserByCondition?access_token=" +
          token,
        data: JSON.stringify({
          stationId: stationCheckerPage.curStationId // 监测站Id
        }),
        //timeout: 300,
        async: true, //所有请求均为异步。如果需要发送同步请求
        cache: false, //浏览器是否应该被允许缓存GET响应。
        contentType: "application/json",
        withCredentials: true,
        success: function(res) {
          var data = res.data || {};
          var curCheckerData = data.data || [];
          showLoading(false);
          curCheckerList(curCheckerData); // 924行代码
          totalCheckerList(totalCheckerData, curCheckerData);
          stationCheckerPage.curStationChecker = curCheckerData;
        },
        error: ajaxError
      });
    },
    error: ajaxError
  });
}

// 人员调整对话框
function handleTransformModal() {
  $("#checkerToVerificationModal-create").modal("show");
  $("#checkerToVerification_checkerList").empty();
  $("#checkerToVerification_verificationList").empty();
  showLoading(true);
  queryCheckerList();
}

function handleDelete(e) {
  var token = getCookie("access_token");

  var id = $(e).attr("data-id");
  e.tooltip("hide");

  showLoading(true);
  $.ajax({
    type: "delete",
    url:
      httpPrefix +
      "/api/companionRecord/delete?access_token=" +
      token +
      "&recordId=" +
      id,
    //data: {recordId: id},
    //timeout: 300,
    async: true, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: function(res) {
      if (res && !res.isError) {
        getDataList();
        message("success", "删除成功");
      }
    },
    error: ajaxError
  });
}

//  获取当前时间
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

$("#btn-cancel").on("click", function(e) {
  handleHideDetail();
});

$("#btn-close-x").on("click", function(e) {
  handleHideDetail();
});

$("#health-btn-cancel").on("click", function(e) {
  $("#healthModal-create").modal("hide");
});

$("#health-btn-close-x").on("click", function(e) {
  $("#healthModal-create").modal("hide");
});
$("#verification-btn-close-x").on("click", function(e) {
  $("#verificationModal-create").modal("hide");
});
$("#verification-btn-close-x2").on("click", function(e) {
  $("#verificationModal-create2").modal("hide");
});
$("#check-btn-close-x").on("click", function(e) {
  $("#station-checkModal").modal("hide");
});

function addWayCancel() {
  $("#addWay-create").modal("hide");
}

// 隐藏弹出框
function handleHideDetail() {
  $("#myModal-create").modal("hide");
  initModal();
  // 隐藏弹框清空 基本信息 和 同乘人员信息
  $("#peer_contain").html("");
  // 清除 禁用装态
  $("#myModal-create")
    .find("input")
    .each((_index, _dom) => {
      $(_dom).removeClass("use-disabled");
    });
  $("#myModal-create")
    .find("select")
    .each((_index, _dom) => {
      $(_dom).removeClass("use-disabled");
    });
  $(".btn-add-peer").removeClass("btn-add-peer-no");
}

// 初始化表单数据
function initModal() {
  let dom = $("#modal-temp-from"); // 获取modal模版
  $("#userForm").html(dom.html());
  $("#userForm #destDate").datepicker({
    startDate: getNowFormatDate(),
    keyboardNavigation: false,
    format: "yyyy-mm-dd"
  });
  window.handleProvinces();
  window.handleStationProvinces();
}
function handleViewHealthDetail(name, id) {
  // id 用于查询详情或者
  $("#healthModalLabel").text(`${name} - 健康记录`);
  $("#healthModal-create").modal("show");
  var token = getCookie("access_token");
  showLoading(true);
  $("#health_contain").empty();
  $.ajax({
    type: "GET",
    url: httpPrefix + "/api/healthDeclaration/listByPage?access_token=" + token,
    data: {
      recordId: id,
      size: 100,
      current: 1
    },
    //timeout: 300,
    async: true, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: function(res) {
      var data = res.data || {};
      const currentDetail = data.data || [];
      showLoading(false);
      if (currentDetail.length < 1) {
        $("#health_contain").text("暂无健康打卡数据！");
        return;
      }
      // 数据回显
      currentDetail.forEach(item => {
        let p = $("<p>");
        let declareDate = $('<span style="margin-right: 8px;">').text(
          item.declareDate
        );
        let declareTime = $('<span style="margin-right: 8px;">').text(
          item.declareTime
        );
        let temperature = $('<span style="margin-right: 8px;">').text(
          `体温：${item.temperatureDesc}`
        );
        let healthStatus = $("<span>").text(`其他：${item.healthStatus}`);
        if (Number(item.temperature) > 3) {
          temperature.css("color", "red");
        }
        if (item.healthStatus !== "健康") {
          healthStatus.css("color", "red");
        }
        p.append(declareDate)
          .append(declareTime)
          .append(temperature)
          .append(healthStatus);
        $("#health_contain").append(p);
      });
    },
    error: ajaxError
  });
}

window.initPaginationForStationCheckList = function(itemsCount) {
  // console.log("window.stationCheckInfo", window.stationCheckInfo);
  $(".check-pagination-content .pagination").pagination({
    itemsCount: itemsCount,
    currentPage: window.stationCheckInfo.pageNum,
    pageSize: window.stationCheckInfo.pageSize,
    styleClass: ["pagination-large"],
    showCtrl: false,
    displayPage: 6,
    onSelect: function(page) {
      window.stationCheckInfo.pageNum = page;
      fetchStationCheckList();
    }
  });

  checkRenderPageExtra(itemsCount);

  $("#check-pageSizeChange").change(function(e) {
    window.stationCheckInfo.pageSize = parseInt($(e.currentTarget).val());
    window.stationCheckInfo.pageNum = 1;

    fetchStationCheckList();
  });
};

window.checkRenderPageExtra = function(num) {
  $(".check-pagination-content .pagination-extra .label").html(num);
};

// 点击核检记录触发事件
function stationHandleViewModal(name, id) {
  // id 用于查询详情或者
  if (!id) {
    return;
  }

  $("#checkModalLabel").text(`${name} - 核验记录`);
  $("#station-checkModal").modal("show");

  window.stationCheckInfo.stationId = id;

  $(".check-pagination-content .pagination").pagination(
    "updateItemsCount",
    0,
    1
  );

  $(".check-pagination-content .pagination").pagination("updatePages", 1, 1);

  resetCheckFilterTime();
}

/**
 * 重置选项
 */
function resetCheckFilterTime(){
  //重置时间
  $("#check-startDate").val("");
  $("#check-endDate").val("");
  //重置页码入参
  window.stationCheckInfo.pageNum = 1;
  window.stationCheckInfo.pageSize = 20;
  //重置页码、条数ui
  $(".check-pagination-content")
    .find(".sui-dropdown")
    .find("a[value=20]")
    .click();
}

function resetCheckFilterTimeAndFetch() {
  resetCheckFilterTime();
  fetchStationCheckList();
}

// 点击了核验员管理-核验记录弹窗-的重置
function resetEpidemicTime() {
  $("#epidemic-startDate").val("");
  $("#epidemic-endDate").val("");
  epidemicHeYanJiLu("", "", true);
}

/**
 * 获取监测站核验记录
 */
function fetchStationCheckList() {
  showLoading(true);
  $("#check_contain").empty();

  const startTime = $("#check-startDate").val();
  const endTime = $("#check-endDate").val();
  const token = getCookie("access_token");

  $.ajax({
    type: "GET",
    url: httpPrefix + "/api/healthVerification/pageMyHy",
    data: {
      access_token: token,
      pageSize: window.stationCheckInfo.pageSize,
      pageNum: window.stationCheckInfo.pageNum,
      stationId: window.stationCheckInfo.stationId,
      startTime: startTime,
      endTime: endTime
      // reportPersonId: "",
    },
    async: true, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: function(res) {
      if (res.error || !res.data) {
        return;
      }

      const currentDetail = res.data.data || [];
      showLoading(false);
      if (currentDetail.length < 1) {
        $("#check_contain").text("暂无检测站核验记录数据！");
        return;
      }

      const totalCount = res.data.total;
      const pageSize = res.data.size;
      const currentPage = res.data.current;

      checkRenderPageExtra(totalCount);

      $(".check-pagination-content .pagination").pagination(
        "updateItemsCount",
        totalCount,
        currentPage
      );

      const page = parseInt((totalCount - 1) / pageSize) + 1;

      // console.log("page:", page);

      $(".check-pagination-content .pagination").pagination(
        "updatePages",
        page,
        currentPage
      );
      var html = '';
      // 数据回显
      currentDetail.forEach((item) => {
        let nameString = item.name || '-';
        if (item.name) {
          nameString = `<a onclick="verificationModalLinkSearch({
            'searchRegisterName':'${item.name}',
            'nameOfModalToHide':'#station-checkModal'
          })">${item.name}</a>`;
        }
        const trDomStr = `
          <tr>
            <td>${nameString}</td>
            <td>${item.phone || '-'}</td>
            <td class="date-time ">${item.createTime || '-'}</td>
            <td class="short-text ${
              item.temperature === "发烧" ? "red" : ""
            } ">${item.temperature || '-'}</td>
            <td class="short-text ${item.cough === "咳嗽" ? "red" : ""} ">${
          item.cough || '-'
        }</td>
            <td class="${
              item.identityConsistency !== "身份信息一致" ? "red" : ""
            }">${item.identityConsistency || '-'}</td>
            <td class="${
              item.reportType === "异常情况隔离上报" ? "red" : ""
            }">${item.reportType || '-'}</td>
            <td>核验人：${item.reportPersonName || "-"} </td>
          </tr>        
        `;
        html += trDomStr;
      });
      $('#check_contain').html(html);
    },
    error: ajaxError
  });
}

function handleViewDetail(type, id, updateCount) {
  // id 用于查询详情或者
  $("#submit-form").attr("data-type", type);
  $("#submit-form").attr("data-id", id);
  initDepartOptionData();
  switch (type) {
    case "create":
      // 修改弹出框的显示文案
      $("#myModalLabel").html("新建登记");
      break;
    case "edit":
      // 修改弹出框的显示文案
      $("#myModalLabel").html("编辑信息");
      deletesRecord = [];
      handleGetDetail(type, id);
      break;
    case "detail":
      $("#myModalLabel").html("详细信息");
      $(".btn-add-peer").addClass("btn-add-peer-no");
      handleGetDetail(type, id);
      $("#myModalFooter").css('text-align', 'right');
      $("#myModalFooter").html(
        `<div><input name="updateNum" onkeyup="this.value=this.value.replace(/[^01]/g,\'\');" maxlength="1" class="updateCount-input" placeholder="剩余修改次数" /><button type="button" id="btn-cancel" onClick="submitUpdateCount('${id}')" class="sui-btn btn-primary btn-large">提交</button></div>`
      );
      $('input[name="updateNum"]').val(updateCount);
      break;
    default:
      break;
  }
  $("#myModal-create").modal("show");
}

// 提交修改次数添加需求   魏晨   8994
function submitUpdateCount(id){
  var token = getCookie("access_token");
  var updateNum = $('input[name="updateNum"]').val();
  if(!(/^[01]{1}$/.test(updateNum))){
    message("error", "剩余修改次数只能填写0或1");
    return false;
  }
  $.ajax({
    type: "POST",
    url: httpPrefix + "/api/companionRecord/changeUpdateCount?access_token="+token,
    data: {
        'recordId': id,
        'updateCount': updateNum
    },
    async: true,
    cache: false,
    contentType: "application/x-www-form-urlencoded",
    withCredentials: true,
    success: function(res) {
      if (!res.error) {
        message("success", "修改成功");
        $("#myModal-create").modal("hide");
      }
    },
    error: ajaxError,
  });
}

function verificationViewHealthDetail(name, id) {
  $("#verificationModalLabel").text(`${name} - 核验记录`);
  $("#verificationModal-create").modal("show");
  $("#verification_contain .verificationList").html(
    '<div style="text-align:center;margin-top: 30px;">加载中...</div>'
  );
  $.ajax({
    type: "get",
    url:
      httpPrefix +
      "/api/healthVerification/listByRecoedId?access_token=" +
      token,
    data: {
      recordId: id,
      size: 9999
    },
    //timeout: 300,
    async: true, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: function(res) {
      var data = res.data.data || [];
      var html = '';
      if (data.length === 0) {
        html +=
          '<div style="text-align:center;margin-top: 30px;">暂无数据</div>';
      } else {
        data.map(item => {
          var result;
          if (item.temperature === "0" || item.cough === "0") {
            result = "<div style='color:red;'>";
            result += item.temperature === "1" ? "" : "发烧";
            result += item.cough === "1" ? "" : "咳嗽";
            result += item.comment === "" ? "" : "<br />" + item.comment;
            result += "</div>";
          } else {
            result = "<div>通过<br />" + item.comment + "</div>";
          }

          var d = new Date(item.createTime);
          html += `<div class="verificationModal-body modal-body-flex">
                      <div>${d.getFullYear() +
                        "-" +
                        (d.getMonth() + 1) +
                        "-" +
                        d.getDate() +
                        " " +
                        d.getHours() +
                        ":" +
                        d.getMinutes() +
                        ":"}${
            d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds()
          }</div>
                      <div ${`${item.reportType}` === '9' ?"style='coloe:red'" : ''}>${window.REPORT_TYPE[item.reportType]}</div>
                      <div>${item.reportPersonName}</div>
                     ${result}
                      <div>${item.area === null ? "-" : item.area}</div>
                    </div>`;
        });
      }
      $("#verification_contain .verificationList").html(html);
    }
  });
}

/**
 * 显隐本地人员和来访人员对应表单
 *
 * @param {string} type - 人员类型， 0为本地人员，1为来访人员
 */
function toggleForm(type) {
  if (type === 1) {
    $("#myModal-create #objectiveLabel").text(
      `在${window.config.city_one_word}目的`
    );

    $("#myModal-create #travelTypeContainer").hide();
    $("#myModal-create #localTravelTypeContainer").show();
    $("#myModal-create #destDatediv").hide();
    $("#myModal-create #departAddress").hide();
  } else {
    $("#myModal-create #objectiveLabel").text(
      `来${window.config.city_one_word}目的`
    );

    $("#myModal-create #travelTypeContainer").show();
    $("#myModal-create #localTravelTypeContainer").hide();
    $("#myModal-create #destDatediv").show();
    $("#myModal-create #departAddress").show();
  }
}

// 出发地回填方法
function fillDepart(data){
  let countryTypeDom = $('#userForm [name=departCountryType]');
  let countryDom = $('#userForm [name=departCountry]');
  let pcaDom = $('#userForm [name=departProv]');
  if(window.config.depart_country_type && window.config.depart_country){
    if(data.departCountryType){
      $(countryTypeDom).val(data.departCountryType);
      if (data.departCountryType === '0') {
        $(countryDom).parent().hide();
      } else if (data.departCountryType === '1') {
        $(pcaDom).parent().hide();
        $(countryDom).val(data.departCountry);
      } 
    } else {
      // 兼容旧数据的回填，和提交修改时的校验
      $(countryTypeDom).val('0');
      $(countryDom).parent().hide();
    }
  } else {
    $(countryTypeDom).parent().parent().hide();
    $(countryDom).parent().hide();
  }
}

// 初始化出发地下拉
function initDepartOptionData() {
  if (window.config.depart_country_type && window.config.depart_country) {
    let obj = JSON.parse(window.config.depart_country_type);
    let option = Object.keys(obj).map(function (_key) {
      return `<option value="${_key}">${obj[_key]}</option>`
    }).join('');
    let firstOption = `<option value="" selected style="display:none">请选择出发地类型</option>`;
    $('[name=departCountryType]').html(firstOption + option);

    let obj222 = JSON.parse(window.config.depart_country);
    let option222 = Object.keys(obj222).map(function (_key) {
      return `<option value="${obj222[_key]}">${obj222[_key]}</option>`
    }).join('');
    let firstOption222 = `<option value="" selected style="display:none">请选择国家</option>`;
    $('[name=departCountry]').html(firstOption222 + option222);
  }
}

// 获取详细信息
function handleGetDetail(type, id) {
  var token = getCookie("access_token");
  showLoading(true);
  $.ajax({
    type: "GET",
    url: httpPrefix + "/api/companionRecord/list?access_token=" + token,
    data: { recordId: id },
    //timeout: 300,
    async: true, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: function(res) {
      var data = res.data || {};

      // console.log("currentDetail: ", currentDetail);

      showLoading(false);
      // 数据回显 编辑 和 详情
      dataDisplay(data.data);
      if (type === "detail") {
        $("#myModal-create")
          .find("input")
          .each((_index, _dom) => {
            $(_dom).addClass("use-disabled");
          });
        $("#myModal-create")
          .find("select")
          .each((_index, _dom) => {
            $(_dom).addClass("use-disabled");
          });
        $("#myModal-create")
          .find(".item-content-title-right")
          .each((_index, _dom) => {
            $(_dom).addClass("use-disabled");
          });
        // 【徐州】修改次数添加需求   魏晨   8994
        $("#myModal-create").find('input[name="updateNum"]').removeClass("use-disabled");

      }
    },
    error: ajaxError
  });
}

function dataDisplay(data1) {
  if (data1.length > 0) echoForm($("#userForm"), data1[0]);
}

// 表单回显
function echoForm(element, data) {
  toggleForm(data.personnelType);
  window.toggleNationAndLocale(data.idCardType);

  let userFormInput = $(element).find('input[type="text"]');
  let userFormInputRadio = $(element).find('input[type="radio"]');
  let userFormSelect = $(element).find("select");
  userFormInput.each((_index, _dom) => {
    if ($(_dom).attr("name") === "uName") {
      _dom.value = data["name"];
    } else if ($(_dom).attr("name") === "userPhone") {
      _dom.value = data["phone"];
    } else if ($(_dom).attr("name") === "destDate") {
      var destDate = data.destDate;
      if (destDate) {
        $("#userForm #destDate").val(destDate.split(" ")[0]);
        $("#userForm #destDate").datepicker("update");
        // $('#userForm #destDate').datepicker('update', destDate.substring(0, destDate.indexOf(' ')))
      }
    } else {
      _dom.value = data[$(_dom).attr("name")]
        ? data[$(_dom).attr("name")]
        : "无数据";
    }
  });

  userFormInputRadio.each((_index, _dom) => {
    if ($(_dom).attr("value") === data[$(_dom).attr("name")] + "") {
      $(_dom).attr("checked", "checked");
    }
  });

  userFormSelect.each((_index, _dom) => {
    let name = $(_dom).attr('name');
    _dom.value = (data[name] || data[name] === 0) ? `${data[name]}` : '';
    if (
      name === "departProv" ||
      name === "destProv" ||
      name === "domicileProv"
    ) {
      // 需要联动
      window.p_change(_dom);
    } else if (
      name === "departCity" ||
      name === "destCity" ||
      name === "domicileCity"
    ) {
      // 需要联动
      window.c_change(_dom);
    } else if (_dom.value) {
      if ($(_dom).find(`option[value="${data[name]}"]`).length === 0) {
        $(_dom).append(
          "<option value='' disabled selected style='display:none;'>数据不匹配</option>"
        );
      }
    } else if(!['departCountryType', 'departCountry'].includes(name)){
      $(_dom).append(
        "<option value='' disabled selected style='display:none;'>无数据</option>"
      );
    }
  });

  fillDepart(data);
}

function getTimestr(val) {
  let temp = val.toLocaleString();
  if (temp.match(/[\u4e00-\u9fa5]/g)[0] == "上") {
    temp = temp.replace(/[\u4e00-\u9fa5]/g, "");
    return temp.slice(-8, -7) == " "
      ? `${temp.slice(0, -7)}0${temp.slice(-7)}`
      : temp;
  } else {
    temp = temp.replace(/[\u4e00-\u9fa5]/g, "");
    const templist = temp.split(" ");
    let temptime = templist[1].split(":");
    temptime[0] = parseInt(temptime[0]) + 12;
    temptime = temptime.join(":");
    return `${templist[0]} ${temptime}`;
  }
}

// 导航标签切换
function onTabNavClick(tab) {
  // 导航切换
  $("#tabNav")
    .find(".active")
    .removeClass("active");
  $(tab)
    .parent()
    .addClass("active");
  // 内容切换
  var contentId = $(tab).attr("href");
  $("#tabContent")
    .find(".active")
    .removeClass("active");
  $(contentId).addClass("active");
  refreshWatermark();
}

// 切换页签、列表重新渲染，重渲水印
function refreshWatermark(){
  if(userInfo&&userInfo.watermarkConfig){
    watermark.load(userInfo.watermarkConfig);
  }
}

function verificationOfficerInit(){

}

function epidemicSearchEventBind() {
  $("#epidemic-resetBtn")
    .off()
    .on('click', function() {
      $('.epidemic-search .detail-filter input').val('');
      if(!$('#epidemic-suborCity').attr('disabled')){
        $('#epidemic-suborCity').val('');
      }
        $('#epidemic-userType option:first').prop("selected", 'selected');
        $('#epidemic-suborDistrict option:first').prop("selected", 'selected');
        $('#epidemic-suborStreet option:first').prop("selected", 'selected');
      /*$('#epidemic-suborDistrict').html("<option style='display:none;' value=''>请选择区（县)</option>");
      $('#epidemic-suborStreet').html("<option style='display:none;' value=''>请选择乡镇（街道）</option>");*/
      epidemicQueryData();
    });
  $("#epidemic-searchBtn")
    .off()
    .on("click", function() {
      epidemicCurrentPage = 1;
      epidemicQueryData();
    });
}

// 列表请求
function epidemicQueryData() {
  var token = getCookie("access_token");
  // 查询项值
  var params = {
    current: epidemicCurrentPage,
    size: epidemicPageSize,
    suborCity:$('#epidemic-suborCity').val(),
    suborDistrict:$('#epidemic-suborDistrict').val(),
    suborStreet:$('#epidemic-suborStreet').val(),
    realName: $('#epidemic-name').val(),
    companyName: $('#epidemic-workplace').val(),
    phone: $('#epidemic-phone').val(),
    userType: $('#epidemic-userType').val(),
    access_token: token,
    startTime: $('.startTime').val(),
    endTime: $('.endTime').val(),
    idCardNo: $('#idCardNo').val(),
  };
  showLoading(true);
  $.ajax({
    type: "GET",
    url: httpPrefix + "/api/cuser/listUser",
    data: params,
    contentType: 'application/json',
    cache: false, //浏览器是否应该被允许缓存GET响应。
    success: function(res) {
      var data = res.data || {};
      var totalCount = data.total || 0;
      epidemicCurrentTableData = data.data; // 当前页的数据
      showLoading(false);
      $(".epidemic-pagination-content .pagination").pagination(
        "updateItemsCount",
        totalCount,
        epidemicCurrentPage
      );
      $(".epidemic-pagination-content .pagination").pagination(
        "updatePages",
        parseInt((totalCount - 1) / epidemicPageSize) + 1,
        epidemicCurrentPage
      );
      epidemicRenderPageExtra(totalCount);
      showLoading(false);
      epidemicChangeList(data.data);
    },
    error: function(err) {
      showLoading(false);
      if (err.statusCode == 401) {
        toLogin();
      } else {
        message("error", "网络异常，请重试");
        epidemicChangeList([]);
      }
    }
  });
}

function epidemicInitPagination(itemsCount) {
  $(".epidemic-pagination-content .pagination").pagination({
    itemsCount: itemsCount,
    currentPage: epidemicCurrentPage,
    pageSize: epidemicPageSize,
    styleClass: ["pagination-large"],
    showCtrl: true,
    displayPage: 6,
    onSelect: epidemicHandlePageChange
  });
  epidemicRenderPageExtra(itemsCount);
  $("#epidemic-pageSizeChange").change(function(e) {
    epidemicPageSize = $(e.currentTarget).val();
    epidemicCurrentPage = 1;
    epidemicQueryData();
  });
}

// 分页器
function epidemicHandlePageChange(page) {
  epidemicCurrentPage = page;
  epidemicQueryData();
}

function epidemicRenderPageExtra(num) {
  $(".epidemic-pagination-content .pagination-extra .label").html(num);
}

// 列表渲染
function epidemicChangeList(data) {
  const userTypeObj = JSON.parse(window.oConfig.userType)
  var auth = {
    '核验记录': false,
    '编辑': false,
    '状态': false,
    '删除': false
  };
  window.btnAuth['检测人员'] && window.btnAuth['检测人员'].forEach(item=>{
    auth[`${item}`] = true;
  })
  var content = "";
  if (!data || !data.length) {
    content = '<div style="text-align: center;">暂无数据</div>';
  } else {
    data.map(item=>{
      let userTypeName = '';
      userTypeObj.forEach(val=>{
        if(val.key === item.userType){
          userTypeName = val.name;
        }
      })
      let forbidShowWord = item.forbidstatus === 0 ? "禁用" : "解禁";
      let optionBtn = '';
      auth['核验记录'] && (optionBtn += `<a href="javascript:void(0);" class="sui-btn btn-link table-option" onclick="epidemicHeYanJiLu('${item.realName}', '${item.id || ""}')">核验记录</a>`);
      auth['编辑'] && (optionBtn += `<a href="javascript:void(0);" class="sui-btn btn-link table-option" onclick="epidemicHandleViewModal('edit', '${item.id}')">编辑</a>`);
      auth['状态'] && (optionBtn += `<a href="javascript:void(0);" data-phone=${item.phone} data-curForbidStatus=${item.forbidstatus} data-placement="top" data-trigger="click" data-type="confirm" data-toggle="tooltip" data-title="是否确定${forbidShowWord}本条核验记录" class="sui-btn btn-link table-option epidemic-btn-forbit" >${forbidShowWord}</a>`);
      auth['删除'] && (optionBtn +=`<a href="javascript:void(0);" data-phone=${item.phone} data-placement="top" data-trigger="click" data-type="confirm" data-toggle="tooltip" data-title="是否确定删除本条核验记录" class="sui-btn btn-link table-option epidemic-btn-delete" >删除</a>`);
      
      content += `
      <tr>
        <td class="td-id"><div class="tp" data-placement="top" data-toggle="tooltip" title="${item.id}">${item.id || "-"}</div></td>
        <td style="width:10%;">${item.realName || "-"}</td>
        <td>${item.forbidstatusName || "-"}</td>
        <td>${userTypeName || "-"}</td>
        <td style="width:10%;word-break:break-all;">${item.identityCard || '-'}</td>
        <td style="width:10%;word-break:break-all;">${item.phone || '-'}</td>
        <td>${item.companyName || '-'}</td>
        <td>${item.job || '-'}</td>
        <td><a href="javascript:void(0);" class="sui-btn btn-link table-option" onClick="lookCheckStationNameList(${item.id})">查看</a></td>
        <td style="width:10%;word-break:break-all;">${(item.createDate &&
          item.createDate.replace("T", " ")) ||
          "-"}</td>
        <td>${item.dayNum}</td>
        <td>${item.totalNum}</td>
        <td class="tbody-option">
          <div class="tbody-option-content">
            ${optionBtn || '-'}
            </div>
          </div>
        </td>
      </tr>
    `
    })
  }
  $(".epidemic-tbody-list").html(content);
  $(".epidemic-btn-delete").tooltip({
    okHide: function() {
      epidemicDelete(this);
    }
  });
  $(".epidemic-btn-forbit").tooltip({
    okHide: function() {
      forbitEpidemic(this);
    }
  });
  $(".epidemic-tbody-list .td-id div").tooltip();

  refreshWatermark();
}
// 监测人员 监测站列表
function lookCheckStationNameList(id){
  $.ajax({
    type: 'POST',
    url: '/api/cuser/listStation',
    data: JSON.stringify({ userId: id }),
    //timeout: 300,
    async: true, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: 'application/json',
    withCredentials: true,
    success: function(res) {
      var html = '';
      if(!res.error){
        res.data.map(item=>{
          html += "<div style='text-align: center;font-size:18px;line-height:30px'>"+item+"</div>";
        })
      }else{
        html = "<div style='text-align: center;font-size:18px'>暂无数据</div>"
      }
      $.alert({
        title:'检测站列表',
        body: html,
        width: "small",
        backdrop: true,
        bgcolor: "none",
      });
    },
    error: function(err) {
      
    }
  });
}

function epidemicDelete(_dom) {
  var phone = $(_dom).attr("data-phone");
  _dom.tooltip("hide");

  showLoading(true);
  $.ajax({
    type: "POST",
    url: "/api/cuser/delete",
    data: JSON.stringify({ phone: phone }),
    //timeout: 300,
    async: true, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: function(bool) {
      if (bool) {
        epidemicQueryData();
        message("success", "删除成功");
      }
    },
    error: ajaxError
  });
}

function forbitEpidemic(_dom) {
  _dom.tooltip("hide");
  var phone = $(_dom).attr("data-phone");
  // 当前禁用状态（0:可用 1：禁用）
  var curForbidStatus = $(_dom).attr("data-curForbidStatus");
  let forbidstatus = "";
  let successTip = "";
  if (curForbidStatus === "1") {
    forbidstatus = 0;
    successTip = "解禁成功";
  } else if (curForbidStatus === "0") {
    forbidstatus = 1;
    successTip = "禁用成功";
  } else {
    return false;
  }
  showLoading(true);
  $.ajax({
    type: "POST",
    url: "/api/cuser/forbid",
    data: JSON.stringify({
      phone: phone,
      forbidstatus: forbidstatus // 要改变禁用状态为（0:可用 1：禁用）
    }),
    //timeout: 300,
    async: true, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: function(bool) {
      if (bool) {
        epidemicQueryData();
        message("success", successTip);
      }
    },
    error: ajaxError
  });
}

// 初始化核验员管理-编辑-表单
function epidemicInitModal(configData) {
  // 数据初始化
  if (configData) {
    let userTypeList = configData.userType
      ? JSON.parse(configData.userType)
      : [];

    let firstOption = `<option value='' disabled selected style='display:none;'>请选择</option>`;
    // 人员类型下拉
    let userTypeOptionList = userTypeList.map(function(item) {
      return `<option value=${item.key}>${item.name}</option>`;
    });
    $("#userType").html(firstOption.concat(userTypeOptionList));
    $("#epidemic-userType").html(firstOption.concat(userTypeOptionList));
    // 检测站类型下拉
    let checkStationTypeList = JSON.parse(configData.stationType);
    let checkStationTypeOptionList = checkStationTypeList.map(function(item) {
      return `<option value=${item.key}>${item.name}</option>`;
    });
    $("#station-stationType").html(firstOption.concat(checkStationTypeOptionList));
  }

  let dom = $("#epidemic-modal-temp-form"); // 获取modal模版
  $("#epidemic-form").html(dom.html());
  $("#userType").val("");
  $("#checkStationType").val("");
  $("#epidemic-modal-station-info").html(""); // 清空检测站数据
}

// 隐藏弹出框
function epidemicHideModal() {
  // 隐藏弹框清空 基本信息 和 同乘人员信息
  epidemicInitModal();
  $("#epidemic-modal").modal("hide");
}

function epidemicHandleViewModal(type, id) {
  $("#epidemic-btn-submit").attr("data-type", type);
  $("#epidemic-btn-submit").attr("data-id", id);
  $("#epidemic-modal-footer").show();
  switch (type) {
    case "create":
      break;
    case "edit":
      let currentFormData = epidemicCurrentTableData.find(function(item) {
        return `${item.id}` === `${id}`;
      });
      if (!currentFormData) return message("error", "数据异常，无法编辑");
      fillFormField("#epidemic-form", currentFormData);
      
      // console.log('currentFormData',currentFormData)
      // 回填检测站信息
      fillEpidemicModalStation(currentFormData.stationlist);

      $("#epidemic-modal-label").html("编辑核验员基本信息");
      $("#epidemic-btn-submit")
        .off()
        .on("click", function(e) {
          epidemicHandleOk();
        });
      $("#epidemic-btn-cancel")
        .off()
        .on("click", function(e) {
          epidemicHideModal();
        });
      $("#epidemic-btn-close-x")
        .off()
        .on("click", function(e) {
          epidemicHideModal();
        });
      if (`${id}` === "null") {
        $("#epidemic-modal-footer").hide();
        $("#epidemic-modal-label").html("数据异常，无法编辑");
      }
      break;
    case "detail":
      break;
    default:
      break;
  }
  $("#epidemic-modal").modal("show");
}

// 核验员管理-编辑-市、区、街道改变
function epidemicModalCDSChange(event){
  let stationRowDom = $(event.target).parent();
  let suborCity = $(stationRowDom).find("[name='epidemic-modal-suborCity']").val();
  let suborDistrict= $(stationRowDom).find("[name='epidemic-modal-suborDistrict']").val();
  let suborStreet= $(stationRowDom).find("[name='epidemic-modal-suborStreet']").val();
  getStaionListByCDS({
    suborCity,
    suborDistrict,
    suborStreet,
    stationRowDom,
  })
}

// 核验员管理-编辑-通过 市、区、街道获取检测站信息
function getStaionListByCDS({ suborCity, suborDistrict, suborStreet, stationRowDom, stationId }) {
  if(!stationRowDom) return;

  // 检测站名 - 检测站类型联动
  function _onStationChange(){
    $("[name='epidemic-modal-stationId']").off().on('change',function(event){
      let _dom = event.target;
      let value = event.target.value;
      let stationType = $(_dom).find(`option[value=${value}]`).attr('data-stationType');
      $(_dom).siblings("[name='epidemic-modal-stationType']").val(stationType);
    })
  }
  $.ajax({
    url: "/api/station/list1",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(
      {
        suborCity,
        suborDistrict,
        suborStreet,
      },
    ),
    success: function (res) {
      if (res.error) {
        $.toast(error);
        return false;
      } else {
        let optionList = res.data.map(function(
          item
        ) {
          let stationType = (item.stationType || item.stationType === 0) ? item.stationType: '';
          return `<option value=${item.id} data-stationType=${stationType}>${item.stationName}</option>`;
        });
        let _firstOption = `<option value="" disabled selected style="display:none;">请选择检测站</option>`;
        let allOption = _firstOption.concat(optionList);

        // 当前查询条件下的“检测站“下拉数据渲染
        $(stationRowDom).find("[name='epidemic-modal-stationId']").html(allOption);

        if(stationId){
          // 当前检测站值回填
          $(stationRowDom).find("[name='epidemic-modal-stationId']").val(stationId);
  
          // 当前检测站类型回填
          let stationType = (res.data.find(function(item){
            return item.id === stationId
          }) || {}).stationType;
          $(stationRowDom).find("[name='epidemic-modal-stationType']").val(stationType);
        }

        // 事件绑定
        _onStationChange();
      }
    }
  });
}

function fillEpidemicModalStation(stationlist){
  // 其他行的label内容清空
  function _labelFirstRow(){
    $("#epidemic-form #epidemic-modal-station-info").find(".label").each(function(_index,_dom){
      if(_index === 0){
        $(_dom).text("检测站名称");
      } else {
        $(_dom).text("");
      }
    })
  }

  // 禁用第一行的删除，删除事件绑定
  function _bindDeleteEvent(){
    $("#epidemic-modal-body #epidemic-form #epidemic-modal-station-info").find(".item-inner").each(
      function (_index, _dom) {
        if(_index === 0){
          $(_dom).find('.epidemic-modal-staion-delete').attr('disabled', true)
          $(_dom).find('.epidemic-modal-staion-delete').css('visibility', 'hidden');
        }
      }
    )
    $('.epidemic-modal-staion-delete').off().on('click',function(event){
      let _dom = $(event.target);
      _dom.parent().parent().remove();
      _labelFirstRow();
    });
  }

  // 对模版的“检测站类型”下拉进行数据初始化
  function _renderStationTypeOption(){
    if (
      window.configStationTypeList &&
      window.configStationTypeList.length > 0
    ) {
      let checkStationTypeOptionList = configStationTypeList.map(function(
        item
      ) {
        return `<option value=${item.key}>${item.name}</option>`;
      });
      let _firstOption = `<option value="" style="display:none;">--无检测站类型--</option>`;
      let allOption = _firstOption.concat(checkStationTypeOptionList);
      $(".epidemic-modal-staion-template").find("[name='epidemic-modal-stationType']").html(allOption);
    }
  }

  function _initProvince(_domEle){
    let defaultProvince = window.oConfig['fk.register.area.province'];
    let province = $(_domEle).find("[name='epidemic-modal-provinces']");
    province.val(defaultProvince);
    p_change(province, '请选择城市', '请选择区（县）','请选择乡镇（街道）')
  }

  function _fillData(){
    $("#epidemic-modal-body #epidemic-form #epidemic-modal-station-info").find(".item-inner").each(function(_index, _domEle){
      // 数据回填
      let currentObj = stationlist[_index];
      // console.log(_index,'suborCity',currentObj.suborCity)
      // console.log(_index,'suborDistrict',currentObj.suborDistrict)
      // console.log(_index,'suborStreet',currentObj.suborStreet)
      // console.log(_index,'id',currentObj.id)
      // console.log(_index,'stationName',currentObj.stationName)
      _initProvince(_domEle);

      let city = $(_domEle).find("[name='epidemic-modal-suborCity']")
      if(currentObj.suborCity){
        city.val(currentObj.suborCity);
        c_change(city, '请选择区（县）','请选择乡镇（街道）')
      }
      
      let district = $(_domEle).find("[name='epidemic-modal-suborDistrict']");
      if(currentObj.suborDistrict){
        district.val(currentObj.suborDistrict);
        a_change(district,'请选择乡镇（街道）')
      }

      $(_domEle).find("[name='epidemic-modal-suborStreet']").val(currentObj.suborStreet);
      getStaionListByCDS({
        suborCity: currentObj.suborCity || '',
        suborDistrict: currentObj.suborDistrict || '',
        suborStreet: currentObj.suborStreet || '',
        stationRowDom: _domEle,
        stationId: currentObj.id,
      })
    })
  }

  _renderStationTypeOption();
  let dom = $(".epidemic-modal-staion-template").html();
  if(stationlist && stationlist.length > 0){
    let length = stationlist.length;
    // 生成行
    for (let i = 0; i < length; i++) {
      if (i === 0){
        $("#epidemic-modal-body #epidemic-form #epidemic-modal-station-info").html(dom);
      } else {
        $("#epidemic-modal-body #epidemic-form #epidemic-modal-station-info").append(dom);
      }
    }
    _fillData();
  } else {
    $("#epidemic-modal-body #epidemic-form #epidemic-modal-station-info").html(dom);
    let newDom = $("#epidemic-modal-body #epidemic-form #epidemic-modal-station-info").find(".item-inner").last();
    _initProvince(newDom);
  }
  _labelFirstRow();
  _bindDeleteEvent();

  // 新增事件绑定
  $('#epidemic-modal-body #epidemic-form #epidemic-modal-station-info-add').off().on('click',function(){
    let _dom = $(".epidemic-modal-staion-template").html();
    $("#epidemic-modal-body #epidemic-form #epidemic-modal-station-info").append(_dom);
    _labelFirstRow();
    _bindDeleteEvent();

    // 初始化新增的数据
    let newDom = $("#epidemic-modal-body #epidemic-form #epidemic-modal-station-info").find(".item-inner").last();
    _initProvince(newDom);
    getStaionListByCDS({
      suborCity: '',
      suborDistrict: '',
      suborStreet: '',
      stationRowDom: newDom,
      stationId: '',
    })
  })
}

function getEpidemicModalStationValueList(){
  let arr = [];
  $("#epidemic-modal-body #epidemic-form #epidemic-modal-station-info").find(".item-inner").each(function(_index,_dom){
    let stationId = $(_dom).find("[name='epidemic-modal-stationId']").val();
    if(stationId && !arr.includes(stationId)){
      arr.push(stationId);
    }
  })
  return arr;
}

function epidemicCheck(data) {
  try {
    checkEmpty(data.userType, '请选择人员类型');
    checkName(data.realName, '姓名格式有误');
    checkPhone(data.phone, '手机号格式有误');
    checkCode(data.identityCard, '身份证格式有误');
    checkEmpty(data.companyName, '请填写工作单位');
    checkEmpty(data.job, '请填写工作职务');
    let stations = data.stations.join(',');
    checkEmpty(stations, '请选择检测站');
  } catch (error) {
    message("error", error);
    return false;
  }
  return true;
}

function epidemicHandleOk() {
  let data = qs.parse($("#epidemic-form").serialize());
  delete data['epidemic-modal-provinces'];
  delete data['epidemic-modal-suborCity'];
  delete data['epidemic-modal-suborDistrict'];
  delete data['epidemic-modal-suborStreet'];
  delete data['epidemic-modal-stationId'];
  delete data['epidemic-modal-stationType'];
  data.stations = getEpidemicModalStationValueList();
  if (!epidemicCheck(data, false)) {
    return;
  }
  showLoading(true);
  $.ajax({
    type: "POST",
    url: "/api/cuser/editFayi",
    data: JSON.stringify(data),
    //timeout: 300,
    async: true, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: function(res) {
      showLoading(false);
      if (res) {
        epidemicHideModal();
        epidemicQueryData();
      } else {
        message("error", "修改失败,请重试!");
      }
    },
    error: ajaxError
  });
}

// epidemicHeYanJiLu('', '28'); // test

// 核验员管理 - 核验记录
function epidemicHeYanJiLu(name, id, modalIsShown) {
  if (name) {
    $("#epidemic-verificationModal-label").text(
      `【${name ? name : "-"}】核验记录`
    );
  }
  let currentId = "";
  if (id) {
    $("#epidemic-verificationModal").attr("data-id", id);
    currentId = id;
  } else {
    currentId = $("#epidemic-verificationModal").attr("data-id");
  }
  if (!currentId) return message("error", "此记录参数缺失，无法查询");
  showLoading(true);
  if (!modalIsShown) {
    heYanJiLuPage.pageNum = 1;
    heYanJiLuPage.pageSize = 20;
  }
  const startTime = $("#epidemic-startDate").val();
  const endTime = $("#epidemic-endDate").val();
  $.ajax({
    type: "Get",
    url: "/api/healthVerification/pageMyHy",
    data: {
      reportPersonId: currentId,
      pageNum: heYanJiLuPage.pageNum,
      pageSize: heYanJiLuPage.pageSize,
      startTime: startTime,
      endTime: endTime
    },
    async: true, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: function(res) {
      showLoading(false);
      if (res.error) return message("error", "查询失败");
      if (res.data) {
        $("#epidemic-verificationModal-list").empty();
        let currentDetail = res.data.data;
        let totalCount = res.data.total || 0;
        if (currentDetail.length < 1) {
          $("#epidemic-verificationModal-list").html(
            "<div>暂无核验记录！</div>"
          );
          // return;
        } else {
          $("#epidemic-verificationModal-list").html(
            renderEpidemicHeYanJiLuList(currentDetail)
          );
        }
        epidemicHeYanJiLuUpdatePage(
          heYanJiLuPage.pageNum,
          heYanJiLuPage.pageSize,
          totalCount
        );
        showLoading(false);
        if (!modalIsShown) {
          $("#epidemic-verificationModal").modal("show");
        }
      }
    },
    error: ajaxError
  });
}

function renderEpidemicHeYanJiLuList(data) {
  let domString = data
    .map(function(item) {
      let color = "";
      if (`${item.flagRed}` === "1") {
        color = "color:red";
      }
      let nameString = `<span style="margin-right: 8px;width: 60px">${item.name ||
        "-"}</span>`;

      if (item.name) {
        nameString = `<a 
        style="margin-right: 8px;width: 60px" 
        onclick="verificationModalLinkSearch({
          'searchRegisterName':'${item.name}',
          'nameOfModalToHide':'#epidemic-verificationModal'
        })">${item.name || "-"}</a>`;
      }

      return (
        `<p style="display: flex;justify-content: space-around;text-align: left;${color}">` +
        `${nameString}` +
        `<span style="margin-right: 8px;width: 100px">${item.phone ||
          "-"}</span>` +
        `<span style="margin-right: 8px;width: 160px">${(
          item.createTime || ""
        ).replace("T", " ") || "-"}</span>` +
        `<span style="margin-right: 8px;width: 50px">${item.temperature ||
          "-"}</span>` +
        `<span style="margin-right: 8px;width: 50px">${item.cough ||
          "-"}</span>` +
        `<span style="margin-right: 8px;width: 100px">${item.identityConsistency ||
          "-"}</span>` +
        `<span style="width: 120px">${item.reportType || "-"}</span>` +
        // `<span style="width: 120px">${item.stationName || "-"}</span>` +
        `</p>`
      );
    })
    .join("");
  return domString;
}

function initEpidemicHeYanJiLuModal() {
  let total = 0;
  // 事件绑定
  $("#epidemic-verificationModal-btn-close-x")
    .off()
    .on("click", function(e) {
      epidemicHeYanJiLuModalHide();
    });
  // 分页器初始化
  $("#epidemic-verificationModal-pagination .pagination").pagination({
    itemsCount: total,
    currentPage: heYanJiLuPage.pageNum,
    pageSize: heYanJiLuPage.pageSize,
    styleClass: ["pagination-large"],
    displayPage: 3,
    onSelect: function(page) {
      heYanJiLuPage.pageNum = page;
      epidemicHeYanJiLu("", "", true);
    }
  });
  $("#epidemic-verificationModal-pagination .pagination-extra .label").html(
    total
  );
  $("#epidemic-verificationModal-pageSizeChange").change(function(e) {
    heYanJiLuPage.pageSize = $(e.currentTarget).val();
    heYanJiLuPage.pageNum = 1;
    epidemicHeYanJiLu("", "", true);
  });
}

function epidemicHeYanJiLuModalHide() {
  //重置时间
  $("#epidemic-startDate").val("");
  $("#epidemic-endDate").val("");
  //重置页码入参
  heYanJiLuPage.pageNum = 1;
  heYanJiLuPage.pageSize = 20;
  //重置页码、条数ui
  $("#epidemic-verificationModal-pagination")
    .find(".sui-dropdown")
    .find("a[value=20]")
    .click();
  $("#epidemic-verificationModal").modal("hide");
}

function epidemicHeYanJiLuUpdatePage(current, size, total) {
  $("#epidemic-verificationModal-pagination .pagination").pagination(
    "updateItemsCount",
    total,
    current
  );
  $("#epidemic-verificationModal-pagination .pagination").pagination(
    "updatePages",
    parseInt((total - 1) / size) + 1,
    current
  );
  $("#epidemic-verificationModal-pagination .pagination-extra .label").html(
    total
  );
}

// 检测站tab页
(function() {
  var stationCurrentPage = 1;
  var stationPageSize = 20;
  var stationCurrentTableData = null; // 检测站表格当前的数据
  var edittingStationId = "";
  function hideStatonModal() {
    // 隐藏弹框清空 信息
    stationInitStationType();
    $("#station-form input").val("");
    p_change_station(
      $('select[name="suborProv"]')
        .val(window.config.pca_province)
        .get(0),
      "请选择城市",
      "请选择区（县）",
      "请选择乡镇（街道）"
    );
    c_change_station(
      $('select[name="suborCity"]')
        .val(window.config.pca_city)
        .get(0),
      "请选择区（县）",
      "请选择乡镇（街道）"
    );
    $("#station-create-modal").modal("hide");
  }

  window.stationSearchEventBind = function() {
    $("#station-resetBtn")
      .off()
      .on("click", function() {
        $(".station-search .detail-filter input").val("");
        $("#station-stationType").val("");
        p_change(
          $(".station-search .detail-filter select.provinces")
            .val(window.config.pca_province)
            .get(0),
          "请选择城市",
          "请选择区（县）",
          "请选择乡镇（街道）"
        );
        c_change(
          $(".station-search .detail-filter select.city")
            .val(window.config.pca_city)
            .get(0),
          "请选择区（县）",
          "请选择乡镇（街道）"
        );
        stationQueryData();
      });
    $("#station-searchBtn")
      .off()
      .on("click", function() {
        stationCurrentPage = 1;
        stationQueryData();
      });
    $("#station-addBtn")
      .off()
      .on("click", function() {
        $("#station-btn-submit").text("创建");
        $("#station-create-modal").modal("show");
      });

    $("#station-btn-cancel")
      .off()
      .on("click", hideStatonModal);

    $("#station-btn-submit")
      .off()
      .on("click", function() {
        var text = $(this).text();
        if (text === "创建") {
          handleStationOk("new");
        } else {
          handleStationOk("edit");
        }
      });
    
    $("#stationImport")
      .off()
      .on('change', function(data) {
        var self = this;
        var formData = new FormData();
        formData.append('file', $(self).prop('files')[0]);
        $(self)
          .css('display','none')
          .siblings('span')
          .text('上传中...');
        $.ajax({
          type: 'POST',
          url: '/api/station/importTestStationExcel',
          data: formData,
          processData: false,
          contentType: false,
          success: function(data) {
            message("success", "导入成功");
          },
          error: function(err) {
            message("success", "导入失败");
          },
          complete: function() {
            $(self)
              .css('display','inline-block')
              .siblings('span')
              .text('检测站批量导入');
          },
        });
      });
  };
  window.stationDelete = function(_dom) {
    var id = $(_dom).attr("data-id");
    var token = getCookie("access_token");
    _dom.tooltip("hide");

    showLoading(true);
    $.ajax({
      type: "GET",
      url: "/api/station/delete",
      // data: JSON.stringify({ id: id }),
      data: { id: id, access_token: token },
      //timeout: 300,
      async: true, //所有请求均为异步。如果需要发送同步请求
      cache: false, //浏览器是否应该被允许缓存GET响应。
      contentType: "application/json",
      withCredentials: true,
      success: function(res) {
        var success = !res.isError;
        if (success) {
          stationCurrentPage = 1;
          stationQueryData();
          message("success", "删除成功");
        } else {
          message("error", res.data || "网络异常，请重试");
        }
        showLoading(false);
      },
      error: ajaxError
    });
  };

  window.stationEdit = function(_dom) {
    var index = $(_dom).attr("data-index");
    var id = $(_dom).attr("data-id");
    edittingStationId = id;
    var data = stationCurrentTableData[index];
    $('#station-form input[name="stationName"]').val(data.stationName);
    $('#station-form select[name="stationType"]').val(data.stationType + "");
    $('#station-form input[name="manageName"]').val(data.manageName);
    $('#station-form input[name="phone"]').val(data.phone);
    $('#station-form input[name="suborUnit"]').val(data.suborUnit);
    $('#station-form input[name="address"]').val(data.address);
    if (data.lng) {
      $('#station-form input[name="lng"]').val(data.lng);
    }
    if (data.lat) {
      $('#station-form input[name="lat"]').val(data.lat);
    }

    $("#station-btn-submit").text("修改");
    $("#station-create-modal").modal("show");
    c_change_station(
      $('#station-form select[name="suborCity"]')
        .val(data.suborCity)
        .get(0),
      "请选择区（县）",
      "请选择乡镇（街道）"
    );
    a_change_station(
      $('#station-form select[name="suborDistrict"]')
        .val(data.suborDistrict)
        .get(0),
      "请选择乡镇（街道）"
    );
    $('#station-form select[name="suborStreet"]').val(data.suborStreet);
  };

  function stationChangeList(data) {
    var auth = {
      '核验记录': false,
      "新增":false,
      '编辑': false,
      '核验员': false,
      '删除': false,
    };
    window.btnAuth['检测站点'] && window.btnAuth['检测站点'].forEach(item=>{
      auth[`${item}`] = true;
    })
    if (auth['新增']) {
      $('#station-addBtn').show()
    } else {
      $('#station-addBtn').hide()
    }

    var format = function(v) {
      if (v || v === 0) {
        return v;
      } else {
        return "-";
      }
    }

    var content = "";
    if (!data || !data.length) {
      content = '<div style="text-align: center;">暂无数据</div>';
    } else {
      data.map((item, itemIndex) => {
        
        let optionBtn = '';
        auth['核验员'] && (optionBtn += `<a href="javascript:void(0);" class="sui-btn btn-link table-option" onclick="handleStationChecker('${item.name}', '${item.id}')">核验员</a>`)
        auth['核验记录'] && (optionBtn += `<a href="javascript:void(0);" class="sui-btn btn-link table-option" onclick="stationHandleViewModal('${item.stationName}', '${item.id}')">核验记录</a>`)
        auth['编辑'] && (optionBtn +=`<a href="javascript:void(0);" class="sui-btn btn-link table-option" onclick="stationEdit(this)" data-index="${itemIndex}" data-id="${item.id}">编辑</a>` )
        auth['删除'] && (optionBtn +=`<a href="javascript:void(0);" data-id=${item.id} data-placement="top" data-trigger="click" data-type="confirm" data-toggle="tooltip" data-title="是否确定删除本条核验记录" class="sui-btn btn-link table-option station-btn-delete" >删除</a>`)

        let checkStationItem = (configStationTypeList || []).find(function(
          _item
        ) {
          return `${_item.key}` === `${item.stationType}`;
        });

        let checkStationType = checkStationItem ? checkStationItem.name : "-";

        content += `
          <tr>
            <td class="td-id"><div class="tp" data-placement="top" data-toggle="tooltip" title="${item.id ||
              "-"}">${item.id || "-"}</div></td>
            <td>${item.stationName || "-"}</td>
            <td>${checkStationType}</td>
            <td  style="width:10%;">${item.manageName || "-"}</td>
            <td style="width:10%;word-break:break-all;">${item.phone ||
              "-"}</td>
            <td>${item.countPeople}</td>
            <td>${format(
              item.verificationTodayCount
            )}<span style="color:red">(${format(
          item.abnormalVerificationTodayCount
        )})</span></td>
            <td>${format(
              item.verificationAllCount
            )}<span style="color:red">(${format(
          item.abnormalVerificationAllCount
        )})</span></td>
            <td>${item.location}</td>
            <td class="tbody-option">
              <div class="tbody-option-content">
                ${optionBtn || '-'}
                </div>
              </div>
            </td>
          </tr>
        `;
      });
    }
    $(".station-tbody-list").html(content);
    $(".station-btn-delete").tooltip({
      okHide: function() {
        stationDelete(this);
      }
    });
    /*
    $(".epidemic-btn-forbit").tooltip({
      okHide: function () {
        forbitEpidemic(this);
      }
    });
    */
    $(".station-tbody-list .td-id div").tooltip();

    refreshWatermark();
  }

  window.stationQueryData = function() {
    // 查询项值
    var token = getCookie("access_token");
    var params = {
      access_token: token,
      current: stationCurrentPage,
      size: stationPageSize,
      stationName: $("#stationName").val(),
      manageName: $("#station-manageName").val(),
      phone: $("#station-charger-phone").val(),
      suborCity: $(".station-search .detail-filter .city").val(),
      suborDistrict: $(".station-search .detail-filter .area").val(),
      suborStreet: $(".station-search .detail-filter .street").val(),
      stationType: $("#station-stationType").val(),
    };
    showLoading(true);
    $.ajax({
      type: "GET",
      url: httpPrefix + "/api/station/list",
      // data: JSON.stringify(params),
      data: params,
      contentType: 'application/json',
      cache: false, //浏览器是否应该被允许缓存GET响应。
      success: function(res) {
        var resData = res.data || {};
        var totalCount = resData.total || 0;
        stationCurrentTableData = resData.data; // 当前页的数据
        showLoading(false);
        $(".station-pagination-content .pagination").pagination(
          "updateItemsCount",
          totalCount,
          stationCurrentPage
        );
        $(".station-pagination-content .pagination").pagination(
          "updatePages",
          parseInt((totalCount - 1) / stationPageSize) + 1,
          stationCurrentPage
        );
        stationRenderPageExtra(totalCount);
        showLoading(false);
        stationChangeList(resData.data);
      },
      error: function(err) {
        showLoading(false);
        if (err.statusCode == 401) {
          toLogin();
        } else {
          message("error", "网络异常，请重试");
          stationChangeList([]);
        }
      }
    });
  };
  function stationHandlePageChange(page) {
    stationCurrentPage = page;
    stationQueryData();
  }

  function stationRenderPageExtra(num) {
    $(".station-pagination-content .pagination-extra .label").html(num);
  }

  window.stationInitModal = function() {
    $("#station-record-filter").datepicker({
      // 日期组件初始化
      endDate: getNowFormatDate(),
      format: "yyyy-mm-dd",
      Multidate: 2,
      size: "small"
    });
  };

  window.stationInitPagination = function(itemsCount) {
    $(".station-pagination-content .pagination").pagination({
      itemsCount: itemsCount,
      currentPage: stationCurrentPage,
      pageSize: stationPageSize,
      styleClass: ["pagination-large"],
      showCtrl: true,
      displayPage: 6,
      onSelect: stationHandlePageChange
    });
    stationRenderPageExtra(itemsCount);
    $("#station-pageSizeChange").change(function(e) {
      stationPageSize = $(e.currentTarget).val();
      stationCurrentPage = 1;
      stationQueryData();
    });
  };

  window.stationInitStationType = function() {
    if (
      window.configStationTypeList &&
      window.configStationTypeList.length > 0
    ) {
      var checkStationTypeOptionList = configStationTypeList.map(function(
        item
      ) {
        return `<option value=${item.key}>${item.name}</option>`;
      });
      $('#station-create-modal select[name="stationType"]').html(
        checkStationTypeOptionList
      );
    }
  };

  function handleStation(data, type) {
    var token = getCookie("access_token");
    showLoading(true);
    if (type === "edit") {
      data.id = edittingStationId;
    }
    $.ajax({
      type: "POST",
      url:
        httpPrefix + type === "new"
          ? `/api/station/save?access_token=${token}`
          : `/api/station/update?access_token=${token}`,
      data: JSON.stringify(data),
      //timeout: 300,
      async: true, //所有请求均为异步。如果需要发送同步请求
      cache: false, //浏览器是否应该被允许缓存GET响应。
      contentType: "application/json",
      withCredentials: true,
      success: function(res) {
        showLoading(false);
        if (res.isError) {
          message("error", res.data || "网络异常，请重试");
        } else {
          message("success", "操作成功");
          hideStatonModal();
          stationCurrentPage = 1;
          stationQueryData();
        }
      },
      error: ajaxError
    });
  }
  function checkStationData(data) {
    try {
      checkName(data.manageName, "负责人姓名格式有误"); // 校验 name
      checkPhone(data.phone, "联系电话请填写正确的手机号码"); // 校验手机号
      checkEmpty(data.stationName, "检测站名称不能为空");
      checkEmpty(data.stationType, "检测站类型不能为空");
      checkEmpty(data.suborCity, "所属区域城市不能为空");
      checkEmpty(data.suborDistrict, "所属区域区（县）不能为空");
      checkEmpty(data.suborUnit, "归属单位不能为空");
      checkEmpty(data.address, "详细地址不能为空");
      if (data.suborCity === "菏泽市") {
        checkEmpty(data.suborStreet, "所属区域乡镇（街道）不能为空");
      }
      if (data.lng && data.lng.trim()) {
        checkLng(data.lng, "检测站经度格式有误");
      }
      if (data.lat && data.lat.trim()) {
        checkLng(data.lat, "检测站纬度格式有误");
      }
    } catch (error) {
      message("error", error);
      return false;
    }
    return true;
  }
  function handleStationOk(type) {
    // showLoading(true)
    let data;
    if (defaultCity !== "" && defaultCity !== null && defaultCity !== undefined) {
      $("select[name=suborProv]").removeAttr("disabled");
      $("select[name=suborCity]").removeAttr("disabled");
      data = qs.parse($('#station-form').serialize());
      if (!checkStationData(data)) {
        $("select[name=suborProv]").attr("disabled", true);
        $("select[name=suborCity]").attr("disabled", true);
        return;
      }
    } else {
      data = qs.parse($('#station-form').serialize());
      if (!checkStationData(data)) {
        return;
      }
    }




    handleStation(data, type); // 开始提交表单
  }

  // 检测员列表弹出框
  window.handleStationChecker = function(name, id, modalIsShown) {
    // id 用于查询详情或者
    $("#station-verificationModal").modal("show");
    var token = getCookie("access_token");
    let currentId = "";
    if (id) {
      $("#station-verificationModal").attr("data-id", id);
      currentId = id;
    } else {
      currentId = $("#station-verificationModal").attr("data-id");
    }
    stationCheckerPage.curStationId = currentId;
    if (!currentId) return message("error", "此记录参数缺失，无法查询");
    $("#station-verificationModal-list").empty();
    showLoading(true);
    $.ajax({
      type: "POST",
      url: "/api/station/fk/queryUserByCondition?access_token=" + token,
      data: JSON.stringify({
        stationId: currentId,
        current: stationCheckerPage.pageNum,
        size: stationCheckerPage.pageSize
      }),
      async: true, //所有请求均为异步。如果需要发送同步请求
      cache: false, //浏览器是否应该被允许缓存GET响应。
      contentType: "application/json",
      withCredentials: true,
      success: function(res) {
        showLoading(false);
        if (res.error) return message("error", "查询失败");
        if (res.data) {
          let currentDetail = res.data.data;
          let totalCount = res.data.total || 0;
          if (currentDetail.length < 1) {
            $("#station-verificationModal-list").html(
              '<div style="text-align:center">暂无核验员！</div>'
            );
            stationCheckerUpdatePage(
                  stationCheckerPage.pageNum,
                  stationCheckerPage.pageSize,
                  totalCount
              );
            return;
          } else {
            $("#station-verificationModal-list").html(
              renderStationCheckerList(currentDetail)
            );
          }
          stationCheckerUpdatePage(
            stationCheckerPage.pageNum,
            stationCheckerPage.pageSize,
            totalCount
          );
          showLoading(false);
          if (!modalIsShown) {
            $("#station-verificationModal").modal("show");
          }
        }
      },
      error: ajaxError
    });
  };

  // 检测员列表渲染
  window.renderStationCheckerList = function(stationCheckerdata) {
    let domString = stationCheckerdata
      .map(function(item) {
        let checkerType = "";
        if (`${item.userType}` === "0") {
          checkerType = "警务人员";
        } else if (`${item.userType}` === "1") {
          checkerType = "社区人员";
        } else if (`${item.userType}` === "2") {
          checkerType = "物业保安";
        } else if (`${item.userType}` === "3") {
          checkerType = "其他";
        }
        return (
          `<p style="display: flex;justify-content: space-around;text-align: center">` +
          `<span style="margin-right: 8px;width: 120px">${item.realName ||
            '-'}</span>` +
          `<span style="margin-right: 8px;width: 80px">${checkerType ||
            "-"}</span>` +
          `<span style="margin-right: 8px;width: 160px">${item.identityCard ||
            ""}</span>` +
          `<span style="margin-right: 8px;width: 100px">${item.phone ||
            "-"}</span>` +
          `<span style="margin-right: 8px;width: 80px">${item.companyName ||
            "-"}</span>` +
          `<span style="margin-right: 8px;width: 80px">${item.job ||
            "-"}</span>` +
          `<span style="width: 160px">${item.createDate || "-"}</span>` +
          `</p>`
        );
      })
      .join("");
    return domString;
  };

  // 检测人员列表分页逻辑
  window.stationCheckerUpdatePage = function(current, size, total) {
    $("#station-verificationModal-pagination .pagination").pagination(
      "updateItemsCount",
      total,
      current
    );
    $("#station-verificationModal-pagination .pagination").pagination(
      "updatePages",
      parseInt((total - 1) / size) + 1,
      current
    );
    $("#station-verificationModal-pagination .pagination-extra .label").html(
      total
    );
  };

  // 检测人员列表分页器初始化
  window.initStationCheckerModal = function() {
    let total = 0;
    // 事件绑定
    $("#station-verificationModal-btn-close-x")
      .off()
      .on("click", function(e) {
        $("#station-verificationModal").modal("hide");
        handleTransformModal();
      });

    // 点x事件
    $("#station-verificationModal-btn-close-x2")
      .off()
      .on("click", function(e) {
        $("#station-verificationModal").modal("hide");
        // handleTransformModal();
      });
    // 分页器初始化
    $("#station-verificationModal-pagination .pagination").pagination({
      itemsCount: total,
      currentPage: stationCheckerPage.pageNum,
      pageSize: stationCheckerPage.pageSize,
      styleClass: ["pagination-large"],
      showCtrl: true,
      displayPage: 6,
      onSelect: function(page) {
        stationCheckerPage.pageNum = page;
        handleStationChecker("", "", true);
      }
    });
    $("#station-verificationModal-pagination .pagination-extra .label").html(
      total
    );
    $("#station-verificationModal-pageSizeChange").change(function(e) {
      stationCheckerPage.pageSize = $(e.currentTarget).val();
      stationCheckerPage.pageNum = 1;
      handleStationChecker("", "", true);
    });
  };
})();


function  epidemicInitSearchCity(){
  var cityArr = [];
  var defaultProvince = window.oConfig['fk.register.area.province'];
  // var defaultCity = window.oConfig['fk.register.area.city'] || '';
  window.areaList && window.areaList.forEach(function(item){
    if(item.value === defaultProvince){
      cityArr = item.child
    }
  })
  // if( defaultCity===  null ? false : (defaultCity === ''? false : true)){
  //   $('#epidemic-suborCity').html(`<option style='display:none;' value='${defaultCity}'>${defaultCity}</option>`)
  //   $('#epidemic-suborCity').attr('disabled',true);
  //   renderDistricr(defaultCity)
  // }else{
  //   var cityArrHtml = "<option style='display:none;' value=''>请选择城市</option>";
  //   cityArr && cityArr.forEach(function(item){
  //     cityArrHtml += `<option value="${item.value}">${item.value}</option>`
  //   })
  //   $('#epidemic-suborCity').html(cityArrHtml)
  // }
  // 0305徐州 核验员管理 - 查询 放开禁用、放开允许切换、不默认defaultCity
  var cityArrHtml = "<option value=''>请选择城市</option>";
  cityArr && cityArr.forEach(function(item){
    cityArrHtml += `<option value="${item.value}">${item.value}</option>`;
  })
  $('#epidemic-suborCity').html(cityArrHtml)
  

  $('#epidemic-suborCity').on('change',function(){
    var  cur  = $(this).val()
    renderDistricr(cur)
  })

  function renderDistricr(cur){
    var districtArr = [];
    cityArr && cityArr.forEach(function(oItem){
      if(oItem.value === cur){
        districtArr = oItem.child;
        oDistrictArr =  oItem.child;
      }
    })
    var districtArrHtml = "<option value=''>请选择区（县)</option>";
    districtArr && districtArr.forEach(function(item){
      districtArrHtml += `<option value="${item.value}">${item.value}</option>`;
    })
    $('#epidemic-suborDistrict').html(districtArrHtml)
    $('#epidemic-suborStreet').html("<option value=''>请选择乡镇（街道）</option>");
  }

  $('#epidemic-suborDistrict').off().on('change',function(){
    var cur = $(this).val();
    var suborStreetArr =[];
    oDistrictArr && oDistrictArr.forEach(function(item){
      if(item.value === cur){
        suborStreetArr = item.child || [];
      }
    })
    var oDistrictArrHtml = "<option style='display:none;' value=''>请选择乡镇（街道）</option>";
    suborStreetArr && suborStreetArr.forEach(function(item){
      oDistrictArrHtml += `<option value="${item.value}">${item.value}</option>`;
    })
    $('#epidemic-suborStreet').html(oDistrictArrHtml);
  })
}

// 标签管理 模块 代码
var labelAdmin = {
  data: {
    tagLabelType: ["通行类标签", "预警类标签", "隔离类标"],
    token: '',
  }
};
// 获取图标列表
labelAdmin.iconList = function() {
  $.ajax({
    type: "POST",
    url: "/api/label/iconList?access_token=" + this.data.token,
    success: function(res) {
      if (!res.error) {
        $(".iconList").html(template("iconList-template", res.data));
      }
    }
  });
};
// 请求列表数据
labelAdmin.getLabelList = function(){
    $.ajax({
    type: "GET",
    url: "/api/label/selectAll1?access_token=" + this.data.token,
    success: res=> {
      if (!res.success) {
        template.defaults.imports.tagLabelType = this.data.tagLabelType;
        this.renderList(res.data);
      } else {
        this.renderList([]);
      }
    },
    error: err=> {
      if (err.statusCode == 401) {
        toLogin();
      } else {
        message("error", "网络异常，请重试");
        this.renderList([]);
      }
    }
  });
};
// 渲染列表
labelAdmin.renderList = function(data) {
  if (!data.length) {
    $(".pass-tbody-list").html(
      '<div style="text-align: center;height:300px;line-height:300px;font-size:18px">暂无数据</div>'
    );
  } else {
    $(".pass-tbody-list").html(template("list-template", data));
    if (data.length < 10) {
      $("#addEpidemicBtn").show();
    }else{
      $("#addEpidemicBtn").hide();
    }
  }
  var that = this;
  $(".btn-delete").tooltip({
    okHide: function() {
      that.handeleDelete(this);
    }
  });
  $(".btn-clear").tooltip({
    okHide: function() {
      that.handeleClear(this);
    }
  });
  $(".tbody-list .rule-content div").tooltip();

  refreshWatermark();
};
// 新增编辑对话框显示
labelAdmin.addEpidemicShow = function(type,data){
  if(type === 'edit'){
    fillFormField('#addModalFrom',data)
  }
  $("#addModal").modal("show");
}
// 删除标签
labelAdmin.handeleDelete = function(that){
    const labelId = that.attr("data-labelId");
    $.ajax({
      type: "POST",
      url: "/api/label/labelDel?access_token=" + this.data.token,
      data: JSON.stringify({ labelId: parseInt(labelId) }),
      async: false, //所有请求均为异步。如果需要发送同步请求
      cache: false, //浏览器是否应该被允许缓存GET响应。
      contentType: "application/json",
      withCredentials: true,
      success: (res)=> {
        if (res) {
          message("success", "删除成功!");
          that.tooltip("hide");
          this.getLabelList();
        } else {
          message("error", "删除失败!");
        }
      },
      error: function(err) {
        message("error", "清除失败!");
      }
    });
}
// 清除规则
labelAdmin.handeleClear = function(that){
  const ruleId = that.attr('data-ruleId')
  $.ajax({
    type: "POST",
    url: "/api/label/labelRuleDel?access_token=" + this.data.token,
    data:JSON.stringify({ruleId:parseInt(ruleId)}),
    async: false, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: (res)=> {
      if(res){
        message("success",'清除成功!');
        that.tooltip('hide')
        this.getLabelList();
      }else{
        message("error",'清除失败!');
      }
    },
    error: function(err) {
      message("error",'清除失败!');
    }
  });
}
//设置规则
labelAdmin.setEpidemicShow= function(data){
  $('#setModalTitle').tooltip();
  $("#setModalTitle").attr("data-original-title", this.data.title);
  $("#setModalFrom")
    .find("[name='labelId']")
    .val(data.labelId);
  $("#setModal").modal("show");
}
//设置规则请求
labelAdmin.setRuleAjax = function(data){
  $.ajax({
    type: "POST",
    url: "/api/label/labelRuleSet?access_token=" + this.data.token,
    data:JSON.stringify(data),
    async: false, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: (res)=> {
      if(!res.error){
        $("#setModal").modal("hide");
        message("success",res.data);
        this.getLabelList();
      }else{
        message("error",res.data);
      }
    },
    error: function(err) {
      message("error",'规则增加失败');
    }
  });
}
// 新建/编辑 请求
labelAdmin.addLabelAjax = function(url,data,tip){
  $.ajax({
    type: "POST",
    url: url + "?access_token=" + this.data.token,
    data: JSON.stringify(data),
    async: false, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: (res) =>{
      if (res) {
        $("#addModal").modal("hide");
        this.getLabelList();
      } else {
        message("error", tip + "失败");
      }
    },
    error: function(err) {
      if (err.statusCode == 401) {
        toLogin();
      } else {
        message("error", tip + "失败");
      }
    }
  });
}
// 初始化设置
labelAdmin.onload = function() {
  this.data.token = token;
  const data = window.oConfig;
  template.defaults.imports.personnelTypeTitle = data.ncovSeriousArea;
  $("#personnelTypeList").html(
    template("personnelTypeList-template", JSON.parse(data["fc.userType"]))
  );
  this.getLabelList();
  this.iconList();
  //新建/编辑对话框关闭
  $("#addModal").on("cancelHide", function() {
    $("#addModalFrom")[0].reset();
    $("#addModalFrom .radio-pretty").removeClass("checked");
    $("#addModalFrom").validate("hideError");
  });
  // 新建/编辑对话框表单提交
  $("#addModalFrom").validate({
    rules: {
      labelType: {
        required: true
      },
      labelName: {
        required: true,
        maxlength: 4
      },
      iconId: {
        required: true
      },
      priority: {
        required: true,
        digits: true
      }
    },
    success: () => {
      var data = qs.parse($("#addModalFrom").serialize());
      var url = "";
      var tip = "";
      if (data.labelId === "") {
        //新增
        delete data.labelId;
        url = "/api/label/addLabel";
        tip = "新增";
      } else {
        url = "/api/label/labelEdit";
        tip = "编辑";
      }
      this.addLabelAjax(url, data, tip);
      return false;
    }
  });
  //设置规则框隐藏
  $("#setModal").on("cancelHide", function() {
    $("#setModalFrom")[0].reset();
    $("#setModalFrom .radio-pretty").removeClass("checked");
    $("#setModalFrom").validate("hideError");
  });
  // 设置规则对话框表单提交
  $("#setModalFrom").validate({
    rules: {
      labelId: {
        required: true
      },
      personnelType: {
        required: true
      }
    },
    success: () => {
      var data = qs.parse($("#setModalFrom").serialize());
      if (data.dailyAttendance || data.healthVerification) {
        if (data.verificationDay) {
          $("#setModalFrom").validate(
            "hideError",
            "verificationDay",
            "myerror"
          );
          this.setRuleAjax(data);
        } else {
          $("#setModalFrom").validate(
            "showError",
            "verificationDay",
            "必须选择天数",
            "myerror"
          );
        }
      } else {
        this.setRuleAjax(data);
      }
      return false;
    }
  });
};

var leaveRecord = {
  pageNum: 1,
  pageSize: 20,
  temperature: {
    0: '36.0℃以下',
    1: '36.0-36.5℃',
    2: '36.6-37.0℃',
    3: '37.1-37.3℃',
    4: '37.4-38.0℃',
    5: '38.1-38.5℃',
    6: '38.6-39.0℃',
    7: '39.1-39.5℃',
    8: '39.6-40.0℃',
    9: '40.0℃以上'
  },
  leaveType: {
    '0': '工作',
    '1': '上学',
    '2': '回家',
    '10': '其他',
  }
};

leaveRecord.showModalAndFetch = function(name, id, modalIsShown) {
  if (name) {
    $("#leaveRecord-modal-label").text(
      `【${name ? name : "-"}】离徐记录`
    );
  }
  let currentId = "";
  if (id) {
    $("#leaveRecord-modal").attr("data-id", id);
    currentId = id;
  } else {
    currentId = $("#leaveRecord-modal").attr("data-id");
  }
  if (!currentId) return message("error", "此记录参数缺失，无法查询");
  showLoading(true);
  if (!modalIsShown) {
    leaveRecord.pageNum = 1;
    leaveRecord.pageSize = 20;
  }
  // const startTime = $("#leaveRecord-modal-startDate").val();
  // const endTime = $("#leaveRecord-modal-endDate").val();
  $.ajax({
    type: "GET",
    url: "/api/leaveRecord/list?access_token" + token,
    data: {
      recordId: currentId,
      current: leaveRecord.pageNum,
      size: leaveRecord.pageSize,
    },
    async: true, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: function(res) {
      showLoading(false);
      if (res.error) return message("error", "查询失败");
      if (res.data) {
        $("#leaveRecord-modal-list").empty();
        let currentDetail = res.data.data;
        let totalCount = res.data.total || 0;
        if (currentDetail.length < 1) {
          $("#leaveRecord-modal-list").html(
            "<div>暂无离徐记录！</div>"
          );
          // return;
        } else {
          $("#leaveRecord-modal-list").html(
            leaveRecord.renderList(currentDetail)
          );
        }
        leaveRecord.updatePagination(
          leaveRecord.pageNum,
          leaveRecord.pageSize,
          totalCount
        );
        showLoading(false);
        if (!modalIsShown) {
          $("#leaveRecord-modal").modal("show");
        }
      }
    },
    error: ajaxError
  });
}

leaveRecord.renderList = function(data) {
  let titleString = `<p class="modal-body-flex" style="display: flex;justify-content: space-around;text-align: left;background:#eee;line-height:30px;">` + 
    `<span style="margin-right: 8px;width: 100px">时间</span>`+
    `<span style="margin-right: 8px;width: 100px">体温</span>`+
    `<span style="margin-right: 8px;width: 100px">交通工具</span>`+
    `<span style="margin-right: 8px;width: 50px">离徐原因</span>`+
    `<span style="margin-right: 8px;width: 120px">目的地</span>`+
    `</p>`;
  let domString = data
    .map(function(item) {
      return (
        `<p style="display: flex;justify-content: space-around;text-align: left;">` +
        `<span style="margin-right: 8px;width: 100px">${
          item.leaveTime || "-"}</span>` +
        `<span style="margin-right: 8px;width: 100px">${leaveRecord.temperature[item.temperature] ||
          "-"}</span>` +
        `<span style="margin-right: 8px;width: 100px">${item.travelTypeAndtravelNo || '-'
        }</span>` +
        `<span style="margin-right: 8px;width: 50px">${leaveRecord.leaveType[item.leaveType] ||
          "-"}</span>` +
        `<span style="width: 120px">${item.destination || "-"}</span>` +
        `</p>`
      );
    })
    .join("");
  return titleString + domString;
}

leaveRecord.initModal = function() {
  let total = 0;
  // 初始化日期选择器
  // $("#leaveRecord-modal-filter .input-date").datepicker({
  //   endDate: getNowFormatDate(),
  //   format: "yyyy-mm-dd",
  //   Multidate: 2,
  //   size: "small",
  //   timepicker: true,
  //   autoclose: false //这里最好设置为false
  // });
  // 事件绑定
  $("#leaveRecord-modal-btn-close-x")
    .off()
    .on("click", function(e) {
      leaveRecord.hideModal();
    });
  // 分页器初始化
  $("#leaveRecord-modal-pagination .pagination").pagination({
    itemsCount: total,
    currentPage: leaveRecord.pageNum,
    pageSize: leaveRecord.pageSize,
    styleClass: ["pagination-large"],
    displayPage: 3,
    onSelect: function(page) {
      leaveRecord.pageNum = page;
      leaveRecord.showModalAndFetch("", "", true);
    }
  });
  $("#leaveRecord-modal-pagination .pagination-extra .label").html(
    total
  );
  $("#leaveRecord-modal-pageSizeChange").change(function(e) {
    leaveRecord.pageSize = $(e.currentTarget).val();
    leaveRecord.pageNum = 1;
    leaveRecord.showModalAndFetch("", "", true);
  });
}

leaveRecord.hideModal = function() {
  //重置时间
  // $("#leaveRecord-modal-startDate").val("");
  // $("#leaveRecord-modal-endDate").val("");
  //重置页码入参
  leaveRecord.pageNum = 1;
  leaveRecord.pageSize = 20;
  //重置页码、条数ui
  $("#leaveRecord-modal-pagination")
    .find(".sui-dropdown")
    .find("a[value=20]")
    .click();
  $("#leaveRecord-modal").modal("hide");
}

leaveRecord.updatePagination = function(current, size, total) {
  $("#leaveRecord-modal-pagination .pagination").pagination(
    "updateItemsCount",
    total,
    current
  );
  $("#leaveRecord-modal-pagination .pagination").pagination(
    "updatePages",
    parseInt((total - 1) / size) + 1,
    current
  );
  $("#leaveRecord-modal-pagination .pagination-extra .label").html(
    total
  );
}

leaveRecord.resetFilter = function() {
  // $("#leaveRecord-modal-startDate").val("");
  // $("#leaveRecord-modal-endDate").val("");
  leaveRecord.showModalAndFetch("", "", true);
}

window.toggleNationAndLocale = function(selectValue){
  if(`${selectValue}` === '5'){
    $('#myModal-create #nationalityContainer').show();
    $('#myModal-create #domicileContainer').hide();
  } else {
    $('#myModal-create #nationalityContainer').hide();
    $('#myModal-create #domicileContainer').show();
  }
}
// 今日疫情预警tab页
;(function() {
  var todayAlertCurrentPage = 1;
  var todayAlertPageSize = 20;

  window.returnType_change = function(select) {
    let city = $(select)
      .parent()
      .find(".city");
    let area = $(select)
      .parent()
      .find(".area");
    city
      .css('display','none')
      .html(
        `<option value='' disabled selected style='display:none;'>市</option>`
      );
    area
      .css('display','none')
      .html(
        `<option value='' disabled selected style='display:none;'>区/县</option>`
      );
    let value = String(select.value);
    let countryOrProvinces = $(select)
      .siblings('[name="provincesOrCountries"]')
      .removeClass('provinces')
      .css('display', 'inline-block')
      .html(`<option value="" disabled selected style="display:none;">请选择国家/省份</option>`);
    if (select.value === "0") {
      countryOrProvinces.addClass('provinces');
      window.areaList && window.areaList.map(_item => {
        countryOrProvinces.append(`
          <option value='${_item.value}'>${_item.value}</option>
          `
          );
      });
      city.css('display', 'inline-block');
      area.css('display', 'inline-block');
    } else if(select.value === "1") {
      let obj222 = JSON.parse(window.config.depart_country);
      let option222 = Object.keys(obj222).forEach(function (_key) {
        countryOrProvinces.append(`<option value='${obj222[_key]}'>${obj222[_key]}</option>`);
      });
    } else {
      $(countryOrProvinces).css('display', 'none');
    }
  }

  window.resetTodayAlertSelect = function() {
    $("#ta-personnelType, #ta-codeColor")
      .siblings("span")
      .text("全部");
    returnType_change(
      $('#todayAlertTabContent select[name="search_returnType"]')
        .val('')
        .get(0)
    );
  }
  window.todayAlertSearchEventBind = function() {
    $("#ta-colorBtn")
      .off()
      .on("click", function() {
        todayAlertCurrentPage = 1;
        getUpdateColorList();
        getTodayAlertDataList();
    });
    $("#ta-resetBtn")
      .off()
      .on("click", function() {
        $("#todayAlertTabContent .search-zone .detail-filter input").val("");
        $("#todayAlertTabContent .search-zone .dropdown-inner a span").text("");
        resetTodayAlertSelect();
        queryTodayAlertData();
    });
    $("#ta-searchBtn")
      .off()
      .on("click", function() {
        todayAlertCurrentPage = 1;
        getTodayAlertDataList();
    });
    $("#ta-exportBtn")
      .off()
      .on("click", function() {
        exportTodayAlertData();
      });
  }
  window.todayAlertInitPagination = function (itemsCount) {
    $("#todayAlertTabContent .pagination-content .pagination").pagination({
      itemsCount: itemsCount,
      currentPage: todayAlertCurrentPage,
      pageSize: todayAlertPageSize,
      styleClass: ["pagination-large"],
      showCtrl: true,
      displayPage: 6,
      onSelect: handleTodayAlertPageChange,
    });
    renderTodayAlertPageExtra(itemsCount);
    $("#ta-pageSizeChange").change(function(e) {
      todayAlertPageSize = $(e.currentTarget).val();
      todayAlertCurrentPage = 1;
      getTodayAlertDataList();
    });
  }
  function renderTodayAlertPageExtra(num) {
    $("#todayAlertTabContent .pagination-content .pagination-extra .label").html(num);
  }
  function handleTodayAlertPageChange(page) {
    todayAlertCurrentPage = page;
    getTodayAlertDataList();
  }

  // 更新颜色码   魏晨
  function getUpdateColorList() {
    var token = getCookie("access_token");
    showLoading(true);
    $.ajax({
      type: "GET",
      url:
        httpPrefix +
        "/api/colorRecord/allUnHealthRecord?access_token=" + token,
      cache: false, //浏览器是否应该被允许缓存GET响应。
      success: function(res) {
        showLoading(false);
      },
      error: function(err) {
        showLoading(false);
        if (err.statusCode == 401) {
          toLogin();
        } else {
          message("error", "网络异常，请重试");
          changeTodayAlertList([]);
        }
      }
    });
  }

  // 统计数据
  window.queryStatistics = function (date) {
    var token = getCookie("access_token");
    showLoading(true);
    $.ajax({
      type: "GET",
      url: httpPrefix + "/api/companionRecord/countRecordAnalysis?access_token=" + token,
      data: {
        date: date,
      },
      cache: false, //浏览器是否应该被允许缓存GET响应。
      success: function(res) {
        showLoading(false);
        if (res.error) return message("error", "查询失败");
        if (res.data) {
          $("#statistics-list").empty();
          let statisticsData = res.data;
          changeStatisticsList(statisticsData);
          showLoading(false);
        }
      },
      error: ajaxError
    });
  };

  function changeStatisticsList(data) {
    var content = "";
    if (!data || !data.length) {
      content = '<div style="text-align: center;">暂无数据</div>';
    } else {
      data.map(item => {
        content += `
        <tr>
          <td>${item.areaName}</td>
          <td>${item.totalNum}</td>
          <td>${item.comeNum}</td>
          <td>${item.inNum}</td>
          <td>${item.yesterdayIncremental}</td>
          <td>${item.todayIncremental}</td>
        </tr>
      `;
      });
    }
    $("#statistics-list").html(content);
  }

  function getTodayAlertParams() {
    var params = {};
    // 查询项值
    params.name = $("#ta-name").val();
    params.phone = $("#ta-phone").val();
    params.personnelType = $("#ta-personnelType").val();
    params.idCardNum = $("#ta-idCardNum").val();
    // params.color = encodeURIComponent($("#ta-codeColor").val());
    params.color = $("#ta-codeColor").val();
    params.departCountryType = $('#todayAlertTabContent select[name="search_returnType"]').val();
    if (params.departCountryType === "0") {
      params.departProv = $('.todayAlert-search .provinces').val();
      params.departCity = $('.todayAlert-search .city').val();
      params.departDistrict = $('.todayAlert-search .area').val();
    } else if (params.departCountryType === "1") {
      params.departCountry = $('#todayAlertTabContent select[name="provincesOrCountries"]').val();
    }
    return params;
  }
  function getTodayAlertDataList() {
    let params = getTodayAlertParams();
    queryTodayAlertData(params);
  }

  function exportTodayAlertData () {
    let params = getTodayAlertParams();
    var token = getCookie("access_token");
    var url = 
      httpPrefix +
      "/api/colorRecord/exportColorRecord?access_token=" +
      token + '&' +
      Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
    window.location.href = url;
  }

  window.queryTodayAlertData = function (paramet) {
    var token = getCookie("access_token");
    showLoading(true);
    $.ajax({
      type: "GET",
      url:
        httpPrefix +
      "api/colorRecord/getAllColorRecord?access_token=" +
        token +
        "&size=" +
        todayAlertPageSize +
        "&current=" +
        todayAlertCurrentPage,
      data: paramet,
      cache: false, //浏览器是否应该被允许缓存GET响应。
      success: function(res) {
        var data = res.data || {};
        $("#todayAlertTabContent .pagination-content .pagination").pagination(
          "updateItemsCount",
          data.total,
          todayAlertCurrentPage
        );
        $("#todayAlertTabContent .pagination-content .pagination").pagination(
          "updatePages",
          parseInt((data.total - 1) / todayAlertPageSize) + 1,
          todayAlertCurrentPage
        );
        renderTodayAlertPageExtra(data.total);
        showLoading(false);
        changeTodayAlertList(data.data);
      },
      error: function(err) {
        showLoading(false);
        if (err.statusCode == 401) {
          toLogin();
        } else {
          message("error", "网络异常，请重试");
          changeTodayAlertList([]);
        }
      }
    });
  }
  function renderColor(color, text) {
    return `<div style="text-align: center;background: ${decodeURIComponent(color)}">${text}</div>`;
  }

  // 操作逻辑需要同步到changeList
  function changeTodayAlertList(data) {
    /*
    var auth = {
      '人员轨迹':false,
      '健康打卡':false,
      '核验记录':false,
      '详情':false,
      '删除':false,
      '导出':false,
    };
    window.btnAuth['登记人员'] && window.btnAuth['登记人员'].forEach(item=>{
      auth[`${item}`] = true;
    })
    */
    var auth = {
      '人员轨迹':true,
      '健康打卡':true,
      '核验记录':true,
      '详情':true,
      '删除':true,
      '导出':true,
    };
    auth['导出'] ? $('#ta-exportBtn').show() : $('#exportBtn').hide();

    var content = "";
    var labelMap = {};
    if (!data || !data.length) {
      content = '<div style="text-align: center;">暂无数据</div>';
    } else {

      data.map(item => {
        /*
        let companionCount = item.companion;
        let companionString = companionCount;

        if (companionCount > 0) {
          let domId = `companion-tooltip-${item.recordId}-${item.id}`;
          companionString = `<a
            id="${domId}"
            style="cursor:pointer"
            >${companionCount}</a>`;
          renderCompanionList(item, `#${domId}`, companionCount);
        }

        */
        let travelType =
          ["汽车", "火车", "飞机", "其他"][item.travelType - 1] ||
          ["私家车", "公交车", "电动车", "其他"][item.localTravelType - 1] ||
          "-";
        let travelNo = item.travelNo || item.localTravelNo || "-";
        let optionBtn = '';
        auth['人员轨迹'] && (optionBtn += `<a href="/map.html?id=${item.idCardNum}&recordId=${item.recordId}" target="map" class="sui-btn btn-link table-option">人员轨迹</a>`);
        (optionBtn += `<a href="javascript:void(0);" class="sui-btn btn-link table-option" onclick="leaveRecord.showModalAndFetch('${item.name}', '${item.recordId}')">离徐记录</a>`);
        auth['核验记录'] && (optionBtn += `<a href="javascript:void(0);" class="sui-btn btn-link table-option" onclick="verificationViewHealthDetail('${item.name}', '${item.recordId}')">核验记录</a>`);
        auth['健康打卡'] && (optionBtn += `<a href="javascript:void(0);" class="sui-btn btn-link table-option" onclick="handleViewHealthDetail('${item.name}', '${item.recordId}')">健康记录</a>`)
        auth['详情'] && (optionBtn += `<a href="javascript:void(0);" class="sui-btn btn-link table-option" onclick="handleViewDetail('detail', '${item.recordId}')">详情</a>`)
        auth['删除'] && (optionBtn += ` <a href="javascript:void(0);" data-id=${item.recordId} data-placement="top" data-trigger="click" data-type="confirm" data-toggle="tooltip" data-title="是否确定删除本条登记信息" class="sui-btn btn-link table-option btn-delete">删除</a>`);

        // <td class="companion-tooltip">${companionString}</td>
        content += `
          <tr>
            <td class="td-id"><div class="tp" data-placement="top" data-toggle="tooltip" title="${
              item.recordId
            }">${item.recordId}</div></td>
            <td style="width:7%;">${item.name}</td>
            <td style="width:12%;word-break:break-all;">${item.idCardNum}</td>
            <td style="width:10%;word-break:break-all;">${item.phone}</td>
            <td>${travelType}</td>
            <td style="width:7%;word-break:break-all;">${travelNo}</td>
            <td style="width:10%;word-break:break-all;">${(item.recordTime || "").replace(
              "T",
              " "
            )}</td>
            <td>${RECORD_SOURCE_TYPE[item.source]}</td>
            <td>${renderColor(item.color, item.colorValue)}</td>
            <td>${item.exceptionReason}</td>
            <td class="tbody-option">
              <div class="tbody-option-content">
                <div>
                  ${optionBtn || '-'}
                </div>
              </div>
            </td>
          </tr>
        `;
      });
    }
    $("#todayAlertTabContent .tbody-list").html(content);
    $("#todayAlertTabContent .btn-delete").tooltip({
      okHide: function() {
        handleDelete(this);
      }
    });
    $("#todayAlertTabContent .tbody-list .td-id div").tooltip();
  }
})();