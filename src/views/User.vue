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
				<template v-for="(item, name) in fields">
					<el-form-item  
						v-if="showInAdd(item)" 
						:key="name"
						:label="item.name" :prop="item.field" >
						<!-- 1:input -->
						<el-input v-if="!item.form.type || item.form.type == 1" clearable v-model="addForm[item.field]" :disabled="disabledInAdd(item)"></el-input>
						<!-- 2:password -->
						<el-input v-if="item.form.type == 2" type="password" show-password v-model="addForm[item.field]" :disabled="disabledInAdd(item)"></el-input>	
						<!-- 3:select -->
						<el-select v-if="item.form.type == 3" v-model="addForm[item.field]" :placeholder="item.form.placeholder" :disabled="disabledInAdd(item)">
							<el-option
								v-for="item2 in item.form.options()"
								:key="item2.value"
								:label="item2.name"
								:value="item2.value">
							</el-option>
						</el-select>
						<!-- 4:switch -->
						<el-switch v-if="item.form.type == 4" v-model="addForm[item.field]" :active-value="1" :inactive-value="0" :disabled="disabledInAdd(item)"></el-switch>
						<!-- 5:upload -->
						<el-input v-if="item.form.type == 5" v-model="addForm[item.field]" :disabled="disabledInAdd(item)">
							<el-upload slot="append"
								:action="item.form.uploadUrl"
								:on-success="function(res, file){return handleFileUpload(res, file, 'addForm', item.field);}"
								:show-file-list="false">
							<el-button icon="el-icon-upload" :title="$t('label.title.upload')"></el-button>
							</el-upload>
						</el-input>
					</el-form-item>
				</template>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addClose">{{$t('dialog.cancel')}}</el-button>
				<el-button type="primary" @click="addSubmit" :loading="addLoading">{{$t('dialog.submit')}}</el-button>
			</div>
		</el-dialog>
		
		<!-- edit -->
		<el-dialog :title="$t('label.title.edit')" :visible.sync="editFormVisible" :close-on-click-modal="false">	
			<el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="120px">
				<template v-for="(item, name) in fields">
					<el-form-item  
						v-if="showInEdit(item)" 
						:key="name"
						:label="item.name" :prop="item.field" >
						<!-- 1:input -->
						<el-input v-if="!item.form.type || item.form.type == 1" clearable v-model="editForm[item.field]" :disabled="disabledInEdit(item)"></el-input>
						<!-- 2:password -->
						<el-input v-if="item.form.type == 2" type="password" show-password v-model="editForm[item.field]" :disabled="disabledInEdit(item)"></el-input>	
						<!-- 3:select -->
						<el-select v-if="item.form.type == 3" v-model="editForm[item.field]" :placeholder="item.form.placeholder" :disabled="disabledInEdit(item)">
							<el-option
								v-for="item2 in item.form.options()"
								:key="item2.value"
								:label="item2.name"
								:value="item2.value">
							</el-option>
						</el-select>
						<!-- 4:switch -->
						<el-switch v-if="item.form.type == 4" v-model="editForm[item.field]" :active-value="1" :inactive-value="0" :disabled="disabledInEdit(item)"></el-switch>
						<!-- 5:upload -->
						<el-input v-if="item.form.type == 5" v-model="editForm[item.field]" :disabled="disabledInEdit(item)">
							<el-upload slot="append"
								:action="item.form.uploadUrl"
								:on-success="function(res, file){return handleFileUpload(res, file, 'editForm', item.field);}"
								:show-file-list="false">
							<el-button icon="el-icon-upload" :title="$t('label.title.upload')"></el-button>
							</el-upload>
						</el-input>
					</el-form-item>
				</template>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editClose">{{$t('dialog.cancel')}}</el-button>
				<el-button type="primary" @click="editSubmit" :loading="editLoading">{{$t('dialog.submit')}}</el-button>
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
				
				//options
				groupOptions: [],

				//add
				addFormVisible: false,
				addLoading: false, 
				addForm: {},
				addFormRules: {
					sUser_UserName: [
						{ required: true, message: i18n.t('user.rules.username'), trigger: 'blur' },
					],
					sUser_PassWord: [
						{ required: true, message: i18n.t('pwd.rules.pwd'), trigger: 'blur' },
						{ validator: (rule, value, callback) => {
							  if (this.$store.state.pwdReg && !this.$store.state.pwdReg.test(this.addForm.sUser_PassWord) ) {
								callback(new Error(i18n.t('pwd.rules.format')+this.$store.state.pwdRegTips));
							  } else {
								callback();
							  }
						}, trigger: 'blur' }
					],
					sUser_PassWord2: [
						{ required: true, message: i18n.t('pwd.rules.pwd2'), trigger: 'blur' },
						{ validator: (rule, value, callback) => {
							  if (this.addForm.sUser_PassWord && value !== this.addForm.sUser_PassWord) {
								callback(new Error(i18n.t('pwd.rules.same')));
							  } else {
								callback();
							  }
						}, trigger: 'blur' }
					],
					sUser_Nick: [
						{ required: true, message: i18n.t('user.rules.nick'), trigger: 'blur' },
					],
					sUser_GroupID: [
						{ required: true, message: i18n.t('user.rules.group'), trigger: 'blur' },
					]
				},
				//edit
				editFormVisible: false,
				editLoading: false,
				editForm: {},
				editFormRules: {
					sUser_UserName: [
						{ required: true, message: i18n.t('user.rules.username'), trigger: 'blur' },
					  ],
					sUser_Nick: [
						{ required: true, message: i18n.t('user.rules.nick'), trigger: 'blur' },
					  ],
					sUser_GroupID: [
						{ required: true, message: i18n.t('user.rules.group'), trigger: 'blur' },
					  ]
				},
				//reset
				pwdFormVisible: false,
				pwdLoading: false,
				pwdForm: {},
				pwdFormRules: {
					sUser_PassWord: [
						{ required: true, message: i18n.t('pwd.rules.pwd'), trigger: 'blur' },
						{ validator: (rule, value, callback) => {
							  if (this.$store.state.pwdReg && !this.$store.state.pwdReg.test(this.pwdForm.sUser_PassWord) ) {
								callback(new Error(i18n.t('pwd.rules.format')+this.$store.state.pwdRegTips));
							  } else {
								callback();
							  }
						}, trigger: 'blur' }
					  ],
					sUser_PassWord2: [
						{ required: true, message: i18n.t('pwd.rules.pwd2'), trigger: 'blur' },
						{ validator: (rule, value, callback) => {
							  if (this.pwdForm.sUser_PassWord && value !== this.pwdForm.sUser_PassWord) {
								callback(new Error(i18n.t('pwd.rules.same')));
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
							show: true, //表格栏：是否显示，默认true
							disabled: false,  //表单栏：是否可编辑，默认可编辑
							type: "", //表单栏：输入框类型
							options: "", //表单栏：选项框
							uploadUrl: "", //表单栏：上传url
							add:{		
								show: true, //表单栏：是否显示，默认true
								disabled: false,  //表单栏：是否可编辑，默认可编辑
							}, ...edit,view
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
							show: false,
							edit:{
								show: true,
								disabled: true,
							}
						}
					},
					username: {
						name: i18n.t("user.fields.username"),
						field: this.$store.state.fields.user.username,
						table: {
						},
						form: {
							type: 1,
						}
					},
					password: {
						name: i18n.t("user.fields.password"),
						field: this.$store.state.fields.user.password,
						table: {
						},
						form: {
							show: false,
							type: 2,
							add:{
								show: true,
							}
						}
					},
					password2: {
						name: i18n.t("user.fields.password2"),
						field: "sUser_PassWord2",
						table: {
							show: false,
						},
						form: {
							show: false,
							type: 2,
							add:{
								show: true,
							}
						}
					},
					nick: {
						name: i18n.t("user.fields.nick"),
						field: this.$store.state.fields.user.nick,
						table: {
						},
						form: {
							type: 1,
						}
					},
					group: {
						name: i18n.t("user.fields.group"),
						field: this.$store.state.fields.user.group,
						table: {
							formatter: this.groupFormatter
						},
						form: {
							type: 3,
							options: () => { return this.groupOptions;},
							placeholder: i18n.t("user.placeholder.group"),
						}
					},
					status: {
						name: i18n.t("normal.fields.status"),
						field: this.$store.state.fields.user.status,
						table: {
							formatter: (r,c) => {return r[this.$store.state.fields.user.status] ? i18n.t("status.enable") : i18n.t("status.disable");}
						},
						form: {
							type: 4,
						}
					},
					qq: {
						name: i18n.t("user.fields.qq"),
						field: this.$store.state.fields.user.qq,
						table: {
						},
						form: {
							type: 1,
						}
					},
					email: {
						name: i18n.t("user.fields.email"),
						field: this.$store.state.fields.user.email,
						table: {
						},
						form: {
							type: 1,
						}
					},
					phone: {
						name: i18n.t("user.fields.phone"),
						field: this.$store.state.fields.user.phone,
						table: {
						},
						form: {
							type: 1,
						}
					},
					third: {
						name: i18n.t("user.fields.third"),
						field: this.$store.state.fields.user.third,
						table: {
						},
						form: {
							type: 1,
						}
					},
					createDate: {
						name: i18n.t("normal.fields.createDate"),
						field: this.$store.state.fields.user.createDate,
						table: {
							formatter: this.dateFormatter
						},
						form: {
							show: false,
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
		getGroupOptions: function(){
			return this.groupOptions;
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
		handleFileUpload: function(res, file, obj, key){
			var self = this;
			this.handleResQuery(res, function(){
				self[obj][key] = res.data.path;
			});
		},
		//field show disabled
		showInTable: function(){
			let flag = true;
			if(typeof item.table.show != "undefined"){ 
				flag = item.table.show ? true : false;
			}else if(typeof item.show != "undefined"){
				flag = item.show ? true : false;
			}
			return flag;
		},
		showInAdd: function(item){
			let flag = true;
			if(item.form.add && typeof item.form.add.show != "undefined"){
				flag = item.form.add.show ? true : false;
			}else if(typeof item.form.show != "undefined"){
				flag = item.form.show ? true : false;
			}else if(typeof item.show != "undefined"){
				flag = item.show ? true : false;
			}
			return flag;
		},
		showInEdit: function(item){
			let flag = true;
			if(item.form.edit && typeof item.form.edit.show != "undefined"){
				flag = item.form.edit.show ? true : false;
			}else if(typeof item.form.show != "undefined"){
				flag = item.form.show ? true : false;
			}else if(typeof item.show != "undefined"){
				flag = item.show ? true : false;
			}
			return flag;
		},
		disabledInAdd: function(item){
			let flag = false;
			if(item.form.add && item.form.add.disabled){
				flag = true;
			}else if(item.form.disabled){
				flag = true;
			}else if(item.disabled){
				flag = true;
			}
			return flag;
		},
		disabledInEdit: function(item){
			let flag = false;
			if(item.form.edit && item.form.edit.disabled){
				flag = true;
			}else if(item.form.disabled){
				flag = true;
			}else if(item.disabled){
				flag = true;
			}
			return flag;
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
					//test
					self.list = self.list.concat(self.list);
					self.list = self.list.concat(self.list);
					self.list = self.list.concat(self.list);
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
						this.ajaxReq(userUrl.add, params, function(res){
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
		handleEdit: function (index, row) {
			if(!this.hasAuth(this.authKey.edit)){
				this.$message.error(i18n.t("res.message.noAuth"));
				return;
			}
			var params = {
				sUser_ID: row.sUser_ID
			};
			var self = this;
			this.ajaxReq(userUrl.one, params, function(res){
				self.handleResQuery(res, function(){
					self.editFormVisible = true;
					self.editForm = Object.assign({}, res.data)
				});
			});
		},
		editClose: function () {
			this.editFormVisible = false;
			this.editLoading = false;
			this.$refs.editForm.resetFields();
		},
		editSubmit: function () {
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm(i18n.t('confirm.content'), i18n.t('confirm.title'), {}).then(() => {
						var self = this;
						this.editLoading = true;
						var params = Object.assign({}, this.editForm);
						this.ajaxReq(userUrl.edit, params, function(res){
							self.editLoading = false;
							self.handleResOperate(res, function(){
								self.editFormVisible = false;
								self.getList();
							});
						});
						
					});
				}
			});
		},
		//删除
		handleDel: function(index, row){
			if(!this.hasAuth(this.authKey.del)){
				this.$message.error(i18n.t("res.message.noAuth"));
				return;
			}
			this.$confirm(i18n.t("confirm.content2"), i18n.t("confirm.title"), {
				type: 'warning'
			}).then(() => {
				var self = this;
				var params = {sUser_ID: row.sUser_ID};
				this.listLoading = true;
				this.ajaxReq(userUrl.del, params, function(res){
					self.listLoading = false;
					self.handleResOperate(res, function(){
						self.getList();
					});
				});
				
			}).catch(() => {
			});
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