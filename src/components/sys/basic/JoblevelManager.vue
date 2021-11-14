<template>
    <div>
        <div class="jlTop">
            <el-input type="text" placeholder="请输入职位" v-model="jobInfo.name" prefix-icon="el-icon-plus"></el-input>
            <el-select v-model="jobInfo.titleLevel" placeholder="请选择">
                <el-option
                        v-for="item in jobLevels"
                        :key="item"
                        :label="item"
                        :value="item">
                </el-option>
            </el-select>
            <el-button type="primary" @click="addJobLevel">添加职称</el-button>
        </div>

        <div class="jlBottom">
            <el-table
                    :data="jobLevelInfo"
                    border
                    stripe
                    @selection-change="handleSelectionChange"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职称名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="titleLevel"
                        label="职称等级"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        prop="enabled"
                        label="是否启用">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
                        <el-tag type="danger" v-else>未启用</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="initUpdate(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="danger" :disabled="this.multipleTable.length === 0" @click="doBatchDeletion" style="margin-top: 10px">批量删除</el-button>
<!--            编辑提示框-->
            <el-dialog
                    title="提示"
                    :visible.sync="dialogVisible"
                    width="30%"
            >
                <div class="jlTop">
                 <table>
                     <tr>
                         <td>
                             <el-tag>职称名称</el-tag>
                             <el-input prefix-icon="el-icon-edit" size="small" v-model="jobInfoUpdate.name" style="width: 150px;margin-left: 10px"></el-input>
                         </td>
                     </tr>
                     <tr>
                         <td>
                             <el-tag>职称等级</el-tag>
                             <el-select v-model="jobInfoUpdate.titleLevel" placeholder="请选择">
                                 <el-option
                                         v-for="item in jobLevels"
                                         :key="item"
                                         :label="item"
                                         :value="item">
                                 </el-option>
                             </el-select>
                         </td>
                     </tr>
                     <tr>
                         <td>
                             <el-tag>是否启用</el-tag>
                             <el-switch
                                     v-model="jobInfoUpdate.enabled"
                                     active-color="#13ce66"
                                     inactive-color="#ff4949"
                                     active-value=true
                                     inactive-value=false
                                     style="margin-left: 10px">
                             </el-switch>
                         </td>
                     </tr>
                 </table>


                </div>
                <span slot="footer" class="dialog-footer">
                     <el-button @click="dialogVisible = false">取 消</el-button>
                     <el-button type="primary" @click="doUpdate">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "JoblevelManager",
        data(){
            return{
                jobInfo:{
                  name: '',
                  titleLevel: ''
                },
                jobInfoUpdate:{
                    id:'',
                    name: '',
                    titleLevel: '',
                    enabled: false
                },
                jobLevels:[
                    '正高级',
                    '副高级',
                    '初级',
                    '中级',
                    '员级'
                ],
                jobLevelInfo:[],
                dialogVisible: false,
                multipleTable:[]
            }
        },
        // 钩子函数
        mounted(){
            this.initJobLevel();
        },
        methods:{
            // 查询所有数据
            initJobLevel(){
                this.getRequest('/system/basic/joblevel/').then(resp=>{
                    this.jobLevelInfo = resp;
                });
            },
            // 添加职位信息
            addJobLevel(){
                if (this.jobInfo.name && this.jobInfo.titleLevel){
                    this.postRequest('/system/basic/joblevel/',this.jobInfo).then(resp=>{
                        if (resp){
                            this.initJobLevel();
                            this.jobInfo.name = '';
                            this.jobInfo.titleLevel = '';
                        }else {
                            this.$message.error('添加失败');
                        }
                    })
                }
            },
            // 删除
            handleDelete(index,data){
                this.$confirm('此操作将永久删除职称['+data.name+'], 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (data){
                        this.deleteRequest('/system/basic/joblevel/'+data.id).then(resp=>{
                            this.initJobLevel(); // 刷新页面
                        })
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 编辑
            initUpdate(index,data){
               Object.assign( this.jobInfoUpdate ,data);
                this.jobInfoUpdate.createDate = '';
                this.dialogVisible = true;
            },
            doUpdate(){
                if (this.jobInfoUpdate){
                    this.putRequest('/system/basic/joblevel/',this.jobInfoUpdate).then(resp=>{
                        this.dialogVisible = false;
                        this.jobInfoUpdate = '';
                        this.initJobLevel();
                    })

                }else {
                    this.$message.error('输入值不能为空！！')
                }
            },
            // 批量删除
            handleSelectionChange(value){
                this.multipleTable = value;
            },
            // 批量删除
            doBatchDeletion(){
                this.$confirm('此操作将永久删除['+this.multipleTable.length+']条职称, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    this.multipleTable.forEach(item=>{
                        ids += 'ids=' + item.id + '&';
                    });
                    this.deleteRequest('/system/basic/joblevel/'+ids).then(resp =>{
                        this.initJobLevel();
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style scoped>
    .jlTop .el-input{
        width: 200px;
    }
    .jlTop .el-select{
        margin: 0 10px;
    }
    .jlBottom .el-table{
        margin-top: 10px;
    }
    .el-dialog .jlTop .el-input{
        width: 150px;
    }
</style>