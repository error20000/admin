
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
        action: "操作",
        title: {
            query: "查询",
            reset: "重置",
            import: "导入",
            export: "导出",
            add: "新增",
            edit: "编辑",
            view: "查看",
            del: "删除",
            batchDel: "批量删除",
            upload: "上传",
        }
    },
    confirm:{
        title: "提示",
        content: "确定提交吗?", 
        content2: "确定删除该条记录吗?",
    },
    status: {
        disable: "禁用",
        enable: "启用",
    },
    pwd: {
        regTips: "（密码至少包含 数字和英文，长度6-20）",
        form: {
            oldPwd: "旧密码",
            newPwd: "新密码",
            newPwd2: "确认新密码",
            pwd: "密码",
            pwd2: "确认密码",
        },
        rules: {
            oldPwd: "请输入旧密码",
            newPwd: "请输入新密码",
            newPwd2: "请再次输入新密码",
            same: "两次输入密码不一致!",
            format: "密码格式不正确!",
            pwd: "请输入密码",
            pwd2: "请再次输入密码",
        }
    },
    login: {
        title: "账号登录",
        rules:{
            username: "请输入用户名",
            password: "请输入密码",
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
        rules:{
            username: "请输入用户名",
            nick: "请输入用户昵称",
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
            password2: "确认密码",
        },
        button: {
            resetPwd: "重置密码",
            menuAuth: "菜单授权",
        }
    }
}, zhCN.default);

module.exports = zh;