(function () {

let manageUserId; //编辑id
let userManagerPca = []; // 读取后端返回的区域字典数据
let httpPrefix = '';
let openAuthFieldList = ['name', 'sex', 'idCardNum', 'suborUnit']; // 修改权限开放的域
// todo 区域管理员
let currentData = {};

window.onload = () => {
  token = getCookie("access_token");
  if (!token) {
    window.logOutRequest();
  }
  loadUser(token);
  init();
};

function init(){
  loadConfig();
  bindLogoutEvent();
}

function fetchInitialData(afterInitFunc){
  getLocationInfo().then(function(){
      getOperateLimits().then(function(){
        if(afterInitFunc){
          afterInitFunc();
        }
      })
    }
  );
}

function showBtnAndBindEvent(){
  $('#addBtn').show();
  $('.controls .subtrBtn').each(function(_index, _dom){
    return $(_dom).show();
  })
  bindAddEvent();
  bindRemoveEvent();
}

function hideBtnAndRemoveEvent(){
  $('#addBtn').hide();
  $('.controls .subtrBtn').each(function(_index, _dom){
    return $(_dom).hide();
  });
  $(".control-group").off();
  $("#controlList").off();
}

function loadConfig() {
  // 文案配置
  loadSpecConfig(function (data) {
    document.title =
      data.backendSystemName || config.pca_city + "疫情防控登记系统";
    $(".header-title").text(document.title);

    window.config = {
      pca_province: data['fk.register.area.province'],
      pca_city: data['fk.register.area.city'],
    };

    // 接受地址栏参数
    const id = getQuery("id");
    if (id) {
      manageUserId = id;
      // 进行编辑状态
      $("#btn-submit-form").text("修改");
      $("#breadcrumbText").text("编辑用户");
      fetchInitialData(function(){
        manageUserEdit(id)
      });
    } else {
      // 进行创建状态
      $("#btn-submit-form").text("创建");
      $("#breadcrumbText").text("新建用户");
      showBtnAndBindEvent();
      bindUserTypeEvent();
      fetchInitialData();
      initFirstRowPCAS();
    }
  })  
}

// 初始化一行所属区域
function initFirstRowPCAS(){
  $("#controlList").find(".controls:not(:first)").remove();
  let dom = $("#controlList").find(".controls")[0];
  initPCAS(dom, window.config.pca_province, window.config.pca_city, true);
  changeAddSubBtnStatus();
}

function initPCAS(dom, provinceValue, cityValue, fetchStationFlag) {
  let provinces = $(dom).find("[name='manageProv']");
  let cityData = [];

  if (provinceValue) {
    userManagerPca.map(_item => {
      if(_item.value === provinceValue){
        cityData = _item.child;
        $(provinces).html(`
          <option value='${_item.value}'>${_item.value}</option>
        `);
      }
    }); 
    provinces.val(provinceValue);
    p_change(provinces, "请选择城市", '请选择区（县）', '请选择乡镇（街道）');
  }
  let city = $(dom).find("[name='manageCity']")
  if (cityValue && cityData) {
    cityData.map(_item => {
      if(_item.value === cityValue){
        $(city).html(`
          <option value='${_item.value}'>${_item.value}</option>
        `);
      }
    }); 
    city.val(cityValue);
    c_change(city.get(0), '请选择区（县）', '请选择乡镇（街道）')
    if(fetchStationFlag){
      getStaionListByCDS({
        suborCity: cityValue || '',
        suborDistrict: '',
        suborStreet: '',
        stationRowDom: dom,
        stationId: '',
      })
    }
  }
}

//进入编辑获取详情
function manageUserEdit(id) {
 //详情接口请求
  showLoading(true);
  $.ajax({
    type: "POST",
    url: `/api/power/detail?id=${id}`,
    //timeout: 300,
    async: true, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: function (res) {
      showLoading(false);
      if (!res.isError) {
        let data = res.data || {};
        currentData = data;
        readonlyControl(data) 
        restoreEditData(data);
      } else {
        message("error", "查询失败,请重试!");
      }
    },
    error: function (err) {
      showLoading(false);
      if (err.statusCode == 401) {
        toLogin();
      } else {
        message("error", "网络异常，请重试");
      }
    }
  });
};

function readonlyControl(data){
  // 当用户编辑自己的账号信息时，权限控制内容禁止编辑;编辑时判断是否是自己 selfFlag: true是，false不是
  let flag = data.selfFlag;
  $('#userinfo-form').find('select').each(
    function(_index, _dom){
      let fieldName = $(_dom).attr('name');
      if(!openAuthFieldList.includes(fieldName)){
        $(_dom).attr('readonly', flag);
        $(_dom).find('option').attr('disabled', flag);
      }
    }
  )
  $('#userinfo-form').find('input').each(
    function(_index, _dom){
      let fieldName = $(_dom).attr('name');
      let type = $(_dom).attr('type');
      if(!openAuthFieldList.includes(fieldName)){
        $(_dom).attr('readonly', flag);
        if(type === 'checkbox'){
          $(_dom).parent('.checkbox-pretty').attr('readonly', flag);
          checkboxPrettyEvent(flag);
        }
      }
    }
  )
  if(flag === false){
    showBtnAndBindEvent();
    bindUserTypeEvent();
  } else {
    hideBtnAndRemoveEvent();
  }
}

function checkboxPrettyEvent(flag){
  $(".checkbox-pretty").off().on("click", function(event){
    if(flag){
      event.preventDefault();
    }
  })
}

// 编辑数据进行回填
function restoreEditData(data){
  const { userDto = {}, userAreaDtoArr, powerDtoArr } = data;
  // 基本信息回填
  $('#userinfo-form input[name="name"]').val(userDto.name);
  $('#userinfo-form select[name="sex"]').val(userDto.sex);
  $('#userinfo-form select[name="type"]').val(userDto.type);
  $('#userinfo-form input[name="phone"]').val(userDto.phone);
  $('#userinfo-form input[name="idCardNum"]').val(userDto.idCardNum);
  $('#userinfo-form input[name="suborUnit"]').val(userDto.suborUnit);
  
  // 操作权限、数据权限数据回填
  Array.isArray(powerDtoArr) &&
  powerDtoArr.length > 0 &&
  powerDtoArr.forEach(ele => {
    if (ele.type === 0 ){
      $(`#userinfo-form .checkbox-pretty[data-menuId='${ele.menuId}'][data-buttonId='${ele.buttonId}']`)
        .addClass("checked");
    } else{
    //  $(`#userinfo-form select[data-menuId='${ele.menuId}']`).val(ele.range);
      // 其实我觉得这个下拉菜单没有意义还不如个输入框 TODO:
      $(`#userinfo-form select[data-menuId='${ele.menuId}']`).html(`<option value="${ele.range}">${`${ele.range}` === "0" ? "全部数据" : "所属区域数据"}</option>`);
    }
    
  });

  // 省市区、检测站区域回填
  if (Array.isArray(userAreaDtoArr) && userAreaDtoArr.length > 0) {
    let editMenuList = userAreaDtoArr.map((_,index) =>`<div class="controls">
      <select name="manageProv" class="provinces input-medium" onchange="p_change(this, '请选择城市', '请选择区（县）','请选择乡镇（街道）')"
        style="width: 100px;">
        <option value="" disabled selected style="display:none;">请选择省</option>
      </select>
      <select name="manageCity" class="city input-medium" onchange="c_change(this, '请选择区（县）','请选择乡镇（街道）');handleCDSChange(event)" >
        <option value="" disabled selected style="display:none;">请选择城市</option>
      </select>
      <select name="manageDistrict" class="area input-medium" onchange="a_change(this,'请选择乡镇（街道）');handleCDSChange(event)">
        <option value="" disabled selected style="display:none;">请选择区（县)</option>
      </select>
      <select name="manageStreet" class="street input-medium" onchange="handleCDSChange(event)">
        <option value="" disabled selected style="display:none;">请选择乡镇（街道)</option>
      </select>
      <select name="stationId" class="input-medium">
        <option value="" disabled selected>请选择检测站</option>
      </select>
     ${index === 0 ? "<span class='addBtn' id='addBtn'>+</span>" : "<span class='subtrBtn'>-</span>"} 
    </div>`);

    $("#controlList").find(".controls").replaceWith(editMenuList);
    $("#controlList").find(".controls").each(function (_index, _domEle) {
      let currentObj = userAreaDtoArr[_index];
    
      // handleProvinces($(_domEle).find(".provinces"))
      // let provinces = $(_domEle).find("[name='manageProv']")
      // if (currentObj.manageProv) {
      //   provinces.val(currentObj.manageProv);
      //   p_change(provinces.get(0), "请选择城市", '请选择区（县）', '请选择乡镇（街道）')
      // }

      // let city = $(_domEle).find("[name='manageCity']")
      // if (currentObj.manageCity) {
      //   city.val(currentObj.manageCity);
      //   c_change(city.get(0), '请选择区（县）', '请选择乡镇（街道）')

      // }
      initPCAS(_domEle, currentObj.manageProv, currentObj.manageCity);

      let district = $(_domEle).find("[name='manageDistrict']");
      if (currentObj.manageDistrict) {
        district.val(currentObj.manageDistrict);
        a_change(district.get(0), '请选择乡镇（街道）')
      }

      $(_domEle).find("[name='manageStreet']").val(currentObj.manageStreet);
      getStaionListByCDS({
        suborCity: currentObj.manageCity || '',
        suborDistrict: currentObj.manageDistrict || '',
        suborStreet: currentObj.manageStreet || '',
        stationRowDom: _domEle,
        stationId: currentObj.stationId,
      })
    })
    changeAddSubBtnStatus();
  }
  if (String(userDto.type) === "0") {
    $("#controlList select[name='stationId']").removeAttr("disabled")
  } else if (String(userDto.type) === "1"){
    $("#controlList select[name='stationId']").attr("disabled",true);
  } else if(String(userDto.type) === "2"){
    $("#controlList select[name='stationId']").removeAttr("disabled");
  }

  readonlyControl(data);
}

// 对于必填项的校验
function userInfoCheck(data) {
  try {
    
    checkEmpty(data.name, '请输入姓名');
    checkName(data.name, '姓名格式有误');
    checkEmpty(data.sex, '请选择性别');
    checkEmpty(data.type, '请选择人员类型');
    checkEmpty(data.phone, '请输入手机号');
    checkPhone(data.phone, '手机号格式有误');
    checkEmpty(data.idCardNum, '请输入身份证号');
    checkCode(data.idCardNum, '身份证格式有误');
    checkCompanyName(data.suborUnit, "单位名称需在2～20个字内");
    // 当选择检测站管理员类型时，必须选择检测站
    if (data.type === "2" ) {
      $("#controlList").find("select[name='stationId']").each(function (_index, _dom) {
        checkEmpty($(_dom).val(), '请选择检测站')
      });
    }
    // 【山东】--区域管理员，所属区域应控制必填 issue id 6543 （可以填省，省市，省市区等，省不能为空）
    // else if (data.type === "1") {
    //   $("#controlList").find("select[name='manageStreet']").each(function (_index, _dom) {
    //     checkEmpty($(_dom).val(), '请选择乡镇（街道)')
    //   });
    // }

  } catch (error) {
    message("error", error);
    return false;
  }
  return true;
}

// 关闭(返回上一页)
function handleAECancel() {
  // window.history.back();
  window.location.href = '/userManagementPage.html';
}

// 新建/编辑
function handleAEOk(type) {
  let data = qs.parse($("#userinfo-form").serialize());
  // 省市区检测站数据不从表单数据获取
  delete data.manageProv;
  delete data.manageCity;
  delete data.manageDistrict;
  delete data.manageStreet;
  delete data.stationId;

  let paramData = {};

  if(Object.keys(currentData).length > 0 && (currentData.selfFlag === true)){
    let userDto = currentData.userDto;
    let userAreaDtoArr = currentData.userAreaDtoArr;
    let powerDtoArr = currentData.powerDtoArr;
    paramData= {
      // 基本信息
      userDto: {
        name: data.name,
        sex: data.sex,
        type: (userDto.type || userDto.type === 0) ? `${userDto.type}` : '',
        phone: data.phone,
        idCardNum: data.idCardNum,
        suborUnit: data.suborUnit
      },
      // 省市区检测站
      userAreaDtoArr,
      // 操作权限、数据权限
      powerDtoArr,
    };
  } else {
    $('#operateLimits-content').find('.checkbox-pretty.checked').each(function(_index,_dom){
      let name = $(_dom).find('input[type=checkbox]').attr('name');
      data[name] = "on";
    });
    console.log('data',data);
    const powerDtoArr1= operateFormat(data);
    const powerDtoArr2= dataPermissFormat(data);
    const userAreaDtoArr = getAreaAndStationNameList();

    console.log('powerDtoArr1',powerDtoArr1);
    console.log('powerDtoArr2',powerDtoArr2);

    paramData= {
     // 基本信息
     userDto: {
       name: data.name,
       sex: data.sex,
       type: data.type,
       phone: data.phone,
       idCardNum: data.idCardNum,
       suborUnit: data.suborUnit
     },
     // 省市区检测站
     userAreaDtoArr,
     // 操作权限、数据权限
     powerDtoArr: [...powerDtoArr1, ...powerDtoArr2]
   };
  }

  if (!userInfoCheck(paramData.userDto)) {
    return;
  }
  if (type === "edit") {
    paramData.userDto.id = manageUserId;
  }
  console.log("paramData", paramData);

  showLoading(true);
  // 新建/编辑
  $.ajax({
    type: "POST",
    url: type === "edit" ? "/api/power/update" : "/api/power/save",
    data: JSON.stringify(paramData),
    //timeout: 300,
    async: true, //所有请求均为异步。如果需要发送同步请求
    cache: false, //浏览器是否应该被允许缓存GET响应。
    contentType: "application/json",
    withCredentials: true,
    success: function(res) {
      showLoading(false);
      if (res) {
        if (res.isError){
          message("error", res.data);
        }else{
          message("success", "操作成功");
          setTimeout(() => {
            handleAECancel();
          }, 3000); 
        }  
      } else {
        message("error", "操作失败,请重试!");
      }
    },
    error: function(err) {
      showLoading(false);
      if (err.statusCode == 401) {
        toLogin();
      } else {
        message("error", "网络异常，请重试");
      }
    }
  });
}


// 市、区、街道改变
window.handleCDSChange = function(event) {
  let stationRowDom = $(event.target).parent();
  let suborCity = $(stationRowDom).find("[name='manageCity']").val();
  let suborDistrict = $(stationRowDom).find("[name='manageDistrict']").val();
  let suborStreet = $(stationRowDom).find("[name='manageStreet']").val();
  getStaionListByCDS({
    suborCity,
    suborDistrict,
    suborStreet,
    stationRowDom,
  })
}

// 通过 市、区、街道获取检测站信息
function getStaionListByCDS({ suborCity, suborDistrict, suborStreet, stationRowDom, stationId }) {
  if (!stationRowDom) return;
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
        message("error", error);
        return false;
      } else { 
        let optionList = res.data.map((item)=> `<option value=${item.id}>${item.stationName}</option>`);
        let _firstOption = `<option value="" disabled selected style="display:none;">请选择检测站</option>`;
        let allOption = _firstOption.concat(optionList);
        // 当前查询条件下的“检测站“下拉数据渲染
        let stationDom = $(stationRowDom).find("[name='stationId']");
        $(stationDom).html(allOption);
        if (stationId) {
          // 当前检测站值回填
          if(currentData.selfFlag === true){
            if($(stationDom).find(`option[value="${stationId}"]`).length === 0){
              $(stationDom).find('option[value=""]').text('--数据不匹配--');
            } else {
              $(stationDom).val(stationId);
            }
            readonlyControl(currentData);
          } else {
            $(stationDom).val(stationId);
          }
        }
      }
    }
  });
}

// 新建或编辑用户页
$("#btn-submit-form")
  .off()
  .on("click", function(e) {
    let text = $(this).text();
    if (text === "创建") {
      handleAEOk("new");
    } else {
      handleAEOk("edit");
    }
  });

// 取消新建编辑
$("#btn-cancel")
  .off()
  .on("click", function(e) {
    handleAECancel();
  });


//人员类型切换
function bindUserTypeEvent(){
  $("#userType").off().on('change',function(e) {
    // 数据权限的默认值受人员类型影响,且不可修改
    // 管理区域也受人员类型影响,添加区域管理员类型，不能选择检测站;添加检测站管理员类型，必须选择检测站
    if (e.target.value === "0") {
      $("#controlList select[name='stationId']").removeAttr("disabled")
      $("#userinfo-form select[name^='select']").html(`<option value="0">全部数据</option>`);
      superManagerConfig();
    } else if (e.target.value === "1"){
      $("#controlList select[name='stationId']").attr("disabled",true);
      $("#userinfo-form select[name^='select']").html(`<option value="1">所属区域数据</option>`);
      otherManageConfig();
    } else if(e.target.value === "2"){
      $("#controlList select[name='stationId']").removeAttr("disabled");
      $("#userinfo-form select[name^='select']").html(`<option value="1">所属区域数据</option>`);
      otherManageConfig()
    }
    initFirstRowPCAS();
  });
}

function superManagerConfig(){
  $('#operateLimits-content').find('.checkbox-pretty').each(function(_index,_dom){
    $(_dom).addClass('checked');
  });
  $('[name="select-1"]').val('0');
  $('[name="select-2"]').val('0');
  $('[name="select-3"]').val('0');
}

function otherManageConfig(){
  $('#operateLimits-content').find('.checkbox-pretty').each(function(_index,_dom){
    $(_dom).removeClass('checked');
  });
  $('[name="select-1"]').val('1');
  $('[name="select-2"]').val('1');
  $('[name="select-3"]').val('1');
}


// 管理区域添加多个区域
function bindAddEvent(){
  $(".control-group").off().on("click", '#addBtn', function (e) {
  $("#controlList").append(`<div class="controls">
              <select name="manageProv" class="provinces input-medium" onchange="p_change(this, '请选择城市', '请选择区（县）','请选择乡镇（街道）')"
                style="width: 100px;">
                <option value="" disabled selected style="display:none;">请选择省</option>
              </select>
              <select name="manageCity" class="city input-medium" onchange="c_change(this, '请选择区（县）','请选择乡镇（街道）');handleCDSChange(event)" >
                <option value="" disabled selected style="display:none;">请选择城市</option>
              </select>
              <select name="manageDistrict" class="area input-medium" onchange="a_change(this,'请选择乡镇（街道）');handleCDSChange(event)">
                <option value="" disabled selected style="display:none;">请选择区（县)</option>
              </select>
              <select name="manageStreet" class="street input-medium" onchange="handleCDSChange(event)">
                <option value="" disabled selected style="display:none;">请选择乡镇（街道)</option>
              </select>
              <select name="stationId" class="input-medium">
                <option value="" disabled selected>请选择检测站</option>
              </select>
              <span class="subtrBtn">-</span>
            </div>
  `);
  // 初始化新增的省份、检测站数据
  let newDom = $("#controlList").find(".controls").last();
  initPCAS(newDom, window.config.pca_province, window.config.pca_city, true);
  changeAddSubBtnStatus();
  });
}

function changeAddSubBtnStatus() {
  var addBtn = $("#addBtn");
  var subBtn;
  if (addBtn.length ===0) { // 最后一条被删除了
    addBtn = $('<span class="addBtn" id="addBtn">+</span>');
  } else { // 其他被删除了或者添加
    subBtn = addBtn.siblings('.subtrBtn');
    if (subBtn.length ===0) {
      $('<span class="subtrBtn">-</span>').insertAfter(addBtn);
    }
    addBtn.remove();
  }

  var allStations = $("#controlList").find(".controls");
  var lastStation = $("#controlList").find(".controls").last();
  subBtn = lastStation.find(".subtrBtn");
  addBtn.insertBefore(subBtn);

  if (allStations.length === 1) {
    subBtn.remove();
  }
}

// 删除添加的区域
function bindRemoveEvent(){
$("#controlList").off().on("click", ".controls .subtrBtn", function (e) {
  $(this).parent().remove();
  changeAddSubBtnStatus();
});
}


  // 操作权限数据format
function operateFormat(data){
  const powerDtoArr1 = Object.keys(data)
    .filter(item => item.includes("checkbox"))
    .map(item => ({
      type: 0,
      range: "",
      menuId: $(`#userinfo-form input[name=${item}]`).parent('.checkbox-pretty.checked').attr("data-menuId"),
      buttonId: $(`#userinfo-form input[name=${item}]`).parent('.checkbox-pretty.checked').attr("data-buttonId")
    }));

  return powerDtoArr1;
}

// 数据权限数据format
function dataPermissFormat(data) {
  const powerDtoArr2 = Object.keys(data)
   .filter(item => item.includes("select"))
   .map(item => ({
    type: 1,
    range: data[item],
    menuId: $(`#userinfo-form select[name=${item}]`).attr("data-menuId"),
    buttonId: ""
  }));
  return powerDtoArr2
}

// 获取多个省市区及检测站表单数据
function getAreaAndStationNameList() {
  let arr = [];
  $("#controlList").find(".controls").each(function (_index, _dom) {
    let manageProv = $(_dom).find("[name='manageProv']").val();
    let manageCity = $(_dom).find("[name='manageCity']").val();
    let manageDistrict = $(_dom).find("[name='manageDistrict']").val();
    let manageStreet = $(_dom).find("[name='manageStreet']").val();
    let stationId = $(_dom).find("[name='stationId']").val();
    if (manageProv){
      arr.push({
        manageProv,
        manageCity,
        manageDistrict,
        manageStreet,
        stationId
      });
    }
  })
  return arr;
}


// 获取后端返回的字典数据
function getLocationInfo(){
  return new Promise(function(resolve, reject){
    $.ajax({
      url: "/api/cuser/getAreaListByUser",
      type: "GET",
      async: false, //所有请求均为异步。如果需要发送同步请求
      contentType: "application/json",
      cache: false,
      success: function (res) {
        if (res.error) {
          message("error", error);
          reject();
        } else {
          userManagerPca = res.data || [];
          resolve();
        }
      },
      error: function (err) {
        message("error", '地区信息获取失败'); 
      }
    });
  })
}

// 获取可操作权限列表
function getOperateLimits() {
  return new Promise(function(resolve, reject){
    $.ajax({
      url: "/api/managePower/selectButtonByUserAll",
      type: "GET",
      async: true, //所有请求均为异步。如果需要发送同步请求
      contentType: "application/json",
      cache: false,
      success: function(res) {
        if (res.error) {
          message("error", error);
          reject();
        } else {
          if (res.data && res.data.length > 0){
              $("#operateLimits-content").html(
                template("operateLimits-template", res.data)
              );
          } else {
              $("#operateLimits-content").html(
                '<div>暂无数据</div>'
              );
          }
          resolve();
        }
      },
      error: function(err) {
        message("error", "操作权限获取失败");
        reject();
      }
    });
  });
}

/* 省市区街道联动切换 */
function handleProvinces(_domEle) {
  userManagerPca.map(_item => {
    $(_domEle).each((_index, _dom) => {
      $(_dom).append(`
        <option value='${_item.value}'>${_item.value}</option>
      `);
    });
  }); 
};


window.p_change = (select, cityHint, areaHint, streetHint) => {
  cityHint = cityHint || "市（必填）";
  areaHint = areaHint || "区（必填）";
  streetHint = streetHint || "乡镇（街道)";
  // 市区清空
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
  let city = userManagerPca.find(_item => {
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
  let pName = $(select)
    .parent()
    .find(".provinces")[0].value; // 获取这个省的名字
  let city = userManagerPca.find(_item => {
    return _item.value === pName;
  });

  if (!city) {
    return;
  }
  let area = city.child.find(_item => {
    return _item.value === $(select).val();
  });
  if (!area) {
    return;
  }
  area.child.map(_item => {
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
  let province = userManagerPca.find(_item => {
    return _item.value === pName;
  });

  if (!province) {
    return;
  }
  let cName = $(select)
    .parent()
    .find(".city")[0].value; // 获取这个市的名字
  let city = province.child.find(_item => {
    return _item.value === cName;
  });

  if (!city) {
    return;
  }
  let area = city.child.find(_item => {
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
/* 省市区街道联动切换 */




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
    success: function (res) {
      $(".header-user .user-info").html(res.data.username);
      userInfo = res.data;
      userInfo.watermarkConfig = {
        watermark_txt: `${res.data.username || ""}${
          res.data.phone ? "，" : ""
        }${res.data.phone || ""}`,
        watermark_width: 200
      };
     /*初始化水印*/
      watermark.init(userInfo.watermarkConfig);
    /** @desc 根据登录用户类型对选择人员类型、添加编辑用户操作做权限限制 */
      switch (userInfo.type) {
        case "超级管理员":
          break;
        case "区域管理员":
          $("#userType").find("option:contains('超级管理员')").remove();
          break;
        case "检测站管理员":
          $("#userType").attr("disabled", true);
          $("#btn-submit-form").attr("disabled", true)    
          break;
        default:
          break;
      }
     
    },
    error: toLogin
  });
}

function bindLogoutEvent() {
  $("#logout").click(function () {
    window.logOutRequest();
  });
}
})();
