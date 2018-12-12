import Vue from 'vue'
import VueResource from 'vue-resource'
import appEntry from './main'
import common from 'commonFunc'
import Element from 'element-ui'
// import Mint from 'mint-ui';
// import 'mint-ui/lib/style.css';

import {
    mapGetters,
    mapActions
} from 'vuex'
import router from './routes';
import store from './store';
import $ from 'jquery'


router.beforeEach(function (to, from, next) {
    const toPath = to.path;
    const fromPath = from.path;
    // console.log('to: ' + toPath + ' from: ' + fromPath);
    // console.log('to: ' + toPath.replace('.html', ''));
    // var token = common.getStoreData('token');
    // if (typeof (token) !== 'string') {
    //    if (toPath !== '/login') {
    //        next('/login')
    //    }
    // }
    next()
});

router.afterEach(route => {
    console.log(`access to: ${route.path}`)
});

// Resource
Vue.use(VueResource);
Vue.use(Element, { size: 'small' });
// Vue.use(Mint);

Vue.http.options.root = '/root';
Vue.http.headers.common['Content-Type'] = 'application/json';

Vue.http.interceptors.push((request, next) => {
    $('.btn').addClass('disabled');
    var load = new Loading();
    load.init();
    load.start();
    var token = common.getStoreData('token');
    if (typeof(token) === 'string') {
        Vue.http.headers.common['authorization'] = token
    }

    // continue to next interceptor
    next((response) => {
        $('.btn').removeClass('disabled')
        load.stop();
    })
});

var eventHub = new Vue();
window.eventHub = eventHub;


// inject a handler for `myOption` custom option
Vue.mixin({
    methods: mapActions([
        'setError'
    ])
});

const app = new Vue({
    router,
    store,
    render: h => h(appEntry)
}).$mount('#app');
