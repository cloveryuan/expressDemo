// var httpPrefix = 'http://101.37.158.195:8089'
var httpPrefix = '';
// var httpPrefix = 'http://120.26.58.230:9090'

$('#login-submit').on('click', function() {
  let data = qs.parse($('#login-form').serialize());
  try {
    checkEmpty(data.phone, "请填写手机号");
    checkPhone(data.phone, "手机号格式有误"); // 校验手机号
    checkEmpty(data.verifyCode, "请填写验证码");
  } catch (error) {
    handleMessage('error', error);
    return false;
  }
  // 登录接口请求
  $.ajax({
    type: 'GET',
    url: httpPrefix + '/oauth/token',
    data: {
      username: data.phone,
      password: data.verifyCode,
      grant_type: 'password',
      client_id: 'client',
      client_secret: 'secret'
    },
    cache: false, //浏览器是否应该被允许缓存GET响应。
    success: function(res) {
      handleSuccessLogin(res);
    },
    error: function(error) {
      handleLoginError(error);
    }
  });
});

// 验证码接口请求
var handleVerifycode = function () {
  let data = qs.parse($('#login-form').serialize());
  let phone = data.phone;
  try {
    checkEmpty(phone, "请填写手机号")
    checkPhone(phone, "手机号格式有误"); // 校验手机号
  } catch (error) {
    handleMessage('error', error);
    return false;
  }
 
  $("#verifycode").addClass("disabled").off();

  $.ajax({
    url: "/api/sendMsg/sendLoginVerifyCode",
    type: 'get',
    data: { mobile: phone },
    success: function (res) {
      if (res.error) {
        handleMessage('error', res.data);
        $("#verifycode").removeClass("disabled").text('获取').on('click', handleVerifycode);
      } else {
        setCount(60);
      }
    }
  });
}
// 验证码等待函数
var setCount = function (c) {
  $("#verifycode").text(c + 's');
  setTimeout(function () {
    if (c > 0) {
      c -= 1;
      setCount(c);
    } else {
      $("#verifycode").removeClass("disabled").text('获取').on('click', handleVerifycode);
    }
  }, 1000);
};
$("#verifycode").on('click', handleVerifycode);

// 登录成功回调
// 登录信息 存入 cookie
// 跳转到 workspace.html
function handleSuccessLogin(res) {
  setCookie('access_token', res.access_token, 3);
  setCookie('refresh_token', res.refresh_token, 3);

  $(window).attr('location', '/workspace.html');
}

// 登录失败回调
function handleLoginError(error) {
  handleMessage('error', "验证码错误");
}

function handleMessage(type, text) {
  let messageTmp = {
    success: `
      <div class="message-wrap">
        <div class="sui-msg msg-success message-content">
          <div class="msg-con">${text ? text : '--'}</div>
          <s class="msg-icon"></s>
        </div>
      </div>
    `,
    error: `
      <div class="message-wrap">
        <div class="sui-msg msg-error message-content">
          <div class="msg-con">${text ? text : '--'}</div>
          <s class="msg-icon"></s>
        </div>
      </div>
    `
  };
  $('body').append(messageTmp[type]);
  window.timeouts = null;
  window.timeouts = setTimeout(function() {
    $('body .message-wrap').remove();
  }, 2500);
}

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
if (window.location.href.indexOf('login.html') > 0) {
  window.loginPageLogOutRequest();
  /*
  var token = getCookie("access_token");
  if (token) {
    $(window).attr('location', '/workspace.html');
  }
  */
}
