<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:;">订单管理</a></li>
            <li class="active">抢单模式</li>
        </ol>
        <!-- end breadcrumb -->
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <h4 class="panel-title">订单查询</h4>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-sm-3">
                        <input class="form-control" id="order_so_code" placeholder="请输入业务号">
                    </div>
                    <div class="col-sm-3">
                        <select class="form-control" id="order_customer_name">
                            <option value="">请选择客户名称</option>
                            <option v-for="c in pagePara.customerSet" v-bind:value="c.text">{{c.text}}</option>
                        </select>
                    </div>
                    <div class="col-sm-3">
                        <input class="form-control" id="order_factory_name" placeholder="请输入工厂名称">
                    </div>
                    <div class="col-sm-3">
                        <input class="form-control" id="order_factory_address" placeholder="请输入工厂地址">
                    </div>
                </div>
                <div class="row" style="margin-top: 10px">
                    <div class="col-sm-3">
                        <input class="form-control" id="order_container_code" placeholder="请输入柜号">
                    </div>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" id='order_arrival_time_start' placeholder="到厂时间起点"/>
                    </div>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" id='order_arrival_time_end' placeholder="到厂时间终点"/>
                    </div>
                </div>
            </div>
            <div class="panel-footer text-right">
                <button class="btn btn-info" @click="search">查询</button>
            </div>
        </div>
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <div class="panel-heading-btn">
                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default"
                       data-click="panel-expand"><i class="fa fa-expand"></i></a>
                </div>
                <h4 class="panel-title">抢单列表</h4>
            </div>
            <div class="panel-body auto-height">
                <div class="text-right">
                    <button class="btn btn-info" @click="changeState">更改状态</button>
                </div>
                <div style="margin-top: 10px">
                    <el-tabs v-model="tabSelect" type="border-card" @tab-click="tabClick">
                        <el-tab-pane label="A类待抢单" name="11"></el-tab-pane>
                        <el-tab-pane label="B类待抢单" name="12"></el-tab-pane>
                        <el-tab-pane label="C类待抢单" name="13"></el-tab-pane>
                        <div>
                            <table id="orderTable"></table>
                        </div>
                    </el-tabs>
                </div>
            </div>
        </div>
        <div class="modal fade" id="stateModal" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title">更改状态</h4>
                    </div>
                    <form @submit.prevent="submitChangeState" id="grabForm">
                        <div class="modal-body">
                            <h5>请选要更改的订单类型</h5>
                            <el-radio-group v-model="orderState">
                                <el-radio :label="11">A类待抢单</el-radio>
                                <el-radio :label="12">B类待抢单</el-radio>
                                <el-radio :label="13">C类待抢单</el-radio>
                            </el-radio-group>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-info">确定</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="modal fade" id="arrangeModal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title">指派订单</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group col-xs-10">
                            <input class="form-control"  id="search_text" placeholder="搜索手机号、司机姓名、车牌号" v-on:input="driverSearch">
                        </div>
                        <div class="form-group col-xs-2">
                            <button type="button" class="btn btn-info" @click="arrangeOrder"><i class="fa fa-fw fa-plus"></i>指派</button>
                        </div>
                        <div v-show="tabSelect === '11'">
                            <span class="sub-title span-color">推荐司机列表</span>
                            <table id="recommendTable"></table>
                        </div>
                        <div class="top">
                            <span v-show="tabSelect === '11'" class="sub-title">全部司机列表</span>
                            <table id="arrangeTable"></table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    const common = require('commonFunc');
    const apiUrl = '/api/core/order/OrderMain?method=';

    export default {
        data: function() {
            return {
                pagePara: {},
                workRow: {},
                tabSelect: "11",
                selectRows: [],
                orderState: 11,
                recommendList: []
            }
        },
        name: 'GrabOrderControl',
        mounted: function() {
            let _self = this;
            let $table = $('#orderTable');
            let $arrangeTable = $('#arrangeTable');
            let $recommendTable = $('#recommendTable');

            function queryParams(params) {
                if($('#order_so_code').val()){
                    params.order_so_code = $('#order_so_code').val();
                }
                if ($('#order_customer_name').val()) {
                    params.order_customer_name = $('#order_customer_name').val();
                }
                if($('#order_factory_name').val()){
                    params.order_factory_name = $('#order_factory_name').val();
                }
                if($('#order_factory_address').val()){
                    params.order_factory_address = $('#order_factory_address').val();
                }
                if($('#order_container_code').val()){
                    params.order_container_code = $('#order_container_code').val();
                }
                if(_self.tabSelect){
                    params.order_state = _self.tabSelect;
                }
                if($('#order_arrival_time_start').val()){
                    params.order_arrival_time_start = $('#order_arrival_time_start').val();
                }
                if($('#order_arrival_time_end').val()){
                    params.order_arrival_time_end = $('#order_arrival_time_end').val();
                }
                return JSON.stringify(params);
            }

            window.tableEvents = {
                'click .show_detail': function (e, value, row, index) {
                    _self.$router.push({
                        path: '/order/OrderDetailControl',
                        query: {
                            order_id: row.order_id
                        }
                    })
                },
                'click .arrange': function(e, value, row, index) {
                    _self.workRow = row;
                    $('#arrangeTable').bootstrapTable('uncheckAll');
                    $('#arrangeTable').bootstrapTable('refresh');
                    $('#arrangeModal').modal('show');
                },
                'click .cancel': function(e, value, row, index) {
                    _self.workRow = row;
                    _self.$confirm('确认要取消订单吗？')
                        .then(_ => {
                            let params = {
                                order_id : _self.workRow.order_id
                            };
                            _self.$http.post(apiUrl + 'pc', params).then((response) => {
                                if (response.data.errno == 0) {
                                    common.dealSuccessCommon('订单取消成功');
                                } else {
                                    common.dealWarningCommon(response.data.msg);
                                }
                            }, (response) => {
                                common.dealErrorCommon(_self, response)
                            })
                            $('#orderTable').bootstrapTable('refresh');
                        })
                        .catch(_ => {

                        });
                },
                'click .delete': function(e, value, row, index) {
                    common.rowDeleteWithApi(_self, '删除订单', apiUrl + 'd', $table, row, 'order_id', function() {})
                },
                'click .rollback': function (e, value, row, index) {
                    _self.workRow = row;
                    _self.$confirm('该订单将变为待处理状态，是否确认继续？').then(() => {
                        let params = {
                            order_id: _self.workRow.order_id,
                            from: 3
                        };
                        _self.$http.post(apiUrl + 'cog', params).then((response) => {
                            if (response.data.errno == 0) {
                                common.dealSuccessCommon('处理成功，请在待处理订单列表中查看');
                                $('#orderTable').bootstrapTable('refresh');
                            } else {
                                common.dealWarningCommon(response.data.msg);
                            }
                        });
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            };

            function operateFormatter(value, row, index) {
                return [
                    '<a class="btn btn-primary btn-xs m-r-5 arrange">指派</a>',
                    '<a class="btn btn-primary btn-xs m-r-5 cancel">取消</a>',
                    '<a class="btn btn-primary btn-xs m-r-5 rollback">重新分配</a>'
                ].join('')
            }

            function clickFormatter(value, row) {
                return [
                    '<a class="show_detail" style="cursor: pointer;">',
                    value,
                    '</a>'
                ].join('')
            }

            function initTable() {
                $table.bootstrapTable({
                    method: 'POST',
                    url: apiUrl + 'l',
                    queryParams: queryParams,
                    sidePagination: 'server',
                    ajaxOptions: common.bootstrapTableAjaxOtions,
                    responseHandler: function(res) {
                        return res.info;
                    },
//                    height: common.getTableHeight(),
                    columns: [
                        {
                            field: 'order_state',
                            checkbox: true
                        },
                        common.BTRowFormatWithIndex('NO.'),
                        common.BTRowFormatWithFE('order_so_code', '业务号', clickFormatter, tableEvents),
                        common.BTRowFormat('order_container_code', '柜号'),
                        common.BTRowFormat('order_seal_code', '封条号'),
                        common.BTRowFormat('order_fetch_code', '拿单号'),
                        common.BTRowFormat('order_customer_name', '客户名称'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_factory_id', '工厂名称', 'factorySet'),
                        common.BTRowFormat('order_factory_address', '工厂地址'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_pick_stat_id', '提柜地点', 'pStationSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_return_stat_id', '还柜地点', 'rStationSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_carrier_id', '船公司', 'carrierSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_container_size', '柜尺寸', 'containerSizeSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_container_shape', '柜型', 'containerShapeSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_level', '优劣单', 'orderLevelSet'),
                        common.BTRowFormatWithFW('order_arrival_time', '到厂时间', value => {
                            return common.dateFormat(value, 'min');
                        }),
                        common.BTRowFormat('order_operator_name', '操作员'),
                        common.BTRowFormatWithFW('created_at', '提交时间', value => {
                            return common.dateFormat(value, 'min');
                        }),
                        common.actFormatter('operate', operateFormatter, tableEvents)
                    ],
                    idField: 'order_id',
                    uniqueId: 'order_id',
                    striped: true,
                    clickToSelect: false,
                    pagination: true,
                    pageList: [10, 15, 25, 50, 100],
                    locale: 'zh-CN',
                    onCheckAll: function(rows) {
                        for (let i = 0; i < rows.length; i++) {
                            _self.selectRows.push(rows[i])
                        }
                    },
                    onUncheckAll: function(rows) {
                        _self.selectRows = []
                    },
                    onCheck: function(row, $element) {
                        _self.selectRows.push(row)
                    },
                    onUncheck: function(row, $element) {
                        _self.selectRows.splice($.inArray(row, _self.selectRows), 1);
                    },
                    onPageChange: function(number, size) {
                        _self.selectRows = []
                    }
                });
                common.changeTableClass($table)
            }

            function driverQueryParams(params) {
                if($('#search_text').val()){
                    params.search_text = $('#search_text').val();
                }
                let driver_type = null;
                if (_self.orderState == 11) {
                    driver_type = 1;
                } else if (_self.orderState == 12){
                    driver_type = 2;
                } else {
                    driver_type = 3;
                }
                params.order_id = _self.workRow.order_id;
                params.driver_type = driver_type;
                params.driver_process_status = 0;
                return JSON.stringify(params);
            }

            function distanceFormatter(value, row, index) {
                if (row.away_to_pick >= 99999) {
                    return '距离未知';
                } else {
                    return row.away_to_pick;
                }
            }

            function initArrangeTable() {
                $('#arrangeTable').bootstrapTable({
                    method: 'POST',
                    url: apiUrl + 'qd',
                    queryParams: driverQueryParams,
                    sidePagination: 'server',
                    ajaxOptions: common.bootstrapTableAjaxOtions,
                    responseHandler: function (res) {
                        filterRecommendDrivers(res.info.rows);
                        return res.info;
                    },
                    height: 200,
                    columns: [
                        {
                            field: 'order_state',
                            radio: true
                        },
                        common.BTRowFormatWithIndex('NO.'),
                        common.BTRowFormat('driver_name', '姓名'),
                        common.BTRowFormat('driver_phone', '手机号'),
                        common.BTRowFormat('driver_identity_num', '身份证号码'),
                        common.BTRowFormat('vehicle_license_num', '关联车牌号码'),
                        common.BTRowFormatWithFormatter('away_to_pick', '距离(千米)', distanceFormatter)
                    ],
                    idField: 'driver_id',
                    uniqueId: 'driver_id',
                    striped: true,
                    clickToSelect: true,
                    pagination: false,
                    pageList: [10, 15, 25, 50, 100],
                    locale: 'zh-CN',
                    onCheck: function(row, $element) {
                        _self.arrangeDriver = row;
                    }
                });
                common.changeTableClass($arrangeTable)
            }

            function initRecommendTable() {
                $('#recommendTable').bootstrapTable({
                    height: 200,
                    columns: [
                        {
                            field: 'order_state',
                            radio: true
                        },
                        common.BTRowFormatWithIndex('NO.'),
                        common.BTRowFormat('driver_name', '姓名'),
                        common.BTRowFormat('driver_phone', '手机号'),
                        common.BTRowFormat('driver_identity_num', '身份证号码'),
                        common.BTRowFormat('vehicle_license_num', '关联车牌号码'),
                        common.BTRowFormatWithFormatter('away_to_pick', '距离(千米)', distanceFormatter)
                    ],
                    idField: 'driver_id',
                    uniqueId: 'driver_id',
                    striped: true,
                    clickToSelect: true,
                    locale: 'zh-CN',
                    onCheck: function(row, $element) {
                        _self.arrangeDriver = row;
                    }
                });
                common.changeTableClass($recommendTable)
            }

            function getInit() {
                _self.$http.post(apiUrl + 'i', {}).then((response) => {
                    _self.pagePara = response.data.info;
                    initTable();
                    initArrangeTable();
                    initRecommendTable();
                }, (response) => {
                    common.dealErrorCommon(_self, response)
                })
            }

            function initPage() {
                getInit();
                common.initDatepicker($('#order_arrival_time_start'));
                common.initDatepicker($('#order_arrival_time_end'));
            }

            function filterRecommendDrivers(list) {
                _self.recommendList = [];
                if (_self.workRow.order_level == 11) {
                    let min = list[0].accepted_S_order_num;
                    for (let i = 0; i < list.length; i++)
                        if(list[i].accepted_S_order_num<=min)
                            min = list[i].accepted_S_order_num;
                    console.log(min);
                    for (let i = 0; i < list.length; i++) {
                        let num = list[i].accepted_S_order_num;
                        if (min) {
                            if (min == num) {
                                _self.recommendList.push(list[i]);
                            }
                        } else {
                            if (!num) {
                                _self.recommendList.push(list[i]);
                            }
                        }
                    }
                } else {
                    _self.recommendList = list;
                }

                $('#recommendTable').bootstrapTable('load', _self.recommendList);
            }
            initPage()
        },
        methods: {
            search: function(event) {
                $('#orderTable').bootstrapTable('refresh');
            },
            changeState: function(event) {
                let _self = this;
                if (_self.selectRows.length <= 0) {
                    _self.$message({
                        message: '请选择要处理的订单',
                        type: 'warning'
                    });
                } else {
                    $('#stateModal').modal('show');
                }
            },
            submitChangeState: function(event) {
                let _self = this;
                for (let i = 0; i < _self.selectRows.length; i++) {
                    let order = _self.selectRows[i];
                    let params = {
                        order_id: order.order_id,
                        order_state: _self.orderState
                    };
                    _self.$http.post(apiUrl + 'o', params).then((response) => {
                        $('#stateModal').modal('hide');
                        _self.selectRows = [];
                        _self.orderState = 11;
                        if (response.data.errno == 0) {
                            common.dealSuccessCommon('订单类型已更改');
                            $('#orderTable').bootstrapTable('refresh');
                        } else {
                            common.dealWarningCommon(response.data.msg);
                        }
                    }, (response) => {
                        common.dealErrorCommon(_self, response)
                    })
                }
            },
            arrangeOrder: function (event) {
                let _self = this;
                let params = {
                    order_id: _self.workRow.order_id,
                    driver_user_id: _self.arrangeDriver.driver_user_id,
                    driver_name: _self.arrangeDriver.driver_name,
                    order_state: _self.orderState
                };
                if(_self.arrangeDriver.driver_process_status==1){
                    _self.$confirm('该司机当前有未开始运输的订单，是否确认继续？').then(()=> {
                        _self.$http.post(apiUrl + 'ar', params).then((response) => {
                        $('#arrangeModal').modal('hide');
                    if (response.data.errno == 0) {
                        common.dealSuccessCommon('订单指派成功');
                        $('#orderTable').bootstrapTable('refresh');
                    } else if (response.data.errno.toString().startsWith('eirless_')) {
                        common.dealWarningCommon(response.data.msg);
                        $('#orderTable').bootstrapTable('refresh');
                    } else {
                        common.dealWarningCommon(response.data.msg);
                    }
                }, (response) => {
                        common.dealErrorCommon(_self, response)
                    })
                }).catch((error)=> {
                        console.log(error);
                });
                }else {
                    _self.$http.post(apiUrl + 'ar', params).then((response) => {
                        $('#arrangeModal').modal('hide');
                    if (response.data.errno == 0) {
                        common.dealSuccessCommon('订单指派成功');
                        $('#orderTable').bootstrapTable('refresh');
                    } else if (response.data.errno.toString().startsWith('eirless_')) {
                        common.dealWarningCommon(response.data.msg);
                        $('#orderTable').bootstrapTable('refresh');
                    }  else {
                        common.dealWarningCommon(response.data.msg);
                    }
                }, (response) => {
                        common.dealErrorCommon(_self, response)
                    })
                }
            },
            driverSearch: function(event) {
                $('#arrangeTable').bootstrapTable('refresh');
            },
            tabClick(tab, event) {
                this.orderState = parseInt(this.tabSelect);
                $('#orderTable').bootstrapTable('refresh');
                $('#arrangeTable').bootstrapTable('refresh');
            }
        }
    }
</script>
<style scoped>
    .top {
        margin-top: 10px;
    }
    .sub-title {
        font-size: 13px;
    }
    .span-color {
        color: green;
    }
    .modal-dialog{
        width: 800px;
    }
</style>