import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../views/Login";
import Home from "../views/Home";
import axios from "axios";
import VueAxios from "vue-axios";
import FriendChat from "../views/chat/FriendChat";
import AdminInfo from "@/views/AdminInfo";


Vue.use(VueRouter);
Vue.use(VueAxios, axios);
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    hidden: true
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/chat',
        name: '在线聊天',
        component: FriendChat,
        hidden: true
      },
      {
        path: '/userinfo',
        name: '个人中心',
        component: AdminInfo
      }
      ]
  }


];

const router = new VueRouter({
  routes
})

export default router
