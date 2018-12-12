<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:;">基础信息管理</a></li>
            <li class="active">司机管理</li>
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
                        <h4 class="panel-title">司机列表</h4>
                    </div>
                    <div class="panel-toolbar">
                        <div class="form-inline">
                            <div class="form-group">
                                <input class="form-control" v-model="searchInput" placeholder="搜索手机号、司机姓名、车牌号"
                                       style="width: 200px;">
                            </div>
                            <div class="form-group">
                                <button class="btn btn-info" v-on:click="search"><i class="fa fa-search"></i></button>
                            </div>
                            <div class="form-group pull-right">
                                <button class="btn btn-info" v-on:click="addDriver">
                                    <i class="glyphicon glyphicon-plus"></i>增加司机
                                </button>
                                <button class="btn btn-info" v-on:click="templateDownload">模板下载</button>
                                <button class="btn btn-info" v-on:click="batchImport">批量导入</button>
                            </div>
                        </div>
                    </div>
                    <div class="panel-body auto-height">
                        <table id="driverTable"></table>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="driverModal" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title">司机信息</h4>
                    </div>
                    <form @submit.prevent="submit" id="driverForm">
                        <div class="modal-body">
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">司机姓名</label>
                                    <div class="col-sm-8">
                                        <input class="form-control" v-model="workRow.driver_name"
                                               data-parsley-required="true" placeholder="输入姓名">
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">手机号</label>
                                    <div class="col-sm-8">
                                        <input class="form-control" v-model="workRow.driver_phone"
                                               data-parsley-required="true" placeholder="输入手机号">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">身份证号码</label>
                                    <div class="col-sm-8">
                                        <input class="form-control" v-model="workRow.driver_identity_num"
                                               data-parsley-required="true" placeholder="输入身份证号码">
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">司机类别</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" data-parsley-required="true"
                                                v-model="workRow.driver_type">
                                            <option value="">请选择司机类别</option>
                                            <option v-for="type in pagePara.driverTypeSet" v-bind:value="type.id">
                                                {{type.text}}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">是否参与抢单</label>
                                    <div class="col-sm-8">
                                        <select class="form-control select2" id="driver_weighted"  v-model="workRow.driver_weighted">
                                            <option value="1" selected = "selected">是</option>
                                            <option value="0">否</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">关联车牌号</label>
                                    <div class="col-sm-8">
                                        <select class="form-control select2" id="driver_vehicle_id" data-parsley-required="true"></select>
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
    const apiUrl = '/api/core/basic/Driver?method=';
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
                uploads: []
            }
        },
        name: 'DriverControl',
        mounted: function () {
            let _self = this;
            let $table = $('#driverTable');

            function queryParams(params) {
                params.search_text = _self.searchInput;
                return JSON.stringify(params);
            }

            window.tableEvents = {
                'click .delete': function (e, value, row, index) {
                    common.dealConfrimCommon("删除司机", function () {
                        _self.$http.post(apiUrl + 'd', row).then((response) => {
                            if (response.data.errno == 0) {
                                common.dealSuccessCommon('删除成功')
                                $('#driverTable').bootstrapTable("refresh");
                            } else {
                                common.dealWarningCommon(response.data.msg);
                            }
                        }, (response) => {
                            common.dealErrorCommon(_self, response)
                        })
                    });
                },
                'click .modify': function (e, value, row, index) {
                    _self.status = STATUS_MODIFY;
                    _self.workRow = row;
                    $('#driver_weighted').val(_self.workRow.driver_weighted).trigger('change');
                    $('#driver_vehicle_id').val(_self.workRow.driver_vehicle_id).trigger('change');
                    $('#driverModal').modal('show');
                }
            };

            function operateFormatter(value, row, index) {
                return [
                    '<a class="btn btn-primary btn-xs m-r-5 delete">删除</a>',
                    '<a class="btn btn-primary btn-xs m-r-5 modify">修改</a>',
                ].join('');
            }

            function typeFormatter(value, row, index) {
                for (let type of _self.pagePara.driverTypeSet) {
                    if (type.id == parseInt(value)) {
                        return type.text;
                    }
                }
            }

            function weightedFormatter(value, row, index) {
                if (value === "0" ) {
                    return '否';
                } else if (value === "1" ) {
                    return '是';
                } else {
                    return '其他';
                }
            }

            function bindFormatter(value, row, index) {
                if (value) {
                    return '已绑定';
                } else {
                    return '未绑定';
                }
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
                        common.BTRowFormat('driver_name', '姓名'),
                        common.BTRowFormat('driver_phone', '手机号'),
                        common.BTRowFormat('driver_identity_num', '身份证号码'),
                        common.BTRowFormat('vehicle_license_num', '关联车牌号码'),
//                        common.BTRowFormatEdSelect2Disabled(_self, 'driver_type', '司机类别', "driverTypeSet"),
                        common.BTRowFormatWithFormatter('driver_type', '司机类别', typeFormatter),
                        common.BTRowFormatWithFormatter('wechat_open_id', '绑定状态', bindFormatter),
                        common.BTRowFormatWithFormatter('driver_weighted', '是否参与抢单', weightedFormatter),
                        common.BTRowFormatWithFW('created_at', '创建日期', value => {
                            return common.dateFormat(value);
                        }),
                        common.actFormatter('operate', operateFormatter, tableEvents)
                    ],
                    idField: 'driver_id',
                    uniqueId: 'driver_id',
                    striped: true,
                    clickToSelect: true,
                    pagination: true,
                    showToggle:true,//显示切换视图
                    showColumns:true,//显示内容列下拉框
                    pageList: [10, 15, 25, 50, 100],
                    locale: 'zh-CN',
                });
                common.changeTableClass($table)
            }

            function initPage() {
                _self.$http.post(apiUrl + 'i', {}).then((response) => {
                    let retData = response.data.info;
                    _self.pagePara = $.extend(true, {}, retData);
                    initTable();
                    common.initDatepicker($('#created_at'));
                    common.initSelect2($('#driver_vehicle_id'), retData.vehicleSet);
                    $('#driverForm').parsley();
                }, (response) => {
                    common.dealErrorCommon(_self, response);
                });

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
            addDriver: function (event) {
                let _self = this;
                _self.status = STATUS_CREATE;
                _self.workRow = {};
                _self.workRow.driver_weighted = 1;
                $('#driver_vehicle_id').val(null).trigger('change');
                $('#driverModal').modal('show');
            },
            templateDownload: function (event) {
                this.$http.post(apiUrl + 'dm', {}).then(response => {
                    let downUrl = response.data.info;
                    window.location.href = window.location.protocol + '//' + window.location.host + downUrl;
                }, (response) => {
                    common.dealErrorCommon(this, response)
                });
            },
            search: function (event) {
                $('#driverTable').bootstrapTable("refresh")
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
                            $('#driverTable').bootstrapTable("refresh");
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
                if ($('#driverForm').parsley().isValid()) {
                    common.dealConfrimCommon("确认提交信息吗？" , async function () {
                        _self.workRow.driver_vehicle_id = common.getSelect2Val('driver_vehicle_id');
                        let apiName = (_self.status == STATUS_CREATE ? 'a' : 'm');
                        let params = (_self.status == STATUS_CREATE ? _self.workRow : {
                            "old": _self.workRow,
                            "new": _self.workRow
                        });

                        _self.$http.post(apiUrl + apiName, params).then((response) => {
                            $('#driverModal').modal('hide');
                            $('#driverForm').parsley().reset();
                            if (response.data.errno == 0) {
                                common.dealPromptCommon('提交成功');
                                $('#driverTable').bootstrapTable('refresh');
                            } else {
                                common.dealWarningCommon(response.data.msg);
                            }
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
    .modal-dialog{
        width: 700px;
    }
</style>