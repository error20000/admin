
var localeLanguage

window.ajaxReq = function (url, param, callback, cp){
    console.log(this);
    $.ajax({
        dataType: "json",
        type: "POST",
        url: url,
        data: param,
        headers: {
            token: getLoginToken(),
            lang: getLang()
        },
        success: function(data){
            if(data.code == -203 || data.code == -111){ // token 超时
                parent.window.location.href = LOCALE_LOIN_URL;
            }
            if (typeof callback === "function") {
                callback(data, cp);
            }
        },
        error: function(data){
        }
    });
};
window.ajaxReqSync = function (url, param, callback, cp){
    $.ajax({
        dataType: "json",
        type: "POST",
        url: url,
        data: param,
        async: false,
        headers: {
            token: getLoginToken(),
            lang: getLang()
        },
        success: function(data){
            if(data.code == -203 || data.code == -111){ // token 超时
                parent.window.location.href = LOCALE_LOIN_URL;
            }
            if (typeof callback === "function") {
                callback(data, cp);
            }
        },
        error: function(data){
        }
    });
};

window.getLoginToken = function (){
    let token = localStorage.getItem(LOCALE_LOIN_USER_KEY);
    if(!token){
        return '';
    }
    return token;
};
window.getLang = function (){
    let lang = localStorage.getItem(LOCALE_LANG_KEY);
    if(!lang){
        return '';
    }
    return lang;
};

window.launchIntoFullscreen = function (element) {
    if(element.requestFullscreen){
        element.requestFullscreen();
    }
    else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
    else if(element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    else if(element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
};

window.exitFullscreen = function () {
    if(document.exitFullscreen) {
        document.exitFullscreen();
    } else if(document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if(document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
};

window.checkFullscreen = function (){
    var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
    if (fullscreenElement == null) {
        return false;
    }
    return true;
};

window.formatDate = function (d, s){
    if(!d){
        return;
    }
    var date = new Date();
    if(d){
        if(typeof d == 'object'){
            date = d;
        }else{
            if(isNaN(d)){
                date = new Date(d.replace(/-/g, "/").replace(/年/g, "/").replace(/月/g, "/").replace(/日/g, " ").replace(/时/g, ":").replace(/分/g, ":").replace(/秒/g, ""));
            }else{
                d = String(d).length == 10 ? d + "000" : String(d).length == 13 ? d : new Date().getTime() + Number(d);
                date = new Date(Number(d));
            }
        }
    }
    var weekday = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
    var weekdayS = ["日","一","二","三","四","五","六"];
    var weekdayEn = ["Sunday","Monday","Tuesday","Wednesday","Thursday ","Friday","Saturday"];
    var weekdayEnS = ["Sun.","Mon.","Tues.","Wed.","Thurs. ","Fri.","Sat."];
    var t = String(s);
    t = t.replace('yyyy', date.getFullYear());
    t = t.replace('yy', date.getYear);
    t = t.replace('MM', (date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : (date.getMonth()+1));
    t = t.replace('M', (date.getMonth()+1));
    t = t.replace('dd', date.getDate() < 10 ? "0"+date.getDate() : date.getDate());
    t = t.replace('d', date.getDate());
    t = t.replace('HH', date.getHours() < 10 ? "0"+date.getHours() : date.getHours());
    t = t.replace('H', date.getHours());
    t = t.replace('mm', date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes());
    t = t.replace('m', date.getMinutes());
    t = t.replace('ss', date.getSeconds() < 10 ? "0"+date.getSeconds() : date.getSeconds());
    t = t.replace('s', date.getSeconds());
    t = t.replace('S', date.getMilliseconds());
    t = t.replace('en:ww', weekdayEn[date.getDay()]);
    t = t.replace('en:w', weekdayEnS[date.getDay()]);
    t = t.replace('cn:ww', weekday[date.getDay()]);
    t = t.replace('cn:w', weekdayS[date.getDay()]);
    t = t.replace('ww', weekday[date.getDay()]);
    t = t.replace('w', weekdayS[date.getDay()]);
    return t;
};