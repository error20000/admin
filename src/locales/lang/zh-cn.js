
const zhCN = require('element-ui/lib/locale/lang/zh-CN');

const zh = Object.assign({
    name: "中文",
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
    label: {
        filter: "筛选",
        result: "结果",
        title: {
            query: "查询",
            reset: "重置",
            import: "导入",
            export: "导出",
            add: "新增",
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
    dialog: {
        close: "关闭",
        cancel: "取消",
        submit: "提交", 
    },
    index: {
        dropdown:{
            pwd: "修改密码",
            logout: "退出",
        },
        changePassword: {
            dialog: {
                title: "密码修改",
            },
            form: {
                oldPwd: "旧密码",
                newPwd: "新密码",
                newPwd2: "确认新密码",
            },
            rules: {
                oldPwd: "请输入旧密码",
                newPwd: "请输入新密码",
                newPwd2: "再次输入新密码",
                newPwd3: "密码不一致!",
            }
        }
    },
    //自定义
    normal: {
        fields:{
            pid: "ID",
            status: "状态",
            createDate: "创建日期",
        }
    },
    user: {
        placeholder: {
            nick: "请输入用户昵称",
            username: "请输入用户名",
            group: "请选择用户组",
        },
        fields:{
            username: "用户名",
            nick: "昵称",
            password: "密码",
            group: "用户组",
            qq: "QQ",
            email: "邮箱",
            phone: "电话",
            third: "第三方ID",
        }
    }
}, zhCN.default);

module.exports = zh;