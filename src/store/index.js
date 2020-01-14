import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
    	loginTitle: i18n.t('login.title'),
    	sysName: i18n.t('sysName'),
		pwdReg: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
		pwdRegTips: i18n.t('pwd.regTips'),
    	//本地存储
    	storage:{
      		menusTreeDataKey: 'menusTreeData', //菜单树
      		menusDataKey: 'menusData', //菜单
      		menuFunsDataKey: 'menuFunsData', //菜单功能（按钮）
		},
		
    	//数据字段映射
    	fields:{
      		menu: {
        		name: "sMenu_Name",
        		icon: "sMenu_Icon",
        		index: "sMenu_ID",
        		path: "sMenu_Url",
        		order: "lMenu_Order",
        		children: "children",
        		parent: "sMenu_Parent",
        		pid: "sMenu_ID",
      		},
      		menuFun: {
        		button: "sMFun_Button", //按钮权限标识
      		},
      		user: {
        		pid: "sUser_ID",
        		nick: "sUser_Nick",
        		username: "sUser_UserName",
        		password: "sUser_PassWord",
        		group: "sUser_GroupID",
        		status: "lUser_StatusFlag",
        		qq: "sUser_QQ",
        		email: "sUser_Email",
        		phone: "sUser_Phone",
        		third: "sUser_ThirdID",
        		createDate: "dUser_CreateDate",
			},
			group:{
				pid: "sGroup_ID",
				name: "sGroup_Name",
			} 
    	},
    	//缓存
    	cache: {
     		menuFunsData:'',
    	},

    	test:[]
  	},
	mutations: {
    	setTest: function(state, value){
      		state.test = value;
    	}
  	},
	actions: {
		setTest: function(context, value){
      		context.commit("setTest", value);
    	}
	},
	modules: {

	}
});
