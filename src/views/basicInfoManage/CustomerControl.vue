<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:;">基础信息管理</a></li>
            <li class="active">客户管理</li>
        </ol>
        <!-- end breadcrumb -->
        <div class="row">
            <div class="col-md-12">
                <div class="panel panel-inverse">
                    <div class="panel-heading">
                        <div class="panel-heading-btn">
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>
                        </div>
                        <h4 class="panel-title">客户列表</h4>
                    </div>
                    <div class="panel-toolbar">
                        <div class="form-inline">
                            <div class="form-group">
                                <input class="form-control" v-model="searchInput" placeholder="搜索客户名称、操作员、工厂名称" style="width: 200px;">
                            </div>
                            <div class="form-group">
                                <button class="btn btn-info" @click="search"><i class="fa fa-search"></i></button>
                            </div>
                            <div class="form-group pull-right">
                                <button class="btn btn-info" @click="addCustomer">
                                    <i class="glyphicon glyphicon-plus"></i>增加客户
                                </button>
                                <button class="btn btn-info" @click="templateDownload">模板下载</button>
                                <button class="btn btn-info" @click="batchImport">批量导入</button>
                            </div>
                        </div>
                    </div>
                    <div class="panel-body auto-height">
                        <table id="customerTable"></table>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="customerModal" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title">客户信息</h4>
                    </div>
                    <form @submit.prevent="submit" id="customerForm">
                        <div class="modal-body">
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">客户名称</label>
                                    <div class="col-sm-8">
                                        <input class="form-control" v-model="workRow.customer_name" data-parsley-required="true" placeholder="请输入客户名称">
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">操作员</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" v-model="workRow.factory_operator_name" placeholder="请输入操作员姓名" data-parsley-required="true"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">联系电话</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" v-model="workRow.factory_contact_phone" placeholder="请输入联系电话" data-parsley-maxlength="30" maxlength="30"/>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">工厂名称</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" v-model="workRow.factory_name" data-parsley-required="true" placeholder="请输入工厂名称"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">工厂地址</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" v-model="workRow.factory_address" placeholder="请输入工厂地址" data-parsley-required="true"/>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">经度</label>
                                    <div class="col-sm-8">
                                        <input type="number" class="form-control" v-model="workRow.factory_lng" placeholder="请输入经度"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">纬度</label>
                                    <div class="col-sm-8">
                                        <input type="number" class="form-control" v-model="workRow.factory_lat" placeholder="请输入纬度"/>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">围栏半径</label>
                                    <div class="col-sm-8">
                                        <input type="number" class="form-control" v-model="workRow.factory_radius" placeholder="请输入围栏半径"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">客户运价</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" v-model="workRow.basic_price_income" placeholder="请输入价格" data-parsley-required="true"/>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">运费</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" v-model="workRow.basic_price_cost" placeholder="请输入运费" data-parsley-required="true"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">司机提成</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" v-model="workRow.basic_price_labour" placeholder="请输入司机提成" data-parsley-required="true"/>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">过路费</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" v-model="workRow.factory_road_toll" placeholder="请输入过路费" data-parsley-required="true"/>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">油量(L)</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" v-model="workRow.factory_oil_cost" placeholder="请输入油量" data-parsley-required="true"/>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">优劣单</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" v-model="workRow.factory_order_level" data-parsley-required="true">
                                            <option value="">请选择类型</option>
                                            <option v-for="type in pagePara.customerOrderLevelSet" v-bind:value="type.id">{{type.text}}</option>
                                        </select>
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
    const apiUrl = '/api/core/basic/Customer?method=';
    const STATUS_CREATE = 1;//创建
    const STATUS_MODIFY = 2;//修改

    export default {
        data: function() {
            return {
                searchInput: null,
                pagePara: '',
                workRow: {},
                status:STATUS_CREATE,
                filePath: '',
                fileUrl: '',
                uploads: []
            }
        },
        name: 'CustomerControl',
        mounted: function() {
            let _self = this;
            let $table = $('#customerTable');

            function queryParams(params) {
                params.search_text = _self.searchInput;
                return JSON.stringify(params);
            }

            window.tableEvents = {
                'click .delete': function(e, value, row, index) {
                    common.rowDeleteWithApi(_self, '删除客户', apiUrl + 'd', $table, row, 'customer_id', function() {})
                },
                'click .modify': function(e, value, row, index) {
                    _self.status = STATUS_MODIFY;
                    _self.workRow = row;
                    $('#customerModal').modal('show');
                }
            };

            function operateFormatter(value, row, index) {
                return [
//                    '<a class="btn btn-primary btn-xs m-r-5 delete">删除</a>',
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
                    responseHandler: function(res) {
                        return res.info;
                    },
//                    height: common.getTableHeight(),
                    columns: [
                        common.BTRowFormatWithIndex('NO.'),
                        common.BTRowFormat('customer_name', '客户名称'),
                        common.BTRowFormat('factory_operator_name', '操作员'),
                        common.BTRowFormat('factory_contact_phone', '联系电话'),
                        common.BTRowFormat('factory_name', '工厂名称'),
                        common.BTRowFormat('factory_address', '工厂地址'),
                        common.BTRowFormat('factory_lng', '经度'),
                        common.BTRowFormat('factory_lat', '纬度'),
                        common.BTRowFormat('factory_radius', '围栏半径'),
                        common.BTRowFormat('basic_price_income', '客户价格'),
                        common.BTRowFormat('basic_price_cost', '运费'),
                        common.BTRowFormat('basic_price_labour', '司机提成'),
                        common.BTRowFormat('factory_road_toll', '过路费'),
                        common.BTRowFormat('factory_oil_cost', '油量(L)'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'factory_order_level', '优劣单', 'customerOrderLevelSet'),
                        common.actFormatter('operate', operateFormatter, tableEvents)
                    ],
                    idField: 'customer_id',
                    uniqueId: 'customer_id',
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
                    _self.pagePara = response.data.info;
                    initTable();
                }, (response) => {
                    common.dealErrorCommon(_self, response)
                })
            }

            function initPage() {
                getInit();
                $('#customerForm').parsley();
                _self.initFormData();
            }

            initPage()
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
            addCustomer: function(event) {
                let _self = this;
                _self.status = STATUS_CREATE;
                _self.workRow = {};
                $('#customerModal').modal('show');
            },
            templateDownload: function(event) {
                this.$http.post(apiUrl + 'dm', {}).then(response => {
                    let downUrl = response.data.info;
                    console.log(downUrl);
                    window.location.href = window.location.protocol + '//' + window.location.host + downUrl;
                }, (response) => {
                    common.dealErrorCommon(this, response)
                });
            },
            search: function(event) {
                $('#customerTable').bootstrapTable('refresh');
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
                            $('#customerTable').bootstrapTable("refresh");
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
                if ($('#customerForm').parsley().isValid()) {
                    common.dealConfrimCommon("确认提交信息吗？" , async function () {
                        let apiName = (_self.status == STATUS_CREATE ? 'a' : 'm');
                        let params = (_self.status == STATUS_CREATE ? _self.workRow : {old: _self.workRow, new: _self.workRow});
                        _self.$http.post(apiUrl + apiName, params).then((response) => {
                            $('#customerModal').modal('hide');
                            if (response.data.errno == 0) {
                                $('#customerTable').bootstrapTable('refresh');
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
</style>