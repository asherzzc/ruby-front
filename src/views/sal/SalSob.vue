<template>
    <div>
      <div style="display: flex;justify-content: space-between">
        <el-button icon="el-icon-plus" type="primary" @click="showAddView">添加工资账套</el-button>
        <el-button icon="el-icon-refresh" type="success" @click="initSalaries"></el-button>
      </div>
      <div style="margin-top: 10px">
        <el-table :data="salaries" border stripe>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column width="120" prop="name" label="账套名称"></el-table-column>
          <el-table-column width="70" prop="basicSalary" label="基本工资"></el-table-column>
          <el-table-column width="70" prop="trafficSalary" label="交通补助"></el-table-column>
          <el-table-column width="70" prop="lunchSalary" label="午餐补助"></el-table-column>
          <el-table-column width="70" prop="bonus" label="奖金"></el-table-column>
          <el-table-column width="100" prop="createDate" label="启用时间"></el-table-column>
          <el-table-column label="养老金" align="center">
            <el-table-column width="70" prop="pensionPer" label="比率"></el-table-column>
            <el-table-column width="70" prop="pensionBase" label="基数"></el-table-column>
          </el-table-column>
          <el-table-column label="医疗保险" align="center">
            <el-table-column width="70" prop="medicalPer" label="比率"></el-table-column>
            <el-table-column width="70" prop="medicalBase" label="基数"></el-table-column>
          </el-table-column>
          <el-table-column label="公积金" align="center">
            <el-table-column width="70" prop="accumulationFundPer" label="比率"></el-table-column>
            <el-table-column width="70" prop="accumulationFundBase" label="基数"></el-table-column>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primer" @click="showEditView(scope.row)">编辑</el-button>
              <el-button type="danger" @click="deleteSalary(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
          :title="dialogTitle"
          :visible.sync="dialogVisible"
          width="30%">
        <div style="display: flex;justify-content: space-around;align-items: center">
          <el-steps direction="vertical" :active="activeStep">
            <el-step :title="ItemName" :key="index" v-for="(ItemName, index) in salaryItemName"></el-step>
          </el-steps>
          <el-input :placeholder="'请输入'+salaryItemName[index]+'...'"
                    v-show="activeStep == index"
                    v-model="salary[title]"
                    v-for="(values,title,index) in salary"
                    style="width: 200px"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="preStep">{{activeStep == 0 ? '取 消':'上一步'}}</el-button>
          <el-button type="primary" @click="nextStep">{{activeStep == 10 ? '确 定':'下一步'}}</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "SalSob",
      data(){
          return{
            dialogTitle:'',
            dialogVisible: false,
            activeStep: 0,
            salaryItemName:[
              '基本工资',
              '交通补助',
              '午餐补助',
              '奖金',
              '养老金比率',
              '养老金基数',
              '医疗保险比率',
              '医疗保险基数',
              '公积金比率',
              '公积金基数',
              '账套名称'
            ],
            salary: {
              basicSalary: 0,
              trafficSalary: 0,
              lunchSalary: 0,
              bonus: 0,
              pensionPer: 0,
              pensionBase: 0,
              medicalPer: 0,
              medicalBase: 0,
              accumulationFundPer: 0,
              accumulationFundBase: 0,
              name: ''
            },
            salaries:[]
          }
      },
      mounted() {
        this.initSalaries();
      },
      methods:{
        deleteSalary(data){
          this.$confirm('此操作将删除【' + data.name + '】账套，是否继续？', '提示', {
            cancelButtonText: '取消',
            confirmButtonText: '确定'
          }).then(() => {
            this.deleteRequest("/salary/sob/" + data.id).then(resp => {
              if (resp) {
                this.initSalaries();
              }
            })
          }).catch(() => {
            this.$message.info("取消删除!");
          })
        },
        showEditView(data){
          this.activeStep = 0;
          this.dialogTitle = '修改工资账套';
          this.dialogVisible = true;
          this.salary.basicSalary = data.basicSalary;
          this.salary.trafficSalary = data.trafficSalary;
          this.salary.lunchSalary = data.lunchSalary;
          this.salary.bonus = data.bonus;
          this.salary.pensionPer = data.pensionPer;
          this.salary.pensionBase = data.pensionBase;
          this.salary.medicalPer = data.medicalPer;
          this.salary.medicalBase = data.medicalBase;
          this.salary.accumulationFundPer = data.accumulationFundPer;
          this.salary.accumulationFundBase = data.accumulationFundBase;
          this.salary.name = data.name;
          this.salary.id = data.id;
        },
        preStep(){
          if (this.activeStep == 0) {
            return;
          } else if (this.activeStep == 10) {
            //关闭对话框
            this.dialogVisible = false;
            return;
          }
          this.activeStep--;
        },
        nextStep() {
          if (this.activeStep == 10) {
            if (this.salary.id) {
              this.postRequest("/salary/sob/", this.salary).then(resp=>{
                if (resp) {
                  this.initSalaries();
                  this.dialogVisible = false;
                }
              })
            } else {
              this.putRequest("/salary/sob/", this.salary).then(resp => {
                if (resp) {
                  this.initSalaries();
                  this.dialogVisible = false;
                }
              });
            }
            return;
          }
          this.activeStep++;
        },
        showAddView(){
          this.dialogTitle = '添加工资账套';
          //数据初始化
          this.salary = {
            basicSalary: 0,
            trafficSalary: 0,
            lunchSalary: 0,
            bonus: 0,
            pensionPer: 0,
            pensionBase: 0,
            medicalPer: 0,
            medicalBase: 0,
            accumulationFundPer: 0,
            accumulationFundBase: 0,
            name: ''
          }
            this.activeStep = 0;
            this.dialogVisible = true;
        },
          initSalaries(){
              this.getRequest('/salary/sob/').then(response => {
                  this.salaries = response;
              })
          }
      }
    }
</script>

<style scoped>

</style>