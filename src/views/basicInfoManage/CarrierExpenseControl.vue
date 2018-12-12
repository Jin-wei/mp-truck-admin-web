<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:;">基础信息管理</a></li>
            <li class="active">集装箱费用管理</li>
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
                        <h4 class="panel-title">集装箱费用列表</h4>
                    </div>
                    <div class="panel-toolbar">
                        <div class="form-inline">
                            <div class="form-group">
                                <input class="form-control" v-model="searchInput" placeholder="搜索费用名称"
                                       style="width: 200px;">
                            </div>
                            <div class="form-group">
                                <button class="btn btn-info" v-on:click="search"><i class="fa fa-search"></i></button>
                            </div>
                            <div class="form-group pull-right">
                                <button class="btn btn-info" v-on:click="addExpense">
                                    <i class="glyphicon glyphicon-plus"></i>增加费用
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="panel-body auto-height">
                        <table id="expenseTable"></table>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="expenseModal" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title">集装箱费用信息</h4>
                    </div>
                    <form @submit.prevent="submit" id="carrierForm">
                        <div class="modal-body">
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">费用名称</label>
                                    <div class="col-sm-8">
                                        <input class="form-control" v-model="workRow.container_fee_name"
                                               data-parsley-required="true" placeholder="输入费用名称">
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">费用价格</label>
                                    <div class="col-sm-8">
                                        <input class="form-control" v-model="workRow.container_fee_amount"
                                               data-parsley-required="true" placeholder="输入费用">
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">柜尺寸</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" id="order_container_size" v-model="workRow.container_fee_size" data-parsley-required="true">
                                            <option value="">请选择柜尺寸"</option>
                                            <option v-for="s in pagePara.containerSizeSet" v-bind:value="s.id">{{s.text}}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">柜型</label>
                                    <div class="col-sm-8">
                                        <select class="form-control" id="order_container_shape" v-model="workRow.container_fee_shape" data-parsley-required="true">
                                            <option value="">请选择柜型"</option>
                                            <option v-for="s in pagePara.containerShapeSet" v-bind:value="s.id">{{s.text}}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="form-group col-sm-6">
                                    <label class="col-sm-4 control-label">船公司名称</label>
                                    <div class="col-sm-8">
                                        <select class="form-control"  v-model="workRow.container_fee_carrier_id">
                                            <option value="">请选择船公司</option>
                                            <option v-for="c in pagePara.carrierSet" v-bind:value="c.id" >{{c.text}}</option>
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
    </div>
</template>
<script>
    const common = require('commonFunc');
    const apiUrl = '/api/core/basic/ContainerFee?method=';
    const STATUS_CREATE = 1;//创建
    const STATUS_MODIFY = 2;//修改

    export default {
        data: function () {
            return {
                searchInput: null,
                pagePara: {},
                workRow: {},
                status: STATUS_CREATE
            }
        },
        mounted: function () {
            let _self = this;
            let $table = $('#expenseTable');

            function queryParams(params) {
                params.search_text = _self.searchInput;
                return JSON.stringify(params);
            }

            window.tableEvents = {
                'click .delete': function (e, value, row, index) {
                    common.rowDeleteWithApi(_self, '删除费用', apiUrl + 'd', $table, row, 'container_fee_id', function () {
                    });
                },
                'click .modify': function (e, value, row, index) {
                    _self.status = STATUS_MODIFY;
                    _self.workRow = row;
                    $('#expenseModal').modal('show');
                }
            };

            function operateFormatter(value, row, index) {
                return [
                    '<a class="btn btn-primary btn-xs m-r-5 delete">删除</a>'
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
                        common.BTRowFormat('container_fee_name', '费用名称'),
                        common.BTRowFormat('container_fee_amount', '费用价格'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'container_fee_size', '柜尺寸', 'containerSizeSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'container_fee_shape', '柜型', 'containerShapeSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'container_fee_carrier_id', '船公司名称', 'carrierSet'),
                        common.actFormatter('operate', operateFormatter, tableEvents)
                    ],
                    idField: 'container_fee_id',
                    uniqueId: 'container_fee_id',
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
                    _self.pagePara = response.data.info;
                    initTable();
                }, (response) => {
                    common.dealErrorCommon(_self, response)
                })
            }

            function initPage() {
                getInit();
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
            addExpense: function (event) {
                let _self = this;
                _self.status = STATUS_CREATE;
                _self.workRow = {};
                $('#expenseModal').modal('show');
            },
            search: function (event) {
                $('#expenseTable').bootstrapTable("refresh")
            },
            submit: function (event) {
                let _self = this;
                if ($('#carrierForm').parsley().isValid()) {
                    common.dealConfrimCommon("确认提交信息吗？" , async function () {
                        for (let fee of _self.pagePara.carrierSet) {
                            if (fee.id == _self.workRow.container_fee_carrier_id) {
                                _self.workRow.container_fee_carrier_name = fee.text;
                                break;
                            }
                        }
                        let apiName = (_self.status == STATUS_CREATE ? 'a' : 'm');
                        let params = (_self.status == STATUS_CREATE ? _self.workRow : {
                            "old": _self.workRow,
                            "new": _self.workRow
                        });
                        _self.$http.post(apiUrl + apiName, params).then((response) => {
                            $('#expenseModal').modal('hide');
                            $('#carrierForm').parsley().reset();
                            if (response.data.errno == 0) {
                                common.dealSuccessCommon('提交成功');
                                $('#expenseTable').bootstrapTable('refresh');
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