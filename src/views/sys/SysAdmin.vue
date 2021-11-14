<template>
    <div>
        <div class="adminTop">
            <el-input placeholder="请输入搜索内容....." prefix-icon="el-icon-search" v-model="keywords"></el-input>
            <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
        </div>
        <div class="adminBottom">
            <el-card class="box-card" v-for="(admin,index) in admins" :key="index">
                <div slot="header" class="clearfix">
                    <span>{{ admin.name }}</span>
                    <el-button style="float: right; padding: 3px 0;color: red" type="text" icon="el-icon-delete" @click="doDelete(admin)"></el-button>
                </div>
                <div class="adminImg">
                    <img :src="admin.userFace" :alt="admin.name" :title="admin.title">
                </div>
                <div>
                    <div>手机号码：{{ admin.phone }}</div>
                    <div>住宅电话：{{ admin.telephone }}</div>
                    <div>联系地址：{{ admin.address }}</div>
                    <div>用户名：{{ admin.username }}</div>
                    <div>
                        使用状态：
                        <el-switch
                                v-model="admin.enabled"
                                active-color="#13ce66"
                                active-text="开启"
                                inactive-text="禁用"
                                inactive-color="#ff4949"
                        @change="enableChange(admin)">
                        </el-switch>
                    </div>
                    <div>
                        <el-tag v-for="(role,index) in admin.roles" style="margin-right: 5px">{{ role.nameZh }}</el-tag>
                        <el-popover
                                placement="right"
                                width="200"
                                @show="getAllRoles(admin)"
                                @hide="updateRoles(admin)"
                                trigger="click">
                            <el-button icon="el-icon-more" size="small" slot="reference"></el-button>
                            <el-select v-model="selectedRoles" multiple placeholder="请选择" size="small">
                                <el-option
                                        v-for="item in allRoles"
                                        :key="index"
                                        :label="item.nameZh"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-popover>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SysAdmin",
        data(){
            return{
                admins:[],
                keywords:'',
                // 所有角色
                allRoles:[],
                selectedRoles:[]
            }
        },
        mounted() {
          this.initAdmins();
        },
        methods:{
            // 查询除当前用户以外的管理员
            initAdmins(){
                this.getRequest('/system/admin/?keywords='+this.keywords).then(resp=>{
                    this.admins = resp;
                })
            },
            // 搜索
            doSearch(){
                this.initAdmins();
            },
            // 删除
            doDelete(admin){
                this.$confirm('此操作将永久删除操作员['+admin.name+'], 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest('/system/admin/'+admin.id).then(resp=>{
                        if (resp){
                            this.initAdmins();
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 更新
            enableChange(admin){
                this.putRequest('/system/admin/',admin).then(resp=>{
                    if (resp){
                        this.initAdmins();
                    }
                })
            },

            // 获取所有角色 在弹出框点开时调用
            getAllRoles(admin){
                // 将操作员自带的角色赋值到selectedRoles中
                this.selectedRoles = [];
                admin.roles.forEach(role=>{
                    this.selectedRoles.push(role.id);
                });

                this.getRequest('/system/admin/roles').then(resp=>{
                    this.allRoles = resp;
                })
            },
            updateRoles(admin){
                let roles = [];
                let flag = false;
                Object.assign(roles,admin.roles); // 将值复制到新建对象

                if (roles.length !== this.selectedRoles.length){
                    flag = true;
                }else {
                    for (let i = 0; i < roles.length; i++) {
                        let role = roles[i];
                        for (let j = 0; j < this.selectedRoles.length; j++) {
                            let selected = this.selectedRoles[j];
                            if (role.id === selected){
                                roles.splice(i,1); // 把一致的role删除
                                i--; // 由于对roles的数据进行了删除 后续的索引会前移 那么就会导致当前数据的原本的索引无法访问 所以需要-1配合使用
                                break;
                            }
                        }
                    }
                    //
                    if (roles.length !== 0){
                        flag = true;
                    }
                }

                alert(flag);
                if (flag){
                    let url = '/system/admin/roles?adminId='+admin.id;
                    this.selectedRoles.forEach(role=>{
                        url += '&rids='+role;
                    });
                    this.putRequest(url).then(resp=>{
                        if (resp){
                            this.initAdmins();
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>
    .adminTop{
        display: flex;
        justify-content: center;
    }
    .adminTop .el-input{
        width: 300px;
        margin-right: 10px;
    }
    .adminBottom{
        padding: 10px;
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }
    .adminBottom .el-card{
        margin-bottom: 20px;
    }
    .adminImg{
        display: flex;
        justify-content: center;
    }
    .adminImg img{
        width: 80px;
        height: 80px;
        border-radius: 45px;
    }
</style>