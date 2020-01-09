<template>
  <div>
	  <el-row class="filter">
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-col :span="24">
			<el-tabs value="filter" >
				<el-tab-pane :label="$t('label.filter')" name="filter" disabled>
				<el-form size="mini" :inline="true" :model="filters" style="float: right;">
					<el-form-item>
						  <el-input v-model="filters.sUser_UserName" :placeholder="$t('user.placeholder.username')" clearable></el-input>
					</el-form-item>
					<el-form-item>
						  <el-input v-model="filters.sUser_Nick" :placeholder="$t('user.placeholder.nick')" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-select v-model="filters.sUser_GroupID" :placeholder="$t('user.placeholder.group')">
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
				<el-table size="mini" :data="list" highlight-current-row border v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" class="mytable" >
					<template v-for="(item, name) in fields">
						<el-table-column  
							v-if="!(item.table.show == false || item.show == false && !(item.show == false && item.table.show == true))" 
							:key="name"
							:label="item.name" :prop="item.field" 
							:width="item.table.width"
							:fixed="item.table.fixed"
							:formatter="item.table.formatter"
							:min-width="tableMaxWidth['1']" class-name="table-drugs-1">

						</el-table-column>
					</template>
					
					<!-- <el-table-column fixed="right" label="操作" width="100" align="center">
						<template scope="scope">
							<el-dropdown size="mini">
							  <el-button type="primary" size="mini">
								   <i class="fas fa-cog"></i>
							  </el-button>
							  <el-dropdown-menu slot="dropdown">
								<el-dropdown-item @click.native="handleEdit(scope.$index, scope.row)" ref="edit" auth="sys:user:update" v-show="hasAuth('edit')">
									<i class="fas fa-edit"></i>&nbsp;编辑
								</el-dropdown-item>
								<el-dropdown-item @click.native="handleResetPWD(scope.$index, scope.row)" divided  ref="resetPwd" auth="sys:user:resetPwd" v-show="hasAuth('resetPwd')">
									<i class="fas fa-key"></i>&nbsp;重置密码
								</el-dropdown-item>
								<el-dropdown-item @click.native="handleAuth(scope.$index, scope.row)" ref="auth" auth="sys:user:auth" v-show="hasAuth('auth')">
									<i class="fas fa-user-lock"></i>&nbsp;授权
								</el-dropdown-item>
								<el-dropdown-item @click.native="handleAid(scope.$index, scope.row)" ref="aid" auth="sys:user:aid" v-show="hasAuth('aid')">
									<i class="fas fa-map-pin"></i>&nbsp;分配航标
								</el-dropdown-item>
								<el-dropdown-item @click.native="handleStore(scope.$index, scope.row)" ref="store" auth="sys:user:store" v-show="hasAuth('store')">
									<i class="fas fa-map-pin"></i>&nbsp;分配仓库
								</el-dropdown-item>
								<el-dropdown-item @click.native="handleDel(scope.$index, scope.row)" divided style="color: #f56c6c;" ref="delete" auth="sys:user:delete" v-show="hasAuth('delete')">
									<i class="fas fa-trash-alt"></i>&nbsp;删除
								</el-dropdown-item>
							  </el-dropdown-menu>
							</el-dropdown>
						</template>
					</el-table-column> -->
				</el-table>
		
				<!-- page tool -->
				<el-col :span="24" class="toolbar">
					<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">Batch remove</el-button> -->
					<el-pagination layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100]" :page-size="rows" :total="total" style="float:right;">
					</el-pagination>
				</el-col>
			</el-tab-pane>
		  </el-tabs>
		
		
		
  </div>
</template>

<script>

import { userUrl } from "@/api";

export default {
  data: function() {
	return {
				activeTab: 'table',
				filters: {
					sUser_UserName: '',
					sUser_Nick: '',
					sUser_GroupID: ''
				},
				tableMaxWidth: {
					'1': 0,
					'2': 0,
					'3': 0,
					'4': 0,
					'5': 0,
					'6': 0,
					'7': 0,
					'8': 0,
					'9': 0,
					'10': 0,
					'11': 0,
				},
				list: [],
				total: 0,
				page: 1,
				rows: 10,
				listLoading: false,
				sels: [],
				preloading: false,
				
				//auth
				menuFuns: '',
				authKey: {
					query: 'sys:user:query',
					add: 'sys:user:add',
					edit: 'sys:user:update',
					del: 'sys:user:delete',
					import: 'sys:user:import',
					export: 'sys:user:export',
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
							  if (this.pwdReg && !this.pwdReg.test(this.addForm.sUser_PassWord) ) {
								callback(new Error('密码格式不正确!'+this.pwdRegStr));
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
						},
						form: {
							type: "",
							//options: "",
						}
					},
				}
			}
  },
  
	/* watch:{
		//表格宽度自适应
		list: function(){
			this.$nextTick(function () { 
				for ( var key in this.tableMaxWidth) {
					let tempMaxWidth = 0;
					try {
						for (let i = 0; i <  document.getElementsByClassName("table-drugs-"+key).length; i++){
							let element =  document.getElementsByClassName("table-drugs-"+key)[i];
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
	}, */
  methods: {
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
	  this.filters = {
		sUser_UserName: '',
		sUser_Nick: '',
		sUser_GroupID: ''
	  };
	  this.getList();
	},
	//新增
	handleAdd: function(){

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
		//字段隐藏
		for (const key in this.fields) {
			if (!this.$store.state.fields.user[key]) {
				this.$set(this.fields[key], 'show', false);
			}
		}
		console.log(this.fields);
	}
  },
  mounted: function() {
		this.init();
		this.getList();
	}
}
</script>

<style>

</style>