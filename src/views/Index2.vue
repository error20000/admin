<template>
  <div class="index">
    <el-container >
      <el-aside width="200px" class="aside">
        <div class="aisdeHeader">
        </div>
        <menu-v :menuData="menus"
              :nameKey="nameKey" 
              :iconKey="iconKey" 
              :indexKey="indexKey" 
              :pathKey="pathKey"
              :childrenKey="childrenKey">
        </menu-v>
      </el-aside>
    <el-container >
      <el-header>
	      <el-row>
	        <el-col :span="24" class="header">
	          <el-col :span="4" class="logo" style="width: 210px;">
	            {{this.$store.state.sysName}}
	          </el-col>
	          <el-col :span="17">
	            <!-- <menu-h :menuData="menus"
                    :nameKey="nameKey" 
                    :iconKey="iconKey" 
                    :indexKey="indexKey" 
                    :pathKey="pathKey"
                    :childrenKey="childrenKey">
              </menu-h> -->
	          </el-col>
	          <el-col :span="2" class="userinfo">
					<el-dropdown>
						<span class="el-dropdown-link userinfo-inner">
						{{sysUserName}}<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="handlepwdChange"><i class="fa fa-key fa-fw"></i>&nbsp;修改密码</el-dropdown-item>
							<el-dropdown-item @click.native="logout"><i class="fa fa-power-off fa-fw"></i>&nbsp;退出</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
	          </el-col>
	        </el-col>
	      </el-row>
	    </el-header>
	    
	    <el-main class="main">
          <transition name="main" mode="out-in">
            <router-view></router-view>
          </transition>
      </el-main>
  	</el-container>
    </el-container>

		<!--Change Password-->
		<el-dialog :title="$t('changePassword.dialog.title')" :visible.sync="pwdFormVisible" :close-on-click-modal="false">
			<el-form size="mini" :model="pwdForm"  :rules="pwdFormRules" ref="pwdForm" label-width="120px">
				<el-form-item :label="$t('changePassword.form.oldPwd')" prop="oldPwd">
					<el-input type="text" v-model="pwdForm.oldPwd"></el-input>
				</el-form-item>
				<el-form-item :label="$t('changePassword.form.newPwd')" prop="newPwd">
					<el-input type="text" v-model="pwdForm.newPwd"></el-input>
				</el-form-item>
				<el-form-item :label="$t('changePassword.form.newPwd2')" prop="newPwd2">
					<el-input type="text" v-model="pwdForm.newPwd2"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" @click="pwdChangeClose">{{ $t('changePassword.dialog.cancel') }}</el-button>
				<el-button size="mini" type="primary" @click="pwdChange" :loading="pwdLoading">{{ $t('changePassword.dialog.submit') }}</el-button>
			</div>
		</el-dialog>

  </div>
</template>
<script>
import { isLoginUrl, logoutUrl, changePwdUrl } from "@/api";
import menuTree from './menu/menuTree'
import menuH from './menu/menuH'
import menuV from './menu/menuV'

export default {
  components: {
    menuTree,
    menuH,
    menuV,
  },
  data: function(){
        return {
          sysUserName: '',
          //menu
          menus: [],
          nameKey: 'sMenu_Name',
          iconKey: 'sMenu_Icon',
          indexKey: 'sMenu_ID',
          pathKey: 'sMenu_Url',
          childrenKey: 'children',
          //pwd
          pwdFormVisible: false,
          pwdLoading: false,
          pwdFormRules: {
            oldPwd: [
              { required: true, message: "请输入旧密码.", trigger: "blur" }
            ],
            newPwd: [{ required: true, message: "请输入新密码.", trigger: "blur" }],
            newPwd2: [
              { required: true, message: "再次输入新密码.", trigger: "blur" },
              {
                validator: function(rule, value, callback) {
                  if (value !== this.pwdForm.newPwd) {
                    callback(new Error("密码不一致!"));
                  } else {
                    callback();
                  }
                },
                trigger: "blur"
              }
            ]
          },
          pwdForm: {
            oldPwd: "",
            newPwd: "",
            newPwd2: ""
          }
        };
      },
      methods: {
        //pwd
        handlepwdChange: function() {
          this.pwdFormVisible = true;
          this.pwdForm = {
            oldPwd: "",
            newPwd: "",
            newPwd2: ""
          };
        },
        pwdChangeClose: function() {
          this.pwdFormVisible = false;
          this.pwdLoading = false;
          this.$refs.pwdForm.resetFields();
        },
        pwdChange: function() {
          this.$refs.pwdForm.validate(function(valid){
            if (valid) {
              this.$confirm(i18n.t('confirm.content'), i18n.t('confirm.title'), {}).then(function() {
                var params = Object.assign({}, this.pwdForm);
                delete params.newPwd2;
                var self = this;
                this.pwdLoading = true;
                ajaxReq(changePwdUrl, params, function(res) {
                  self.pwdLoading = false;
                  self.handleResOperate(res, function(){
                      self.pwdFormVisible = false;
                      localStorage.removeItem(LOCALE_LOIN_USER_KEY);
                      parent.window.location.href = LOCALE_LOIN_URL;
                  });
                });
              });
            }
          });
        },
        //login
        logout: function() {
          this.$confirm(i18n.t('logout.confirm.content'), i18n.t('logout.confirm.title'), {
            //type: 'warning'
          }).then(function() {
              var self = this;
              var params = {};
              ajaxReq(logoutUrl, params, function(res) {
                  self.handleResQuery(res, function(){
                      localStorage.removeItem(LOCALE_LOIN_USER_KEY);
                      parent.window.location.href = LOCALE_LOIN_URL;
                  });
              });
            }).catch(function() {});
        },
        userAuthMenu: function() {
          let treeStr = localStorage.getItem(this.$store.state.menusTreeDataKey);
          let treeOrg = localStorage.getItem(this.$store.state.menusDataKey);
          this.menus = JSON.parse(treeStr);
          this.$store.dispatch("setMenusData", JSON.parse(treeOrg));
        },
        isLogin: function(cb) {
      let params = {};
      let self = this;
			this.ajaxReq(isLoginUrl, params, function(res){
        
								self.handleResQuery(res, function(){
									self.user = res.data;
      		self.sysUserName = self.user.sUser_Nick ? self.user.sUser_Nick : self.user.sUser_UserName;
        
								}, function(){
                  localStorage.removeItem(LOCALE_LOIN_USER_KEY);
                  parent.window.location.href = LOCALE_LOIN_URL;
                });
			});
        }
      },
      mounted: function() {
        this.isLogin();
		    this.userAuthMenu();
      }
}
</script>
<style>
.index{
  height: 100%;
}
.userinfo {
  text-align: right;
  padding-right: 35px;
  float: right;
}
.userinfo .userinfo-inner {
  cursor: pointer;
  color: #fff;
}
.userinfo .userinfo-inner img {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin: 10px 0px 10px 10px;
  float: right;
}
.logo {
  height: 60px;
  font-size: 16px;
  border-color: rgba(238, 241, 146, 0.3);
}
.logo a {
  width: 100%;
  height: 100%;
  text-align: center;
  color: #fff;
  display: inline-block;
}
.main {
}
.aisdeHeader{
  width: 100%;
  height: 60px;
}

.el-container{
  height: 100%;
}
.el-header {
  line-height: 60px;
  text-align: center;
  background: #20a0ff;
  color: #333;
  z-index: 10;
}
.el-aside {
  background: #004b91;
  color: #333;
  overflow-x: hidden;
  overflow-y: auto;
}
/* for Chrome */
.el-aside::-webkit-scrollbar {
    display: none;
}

/** menu */
.el-menu{
    flex: 1;
    border-right: none !important;
}
  .el-menu .fa {
    vertical-align: middle;
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 18px;
  }
  .el-menu i {
    color: #ffffff !important;
  }
  .el-menu .el-menu-item{
    background-color: #00477d !important;
  }
  .el-menu .el-menu-item:hover{
    background-color: #375573 !important;
  }

  /** main */
  
  .main-enter, .main-leave-to {
    opacity: 0;
    transform: translateY(30px);

  }
  .main-enter-active {
    transition: all 0.2s;
  }
  .main-leave-active {
    position: absolute;
    transition: all 0.3s;
  }

</style>