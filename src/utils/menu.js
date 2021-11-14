import {getRequest} from "./api";
import el from "element-ui/src/locale/lang/el";


/**
 *
 * @param router
 * @param store
 */
export const initMenu = (router,store) =>{
    if (store.state.routes.length > 0){
        return;
    }

    getRequest('/system/cfg/menu').then(data =>{
        // 对菜单数据进行加工处理
        if (data){
            let formatMenus = formatMenu(data);
            //  将数据添加到router中
            router.addRoutes(formatMenus);
            //  将数据添加到Vuex中
            store.commit('initRoutes',formatMenus);
            store.dispatch('connect');
        }
    })
};

export const formatMenu = (data) =>{
    let formatMenus = [];

    data.forEach(menus=>{
        let {
            path,
            component,
            name,
            iconCls,
            children,
        } = menus;
        // 当children存在并有数据时 则递归调用处理
        if (children && children instanceof Array){
            children = formatMenu(children);
        }

        let fmMenu = {
            path: path,
            name: name,
            iconCls: iconCls,
            children: children,
            //  转换为具体组件
            component(resolve){
                // 需要拿取指定菜单下的组件
                if (component.startsWith('Home')){
                    require(['../views/'+component+'.vue'],resolve);
                }else if (component.startsWith('Emp')){
                    require(['../views/emp/'+component+'.vue'],resolve);
                }else if (component.startsWith('Per')){
                    require(['../views/per/'+component+'.vue'],resolve);
                }else if (component.startsWith('Sal')){
                    require(['../views/sal/'+component+'.vue'],resolve);
                }else if (component.startsWith('Sta')){
                    require(['../views/sta/'+component+'.vue'],resolve);
                }else if (component.startsWith('Sys')){
                    require(['../views/sys/'+component+'.vue'],resolve);
                }
            }
        };
        // 将数据保存到数组中
        formatMenus.push(fmMenu);
    });
    return formatMenus;
};