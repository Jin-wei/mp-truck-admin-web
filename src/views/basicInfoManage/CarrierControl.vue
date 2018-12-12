<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:;">基础信息管理</a></li>
            <li class="active">船公司管理</li>
        </ol>
        <!-- end breadcrumb -->
        <div class="row">
            <div class="col-md-12">
                <div class="panel panel-inverse">
                    <div class="panel-heading">
                        <div class="panel-heading-btn">
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default"
                               data-click="panel-expand"><i class="fa fa-expand"></i></a>
                        </div>
                        <h4 class="panel-title">船公司列表</h4>
                    </div>
                    <div class="panel-toolbar">
                        <div class="form-inline">
                            <div class="form-group">
                                <input class="form-control" v-model="searchInput" placeholder="搜索船公司名称、船公司缩写"
                                       style="width: 200px;">
                            </div>
                            <div class="form-group">
                                <button class="btn btn-info" v-on:click="search"><i class="fa fa-search"></i></button>
                            </div>
                            <div class="form-group pull-right">
                                <button class="btn btn-info" v-on:click="addCarrier">
                                    <i class="glyphicon glyphicon-plus"></i>增加船公司
                                </button>
                                <button class="btn btn-info" v-on:click="templateDownload">模板下载</button>
                                <button class="btn btn-info" v-on:click="batchImport">批量导入</button>
                            </div>
                        </div>
                    </div>
                    <div class="panel-body auto-height">
                        <table id="carrierTable"></table>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="carrierModal" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title">船公司信息</h4>
                    </div>
                    <form @submit.prevent="submit" id="carrierForm">
                        <div class="modal-body">
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">船公司名称</label>
                                    <div class="col-sm-8">
                                        <input class="form-control" v-model="workRow.carrier_name"
                                               data-parsley-required="true" placeholder="输入船公司名称">
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">船公司缩写</label>
                                    <div class="col-sm-8">
                                        <input class="form-control" v-model="workRow.carrier_eng_short"
                                               placeholder="输入船公司缩写">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">联系人</label>
                                    <div class="col-sm-8">
                                        <input class="form-control" v-model="workRow.carrier_contact"
                                               placeholder="输入联系人">
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">联系方式</label>
                                    <div class="col-sm-8">
                                        <input class="form-control" v-model="workRow.carrier_phone"
                                               placeholder="请输入联系方式">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-info" id="saveAct">提交</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="modal fade" id="batchImportModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title">批量导入</h4>
                    </div>

                    <div class="modal-body">
                        <div class="form-group col-md-12">
                            <label>选择文件：</label><span>（请选.csv文件）</span>
                            <div>
                                <input type="file" id="fileInput" class="form-control input-sm" accept=".csv" size="1">
                                <span class="margin-top-ten">{{filePath}}</span>
                            </div>
                        </div>

                    </div>
                    <div class="modal-footer" style="border-top:none">
                        <button type="button" class="btn btn-info" id="importAct" v-on:click="importFile"><i class="fa fa-fw fa-plus"></i>导入</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    const common = require('commonFunc');
    const apiUrl = '/api/core/basic/Carrier?method=';
    const STATUS_CREATE = 1;//创建
    const STATUS_MODIFY = 2;//修改

    export default {
        data: function () {
            return {
                searchInput: null,
                pagePara: {},
                workRow: {},
                status: STATUS_CREATE,
                filePath: '',
                fileUrl: '',
                uploads: []
            }
        },
        mounted: function () {
            let _self = this;
            let $table = $('#carrierTable');

            function queryParams(params) {
                params.search_text = _self.searchInput;
                return JSON.stringify(params);
            }

            window.tableEvents = {
                'click .delete': function (e, value, row, index) {
                    common.rowDeleteWithApi(_self, '删除船公司', apiUrl + 'd', $table, row, 'carrier_id', function () {
                    });
                },
                'click .modify': function (e, value, row, index) {
                    _self.status = STATUS_MODIFY;
                    _self.workRow = row;
                    $('#carrierModal').modal('show');
                }
            };

            function operateFormatter(value, row, index) {
                return [
                    '<a class="btn btn-primary btn-xs m-r-5 delete">删除</a>',
                    '<a class="btn btn-primary btn-xs m-r-5 modify">修改</a>',
                ].join('')
            }

            function initTable() {
                $table.bootstrapTable({
                    method: 'POST',
                    url: apiUrl + 'q',
                    queryParams: queryParams,
                    sidePagination: 'server',
                    ajaxOptions: common.bootstrapTableAjaxOtions,
                    responseHandler: function (res) {
                        return res.info;
                    },
//                    height: common.getTableHeight(),
                    columns: [
                        common.BTRowFormatWithIndex('NO.'),
                        common.BTRowFormat('carrier_name', '船公司名称'),
                        common.BTRowFormat('carrier_eng_short', '船公司缩写'),
                        common.BTRowFormat('carrier_contact', '联系人'),
                        common.BTRowFormat('carrier_phone', '联系方式'),
                        common.actFormatter('operate', operateFormatter, tableEvents)
                    ],
                    idField: 'carrier_id',
                    uniqueId: 'carrier_id',
                    striped: true,
                    clickToSelect: true,
                    pagination: true,
                    pageList: [10, 15, 25, 50, 100],
                    locale: 'zh-CN',
                });
                common.changeTableClass($table)
            }

            function initPage() {
                initTable();
                common.initDatepicker($('#created_at'));
                $('#carrierForm').parsley();
                _self.initFormData();
            }

            initPage();
        },
        methods: {
            initFormData: function () {
                let _self = this;
                $('#fileInput').change(function() {
                    _self.uploads = this.files;
                });

                $('#batchImportModal').on('hidden.bs.modal', function () {
                    _self.uploads = [];
                })
            },
            addCarrier: function (event) {
                let _self = this;
                _self.status = STATUS_CREATE;
                _self.workRow = {};
                $('#carrierModal').modal('show');
            },
            templateDownload: function (event) {
                this.$http.post(apiUrl + 'dm', {}).then(response => {
                    let downUrl = response.data.info;
                    console.log(downUrl);
                    window.location.href = window.location.protocol + '//' + window.location.host + downUrl;
                }, (response) => {
                    common.dealErrorCommon(this, response)
                });
            },
            search: function (event) {
                $('#carrierTable').bootstrapTable("refresh")
            },
            batchImport: function(event) {
                $('#batchImportModal').modal('show')
                $('#fileInput').val('');
            },
            importFile: function () {
                let _self = this;
                if (_self.uploads.length > 0) {
                    let formData = new FormData();
                    formData.append('file', _self.uploads[0]);
                    _self.$http.post(apiUrl + 'uc', formData).then((response) => {
                        if (response.data.errno == 0) {
                            common.dealPromptCommon('导入成功');
                            $('#carrierTable').bootstrapTable("refresh");
                        } else {
                            common.dealErrorCommon(_self, response.data)
                        }
                        $('#batchImportModal').modal('hide');
                    }, (response) => {
                        common.dealErrorCommon(_self, response)
                    })
                } else {
                    this.$message({
                        message: '请选择csv文件',
                        type: 'warning'
                    });
                }
            },
            submit: function (event) {
                let _self = this;
                if ($('#carrierForm').parsley().isValid()) {
                    common.dealConfrimCommon("确认提交信息吗？" , async function () {
                        let apiName = (_self.status == STATUS_CREATE ? 'a' : 'm');
                        let params = (_self.status == STATUS_CREATE ? _self.workRow : {
                            "old": _self.workRow,
                            "new": _self.workRow
                        });
                        _self.$http.post(apiUrl + apiName, params).then((response) => {
                            $('#carrierModal').modal('hide');
                            $('#carrierForm').parsley().reset();
                            if (response.data.errno == 0) {
                                common.dealSuccessCommon('增加成功');
                                $('#carrierTable').bootstrapTable('refresh');
                            } else {
                                common.dealWarningCommon(response.data.msg);
                            }
                        }, (response) => {
                            common.dealErrorCommon(_self, response);
                        });
                    })
                }
            }
        }
    }
</script>
<style scoped>
</style>