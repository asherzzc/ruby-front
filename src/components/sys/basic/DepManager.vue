<template>
    <div>
       <div class="deTop">
           <el-input type="text" placeholder="请输入搜索内容......" prefix-icon="el-icon-search" v-model="filterText"></el-input>
           <el-button type="primary" icon="el-icon-search">搜索</el-button>
       </div>
       <div class="deBottom">
<!--           :default-checked-keys="selectMenus"-->
           <el-tree
                   :props="props"
                   :data="allDepart"
                   node-key="id"
                   :filter-node-method="filterCheck"
                   :expand-on-click-node="false"
                   ref="tree">

               <span class="custom-tree-node" slot-scope="{ node, data }" style="display: flex;justify-content: space-between;width: 100%">
                    <span>{{ data.name }}</span>
                    <span>
                      <el-button
                              type="primary"
                              size="mini"
                              class="depBtn"
                              @click="() => addDepart(data)">
                        添加部门
                      </el-button>
                      <el-button
                              type="danger"
                              size="mini"
                              class="depBtn"
                              @click="() => remove(data)">
                        删除部门
                      </el-button>
                </span>
                </span>
           </el-tree>
       </div>

        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%">
            <div>
                <table>
                    <tr>
                        <td>
                            <el-tag>上级部门</el-tag>
                        </td>
                        <td>
                            <el-input type="text" size="small" v-model="pname"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <el-tag>下级部门</el-tag>
                        </td>
                        <td>
                            <el-input type="text" size="small" v-model="addDep.name"></el-input>
                        </td>
                    </tr>
                </table>
            </div>
            <span slot="footer" class="dialog-footer">

            <el-button @click="dialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="doAddDepart">确 定</el-button>

            </span>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        name: "DepManager",
        data() {
            return {
                allDepart: [],
                filterText: '',
                props: {
                    label: 'name',
                    children: 'children'
                },
                dialogVisible: false,
                addDep: {
                    name: '',
                    parentId: -1
                },
                // 父级部门名称
                pname: ''
            }
        },
        mounted() {
            this.initDepart();
        },
        // 监听搜索框
        watch: {
            filterText(text) {
                this.$refs.tree.filter(text);
            }
        },
        methods: {
            initDepart() {
                this.getRequest('/system/basic/department/').then(resp => {
                    this.allDepart = resp;
                })
            },
            filterCheck(text, data) {
                if (!text) return true;
                return data.name.indexOf(text) !== -1;
            },
            addDepart(data) {
                // 为显示赋值
                this.pname = data.name;
                // 将父id传给对象
                this.addDep.parentId = data.id;
                this.dialogVisible = true;
            },
            // 重置数据
            flushAddDept(){
                this.addDep = {
                    name: '',
                    parentId: -1
                };
                this.pname = '';
            },
            flushDataForAddDep(data,object){
                for (let i = 0;i<data.length;i++){
                    let node = data[i];
                    // 首先查看当前节点id是否和返回的对象父id一致
                    if (node.id === object.parentId){
                        // 满足条件就将children的值进行更换
                        node.children = node.children.concat(object);
                        if (node.children.length > 0){
                            node.isParent = true;
                        }
                        return;
                    }else {
                        // 若不满足 则继续调用 遍历下面的子节点
                        this.flushDataForAddDep(node.children,object);
                    }
                }
            },
            /**
             * 由于想获得插入后，在不重置结构图的情况下，也能进行数据刷新的效果，所以需要再编写一个方法，用于将数据临时存放到当前菜单缓存中。
             */
            doAddDepart() {
                this.postRequest('/system/basic/department/', this.addDep).then(resp => {
                    if (resp) {
                        this.dialogVisible = false;
                        this.flushAddDept(); //重置数据
                        this.flushDataForAddDep(this.allDepart,resp.object); // 添加节点
                    }
                })
            },
            flushDataForDeleteDepart(p,data,id){
                for (let i = 0; i < data.length; i++) {
                    let node = data[i];
                    // 由于这里只是对数据进行了移除 但却没有刷新数据 所以可能某些已经不是父部门的数据无法删除
                    if (node.id === id) {
                        data.splice(i, 1);
                        //判断当前数据是否为空
                        if (data.length === 0){
                            // 如果是 则将isparent改变
                            p.isParent = false;
                        }
                        return;
                    }else {
                        this.flushDataForDeleteDepart(p,node.children,id);
                    }
                }
            },
            // 删除
            // 和更新一致，我们依旧要额外添加一个方法进行数据的移除
            remove(data){
                if (!data.isParent){
                    this.$confirm('此操作将永久删除职位['+data.name+'], 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteRequest('/system/basic/department/'+data.id).then(resp=>{
                            if (resp){
                                // 删除数据
                                this.flushDataForDeleteDepart(null,this.allDepart,data.id);
                                // 关闭dialogue
                                this.dialogVisible = false;
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                } else{
                    this.$message.error('父部门不可随意删除！！');
                }
            }
        }
    }
</script>
<style scoped>

    .deTop .el-input{
        width: 400px;
        margin-right: 10px;
        margin-bottom: 10px;
    }
    .deBottom .el-tree{
        width: 700px;
    }
    .depBtn{
        padding: 2px;
    }
</style>