<template>
    <div class="article-container">
        <div>
            <img class="top-img" src="/static/images/homepage/banner_bg_1.jpg" alt="">
        </div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb breadcrumb-margin">
            <li><a href="javascript:history.back();">首页</a></li>
            <li class="active">新闻资讯</li>
        </ol>
        <!-- end breadcrumb -->
        <div class="list-container">
            <div class="list" v-for="a in articleList">
                <img class="icon" src="/static/images/homepage/icon.jpg" alt="" @click="gotoDetail(a.article_content_id)">
                <h5><a href="javascript:;" @click="gotoDetail(a.article_content_id)">{{a.article_title}}</a></h5>
                <p>{{a.article_abstract}}</p>
                <i class="fa fa-lg fa-clock-o create">
                    <span>{{timeFormatter(a.created_at)}}</span>
                </i>
                <i class="fa fa-lg fa-eye read">
                    <span>{{a.article_click}}人已读</span>
                </i>
            </div>
        </div>
    </div>

</template>
<script>
    const common = require('commonFunc');
    const apiUrl = '/api/common/cms/article?method=';

    export default {
        data() {
            return {
                pagePara: '',
                articleList: []
            }
        },
        name: 'ArticleControl',
        mounted: function() {
            let _self = this
            function initPage() {
                _self.getArticleList()
            }
            initPage();
        },
        methods: {
            timeFormatter: function (value) {
                return common.dateFormat(value)
            },
            getArticleList: function () {
                let _self = this;
                _self.$http.post(apiUrl + 'l', {}).then((response) => {
                    _self.articleList = response.data.info;
                }, (response) => {
                    common.dealErrorCommon(_self, response)
                })
            },
            gotoDetail: function (id) {
                let _self = this;
                _self.$router.push({
                    path: '/homepage/ArticleDetailControl',
                    query: {
                        article_content_id: id
                    }
                })
            },
            getArticleDetail: function () {
                let _self = this;
                let params = {
                    article_id: 1
                }
                _self.$http.post(apiUrl + 'qc', params).then((response) => {
                    let retData = response.data.info;
                    console.log('qc');
                    console.log(retData);
                }, (response) => {
                    common.dealErrorCommon(_self, response)
                })
            }
        }
    }
</script>
<style scoped>
    .top-img {
        height: 300px;
        width: 100%
    }
    .breadcrumb-margin {
        margin-top: 10px;
        margin-left: 10px;
    }
    .article-container {
        padding-top: 20px;
        background: white;
        width: 1280px;
        margin-left: auto;
        margin-right: auto;
        padding-bottom: 20px;
        overflow: hidden;
    }
    .list-container {
        margin: 10px 10px 10px 10px;
        border: 1px solid #dddddd;
        height: 900px;
        overflow: scroll;
    }
    .list {
        border-bottom: 1px dashed #dddddd;
        height: 165px;
        position: relative;
    }
    .list .icon {
        margin-left: 10px;
        margin-right: 10px;
        width: 220px;
        height: 150px;
        float: left;
    }
    .list h5 {
        padding-top: 10px;
        font-size: 16px;
    }
    .list a {
        text-decoration:none;
        color: black !important;
    }
    .list .create {
        position: absolute;
        bottom: 20px;
        left: 240px;
        font-size: 12px;
    }
    .list span {
        margin-left: 5px;
    }
    .list .read {
        position: absolute;
        bottom: 20px;
        right: 30px;
        font-size: 12px;
    }
    .list p {
        font-size: 14px;
        margin-right: 20px;
    }
</style>
