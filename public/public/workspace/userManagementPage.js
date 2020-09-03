(function () {
  // 全局变量
  var token;
  var currentPage = 1;
  var pageSize = 20;
  // 日志模块
  var logTableCurrentPage = 1;
  var logTablePageSize = 20;
  // 0-超级管理员、1-区域管理员、2-检测站管理员'
  let userManagerPca = [];
  var PERSONNEL_TYPE = [
    {
      id: 0,
      name: '超级管理员',
    },
    {
      id: 1,
      name: '区域管理员',
    },
    {
      id: 2,
      name: '检测站管理员',
    },
  ]
  var userInfo = {};

  function loadUser(token) {
    $.ajax({
      url: httpPrefix + `/api/user/queryUserInfo?access_token=${token}`,
      withCredentials: true,
      success: function (res) {
        $(".header-user .user-info").html(res.data.username);
        userInfo = res.data;
        userInfo.watermarkConfig = {
          watermark_txt: `${res.data.username||""}${res.data.phone?"，":""}${res.data.phone||""}`,
          watermark_width: 200
        }
        if (res.data.type === "超级管理员") {
          $("#epidemic").show();
        } else {
          $("#epidemic").hide();
        }
        /*初始化水印*/
        watermark.init(userInfo.watermarkConfig);
      },
      error: ajaxError,
    });
  }

  function init() {
    loadConfig();
    bindLogoutEvent();
  }

  function showBtnAndBindEvent(){
    $('#addBtn').show();
    $('#addMidBtn').show();
    $('.controls .subtrBtn').each(function(_index, _dom){
      return $(_dom).show();
    })
    bindAddEventHighRisk();
    bindAddEventMiddleRisk();
    bindRemoveEvent();
  }

  function triggerMaskLoadAgain(){
    if(userInfo&&userInfo.watermarkConfig){
      watermark.load(userInfo.watermarkConfig);
    }
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

      getLocationInfo();

      // 人员类型下拉选项配置
      var optionStringForSearch = "";
      PERSONNEL_TYPE.forEach(function (item) {
        optionStringForSearch += `<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0);" value="${item.id}">${item.name}</a></li>`;
      });
      if (optionStringForSearch) {
        $("#personnelTypeForSearch").append(optionStringForSearch);
      }
      showBtnAndBindEvent();
      userManagePageInit();
      logTablePageInit();
      getLocationInfo();
      epidemicAreaInit();
      changeAddSubBtnStatus();
      changeAddSubBtnStatusMidRisk();
    }, '', '', true, loadBtnAuthSuccess);
  }

  function initPCA(dom, provinceValue, cityValue, districtValue) {
    let provinces = $(dom).find("[name='epidemicProv']");
    let cityData = [];
    let districtData = [];

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
      p_change(provinces, "请选择城市", '请选择区（县）');
    }
    let city = $(dom).find("[name='epidemicCity']")
    if (cityValue && cityData) {
      cityData.map(_item => {
        if(_item.value === cityValue){
          districtData = _item.child;
          $(city).html(`
          <option value='${_item.value}'>${_item.value}</option>
        `);
        }
      });
      city.val(cityValue);
      c_change(city.get(0), '请选择区（县）')
    }
    let district = $(dom).find("[name='epidemicDistrict']")
    if (districtValue && districtData) {
      districtData.map(_item => {
        if(_item.value === districtValue){
          $(district).html(`
          <option value='${_item.value}'>${_item.value}</option>
        `);
        }
      });
      district.val(districtValue);
      a_change(district.get(0))
    }
  }

  function loadBtnAuthSuccess(data){
    window.btnAuth = data;
    searchEventBind();
  }

  function userManagePageInit() {
    resetSelect();
    initPagination(0);
    queryData();
    searchEventBind();
  }

  function resetSelect() {
    $("#personnelType")
      .siblings("span")
      .text("全部");
  }

  function searchEventBind() {
    $("#resetBtn").bind("click", function () {
      $("#userManage .search-zone .detail-filter input").val("");
      $("#userManage .search-zone .dropdown-inner a span").text("");
      resetSelect();
      queryData();
    });
    $("#searchBtn").bind("click", function () {
      currentPage = 1;
      queryData();
    });
    if(window.btnAuth['用户']){
      if(window.btnAuth['用户'].includes('新建')){
        $("#addUserBtn").show();
        $("#addUserBtn").off().on("click", function () {
          // 进入新增详情页
          window.location.href ="/userAddEdit.html";
        });
      }
      if(window.btnAuth['用户'].includes('删除')){
        $("#deleteBtn").show();
        $("#deleteBtn").off().on("click", function () {
          handleBatchDelete();
        })
      }
    }
  }

  function queryData() {
    var params = {};
    params.current = currentPage;
    params.size = pageSize;
    // 查询项值
    params.name = $("#name").val();
    params.phone = $("#phone").val();
    params.type = $("#personnelType").val();
    fetchListData(params);
  }


  function renderPageExtra(num) {
    $("#userManage .pagination-content .pagination-extra .label").html(num);
  }

  // 列表渲染
  function renderList(data) {
    var auth = {
      '状态': false,
      '编辑': false,
      '删除': false,
    };
    window.btnAuth['用户'] && window.btnAuth['用户'].forEach(item => {
      auth[`${item}`] = true;
    })
    var content = "";
    if (!data.length) {
      content = '<div style="text-align: center;">暂无数据</div>';
    } else {

      data.map(item => {
        let personnelTypeName = (PERSONNEL_TYPE.find(function (_item) {
          return _item.id === item.type;
        }) || {}).name;

        let optionBtn = '';
        auth["编辑"] && (optionBtn += `<a href="/userAddEdit.html?id=${item.id}" class="sui-btn btn-link table-option">编辑</a>`); 
        auth["删除"] && (optionBtn += ` <a href="javascript:void(0);" data-id=${item.id} data-placement="top" data-trigger="click" data-type="confirm" data-toggle="tooltip" data-title="是否确定删除本条记录" class="sui-btn btn-link table-option btn-delete">删除</a>`);

        content += `
        <tr>
          <td class="width:5%;" style="position:relative;">
            <label class="checkbox" for="checkbox-${item.id}"
            style="position:absolute;top:0;right:0;left:0;bottom:0;display:flex;
            align-items:center;justify-content:center;">
              <input type="checkbox" data-id="${item.id}" class="list-td-checkbox" id="checkbox-${item.id}" />
            </label>
          </td>
          <td class="td-id"><div class="tp" data-placement="top" data-toggle="tooltip" title="${
          item.id
          }">${item.id}</div></td>
          <td style="width:10%;">${item.name || '-'}</td>
          <td style="width:10%;word-break:break-all;">${item.phone || '-'}</td>
          <td>${item.sex === 0 ? '男' : item.sex === 1 ? '女' : '-'}</td>
          <td style="width:12%;word-break:break-all;">${item.idCardNum || '-'}</td>
          <td>${personnelTypeName}</td>

          <td style="width:8%">
            <div class="Switch">
              <input type="checkbox" ${!auth["状态"] && "disabled"} ${item.status === 0 ? 'checked' : ''} data-type="${item.status}" data-id="${item.id}" />
              <label for="switch-${item.id}" class="switch-label" data-type="${item.status}" data-id="${item.id}">
                <em class="switch-label-em" data-type="${item.status}" data-id="${item.id}"></em>
              </label>
            </div>
          </td>

          <td style="width:13%;word-break:break-all;">${item.createTime || '-'}</td>
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
    $("#userManage .tbody-list").html(content);
    $(".btn-delete").tooltip({
      okHide: function () {
        handleDelete(this);
      }
    });
    $("#userManage .tbody-list .td-id div").tooltip();
    if(auth["状态"]){
      $("#userManage .switch-label").off().on("click",function(event){
        let checkboxDom = $(event.target).siblings('input[type="checkbox"]');
        handleSwitch(event, checkboxDom);
      })
      $("#userManage .switch-label-em").off().on("click",function(event){
        let checkboxDom = $(event.target).parent().siblings('input[type="checkbox"]');
        handleSwitch(event, checkboxDom);
        event.stopPropagation();
      })
    }

    $("#list-th-checkbox").off().on("click",function(event){
      $("#userManage .list-td-checkbox").each(function(_index,_dom){
        _dom.checked = event.target.checked;
      })
    })

    triggerMaskLoadAgain();
  }

  function handleSwitch(event, checkboxDom){
    let curType = $(event.target).attr("data-type");
    let curId = $(event.target).attr("data-id");
    // 当前状态正常
    if(curType === '0') {
      $(checkboxDom).prop("checked", false);
      handleDisable(curId)
    }else if(curType === '2'){// 当前状态禁用
      $(checkboxDom).prop("checked", true);
      handleEnable(curId)
    } else {
      event.preventDefault();
    }
  }

  function handleEnable(id) {
    token = getCookie("access_token");
    showLoading(true);
    $.ajax({
      type: "get",
      url: '/api/power/enable?access_token=' + token,
      data: { id },
      async: true, //所有请求均为异步。如果需要发送同步请求
      cache: false,
      withCredentials: true,
      success: function(res) {
        if (res && !res.isError) {
          queryData();
          message("success", "启用成功");
        }
      },
      error: ajaxError
    });
  }
  function handleDisable(id) {
    token = getCookie("access_token");
    showLoading(true);
    $.ajax({
      type: "get",
      url: '/api/power/disable?access_token=' + token,
      data: { id },
      async: true, //所有请求均为异步。如果需要发送同步请求
      cache: false,
      withCredentials: true,
      success: function(res) {
        if (res && !res.isError) {
          queryData();
          message("success", "禁用成功");
        }
      },
      error: ajaxError
    });
  }

  
  function handleDelete(e) {
    var id = $(e).attr("data-id");
    e.tooltip("hide");
  
    showLoading(true);
    $.ajax({
      type: "get",
      url: '/api/power/delete',
      data: { id },
      async: true, //所有请求均为异步。如果需要发送同步请求
      cache: false,
      withCredentials: true,
      success: function(res) {
        if (res && !res.isError) {
          queryData();
          message("success", "删除成功");
        }
      },
      error: ajaxError
    });
  }
  function handleBatchDelete() {
    let ids=[];
    $("#userManage .list-td-checkbox").each(function(_index,_dom){
      if(_dom.checked){
        let id = $(_dom).attr("data-id");
        ids.push(id);
      }
    })
    if(ids.length === 0) return message("error", "请选择待删除的内容");
    showLoading(true);
    $.ajax({
      type: "post",
      url: '/api/power/deleteBatch',
      data: JSON.stringify(ids),
      contentType: 'application/json',
      async: true, //所有请求均为异步。如果需要发送同步请求
      withCredentials: true,
      success: function(res) {
        if (res && !res.isError) {
          queryData();
          message("success", "批量删除成功");
        }
      },
      error: ajaxError
    });
  }

  // 列表请求
  function fetchListData(params) {
    token = getCookie("access_token");
    showLoading(true);
    $.ajax({
      type: "get",
      // url: '/api/power/page',
      url: '/api/power/page?access_token='+ token,
      cache: false,
      data: params,
      success: function (res) {
        let data = res.data.data || [];
        let total = res.data.total || 0;
        $("#userManage .pagination-content .pagination").pagination(
          "updateItemsCount",
          total,
          currentPage
        );
        $("#userManage .pagination-content .pagination").pagination(
          "updatePages",
          parseInt((total - 1) / pageSize) + 1,
          currentPage
        );
        renderPageExtra(total);
        showLoading(false);
        renderList(data);
        if($("#list-th-checkbox").prop("checked")){
          $("#list-th-checkbox").click();
        }
      },
      error: function (err) {
        showLoading(false);
        if (err.statusCode == 401) {
          toLogin();
        } else {
          message("error", "网络异常，请重试");
          renderList([]);
        }
      }
    });
  }


  function initPagination(itemsCount) {
    $("#userManage .pagination-content .pagination").pagination({
      itemsCount: itemsCount,
      currentPage: currentPage,
      pageSize: pageSize,
      styleClass: ["pagination-large"],
      showCtrl: true,
      displayPage: 6,
      onSelect: handlePageChange
    });
    renderPageExtra(itemsCount);
    $("#pageSizeChange").change(function (e) {
      pageSize = $(e.currentTarget).val();
      currentPage = 1;
      queryData();
    });
  }

  function handlePageChange(page) {
    currentPage = page;
    queryData();
  }

  function bindLogoutEvent() {
    $("#logout").click(function () {
      window.logOutRequest();
    });
  }

  function ajaxError(err){
    showLoading(false);
    if (err.status == 401) {
      toLogin();
      message("error", err.responseText);
    } else {
      message("error", "网络异常，请重试");
    }
  }

  function toLogin() {
    message("error", "请重新登录");
    setTimeout(() => {
      window.logOutRequest();
    }, 1000);
  }

  window.onload = () => {
    token = getCookie("access_token");
    if (!token) {
      window.logOutRequest();
    }
    loadUser(token);
    init();
  };
  // 导航标签切换
  window.onTabNavClick = function(tab) {
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
      .find(".tab-pane.active")
      .removeClass("active");
    $(contentId).addClass("active");
    // 切换页签，更新水印
    if(userInfo.watermarkConfig){
      watermark.load(userInfo.watermarkConfig);
    }
    $('.breadcrumb-item').text($(tab).text());
  }
  // 日志记录
  function logTablePageInit() {
    initLogTablePagination(0);
    queryLogTableData();
    logTableSearchEventBind();
  }
  function initLogTablePagination(itemsCount) {
    $("#logTable .pagination-content .pagination").pagination({
      itemsCount: itemsCount,
      currentPage: logTableCurrentPage,
      pageSize: logTablePageSize,
      styleClass: ["pagination-large"],
      showCtrl: true,
      displayPage: 6,
      onSelect: handleLogTablePageChange,
    });
    renderLogTablePageExtra(itemsCount);
    $("#log-pageSizeChange").change(function (e) {
      logTablePageSize = $(e.currentTarget).val();
      logTableCurrentPage = 1;
      queryLogTableData();
    });
  }
  function queryLogTableData() {
    var params = {};
    var temp;
    /*
    params.current = logTableCurrentPage;
    params.size = logTablePageSize;
    */
    params.page = logTableCurrentPage;
    params.pageSize = logTablePageSize;
    // 查询项值
    params.account = $("#log-account").val();
    temp = $("#logTable-date .startDate").val();
    params.startTime = temp ? temp + ":00" : temp;
    temp = $("#logTable-date .endDate").val();
    params.endTime = temp ? temp + ":00" : temp;
    fetchLogTableListData(params);
  }

  function logTableSearchEventBind() {
    $("#log-searchBtn").bind("click", function () {
      logTableCurrentPage = 1;
      queryLogTableData();
    });
    $("#logTable-date.input-daterange")
      .datepicker({
        // 日期组件初始化
        endDate: getNowFormatDate(),
        format: "yyyy-mm-dd",
        Multidate: 2,
        size: "small",
        timepicker: true,
        autoclose: false //这里最好设置为false
      });
      // .on("changeDate", handleDateChange);
    $("#log-resetBtn").bind("click", function() {
      $("#logTable .search-zone .detail-filter input").val("");
      logTableCurrentPage = 1;
      queryLogTableData();
    });
  }
  function handleLogTablePageChange(page) {
    logTableCurrentPage = page;
    queryLogTableData();
  }

  function renderLogTablePageExtra(num) {
    $("#logTable .pagination-content .pagination-extra .label").html(num);
  }
  function fetchLogTableListData(params) {
    token = getCookie("access_token");
    showLoading(true);
    $.ajax({
      type: "post",
      url: '/api/operation/log/list?access_token='+ token,
      cache: false,
      contentType: 'application/json',
      data: JSON.stringify(params),
      success: function (res) {
        let data = res.data || [];
        let total = res.total || 0;
        $("#logTable .pagination-content .pagination").pagination(
          "updateItemsCount",
          total,
          logTableCurrentPage,
        );
        $("#logTable .pagination-content .pagination").pagination(
          "updatePages",
          parseInt((total - 1) / logTablePageSize) + 1,
          logTableCurrentPage
        );
        renderLogTablePageExtra(total);
        showLoading(false);
        renderLogTableList(data);
      },
      error: function (err) {
        showLoading(false);
        if (err.statusCode == 401) {
          toLogin();
        } else {
          message("error", "网络异常，请重试");
          renderLogTableList([]);
        }
      }
    });
  };
  function renderLogTableList(data) {
    var content = "";
    if (!data.length) {
      content = '<div style="text-align: center;">暂无数据</div>';
    } else {
      data.map(item => {

        content += `
        <tr>
          <td>${item.id}</td>
          <td>${item.phone}</td>
          <td>${item.name}</td>
          <td>${item.operationTime}</td>
          <td>${item.operationDesc}</td>
        </tr>
      `;
      });
    }
    $("#logTable .tbody-list").html(content);

    triggerMaskLoadAgain();
  }

  // 初始化重点疫区
  var HighRiskDomesticArr = [];
  var MiddleRiskDomesticArr = [];
  var abroadArr = [];
  function epidemicAreaInit() {
    token = getCookie("access_token");
    $.ajax({
      url: "/api/epidemicAreas/list?access_token="+ token,
      type: "GET",
      async: false, //所有请求均为异步。如果需要发送同步请求
      contentType: "application/json",
      cache: false,
      success: function (res) {
        if (res && !res.isError) {
          let data = res.data || [];
          abroadEpidemicAreaInit(data);
        }
      },
      error: function (err) {
        message("error", err);
      }
    });
  }

  function abroadEpidemicAreaInit(abroadEpidemicArea) {
    abroadEpidemicArea && abroadEpidemicArea.map(_item => {
      // 疫区类型："0"-国内、"1"-国外
      if (_item.epidemicCountryType === '0') {
        if (_item.riskLevel === 2) {
          MiddleRiskDomesticArr.push(_item)
        } else {
          HighRiskDomesticArr.push(_item);
        }
      } else {
        abroadArr.push(_item);
      }
    });
    // 国外地区回填
    abroadBackfill (abroadArr);

    // 高风险国内地区回填
    HighRiskDomesticBackfill (HighRiskDomesticArr);

    // 中风险国内地区回填
    MiddleRiskDomesticBackfill (MiddleRiskDomesticArr);
  }

  // 国外地区回填
  function abroadBackfill (abroadArr) {
    if (abroadArr && abroadArr.length > 0) {
      $("#abroad-content").html(
        template("epidemicAreaList-template", { model: abroadArr })
      );
    }
    abroadArr.forEach(ele => {
      if (ele.status === 0 ){
        $(`input[name='${ele.epidemicCountry}']`).prop("checked", true);
        $(`#abroad-content .checkbox-pretty[data-menuId='${ele.epidemicCountry}']`).addClass("checked");
      }
    });
  }

  // 高风险国内地区回填
  function HighRiskDomesticBackfill (domesticArr) {
    if (domesticArr && domesticArr.length > 0) {
      let editMenuList = domesticArr.map((_,index) =>`<div class="controls">
        <select name="epidemicProv" class="provinces input-medium" onchange="p_change(this, '请选择城市', '请选择区（县）','请选择乡镇（街道）')"
          style="width: 100px;">
          <option value="" disabled selected style="display:none;">请选择省</option>
        </select>
        <select name="epidemicCity" class="city input-medium" onchange="c_change(this, '请选择区（县）','请选择乡镇（街道）')" >
          <option value="" disabled selected style="display:none;">请选择城市</option>
        </select>
        <select name="epidemicDistrict" class="area input-medium" onchange="a_change(this,'请选择乡镇（街道）')">
          <option value="" disabled selected style="display:none;">请选择区（县)</option>
        </select>
        ${index === 0 ? "<span class='addBtn' id='addBtn'>+</span>" : "<span class='subtrBtn'>-</span>"} 
        </div>`);
      $("#controlList").find(".controls").replaceWith(editMenuList);
      $("#controlList").find(".controls").each(function (_index, _domEle) {
        let currentObj = domesticArr[_index];
        initPCA(_domEle, currentObj.epidemicProv, currentObj.epidemicCity, currentObj.epidemicDistrict);
      });
      changeAddSubBtnStatus();
    }
  }

  // 中风险
  function MiddleRiskDomesticBackfill (domesticArr) {
    if (domesticArr && domesticArr.length > 0) {
      let editMenuList = domesticArr.map((_,index) =>`<div class="controls">
        <select name="epidemicProv" class="provinces input-medium" onchange="p_change(this, '请选择城市', '请选择区（县）','请选择乡镇（街道）')"
          style="width: 100px;">
          <option value="" disabled selected style="display:none;">请选择省</option>
        </select>
        <select name="epidemicCity" class="city input-medium" onchange="c_change(this, '请选择区（县）','请选择乡镇（街道）')" >
          <option value="" disabled selected style="display:none;">请选择城市</option>
        </select>
        <select name="epidemicDistrict" class="area input-medium" onchange="a_change(this,'请选择乡镇（街道）')">
          <option value="" disabled selected style="display:none;">请选择区（县)</option>
        </select>
        ${index === 0 ? "<span class='addBtn' id='addMidBtn'>+</span>" : "<span class='subtrBtn'>-</span>"} 
        </div>`);
      $("#controMiddleList").find(".controls").replaceWith(editMenuList);
      $("#controMiddleList").find(".controls").each(function (_index, _domEle) {
        let currentObj = domesticArr[_index];
        initPCA(_domEle, currentObj.epidemicProv, currentObj.epidemicCity, currentObj.epidemicDistrict);
      });
      changeAddSubBtnStatusMidRisk();
    }
  }


  // 国外重点疫区设置
  window.addCountry = function() {
    $("#myModal-create").modal("show");
  };

  window.closeBtn = function() {
    $("#country").val("");
    $("#myModal-create").modal("hide");
  };

  $("#submitCountry").on("click", function(e) {
    var countryName = $.trim($("#country").val());
    let params = {};
    params.epidemicCountryType = "1";
    params.epidemicCountry = countryName;
    abroadArr.push(params);
    $("#abroad-content").html(
      template("epidemicAreaList-template", { model: abroadArr })
    );
    abroadBackfill (abroadArr);
    closeBtn();
  });

  // 高风险---国内重点疫区设置
  function bindAddEventHighRisk(){
    $(".control-group").off().on("click", '#addBtn', function (e) {
      $("#controlList").append(`<div class="controls">
          <select name="epidemicProv" class="provinces input-medium" onchange="p_change(this, '请选择城市', '请选择区（县）','请选择乡镇（街道）')"
            style="width: 100px;">
            <option value="" disabled selected style="display:none;">请选择省</option>
          </select>
          <select name="epidemicCity" class="city input-medium" onchange="c_change(this, '请选择区（县）','请选择乡镇（街道）')" >
            <option value="" disabled selected style="display:none;">请选择城市</option>
          </select>
          <select name="epidemicDistrict" class="area input-medium" onchange="a_change(this,'请选择乡镇（街道）')">
            <option value="" disabled selected style="display:none;">请选择区（县)</option>
          </select>
          <span class="subtrBtn">-</span>
        </div>
      `);
      let optionList = `<option value='' disabled selected style='display:none;'>省（必填）</option>`;
      userManagerPca &&
      userManagerPca.map((_item) => {
        optionList += ` <option value='${_item.value}'>${_item.value}</option>`;
      });
      $("#controlList").find(".controls").find('[name=epidemicProv]').last().html(optionList);
      changeAddSubBtnStatus();
    });
  }

  // 中风险
  function bindAddEventMiddleRisk () {
    $(".middle-control").off().on("click", '#addMidBtn', function (e) {
      $("#controMiddleList").append(`<div class="controls">
          <select name="epidemicProv" class="provinces input-medium" onchange="p_change(this, '请选择城市', '请选择区（县）','请选择乡镇（街道）')"
            style="width: 100px;">
            <option value="" disabled selected style="display:none;">请选择省</option>
          </select>
          <select name="epidemicCity" class="city input-medium" onchange="c_change(this, '请选择区（县）','请选择乡镇（街道）')" >
            <option value="" disabled selected style="display:none;">请选择城市</option>
          </select>
          <select name="epidemicDistrict" class="area input-medium" onchange="a_change(this,'请选择乡镇（街道）')">
            <option value="" disabled selected style="display:none;">请选择区（县)</option>
          </select>
          <span class="subtrBtn">-</span>
        </div>
      `);
      let optionList = `<option value='' disabled selected style='display:none;'>省（必填）</option>`;
      userManagerPca &&
      userManagerPca.map((_item) => {
        optionList += ` <option value='${_item.value}'>${_item.value}</option>`;
      });
      $("#controMiddleList").find(".controls").find('[name=epidemicProv]').last().html(optionList);
      changeAddSubBtnStatusMidRisk();
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

  function changeAddSubBtnStatusMidRisk() {
    var addMidBtn = $("#addMidBtn");
    var subMidBtn;
    if (addMidBtn.length ===0) {
      addMidBtn = $('<span class="addBtn" id="addMidBtn">+</span>');
    } else {
      subMidBtn = addMidBtn.siblings('.subtrBtn');
      if (subMidBtn.length ===0) {
        $('<span class="subtrBtn">-</span>').insertAfter(addMidBtn);
      }
      addMidBtn.remove();
    }

    var allStationsMid = $("#controMiddleList").find(".controls");
    var lastStationMid = $("#controMiddleList").find(".controls").last();
    subMidBtn = lastStationMid.find(".subtrBtn");
    addMidBtn.insertBefore(subMidBtn);

    if (allStationsMid.length === 1) {
      subMidBtn.remove();
    }
  }

  // 删除添加的区域
  function bindRemoveEvent(){
    $("#controlList").off().on("click", ".controls .subtrBtn", function (e) {
      $(this).parent().remove();
      changeAddSubBtnStatus();
    });

    $("#controMiddleList").off().on("click", ".controls .subtrBtn", function (e) {
      $(this).parent().remove();
      changeAddSubBtnStatusMidRisk();
    });
  }

  // 获取地区
  function getLocationInfo(){
    return new Promise(function(resolve, reject){
      $.ajax({
        url: "/api/cuser/getAreaListByUser",
        type: "GET",
        async: false, //所有请求均为异步。如果需要发送同步请求
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
      .find(".city")[0].value;
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

  $("#btn-submit-form").off().on("click", function(e) {
    token = getCookie("access_token");
    const abroadDtoArr = getAbroadNameList();
    const areaHighDtoArr = getHighRiskAreaNameList();
    const areaMiddleDtoArr = getMiddleRiskAreaNameList();
    $.ajax({
      url: "/api/epidemicAreas/save?access_token="+ token,
      type: "POST",
      async: true, //所有请求均为异步。如果需要发送同步请求
      data: JSON.stringify(abroadDtoArr.concat(areaHighDtoArr).concat(areaMiddleDtoArr)),
      cache: false,
      contentType: "application/json",
      success: function(res) {
        if (res && !res.isError) {
          message("success", "保存成功");
        }
      },
      error: function(err) {
        message("error", "保存失败");
      }
    });
  });

  function getAbroadNameList() {
    let arr = [];
    $('#abroad-content').find('.checkbox-pretty').each(function(_index,_dom){
      if($(_dom).find('input[type=checkbox]').prop('checked')) {
        let name = $(_dom).find('input[type=checkbox]').attr('name');
        arr.push({
          "epidemicCountryType": "1",   // 疫区类型："0"-国内、"1"-国外
          "epidemicCountry": name,      // 国家
          "status": "0",                // 状态，“0”-启用、”1“-未启用（对应于checkbox是否勾选）
          "riskLevel": "1",             // 国内中等风险  riskLevel传2，其他传1
        });
      } else {
        let name = $(_dom).find('input[type=checkbox]').attr('name');
        arr.push({
          "epidemicCountryType":"1",    // 疫区类型："0"-国内、"1"-国外
          "epidemicCountry": name,      // 国家
          "status":"1",                 // 状态，“0”-启用、”1“-未启用（对应于checkbox是否勾选）
          "riskLevel": "1",             // 国内中等风险  riskLevel传2，其他传1
        });
      }
    });
    return arr;
  }

  // 高风险--获取多个省市区
  function getHighRiskAreaNameList() {
    let arr = [];
    $("#controlList").find(".controls").each(function (_index, _dom) {
      let epidemicProv = $(_dom).find("[name='epidemicProv']").val();
      let epidemicCity = $(_dom).find("[name='epidemicCity']").val();
      let epidemicDistrict = $(_dom).find("[name='epidemicDistrict']").val();
      if (epidemicProv){
        arr.push({
          epidemicProv,                 // 省
          epidemicCity,                 // 市
          epidemicDistrict,             // 区
          "epidemicCountryType":"0",    //疫区类型："0"-国内、"1"-国外
          "status":"0",                 //状态，“0”-启用、”1“-未启用（对应于checkbox是否勾选）
          "riskLevel": "1",             // 国内中等风险  riskLevel传2，其他传1
        });
      }
    });
    return arr;
  }

  // 中风险--获取多个省市区
  function getMiddleRiskAreaNameList() {
    let arr = [];
    $("#controMiddleList").find(".controls").each(function (_index, _dom) {
      let epidemicProv = $(_dom).find("[name='epidemicProv']").val();
      let epidemicCity = $(_dom).find("[name='epidemicCity']").val();
      let epidemicDistrict = $(_dom).find("[name='epidemicDistrict']").val();
      if (epidemicProv){
        arr.push({
          epidemicProv,                 // 省
          epidemicCity,                 // 市
          epidemicDistrict,             // 区
          "epidemicCountryType":"0",    //疫区类型："0"-国内、"1"-国外
          "status":"0",                 //状态，“0”-启用、”1“-未启用（对应于checkbox是否勾选）
          "riskLevel": "2",             // 国内中等风险  riskLevel传2，其他传1
        });
      }
    });
    return arr;
  }
})();
