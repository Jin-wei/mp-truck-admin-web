<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:;">基础信息管理</a></li>
            <li class="active">提/还柜地址管理</li>
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
                        <h4 class="panel-title">提/还柜地址列表</h4>
                    </div>
                    <div class="panel-toolbar">
                        <div class="form-inline">
                            <div class="form-group">
                                <input class="form-control" v-model="searchInput" placeholder="港口名称、堆场名称"
                                       style="width: 200px;">
                            </div>
                            <div class="form-group">
                                <button class="btn btn-info" @click="search"><i class="fa fa-search"></i></button>
                            </div>
                            <div class="form-group pull-right">
                                <button class="btn btn-info" @click="addContainer">
                                    <i class="glyphicon glyphicon-plus"></i>增加提/还柜地址
                                </button>
                                <button class="btn btn-info" @click="templateDownload">模板下载</button>
                                <button class="btn btn-info" @click="batchImport">批量导入</button>
                            </div>
                        </div>
                    </div>
                    <div class="panel-body auto-height">
                        <table id="containerTable"></table>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="containerModal" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title">提/还柜地址</h4>
                    </div>
                    <form @submit.prevent="submit" id="containerForm">
                        <div class="modal-body">
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">地址类型</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" v-model="workRow.container_station_type"
                                                data-parsley-required="true">
                                            <option value="">请选择类型</option>
                                            <option v-for="type in pagePara.stationTypeSet" v-bind:value="type.id">
                                                {{type.text}}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">港口名称</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" v-model="workRow.port_name" placeholder="请输入港口名称"
                                                data-parsley-required="true">
                                            <option value="">请选择出货港</option>
                                            <option value="盐田港">盐田港</option>
                                            <option value="蛇口港">蛇口港</option>
                                            <option value="大铲湾港">大铲湾港</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">堆场名称</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" v-model="workRow.container_station_name"
                                               placeholder="请输入堆场名称" data-parsley-required="true"/>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">地址</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control"
                                               v-model="workRow.container_station_address" placeholder="请输入地址"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">经度</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" v-model="workRow.container_station_lng"
                                               placeholder="请输入经度" data-parsley-required="true"/>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">维度</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" v-model="workRow.container_station_lat"
                                               placeholder="请输入纬度" data-parsley-required="true"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">还柜围栏半径</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control"
                                               v-model="workRow.container_station_radius" placeholder="请输入还柜围栏半径"
                                               data-parsley-required="true"/>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">提示围栏半径</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control"
                                               v-model="workRow.container_station_outer_radius" placeholder="请输入提示围栏半径"
                                               data-parsley-required="true"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">联系人</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control"
                                               v-model="workRow.container_station_contact" placeholder="请输入联系人姓名"/>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">联系方式</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control"
                                               v-model="workRow.container_station_phone" placeholder="请输入联系方式"/>
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
    const apiUrl = '/api/core/basic/ContainerStation?method=';
    const STATUS_CREATE = 1;//创建
    const STATUS_MODIFY = 2;//修改

    export default {
        data: function () {
            return {
                searchInput: null,
                pagePara: '',
                workRow: {},
                status: STATUS_CREATE,
                filePath: '',
                fileUrl: '',
                uploads: []
            }
        },
        name: 'ContainerStationControl',
        mounted: function () {
            let _self = this;
            let $table = $('#containerTable');

            function queryParams(params) {
                if (_self.searchInput) {
                    params.search_text = _self.searchInput;
                }
                return JSON.stringify(params);
            }

            window.tableEvents = {
                'click .delete': function (e, value, row, index) {
                    common.rowDeleteWithApi(_self, '删除提/还柜地址', apiUrl + 'd', $table, row, 'container_station_id', function () {
                    })
                },
                'click .modify': function (e, value, row, index) {
                    _self.status = STATUS_MODIFY;
                    _self.workRow = row;
                    $('#containerModal').modal('show');
                }
            };

            function operateFormatter(value, row, index) {
                return [
                    '<a class="btn btn-primary btn-xs m-r-5 delete">删除</a>',
                    '<a class="btn btn-primary btn-xs m-r-5 modify">修改</a>'
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
                        common.BTRowFormatEdSelect2Disabled(_self, 'container_station_type', '地址类型', 'stationTypeSet'),
                        common.BTRowFormat('port_name', '港口名称'),
                        common.BTRowFormat('container_station_name', '堆场名称'),
                        common.BTRowFormat('container_station_address', '地址'),
                        common.BTRowFormat('container_station_lng', '经度'),
                        common.BTRowFormat('container_station_lat', '纬度'),
                        common.BTRowFormat('container_station_radius', '还柜围栏半径'),
                        common.BTRowFormat('container_station_outer_radius', '提示围栏半径'),
                        common.BTRowFormat('container_station_contact', '联系人'),
                        common.BTRowFormat('container_station_phone', '联系方式'),
                        common.actFormatter('operate', operateFormatter, tableEvents)
                    ],
                    idField: 'container_station_id',
                    uniqueId: 'container_station_id',
                    striped: true,
                    clickToSelect: true,
                    pagination: true,
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
                $('#containerForm').parsley();
                _self.initFormData();
            }

            initPage()
        },
        methods: {
            initFormData: function () {
                let _self = this;
                $('#fileInput').change(function () {
                    _self.uploads = this.files;
                });

                $('#batchImportModal').on('hidden.bs.modal', function () {
                    _self.uploads = [];
                })
            },
            addContainer: function (event) {
                let _self = this;
                _self.status = STATUS_CREATE;
                _self.workRow = _self.status == STATUS_CREATE ? {} : _self.workRow;
                $('#containerModal').modal('show');
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
                $('#containerTable').bootstrapTable('refresh');
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
                            $('#containerTable').bootstrapTable("refresh");
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
                if ($('#containerForm').parsley().isValid()) {
                    common.dealConfrimCommon("确认提交信息吗？" , async function () {
                        let apiName = (_self.status == STATUS_CREATE ? 'a' : 'm');
                        let params = (_self.status == STATUS_CREATE ? _self.workRow : {
                            old: _self.workRow,
                            new: _self.workRow
                        });
                        _self.$http.post(apiUrl + apiName, params).then((response) => {
                            $('#containerModal').modal('hide');
                            if (response.data.errno == 0) {
                                $('#containerTable').bootstrapTable('refresh');
                                common.dealPromptCommon('提交成功');
                            } else {
                                common.dealWarningCommon(response.data.msg);
                            }
                        }, (response) => {
                            common.dealErrorCommon(_self, response)
                        })
                    })
                }
            }
        }
    }
</script>
<style scoped>
    .modal-dialog{
        width: 665px;
    }
</style>