<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:;">基础信息管理</a></li>
            <li class="active">车辆管理</li>
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
                        <h4 class="panel-title">车辆列表</h4>
                    </div>
                    <div class="panel-toolbar">
                        <div class="form-inline">
                            <div class="form-group">
                                <input class="form-control" v-model="searchInput" placeholder="搜索车牌号、车架号"
                                       style="width: 200px;">
                            </div>
                            <div class="form-group">
                                <button class="btn btn-info" @click="search"><i class="fa fa-search"></i></button>
                            </div>
                            <div class="form-group pull-right">
                                <button class="btn btn-info" @click="addVehicle">
                                    <i class="glyphicon glyphicon-plus"></i>增加车辆
                                </button>
                                <button class="btn btn-info" @click="templateDownload">模板下载</button>
                                <button class="btn btn-info" @click="batchImport">批量导入</button>
                            </div>
                        </div>
                    </div>
                    <div class="panel-body auto-height">
                        <table id="vehicleTable"></table>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="vehicleModal" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title">车辆信息</h4>
                    </div>
                    <form @submit.prevent="submit" id="vehicleForm">
                        <div class="modal-body">
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">类别</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" data-parsley-required="true"
                                                v-model="workRow.vehicle_ascription" @change="vehicleAsciptionChanged">
                                            <option value="">请选择类别</option>
                                            <option v-for="type in pagePara.vehicleAscriptionSet"
                                                    v-bind:value="type.id">{{type.text}}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">等级</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" data-parsley-required="true"
                                                @change="vehicleLevelChanged"
                                                v-model="workRow.vehicle_level">
                                            <option value="">请选择等级</option>
                                            <option v-for="type in pagePara.vehicleLevelSet" v-bind:value="type.id">
                                                {{type.text}}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">车牌号</label>
                                    <div class="col-sm-8">
                                        <input class="form-control" v-model="workRow.vehicle_license_num"
                                               placeholder="请输入车牌号" data-parsley-required="true">
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">车架号</label>
                                    <div class="col-sm-8">
                                        <input class="form-control" v-model="workRow.vehicle_vin_no"
                                               placeholder="请输入车架号" data-parsley-required="true">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">车头年审时间</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" id='vehicle_head_annual_time'
                                               placeholder="请选择时间" readonly="readonly"/>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">车架年审时间</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" id="vehicle_body_annual_time"
                                               placeholder="请选择时间" readonly="readonly"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">交强险到期时间</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" id='vehicle_insurance1_deadline'
                                               placeholder="请选择时间" readonly="readonly"/>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">商业险到期时间</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" id='vehicle_insurance2_deadline'
                                               placeholder="请选择时间" readonly="readonly"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">综合险到期时间</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" id="vehicle_insurance3_deadline"
                                               placeholder="请选择时间" readonly="readonly"/>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">换机油时间</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" id='vehicle_maintain1_time'
                                               placeholder="请选择时间" readonly="readonly"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">二级维护时间</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" id='vehicle_2lm_time'
                                               placeholder="请选择时间" readonly="readonly"/>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">车架保养时间</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" id='vehicle_maintain2_time'
                                               placeholder="请选择时间" readonly="readonly"/>
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
                        <button type="button" class="btn btn-info" id="importAct" v-on:click="importFile"><i
                                class="fa fa-fw fa-plus"></i>导入
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    const common = require('commonFunc');
    const apiUrl = '/api/core/basic/Vehicle?method=';
    const STATUS_CREATE = 1;//创建
    const STATUS_MODIFY = 2;//修改
    import bus from '../../assets/js/eventBus';

    export default {
        data: function () {
            return {
                searchInput: null,
                pagePara: '',
                workRow: {},
                status: STATUS_CREATE,
                filePath: '',
                uploads: []
            }
        },
        name: 'VehicleControl',
        mounted: function () {
            let _self = this;
            let $table = $('#vehicleTable');

            function queryParams(params) {
                if (_self.searchInput) {
                    params.search_text = _self.searchInput;
                }
                return JSON.stringify(params);
            }

            window.tableEvents = {
                'click .delete': function (e, value, row, index) {
                    common.rowDeleteWithApi(_self, '删除车辆', apiUrl + 'd', $table, row, 'vehicle_id', function () {
                        bus.$emit("badgeNumChanged", "this is message");
                    })
                },
                'click .modify': function (e, value, row, index) {
                    _self.status = STATUS_MODIFY;
                    _self.workRow = row;
                    $('#vehicle_maintain1_time').val(common.dateFormat(_self.workRow.vehicle_maintain1_time));
                    $('#vehicle_2lm_time').val(common.dateFormat(_self.workRow.vehicle_2lm_time));
                    $('#vehicle_maintain2_time').val(common.dateFormat(_self.workRow.vehicle_maintain2_time));
                    $('#vehicle_insurance1_deadline').val(common.dateFormat(_self.workRow.vehicle_insurance1_deadline));
                    $('#vehicle_insurance2_deadline').val(common.dateFormat(_self.workRow.vehicle_insurance2_deadline));
                    $('#vehicle_insurance3_deadline').val(common.dateFormat(_self.workRow.vehicle_insurance3_deadline, 'month'));
                    $('#vehicle_head_annual_time').val(common.dateFormat(_self.workRow.vehicle_head_annual_time, 'month'));
                    $('#vehicle_body_annual_time').val(common.dateFormat(_self.workRow.vehicle_body_annual_time, 'month'));
                    $('#vehicleModal').modal('show');
                }
            };

            function operateFormatter(value, row, index) {
                return [
                    '<a class="btn btn-primary btn-xs m-r-5 delete">删除</a>',
                    '<a class="btn btn-primary btn-xs m-r-5 modify">修改</a>',
                ].join('')
            }

            function dateCompare(date) {
                let today = new Date();
                let compare = new Date(date);
                let interval = compare.getTime() - today.getTime();
                let days = Math.floor(interval / (24 * 3600 * 1000));
                return (days < 30)
            }

            function dateCompareMonth(date) {
                if (date) {
                    let today = new Date();
                    let compare = new Date(date);
                    let interval = today.getTime() - compare.getTime();
                    return (interval > 0)
                } else {
                    return false
                }
            }

            function stateFormatter(value, row, index) {
                if (dateCompare(row.vehicle_insurance1_deadline) ||
                        dateCompare(row.vehicle_insurance2_deadline) ||
                        dateCompareMonth(row.vehicle_insurance3_deadline) ||
                        dateCompareMonth(row.vehicle_head_annual_time) ||
                        dateCompareMonth(row.vehicle_body_annual_time)) {
                    return [
                        '<span style="color: red;">超期</span>'
                    ].join('')
                }
            }

            function dateFormatter(value) {
                let format = common.dateFormat(value);
                if (dateCompare(value) && value) {
                    return [
                        '<span style="color: red;">' + format + '</span>'
                    ].join('')
                } else {
                    return format
                }
            }

            function dateFormatterMoth(value) {
                let format = common.dateFormat(value, 'month');
                if (dateCompareMonth(value) && value) {
                    return [
                        '<span style="color: red;">' + format + '</span>'
                    ].join('')
                } else {
                    return format
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
                        common.BTRowFormatWithFormatter('', '提醒', stateFormatter),
                        common.BTRowFormat('vehicle_license_num', '车牌号'),
                        common.BTRowFormatWithFW('vehicle_head_annual_time', '车头年审时间', value => {
                            return dateFormatterMoth(value);
                        }),
                        common.BTRowFormatWithFW('vehicle_maintain1_time', '换机油时间', value => {
                            return common.dateFormat(value);
                        }),
                        common.BTRowFormatWithFW('vehicle_2lm_time', '二级维护时间', value => {
                            return common.dateFormat(value);
                        }),
                        common.BTRowFormatWithFW('vehicle_insurance1_deadline', '交强险到期时间', value => {
                            return dateFormatter(value);
                        }),
                        common.BTRowFormatWithFW('vehicle_insurance2_deadline', '商业险到期时间', value => {
                            return dateFormatter(value);
                        }),
                        common.BTRowFormatWithFW('vehicle_insurance3_deadline', '综合险到期时间', value => {
                            return dateFormatterMoth(value);
                        }),
                        common.BTRowFormat('vehicle_vin_no', '车架号'),

                        common.BTRowFormatWithFW('vehicle_body_annual_time', '车架年审时间', value => {
                            return dateFormatterMoth(value);
                        }),
                        common.BTRowFormatWithFW('vehicle_maintain2_time', '车架保养时间', value => {
                            return dateFormatter(value);
                        }),
                        common.BTRowFormatWithFW('created_at', '创建日期', value => {
                            return common.dateFormat(value);
                        }),
                        common.BTRowFormatEdSelect2Disabled(_self, 'vehicle_level', '等级', 'vehicleLevelSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'vehicle_ascription', '类别', 'vehicleAscriptionSet'),
                        common.actFormatter('operate', operateFormatter, tableEvents)
                    ],
                    idField: 'vehicle_id',
                    uniqueId: 'vehicle_id',
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

            function getInit() {
                _self.$http.post(apiUrl + 'i', {}).then((response) => {
                    _self.pagePara = response.data.info
                }, (response) => {
                    common.dealErrorCommon(_self, response)
                })
            }

            function initPage() {
                getInit();
                initTable();
                common.initDatepickerMonth($('#vehicle_head_annual_time'));
                common.initDatepickerMonth($('#vehicle_body_annual_time'));
                common.initDatepicker($('#vehicle_insurance1_deadline'));
                common.initDatepicker($('#vehicle_insurance2_deadline'));
                common.initDatepickerMonth($('#vehicle_insurance3_deadline'));
                common.initDatepicker($('#vehicle_maintain1_time'));
                common.initDatepicker($('#vehicle_2lm_time'));
                common.initDatepicker($('#vehicle_maintain2_time'));
                $('#vehicleForm').parsley();
                _self.initFormData();
            }

            initPage()
        },
        methods: {
            vehicleAsciptionChanged: function () {
                let _self = this;
                if (_self.workRow.vehicle_ascription == 1) {
                    _self.workRow.vehicle_level = 1;
                }
                if (_self.workRow.vehicle_ascription == 2) {
                    _self.workRow.vehicle_level = 2;
                }
            },
            vehicleLevelChanged: function () {
                let _self = this;
                if (_self.workRow.vehicle_level == 1) {
                    _self.workRow.vehicle_ascription = 1;
                }
                if (_self.workRow.vehicle_level >= 2) {
                    _self.workRow.vehicle_ascription = 2;
                }
            },
            initFormData: function () {
                let _self = this;
                $('#fileInput').change(function () {
                    _self.uploads = this.files;
                });

                $('#batchImportModal').on('hidden.bs.modal', function () {
                    _self.uploads = [];
                })
            },
            addVehicle: function (event) {
                let _self = this;
                _self.status = STATUS_CREATE;
                _self.workRow = {};
                $('#vehicle_head_annual_time').val('');
                $('#vehicle_body_annual_time').val('');
                $('#vehicle_insurance1_deadline').val('');
                $('#vehicle_insurance2_deadline').val('');
                $('#vehicle_insurance3_deadline').val('');
                $('#vehicleModal').modal('show');
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
                $('#vehicleTable').bootstrapTable('refresh');
            },
            batchImport: function (event) {
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
                            $('#vehicleTable').bootstrapTable("refresh");
                        } else {
                            common.dealWarningCommon(response.data.msg);
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
                if ($('#vehicleForm').parsley().isValid()) {
                    _self.workRow.vehicle_insurance1_deadline = $('#vehicle_insurance1_deadline').val() ? $('#vehicle_insurance1_deadline').val() : null;
                    _self.workRow.vehicle_insurance2_deadline = $('#vehicle_insurance2_deadline').val() ? $('#vehicle_insurance2_deadline').val() : null;
                    _self.workRow.vehicle_insurance3_deadline = $('#vehicle_insurance3_deadline').val() ? $('#vehicle_insurance3_deadline').val() : null;
                    _self.workRow.vehicle_head_annual_time = $('#vehicle_head_annual_time').val() ? $('#vehicle_head_annual_time').val() : null;
                    _self.workRow.vehicle_body_annual_time = $('#vehicle_body_annual_time').val() ? $('#vehicle_body_annual_time').val() : null;
                    _self.workRow.vehicle_maintain1_time = $('#vehicle_maintain1_time').val() ? $('#vehicle_maintain1_time').val() : null;
                    _self.workRow.vehicle_2lm_time = $('#vehicle_2lm_time').val() ? $('#vehicle_2lm_time').val() : null;
                    _self.workRow.vehicle_maintain2_time = $('#vehicle_maintain2_time').val() ? $('#vehicle_maintain2_time').val() : null;

                    if (!common.isVehicleNumber(_self.workRow.vehicle_license_num)) {
                        this.$message({
                            message: '请输入正确的车牌号！',
                            type: 'warning'
                        });
                        return;
                    }

                    common.dealConfrimCommon("确认提交信息吗？" , async function () {
                        let apiName = (_self.status == STATUS_CREATE ? 'a' : 'm');
                        let params = (_self.status == STATUS_CREATE ? _self.workRow : {
                            'old': _self.workRow,
                            'new': _self.workRow
                        });
                        _self.$http.post(apiUrl + apiName, params).then((response) => {
                            $('#vehicleModal').modal('hide');
                            if (response.data.errno == 0) {
                                $('#vehicleTable').bootstrapTable('refresh');
                                bus.$emit("badgeNumChanged", "this is message");
                                common.dealPromptCommon('提交成功');
                            } else {
                                common.dealWarningCommon(response.data.msg);
                            }
                        }, (response) => {
                            common.dealErrorCommon(_self, response)
                        })
                    });

                }
            }
        }
    }
</script>
<style scoped>
    .modal-dialog{
        width: 735px;
    }
</style>