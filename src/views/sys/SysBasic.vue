<template>
    <el-tabs v-model="activeName">
        <el-tab-pane label="部门管理" name="DepManager"><DepManager></DepManager></el-tab-pane>
        <el-tab-pane label="职位管理" name="PosManager"><PosManager></PosManager></el-tab-pane>
        <el-tab-pane label="职称管理" name="JoblevelManager"><JoblevelManager></JoblevelManager></el-tab-pane>
        <el-tab-pane label="奖惩规则" name="ExManager"><ExManager></ExManager></el-tab-pane>
        <el-tab-pane label="权限组" name="PermissManager"><PermissManager></PermissManager></el-tab-pane>
    </el-tabs>
</template>

<script>
    import JoblevelManager from "../../components/sys/basic/JoblevelManager";
    import DepManager from "../../components/sys/basic/DepManager";
    import ExManager from "../../components/sys/basic/ExManager";
    import PermissManager from "../../components/sys/basic/PermissManager";
    import PosManager from "../../components/sys/basic/PosManager";

    export default {
        name: "SysBasic",
        data(){
            return{
                activeName: 'DepManager'
            }
        },
        components:{
            JoblevelManager,
            DepManager,
            ExManager,
            PermissManager,
            PosManager
        }
    }
</script>

<style scoped>

</style>