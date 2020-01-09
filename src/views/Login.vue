<template>
	<div>
		<el-form
			size="medium"
			:model="ruleForm"
			:rules="rules"
			ref="ruleForm"
			label-position="left"
			label-width="0px"
			class="demo-ruleForm login-container"
		>
			<h3 class="title">{{this.$store.state.loginTitle}}</h3>
			<el-form-item prop="username">
				<el-input
					type="text"
					v-model="ruleForm.username"
					prefix-icon="fa fa-user"
					:placeholder="$t('login.placeholder.username')"
				></el-input>
			</el-form-item>
			<el-form-item prop="password">
				<el-input
					type="password"
					v-model="ruleForm.password"
					prefix-icon="fa fa-key"
					:placeholder="$t('login.placeholder.password')"
					@keyup.native.enter="handleSubmit"
				></el-input>
			</el-form-item>
			<!-- <el-checkbox v-model="checked" checked class="remember">remember password </el-checkbox> -->
			<el-form-item style="width:100%;">
				<el-button
					type="primary"
					style="width:100%;"
					@click.native.prevent="handleSubmit"
					:disabled="logining"
				>{{$t('login.button.login')}}</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import { loginUrl, authUrl } from "@/api";

export default {
	data: function() {
		return {
			logining: false,
			ruleForm: {
				username: "",
				password: ""
			},
			rules: {
				username: [
					{
						required: true,
						message: i18n.t("login.rules.username"),
						trigger: "blur"
					}
				],
				password: [
					{
						required: true,
						message: i18n.t("login.rules.password"),
						trigger: "blur"
					}
				]
			},
			checked: true
		};
	},
	methods: {
		handleChangeLang: function() {},
		handleSubmit: function(ev) {
			this.$refs.ruleForm.validate(valid => {
				if (valid) {
					var self = this;
					this.logining = true;
					var params = {
						username: this.ruleForm.username,
						password: this.ruleForm.password
					};
					this.ajaxReq(loginUrl, params, function(res) {
						self.logining = false;
						self.handleResOperate(res, function() {
							localStorage.setItem(LOCALE_LOIN_USER_KEY, res.data.token);
							//获取菜单
							self.userAuthMenu();
						});
					});
				} else {
					console.log("error submit!!");
					return false;
				}
			});
		},
		userAuthMenu: function() {
			var params = {};
			var self = this;
			this.ajaxReq(authUrl, params, function(res) {
				self.handleResQuery(res, function() {
					let menus = res.data.menus;
					let order = self.$store.state.fields.menu.order;
					//排序
					for (let i = 0; i < menus.length; i++) {
						for (let j = 0; j < menus.length; j++) {
							if(menus[j][order] > menus[i][order]){
								let temp = menus[i];
								menus[i] = menus[j];
								menus[j] = temp;
							}
						}
					}
					//组装树
					let menusTree = []; //menu tree
					for (var i = 0; i < menus.length; i++) {
						var node = menus[i];
						if (!node[self.$store.state.fields.menu.parent]) {
							var children = self.findChildren(node[self.$store.state.fields.menu.pid], menus);
							if (children && children.length > 0) {
								node[self.$store.state.fields.menu.children] = children;
							}
							menusTree.push(node);
						}
					}
					//本地存储
					localStorage.setItem(self.$store.state.storage.menusTreeDataKey, JSON.stringify(menusTree));
					localStorage.setItem(self.$store.state.storage.menusDataKey, JSON.stringify(res.data.menus));
					localStorage.setItem(self.$store.state.storage.menuFunsDataKey, JSON.stringify(res.data.funs));
					//跳转 index
					window.location.href = LOCALE_INDEX_URL;
				});
			});
		},
		findChildren: function(id, menus) {
			let children = [];
			for (var i = 0; i < menus.length; i++) {
				var node = menus[i];
				if (node[this.$store.state.fields.menu.parent] == id) {
					let temp = this.findChildren(node[this.$store.state.fields.menu.pid], menus);
					if (temp && temp.length > 0) {
						node[this.$store.state.fields.menu.children] = temp;
					}
					children.push(node);
				 }
			}
			return children;
		}
	},
	mounted: function() {}
};
</script>

<style scoped>
.login-container {
	/*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
	-webkit-border-radius: 5px;
	border-radius: 5px;
	-moz-border-radius: 5px;
	background-clip: padding-box;
	margin: 80px auto;
	width: 350px;
	padding: 35px 35px 15px 35px;
	background: #fff;
	border: 1px solid #eaeaea;
	box-shadow: 0 0 25px #cac6c6;
}

.login-container .title {
	margin: 0px auto 40px auto;
	text-align: center;
	color: #505458;
}

.login-container .remember {
	margin: 0px 0px 35px 0px;
}

.el-message-box {
	width: 70% !important;
}
</style>