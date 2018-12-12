<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:;">资讯管理</a></li>
            <li class="active">资讯列表</li>
        </ol>
        <!-- end breadcrumb -->
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <h4 class="panel-title">查询</h4>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-sm-3">
                        <input class="form-control" id="order_so_code" placeholder="请输入关键字">
                    </div>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" id="createDate"
                               placeholder="创建时间"/>
                    </div>
                </div>
            </div>
            <div class="panel-footer text-right">
                <button class="btn btn-info" @click="newContent">新建</button>
                <button class="btn btn-info" @click="search">查询</button>
            </div>
        </div>
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <div class="panel-heading-btn">
                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default"
                       data-click="panel-expand"><i class="fa fa-expand"></i></a>
                </div>
                <h4 class="panel-title">资讯列表</h4>
            </div>
            <div class="panel-body auto-height">
                <table id="articleTable"></table>
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
                pagePara: {},
                workRow: {},
                contentList: []
            }
        },
        name: 'ContentListControl',
        mounted: function () {
            let _self = this;
            let $table = $('#articleTable');

            window.tableEvents = {
                'click .show_detail': function (e, value, row, index) {
                    _self.$router.push({
                        path: '/content/ContentDetailControl',
                        query: {
                            article_content_id: row.article_content_id
                        }
                    })
                }
            };

            function operateFormatter(value, row, index) {
                return [
                    '<a class="btn btn-primary btn-xs m-r-5 show_detail">查看</a>',
                ].join('')
            }

            function initTable() {
                $table.bootstrapTable({
                    height: common.getTableHeight(),
                    columns: [
                        common.BTRowFormatWithIndex('NO.'),
                        common.actFormatter('operate', operateFormatter, tableEvents),
                        common.BTRowFormat('article_title', '标题'),
                        common.BTRowFormat('article_author', '作者'),
                        common.BTRowFormat('article_click', '阅读数'),
                        common.BTRowFormat('article_abstract', '摘要'),
                        common.BTRowFormatWithFW('created_at', '创建时间', value => {
                            return common.dateFormat(value, 'min');
                        })
                    ],
                    idField: 'article_url_id',
                    uniqueId: 'article_url_id',
                    striped: true,
                    clickToSelect: true,
                    locale: 'zh-CN',
                });
                common.changeTableClass($table)
            }

            function initPage() {
                initTable()
                _self.getContentList()
                common.initDatepicker($('#createDate'));
            }

            initPage()
        },
        methods: {
            search: function (event) {
                $('#articleTable').bootstrapTable('refresh');
            },
            getContentList: function () {
                let _self = this;
                _self.$http.post(apiUrl + 'l', {}).then((response) => {
                    _self.contentList = response.data.info;
                    $('#articleTable').bootstrapTable('load', {
                        data: _self.contentList
                    });
                }, (response) => {
                    common.dealErrorCommon(_self, response)
                })
            },
            newContent: function () {
                let _self = this;
                _self.$router.push({
                    path: '/content/ContentDetailControl'
                })
            }

        }
    }
</script>
<style scoped>
</style>