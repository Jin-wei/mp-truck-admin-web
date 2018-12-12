<template>
<div>
    <!-- begin #page-loader -->
    <div id="page-loader" class="fade in"><span class="spinner"></span></div>
    <!-- end #page-loader -->

    <!-- begin #page-container -->
    <div id="page-container" class="fade">
        <!-- begin error -->
        <div class="error">
            <div class="error-code m-b-10" v-if="errCode == 403"><i class="fa fa-warning"></i></div>
            <div class="error-code m-b-10" v-else="">{{ errCode }} <i class="fa fa-warning"></i></div>
            <div class="error-content">
                <div class="error-message" v-if="errCode == 403">登录过期或者此账号已在别处登录</div>
                <div class="error-message" v-else="">服务器内部错误</div>
                <div class="error-desc m-b-20">
                </div>
                <div>
                    <a href="/" class="btn btn-success">返回首页</a>
                </div>
            </div>
        </div>
        <!-- end error -->
    </div>
    <!-- end page container -->
</div>
</template>
<script>
import {
    mapGetters
} from 'vuex'
export default {
    name: 'errpage',
    mounted: function() {
        App.init()
    },
    computed: mapGetters({
        errCode: 'errCode',
        errMsg: 'errMsg'
    })
}
</script>
<style scoped>
</style>
