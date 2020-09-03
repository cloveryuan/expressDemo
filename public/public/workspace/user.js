$(function() {
  function getCookie(name) {
    let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    let arr = document.cookie.match(reg);
    if (arr && arr.length > 0) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  }

  function loadUser(token) {
    $.ajax({
      url: `/api/user/queryUserInfo?access_token=${token}`,
      withCredentials: true,
      success: function(res) {
        $(".header-user .user-info").text(res.data.username);
        userInfo = res.data;
        if (userInfo.role === "admin") {
          $(".tbody-option-contnet .btn-delete").show();
        }
      },
      error: toLogin
    });
  }
  function toLogin() {
    message("error", "请重新登录");
    setTimeout(() => {
      window.logOutRequest();
    }, 1000);
  }

  var token = getCookie("access_token");
  if (!token) {
    window.logOutRequest();
  }
  loadUser(token);
});
