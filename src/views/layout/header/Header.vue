<template>
  <div>
      <el-header class="header">
        <span class="logo" :title="this.$store.state.sysName">{{this.$store.state.sysName}}</span>
        <span class="menus">
          <menu-h
            :menuData="menus"
            :defaultActive="'330'"
            :nameKey="nameKey"
            :iconKey="iconKey"
            :indexKey="indexKey"
            :pathKey="pathKey"
            :childrenKey="childrenKey"
          ></menu-h>
        </span>
        <span class="personal">
          <el-dropdown class="lang" @command="handleLanguage" size="medium">
            <span class="el-dropdown-link">
              <i class="fa fa-language fa-lg"></i>
              &nbsp;{{languageName}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in languageOpt" 
              :key="item.code" 
              :command="item.code">{{item.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown size="medium">
            <span class="el-dropdown-link userinfo-inner">
              {{sysUserName}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handlepwdChange">
                <i class="fa fa-key fa-fw"></i>&nbsp;{{$t('index.dropdown.pwd')}}
              </el-dropdown-item>
              <el-dropdown-item @click.native="logout">
                <i class="fa fa-power-off fa-fw"></i>&nbsp;{{$t('index.dropdown.logout')}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </el-header>

    <!--Change Password-->
    <el-dialog
      :title="$t('index.changePassword.dialog.title')"
      :visible.sync="pwdFormVisible"
      :close-on-click-modal="false"
    >
      <el-form size="mini" :model="pwdForm" :rules="pwdFormRules" ref="pwdForm" label-width="120px">
        <el-form-item :label="$t('pwd.form.oldPwd')" prop="oldPwd">
          <el-input type="text" v-model="pwdForm.oldPwd"></el-input>
        </el-form-item>
        <el-form-item :label="$t('pwd.form.newPwd')" prop="newPwd">
          <el-input type="text" v-model="pwdForm.newPwd"></el-input>
        </el-form-item>
        <el-form-item :label="$t('pwd.form.newPwd2')" prop="newPwd2">
          <el-input type="text" v-model="pwdForm.newPwd2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="pwdChangeClose">{{ $t('dialog.cancel') }}</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="pwdChange"
          :loading="pwdLoading"
        >{{ $t('dialog.submit') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { isLoginUrl, logoutUrl, changePwdUrl } from "@/api";
import menuTree from "@/views/menu/menuTree";
import menuH from "@/views/menu/menuH";

export default {
  components: {
    menuTree,
    menuH
  },
  data: function() {
    return {
      sysUserName: "",
      languageName: "中文",
      languageOpt: [],
      //menu
      menus: [],
      nameKey: this.$store.state.fields.menu.name,
      iconKey: this.$store.state.fields.menu.icon,
      indexKey: this.$store.state.fields.menu.index,
      pathKey: this.$store.state.fields.menu.path,
      childrenKey: this.$store.state.fields.menu.children,
      //pwd
      pwdFormVisible: false,
      pwdLoading: false,
      pwdFormRules: {
        oldPwd: [{ required: true, message: i18n.t('pwd.rules.oldPwd'), trigger: "blur" }],
        newPwd: [{ required: true, message: i18n.t('pwd.rules.newPwd'), trigger: "blur" },
            { validator: (rule, value, callback) => {
							  if (this.$store.state.pwdReg && !this.$store.state.pwdReg.test(this.pwdForm.newPwd) ) {
								callback(new Error(i18n.t('pwd.rules.format')+this.$store.state.pwdRegTips));
							  } else {
								callback();
							  }
						}, trigger: 'blur' }
        ],
        newPwd2: [
          { required: true, message: i18n.t('pwd.rules.newPwd2'), trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (value !== this.pwdForm.newPwd) {
                callback(new Error(i18n.t('pwd.rules.same')));
              } else {
                callback();
              }
            },trigger: "blur"}
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
      this.$refs.pwdForm.validate((valid) => {
        if (valid) {
          this.$confirm(
            i18n.t("confirm.content"),
            i18n.t("confirm.title"),
            {}
          ).then(() => {
            var params = Object.assign({}, this.pwdForm);
            delete params.newPwd2;
            var self = this;
            this.pwdLoading = true;
            this.ajaxReq(changePwdUrl, params, function(res) {
              self.pwdLoading = false;
              self.handleResOperate(res, function() {
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
      this.$confirm(
        i18n.t("logout.confirm.content"),
        i18n.t("logout.confirm.title"),
        {
          type: 'warning'
        }
      )
        .then(() => {
          var self = this;
          var params = {};
          this.ajaxReq(logoutUrl, params, function(res) {
            self.handleResQuery(res, function() {
              localStorage.removeItem(LOCALE_LOIN_USER_KEY);
              parent.window.location.href = LOCALE_LOIN_URL;
            });
          });
        })
        .catch(() => {});
    },
    userAuthMenu: function() {
      let treeStr = localStorage.getItem(this.$store.state.storage.menusTreeDataKey);
      let treeOrg = localStorage.getItem(this.$store.state.storage.menusDataKey);
      this.menus = JSON.parse(treeStr);
      //this.$store.dispatch("setMenusData", JSON.parse(treeOrg));
    },
    isLogin: function(cb) {
      let params = {};
      let self = this;
      this.ajaxReq(isLoginUrl, params, function(res) {
        self.handleResQuery( res, function() {
            self.user = res.data;
            self.sysUserName = self.user[self.$store.state.fields.user.nick]
              ? self.user[self.$store.state.fields.user.nick] : self.user[self.$store.state.fields.user.username];
          },
          function() {
            localStorage.removeItem(LOCALE_LOIN_USER_KEY);
            parent.window.location.href = LOCALE_LOIN_URL;
          }
        );
      });
    },
    initLang: function(){
      this.languageOpt = [];
      for (let i = 0; i < i18n.availableLocales.length; i++) {
        let e = i18n.availableLocales[i];
        let node = {
           code: e ,
           name: i18n.messages[e].name
        };
        this.languageOpt.push(node);
      }
      //选中
      let lang = localStorage.getItem(LOCALE_LANG_KEY);
      this.languageName = i18n.messages[lang].name;
    },
    handleLanguage: function(command){
      i18n.setLang(command);
      window.location.reload();
    }
  },
  mounted: function() {
    this.initLang();
    this.isLogin();
    this.userAuthMenu();
  }
};
</script>

<style>
  .header{
    max-height: 60px;
    line-height: 60px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
    display: flex;
    justify-content: space-between;
  }
</style>