<template>
    <div class="article-container">
        <div>
            <img class="top-img" src="/static/images/homepage/banner_bg_1.jpg" alt="">
        </div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb breadcrumb-margin">
            <li><a href="javascript:history.back();">新闻资讯</a></li>
            <li class="active">资讯详情</li>
        </ol>
        <!-- end breadcrumb -->
        <div class="list-container">
            <!--<div id="toolBar" style="display: none"></div>-->
            <!--<div id="content" style="min-height: 850px"> &lt;!&ndash;可使用 min-height 实现编辑区域自动增加高度&ndash;&gt;-->
            <!--</div>-->
            <div id="detailContent"></div>
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
                contentId: '',
                editor: ''
            }
        },
        name: 'ArticleDetailControl',
        mounted: function() {
            let _self = this
            _self.contentId = _self.$route.query.article_content_id

            function initEditor() {
                let E = window.wangEditor
                _self.editor = new E('#toolBar', '#content')
//                _self.editor.customConfig.uploadImgShowBase64 = true// 使用 base64 保存图片
//                _self.editor.$textElem.attr('contenteditable', false)
                _self.editor.create()
            }

            function initPage() {
                _self.getArticleDetail()
//                initEditor()
            }
            initPage();
        },
        methods: {
            getArticleDetail: function () {
                let _self = this;
                let params = {
                    contentId: _self.contentId
                }
                _self.$http.post(apiUrl + 'qc', params).then((response) => {
                    let retData = response.data.info;
                    document.getElementById("detailContent").innerHTML += retData[0].content;
//                    _self.editor.txt.html(retData[0].content)
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
        margin-left: 10px;
        margin-top: 10px;
    }
    .article-container {
        padding-top: 20px;
        background: white;
        width: 1280px;
        margin-left: auto;
        margin-right: auto;
        padding-bottom: 20px;
    }
    .list-container {
        padding: 0px 20px 20px 20px;
        border: 1px solid #dddddd;
    }
</style>
