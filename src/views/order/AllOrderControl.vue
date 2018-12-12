<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:;">订单管理</a></li>
            <li class="active">全部订单</li>
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
                        <select class="form-control" id="order_state">
                            <option value="">请选择订单状态</option>
                            <option v-for="state in pagePara.orderStateSet" v-bind:value="state.id">
                                {{state.text}}
                            </option>
                        </select>
                    </div>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" id='order_arrival_time_start'
                               placeholder="到厂时间起点"/>
                    </div>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" id='order_arrival_time_end'
                               placeholder="到厂时间终点"/>
                    </div>
                </div>
            </div>
            <div class="panel-footer text-right">
                <label class="radio-inline radio-today">
                    <input type="checkbox" id="todayOrder" name="todayOrder" value="1" unchecked>
                    当日订单
                </label>
                <button class="btn btn-info" @click="search">查询</button>
            </div>
        </div>
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <div class="panel-heading-btn">
                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default"
                       data-click="panel-expand"><i class="fa fa-expand"></i></a>
                </div>
                <h4 class="panel-title">全部订单列表</h4>
            </div>
            <div class="panel-body auto-height">
                <table id="orderTable"></table>
            </div>
        </div>
    </div>
</template>
<script>
    const common = require('commonFunc');
    const moment = require('moment');
    const apiUrl = '/api/core/order/OrderMain?method=';

    export default {
        data: function () {
            return {
                pagePara: {},
                workRow: {}
            }
        },
        name: 'AllOrderControl',
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
                if ($('#order_state').val()) {
                    if ($('#order_state').val() == 20) {
                        params.order_state = '20,21,22,24,25,26,27,28';
                    } else {
                        params.order_state = $('#order_state').val();
                    }
                }
                if ($('#order_arrival_time_start').val()) {
                    params.order_arrival_time_start = $('#order_arrival_time_start').val();
                }
                if ($('#order_arrival_time_end').val()) {
                    params.order_arrival_time_end = $('#order_arrival_time_end').val();
                }
                /**
                 * redmine #6299 增加提交时间的查询条件
                 * @param created_at:订单提交时间，默认为今日
                 * by weijin
                 */
                if ($("input[name='todayOrder']:checked").val() === '1') {
                    params.order_created_at_start = moment(new Date()).format("YYYY-MM-DD");
                    params.order_created_at_end = moment(new Date()).format("YYYY-MM-DD");
                }
                return JSON.stringify(params);
            }

            function clickFormatter(value, row) {
                return [
                    '<a class="show_detail" style="cursor: pointer;">',
                    value,
                    '</a>'
                ].join('')
            }

            function stateFormatter(value, row, index) {
                for (let state of _self.pagePara.orderStateSet) {
                    if (value == 20 || value == 21 || value == 22 ||
                            value == 24 || value == 26 || value == 27 ||
                            value == 28) {
                        return '已处理';
                    } else if (value == 80 || value == 81 || value == 88) {
                        return '已取消';
                    } else {
                        if (value == state.id) {
                            return state.text;
                        }
                    }
                }
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
                'click .cancel': function (e, value, row, index) {
                    _self.workRow = row;
                    _self.$confirm('确认要取消订单吗？')
                            .then(_ => {
                                let params = {
                                    order_id: _self.workRow.order_id
                                };
                                _self.$http.post(apiUrl + 'pc', params).then((response) => {
                                    if (response.data.errno == 0) {
                                        common.dealSuccessCommon('订单取消成功');
                                    } else {
                                        common.dealWarningCommon(response.data.msg);
                                    }
                                    $('#orderTable').bootstrapTable('refresh');
                                }, (response) => {
                                    common.dealErrorCommon(_self, response)
                                });
                            })
                            .catch(_ => {
                            });
                },
            };

            function operateFormatter(value, row, index) {
                if (row.order_state != 80 && row.order_state != 81 && row.order_state != 88 && row.order_state != 90) {
                    return [
                        '<a class="btn btn-primary btn-xs m-r-5 cancel">取消</a>'
                    ].join('')
                }
            }

            function initTable() {
                $table.bootstrapTable({
                    method: 'POST',
                    url: apiUrl + 'l',
                    queryParams: queryParams,
                    sidePagination: 'server',
                    ajaxOptions: common.bootstrapTableAjaxOtions,
                    responseHandler: function (res) {
                        return res.info;
                    },
//                    height: common.getTableHeight(),
                    columns: [
                        common.BTRowFormatWithIndex('NO.'),
                        common.BTRowFormatWithFE('order_so_code', '业务号', clickFormatter, tableEvents),
                        common.BTRowFormatWithFormatter('order_state', '订单状态', stateFormatter),
                        common.BTRowFormat('order_container_code', '柜号'),
                        common.BTRowFormat('order_seal_code', '封条号'),
                        common.BTRowFormat('order_fetch_code', '拿单号'),
                        common.BTRowFormat('order_customer_name', '客户名称'),
                        common.BTRowFormat('order_operator_name', '操作员'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_factory_id', '工厂名称', 'factorySet'),
                        common.BTRowFormat('order_factory_address', '工厂地址'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_pick_stat_id', '提柜地点', 'pStationSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_return_stat_id', '还柜地点', 'rStationSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_carrier_id', '船公司', 'carrierSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_container_size', '柜尺寸', 'containerSizeSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_container_shape', '柜型', 'containerShapeSet'),
                        common.BTRowFormatWithFW('order_arrival_time', '到厂时间', value => {
                            return common.dateFormat(value, 'min');
                        }),
//                        common.actFormatter('operate', operateFormatter, tableEvents)
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
    .margin-top-10{
        margin-top: 10px;
    }
    .radio-today{
        line-height: 22px;
        padding-left: 0;
        margin-right: 20px;
    }
</style>