!(function (e) {
  var n = {};
  function t(a) {
    if (n[a]) return n[a].exports;
    var o = (n[a] = { i: a, l: !1, exports: {} });
    return e[a].call(o.exports, o, o.exports, t), (o.l = !0), o.exports;
  }
  (t.m = e),
    (t.c = n),
    (t.d = function (e, n, a) {
      t.o(e, n) || Object.defineProperty(e, n, { enumerable: !0, get: a });
    }),
    (t.r = function (e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (t.t = function (e, n) {
      if ((1 & n && (e = t(e)), 8 & n)) return e;
      if (4 & n && "object" == typeof e && e && e.__esModule) return e;
      var a = Object.create(null);
      if (
        (t.r(a),
        Object.defineProperty(a, "default", { enumerable: !0, value: e }),
        2 & n && "string" != typeof e)
      )
        for (var o in e)
          t.d(
            a,
            o,
            function (n) {
              return e[n];
            }.bind(null, o)
          );
      return a;
    }),
    (t.n = function (e) {
      var n =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return t.d(n, "a", n), n;
    }),
    (t.o = function (e, n) {
      return Object.prototype.hasOwnProperty.call(e, n);
    }),
    (t.p = ""),
    t((t.s = 107));
})({
  0: function (e, n) {
    e.exports = window.$;
  },
  1: function (module, __webpack_exports__, __webpack_require__) {
    "use strict";
    function checkName(e, n) {
      var t = /^[\u4E00-\u9FA5\uf900-\ufa2d·\.s]{2,20}$/.test(e);
      if (!t) throw n;
      return t;
    }
    function checkPhone(e, n) {
      if (!/^1[3456789]\d{9}$/.test(e)) throw n;
    }
    function checkCode(e, n) {
      var t = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
        a = e.substring(17);
      if (
        /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
          e
        )
      ) {
        for (var o = 0, i = 0; i < 17; i++) o += e[i] * t[i];
        if ([1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2][o % 11] == a.toUpperCase())
          return !0;
      }
      throw n;
    }
    function checkEmpty(e, n) {
      if (!e) throw n;
      if ("" === String(e).trim()) throw n;
    }
    function checkCarId(e, n) {
      e = e.toUpperCase();
      var t = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(
        e
      );
      if (!t) throw n;
      return t;
    }
    function trim(e) {
      return "string" != typeof e ? e : e.replace(/\s*/g, "");
    }
    __webpack_require__.d(__webpack_exports__, "f", function () {
      return checkName;
    }),
      __webpack_require__.d(__webpack_exports__, "i", function () {
        return checkPhone;
      }),
      __webpack_require__.d(__webpack_exports__, "c", function () {
        return checkCode;
      }),
      __webpack_require__.d(__webpack_exports__, "d", function () {
        return checkEmpty;
      }),
      __webpack_require__.d(__webpack_exports__, "b", function () {
        return checkCarId;
      }),
      __webpack_require__.d(__webpack_exports__, "B", function () {
        return trim;
      }),
      __webpack_require__.d(__webpack_exports__, "t", function () {
        return qs;
      }),
      __webpack_require__.d(__webpack_exports__, "r", function () {
        return getNowFormatDate;
      }),
      __webpack_require__.d(__webpack_exports__, "m", function () {
        return fillFormField;
      }),
      __webpack_require__.d(__webpack_exports__, "s", function () {
        return getSessionStorage;
      }),
      __webpack_require__.d(__webpack_exports__, "A", function () {
        return setSessionStorage;
      }),
      __webpack_require__.d(__webpack_exports__, "u", function () {
        return removeSessionItem;
      }),
      __webpack_require__.d(__webpack_exports__, "z", function () {
        return setLocalStorageWithExpiredTime;
      }),
      __webpack_require__.d(__webpack_exports__, "q", function () {
        return getLocalStorageWithExpiredTime;
      }),
      __webpack_require__.d(__webpack_exports__, "p", function () {
        return getLocalStorage;
      }),
      __webpack_require__.d(__webpack_exports__, "y", function () {
        return setLocalStorage;
      }),
      __webpack_require__.d(__webpack_exports__, "v", function () {
        return removeStorage;
      }),
      __webpack_require__.d(__webpack_exports__, "e", function () {
        return checkIsDateSince;
      }),
      __webpack_require__.d(__webpack_exports__, "x", function () {
        return setForRequestHeaders;
      }),
      __webpack_require__.d(__webpack_exports__, "w", function () {
        return setCookie;
      }),
      __webpack_require__.d(__webpack_exports__, "o", function () {
        return getForRequestHeaders;
      }),
      __webpack_require__.d(__webpack_exports__, "l", function () {
        return delCookie;
      }),
      __webpack_require__.d(__webpack_exports__, "j", function () {
        return checkReturnPermit;
      }),
      __webpack_require__.d(__webpack_exports__, "k", function () {
        return checkTaiWanCode;
      }),
      __webpack_require__.d(__webpack_exports__, "h", function () {
        return checkPassPort;
      }),
      __webpack_require__.d(__webpack_exports__, "g", function () {
        return checkNormalIdCard;
      }),
      __webpack_require__.d(__webpack_exports__, "n", function () {
        return getAgeByIDCard;
      }),
      __webpack_require__.d(__webpack_exports__, "a", function () {
        return changeURLArg;
      });
    var qs = {
      parse: function (e) {
        var n = {};
        return e
          ? (e.split("&").map(function (e) {
              var t = e.split("=")[0],
                a = decodeURIComponent(e.split("=")[1]);
              n[t] = a;
            }),
            n)
          : n;
      },
    };
    function getNowFormatDate(e) {
      var n = e || 0,
        t = new Date(),
        a = new Date(t);
      a.setDate(a.getDate() + n);
      var o = a.getFullYear(),
        i = a.getMonth() + 1,
        r = a.getDate();
      return (
        i >= 1 && i <= 9 && (i = "0" + i),
        r >= 0 && r <= 9 && (r = "0" + r),
        o + "-" + i + "-" + r
      );
    }
    function fillFormField(e, n) {
      var t = $(e);
      $.each(n, function (e, n) {
        var a = t.find("input[name=" + e + "]");
        if ("checkbox" == a.attr("type")) {
          if (null !== n)
            for (
              var o = t.find("[name=" + e + "]"), i = n.split(";"), r = 0;
              r < o.length;
              r++
            )
              for (var c = 0; c < i.length; c++)
                o[r].value == i[c] && $(o[r]).click();
        } else
          "radio" == a.attr("type")
            ? a.each(function () {
                for (
                  var a = t.find("[name=" + e + "]"), o = 0;
                  o < a.length;
                  o++
                )
                  a[o].value == n && $(a[o]).click();
              })
            : "textarea" == a.attr("type")
            ? t.find("[name=" + e + "]").html(n)
            : (n || 0 === n) && t.find("[name=" + e + "]").val(n);
      });
    }
    function getSessionStorage(e) {
      var n = window.sessionStorage.getItem(e);
      if (n) return (n = JSON.parse(n));
    }
    function setSessionStorage(e, n) {
      n && window.sessionStorage.setItem(e, JSON.stringify(n));
    }
    function getSessionValueFromKey(e, n) {
      var t = window.sessionStorage.getItem(e);
      if (t) return (t = JSON.parse(t))[n];
    }
    function removeSessionItem(e) {
      window.sessionStorage.removeItem(e);
    }
    function checkLng(e, n) {
      var t = Number(e);
      if (!(t >= -180 && t <= 180)) throw n;
    }
    function setLocalStorageWithExpiredTime(e, n, t) {
      if (e && n && t) {
        var a = new Date(),
          o = 24 * t * 60 * 60 * 1e3,
          i = new Date(a.setTime(a.getTime() + o)),
          r = ""
            .concat(i.getFullYear(), "-")
            .concat(i.getMonth() + 1, "-")
            .concat(i.getDate(), " ")
            .concat(i.getHours(), ":")
            .concat(i.getMinutes(), ":")
            .concat(i.getSeconds());
        setLocalStorage(e, "".concat(n, ",").concat(r));
      }
    }
    function getLocalStorageWithExpiredTime(e) {
      var n = getLocalStorage(e).split(","),
        t = n[1],
        a = new Date(),
        o = new Date(t) - a;
      return Math.floor(o / 864e5) <= -1 ? (removeStorage(e), "") : n[0];
    }
    function getLocalStorage(e) {
      var n = window.localStorage.getItem(e);
      return n ? (n = JSON.parse(n)) : "";
    }
    function setLocalStorage(e, n) {
      n && window.localStorage.setItem(e, JSON.stringify(n));
    }
    function removeStorage(e) {
      window.localStorage.removeItem(e);
    }
    function checkIsDateSince(e, n, t) {
      if (new Date(e) < n) throw t;
    }
    function isAlipayNavigator() {
      return (
        navigator.userAgent.search("Alipay") > -1 ||
        navigator.userAgent.search("alipay") > -1
      );
    }
    function setForRequestHeaders(e, n) {
      setSessionStorage(e, n);
    }
    function checkLat(e, n) {
      var t = Number(e);
      if (!(t >= -90 && t <= 90)) throw n;
    }
    function setCookie(e, n, t) {
      if (0 !== t) {
        var a = 24 * t * 60 * 60 * 1e3,
          o = new Date(+new Date() + a);
        document.cookie =
          e + "=" + escape(n) + ";expires=" + o.toUTCString() + ";path=/";
      } else document.cookie = e + "=" + escape(n);
    }
    function getCookie(e) {
      var n = new RegExp("(^| )" + e + "=([^;]*)(;|$)"),
        t = document.cookie.match(n);
      return t && t.length > 0 ? unescape(t[2]) : null;
    }
    function getForRequestHeaders(e) {
      var n = "";
      return e ? (n = getSessionStorage(e)) : n;
    }
    function delCookie(e) {
      setCookit(e, "1", -1);
    }
    function setCookit(e, n, t) {
      var a = new Date();
      a.setDate(a.getDate() + t),
        (document.cookie = e + "=" + n + ";expires=" + a);
    }
    function checkReturnPermit(e, n) {
      if (/^H\d{10}$/g.test(e) || /^M\d{10}$/g.test(e)) return !0;
      throw n;
    }
    function checkTaiWanCode(e, n) {
      if (/^\d{10}$/.test(e)) return !0;
      throw n;
    }
    function checkPassPort(e, n) {
      if (/^[A-Z0-9]+$/g.test(e)) return !0;
      throw n;
    }
    function checkNormalIdCard(e, n) {
      if (/^[a-zA-Z0-9]+$/g.test(e)) return !0;
      throw n;
    }
    function getAgeByIDCard(e) {
      var n = e.slice(6, 14),
        t = Number(n.slice(0, 4)),
        a = Number(n.slice(4, 6)),
        o = Number(n.slice(6)),
        i = new Date(),
        r = i.getFullYear(),
        c = i.getMonth() + 1,
        l = i.getDate();
      return a < c || (a === c && o < l) ? r - t : r - t - 1;
    }
    function changeURLArg(url, arg, arg_val) {
      var pattern = arg + "=([^&]*)",
        replaceText = arg + "=" + arg_val;
      if (url.match(pattern)) {
        var tmp = "/(" + arg + "=)([^&]*)/gi";
        return (tmp = url.replace(eval(tmp), replaceText)), tmp;
      }
      return url.match("[?]")
        ? url + "&" + replaceText
        : url + "?" + replaceText;
    }
  },
  10: function (e, n, t) {
    "use strict";
    t.d(n, "c", function () {
      return a;
    }),
      t.d(n, "d", function () {
        return o;
      }),
      t.d(n, "a", function () {
        return i;
      }),
      t.d(n, "b", function () {
        return r;
      }),
      t.d(n, "e", function () {
        return c;
      });
    var a = "0",
      o = "1",
      i = "0",
      r = "1",
      c = [
        { value: 0, name: "36.0℃以下" },
        { value: 1, name: "36.0-36.5℃" },
        { value: 2, name: "36.6-37.0℃" },
        { value: 3, name: "37.1-37.3℃" },
        { value: 4, name: "37.4-38.0℃" },
        { value: 5, name: "38.1-38.5℃" },
        { value: 6, name: "38.6-39.0℃" },
        { value: 7, name: "39.1-39.5℃" },
        { value: 8, name: "39.6-40.0℃" },
        { value: 9, name: "40.0℃以上" },
      ];
  },
  107: function (e, n, t) {
    "use strict";
    t.r(n);
    var a = t(0),
      o = t.n(a),
      i = t(31),
      r = t(5),
      c = t.n(r),
      l = t(12),
      d = t.n(l),
      s = t(4),
      u = t.n(s),
      p = t(11),
      f = t(14),
      v = t(3),
      m = t(6),
      y = t(1),
      h = t(2),
      _ = t(10);
    function b(e, n, t, a) {
      var o = null;
      if (n && n.length > 0)
        return (
          n.forEach(function (n) {
            a
              ? t
                ? t === n.value &&
                  ($(e).append(
                    "<option value='"
                      .concat(n.value, '\' selected="true">')
                      .concat(n.value, "</option>")
                  ),
                  (o = n.child))
                : $(e).append(
                    "\n              <option value='"
                      .concat(n.value, "'>")
                      .concat(n.value, "</option>\n            ")
                  )
              : t && t === n.value
              ? ($(e).append(
                  "<option value='"
                    .concat(n.value, '\' selected="true">')
                    .concat(n.value, "</option>")
                ),
                (o = n.child))
              : $(e).append(
                  "\n              <option value='"
                    .concat(n.value, "'>")
                    .concat(n.value, "</option>\n            ")
                );
          }),
          o
        );
    }
    function g(e, n, t, a) {
      var o = null;
      if (n && n.length > 0)
        return (
          n.forEach(function (n) {
            t && t === n.value
              ? ($(e).append(
                  "<option value='"
                    .concat(n.value, '\' selected="true">')
                    .concat(n.value, "</option>")
                ),
                (o = n.child))
              : $(e).append(
                  "\n              <option value='"
                    .concat(n.value, "'>")
                    .concat(n.value, "</option>\n            ")
                );
          }),
          o
        );
    }
    function w(e, n) {
      var t,
        a = window.navigator.userAgent.toLowerCase();
      a.search("alipay") > -1
        ? e.find('[name="source"]').val(1)
        : a.search("micromessenger") > -1
        ? e.find('[name="source"]').val(2)
        : e.find('[name="source"]').val(10),
        (t = se()({
          formStatus: "showSubmitNew",
          statusList: ye,
          isLeave: "1" === fe.isLeave,
        })),
        be.find(".page-footer").html(t),
        be.find("#submitBtn").click(function () {
          Object(m.b)(function () {
            oe(be, fe, Ne);
          });
        }),
        ["domicileProv", "departProv"].forEach(function (e) {
          window.areaList &&
            window.areaList.forEach(function (n) {
              $('select[name="'.concat(e, '"]')).append(
                "\n          <option value='"
                  .concat(n.value, "'>")
                  .concat(n.value, "</option>")
              );
            });
        }),
        P(e),
        n.personType === _.c &&
          O(e, function () {
            window.config.depart_country_type && window.config.depart_country
              ? (e.find("#departHomeOrAbroad").show(),
                e.find("#departNation").hide(),
                e.find("#departPCA").show(),
                e.find("#departPCA").css("display", "flex"))
              : (e.find("#departHomeOrAbroad").hide(),
                e.find("#departNation").hide());
          }),
        (function (e) {
          e.find("select").each(function (e, n) {
            "" === n.value && (n.style.color = "#7a7a7a");
          });
        })(e);
    }
    function C(e) {
      var n =
        "<option value='' disabled selected style='display:none;'>省（必填）</option>";
      window.areaList &&
        window.areaList.map(function (e) {
          n += " <option value='"
            .concat(e.value, "'>")
            .concat(e.value, "</option>");
        }),
        e.find("[name=departProv]").html(n);
    }
    function O(e, n) {
      if (window.config.depart_country_type && window.config.depart_country) {
        var t = JSON.parse(window.config.depart_country_type),
          a = Object.keys(t)
            .map(function (e) {
              return "<option value='"
                .concat(e, "'>")
                .concat(t[e], "</option>");
            })
            .join("");
        e.find("[name='departCountryType']").html(a),
          e.find("[name='departCountryType']").val("0");
        var o = JSON.parse(window.config.depart_country),
          i = Object.keys(o)
            .map(function (e) {
              return "<option value='"
                .concat(o[e], "'>")
                .concat(o[e], "</option>");
            })
            .join("");
        e.find("#departNation")
          .find("select")
          .html(
            "<option value='' selected style='display:none'>请选择国家</option>" +
              i
          );
      }
      n && n();
    }
    function T(e) {
      var n = e.find('[name="travelType"]').val();
      e.find(".trip-license").show(),
        "1" === n
          ? e
              .find('[name="travelNo"]')
              .attr("placeholder", "请填写车牌号（必填，例：京A88888）")
          : "2" === n
          ? e
              .find('[name="travelNo"]')
              .attr("placeholder", "请填写车次号（必填，例：K8090）")
          : "3" === n
          ? e
              .find('[name="travelNo"]')
              .attr("placeholder", "请填写航班号（必填）")
          : "4" === n &&
            e.find('[name="travelNo"]').attr("placeholder", "请备注出行方式");
    }
    function j(e) {
      var n = e.find('[name="localTravelType"]').val();
      e.find(".trip-license").show(),
        "1" === n
          ? e
              .find('[name="localTravelNo"]')
              .attr("placeholder", "请填写车牌号（必填，例：京A88888）")
          : "2" === n
          ? e
              .find('[name="localTravelNo"]')
              .attr("placeholder", "请填写车次号（非必填）")
          : "3" === n
          ? e
              .find('[name="localTravelNo"]')
              .attr("placeholder", "请填写车牌号（非必填）")
          : "4" === n &&
            e
              .find('[name="localTravelNo"]')
              .attr("placeholder", "请备注出行方式（非必填）");
    }
    function N(e, n) {
      n &&
        (e
          .find("[name=domicileProv]")
          .html(
            '<option selected value="'.concat(n, '" >').concat(n, "</option>")
          ),
        e.find("[name=domicileProv]").val(n),
        S("[name=domicileProv]"));
    }
    function k(e) {
      e.find("input").each(function (e, n) {
        $(n).attr("readonly", !0),
          $(n).attr("disabled", !0),
          (n.style.color = "#7a7a7a");
      }),
        e.find("select").each(function (e, n) {
          (n.disabled = !0), (n.style.color = "#7a7a7a");
        }),
        e.find("#getOcr").removeClass("show"),
        e.find(".ocrText").removeClass("show");
    }
    function S(e) {
      $(e)
        .parent()
        .find(".city")
        .html(
          "<option value='' disabled selected style='display:none;'>市（必填）</option>"
        )
        .change(),
        $(e)
          .parent()
          .find(".area")
          .html(
            "<option value='' disabled selected style='display:none;'>区（必填）</option>"
          )
          .change(),
        $(e)
          .parent()
          .next()
          .find(".street")
          .html(
            "<option value='' disabled selected style='display:none;'>街道/镇（必填）</option>"
          )
          .change();
      var n =
        window.areaList &&
        window.areaList.find(function (n) {
          return n.value === $(e).val();
        });
      !n ||
        (n && n.child && 0 === n.child.length) ||
        n.child.map(function (n) {
          $(e)
            .parent()
            .find(".city")
            .append(
              "\n      <option value='"
                .concat(n.value, "'>")
                .concat(n.value, "</option>\n    ")
            );
        });
    }
    function P(e, n) {
      "2" === "".concat(n) &&
        (u.a.parse(location.search).hasChooseType ||
          e
            .find('[name="idCardType"]')
            .append('<option selected value="2">其他</option>'));
      "5" === "".concat(n)
        ? (e.find("#nationalityContainer").show(),
          e.find("#domicileContainer").hide())
        : (e.find("#nationalityContainer").hide(),
          e.find("#domicileContainer").show());
    }
    function x(e, n) {
      $.alert("请完善居住地的镇或街道信息", "提示", function () {
        e.find(".content").scrollTop(417), n && n();
      });
    }
    function A(e, n) {
      (Ce(),
      (function (e) {
        e.find("input").each(function (e, n) {
          $(n).removeAttr("readonly"),
            $(n).removeAttr("disabled"),
            (n.style.color = "");
        }),
          e.find("select").each(function (e, n) {
            (n.disabled = !1), (n.style.color = "");
          });
      })(e),
      0 === n.relType &&
        (e.find("[name=phone]").attr("readonly", !0),
        e.find("[name=phone]").css("color", "#7a7a7a")),
      2 === n.idCardType) &&
        u.a.parse(location.search).hasChooseType &&
        (e.find('[name="idCardType"]').val("1"),
        e.find('[name="idCardNum"]').val(""));
      "1" === "".concat(n.personnelType) &&
        (C(e),
        O(e, function () {
          window.config.depart_country_type && window.config.depart_country
            ? (e.find("#departHomeOrAbroad").show(),
              e.find("#departNation").hide(),
              e.find("#departPCA").show(),
              e.find("#departPCA").css("display", "flex"))
            : (e.find("#departHomeOrAbroad").hide(),
              e.find("#departNation").hide());
        }));
    }
    function L(e, n) {
      var t = n.departCountryTypeName,
        a = n.departCountryTypeValue,
        o = n.provinceName,
        i = n.provinceValue,
        r = n.cityName,
        c = n.cityValue,
        l = n.areaName,
        d = n.areaValue;
      if (e) {
        if (
          t &&
          a &&
          window.config.depart_country_type &&
          window.config.depart_country
        ) {
          var s = JSON.parse(window.config.depart_country_type),
            u = Object.keys(s)
              .map(function (e) {
                return "<option value='"
                  .concat(e, "'>")
                  .concat(s[e], "</option>");
              })
              .join("");
          e.find("[name='departCountryType']").html(u),
            e.find("[name='departCountryType']").val(a);
        }
        if (i && o) {
          var p = $(e).find("[name='".concat(o, "']"));
          if (
            (window.areaList &&
              window.areaList.map(function (e) {
                "domicileProv" === o
                  ? ["香港特别行政区", "澳门特别行政区", "台湾省"].includes(i)
                    ? e.value === i &&
                      p.html(
                        "\n                <option value='"
                          .concat(e.value, "' selected>")
                          .concat(e.value, "</option>\n              ")
                      )
                    : e.value === i
                    ? p.append(
                        "\n                  <option value='"
                          .concat(e.value, "' selected>")
                          .concat(e.value, "</option>\n                ")
                      )
                    : p.append(
                        "\n                  <option value='"
                          .concat(e.value, "'>")
                          .concat(e.value, "</option>\n                ")
                      )
                  : e.value === i
                  ? p.append(
                      "\n                <option value='"
                        .concat(e.value, "' selected>")
                        .concat(e.value, "</option>\n              ")
                    )
                  : p.append(
                      "\n                <option value='"
                        .concat(e.value, "'>")
                        .concat(e.value, "</option>\n              ")
                    );
              }),
            c && r)
          ) {
            var f = $(e).find("[name='".concat(r, "']")),
              v =
                window.areaList &&
                window.areaList.find(function (e) {
                  return e.value === i;
                });
            if (
              (v.child.map(function (e) {
                e.value === c
                  ? f.append(
                      "\n                <option value='"
                        .concat(e.value, "' selected>")
                        .concat(e.value, "</option>\n              ")
                    )
                  : f.append(
                      "\n                <option value='"
                        .concat(e.value, "'>")
                        .concat(e.value, "</option>\n              ")
                    );
              }),
              l && d)
            ) {
              var m = $(e).find("[name='".concat(l, "']")),
                y = v.child.find(function (e) {
                  return e.value === c;
                });
              return (
                y.child.map(function (e) {
                  e.value === d
                    ? m.append(
                        "\n                  <option value='"
                          .concat(e.value, "' selected>")
                          .concat(e.value, "</option>\n                ")
                      )
                    : m.append(
                        "\n                  <option value='"
                          .concat(e.value, "'>")
                          .concat(e.value, "</option>\n                ")
                      );
                }),
                y.child
              );
            }
          }
        }
      }
    }
    function D(e, n) {
      var t = n.provinceValue,
        a = n.cityValue,
        o = n.areaValue,
        i = n.streetValue;
      return (
        !(
          !window.config ||
          !Object.keys(window.config).includes("pca_defaultFlag")
        ) &&
        (function (e, n) {
          var t,
            a = n.provinceValue,
            o = n.cityValue,
            i = n.areaValue,
            r = n.streetValue,
            c = !1,
            l = "0" === window.config.pca_defaultFlag,
            d = $(e).find("[name='destProv']"),
            s = $(e).find("[name='destCity']"),
            u = $(e).find("[name='destDistrict']"),
            p = $(e).find("[name='destStreet']");
          if (
            ($(d)
              .html(
                "<option value='' disabled selected style='display:none;'>省（必填）</option>"
              )
              .change(),
            $(s)
              .html(
                "<option value='' disabled selected style='display:none;'>市（必填）</option>"
              )
              .change(),
            $(u)
              .html(
                "<option value='' disabled selected style='display:none;'>区（必填）</option>"
              )
              .change(),
            $(p)
              .html(
                "<option value='' disabled selected style='display:none;'>街道/镇（必填）</option>"
              )
              .change(),
            l)
          ) {
            if (a && o && i) {
              var f = b(d, window.areaList, a, l),
                v = b(s, f, o, l);
              t = g(u, v, i) || [];
            }
          } else {
            var m = (
              L(e, {
                provinceName: "destProv",
                provinceValue: a,
                cityName: "destCity",
                cityValue: o,
                areaName: "destDistrict",
                areaValue: i,
              }) || []
            ).find(function (e) {
              return e.value === i;
            });
            t = (m && m.child) || [];
          }
          t &&
            t.length > 0 &&
            ($(p).val(""),
            t.forEach(function (e) {
              e.value === r
                ? p.append(
                    "\n              <option value='"
                      .concat(e.value, "' selected>")
                      .concat(e.value, "</option>\n            ")
                  )
                : p.append(
                    "\n              <option value='"
                      .concat(e.value, "'>")
                      .concat(e.value, "</option>\n            ")
                  );
            }),
            t.find(function (e) {
              return e.value === r;
            }) || (c = !0));
          return c;
        })(e, { provinceValue: t, cityValue: a, areaValue: o, streetValue: i })
      );
    }
    var E = t(25),
      R = t.n(E);
    function I(e, n) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        n &&
          (a = a.filter(function (n) {
            return Object.getOwnPropertyDescriptor(e, n).enumerable;
          })),
          t.push.apply(t, a);
      }
      return t;
    }
    function F(e) {
      for (var n = 1; n < arguments.length; n++) {
        var t = null != arguments[n] ? arguments[n] : {};
        n % 2
          ? I(Object(t), !0).forEach(function (n) {
              c()(e, n, t[n]);
            })
          : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
          : I(Object(t)).forEach(function (n) {
              Object.defineProperty(
                e,
                n,
                Object.getOwnPropertyDescriptor(t, n)
              );
            });
      }
      return e;
    }
    var q = { func: y.d, msg: "不能为空" },
      V = { func: y.f, msg: "格式有误" },
      B = { func: y.c, msg: "格式有误" },
      U = { func: y.i, msg: "格式有误" },
      H = { func: y.k, msg: "格式有误" },
      M = { func: y.j, msg: "格式有误" },
      J = { func: y.g, msg: "格式有误" },
      z = { func: y.h, msg: "格式有误" },
      Y = {
        func: function (e, n) {
          var t = Object(y.n)(e);
          if (t >= 18 && t <= 65) throw n;
          return !0;
        },
        msg: "他人委托只能添加18岁以下65岁以上成员",
        useMsgOnly: !0,
      },
      X = { func: y.b, msg: "格式有误" },
      Z = {};
    function W(e) {
      (Z.domicileProv = { rule: q, value: e.domicileProv, label: "户籍地省" }),
        (Z.domicileCity = {
          rule: q,
          value: e.domicileCity,
          label: "户籍地市",
        });
    }
    function G(e) {
      Z.name = { rule: [q, V], value: e.name, label: "姓名" };
    }
    function K(e, n) {
      switch (
        ((Z.name = { rule: [q], value: e.idCardType, label: "证件类型" }),
        e.idCardType)
      ) {
        case "1":
          var t = n.parentRecordCode ? [q, B, Y] : [q, B];
          (Z.idCardNum = { rule: t, value: e.idCardNum, label: "身份证" }),
            W(e);
          break;
        case "2":
          (Z.idCardNum = { rule: [q, J], value: e.idCardNum, label: "证件号" }),
            W(e);
          break;
        case "3":
          (Z.idCardNum = { rule: [q, H], value: e.idCardNum, label: "台胞证" }),
            W(e);
          break;
        case "4":
          (Z.idCardNum = { rule: [q, M], value: e.idCardNum, label: "回乡证" }),
            W(e);
          break;
        case "5":
          (Z.idCardNum = { rule: [q, z], value: e.idCardNum, label: "护照" }),
            (function (e) {
              Z.nationality = {
                rule: q,
                value: e.nationality,
                label: "户籍所在国家或地区",
              };
            })(e);
      }
    }
    function Q(e) {
      (Z.destProv = { rule: q, value: e.destProv, label: "居住地省" }),
        (Z.destCity = { rule: q, value: e.destCity, label: "居住地市" }),
        (Z.destDistrict = {
          rule: q,
          value: e.destDistrict,
          label: "居住地区",
        }),
        (Z.destStreet = { rule: q, value: e.destStreet, label: "街道/镇" }),
        (Z.destArea = { rule: q, value: e.destArea, label: "小区/村/酒店" });
    }
    function ee(e) {
      Z.relType = { rule: q, value: e.relType, label: "与我的关系" };
    }
    function ne(e, n) {
      Z.phone = { rule: n, value: e.phone, label: "手机号" };
    }
    function te(e, n) {
      Z.objective = { rule: q, value: e.objective, label: n };
    }
    function ae(e, n) {
      Z = {};
      var t = e.parentRecordCode;
      return (
        e.personType === _.c
          ? (G(n),
            K(n, e),
            (function (e) {
              Z.destDate = {
                rule: q,
                value: e.destDate,
                label: "来" + window.config.city_two_word + "日期",
              };
            })(n),
            Q(n),
            t ? (ee(n), n.phone && ne(n, U)) : ne(n, [q, U]),
            (function (e) {
              (Z.departCountryType = {
                rule: q,
                value: e.departCountryType,
                label: "出发地类型",
              }),
                e.departCountryType === _.a
                  ? ((Z.departProv = {
                      rule: q,
                      value: e.departProv,
                      label: "出发地省",
                    }),
                    (Z.departCity = {
                      rule: q,
                      value: e.departCity,
                      label: "出发地市",
                    }),
                    (Z.departDistrict = {
                      rule: q,
                      value: e.departDistrict,
                      label: "出发地区",
                    }))
                  : e.departCountryType === _.b &&
                    (Z.departCountry = {
                      rule: q,
                      value: e.departCountry,
                      label: "出发地国家",
                    });
            })(n),
            (function (e) {
              (Z.travelType = {
                rule: q,
                value: e.travelType,
                label: "出行方式",
              }),
                "1" === e.travelType &&
                  (Z.travelNo = {
                    rule: [q, X],
                    value: e.travelNo,
                    label: "车牌号",
                  }),
                "2" === e.travelType &&
                  (Z.travelNo = {
                    rule: q,
                    value: e.travelNo,
                    label: "车次号",
                  }),
                "3" === e.travelType &&
                  (Z.travelNo = {
                    rule: q,
                    value: e.travelNo,
                    label: "航班号",
                  });
            })(n),
            te(n, "来徐目的"))
          : e.personType === _.d &&
            (G(n),
            K(n, e),
            Q(n),
            t ? (ee(n), n.phone && ne(n, U)) : ne(n, [q, U]),
            (function (e) {
              (Z.localTravelType = {
                rule: q,
                value: e.localTravelType,
                label: "出行方式",
              }),
                "1" === e.localTravelType &&
                  (Z.localTravelNo = {
                    rule: [q, X],
                    value: e.localTravelNo,
                    label: "车牌号",
                  });
            })(n),
            te(n, "在徐目的")),
        (function (e) {
          try {
            for (var n in e) {
              var t = e[n];
              $.isArray(t.rule)
                ? t.rule.forEach(function (e) {
                    var n = e.useMsgOnly ? e.msg : t.label + e.msg;
                    e.func(t.value, n);
                  })
                : t.rule.func(t.value, t.label + t.rule.msg);
            }
            return !0;
          } catch (e) {
            return $.toast(e), !1;
          }
        })(Z)
      );
    }
    function oe(e, n, t, a, o) {
      var i = {};
      if (
        ((i = a || y.t.parse(e.find("#registerForm").serialize())),
        o &&
          (function (e) {
            var n =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {},
              t = Object.keys(n);
            if (0 === t.length) return;
            t.forEach(function (t) {
              e[t] = n[t];
            });
          })(i, o),
        ae(n, i))
      ) {
        var r = i,
          c = r.name,
          l = r.idCardNum,
          d = r.nationality,
          s = r.destDate,
          u = r.destArea,
          p = r.destAddr,
          f = r.relType,
          v = r.phone,
          m = r.departCountryType,
          h = r.departCountry,
          b = r.departProv,
          g = r.departCity,
          w = r.departDistrict,
          C = r.travelType,
          O = r.travelNo,
          T = r.localTravelType,
          j = r.localTravelNo,
          N = r.orgName,
          k = r.orgAddress,
          S = r.source,
          P =
            (r.goHb,
            r.contactHb,
            R()(r, [
              "name",
              "idCardNum",
              "nationality",
              "destDate",
              "destArea",
              "destAddr",
              "relType",
              "phone",
              "departCountryType",
              "departCountry",
              "departProv",
              "departCity",
              "departDistrict",
              "travelType",
              "travelNo",
              "localTravelType",
              "localTravelNo",
              "orgName",
              "orgAddress",
              "source",
              "goHb",
              "contactHb",
            ]));
        (c = Object(y.B)(i.name)),
          (l = Object(y.B)(i.idCardNum)),
          (d = Object(y.B)(i.nationality)),
          (u = Object(y.B)(i.destArea)),
          (p = Object(y.B)(i.destAddr) || "默认"),
          (v = Object(y.B)(i.phone)),
          (N = Object(y.B)(i.orgName)),
          (k = Object(y.B)(i.orgAddress));
        var x = {
          personnelType: n.personType,
          source: S,
          needUpdateStreet: !!ie(o, "destStreet"),
          errorIdentity: !!ie(o, "idCardNum"),
          people: [
            {
              name: c,
              idCardNum: l,
              nationality: d,
              destArea: u,
              destAddr: p,
              phone: v,
              orgName: N,
              orgAddress: k,
              goHb: "1",
              contactHb: "1",
            },
          ],
        };
        n.personType === _.c
          ? (x = F({}, x, {
              travelType: C,
              travelNo: O,
              departProv: b,
              departCity: g,
              departDistrict: w,
              people: [
                F({}, x.people[0], {}, P, {
                  relType: "0",
                  destDate: a ? s : s + " 00:00:00",
                  departCountryType: m,
                  departCountry: h,
                }),
              ],
            }))
          : n.personType === _.d &&
            (x = F({}, x, {
              localTravelType: T,
              localTravelNo: j,
              departProv: b,
              departCity: g,
              departDistrict: w,
              people: [F({}, x.people[0], {}, P, { relType: "0" })],
            })),
          n.parentRecordCode &&
            (x.people[0] = F({}, x.people[0], {
              relType: f,
              parentRecordId: n.parentRecordCode,
            })),
          $.showIndicator(),
          t && t(x);
      }
    }
    function ie() {
      var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
        n = arguments.length > 1 ? arguments[1] : void 0;
      return Object.keys(e).includes(n);
    }
    function re(e) {
      var n = e.find("#uploadOcr");
      n &&
        n.change(function () {
          var n = this.files[0];
          if (/image\/\w+/.test(n.type)) {
            var t = new FileReader();
            t.readAsDataURL(n),
              (t.onload = function () {
                var n, t;
                (n = this.result),
                  ((t = new Image()).onload = function () {
                    var n = document.createElement("canvas"),
                      a = n.getContext("2d");
                    t.height > 1e3 &&
                      ((t.width *= 1e3 / t.height), (t.height = 1e3)),
                      (n.width = t.width),
                      (n.height = t.height),
                      a.clearRect(0, 0, n.width, n.height),
                      a.drawImage(t, 0, 0, t.width, t.height);
                    var o,
                      i = n.toDataURL("image/jpeg", 0.8);
                    (o = i.split(",")[1]),
                      Object(h.b)("/api/ocr/identity/car/query", { image: o })
                        .then(function (n) {
                          n.error
                            ? $.toast("识别错误!")
                            : (e.find('[name="name"]').val(n.data.name),
                              e.find('[name="idCardType"]').val("1"),
                              e.find('[name="idCardNum"]').val(n.data.num),
                              L(e, {
                                provinceName: "domicileProv",
                                provinceValue: n.data.province,
                                cityName: "domicileCity",
                                cityValue: n.data.city,
                              }));
                        })
                        .catch(function (e) {
                          $.toast(e);
                        });
                  }),
                  (t.src = n);
              });
          } else $.toast("请确保文件为图像类型");
        });
    }
    t(65);
    var ce = t(48),
      le = t.n(ce),
      de = t(23),
      se = t.n(de);
    function ue(e, n) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        n &&
          (a = a.filter(function (n) {
            return Object.getOwnPropertyDescriptor(e, n).enumerable;
          })),
          t.push.apply(t, a);
      }
      return t;
    }
    function pe(e) {
      for (var n = 1; n < arguments.length; n++) {
        var t = null != arguments[n] ? arguments[n] : {};
        n % 2
          ? ue(Object(t), !0).forEach(function (n) {
              c()(e, n, t[n]);
            })
          : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
          : ue(Object(t)).forEach(function (n) {
              Object.defineProperty(
                e,
                n,
                Object.getOwnPropertyDescriptor(t, n)
              );
            });
      }
      return e;
    }
    var fe = u.a.parse(location.search);
    "localhost" === location.hostname &&
      (function (e) {
        try {
          if (!e.personType) throw "location search 缺失 personType";
          if (!e.parentRecordCode && !e.phone)
            throw "location search 缺失 phone";
        } catch (e) {
          return $.toast(e), !1;
        }
      })(fe);
    var ve,
      me,
      ye = [
        "showSubmitNew",
        "showSubmitEdit",
        "showBeforeEdit",
        "readonly",
        "showRegisterBtn",
      ],
      he = {},
      _e = le()({
        PERSON_TYPE_COME: _.c,
        PERSON_TYPE_LOCAL: _.d,
        urlParsed: fe,
      }),
      be = o()(_e),
      ge = new Promise(function (e, n) {
        Object(p.b)(function (n) {
          e(n);
        });
      }),
      we = new Promise(function (e, n) {
        Object(p.a)(function (n) {
          e(n);
        });
      });
    function Ce() {
      var e = se()({
        formStatus: "showSubmitEdit",
        statusList: ye,
        isLeave: "1" === fe.isLeave,
      });
      be.find(".page-footer").html(e),
        be
          .find("#editBtn")
          .off()
          .click(function () {
            Object(m.b)(function () {
              oe(be, fe, ke);
            });
          });
    }
    function Oe(e) {
      var n = se()({
        formStatus: "showBeforeEdit",
        statusList: ye,
        isLeave: "1" === fe.isLeave,
      });
      be.find(".page-footer").html(n),
        be
          .find("#personnelType-btn")
          .off()
          .click(function () {
            Object(m.b)(function () {
              !(function (e, n) {
                var t = "".concat(n),
                  a = window.config.registerPersonType,
                  o = "";
                if (a) {
                  var i = JSON.parse(a),
                    r = "",
                    c = i
                      .map(function (e, n) {
                        var a = e.name,
                          i = e.key,
                          c = "";
                        return (
                          "".concat(i) === t && ((c = "checked"), (r = a)),
                          0 === n && (o = 'style="margin-right:10px"'),
                          '<input type="radio" name="modal-personnelType" value="'
                            .concat(i, '" id="personnelType-')
                            .concat(i, '" ')
                            .concat(c, '><label for="personnelType-')
                            .concat(i, '"><span ')
                            .concat(o, ">")
                            .concat(a, "</span></label>")
                        );
                      })
                      .join("");
                  $.modal({
                    title: "请选择要修改的人员类型",
                    text: "当前人员类型：".concat(r),
                    afterText: '<div class="radio-prettier">'.concat(
                      c,
                      "</div>"
                    ),
                    buttons: [
                      {
                        text: "确定",
                        onClick: function () {
                          var e = $(
                              '[name="modal-personnelType"]:checked'
                            ).val(),
                            n = window.location,
                            t = Object(y.a)(n.href, "personType", e);
                          window.location.replace(t + "&hasChooseType=true");
                        },
                      },
                    ],
                  });
                }
              })(0, e.personnelType);
            });
          });
    }
    function Te(e) {
      var n = e.newRecordCode;
      v.a.hide();
      var t = fe.personType,
        a = fe.phone,
        o = { recordCode: fe.parentRecordCode || n, personType: t };
      a && (o.phone = a),
        (o = u.a.stringify(o)),
        window.location.replace("/qrcode.html?".concat(o));
    }
    function je(e) {
      v.a.show();
      var n = e.recordCode;
      Object(y.A)("positionUploaded", !0),
        Object(f.b)(
          n,
          function () {
            Te(e);
          },
          function () {
            Te(e);
          }
        );
    }
    fe.parentRecordCode ||
      (function (e, n) {
        if (location.search) {
          var t = Object(y.s)("aliPayUserInfo") || {},
            a = n.phone || t.mobile,
            o = t.userName,
            i = t.certNo;
          a && e.find("[name=phone]").val(a),
            o && e.find("[name=name]").val(o),
            i && e.find("[name=idCardNum]").val(i);
        }
      })(be, fe),
      (ve = be),
      (me = window.navigator.userAgent.toLowerCase()).includes(
        "micromessenger"
      ) &&
        me.includes("iphone") &&
        ve.find("input, select, textarea").on("blur", function () {
          document.body.scrollTop = document.body.scrollTop;
        }),
      window.addEventListener(
        "popstate",
        function (e) {
          1 == e.index && window.android.outSystem(),
            recordCode &&
              !location.hash &&
              (window.location = window.location + "#success"),
            location.reload();
        },
        !1
      ),
      ve.find("select").change(function (e) {
        e.target.value
          ? $(e.target).css("color", "#3d4145")
          : $(e.target).css("color", "#7a7a7a");
      }),
      ve.find('[name="travelType"]').change(function () {
        T(ve);
      }),
      ve.find('[name="localTravelType"]').change(function () {
        j(ve);
      }),
      ve.find('[name="destDate"]').change(function (e) {
        var n = e.target;
        ve.find(n).attr(
          "placeholder",
          "" != n.value
            ? null
            : "填写到达".concat(window.config.city_two_word, "日期（必填）")
        );
      }),
      ve.find("[name='idCardNum']").change(function (e) {
        e.target.value = (e.target.value || "")
          .trim()
          .toUpperCase()
          .replace(/\s/g, "");
        var n = e.target.value;
        "4" === ve.find("[name=idCardType]").val() &&
          (/^H/.test(n)
            ? N(ve, "香港特别行政区")
            : /^M/.test(n) && N(ve, "澳门特别行政区"));
      }),
      ve.find('[name="idCardType"]').change(function (e) {
        var n = e.target;
        function t(e) {
          $(n).parent().find('[name="idCardNum"]').attr("placeholder", e);
        }
        switch (
          (ve.find('[name="idCardNum"]').val(""),
          ["nationality", "domicileProv", "domicileCity"].forEach(function (e) {
            ve.find('[name="'.concat(e, '"]')).val("");
          }),
          P(ve, n.value),
          (function (e) {
            e.find("[name=domicileProv]").html("");
            var n =
              "<option value='' disabled selected style='display:none;'>省（必填）</option>";
            window.areaList &&
              window.areaList.map(function (e) {
                n += " <option value='"
                  .concat(e.value, "'>")
                  .concat(e.value, "</option>");
              }),
              e.find("[name=domicileProv]").html(n),
              e
                .find("[name=domicileCity]")
                .html(
                  "<option value='' disabled selected style='display:none;'>市（必填）</option>"
                );
          })(ve),
          n.value)
        ) {
          case "1":
            t("填写18位身份证号（必填）");
            break;
          case "2":
            t("填写证件号（必填）");
            break;
          case "3":
            t("填写10位台胞证号（必填）"), N(ve, "台湾省");
            break;
          case "4":
            t("填写11位回乡证号（必填）");
            break;
          case "5":
            t("填写护照（必填）");
        }
      }),
      ve.find("[name='departCountryType']").change(function (e) {
        if (e.target.value === _.b) {
          var n = JSON.parse(window.config.depart_country),
            t = Object.keys(n)
              .map(function (e, t) {
                return "<option value='"
                  .concat(n[e], "'>")
                  .concat(n[e], "</option>");
              })
              .join("");
          ve
            .find("#departNation")
            .find("select")
            .html(
              "<option value='' selected style='display:none'>请选择国家</option>" +
                t
            ),
            ve.find("#departNation").show(),
            ve.find("#departPCA").hide();
        } else e.target.value === _.a && (C(ve), ve.find("#departNation").hide(), ve.find("#departPCA").css("display", "flex"));
      }),
      ve.find(".provinces").change(function (e) {
        S(e.target);
      }),
      ve.find(".city").change(function (e) {
        !(function (e) {
          $(e)
            .parent()
            .find(".area")
            .html(
              "<option value='' disabled selected style='display:none;'>区（必填）</option>"
            )
            .change(),
            $(e)
              .parent()
              .next()
              .find(".street")
              .html(
                "<option value='' disabled selected style='display:none;'>街道/镇（必填）</option>"
              )
              .change();
          var n = $(e).parent().find(".provinces")[0],
            t = $(n).val(),
            a =
              window.areaList &&
              window.areaList.find(function (e) {
                return e.value === t;
              });
          if (!(!a || (a && a.child && 0 === a.child.length))) {
            var o = a.child.find(function (n) {
              return n.value === $(e).val();
            });
            !o ||
              (o && o.child && 0 === o.child.length) ||
              (o.child || []).map(function (n) {
                $(e)
                  .parent()
                  .find(".area")
                  .append(
                    "\n        <option value='"
                      .concat(n.value, "'>")
                      .concat(n.value, "</option>\n      ")
                  );
              });
          }
        })(e.target);
      }),
      ve.find(".area").change(function (e) {
        !(function (e) {
          $(e)
            .parent()
            .next()
            .find(".street")
            .html(
              "<option value='' disabled selected style='display:none;'>街道/镇（必填）</option>"
            )
            .change();
          var n = $(e).parent().find(".provinces")[0],
            t = $(e).parent().find(".city")[0],
            a = $(n).val(),
            o = $(t).val(),
            i =
              window.areaList &&
              window.areaList.find(function (e) {
                return e.value === a;
              });
          if (!(!i || (i && i.child && 0 === i.child.length))) {
            var r = i.child.find(function (e) {
              return e.value === o;
            });
            if (!(!r || (r && r.child && 0 === r.child.length))) {
              var c = r.child.find(function (n) {
                return n.value === $(e).val();
              });
              if (!(!c || (c && c.child && 0 === c.child.length))) {
                var l,
                  d = $(e).parent().next().find(".street");
                d.length > 0 &&
                  (l = c) &&
                  l.child &&
                  l.child.length > 0 &&
                  c.child.forEach(function (e) {
                    d.append(
                      "\n          <option value='"
                        .concat(e.value, "'>")
                        .concat(e.value, "</option>\n        ")
                    );
                  });
              }
            }
          }
        })(e.target);
      }),
      ve.find(".travelNoUpperCase").change(function () {
        "1" === ve.find('[name="travelType"]').val() &&
          ve
            .find('[name="travelNo"]')
            .val(ve.find('[name="travelNo"]').val().toUpperCase()),
          "1" === ve.find('[name="localTravelType"]').val() &&
            ve
              .find('[name="localTravelNo"]')
              .val(ve.find('[name="localTravelNo"]').val().toUpperCase());
      }),
      Promise.all([ge, we]).then(function (e) {
        var n = d()(e, 2),
          t = n[0],
          a = n[1];
        (window.areaList = a.pca),
          (function (e) {
            (window.config = {
              registerPersonType: e["front.register.personType"],
              pca_province: e.province,
              pca_city: e.city,
              pca_district: e.district,
              pca_defaultFlag: "0",
              city_two_word: e.city.replace(/市/g, ""),
              city_one_word: e.cityShortName,
            }),
              "徐州市" === e.city && o()("title").html(e.pageTitle || "");
            "0" === e.returnRegistrationPageDescConf
              ? (be
                  .find(".card-content-inner.top-info")
                  .html(e.returnRegistrationPageDesc),
                be.find(".notice-info").css("display", "block"),
                be.find("#contentBlockAdjust").css("margin-top", "7rem"))
              : (be.find(".card-content-inner.top-info").html(""),
                be.find(".notice-info").css("display", "none"),
                be.find("#contentBlockAdjust").css("margin-top", "4rem"));
            "0" === e.isEnableOCR &&
              (be.find("#getOcr").addClass("show"),
              be.find(".ocrText").addClass("show"));
            be
              .find("#destProvLabel")
              .html(
                "".concat(
                  e.returnCityResidence ||
                    window.config.city_two_word + "居住地"
                ) +
                  '<span class="contrast">（ Residence Address in Xuzhou ）</span>'
              ),
              e.friendshipRemind &&
                (be.find(".friendship-remind").html(""),
                be.find(".friendship-remind").html(e.friendshipRemind));
            fe.register &&
              ((n = se()({ formStatus: "showRegisterBtn", statusList: ye })),
              be.find(".page-register").html(n),
              be
                .find("#logout")
                .off()
                .click(function () {
                  localStorage.clear(), sessionStorage.clear(), Object(m.c)();
                }));
            var n;
          })(t),
          fe.personType === _.c
            ? (function (e) {
                (window.config = pe({}, window.config, {
                  depart_country_type: e.depart_country_type,
                  depart_country: e.depart_country,
                })),
                  be
                    .find("#destDateLabel")
                    .html(
                      "来".concat(
                        window.config.city_one_word,
                        '日期<span class="contrast">（ Date of Arrival ）</span>'
                      )
                    ),
                  be
                    .find("[name='destDate']")
                    .attr(
                      "placeholder",
                      "填写到达".concat(
                        window.config.city_one_word,
                        "日期（必填）"
                      )
                    ),
                  be.find("#objectiveLabel").each(function (e, n) {
                    be.find(n).html(
                      "来".concat(
                        window.config.city_one_word,
                        '目的<span class="contrast">（ Purpose of Coming to Xuzhou ）</span>'
                      )
                    );
                  });
              })(t)
            : fe.personType === _.d &&
              ((window.config = pe({}, window.config)),
              be.find("#objectiveLabel").each(function (e, n) {
                be.find(n).html(
                  "在".concat(
                    window.config.city_one_word,
                    '目的<span class="contrast">（ Purpose of Coming to Xuzhou ）</span>'
                  )
                );
              })),
          (function (e) {
            var n = "0" === window.config.pca_defaultFlag,
              t = window.config.pca_province,
              a = window.config.pca_city,
              o = window.config.pca_district;
            e.find('[label="default-area"]').each(function (e, i) {
              var r = $(i).parent().find('[name="destProv"]'),
                c = $(i).parent().find('[name="destCity"]'),
                l = $(i).parent().find('[name="destDistrict"]'),
                d = b(r, window.areaList, t, n);
              g(l, b(c, d, a, n), o, n);
            });
          })(be),
          re(be),
          Se();
      });
    var Ne = function (e) {
        Object(h.b)("/api/companionRecord/save", e)
          .then(function (e) {
            o.a.hideIndicator(),
              e.error
                ? o.a.toast(e.data || "未知错误，请联系管理员!")
                : je({ status: "submitNew", newRecordCode: e.data });
          })
          .catch(function (e) {
            var n = e.response;
            (n = JSON.parse(n)),
              o.a.hideIndicator(),
              n.errors && n.errors.length > 0
                ? o.a.toast(n.errors[0].defaultMessage)
                : o.a.toast("提交信息失败!");
          });
      },
      ke = function (e) {
        Object(h.b)(
          "/api/companionRecord/updatPersonRecord",
          pe({}, e, { updateCount: 1, recordId: fe.recordCode })
        ).then(
          function (e) {
            var n;
            o.a.hideIndicator(),
              e.error
                ? ((n =
                    "string" == typeof e.data
                      ? e.data
                      : "未知错误，请联系管理员!"),
                  o.a.toast(n))
                : je({ status: "submitEdit", newRecordCode: e.data });
          },
          function (e) {
            var n = e.response;
            (n = JSON.parse(n)),
              o.a.hideIndicator(),
              n.errors && n.errors.length > 0
                ? o.a.toast(n.errors[0].defaultMessage)
                : o.a.toast("修改信息失败!");
          }
        );
      },
      Se = function () {
        var e = fe.recordCode;
        e
          ? Object(h.a)("/api/companionRecord/page", { recordId: e })
              .then(function (e) {
                var n,
                  t = "1" === fe.isLeave,
                  a = !1;
                if (e)
                  if (e.length > 0) {
                    var i = e[0];
                    (he = i || {}),
                      t
                        ? (function (e, n) {
                            P(e, n.idCardType),
                              e.find('[name="name"]').val(n.name),
                              e.find('[name="idCardType"]').val(n.idCardType),
                              e.find('[name="idCardNum"]').val(n.idCardNum),
                              L(e, {
                                provinceName: "domicileProv",
                                provinceValue: n.domicileProv,
                                cityName: "domicileCity",
                                cityValue: n.domicileCity,
                              }),
                              C(e),
                              O(e, function () {
                                window.config.depart_country_type &&
                                window.config.depart_country
                                  ? (e.find("#departHomeOrAbroad").show(),
                                    e.find("#departNation").hide(),
                                    e.find("#departPCA").show(),
                                    e.find("#departPCA").css("display", "flex"))
                                  : (e.find("#departHomeOrAbroad").hide(),
                                    e.find("#departNation").hide());
                              }),
                              e.find('[name="phone"]').val(n.phone),
                              Ce();
                          })(be, i)
                        : (Object(y.m)(
                            be,
                            pe({}, i, {
                              destDate: (i.destDate || "").split(" ")[0],
                            })
                          ),
                          P(be, i.idCardType),
                          L(be, {
                            provinceName: "domicileProv",
                            provinceValue: i.domicileProv,
                            cityName: "domicileCity",
                            cityValue: i.domicileCity,
                          }),
                          (a = D(be, {
                            provinceValue: i.destProv,
                            cityValue: i.destCity,
                            areaValue: i.destDistrict,
                            streetValue: i.destStreet,
                          })),
                          fe.personType === _.c
                            ? (be
                                .find("[name=destDate]")
                                .attr("placeholder", null),
                              T(be),
                              "".concat(i.departCountryType) === _.b
                                ? (!(function (e, n) {
                                    var t = n.departCountryTypeName,
                                      a = n.departCountryTypeValue,
                                      o = n.departCountryName,
                                      i = n.departCountryValue;
                                    if (e) {
                                      if (
                                        t &&
                                        a &&
                                        window.config.depart_country_type &&
                                        window.config.depart_country
                                      ) {
                                        var r = JSON.parse(
                                            window.config.depart_country_type
                                          ),
                                          c = Object.keys(r)
                                            .map(function (e) {
                                              return "<option value='"
                                                .concat(e, "'>")
                                                .concat(r[e], "</option>");
                                            })
                                            .join("");
                                        e
                                          .find("[name='departCountryType']")
                                          .html(c),
                                          e
                                            .find("[name='departCountryType']")
                                            .val(a);
                                      }
                                      if (o && i) {
                                        var l = JSON.parse(
                                            window.config.depart_country
                                          ),
                                          d = Object.keys(l)
                                            .map(function (e) {
                                              return "<option value='"
                                                .concat(l[e], "'>")
                                                .concat(l[e], "</option>");
                                            })
                                            .join("");
                                        e
                                          .find("#departNation")
                                          .find("select")
                                          .html(
                                            "<option value='' selected style='display:none'>请选择国家</option>" +
                                              d
                                          ),
                                          e
                                            .find("#departNation")
                                            .find("select")
                                            .val(i);
                                      }
                                    }
                                  })(be, {
                                    departCountryTypeName: "departCountryType",
                                    departCountryTypeValue: i.departCountryType,
                                    departCountryName: "departCountry",
                                    departCountryValue: i.departCountry,
                                  }),
                                  be.find("#departNation").show(),
                                  be.find("#departPCA").hide())
                                : "".concat(i.departCountryType) === _.a &&
                                  (L(be, {
                                    departCountryTypeName: "departCountryType",
                                    departCountryTypeValue: i.departCountryType,
                                    provinceName: "departProv",
                                    provinceValue: i.departProv,
                                    cityName: "departCity",
                                    cityValue: i.departCity,
                                    areaName: "departDistrict",
                                    areaValue: i.departDistrict,
                                  }),
                                  O(be, function () {
                                    window.config.depart_country_type &&
                                    window.config.depart_country
                                      ? (o()("#departHomeOrAbroad").show(),
                                        o()("#departNation").hide(),
                                        o()("#departPCA").show(),
                                        o()("#departPCA").css(
                                          "display",
                                          "flex"
                                        ))
                                      : (o()("#departHomeOrAbroad").hide(),
                                        o()("#departNation").hide());
                                  }),
                                  be.find("#departNation").hide(),
                                  be.find("#departPCA").show(),
                                  be.find("#departPCA").css("display", "flex")))
                            : fe.personType === _.d &&
                              (Object(y.m)(be, i), j(be))),
                      "true" === fe.errorIdentity
                        ? (k(be),
                          (function (e, n) {
                            [
                              "name",
                              "idCardType",
                              "idCardNum",
                              "nationality",
                              "domicileProv",
                              "domicileCity",
                              "destStreet",
                            ].forEach(function (t) {
                              n
                                ? (e
                                    .find('[name="'.concat(t, '"]'))
                                    .attr("reaonly", !0),
                                  e
                                    .find('[name="'.concat(t, '"]'))
                                    .attr("disabled", !0))
                                : (e
                                    .find('[name="'.concat(t, '"]'))
                                    .removeAttr("disabled"),
                                  e
                                    .find('[name="'.concat(t, '"]'))
                                    .removeAttr("readonly"),
                                  e
                                    .find('[name="'.concat(t, '"]'))
                                    .css("color", ""));
                            });
                          })(be, !1),
                          (n = se()({
                            formStatus: "showSubmitEdit",
                            statusList: ye,
                            isLeave: "1" === fe.isLeave,
                          })),
                          be.find(".page-footer").html(n),
                          be
                            .find("#editBtn")
                            .off()
                            .click(function () {
                              Object(m.b)(function () {
                                oe(be, fe, ke, he, {
                                  name: be.find('[name="name"]').val(),
                                  idCardType: be
                                    .find('[name="idCardType"]')
                                    .val(),
                                  idCardNum: be
                                    .find('[name="idCardNum"]')
                                    .val(),
                                  nationality: be
                                    .find('[name="nationality"]')
                                    .val(),
                                  domicileProv: be
                                    .find('[name="domicileProv"]')
                                    .val(),
                                  domicileCity: be
                                    .find('[name="domicileCity"]')
                                    .val(),
                                  destStreet: be
                                    .find('[name="destStreet"]')
                                    .val(),
                                });
                              });
                            }))
                        : 0 !== i.updateCount
                        ? !t && a
                          ? x(be, function () {
                              A(be, i);
                            })
                          : fe.hasChooseType && "true" === fe.hasChooseType
                          ? A(be, i)
                          : t || (k(be), Oe(i))
                        : 0 === i.updateCount && a
                        ? (k(be),
                          (function (e, n) {
                            n
                              ? (e
                                  .find('[name="destStreet"]')
                                  .attr("readonly", !0),
                                e
                                  .find('[name="destStreet"]')
                                  .attr("disabled", !0))
                              : (e
                                  .find('[name="destStreet"]')
                                  .removeAttr("disabled"),
                                e
                                  .find('[name="destStreet"]')
                                  .removeAttr("readonly"),
                                e.find('[name="destStreet"]').css("color", ""));
                          })(be, !1),
                          x(be),
                          (function () {
                            var e = se()({
                              formStatus: "showSubmitEdit",
                              statusList: ye,
                              isLeave: "1" === fe.isLeave,
                            });
                            be.find(".page-footer").html(e),
                              be
                                .find("#editBtn")
                                .off()
                                .click(function () {
                                  Object(m.b)(function () {
                                    oe(be, fe, ke, he, {
                                      destStreet: be
                                        .find('[name="destStreet"]')
                                        .val(),
                                    });
                                  });
                                });
                          })())
                        : t || k(be);
                  } else 0 === e.length && w(be, fe);
              })
              .catch(function (e) {
                o.a.toast(e || "表单信息获取失败!"), console.log(e);
              })
          : w(be, fe);
      },
      Pe = be;
    Object(i.a)(function () {
      o()("#register-form").html(Pe);
    });
  },
  11: function (e, n, t) {
    "use strict";
    t.d(n, "b", function () {
      return o;
    }),
      t.d(n, "a", function () {
        return i;
      });
    var a = t(2);
    function o(e, n, t) {
      Object(a.a)("/api/system/conf/query", { paramName: t || "" })
        .then(function (n) {
          !(function (n) {
            var t = n.reduce(function (e, n) {
              return (e[n.paramName] = n.paramValue), e;
            }, {});
            e(t);
          })(n);
        })
        .catch(function (e) {
          n || ($.toast && $.toast("配置文件获取失败!"));
        });
    }
    function i(e, n) {
      Object(a.a)("/api/cuser/getAreaInfo")
        .then(function (n) {
          var t = n.data[0].child,
            a = {};
          (a.pca = t), e(a);
        })
        .catch(function () {
          n || ($.toast && $.toast("地区信息获取失败!"));
        });
    }
  },
  12: function (e, n, t) {
    var a = t(16),
      o = t(17),
      i = t(18),
      r = t(20);
    e.exports = function (e, n) {
      return a(e) || o(e, n) || i(e, n) || r();
    };
  },
  14: function (e, n, t) {
    "use strict";
    function a() {
      var e = new AMap.Geolocation({ enableHighAccuracy: !0, convert: !0 }),
        n = new AMap.Geocoder();
      return new Promise(function (t, a) {
        return e.getCurrentPosition(function (e, o) {
          "complete" == e
            ? n.getAddress([o.position.lng, o.position.lat], function (e, n) {
                "complete" === e &&
                  "OK" === n.info &&
                  t({
                    lng: String(o.position.lng),
                    lat: String(o.position.lat),
                    area: n.regeocode.formattedAddress,
                  });
              })
            : (console.log("get position error: " + o.message), a());
        });
      });
    }
    function o(e, n, t) {
      a()
        .then(function (a) {
          $.ajax({
            url: "/api/locationRecord/save",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
              recordId: e,
              lng: String(a.lng),
              lat: String(a.lat),
              area: a.area,
            }),
            success: function (e) {
              n && n();
            },
            error: function (e) {
              console.log("/api/locationRecord/save调用失败"), t && t();
            },
          });
        })
        .catch(function () {
          t && t();
        });
    }
    t.d(n, "a", function () {
      return a;
    }),
      t.d(n, "b", function () {
        return o;
      });
  },
  16: function (e, n) {
    e.exports = function (e) {
      if (Array.isArray(e)) return e;
    };
  },
  17: function (e, n) {
    e.exports = function (e, n) {
      if ("undefined" != typeof Symbol && Symbol.iterator in Object(e)) {
        var t = [],
          a = !0,
          o = !1,
          i = void 0;
        try {
          for (
            var r, c = e[Symbol.iterator]();
            !(a = (r = c.next()).done) &&
            (t.push(r.value), !n || t.length !== n);
            a = !0
          );
        } catch (e) {
          (o = !0), (i = e);
        } finally {
          try {
            a || null == c.return || c.return();
          } finally {
            if (o) throw i;
          }
        }
        return t;
      }
    };
  },
  18: function (e, n, t) {
    var a = t(19);
    e.exports = function (e, n) {
      if (e) {
        if ("string" == typeof e) return a(e, n);
        var t = Object.prototype.toString.call(e).slice(8, -1);
        return (
          "Object" === t && e.constructor && (t = e.constructor.name),
          "Map" === t || "Set" === t
            ? Array.from(t)
            : "Arguments" === t ||
              /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
            ? a(e, n)
            : void 0
        );
      }
    };
  },
  19: function (e, n) {
    e.exports = function (e, n) {
      (null == n || n > e.length) && (n = e.length);
      for (var t = 0, a = new Array(n); t < n; t++) a[t] = e[t];
      return a;
    };
  },
  2: function (e, n, t) {
    "use strict";
    t.d(n, "a", function () {
      return p;
    }),
      t.d(n, "b", function () {
        return f;
      });
    var a = t(5),
      o = t.n(a),
      i = t(0),
      r = t.n(i),
      c = t(3),
      l = t(1);
    function d(e, n) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var a = Object.getOwnPropertySymbols(e);
        n &&
          (a = a.filter(function (n) {
            return Object.getOwnPropertyDescriptor(e, n).enumerable;
          })),
          t.push.apply(t, a);
      }
      return t;
    }
    function s(e) {
      for (var n = 1; n < arguments.length; n++) {
        var t = null != arguments[n] ? arguments[n] : {};
        n % 2
          ? d(Object(t), !0).forEach(function (n) {
              o()(e, n, t[n]);
            })
          : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
          : d(Object(t)).forEach(function (n) {
              Object.defineProperty(
                e,
                n,
                Object.getOwnPropertyDescriptor(t, n)
              );
            });
      }
      return e;
    }
    var u = function (e, n, t, a) {
        var o = {
          url: e,
          type: n,
          dataType: "json",
          cache: !1,
          xhrFields: { withCredentials: !0 },
          headers: { phone: Object(l.o)("phone") },
        };
        return (
          "POST" === n && (o.contentType = "application/json"),
          t && (o.data = t),
          a && (o.headers = s({}, o.headers, {}, a)),
          c.a.show(),
          new Promise(function (e, n) {
            r.a.ajax(
              s({}, o, {
                success: function (n) {
                  e(n), c.a.hide();
                },
                error: function (e) {
                  n(e), c.a.hide();
                },
              })
            );
          })
        );
      },
      p = function (e, n) {
        var t =
          arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        return u(e, "GET", n, t);
      },
      f = function (e, n) {
        var t =
          arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
        return u(e, "POST", JSON.stringify(n), t);
      };
  },
  20: function (e, n) {
    e.exports = function () {
      throw new TypeError(
        "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
      );
    };
  },
  23: function (module, exports) {
    module.exports = function (obj) {
      obj || (obj = {});
      var __t,
        __p = "",
        __j = Array.prototype.join;
      function print() {
        __p += __j.call(arguments, "");
      }
      with (obj)
        (formStatus !== statusList[1] && formStatus !== statusList[2]) ||
          isLeave ||
          (__p +=
            '\n<p style="color: red;text-align: center;font-size: 0.7rem;">\n  <span>您只有一次修改机会，请慎重</span>\n</p>\n'),
          (__p += " "),
          formStatus === statusList[0] &&
            (__p +=
              '\n<p>\n  <a id="submitBtn" class="button button-big button-fill">提交表单</a>\n</p>\n'),
          formStatus === statusList[1] &&
            ((__p +=
              '\n<p>\n  <a id="editBtn" class="button button-big button-fill"\n    >'),
            isLeave ? (__p += " 保存信息 ") : (__p += "提交修改 "),
            (__p += "\n  </a>\n</p>\n")),
          (__p += " "),
          formStatus === statusList[2] &&
            (__p +=
              '\n<p>\n  <span class="button button-big button-fill" id="personnelType-btn"\n    >修改信息</span\n  >\n</p>\n'),
          formStatus === statusList[4] &&
            (__p +=
              '\n  <p>\n    <span class="button button-big button-fill" id="logout">退出登录</span>\n  </p>\n'),
          (__p += "\n");
      return __p;
    };
  },
  25: function (e, n, t) {
    var a = t(39);
    e.exports = function (e, n) {
      if (null == e) return {};
      var t,
        o,
        i = a(e, n);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        for (o = 0; o < r.length; o++)
          (t = r[o]),
            n.indexOf(t) >= 0 ||
              (Object.prototype.propertyIsEnumerable.call(e, t) &&
                (i[t] = e[t]));
      }
      return i;
    };
  },
  3: function (e, n, t) {
    "use strict";
    function a() {
      this.count = 0;
    }
    (a.prototype.show = function () {
      this.count++, this.count > 0 && $.showIndicator && $.showIndicator();
    }),
      (a.prototype.hide = function () {
        this.count--, this.count < 1 && $.hideIndicator && $.hideIndicator();
      }),
      (n.a = new a());
  },
  31: function (e, n, t) {
    "use strict";
    t.d(n, "a", function () {
      return r;
    });
    var a = t(4),
      o = t.n(a),
      i = t(6);
    function r(e) {
      o.a.parse(location.search).recordId ||
      "#success" === location.hash ||
      "#form" === location.hash ||
      "/localpeople.html" === location.pathname
        ? Object(i.d)()
        : e
        ? e()
        : Object(i.d)();
    }
  },
  39: function (e, n) {
    e.exports = function (e, n) {
      if (null == e) return {};
      var t,
        a,
        o = {},
        i = Object.keys(e);
      for (a = 0; a < i.length; a++)
        (t = i[a]), n.indexOf(t) >= 0 || (o[t] = e[t]);
      return o;
    };
  },
  4: function (e, n, t) {
    "use strict";
    const a = t(7),
      o = t(8),
      i = t(9);
    function r(e) {
      if ("string" != typeof e || 1 !== e.length)
        throw new TypeError(
          "arrayFormatSeparator must be single character string"
        );
    }
    function c(e, n) {
      return n.encode ? (n.strict ? a(e) : encodeURIComponent(e)) : e;
    }
    function l(e, n) {
      return n.decode ? o(e) : e;
    }
    function d(e) {
      const n = e.indexOf("#");
      return -1 !== n && (e = e.slice(0, n)), e;
    }
    function s(e) {
      const n = (e = d(e)).indexOf("?");
      return -1 === n ? "" : e.slice(n + 1);
    }
    function u(e, n) {
      return (
        n.parseNumbers &&
        !Number.isNaN(Number(e)) &&
        "string" == typeof e &&
        "" !== e.trim()
          ? (e = Number(e))
          : !n.parseBooleans ||
            null === e ||
            ("true" !== e.toLowerCase() && "false" !== e.toLowerCase()) ||
            (e = "true" === e.toLowerCase()),
        e
      );
    }
    function p(e, n) {
      r(
        (n = Object.assign(
          {
            decode: !0,
            sort: !0,
            arrayFormat: "none",
            arrayFormatSeparator: ",",
            parseNumbers: !1,
            parseBooleans: !1,
          },
          n
        )).arrayFormatSeparator
      );
      const t = (function (e) {
          let n;
          switch (e.arrayFormat) {
            case "index":
              return (e, t, a) => {
                (n = /\[(\d*)\]$/.exec(e)),
                  (e = e.replace(/\[\d*\]$/, "")),
                  n
                    ? (void 0 === a[e] && (a[e] = {}), (a[e][n[1]] = t))
                    : (a[e] = t);
              };
            case "bracket":
              return (e, t, a) => {
                (n = /(\[\])$/.exec(e)),
                  (e = e.replace(/\[\]$/, "")),
                  n
                    ? void 0 !== a[e]
                      ? (a[e] = [].concat(a[e], t))
                      : (a[e] = [t])
                    : (a[e] = t);
              };
            case "comma":
            case "separator":
              return (n, t, a) => {
                const o =
                  "string" == typeof t &&
                  t.split("").indexOf(e.arrayFormatSeparator) > -1
                    ? t.split(e.arrayFormatSeparator).map((n) => l(n, e))
                    : null === t
                    ? t
                    : l(t, e);
                a[n] = o;
              };
            default:
              return (e, n, t) => {
                void 0 !== t[e] ? (t[e] = [].concat(t[e], n)) : (t[e] = n);
              };
          }
        })(n),
        a = Object.create(null);
      if ("string" != typeof e) return a;
      if (!(e = e.trim().replace(/^[?#&]/, ""))) return a;
      for (const o of e.split("&")) {
        let [e, r] = i(n.decode ? o.replace(/\+/g, " ") : o, "=");
        (r = void 0 === r ? null : "comma" === n.arrayFormat ? r : l(r, n)),
          t(l(e, n), r, a);
      }
      for (const e of Object.keys(a)) {
        const t = a[e];
        if ("object" == typeof t && null !== t)
          for (const e of Object.keys(t)) t[e] = u(t[e], n);
        else a[e] = u(t, n);
      }
      return !1 === n.sort
        ? a
        : (!0 === n.sort
            ? Object.keys(a).sort()
            : Object.keys(a).sort(n.sort)
          ).reduce((e, n) => {
            const t = a[n];
            return (
              Boolean(t) && "object" == typeof t && !Array.isArray(t)
                ? (e[n] = (function e(n) {
                    return Array.isArray(n)
                      ? n.sort()
                      : "object" == typeof n
                      ? e(Object.keys(n))
                          .sort((e, n) => Number(e) - Number(n))
                          .map((e) => n[e])
                      : n;
                  })(t))
                : (e[n] = t),
              e
            );
          }, Object.create(null));
    }
    (n.extract = s),
      (n.parse = p),
      (n.stringify = (e, n) => {
        if (!e) return "";
        r(
          (n = Object.assign(
            {
              encode: !0,
              strict: !0,
              arrayFormat: "none",
              arrayFormatSeparator: ",",
            },
            n
          )).arrayFormatSeparator
        );
        const t = (function (e) {
            switch (e.arrayFormat) {
              case "index":
                return (n) => (t, a) => {
                  const o = t.length;
                  return void 0 === a || (e.skipNull && null === a)
                    ? t
                    : null === a
                    ? [...t, [c(n, e), "[", o, "]"].join("")]
                    : [...t, [c(n, e), "[", c(o, e), "]=", c(a, e)].join("")];
                };
              case "bracket":
                return (n) => (t, a) =>
                  void 0 === a || (e.skipNull && null === a)
                    ? t
                    : null === a
                    ? [...t, [c(n, e), "[]"].join("")]
                    : [...t, [c(n, e), "[]=", c(a, e)].join("")];
              case "comma":
              case "separator":
                return (n) => (t, a) =>
                  null == a || 0 === a.length
                    ? t
                    : 0 === t.length
                    ? [[c(n, e), "=", c(a, e)].join("")]
                    : [[t, c(a, e)].join(e.arrayFormatSeparator)];
              default:
                return (n) => (t, a) =>
                  void 0 === a || (e.skipNull && null === a)
                    ? t
                    : null === a
                    ? [...t, c(n, e)]
                    : [...t, [c(n, e), "=", c(a, e)].join("")];
            }
          })(n),
          a = Object.assign({}, e);
        if (n.skipNull)
          for (const e of Object.keys(a))
            (void 0 !== a[e] && null !== a[e]) || delete a[e];
        const o = Object.keys(a);
        return (
          !1 !== n.sort && o.sort(n.sort),
          o
            .map((a) => {
              const o = e[a];
              return void 0 === o
                ? ""
                : null === o
                ? c(a, n)
                : Array.isArray(o)
                ? o.reduce(t(a), []).join("&")
                : c(a, n) + "=" + c(o, n);
            })
            .filter((e) => e.length > 0)
            .join("&")
        );
      }),
      (n.parseUrl = (e, n) => ({
        url: d(e).split("?")[0] || "",
        query: p(s(e), n),
      })),
      (n.stringifyUrl = (e, t) => {
        const a = d(e.url).split("?")[0] || "",
          o = n.extract(e.url),
          i = n.parse(o),
          r = (function (e) {
            let n = "";
            const t = e.indexOf("#");
            return -1 !== t && (n = e.slice(t)), n;
          })(e.url),
          c = Object.assign(i, e.query);
        let l = n.stringify(c, t);
        return l && (l = `?${l}`), `${a}${l}${r}`;
      });
  },
  48: function (module, exports) {
    module.exports = function (obj) {
      obj || (obj = {});
      var __t,
        __p = "",
        __j = Array.prototype.join;
      function print() {
        __p += __j.call(arguments, "");
      }
      with (obj)
        (__p +=
          '<div class="page page-current">\n  <header class="bar bar-nav">\n    <h1 class="bar-nav-tilte title"></h1>\n  </header>\n  <div class="notice-info" style="display: none;">\n    <div class="card">\n      <div class="card-content" style="width:50px">\n        <div class="card-content-inner">\n          <div class="notice-logo"></div>\n        </div>\n      </div>\n      <div class="card-content">\n        <div class="card-content-inner top-info"></div>\n      </div>\n    </div>\n  </div>\n  <div class="content">\n    <div class="list-block ajust" id="contentBlockAdjust">\n      <ul>\n        <li>\n          <div class="item-content">\n            <div class="item-content-title">\n              <span class="title-dot"></span>基本信息\n              <span id="getOcr">\n                <input\n                  id="uploadOcr"\n                  type="file"\n                  accept="image/*"\n                  class="uploadOcr"\n                />\n              </span>\n              <span class="ocrText">（拍照识别）</span>\n            </div>\n            <form id="registerForm" style="width:100%">\n              <div class="item-content-body">\n                <div class="item-inner">\n                  <div class="item-title label">\n                    姓名\n                    <span class="contrast">（ Name ）</span>\n                  </div>\n                  <div class="item-input">\n                    <input\n                      type="text"\n                      placeholder="填写您的姓名（必填）"\n                      name="name"\n                    />\n                  </div>\n                </div>\n                <div class="item-inner">\n                  <div class="item-title label">\n                    证件\n                    <span class="contrast">（ ID Document ）</span>\n                  </div>\n                  <div class="item-input item-selects">\n                    <select name="idCardType">\n                      <option value="1" selected>身份证</option>\n                      <option value="3">台胞证</option>\n                      <option value="4">回乡证</option>\n                      <option value="5">护照</option>\n                      \x3c!--<option value="2">其他</option>--\x3e\n                    </select>\n                    <input\n                      type="text"\n                      placeholder="请填写18位身份证号码（必填）"\n                      name="idCardNum"\n                      style="margin-left:0.3rem;margin-top:0;margin-bottom:0"\n                    />\n                  </div>\n                </div>\n                <div class="item-inner" id="nationalityContainer">\n                  <div class="item-title label">\n                    国籍\n                    <span class="contrast">（ Nationality ）</span>\n                  </div>\n                  <div class="item-input">\n                    <input\n                      type="text"\n                      placeholder="请填写户籍所在国家或地区"\n                      name="nationality"\n                    />\n                  </div>\n                </div>\n                <div class="item-inner" id="domicileContainer">\n                  <div class="item-title label">\n                    户籍地\n                  </div>\n                  <div class="item-input item-selects">\n                    <select name="domicileProv" class="provinces">\n                      <option value="" disabled selected style="display:none;"\n                        >省（必填）</option\n                      >\n                    </select>\n                    <select name="domicileCity" class="city">\n                      <option value="" disabled selected style="display:none;"\n                        >市（必填）</option\n                      >\n                    </select>\n                    <div></div>\n                  </div>\n                </div>\n                '),
          urlParsed.personType === PERSON_TYPE_COME &&
            (__p +=
              '\n                <div class="item-inner">\n                  <div class="item-title label" id="destDateLabel"></div>\n                  <div class="item-input">\n                    <input type="date" name="destDate" />\n                  </div>\n                </div>\n                '),
          (__p +=
            '\n                <div class="item-inner">\n                  <div class="item-title label" id="destProvLabel"></div>\n                  <div class="item-input item-selects">\n                    <select name="destProv" class="provinces">\n                      <option value="" disabled selected style="display:none;"\n                        >省（必填）</option\n                      >\n                    </select>\n                    <select name="destCity" class="city">\n                      <option value="" disabled selected style="display:none;"\n                        >市（必填）</option\n                      >\n                    </select>\n                    <select\n                      name="destDistrict"\n                      class="area"\n                      label="default-area"\n                    >\n                      <option value="" disabled selected style="display:none;"\n                        >区（必填）</option\n                      >\n                    </select>\n                  </div>\n                  <div class="item-input item-selects">\n                    <select\n                      name="destStreet"\n                      class="street"\n                      label="default-area"\n                      style="width: 100%"\n                    >\n                      <option value="" disabled selected style="display:none;"\n                        >街道/镇（必填）</option\n                      >\n                    </select>\n                  </div>\n                  <div class="item-input">\n                    <input\n                      type="text"\n                      placeholder="小区/村/酒店（必填）"\n                      name="destArea"\n                    />\n                    <input\n                      type="text"\n                      placeholder="单元号/门牌号码"\n                      name="destAddr"\n                    />\n                  </div>\n                </div>\n                '),
          urlParsed.parentRecordCode &&
            (__p +=
              '\n                <div class="item-inner">\n                  <div class="item-title label">\n                    与我的关系\n                    <span class="contrast">（ Relationships ）</span>\n                  </div>\n                  <div class="item-input item-selects">\n                    <select name="relType" style="width:100%">\n                      <option value="" disabled selected style="display:none;">\n                        关系（必填）\n                      </option>\n                      <option value="1">子女</option>\n                      <option value="2">父母</option>\n                      <option value="3">夫妻</option>\n                      <option value="4">朋友</option>\n                      <option value="5">同事</option>\n                      <option value="6">兄弟</option>\n                      <option value="7">姐妹</option>\n                      <option value="8">其他</option>\n                    </select>\n                  </div>\n                </div>\n                '),
          (__p +=
            '\n                <div class="item-inner">\n                  <div class="item-title label">\n                    电话\n                    <span class="contrast">（ Cellphone No. ）</span>\n                  </div>\n                  <div class="item-input">\n                    '),
          urlParsed.parentRecordCode
            ? (__p +=
                '\n                    <input\n                      type="text"\n                      placeholder="填写11位手机号码"\n                      name="phone"\n                    />\n                    ')
            : urlParsed.phone &&
              (__p +=
                '\n                    <input\n                      type="text"\n                      placeholder="填写11位手机号码（必填）"\n                      name="phone"\n                      readonly\n                    />\n                    '),
          (__p +=
            "\n                  </div>\n                </div>\n                "),
          urlParsed.personType === PERSON_TYPE_COME &&
            (__p +=
              '\n                <div class="item-inner">\n                  <div class="item-title label">\n                    出发地\n                    <span class="contrast">（ Depart from ）</span>\n                  </div>\n                  <div class="item-input item-selects" id="departHomeOrAbroad">\n                    <select\n                      style="width: 100%;"\n                      name="departCountryType"\n                    ></select>\n                  </div>\n                  <div class="item-input item-selects" id="departNation">\n                    <select style="width: 100%;" name="departCountry"></select>\n                  </div>\n                  <div class="item-input item-selects" id="departPCA">\n                    <select name="departProv" class="provinces">\n                      <option value="" disabled selected style="display:none;"\n                        >省（必填）</option\n                      >\n                    </select>\n                    <select name="departCity" class="city">\n                      <option value="" disabled selected style="display:none;"\n                        >市（必填）</option\n                      >\n                    </select>\n                    <select name="departDistrict" class="area">\n                      <option value="" disabled selected style="display:none;"\n                        >区（必填）</option\n                      >\n                    </select>\n                  </div>\n                </div>\n                '),
          (__p += " "),
          urlParsed.personType === PERSON_TYPE_COME &&
            (__p +=
              '\n                <div class="item-inner">\n                  <div class="item-title label">\n                    交通方式\n                    <span class="contrast">（ Come to Xuzhou By ）</span>\n                  </div>\n                  <div class="item-input item-selects">\n                    <select style="width:100%" name="travelType">\n                      <option value="" disabled selected style="display:none;"\n                        >请选择出行方式（必填）</option\n                      >\n                      <option value="1">汽车</option>\n                      <option value="2">火车</option>\n                      <option value="3">飞机</option>\n                      <option value="4">其他</option>\n                    </select>\n                  </div>\n                  <div class="item-input trip-license" style="display: none">\n                    <input\n                      type="text"\n                      placeholder="填写车牌号码/航班号/车次/其他（必填）"\n                      class="travelNoUpperCase"\n                      name="travelNo"\n                    />\n                  </div>\n                </div>\n                '),
          (__p += " "),
          urlParsed.personType === PERSON_TYPE_LOCAL &&
            (__p +=
              '\n                <div class="item-inner isLocal">\n                  <div class="item-title label">\n                    常用交通工具\n                    <span class="contrast">（ Come to Xuzhou By ）</span>\n                  </div>\n                  <div class="item-input item-selects">\n                    <select style="width:100%" name="localTravelType">\n                      <option value="" disabled selected style="display:none;"\n                        >请选择出行方式（必填）</option\n                      >\n                      <option value="1">私家车</option>\n                      <option value="2">公交车</option>\n                      <option value="3">电动车</option>\n                      <option value="4">其他</option>\n                    </select>\n                  </div>\n                  <div class="item-input trip-license" style="display: none">\n                    <input\n                      type="text"\n                      placeholder="车牌号码/公交车次"\n                      class="travelNoUpperCase"\n                      name="localTravelNo"\n                    />\n                  </div>\n                </div>\n                '),
          (__p +=
            '\n                <div class="item-inner">\n                  <div class="item-title label" id="objectiveLabel"></div>\n                  <div class="item-input item-selects">\n                    <select style="width:100%" name="objective">\n                      <option value="" disabled selected style="display:none;"\n                        >请选择</option\n                      >\n                      <option value="0">工作</option>\n                      <option value="1">上学</option>\n                      <option value="2">回家</option>\n                      <option value="10">其他</option>\n                    </select>\n                  </div>\n                  <div class="item-input">\n                    <input\n                      type="text"\n                      placeholder="（工作/上学）单位名称"\n                      name="orgName"\n                    />\n                  </div>\n                  <div class="item-input">\n                    <input\n                      type="text"\n                      placeholder="（工作/上学）单位地址"\n                      name="orgAddress"\n                    />\n                  </div>\n                </div>\n                <div class="item-inner">\n                  <div class="item-title label">\n                    <span class="item-subtitle">有无发热或咳嗽无力等症状</span>\n                  </div>\n                  <span class="contrast"\n                    >（ Do you have any symptoms as fever,cough,or fatigue?\n                    ）</span\n                  >\n                  <div class="item-title label">\n                    <input type="radio" value="0" name="fever" /><label\n                      >有</label\n                    >\n                    <input\n                      type="radio"\n                      value="1"\n                      name="fever"\n                      checked="true"\n                    /><label>无</label>\n                  </div>\n                </div>\n                <div class="item-inner">\n                  <div class="item-title label">\n                    <span class="item-subtitle"\n                      >14天内是否接触过发热咳嗽的人员</span\n                    >\n                  </div>\n                  <span class="contrast"\n                    >（ Any intimate contact with anyone who is sick with fever or couogh in the last 14 days? ）</span\n                  >\n                  <div class="item-title label">\n                    <input type="radio" value="0" name="contactFever" /><label\n                      >是</label\n                    >\n                    <input\n                      type="radio"\n                      value="1"\n                      name="contactFever"\n                      checked="true"\n                    /><label>否</label>\n                  </div>\n                </div>\n                <div class="item-inner">\n                  <div class="item-title label">\n                    <span class="item-subtitle">是否被确诊为新冠感染患者</span>\n                  </div>\n                  <span class="contrast"\n                    >（ Have you been diagnosed with  COVID-19? ）</span\n                  >\n                  <div class="item-title label">\n                    <input\n                      type="radio"\n                      value="0"\n                      name="confirmedInfection"\n                    /><label>是</label>\n                    <input\n                      type="radio"\n                      value="1"\n                      name="confirmedInfection"\n                      checked="true"\n                    /><label>否</label>\n                  </div>\n                </div>\n                <input name="source" value="1" style="display: none;" />\n              </div>\n            </form>\n          </div>\n        </li>\n      </ul>\n      <div class="content-block page-footer"></div>\n      <div class="friendship-remind"></div>\n      <div class="page-register" style="padding: 0 0.75rem"></div>\n      <div class="aliyun-support">阿里云计算有限公司提供支持</div>\n    </div>\n  </div>\n</div>\n');
      return __p;
    };
  },
  5: function (e, n) {
    e.exports = function (e, n, t) {
      return (
        n in e
          ? Object.defineProperty(e, n, {
              value: t,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            })
          : (e[n] = t),
        e
      );
    };
  },
  6: function (e, n, t) {
    "use strict";
    t.d(n, "c", function () {
      return c;
    }),
      t.d(n, "d", function () {
        return l;
      }),
      t.d(n, "a", function () {
        return d;
      }),
      t.d(n, "b", function () {
        return s;
      });
    var a = t(1),
      o = t(2),
      i = t(4),
      r = t.n(i);
    function c() {
      Object(a.l)("access_token"),
        Object(a.l)("refresh_token"),
        Object(o.a)("/api/cuser/loginOut").finally(function () {
          l();
        });
    }
    function l() {
      Object(a.v)("sign_phone"),
        Object(a.v)("sign_pwd"),
        location.replace("./signup.html");
    }
    function d(e, n, t) {
      var a = !t,
        i = function () {},
        c = e || i,
        d = n || i;
      function s(e, n, t) {
        var o = r.a.parse(location.search);
        o.phone && o.phone !== e.data
          ? l()
          : window.notLogin
          ? a
            ? l()
            : t()
          : n(e);
      }
      Object(o.a)("/api/cuser/getLoginStatus")
        .then(function (e) {
          (window.notLogin = !(!e.isError && !e.error)), s(e, c, d);
        })
        .catch(function (e) {
          $.toast(e), (window.notLogin = !0), s({}, c, d);
        });
    }
    function s(e) {
      !0 === window.notLogin
        ? l()
        : void 0 === window.notLogin
        ? d(e, function () {
            l();
          })
        : e();
    }
    window.notLogin = void 0;
  },
  65: function (e, n, t) {},
  7: function (e, n, t) {
    "use strict";
    e.exports = (e) =>
      encodeURIComponent(e).replace(
        /[!'()*]/g,
        (e) => `%${e.charCodeAt(0).toString(16).toUpperCase()}`
      );
  },
  8: function (e, n, t) {
    "use strict";
    var a = new RegExp("%[a-f0-9]{2}", "gi"),
      o = new RegExp("(%[a-f0-9]{2})+", "gi");
    function i(e, n) {
      try {
        return decodeURIComponent(e.join(""));
      } catch (e) {}
      if (1 === e.length) return e;
      n = n || 1;
      var t = e.slice(0, n),
        a = e.slice(n);
      return Array.prototype.concat.call([], i(t), i(a));
    }
    function r(e) {
      try {
        return decodeURIComponent(e);
      } catch (o) {
        for (var n = e.match(a), t = 1; t < n.length; t++)
          n = (e = i(n, t).join("")).match(a);
        return e;
      }
    }
    e.exports = function (e) {
      if ("string" != typeof e)
        throw new TypeError(
          "Expected `encodedURI` to be of type `string`, got `" + typeof e + "`"
        );
      try {
        return (e = e.replace(/\+/g, " ")), decodeURIComponent(e);
      } catch (n) {
        return (function (e) {
          for (var n = { "%FE%FF": "��", "%FF%FE": "��" }, t = o.exec(e); t; ) {
            try {
              n[t[0]] = decodeURIComponent(t[0]);
            } catch (e) {
              var a = r(t[0]);
              a !== t[0] && (n[t[0]] = a);
            }
            t = o.exec(e);
          }
          n["%C2"] = "�";
          for (var i = Object.keys(n), c = 0; c < i.length; c++) {
            var l = i[c];
            e = e.replace(new RegExp(l, "g"), n[l]);
          }
          return e;
        })(e);
      }
    };
  },
  9: function (e, n, t) {
    "use strict";
    e.exports = (e, n) => {
      if ("string" != typeof e || "string" != typeof n)
        throw new TypeError("Expected the arguments to be of type `string`");
      if ("" === n) return [e];
      const t = e.indexOf(n);
      return -1 === t ? [e] : [e.slice(0, t), e.slice(t + n.length)];
    };
  },
});
