var MOCK = false;
var IP = MOCK ? 'http://120.26.58.230' : '';
var PORT = MOCK ? ':9090' : '';
var token = window.getCookie ? window.getCookie("access_token") : '';

window.loadSpecConfig = function(onSuccess, onFail, paramName, loadBtnAuth, loadBtnAuthSuccess) {
  function showLoading() { // todo? 这里可能有bug
    $.showPreloader && $.showPreloader();
  }

  function hideLoading() {
    $.hidePreloader && $.hidePreloader();
  }

  function _loadConfigSuccess(res){
    var allConfig = res || [];
    var configMap = res.reduce(function(config, item) {
      config[item.paramName] = item.paramValue;
      return config;
    }, {});
    onSuccess(configMap);
    hideLoading();
  }

 showLoading();

 // 加载配置
 console.log(`${IP}${PORT}`)
  $.ajax({
    type: 'GET',
    url: `${IP}${PORT}/api/system/conf/query`, // 不需要token
    data: { paramName: paramName || '' },
    cache: false, //浏览器是否应该被允许缓存GET响应。
    success: function(res) {
      if (!loadBtnAuth) {
        _loadConfigSuccess(res);
      } else if(token){
        $.ajax({
          type: 'GET',
          url: 
            '/api/managePower/selectButtonsByUserId?access_token=' +
            token, // 后台管理接口，需要token
          cache: false, //浏览器是否应该被允许缓存GET响应。
          success: function (resp) {
            if (!resp.error) {
              window.btnAuth = resp.data;
              if (loadBtnAuthSuccess && typeof loadBtnAuthSuccess === 'function') {
                loadBtnAuthSuccess(resp.data);
              }
            } else {
              window.btnAuth = {};
            }
          },
          error: function () {
            window.btnAuth = {};
          },
          complete: function () {
            _loadConfigSuccess(res);
          }
        })
      }
    },
    error: function(err) {
      hideLoading();
      onFail ||
        (function() {
          $.toast && $.toast('信息获取失败!');
        })();
    }
  });
};


window.loadArea = function(onSuc, onErr) {
  $.ajax({
    type: "GET",
    url: `${IP}${PORT}/api/cuser/getAreaInfo`, // 不需要token
    async: false,
    dataType: "json",
    cache: false,
    success: function(res) {
      var data = res.data[0].child;
      var area = {};
      area.pca = data;
      onSuc(area);
    },
    error: function(err) {
      onErr ||
        (function() {
          $.toast && $.toast("地区信息获取失败!");
        })();
    }
  });
};


// 检测站 所属区域
window.loadStationArea = function(onSuc, onErr) {
   $.ajax({
    type: "GET",
    url: `${IP}${PORT}/api/cuser/getAreaListByUser`, // 不需要token
    async: false,
    dataType: "json",
    cache: false,
    success: function(res) {
      var data = res.data;
      var area = {};
      area.pca = data;
      onSuc(area);
    },
    error: function(err) {
      onErr ||
        (function() {
          $.toast && $.toast("地区信息获取失败!");
        })();
      }
  });
}

window.logOutRequest = function(){
  function _logoutNow(){
    setCookie("access_token", "", -1);
    location.replace("./login.html");
  }
  $.ajax({
    type: 'GET',
    url: '/api/cuser/loginOut',
    cache: false, //浏览器是否应该被允许缓存GET响应。
    complete: function() {
      _logoutNow();
    }
  });
}

window.loginPageLogOutRequest = function(callback){
  callback = callback || function() { };
  function _logoutNow(){
    setCookie("access_token", "", -1);
    callback();
  }
  $.ajax({
    type: 'GET',
    url: ' /api/cuser/session/invalid',
    cache: false, //浏览器是否应该被允许缓存GET响应。
    complete: function() {
      _logoutNow();
    }
  });
}
