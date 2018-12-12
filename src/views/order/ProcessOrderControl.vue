<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:;">订单管理</a></li>
            <li class="active">已处理订单</li>
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
                        <input class="form-control" id="order_factory_address" placeholder="请输入工厂地址">
                    </div>
                    <div class="col-sm-3">
                        <input class="form-control" id="order_driver" placeholder="请输入承运司机">
                    </div>
                </div>
                <div class="row" style="margin-top: 10px">
                    <div class="col-sm-3">
                        <input class="form-control" id="order_container_code" placeholder="请输入柜号">
                    </div>
                    <div class="col-sm-3">
                        <select class="form-control" id="order_history_take_way">
                            <option value="">请选择处理类型</option>
                            <option v-for="c in pagePara.orderTakeWaySet" v-bind:value="c.id">{{c.text}}</option>
                        </select>
                    </div>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" id='order_arrival_time_start' placeholder="到厂时间起点"/>
                    </div>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" id='order_arrival_time_end' placeholder="到厂时间终点"/>
                    </div>
                </div>
                <div class="row" style="margin-top: 10px">
                    <div class="col-sm-3">
                        <input class="form-control" id="order_history_vehicle_num" placeholder="请输入车牌号">
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
                <h4 class="panel-title">已处理订单列表</h4>
            </div>
            <div class="panel-body auto-height">
                <table id="orderTable"></table>
            </div>
        </div>
    </div>
</template>
<script>
    const common = require('commonFunc');
    const apiUrl = '/api/core/order/OrderMain?method=';
    const historyApiUrl = '/api/core/order/OrderHistory?method=';

    export default {
        data: function () {
            return {
                pagePara: {},
                workRow: {},
            }
        },
        name: 'ProcessOrderControl',
        mounted: function () {
            let _self = this;
            let $table = $('#orderTable');

            function queryParams(params) {
                if ($('#order_so_code').val()) {
                    params.order_so_code = $('#order_so_code').val();
                }
                if ($('#order_customer_name').val()) {
                    params.order_customer_name = $('#order_customer_name').val();
                }
                if ($('#order_factory_name').val()) {
                    params.order_factory_name = $('#order_factory_name').val();
                }
                if ($('#order_factory_address').val()) {
                    params.order_factory_address = $('#order_factory_address').val();
                }
                if ($('#order_container_code').val()) {
                    params.order_container_code = $('#order_container_code').val();
                }
                if ($('#order_arrival_time_start').val()) {
                    params.order_arrival_time_start = $('#order_arrival_time_start').val();
                }
                if ($('#order_arrival_time_end').val()) {
                    params.order_arrival_time_end = $('#order_arrival_time_end').val();
                }
                if ($('#order_history_take_way').val()) {
                    params.order_history_take_way = $('#order_history_take_way').val();
                }
                if ($('#order_history_vehicle_num').val()) {
                    params.order_vehicle_num = $('#order_history_vehicle_num').val();
                }
                if ($('#order_driver').val()) {
                    params.order_taker_name = $('#order_driver').val();
                }
                params.order_state = '20,21,22,24,25,26,27,28';
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
                'click .location': function (e, value, row, index) {
                    _self.$router.push({
                        path: '/driver/DriverLocation',
                        query: {
                            order_booking_no: row.order_history_booking_no
                        }
                    })
                },
                'click .complete': function (e, value, row, index) {
                    if (row.order_history_state < 22) return;
                    _self.workRow = row;
                    _self.$confirm('确认完成该订单吗？').then((result) => {
                        console.log(result);
                        let params = {
                            order_id: _self.workRow.order_id,
                            from: 3
                        };
                        _self.$http.post(apiUrl + 'rc', params).then((response) => {
                            if (response.data.errno == 0) {
                                common.dealSuccessCommon('处理成功，请在已完成订单列表中查看');
                                $('#orderTable').bootstrapTable('refresh');
                            } else {
                                common.dealWarningCommon(response.data.msg);
                            }
                        });
                    }).catch((error) => {
                        console.log(error);
                    });
                },
                'click .rollback': function (e, value, row, index) {
                    if (row.order_history_state >= 22) return;
                    _self.workRow = row;
                    _self.$confirm('该订单将变为待处理状态，是否确认继续？').then(() => {
                        let params = {
                            order_id: _self.workRow.order_id,
                            from: 3
                        };
                        _self.$http.post(apiUrl + 'rso', params).then((response) => {
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
                },
                'click .cancel': function (e, value, row, index) {
                    if (row.order_history_state >= 22) return;
                    _self.workRow = row;
                    _self.$confirm('确认要取消订单吗？').then(() => {
                        let params = {
                            order_id: _self.workRow.order_id,
                            from: 3
                        };
                        _self.$http.post(apiUrl + 'pc', params).then((response) => {
                            if (response.data.errno == 0) {
                                common.dealSuccessCommon('订单取消成功，请在已取消订单列表查看');
                                $('#orderTable').bootstrapTable('refresh');
                            } else {
                                common.dealWarningCommon(response.data.msg);
                            }
                        }, (response) => {
                            common.dealErrorCommon(_self, response)
                        });
                    }).catch((error) => {
                        console.log(error);
                    });
                },
                'click .redispatch': function (e, value, row, index) {
                    // if (row.order_history_state >= 22) return;
                    _self.workRow = row;
                    _self.$confirm('确认要重试无纸化派车吗？').then(() => {
                        let params = {
                            order_id: _self.workRow.order_id,
                            from: 3
                        };
                        _self.$http.post(apiUrl + 'eir_d', params).then((response) => {
                            if (response.data.errno == 0) {
                                common.dealSuccessCommon('操作成功！');
                                $('#orderTable').bootstrapTable('refresh');
                            } else {
                                common.dealWarningCommon(response.data.msg);
                            }
                        }, (response) => {
                            common.dealErrorCommon(_self, response)
                        });
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            };

            function clickFormatter(value, row) {
                return [
                    '<a class="show_detail" style="cursor: pointer;">',
                    value,
                    '</a>'
                ].join('')
            }

            function operateFormatter(value, row, index) {
                if (row.order_history_state >= 22)
                    return [
                        '<a class="btn btn-primary btn-xs m-r-5 location">运输动态</a>',
                        '<a class="btn btn-primary btn-xs m-r-5 rollback" disabled="true">重新分配</a>',
                        '<a class="btn btn-primary btn-xs m-r-5 cancel" disabled="true">取消订单</a>',
                        '<a class="btn btn-primary btn-xs m-r-5 complete">完成订单</a>',
                        '<a class="btn btn-primary btn-xs m-r-5 redispatch">无纸化派车</a>'
                    ].join('');
                else
                    return [
                        '<a class="btn btn-primary btn-xs m-r-5 location">运输动态</a>',
                        '<a class="btn btn-primary btn-xs m-r-5 rollback">重新分配</a>',
                        '<a class="btn btn-primary btn-xs m-r-5 cancel">取消订单</a>',
                        '<a class="btn btn-primary btn-xs m-r-5 complete" disabled="true">完成订单</a>',
                        '<a class="btn btn-primary btn-xs m-r-5 redispatch">无纸化派车</a>'
                    ].join('')
            }

            function initTable() {
                $table.bootstrapTable({
                    method: 'POST',
                    url: historyApiUrl + 'l',
                    queryParams: queryParams,
                    sidePagination: 'server',
                    ajaxOptions: common.bootstrapTableAjaxOtions,
                    responseHandler: function (res) {
                        return res.info;
                    },
//                    height: common.getTableHeight(),
                    columns: [
                        common.BTRowFormatWithIndex('NO.'),
                        common.BTRowFormatWithFE('order_history_so_code', '业务号', clickFormatter, tableEvents),
                        common.BTRowFormat('order_history_container_code', '柜号'),
                        common.BTRowFormat('order_history_seal_code', '封条号'),
                        common.BTRowFormat('order_history_container_weight', '柜重'),
                        common.BTRowFormat('order_history_fetch_code', '拿单号'),
                        common.BTRowFormat('order_history_vehicle_num', '车牌号'),
                        common.BTRowFormat('order_history_taker_name', '承运司机'),
                        common.BTRowFormat('order_history_customer_name', '客户名称'),
                        common.BTRowFormatWithFW('order_history_arrival_time', '到厂时间', value => {
                            return common.dateFormat(value, 'min')
                        }),
                        common.BTRowFormat('order_history_factory_address', '工厂地址'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_history_pick_stat_id', '提柜地点', 'pStationSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_history_return_stat_id', '还柜地点', 'rStationSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_history_carrier_id', '船公司', 'carrierSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_history_container_size', '柜尺寸', 'containerSizeSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_history_container_shape', '柜型', 'containerShapeSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_history_level', '优劣单', 'orderLevelSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_history_take_way', '处理类型', 'orderTakeWaySet'),
                        common.BTRowFormatWithFW('order_history_driver_confirm_time', '抢/接单时间', value => {
                            if (value) {
                                return common.dateFormat(value, 'min')
                            } else {
                                return '-'
                            }
                        }),
                        common.actFormatter('operate', operateFormatter, tableEvents)
                    ],
                    idField: 'order_id',
                    uniqueId: 'order_id',
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
                common.initDatepicker($('#order_arrival_time_start'));
                common.initDatepicker($('#order_arrival_time_end'));
            }

            initPage()
        },
        methods: {
            search: function (event) {
                $('#orderTable').bootstrapTable('refresh');
            }
        }
    }
</script>
<style scoped>
</style>