
const zhCN = require('element-ui/lib/locale/lang/zh-CN');

const zh = Object.assign({
    sysName: "后台管理",
    res:{
        message: {
            success: "成功",
            unLoin: "未登录",
            loginTimeout: "登录已过期",
            noAuth: "没有权限.",
            failed: "失败",
        }
    },
    confirm:{
        title: "提示",
        content: "确定提交吗?", 
    },
    login: {
        title: "账号登录",
        rules:{
            username: "请输入用户名",
            password: "请请输入密码",
        },
        placeholder:{
            username: "用户名",
            password: "密码",
        },
        button:{
            login: "登录",
        },
    },
    logout: {
        confirm:{
            title: "提示",
            content: "确定退出系统吗？", 
        }
    },
    changePassword: {
        dialog: {
            title: "密码修改",
            close: "关闭",
            cancel: "取消",
            submit: "提交", 
        },
        form: {
            oldPwd: "旧密码",
            newPwd: "新密码",
            newPwd2: "确认新密码",
        }
    }
}, zhCN.default);

module.exports = zh;