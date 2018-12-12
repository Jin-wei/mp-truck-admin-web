<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:;">订单管理</a></li>
            <li class="active">已取消订单</li>
        </ol>
        <!-- end breadcrumb -->
        <div class="row">
            <div class="col-md-12">
                <div class="panel panel-inverse">
                    <div class="panel-heading">
                        <h4 class="panel-title">订单查询</h4>
                    </div>
                    <div class="panel-body">
                        <div class="">
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
                                    <input class="form-control" id="order_container_code" placeholder="请输入柜号">
                                </div>
                            </div>
                            <div class="row" style="margin-top: 10px">
                                <div class="col-sm-3">
                                    <select class="form-control" id="order_cancel_type">
                                        <option value="">请选择取消类型</option>
                                        <option value="1">车队取消</option>
                                        <option value="2">司机取消</option>
                                    </select>
                                </div>
                                <div class="col-sm-3">
                                    <input type="text" class="form-control" id='order_cancel_time_start' placeholder="取消时间起点"/>
                                </div>
                                <div class="col-sm-3">
                                    <input type="text" class="form-control" id='order_cancel_time_end' placeholder="取消时间终点"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="panel-footer text-right">
                        <button class="btn btn-info" @click="search">查询</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <div class="panel-heading-btn">
                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default"
                       data-click="panel-expand"><i class="fa fa-expand"></i></a>
                </div>
                <h4 class="panel-title">已取消订单列表</h4>
            </div>
            <div class="panel-body auto-height">
                <div class="text-right">
                    <button class="btn btn-info" @click="copyOrder">复制订单</button>
                </div>
                <div style="margin-top: 10px">
                    <table id="orderTable"></table>
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
                selectOrer: null
            }
        },
        name: 'CancelOrderControl',
        mounted: function() {
            let _self = this;
            let $table = $('#orderTable');

            function queryParams(params) {
                if($('#order_so_code').val()){
                    params.order_so_code = $('#order_so_code').val();
                }
                if ($('#order_customer_name').val()) {
                    params.order_customer_name = $('#order_customer_name').val();
                }
                if($('#order_factory_address').val()){
                    params.order_factory_address = $('#order_factory_address').val();
                }
                if($('#order_container_code').val()){
                    params.order_container_code = $('#order_container_code').val();
                }
                if($('#order_cancel_type').val()){
                    params.order_cancel_type = $('#order_cancel_type').val();
                }
                if($('#order_cancel_time_start').val()){
                    params.order_cancel_time_start = $('#order_cancel_time_start').val();
                }
                if($('#order_cancel_time_end').val()){
                    params.order_cancel_time_end = $('#order_cancel_time_end').val();
                }
                params.order_state = 88;
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
                }
            };

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
                            radio: true
                        },
                        common.BTRowFormatWithIndex('NO.'),
                        common.BTRowFormatWithFE('order_so_code', '业务号', clickFormatter, tableEvents),
                        common.BTRowFormat('order_container_code', '柜号'),
                        common.BTRowFormat('order_seal_code', '封条号'),
                        common.BTRowFormat('order_fetch_code', '拿单号'),
                        common.BTRowFormat('order_customer_name', '客户名称'),
                        common.BTRowFormat('order_factory_address', '工厂地址'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_pick_stat_id', '提柜地点', 'pStationSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_return_stat_id', '还柜地点', 'rStationSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_carrier_id', '船公司', 'carrierSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_container_size', '柜尺寸', 'containerSizeSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_container_shape', '柜型', 'containerShapeSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_level', '优劣单', 'orderLevelSet'),
                        common.BTRowFormatWithFW('updated_at', '取消时间', value => {
                            return common.dateFormat(value, 'min')
                        }),
                        common.BTRowFormatWithFW('order_arrival_time', '到厂时间', value => {
                            return common.dateFormat(value, 'min')
                        })
                    ],
                    idField: 'order_id',
                    uniqueId: 'order_id',
                    striped: true,
                    clickToSelect: true,
                    pagination: true,
                    pageList: [10, 15, 25, 50, 100],
                    locale: 'zh-CN',
                    onCheck: function(row, $element) {
                        _self.selectOrer = row;
                    }
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
                common.initDatepicker($('#order_cancel_time_start'));
                common.initDatepicker($('#order_cancel_time_end'));
            }

            initPage()
        },
        methods: {
            search: function(event) {
                $('#orderTable').bootstrapTable('refresh');
            },
            copyOrder: function(event) {
                let _self = this;
                if (_self.selectOrer) {
                    _self.$router.push({
                        path: '/order/CreateOrderControl',
                        query: {
                            order_id:  _self.selectOrer.order_id,
                            copy_order: true
                        }
                    })
                } else {
                    _self.$message({
                        message: '请选择要复制的订单',
                        type: 'warning'
                    });
                }

            }
        }
    }
</script>
<style scoped>
</style>