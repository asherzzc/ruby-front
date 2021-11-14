<template>
    <div>
        <el-form :model="LoginForm"
                 :rules="rules"
                 v-loading="loading"
                 element-loading-text="拼命加载中"
                 element-loading-spinner="el-icon-loading"
                 element-loading-background="rgba(0, 0, 0, 0.8)"
                 @keydown.enter.native="submitForm"
                 ref="LoginForm"
                 class="LoginContainer">
            <h3 class="LoginTitle">系统登录</h3>
            <el-form-item prop="username">
                <el-input type="text" auto-complete="false" v-model="LoginForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" auto-complete="false" v-model="LoginForm.password" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input type="text" placeholder="请输入验证码" auto-complete="false" v-model="LoginForm.code" style="width: 50%"></el-input>
                <img :src="captchaUrl" @click="flashImg" alt="" style="margin: 0 0 -15px 20px">
            </el-form-item>
            <el-form-item  style="margin:10px 40% 10px 40%">
                <el-checkbox v-model="checked">记住我</el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" style="width:100%" @click="submitForm">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: "Login",
        data(){
            return{
                // 图形验证码刷新
                captchaUrl:'/kaptcha?time='+new Date(),
                loading:false,
                LoginForm:{
                    code:'',
                    password:'',
                    username:'',
                },
                checked: true,
                rules:{
                    username:[{required:true,message:'请输入用户名',trigger:'blur'}],
                    password:[{required:true,message:'请输入密码',trigger:'blur'}],
                    code:[{required:true,message:'请输入验证码',trigger:'blur'}]
                }
            }
        },
        methods:{
            submitForm(){
                this.$refs.LoginForm.validate((valid)=>{
                    this.loading = true;
                    if (valid){
                        this.postRequest('/login',this.LoginForm).then(response=>{
                            /**
                             * 将Token作为Session保存 方便前端的请求拦截器拿到
                             * @type {string}
                             */

                            this.loading = false;
                            const tokenString = response.object.tokenHead + ' ' + response.object.token;
                            window.sessionStorage.setItem('tokenString',tokenString);

                            let redirect = this.$route.query.redirect;
                            this.$router.replace(((redirect === '/') || (redirect === undefined) || (redirect === '/home')) ? '/home' : redirect );
                        });
                        return true;
                    }else {
                        this.$message.error('请正确填写所有字段！！');
                        this.loading = false;
                        return false;
                    }
                })
            },
            flashImg(){
                this.captchaUrl = "/kaptcha?time="+new Date();
            }
        }
    }
</script>

<style scoped>
    .LoginContainer{
        width: 400px;
        padding: 15px 35px ;
        margin: 180px auto;
        border: 1px solid #eaeaea;
        border-radius: 15px;
        background-clip: padding-box;
        box-shadow: 0 0 25px gray;
    }
    .LoginTitle{
        width: 100%;
        height: 50px;
       text-align: center;
    }
</style>