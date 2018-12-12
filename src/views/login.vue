<template>
    <div v-cloak>
        <!--<div class="mainDiv">-->
        <!--<img src="/static/images/background/login-bk.png" alt="" style="width:100%;height: 100%">-->
        <!--<div class="title1">-->
        <!--美森智慧物流平台-->
        <!--</div>-->
        <!--<div class="title7">-->
        <!--&copy;版权所有2018&nbsp;美森博多利（大连）科技有限公司&nbsp;-->
        <!--<a href="#" class="link-margin" @click="link"></a>-->
        <!--</div>-->
        <!--<div class="form">-->
        <!--<input type="text" class="userName" placeholder="请输入用户名" v-model="username">-->
        <!--<img src="/static/images/components/username.png" alt="username" class="userPng">-->
        <!--<input type="password" class="password" placeholder="请输入密码" v-model="password">-->
        <!--<img src="/static/images/components/password.png" alt="username" class="passPng">-->
        <!--<div style="margin-top: 10px;margin-left: 15px" v-bind:class="{ 'hidden': isA }">-->
        <!--<img src="/static/images/components/err.png" alt="" style="margin-top: -4px">-->
        <!--<span style="color: #ff3333;font-size: 14px;margin-left: 5px">{{ errorMessage }}</span>-->
        <!--</div>-->
        <!--<button class="singin" v-on:click="login">登录</button>-->
        <!--</div>-->
        <!--</div>-->

        <!-- begin #page-loader -->
        <div id="page-loader" class="fade in"><span class="spinner"></span></div>
        <!-- end #page-loader -->
        <div class="login-cover">
            <div class="login-cover-image"><img src="/static/images/login-bg/bg-login.jpg" data-id="login-cover-image"
                                                alt=""/></div>
            <div class="login-cover-bg"></div>
        </div>
        <!-- begin #page-container -->
        <div id="page-container" class="fade">
            <!-- begin login -->
            <div class="login login-v2" data-pageload-addclass="animated fadeIn">
                <!-- begin brand -->
                <div class="login-header">
                    <div class="brand">
                        <div class="title-padding-top">
                            <img v-if="systemName === '车队云管家'" src="/static/images/homepage/logo_img_2.png" alt="" class="image-position">
                            <img v-else="" src="/static/images/logo-huateng.png" alt="" class="image-position-ht">
                            <span v-if="systemName !== '车队云管家'" class="title-position">{{systemName}}</span>
                        </div>
                    </div>
                    <div class="icon">
                        <i class="fa fa-sign-in"></i>
                    </div>
                </div>
                <!-- end brand -->
                <div class="login-content">
                    <form @submit.prevent="login" class="margin-bottom-0" id="loginForm">
                        <div class="form-group m-b-20">
                            <input type="text" class="form-control input-lg" placeholder="用户名"
                                   data-parsley-required="true" v-model="username"/>
                        </div>
                        <div class="form-group m-b-20">
                            <input type="password" class="form-control input-lg" placeholder="密码"
                                   data-parsley-required="true" v-model="password"/>
                        </div>
                        <div class="login-buttons">
                            <button type="submit" class="btn btn-success btn-block btn-lg">登录</button>
                        </div>
                    </form>
                </div>
            </div>
            <!-- end login -->
        </div>
        <!-- end page container -->
        <!-- begin #footer -->
        <div class="footer-center">
            © 2017 美森博多利（大连）科技有限公司 版权所有 辽ICP备14014383号-7
        </div>
        <!-- end #footer -->
    </div>
</template>
<script>
    const common = require('commonFunc');

    export default {
        name: 'login',
        data: function () {
            return {
                username: '',
                password: '',
                systemName: ''
            }
        },
        mounted: function () {
            let _self = this;
            document.onkeydown = function () {
                if (event.keyCode === 13) { //回撤
                    _self.login()
                }
            };
            $('body').removeClass();
            $('body').addClass('pace-top');
            App.init()

            _self.systemName = common.getSystemName();
            document.title = _self.systemName;

            $('#loginForm').parsley()
        },
        methods: {
            login: function (event) {
                if ($('#loginForm').parsley().isValid()) {
                    let encInfo = common.aesEncryptModeCFB(this.username, this.password);
                    this.$http.post('/api/auth', {
                        username: this.username,
                        identifyCode: encInfo[1],
                        magicNo: encInfo[0]
                    }).then((response) => {
                        let token = response.headers.get('authorization');
                        if (token) {
                            let userinfo = response.data.info;
//                            if (!userinfo.avatar) userinfo.avatar = '/static/images/base/head.jpg';
                            common.clearStoreData();
                            common.setStoreData('token', token);
                            this.sortMenu(userinfo.menulist);
                            this.exchangeMenuItem(userinfo.menulist);
                            common.setStoreData('userinfo', userinfo);
                            console.log('userinfo');
                            console.log(common.getStoreData('userinfo'));
                            this.$router.push({
                                path: '/driver/DriverLocation'
                            });
                        } else {
                            if (response.data.errno) {
                                this.$message.error(response.data.msg);
                            } else {
                                this.$message.error('系统错误');
                            }
                            common.clearStoreData();
                        }
                    }, (response) => {
                        // error callback
                        this.$message.error('用户名或者密码错误');
                        common.clearStoreData();
                    })
                }
            },
            link: function () {
                window.open('http://www.miitbeian.gov.cn')
            },
            /**
             * fix bug 菜单显示重复
             * */
            sortMenu: function (originMenu) {
                let menuList = originMenu;
                let index = '';
                for (let i = 0; i < menuList.length; i++) {
                    let m = menuList[i];
                    if (m.menu_name === '运营管理') {
                        index = i;
                        break;
                    }
                }
                if (index !== '') {
                    menuList.splice(0, 0, menuList[index]);
                    return menuList.splice(index + 1, 1);
                } else {
                    return menuList
                }
            },
            /**
             * fix bug 菜单显示重复
             * */
            exchangeMenuItem: function (originMenu) {
                let menuList = originMenu;
                let baseIndex = '';
                let eirIndex = '';
                for (let i = 0; i < menuList.length; i++) {
                    let m = menuList[i];
                    if (m.menu_name === '订单管理') {
                        baseIndex = i;
                    }
                    if (m.menu_name === 'EIR打单管理') {
                        eirIndex = i;
                    }
                }
                if (baseIndex !== '' && eirIndex !== '') {
                    menuList.splice(baseIndex, 0, menuList[eirIndex]);
                    return menuList.splice(eirIndex + 1, 1);
                } else {
                    return menuList
                }
            }
        }
    }
</script>
<style>
    .footer-center {
        position: absolute;
        left:0px;
        right: 0px;
        bottom: 20px;
        text-align: center;
        font-size: 14px;
    }
    .title-padding-top {
        padding-top: 15px;
    }
    .image-position {
        margin-top: -15px;
        margin-left: -40px;
        width: 180px;
        height: 65px;
        float: left;
    }
    .image-position-ht {
        width: 40px;
        height: 40px;
        float: left;
    }
    .title-position {
        float: left;
        font-size: 25px;
        margin-top: 2px;
        margin-left: 10px;
        color: white;
    }
</style>
