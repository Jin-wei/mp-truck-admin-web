<template>
    <div id="header" class="header navbar navbar-default navbar-fixed-top">
        <!-- begin container-fluid -->
        <div class="container-fluid">
            <div class="navbar-header">
                <a href="javascript:;" class="">
                    <div class="name-top">
                        <img v-if="systemName === '车队云管家'" class="logo" src="/static/images/homepage/logo_img_3.png"/>
                        <img v-else="" class="logo-ht" src="/static/images/logo-huateng.png"/>
                        <div v-if="systemName !== '车队云管家'" class="name-top name-float">
                            <span class="logo-title">{{systemName}}</span>
                        </div>
                    </div>
                </a>
            </div>
            <!-- begin header navigation right -->
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown navbar-user">
                    <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                        <!--<img src="/static/images/user-13.jpg" alt="">-->
                        <span class="hidden-xs">{{userinfo.name}}</span><b class="caret"></b>
                    </a>
                    <ul class="dropdown-menu animated fadeInLeft">
                        <li class="arrow"></li>
                        <li>
                            <router-link to="/common/system/UserSetting">修改密码</router-link>
                        </li>
                        <li class="divider"></li>
                        <li><a href="javascript:void(0)" v-on:click="logout">签退</a></li>
                    </ul>
                </li>
            </ul>
            <!-- end header navigation right -->
        </div>
        <!-- end container-fluid -->
    </div>
</template>
<script>
    let common = require('commonFunc');
    export default {
        data: function () {
            return {
                userinfo: common.getStoreData('userinfo'),
                systemName: ''
            }
        },
        name: 'mainHeader',
        mounted: function () {
            let _self = this;
            _self.systemName = common.getSystemName();
        },
        methods: {
            logout: async function (event) {
                common.clearStoreData();
                this.$http.post('/api/signout', {});
                this.$router.push({
                    path: '/login'
                });
            }
        }
    }
</script>
<style scoped>
    .name-top {
        padding-top: 5px
    }
    .name-float {
        float: left;
    }
    .logo {
        width: auto;
        height: 43px;
        float: left;
    }
    .logo-ht {
        width: auto;
        height: 40px;
        float: left;
    }
    .logo-title {
        font-size: 20px;
        margin-left: 15px;
        color: white;
    }
</style>
