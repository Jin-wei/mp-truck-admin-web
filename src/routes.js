var Vue = require('vue');
var VueRouter = require('vue-router');

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    scrollBehavior: () => ({y: 0}),
    routes: [
        { path: '*', component: resolve => require(['./components/common/err404'], resolve) },
        { path: '/',                redirect: '/login' },
        { path: '/error404',        component: resolve => require(['./components/common/err404'], resolve) },
        { path: '/error401',        component: resolve => require(['./components/common/err401'], resolve) },
        { path: '/error',           component: resolve => require(['./components/common/errpage'], resolve) },
        { path: '/login',           component: resolve => require(['./views/login'], resolve) },
        { path: '/guest/location',       component: resolve => require(['./views/location/DriverLocationControl.vue'], resolve) },
        { path: '/homepage',       component: resolve => require(['./views/homepage/HomepageControl.vue'], resolve) },
        { path: '/homepage/mobile',       component: resolve => require(['./views/homepage/HomepageMobileControl.vue'], resolve) },
        { path: '/homepage/ArticleControl',       component: resolve => require(['./views/homepage/ArticleControl.vue'], resolve) },
        { path: '/homepage/ArticleDetailControl',       component: resolve => require(['./views/homepage/ArticleDetailControl.vue'], resolve) },
        { path: '/common/system',        component: resolve => require(['./components/common/mainSystem'], resolve),
            children: [
                { path: 'MenuApiControl',             component: resolve => require(['./views/system/MenuApiControl'], resolve) },
                { path: 'DomainControl',                component: resolve => require(['./views/system/DomainControl'], resolve) },
                { path: 'RoleGroupControl',           component: resolve => require(['./views/system/RoleGroupControl'], resolve) },
                { path: 'UserControl',              component: resolve => require(['./views/system/UserControl'], resolve) },
                { path: 'UserSetting',                  component: resolve => require(['./views/system/UserSetting'], resolve) },
                { path: 'ResetPassword',                component: resolve => require(['./views/system/ResetPassword'], resolve) }
            ]},
        { path: '/basicInfoManage',        component: resolve => require(['./components/common/mainSystem'], resolve),
            children: [
                { path: 'VehicleControl',     component: resolve => require(['./views/basicInfoManage/VehicleControl.vue'], resolve) },
                { path: 'CustomerControl',     component: resolve => require(['./views/basicInfoManage/CustomerControl.vue'], resolve) },
                { path: 'ContainerStationControl',     component: resolve => require(['./views/basicInfoManage/ContainerStationControl.vue'], resolve) },
                { path: 'DriverControl',     component: resolve => require(['./views/basicInfoManage/DriverControl.vue'], resolve) },
                { path: 'CarrierControl',     component: resolve => require(['./views/basicInfoManage/CarrierControl.vue'], resolve) },
                { path: 'CarrierExpenseControl',     component: resolve => require(['./views/basicInfoManage/CarrierExpenseControl.vue'], resolve) },
            ]
        },
        { path: '/order',        component: resolve => require(['./components/common/mainSystem'], resolve),
            children: [
                { path: 'CreateOrderControl',     component: resolve => require(['./views/order/CreateOrderControl.vue'], resolve) },
                { path: 'PendingOrderControl',     component: resolve => require(['./views/order/OrderControl.vue'], resolve) },
                { path: 'OrderDetailControl',     component: resolve => require(['./views/order/OrderDetailControl.vue'], resolve) },
                { path: 'AllOrderControl',     component: resolve => require(['./views/order/AllOrderControl.vue'], resolve) },
                { path: 'GrabOrderControl',     component: resolve => require(['./views/order/GrabOrderControl.vue'], resolve) },
                { path: 'ProcessControl',     component: resolve => require(['./views/order/ProcessOrderControl.vue'], resolve) },
                { path: 'CancelOrderControl',     component: resolve => require(['./views/order/CancelOrderControl.vue'], resolve) },
                { path: 'DriverGrabOB',     component: resolve => require(['./views/order/DriverGrabOB.vue'], resolve) },
                { path: 'AccomplishedOrderControl',     component: resolve => require(['./views/order/AccomplishedOrderControl.vue'], resolve) }
            ]
        },
        { path: '/bill',        component: resolve => require(['./components/common/mainSystem'], resolve),
            children: [
                { path: 'CustomerBillControl',     component: resolve => require(['./views/bill/CustomerBillControl.vue'], resolve) },
                { path: 'DriverBillControl',     component: resolve => require(['./views/bill/DriverBillControl.vue'], resolve) }
            ]
        },
        { path: '/driver',        component: resolve => require(['./components/common/mainSystem'], resolve),
            children: [
                { path: 'DriverLocation',     component: resolve => require(['./views/guest/GuestLocationControl.vue'], resolve) }
            ]
        },
        { path: '/operator',        component: resolve => require(['./components/common/mainSystem'], resolve),
            children: [
                { path: 'DriverBonus',     component: resolve => require(['./views/operator/DriverBonusControl.vue'], resolve) },
                { path: 'DriverBonusDetail',     component: resolve => require(['./views/operator/DriverBonusDetailControl.vue'], resolve) },
                { path: 'DriverWeightControl',     component: resolve => require(['./views/operator/DriverWeightControl.vue'], resolve) }
            ]
        },
        { path: '/eir',        component: resolve => require(['./components/common/mainSystem'], resolve),
            children: [
                { path: 'EIRSystemControl',     component: resolve => require(['./views/eir/EIRSystemControl.vue'], resolve) },
                { path: 'EIRSystemDetailControl', component: resolve => require(['./views/eir/EIRSystemDetailControl.vue'], resolve)}
            ]
        },
        { path: '/content',        component: resolve => require(['./components/common/mainSystem'], resolve),
            children: [
                { path: 'ContentListControl',     component: resolve => require(['./views/content/ContentListControl.vue'], resolve) },
                { path: 'ContentDetailControl', component: resolve => require(['./views/content/ContentDetailControl.vue'], resolve)}
            ]
        }
    ]
});
