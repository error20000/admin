<template>
  <div>
      <el-row class="filter">
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-col :span="24">
			<el-tabs value="filter" >
			    <el-tab-pane label="筛选" name="filter" disabled>
			    <el-form size="mini" :inline="true" :model="filters" style="float: right;">
					<el-form-item>
						  <el-input v-model="filters.sUser_UserName" placeholder="请输入用户名" clearable></el-input>
					</el-form-item>
					<el-form-item>
						  <el-input v-model="filters.sUser_Nick" placeholder="请输入用户昵称" clearable></el-input>
					</el-form-item>
					<el-form-item>
					    <el-select v-model="filters.sUser_GroupID" placeholder="请选择用户组">
						    <el-option
						      v-for="item in groupOptions"
						      :key="item.value"
						      :label="item.name"
						      :value="item.value">
						    </el-option>
					    </el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" title="查询" @click="query" icon="fa fa-search"></el-button>
						<el-button @click="reset"  title="重置" icon="fas fa-redo"></el-button>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<el-button type="primary" title="导入" @click="getImport" icon="fas fa-file-import" v-hasAuth="'sys:user:import'"></el-button>
						<el-button type="primary" title="导出" @click="getExcel" icon="fas fa-file-export" v-hasAuth="'sys:user:export'"></el-button>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<el-button type="primary" title="新增" @click="handleAdd" icon="fas fa-plus" v-hasAuth="'sys:user:add'"></el-button>
					</el-form-item>
				</el-form>
			    </el-tab-pane>
		    </el-tabs>
				
			</el-col>
		</el-col>
		</el-row>
		
	    <el-tabs class="result" v-model="activeTab" >
		    <el-tab-pane label="结果" name="table" disabled v-hasAuth="'sys:user:query'">
				<!-- list -->
				<el-table size="mini" :data="list" highlight-current-row border v-loading="listLoading" @selection-change="selsChange" style="width: 100%;" class="mytable" >
					<el-table-column label="ID" prop="sUser_ID" fixed="left" :min-width="tableMaxWidth['1']" class-name="table-drugs-1">
					</el-table-column>
					<el-table-column label="用户名" prop="sUser_UserName" fixed="left" :min-width="tableMaxWidth['2']" class-name="table-drugs-2">
					</el-table-column>
					<el-table-column label="昵称" prop="sUser_Nick" fixed="left" :min-width="tableMaxWidth['3']" class-name="table-drugs-3">
					</el-table-column>
					<el-table-column label="密码" prop="sUser_PassWord"  :min-width="tableMaxWidth['4']" class-name="table-drugs-4">
					</el-table-column>
					<el-table-column label="用户组" prop="sUser_GroupID" :min-width="tableMaxWidth['5']" class-name="table-drugs-5">
					</el-table-column>
					<el-table-column label="状态" prop="lUser_StatusFlag" :formatter="(r,c) => {return r.lUser_StatusFlag ? '启用' : '禁用';}" :min-width="tableMaxWidth['6']" class-name="table-drugs-6">
					</el-table-column>
					<el-table-column label="QQ" prop="sUser_QQ" :min-width="tableMaxWidth['7']" class-name="table-drugs-7">
					</el-table-column>
					<el-table-column label="邮箱" prop="sUser_Email" :min-width="tableMaxWidth['8']" class-name="table-drugs-8">
					</el-table-column>
					<el-table-column label="电话" prop="sUser_Phone" :min-width="tableMaxWidth['9']" class-name="table-drugs-9">
					</el-table-column>
					<el-table-column label="第三方ID" prop="sUser_ThirdID" :min-width="tableMaxWidth['10']" class-name="table-drugs-10">
					</el-table-column>
					<el-table-column label="创建日期" prop="dUser_CreateDate" :formatter="(r,c) => {return formatDate(r.dUser_CreateDate);}" :min-width="tableMaxWidth['11']" class-name="table-drugs-11">
					</el-table-column>
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


export default {
  data: function() {
    return {
	    		activeTab: 'table',
				filters: {
					sUser_UserName: '',
					sUser_Nick: '',
					sUser_GroupID: ''
				},
				list: [],
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
				total: 0,
				page: 1,
				rows: 10,
				listLoading: false,
				sels: [],
				preloading: false,
				
				menuFuns: '',
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
				
				user: ''
			}
  },
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
      console.log(this);
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
    //has auth
    hasAuth: function(ref){
      this.$nextTick(()=>{
          console.log(ref);
          this.menuFuns = localStorage.getItem(this.$store.state.menuFunsDataKey);
          console.log(this.$refs);
          if(typeof this.authCache[ref] != "undefined"){
            return this.authCache[ref];
          }
          let flag = true;
          if(!this.$refs[ref]){
            return flag;
          }
          let auth = this.$refs[ref].$el.getAttribute('auth'); //不能获取$attrs，会死循环
          if(!auth){
            return flag;
          }
          for (var i = 0; i < this.menuFuns.length; i++) {
            if(this.menuFuns[i].sMFun_Button == auth){
              flag = true;
              break;
            }
          }
          this.authCache[ref] = flag;
          return flag;
      }); 
      return true;
    },
  }
}
</script>

<style>

</style>