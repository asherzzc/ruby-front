<template>
  <div>
    <div>
      <div style="display: flex;justify-content: space-between">
        <div>
          <el-input v-model="empName"
                    @keydown.enter.native="initEmployee"
                    placeholder="请输入员工名进行搜索..."
                    prefix-icon="el-icon-search"
                    clearable
                    @clear="clearEmpNameInput"
                    style="width: 300px;margin-right: 10px"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="initEmployee">搜索</el-button>
          <!--                展开高级选项-->
          <el-button type="primary">
            <i class="fa fa-angle-double-down"></i>
            高级搜索
          </el-button>
        </div>
        <div>
          <el-button type="success">
            <i class="fa fa-level-up"></i>
            导入数据
          </el-button>
          <el-button type="success">
            <i class="fa fa-level-down"></i>
            导出数据
          </el-button>
          <el-button type="primary" icon="el-icon-plus" @click="showView">添加</el-button>
        </div>
      </div>

      <div style="border: 1px solid pink;border-radius: 5px;box-sizing: border-box;padding: 5px;margin: 10px 0px;">
        <el-row>
          <el-col :span="5">
            政治面貌:
            <el-select v-model="emp.politicId" placeholder="政治面貌" size="mini"
                       style="width: 130px;">
              <el-option
                  v-for="item in politicsstatus"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            民族:
            <el-select v-model="emp.nationId" placeholder="民族" size="mini"
                       style="width: 130px;">
              <el-option
                  v-for="item in nations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            职位:
            <el-select v-model="emp.posId" placeholder="职位" size="mini" style="width: 130px;">
              <el-option
                  v-for="item in positions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            职称:
            <el-select v-model="emp.jobLevelId" placeholder="职称" size="mini"
                       style="width: 130px;">
              <el-option
                  v-for="item in joblevels"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="7">
            聘用形式:
            <el-radio-group v-model="emp.engageForm">
              <el-radio label="劳动合同">劳动合同</el-radio>
              <el-radio label="劳务合同">劳务合同</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="10">
            入职日期:
            <el-date-picker
                v-model="emp.beginDate"
                type="daterange"
                size="mini"
                unlink-panels
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-col>
          <el-col :span="5" :offset="4">
            <el-button size="mini">取消</el-button>
            <el-button size="mini" icon="el-icon-search" type="primary">搜索</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div style="margin-top: 10px">
      <el-table
          :data="emps"
          border
          stripe
          width="70%">
        <el-table-column
            prop="name"
            label="姓名"
            fixed
            width="50">
        </el-table-column>
        <el-table-column
            prop="gender"
            label="性别"
            width="50"
        >
        </el-table-column>
        <el-table-column
            prop="birthday"
            label="出生日期"
            width="70"
        >
        </el-table-column>
        <el-table-column
            prop="idCard"
            label="身份证"
            width="70"
        >
        </el-table-column>
        <el-table-column
            prop="wedlock"
            label="婚姻状况"
            width="50"
        >
        </el-table-column>
        <el-table-column
            prop="nation.name"
            label="民族"
            width="50"
        >
        </el-table-column>
        <el-table-column
            prop="nativePlace"
            label="工作地点"
            width="50"
        >
        </el-table-column>
        <el-table-column
            prop="politicsStatus.name"
            label="政治面貌"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱"
            width="70"
        >
        </el-table-column>
        <el-table-column
            prop="phone"
            label="电话号码"
            width="70"
        >
        </el-table-column>
        <el-table-column
            prop="address"
            label="住址"
            width="250"
        >
        </el-table-column>
        <el-table-column
            prop="department.name"
            label="部门"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="joblevel.name"
            label="职称"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="position.name"
            label="职位"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="engageForm"
            label="劳动合同"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="tiptopDegree"
            label="最高学历"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="specialty"
            label="专业"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="school"
            label="毕业院校"
            width="200"
        >
        </el-table-column>
        <el-table-column
            prop="beginDate"
            label="入职时间"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="beginDate"
            label="入职时间"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="workState"
            label="工作状态"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="workID"
            label="工号"
            width="100"
        >
        </el-table-column>
        <el-table-column
            label="工龄"
            width="100"
        >
          <template scope="scope">
            <el-tag>{{ scope.row.contractTerm }}</el-tag>
            年
          </template>
        </el-table-column>
        <el-table-column
            prop="conversionTime"
            label="合同期限"
            width="100"
        >
        </el-table-column>
        <!--                <el-table-column-->
        <!--                        prop="notWorkDate"-->
        <!--                        label="离职日期"-->
        <!--                        width="100"-->
        <!--                >-->
        <!--                </el-table-column>-->
        <el-table-column
            prop="conversionTime"
            label="合同期限"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="beginContract"
            label="合同起始日期"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="endContract"
            label="合同终止时间"
            width="100"
        >
        </el-table-column>
        <!--                <el-table-column-->
        <!--                        prop="workAge"-->
        <!--                        label="工龄"-->
        <!--                        width="100"-->
        <!--                >-->
        <!--                </el-table-column>-->
        <el-table-column
            prop="salary.basicSalary"
            label="基本工资"
            width="100"
        >
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="150">
          <template scope="scope">
            <el-button style="padding: 3px">编辑</el-button>
            <el-button type="danger" style="padding: 3px">删除</el-button>
            <el-button type="primary" style="padding: 3px">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end;margin-top: 5px">
        <el-pagination
            background
            @current-change="currentPageChange"
            @size-change="pageSizeChange"
            layout="sizes, prev, pager, next, jumper, ->, total, slot"
            :total="total">
        </el-pagination>
      </div>

      <el-dialog
          title="添加员工"
          :visible="dialogVisible"
          width="80%">
        <div>
          <el-form ref="empForm" v-model="emp">
            <el-row>
              <el-col :span="6">
                <el-form-item label="姓名：" prop="name">
                  <el-input size="mini" style="width: 150px" prefix-icon="el-icon-edit" placeholder="请输入姓名..." v-model="emp.name"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="性别：" prop="gender">
                  <el-radio-group v-model="emp.gender">
                    <el-radio :label="3">男</el-radio>
                    <el-radio :label="6">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出生日期：" prop="birthday">
                  <el-date-picker
                      v-model="emp.birthday"
                      align="right"
                      type="date"
                      size="mini"
                      style="width: 200px"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="身份证号：" prop="idCard">
                  <el-input size="mini" style="width: 150px" v-model="emp.idCard"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="7">
                <el-form-item label="婚姻：" prop="wedlock" >
                  <el-radio-group v-model="emp.wedlock" style="width: 240px">
                    <el-radio :label="3">已婚</el-radio>
                    <el-radio :label="6">未婚</el-radio>
                    <el-radio :label="7">离异</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="民族：" prop="nationId" >
                  <el-select v-model="emp.nationId" placeholder="请选择">
                    <el-option
                        v-for="item in nations"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="邮箱：" prop="email" >
                  <el-input size="mini" style="width: 150px" v-model="emp.email"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="号码：" prop="phone" >
                  <el-input size="mini" style="width: 150px" v-model="emp.phone"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="6">
                <el-form-item label="城市：" prop="nativePlace">
                  <el-input style="width: 150px;" size="mini"  v-model="emp.nativePlace" placeholder="请输入城市..."></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="地址：" prop="address">
                  <el-input style="width: 150px" size="mini" v-model="emp.address"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="部门：" prop="departmentId">
                  <el-select v-model="emp.departmentId" size="mini" placeholder="请选择">
                    <el-option
                        v-for="item in department"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="职称：" prop="jobLevelId">
                  <el-select v-model="emp.jobLevelId" size="mini" placeholder="请选择">
                    <el-option
                        v-for="item in joblevels"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="职位：" prop="posId">
                  <el-select v-model="emp.posId" placeholder="请选择">
                    <el-option
                        v-for="item in positions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合同：" prop="engageForm">
                  <el-input v-model="emp.engageForm" style="width: 150px" size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="学历：" prop="tiptopDegree">
                  <el-input v-model="emp.tiptopDegree" style="width: 150px" size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="专业：" prop="specialty">
                  <el-input v-model="emp.specialty" style="width: 150px" size="mini"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="学校：" prop="school">
                  <el-input v-model="emp.school" style="width: 150px" size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="入职时间：" prop="beginDate">
                  <el-date-picker
                      v-model="emp.beginDate"
                      align="right"
                      type="date"
                      size="mini"
                      style="width: 200px"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="状态：" prop="workState">
                  <el-input v-model="emp.workState" style="width: 150px" size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="工号：" prop="workID">
                  <el-input v-model="emp.workID" style="width: 150px" size="mini"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="合同期限：" prop="contractTerm">
                  <el-date-picker
                      v-model="emp.contractTerm"
                      align="right"
                      type="date"
                      size="mini"
                      style="width: 200px"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="转正时间：" prop="conversionTime">
                  <el-date-picker
                      v-model="emp.conversionTime"
                      align="right"
                      type="date"
                      size="mini"
                      style="width: 200px"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="离职时间：" prop="notWorkDate">
                  <el-date-picker
                      v-model="emp.notWorkDate"
                      align="right"
                      type="date"
                      size="mini"
                      style="width: 200px"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合同起始：" prop="beginContract">
                  <el-date-picker
                      v-model="emp.beginContract"
                      align="right"
                      type="date"
                      size="mini"
                      style="width: 200px"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="合同终止时间：" prop="endContract">
                  <el-date-picker
                      v-model="emp.endContract"
                      align="right"
                      type="date"
                      size="mini"
                      style="width: 200px"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="工龄：" prop="workAge">
                  <el-input v-model="emp.workAge" style="width: 150px" size="mini"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="工资账套：" prop="salaryId">
                  <el-input v-model="emp.salaryId" style="width: 150px" size="mini"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>

        <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>

      </el-dialog>
    </div>
  </div>

</template>

<script>
    export default {
        name: "EmpBasic",
        data(){
            return{
                nations: [],
                joblevels: [],
                politicsstatus: [],
                positions: [],
                department:[],
                tiptopDegrees: ['本科', '大专', '硕士', '博士', '高中', '初中', '小学', '其他'],
                emps:[],
                total:'',
                currentPage: 1,
                size:10,
                empName:'',
                dialogVisible: false,

                emp:{
                        name: '',
                        gender:'',
                        birthday: '',
                        idCard: '',
                        wedlock: '',
                        nationId: null,
                        nativePlace: '',
                        politicId: null,
                        email: '',
                        phone: '',
                        address: '',
                        departmentId: null,
                        jobLevelId: null,
                        posId: null,
                        engageForm: '',
                        tiptopDegree: '',
                        specialty: '',
                        school: '',
                        beginDate: '',
                        workState: '',
                        workID: null,
                        conversionTime: '',
                        contractTerm:'',
                        notWorkDate: null,
                        beginContract: '',
                        endContract: '',
                        workAge: null,
                        salaryId: null
                    }
            }
        },
        mounted() {
            this.initEmployee();
        },
        methods:{
            currentPageChange(currentPage){
                this.currentPage = currentPage;
                this.initEmployee();
            },
            pageSizeChange(pageSize){
                this.size = pageSize;
                this.initEmployee();
            },
            clearEmpNameInput(){
                this.initEmployee();
            },
            showView(){
                this.dialogVisible = true;
            },
            initEmployee(){
              if (!window.sessionStorage.getItem("department")) {
                this.getRequest('/employee/basic/department').then(resp => {
                  if (resp) {
                    this.nations = resp;
                    window.sessionStorage.setItem("department", JSON.stringify(resp));
                  }
                })
              } else {
                this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
              }
              if (!window.sessionStorage.getItem("positions")) {
                this.getRequest('/employee/basic/position').then(resp => {
                  if (resp) {
                    this.nations = resp;
                    window.sessionStorage.setItem("positions", JSON.stringify(resp));
                  }
                })
              } else {
                this.nations = JSON.parse(window.sessionStorage.getItem("positions"));
              }
              if (!window.sessionStorage.getItem("nations")) {
                this.getRequest('/employee/basic/nation').then(resp => {
                  if (resp) {
                    this.nations = resp;
                    window.sessionStorage.setItem("nations", JSON.stringify(resp));
                  }
                })
              } else {
                this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
              }
              if (!window.sessionStorage.getItem("joblevels")) {
                this.getRequest('/employee/basic/joblevel').then(resp => {
                  if (resp) {
                    this.joblevels = resp;
                    window.sessionStorage.setItem("joblevels", JSON.stringify(resp));
                  }
                })
              } else {
                this.joblevels = JSON.parse(window.sessionStorage.getItem("joblevels"));
              }
              if (!window.sessionStorage.getItem("politicsstatus")) {
                this.getRequest('/employee/basic/politics').then(resp => {
                  if (resp) {
                    this.politicsstatus = resp;
                    window.sessionStorage.setItem("politicsstatus", JSON.stringify(resp));
                  }
                })
              } else {
                this.politicsstatus = JSON.parse(window.sessionStorage.getItem("politicsstatus"));
              }
                this.getRequest('/employee/basic/?start='+this.currentPage+'&size='+this.size+'&name='+this.empName).then(resp=>{
                    this.emps = resp.data;
                    this.total = resp.total;
                })
            },

        }
    }
</script>

<style scoped>
</style>