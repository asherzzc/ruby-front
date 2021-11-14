<template>
    <el-container>
        <el-header class="head-container">
            <div class="head-left">
                <span>系统管理</span>
            </div>
          <div>
            <el-button icon="el-icon-bell" type="text" style="margin-right: 8px;color: #000000;" size="normal" @click="goChat"></el-button>
            <el-dropdown @command="commandHandler">
                <span class="el-dropdown-link">
                     {{user.name}}
                     <el-avatar :src="user.userFace"></el-avatar>
                </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
                <el-dropdown-item command="setting">设置</el-dropdown-item>
                <el-dropdown-item command="logout">注销登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-container>
            <el-aside width="200px">
<!--                router启动router模式 页面会自动根据index的path值进行路由跳转 而不需要添加@select方法-->
                <el-menu router unique-opened>
                    <el-submenu :index="index+''" v-for="(item,index) in route" :key="index" v-if="!item.hidden">
                        <template slot="title">
                            <i :class="item.iconCls" style="margin-right: 5px ; color: #1accff"></i>
                            <span>{{ item.name }}</span>
                        </template>
                        <el-menu-item-group v-for="(childrenList,index) in item.children" :key="index">
<!--                            index: 这个值的设置会影响点击链接时是否会激活active方法-->
                            <el-menu-item :index="childrenList.path">{{childrenList.name}}</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path !== '/home'">
                    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                </el-breadcrumb>

                <div class="homepageWelcome" v-if="this.$router.currentRoute.path === '/home'">
                    欢迎！！
                </div>
                <router-view class="homeRouteView"/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        data(){
            return{
                user: JSON.parse(window.sessionStorage.getItem('user'))
            }
        },
        methods:{
            // menuClick(index){
            //     this.$router.push(index);
            // }
          goChat(){
            this.$router.push('/chat');
          },
            commandHandler(command){
                if (command === 'logout'){
                this.$confirm('此操作将注销登录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        this.postRequest('/logout');
                        window.sessionStorage.removeItem('tokenString');
                        window.sessionStorage.removeItem('user');
                        this.$store.commit('initState',[]);
                        this.$router.replace('/');
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已注销登录'
                    });
                });
              }
              if (command === 'userInfo') {
                this.$router.push('/userinfo')
              }
            }
        },
        computed:{
            route(){
               return this.$store.state.routes;
            }
        }
    }
</script>

<style scoped>
    .head-container{
        background-color: hotpink;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .head-left span{
        font-size: 18px;
        font-weight: bold;
        font-family: "幼圆",serif;
    }
    .el-avatar{
        cursor: pointer;
    }
    .homepageWelcome{
        color: hotpink;
        font-size: 35px;
        text-align: center;
        padding-top: 100px;
    }
    .homeRouteView{
        margin-top: 20px;
    }
</style>