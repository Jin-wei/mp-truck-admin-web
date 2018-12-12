<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript: history.back();">资讯列表</a></li>
            <li class="active">资讯详情</li>
        </ol>
        <!-- end breadcrumb -->
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <div class="panel-heading-btn">
                    <button class="btn btn-info btn-xs" v-on:click="saveContent">保存</button>
                </div>
                <h4 class="panel-title">资讯详情</h4>
            </div>
            <div class="panel-body auto-height">
                <div>
                    <div class="row">
                        <div class="col-sm-3">
                            <input class="form-control" v-model="title" placeholder="请输入标题">
                        </div>
                    </div>
                    <div class="row" style="margin-top: 10px">
                        <div class="col-sm-3">
                            <textarea class="form-control" v-model="abstract" placeholder="请输入摘要"></textarea>
                        </div>
                    </div>
                </div>
                <div class="row" style="margin: 10px 2px 10px 2px;">
                    <div id="div1" class="toolbar head"></div>
                    <div class="neck"></div>
                    <div id="div2" class="text body">
                        <p>请输入内容</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    const common = require('commonFunc');
    const apiUrl = '/api/common/cms/article?method=';

    export default {
        data: function () {
            return {
                contentId: '',
                editor: '',
                title: '',
                abstract: ''
            }
        },
        name: 'ContentDetailControl',
        mounted: function () {
            let _self = this;
            _self.contentId = _self.$route.query.article_content_id;

            function initEditor() {
                let E = window.wangEditor;
                _self.editor = new E('#div1', '#div2')
                _self.editor.customConfig.uploadImgShowBase64 = true;// 使用 base64 保存图片
                _self.editor.create()
            }

            function initPage() {
                initEditor();
                _self.getContentDetail()
            }

            initPage()
        },
        methods: {
            getContentDetail: function () {
                let _self = this;
                if (!_self.contentId) {
                    return _self.editor.txt.html();
                }
                let params = {
                    contentId: _self.contentId
                };
                _self.$http.post(apiUrl + 'qc', params).then((response) => {
                    let retData = response.data.info;
                    _self.editor.txt.html(retData[0].content);
                    _self.title = retData[0].article_title;
                    _self.abstract = retData[0].article_abstract;
                }, (response) => {
                    common.dealErrorCommon(_self, response)
                })
            },
            saveContent: function () {
                let _self = this;
                let params = {
                    mc: {
                        article_title: _self.title,
                        article_abstract: _self.abstract,
                        content: _self.editor.txt.html()
                    }
                };
                if (_self.contentId) {
                    params = {
                        contentId: _self.contentId,
                        mc: {
                            article_title: _self.title,
                            article_abstract: _self.abstract,
                            content: _self.editor.txt.html()
                        }
                    };
                    common.dealConfrimCommon("确认提交资讯信息吗？" , async function () {
                        _self.$http.post(apiUrl + 'ec', params).then((response) => {
                            common.dealSuccessCommon('保存成功');
                        }, (response) => {
                            common.dealErrorCommon(_self, response)
                        });
                    })
                } else {
                    common.dealConfrimCommon("确认提交资讯信息吗？" , async function () {
                        _self.$http.post(apiUrl + 'sc', params).then((response) => {
                            common.dealSuccessCommon('保存成功');
                        }, (response) => {
                            common.dealErrorCommon(_self, response)
                        });
                    })
                }
            }
        }
    }
</script>
<style scoped>
    .head {
        border: 1px solid #ccc
    }
    .neck {
        padding: 5px 0; color: #ccc
    }
    .body {
        min-height: 750px;
        border: 1px solid #ccc
    }
</style>