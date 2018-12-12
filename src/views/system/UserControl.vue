<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:;">系统管理</a></li>
            <li class="active">员工维护</li>
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
                        <h4 class="panel-title">员工列表</h4>
                    </div>
                    <div class="panel-toolbar">
                        <div class="form-inline" role="form">
                            <div class="form-group">
                                <input class="form-control" id="search_text" placeholder="搜索用户名、姓名、电话"
                                       style="width: 200px;">
                            </div>
                            <div class="form-group">
                                <button class="btn btn-info" v-on:click="search"><i class="fa fa-search"></i></button>
                            </div>
                            <div class="form-group  pull-right">
                                <button id="addM" class="btn btn-info" v-on:click="addM">
                                    <i class="glyphicon glyphicon-plus"></i> 增加
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="panel-body auto-height hidedesk" style="display:none;">
                        <table id="table"></table>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="AddModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title">增加员工</h4>
                    </div>
                    <form @submit.prevent="addOp" id="formA">
                        <div class="modal-body">
                            <div class="form-group">
                                <label>用户名</label>
                                <input class="form-control" v-model="rowData.username" data-parsley-required="true"
                                       maxlength="50" data-parsley-maxlength="50">
                            </div>
                            <div class="form-group">
                                <label>姓名</label>
                                <input class="form-control" v-model="rowData.name" data-parsley-required="true"
                                       maxlength="50" data-parsley-maxlength="50">
                            </div>
                            <div class="form-group">
                                <label>邮箱</label>
                                <input type="emain" class="form-control" v-model="rowData.email"
                                       data-parsley-type="email">
                            </div>
                            <div class="form-group">
                                <label>手机</label>
                                <input class="form-control" v-model="rowData.phone" data-parsley-phone="true">
                            </div>
                            <div class="form-group">
                                <label>用户组</label>
                                <select class="form-control select2" id="usergroup_id"
                                        data-parsley-required="true"></select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-primary btn-info"><i class="fa fa-fw fa-plus"></i>增加
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    const common = require('commonFunc');
    const apiUrl = '/api/common/system/UserControl?method=';

    export default {
        data: function () {
            return {
                pagePara: {},
                rowData: {},
                oldRow: {}
            }
        },
        name: 'OperatorControl',
        mounted: function () {
            let _self = this;
            let $table = $('#table');

            function userGroupFormatter(value, row) {
                for (let i = 0; i < _self.pagePara['groupInfo'].length; i++) {
                    if (_self.pagePara.groupInfo[i].usergroup_id === parseInt(value)) {
                        return _self.pagePara.groupInfo[i].text
                    }
                }
                return ''
            }

            function initTable() {
                window.tableEvents = {
                    'click .tableDelete': function (e, value, row, index) {
                        common.rowDeleteWithApi(_self, '用户删除', apiUrl + 'd', $table, row, 'user_id', function () {
                        })
                    }
                };

                function queryParams(params) {
                    params.search_text = $('#search_text').val();
                    return JSON.stringify(params)
                }

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
                        common.BTRowFormat('username', '用户名'),
                        common.BTRowFormatEditable('name', '姓名'),
                        common.BTRowFormatEditable('phone', '电话'),
                        common.BTRowFormatEditable('email', '邮箱'),
                        common.BTRowFormatEdSelect2(_self, 'role_group_id', '用户组', 'groupInfo'),
                        common.actFormatter('act', common.operateFormatter, tableEvents)
                    ],
                    idField: 'user_id',
                    uniqueId: 'user_id',
                    striped: true,
                    clickToSelect: true,
                    pagination: true,
                    pageSize: 10,
                    pageList: [10, 15, 25, 50, 100],
                    locale: 'zh-CN',
                    onEditableShown: function (field, row, $el, editable) {
                        _self.oldRow = $.extend(true, {}, row)
                    },
                    onEditableSave: function (field, row, oldValue, $el) {
                        common.rowModifyWithT(_self, apiUrl + 'm', row, 'user_id', $table)
                    }
                });
                common.changeTableClass($table)
            }

            function initPage() {
                _self.$http.post(apiUrl + 'i', {}).then((response) => {
                    let retData = response.data.info;
                    _self.pagePara = $.extend(true, {}, retData);
                    common.initSelect2($('#usergroup_id'), retData.groupInfo);
                    initTable();
                    $('#formA').parsley();
                    common.reSizeCall();
                    console.log('init success');
                }, (response) => {
                    console.log('init error');
                    common.dealErrorCommon(_self, response);
                });
            }

            $(function () {
                initPage();
            });
        },
        methods: {
            search: function (event) {
                $('#table').bootstrapTable("refresh")
            },
            addM: function (event) {
                let _self = this;
                _self.rowData = {};
                $('#usergroup_id').val(null).trigger('change');
                $('#AddModal').modal('show');
            },
            addOp: function (event) {
                let _self = this
                if ($('#formA').parsley().isValid()) {
                    _self.rowData.role_group_id = common.getSelect2Val('usergroup_id');
                    let reg = /^[^\u4e00-\u9fa5]+$/;//不能输入汉字
                    let validate =  reg.test(_self.rowData.username);
                    if (!validate) {
                        this.$message({
                            message: '用户名不能使用中文！',
                            type: 'warning'
                        });
                        return;
                    }
                    _self.$http.post(apiUrl + 'a', _self.rowData).then((response) => {
                        if (response.data.errno !== 0) {
                            common.dealWarningCommon(response.data.msg);
                        } else {
                            let retData = response.data.info
                            $('#table').bootstrapTable('insertRow', {
                                index: 0,
                                row: retData
                            });
                            $('#table').bootstrapTable('resetView');
                            _self.rowData = {};
                            $('#usergroup_id').val(null).trigger('change');
                            $('#formA').parsley().reset();
                            common.dealSuccessCommon('增加成功');
                            $('#AddModal').modal('hide');
                        }
                    }, (response) => {
                        console.log('add error');
                        common.dealErrorCommon(_self, response);
                    })
                }
            }
        }
    }
</script>
<style scoped>
</style>
