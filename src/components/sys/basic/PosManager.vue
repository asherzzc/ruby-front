<template>
    <div>
        <!--        添加区域-->
        <div class="posTop">
            <el-input placeholder="添加职位"
                      prefix-icon="el-icon-circle-plus-outline"
                      @keydown.enter.native="addPosition"
                      v-model="pos.name"
            >
            </el-input>

            <el-button type="primary" @click="addPosition">添加职位</el-button>
        </div>
        <!--        展示区域-->
        <div class="posBottom">
            <el-table
                    :data="positions"
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
                        label="职位名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建时间">
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
            <el-button type="danger" size="" style="margin-top: 8px" :disabled="this.multipleTable.length === 0" @click="batchDeletion">批量删除</el-button>

            <el-dialog
                    title="提示"
                    :visible.sync="dialogVisible"
                    width="30%"
                   >
                <div class="dialog-input">
                    <el-tag>职位编辑</el-tag>
                    <el-input prefix-icon="el-icon-edit" size="small" v-model="updatePos.name"></el-input>
                </div>
                <span slot="footer" class="dialog-footer">
                     <el-button @click="dialogVisible = false">取 消</el-button>
                     <el-button type="primary" @click="handleUpdate">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PosManager",
        data(){
            return{
                pos:{
                    name
                },
                positions:[],
                dialogVisible: false,
                updatePos:{
                    name
                },
                multipleTable:[]
            }
        },
        // 钩子函数 刚进入页面就渲染数据
        mounted() {
            this.initPositions();
        },
        methods:{
            //  展示
            initPositions(){
                this.getRequest('/system/basic/position/').then(resp=>{
                    if (resp){
                        this.positions = resp;
                    }
                })
            },
            addPosition(){
                if (this.pos.name){
                    this.postRequest('/system/basic/position/',this.pos).then(resp=>{
                        if (resp){
                            this.initPositions();
                            this.pos.name = '';
                        }else {
                            this.$message.error('添加失败');
                        }
                    })
                }else{
                    this.$message.error('输入为空，请重试');
                }
            },
            handleDelete(index,data){
                this.$confirm('此操作将永久删除职位['+data.name+'], 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest('/system/basic/position/'+data.id).then();
                    this.initPositions();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            // 编辑页打开
            initUpdate(index,data){
                Object.assign(this.updatePos,data);
                this.updatePos.createDate = ''; // 后端不需要这个数据
                this.dialogVisible = true;
            },
            // 实际修改方法
            handleUpdate(){
                this.putRequest('/system/basic/position/',this.updatePos).then(resp=>{
                    if (resp){
                        this.initPositions();
                        this.dialogVisible = false;
                    }
                })
            },
            handleSelectionChange(value){
                this.multipleTable = value;
            },
            batchDeletion(){
                this.$confirm('此操作将永久删除['+this.multipleTable.length+']条职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 采用url之间传输数据的方式 也可以将ID封装为一个数组 作为数据传给后端使用
                    let ids = '?';
                    this.multipleTable.forEach(item=>{
                        ids += 'ids=' + item.id + '&';
                    });
                    this.deleteRequest('/system/basic/position/'+ids).then(resp=>{
                        if (resp){
                            this.initPositions();
                        }
                    })
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
        .posTop .el-input{
            width: 220px;
            margin-right: 20px;
        }
        .posBottom{
            margin-top: 10px;
        }
        .dialog-input .el-input{
            width: 200px;
            margin-left: 8px;
        }
</style>