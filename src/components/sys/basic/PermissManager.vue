<template>
    <div>
<!--        添加角色-->
        <div class="perTop">
<!--            Spring Security要求角色必须以ROLE_开头-->
            <el-input type="text" v-model="addRole.name" placeholder="请输入角色英文名">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input type="text" v-model="addRole.nameZh" placeholder="请输入角色中文名称"></el-input>
            <el-button type="primary" @click="doAddRole" @keydown.enter.native="doAddRole">添加角色</el-button>
        </div>
        <div class="perBottom">
            <el-collapse v-model="activeName" accordion  @change="handleCheckChange">
                <el-collapse-item :title="role.nameZh" :name="role.id" v-for="(role,index) in roles">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>{{ role.name }}</span>
                            <el-button style="float: right; padding: 3px 0;color: red" type="text" icon="el-icon-delete" @click="doDeleteRole(role)"></el-button>
                        </div>
<!--                        由于菜单具有层次性 所以采用树形控件-->
                        <el-tree
                                :props="props"
                                :data="allMenus"
                                :default-checked-keys="selectMenus"
                                node-key="id"
                                ref="tree"
                                show-checkbox
                               >
                        </el-tree>
                        <div style="display: flex;justify-content: flex-end">
                            <el-button @click="cancleUpdate" size="small">取消修改</el-button>
                            <el-button type="primary" @click="doUpdate(role.id,index)" size="small">确认修改</el-button>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PermissManager",
        data(){
            return{
                addRole:{
                    name:'',
                    nameZh:''
                },
                roles:[],
                //默认不展开 否则加载菜单的方法需要放到钩子函数
                activeName: -1,
                allMenus:[],
                props:{
                    label:'name',
                    children: 'children'
                },
                // 默认选中的菜单号
                selectMenus:[]
            }
        },
        mounted() {
          this.initRoles();
        },
        methods:{
            // 刷新角色信息
            initRoles(){
                this.getRequest('/system/basic/role/').then(resp=>{
                    this.roles = resp;
                })
            },
            // 手风琴点击事件
            handleCheckChange(rid){
                if (rid){
                    this.initAllMenus();
                    this.getMenusByRid(rid);
                }
            },
            // 刷新所有菜单
            initAllMenus(){
                this.getRequest('/system/basic/role/menus').then(resp=>{
                    if (resp){
                        this.allMenus = resp;
                    }
                })
            },
            // 获得对应角色的菜单号
            getMenusByRid(rid){
                this.getRequest('/system/basic/role/mid/'+rid).then(resp=>{
                    this.selectMenus = resp;
                })
            },
            // 取消修改事件
            cancleUpdate(){
                this.activeName = -1;
            },
            doUpdate(rid,index){
               let treeNode = this.$refs.tree[index];
               let selected = treeNode.getCheckedNodes(true);

               let url = '/system/basic/role/?rid='+rid;
               selected.forEach(mid=>{
                  url += '&mids='+mid.id;
               });
               this.putRequest(url).then(resp=>{
                   if (resp){
                       this.activeName = -1;
                   }
               });
            },
            doAddRole(){
                if (this.addRole.name && this.addRole.nameZh){
                    this.postRequest('/system/basic/role/',this.addRole).then(resp=>{
                        this.initRoles();
                        this.addRole = '';
                    })
                }else {
                    this.$message.error('请填写所有字段！！');
                }
            },
            doDeleteRole(role){
                this.$confirm('此操作将永久删除角色['+role.nameZh+'], 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest('/system/basic/role/'+role.id).then(resp=>{
                        this.initRoles();
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
    .perTop .el-input{
        width: 300px;
        margin-right: 10px;
    }
    .perBottom{
        margin-top: 10px;
    }
</style>