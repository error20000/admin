module.exports = {

    //login
    loginUrl: "/api/user/login",
    isLoginUrl:  "/api/user/isLogin",
    logoutUrl: "/api/user/logout",
    authUrl: "/api/user/authMenu",
    changePwdUrl: "/api/user/changePWD",

    //user
    userUrl: {
        query: "/api/user/findPage",
        one: "/api/user/findOne",
        add: "/api/user/add",
        edit: "/api/user/update",
        del: "/api/user/delete",
        export: "/api/user/excel",
        import: "/api/user/import",
    },
    //group
    groupUrl: {
        all: "/api/group/findAll",
        query: "/api/group/findPage",
    }

}