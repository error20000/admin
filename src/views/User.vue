<template>
	<div>
		<el-row class="filter">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-col :span="24">
				<el-tabs value="filter" >
					<el-tab-pane :label="$t('label.filter')" name="filter" disabled>
					<el-form  :inline="true" :model="filters" style="float: right;">
						<el-form-item v-if="fields.username">
							<el-input v-model="filters[fields.username.field]" :placeholder="$t('user.placeholder.username')" clearable></el-input>
						</el-form-item>
						<el-form-item v-if="fields.nick">
							<el-input v-model="filters[fields.nick.field]" :placeholder="$t('user.placeholder.nick')" clearable></el-input>
						</el-form-item>
						<el-form-item v-if="fields.group">
							<el-select v-model="filters[fields.group.field]" :placeholder="$t('user.placeholder.group')">
								<el-option
								v-for="item in groupOptions"
								:key="item.value"
								:label="item.name"
								:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" :title="$t('label.title.query')" @click="query" icon="fa fa-search"></el-button>
							<el-button @click="reset" :title="$t('label.title.reset')" icon="fas fa-redo"></el-button>
							&nbsp;&nbsp;&nbsp;&nbsp;
							<el-button type="primary" :title="$t('label.title.import')" @click="getImport" icon="fas fa-file-import" v-hasAuth="authKey.import"></el-button>
							<el-button type="primary" :title="$t('label.title.export')" @click="getExcel" icon="fas fa-file-export" v-hasAuth="authKey.export"></el-button>
							&nbsp;&nbsp;&nbsp;&nbsp;
							<el-button type="primary" :title="$t('label.title.add')" @click="handleAdd" icon="fas fa-plus" v-hasAuth="authKey.add"></el-button>
						</el-form-item>
					</el-form>
					</el-tab-pane>
				</el-tabs>
					
				</el-col>
			</el-col>
		</el-row>
		
		<el-tabs class="result" v-model="activeTab" >
			<el-tab-pane :label="$t('label.result')" name="table" disabled v-hasAuth="authKey.query">
				<!-- list -->
				<el-table  :data="list" highlight-current-row border v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" class="mytable" >
					<template v-for="(item, name) in fields">
						<el-table-column  
							v-if="!(item.table.show == false || item.show == false && !(item.show == false && item.table.show == true))" 
							:key="name"
							:label="item.name" :prop="item.field" 
							:width="item.table.width"
							:fixed="item.table.fixed"
							:formatter="item.table.formatter"
							:min-width="tableMaxWidth[name]" :class-name="'tableFlexWidth-'+name">

						</el-table-column>
					</template>
					
					<el-table-column fixed="right" :label="$t('label.action')" width="100" align="center">
						<template slot-scope="scope">
							<el-dropdown >
							  <el-button type="primary" >
								   <i class="fas fa-cog"></i>
							  </el-button>
							  <el-dropdown-menu slot="dropdown">
								<el-dropdown-item @click.native="handleEdit(scope.$index, scope.row)"  v-hasAuth="authKey.edit">
									<i class="fas fa-edit"></i>&nbsp;{{$t('label.title.edit')}}
								</el-dropdown-item>
								<el-dropdown-item @click.native="handleResetPwd(scope.$index, scope.row)" divided v-hasAuth="authKey.resetPwd">
									<i class="fas fa-key"></i>&nbsp;{{$t('user.button.resetPwd')}}
								</el-dropdown-item>
								<el-dropdown-item @click.native="handleMenuAuth(scope.$index, scope.row)" v-hasAuth="authKey.menuAuth">
									<i class="fas fa-user-lock"></i>&nbsp;{{$t('user.button.menuAuth')}}
								</el-dropdown-item>
								<el-dropdown-item @click.native="handleDel(scope.$index, scope.row)" divided v-hasAuth="authKey.del" style="color: #f56c6c;" >
									<i class="fas fa-trash-alt"></i>&nbsp;{{$t('label.title.del')}}
								</el-dropdown-item>
							  </el-dropdown-menu>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>
		
				<!-- page tool -->
				<el-col :span="24" class="toolbar" style="margin-top: 10px;">
					<!-- <el-button type="danger" @click="handleBatchDel" :disabled="this.sels.length===0" v-hasAuth="authKey.batchDel">{{$t('label.title.batchDel')}}</el-button> -->
					<el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]" :page-size="rows" :total="total" style="float:right;">
					</el-pagination>
				</el-col>
			</el-tab-pane>
		</el-tabs>
		
		<!-- add -->
		<el-dialog :title="$t('label.title.add')" :visible.sync="addFormVisible" :close-on-click-modal="false">	
			<el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="120px">
			  <el-form-item label="用户名" prop="sUser_UserName">
			    <el-input v-model="addForm.sUser_UserName"></el-input>
			  </el-form-item>
			  <el-form-item label="密码" prop="sUser_PassWord">
			    <el-input type="password" v-model="addForm.sUser_PassWord"></el-input>
			  </el-form-item>
			  <el-form-item label="确认密码" prop="sUser_PassWord2">
			    <el-input type="password" v-model="addForm.sUser_PassWord2"></el-input>
			  </el-form-item>
			  <el-form-item label="昵称" prop="sUser_Nick">
			    <el-input v-model="addForm.sUser_Nick"></el-input>
			  </el-form-item>
			  <el-form-item label="所属用户组" prop="sUser_GroupID">
			    <el-select v-model="addForm.sUser_GroupID" placeholder="请选择用户组">
				    <el-option
				      v-for="item in groupOptions"
				      :key="item.value"
				      :label="item.name"
				      :value="item.value">
				    </el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item label="状态" prop="lUser_StatusFlag">
			     <el-switch v-model="addForm.lUser_StatusFlag" :active-value="1" :inactive-value="0"></el-switch>
			  </el-form-item>
			  <el-form-item label="QQ" prop="sUser_QQ">
			    <el-input v-model="addForm.sUser_QQ"></el-input>
			  </el-form-item>
			  <el-form-item label="邮箱" prop="sUser_Email">
			    <el-input v-model="addForm.sUser_Email"></el-input>
			  </el-form-item>
			  <el-form-item label="电话" prop="sUser_Phone">
			    <el-input v-model="addForm.sUser_Phone"></el-input>
			  </el-form-item>
			  <el-form-item label="第三方ID" prop="sUser_ThirdID">
			    <el-input v-model="addForm.sUser_ThirdID"></el-input>
			  </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" @click="addClose">取消</el-button>
				<el-button size="mini" type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
		
	</div>
</template>

<script>

import { userUrl, groupUrl } from "@/api";

export default {
	data: function() {
		return {
				activeTab: 'table',
				filters: {
				},
				list: [],
				total: 0,
				page: 1,
				rows: 10,
				listLoading: false,
				sels: [],
				preloading: false,
				tableMaxWidth: {},
				
				//auth
				menuFuns: '',
				authKey: {
					query: 'sys:user:query',
					add: 'sys:user:add',
					edit: 'sys:user:update',
					del: 'sys:user:delete',
					import: 'sys:user:import',
					export: 'sys:user:export',
					batchDel: '',
					resetPwd: 'sys:user:export',
					menuAuth: 'sys:user:export',
				},
				authCache: {},
				
				groupOptions: [],
				pwdReg: '',
				pwdRegStr: '',
				aidOptions: [],
				stationDictNo: 'AidStation',
				stationOptions: [],

				//add
				addFormVisible: false,
				addLoading: false, 
				addForm: {},
				addFormRules: {
					sUser_UserName: [
						{ required: true, message: '请输入用户名.', trigger: 'blur' },
					  ],
					sUser_PassWord: [
						{ required: true, message: '请输入密码.', trigger: 'blur' },
						/*{ validator: (rule, value, callback) => {
							  if (this.addForm.sUser_PassWord2 && value !== this.addForm.sUser_PassWord2 ) {
								callback(new Error('两次输入密码不匹配!'));
							  } else {
								callback();
							  }
						}, trigger: 'blur' },*/
						{ validator: (rule, value, callback) => {
							  if (this.$store.state.pwdReg && !this.$store.state.pwdReg.test(this.addForm.sUser_PassWord) ) {
								callback(new Error('密码格式不正确!'+this.$store.state.pwdRegTips));
							  } else {
								callback();
							  }
						}, trigger: 'blur' }
					  ],
					sUser_PassWord2: [
						{ required: true, message: '请再次输入密码.', trigger: 'blur' },
						{ validator: (rule, value, callback) => {
							  if (this.addForm.sUser_PassWord && value !== this.addForm.sUser_PassWord) {
								callback(new Error('两次输入密码不匹配!'));
							  } else {
								callback();
							  }
						}, trigger: 'blur' }
					  ],
					sUser_Nick: [
						{ required: true, message: '请输入用户昵称.', trigger: 'blur' },
					  ],
					sUser_GroupID: [
						{ required: true, message: '请选择用户组.', trigger: 'blur' },
					  ]
				},
				//edit
				editFormVisible: false,
				editLoading: false,
				editForm: {},
				editFormRules: {
					sUser_UserName: [
						{ required: true, message: '请输入用户名.', trigger: 'blur' },
					  ],
					sUser_Nick: [
						{ required: true, message: '请输入用户昵称.', trigger: 'blur' },
					  ],
					sUser_GroupID: [
						{ required: true, message: '请选择用户组.', trigger: 'blur' },
					  ]
				},
				//reset
				pwdFormVisible: false,
				pwdLoading: false,
				pwdForm: {},
				pwdFormRules: {
					sUser_PassWord: [
						{ required: true, message: '请输入密码.', trigger: 'blur' },
						/*{ validator: (rule, value, callback) => {
							  if (this.pwdForm.sUser_PassWord2 && value !== this.pwdForm.sUser_PassWord2 ) {
								callback(new Error('两次输入密码不匹配!'));
							  } else {
								callback();
							  }
						}, trigger: 'blur' },*/
						{ validator: (rule, value, callback) => {
							  if (this.pwdReg && !this.pwdReg.test(this.pwdForm.sUser_PassWord) ) {
								callback(new Error('密码格式不正确!'+this.pwdRegStr));
							  } else {
								callback();
							  }
						}, trigger: 'blur' }
					  ],
					sUser_PassWord2: [
						{ required: true, message: '请再次输入密码.', trigger: 'blur' },
						{ validator: (rule, value, callback) => {
							  if (this.pwdForm.sUser_PassWord && value !== this.pwdForm.sUser_PassWord) {
								callback(new Error('两次输入密码不匹配!'));
							  } else {
								callback();
							  }
						}, trigger: 'blur' }
					  ]
				},
				//auth
				authFormVisible: false,
				authLoading: false,
				authForm: {},
				authFormRules: {},
				menuAuthOptions:[],
				loginAuthOptions:[],
				userAuthOptions:[],
				groupAuthOptions:[],
				userAuthWidthChange: false,
				userAuthWidthName: '展开>>',
				leftClassObject: {
					large: false
				},
				rightClassObject: {
					small: false
				},
				//aid
				aidFormVisible: false,
				aidLoading: false,
				aidForm: {
					aid: []
				},
				aidFormRules: {},
				activeAidName: '1',
				stationFormVisible: false,
				stationLoading: false,
				stationForm: {
					station: []
				},
				stationFormRules: {},
				//store
				storeFormVisible: false,
				storeLoading: false,
				storeForm: {},
				storeFormRules: {},
				storeTree: '',
				storeChecked: [],        
				defaultProps: {
					  children: 'children',
					  label: 'sStore_Name'
				},
				
				//Tips
				tips: {
					name: 'tips',
					effect: 'dark',
					forms: {
						title: {
							content: "说明：<br/><br/>1、超级管理员默认所有权限，可不用分配。<br/><br/>2、选中（蓝色）代表授予该用户该权限，未选中代表不授予该用户该权限。",
							placement: "right"
						},
						station: {
							content: "说明：<br/><br/>1、超级管理员默认所有权限，可不用分配。<br/><br/>2、选中（蓝色）代表授予该用户该权限，未选中代表不授予该用户该权限。<br/><br/>3、如果用户拥有该航标站权限，即用户拥有该航标站下所有航标权限。",
							placement: "right"
						}
					}
				},
				
				uploadVisible: false,
				uploadTemp: [],
				importUrl: "",

				//字段
				/**
				 * 字段说明
				 * {
						name: "", //显示名称
						field: "", //字段名
						show: false, //是否显示，默认true
						table: {
							show: true, //表格栏：是否显示，默认true
							width: "", //表格栏：宽度
							fixed: "", //表格栏：固定
							formatter: "" //表格栏：格式化
						},
						form: {
							type: "",
							//options: "",
						}
					}
				 */
				fields: {
					pid: {
						name: i18n.t("normal.fields.pid"),
						field: this.$store.state.fields.user.pid,
						table: {
						},
						form: {
							type: "",
							//options: "",
						}
					},
					username: {
						name: i18n.t("user.fields.username"),
						field: this.$store.state.fields.user.username,
						table: {
						},
						form: {
							type: "",
							//options: "",
						}
					},
					password: {
						name: i18n.t("user.fields.password"),
						field: this.$store.state.fields.user.password,
						table: {
						},
						form: {
							type: "",
							//options: "",
						}
					},
					nick: {
						name: i18n.t("user.fields.nick"),
						field: this.$store.state.fields.user.nick,
						table: {
						},
						form: {
							type: "",
							//options: "",
						}
					},
					group: {
						name: i18n.t("user.fields.group"),
						field: this.$store.state.fields.user.group,
						table: {
							formatter: this.groupFormatter
						},
						form: {
							type: "",
							//options: "",
						}
					},
					status: {
						name: i18n.t("normal.fields.status"),
						field: this.$store.state.fields.user.status,
						table: {
						},
						form: {
							type: "",
							//options: "",
						}
					},
					qq: {
						name: i18n.t("user.fields.qq"),
						field: this.$store.state.fields.user.qq,
						table: {
						},
						form: {
							type: "",
							//options: "",
						}
					},
					email: {
						name: i18n.t("user.fields.email"),
						field: this.$store.state.fields.user.email,
						table: {
						},
						form: {
							type: "",
							//options: "",
						}
					},
					phone: {
						name: i18n.t("user.fields.phone"),
						field: this.$store.state.fields.user.phone,
						table: {
						},
						form: {
							type: "",
							//options: "",
						}
					},
					third: {
						name: i18n.t("user.fields.third"),
						field: this.$store.state.fields.user.third,
						table: {
						},
						form: {
							type: "",
							//options: "",
						}
					},
					createDate: {
						name: i18n.t("normal.fields.createDate"),
						field: this.$store.state.fields.user.createDate,
						table: {
							formatter: this.dateFormatter
						},
						form: {
							type: "",
							//options: "",
						}
					},
				}
			}
	},
  
	watch:{
		//表格宽度自适应
		list: function(){
			if(!this.tableMaxWidth){
				return;
			}
			this.$nextTick(function () { 
				for ( var key in this.fields) {
					let tempMaxWidth = 0;
					try {
						for (let i = 0; i <  document.getElementsByClassName("tableFlexWidth-"+key).length; i++){
							let element =  document.getElementsByClassName("tableFlexWidth-"+key)[i];
							let width = element.querySelectorAll('div')[0].offsetWidth;
							tempMaxWidth = tempMaxWidth < width ? width : tempMaxWidth;
						}
					} catch (error) {
						console.error(error);
					}
					this.$set(this.tableMaxWidth, key, tempMaxWidth);
				}
			});
		}
	}, 
	methods: {
		dateFormatter: function(row){
			return this.formatDate(row[this.$store.state.fields.user.createDate], 'yyyy-MM-dd HH:mm:ss');
		},
		groupFormatter: function(row){
			var name = row[this.$store.state.fields.user.group];
			for (var i = 0; i < this.groupOptions.length; i++) {
				var item = this.groupOptions[i];
				if(row[this.$store.state.fields.user.group] == item.value){
					name = item.name;
					break
				}
			}
			return name;
		},
		handleGroupOptions: function(cb){
			var self = this;
			var params = {};
			this.ajaxReq(groupUrl.all, params, function(res){
				self.handleResQuery(res, function(){
					self.groupOptions = [];
					for (var i = 0; i < res.data.length; i++) {
						let node = res.data[i];
						node.name = node[self.$store.state.fields.group.name];
						node.value = node[self.$store.state.fields.group.pid];
						self.groupOptions.push(node);
					}
					if(typeof cb == 'function'){
						cb();
					}
				});
			});
		},
		//查询
		query: function(){
			this.page = 1;
			this.getList();
		},
		handleSizeChange: function (val) {
			this.rows = val;
			this.getList();
		},
		handleCurrentChange: function (val) {
			this.page = val;
			this.getList();
		},
		selsChange: function (sels) {
			this.sels = sels;
		},
		getList: function(){
			if(!this.hasAuth(this.authKey.query)){
				this.$message.error(i18n.t("res.message.noAuth"));
				return;
			}
			var self = this;
			var params = {
				page: this.page,
				rows: this.rows
			};
			for ( var key in this.filters) {
				if(this.filters[key]){
					params[key] = this.filters[key];
				}
			}
			this.listLoading = true;
			this.ajaxReq(userUrl.query, params, function(res){
				self.listLoading = false;
				self.handleResQuery(res, function(){
					self.total = res.total;
					self.list = res.data;
					/*if(self.page != 1 && self.total <= (self.page - 1) * self.rows){
						self.page = self.page - 1;
						self.getList();
					}*/
				});
			});
		},
		reset: function(){
			this.filters = {};
			this.getList();
		},
		//新增
		handleAdd: function(){
			if(!this.hasAuth(this.authKey.add)){
				this.$message.error(i18n.t("res.message.noAuth"));
				return;
			}
			this.addFormVisible = true;
			this.addForm = {};
		},
		addClose: function () {
			this.addFormVisible = false;
			this.addLoading = false;
			this.$refs.addForm.resetFields();
		},
		addSubmit: function () {
			this.$refs.addForm.validate((valid) => {
				if (valid) {
					this.$confirm(i18n.t('confirm.content'), i18n.t('confirm.title'), {}).then(() => {
						var params = Object.assign({}, this.addForm);
						var self = this;
						this.addLoading = true;
						this.ajaxReq(addUrl, params, function(res){
							self.addLoading = false;
							self.handleResOperate(res, function(){
								self.addFormVisible = false;
								self.getList();
							});
						});
					});
				}
			});
		},
		//修改
		handleEdit: function(){

		},
		//删除
		handleDel: function(){

		},
		handleBatchDel: function(){

		},
		//重置密码
		handleResetPwd: function(){

		},
		//菜单授权
		handleMenuAuth: function(){

		},
		//导入
		getImport: function(){

		},
		//导出
		getExcel: function(){

		},
		//判断权限
		hasAuth: function(auth){
			if(typeof this.authCache[auth] != "undefined"){
				return this.authCache[auth];
			}
			let fun = this.getAuth(auth, this.menuFuns, this.$store.state.fields.menuFun.button);
			if(fun){
				this.authCache[auth] = true;
				return true;
			}
			return false;
		},
		//初始化
		init: function(){
			//权限
			this.menuFuns = this.$store.state.cache.menuFunsData;
			if(!this.menuFuns){
				this.menuFuns = JSON.parse(localStorage.getItem(this.$store.state.storage.menuFunsDataKey));
				this.$store.state.cache.menuFunsData = this.menuFuns;
			}
		}
  	},
  	mounted: function() {
		this.init();
		this.handleGroupOptions();
		this.getList();
	}
}
</script>

<style>

</style>