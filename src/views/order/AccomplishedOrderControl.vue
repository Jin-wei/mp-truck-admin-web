<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:;">订单管理</a></li>
            <li class="active">已完成订单</li>
        </ol>
        <!-- end breadcrumb -->
        <div class="">
            <div class="">
                <div class="panel panel-inverse">
                    <div class="panel-heading">
                        <div class="panel-heading-btn">
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>
                        </div>
                        <h4 class="panel-title">已完成订单</h4>
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
                                <div class="col-sm-3">
                                    <input type="text" class="form-control" id='order_completed_at_start' placeholder="完成时间起点"/>
                                </div>
                            </div>
                            <div class="row" style="margin-top: 10px">
                                <div class="col-sm-3">
                                    <input type="text" class="form-control" id='order_completed_at_end' placeholder="完成时间终点"/>
                                </div>
                                <div class="col-sm-3">
                                    <input class="form-control" id="order_vehicle_num" placeholder="请输入车牌号">
                                </div>
                                <div class="col-sm-3">
                                    <select class="form-control select2" id="order_source"></select>
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
                <h4 class="panel-title">已完成订单列表</h4>
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
    const listApiUrl = '/api/core/order/OrderHistory?method=';

    export default {
        data: function() {
            return {
                pagePara: {},
                workRow: {},
                selectOrer: null
            }
        },
        name: 'AccomplishedOrderControl',
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
                if($('#order_factory_name').val()){
                    params.order_factory_name = $('#order_factory_name').val();
                }
                if($('#order_factory_address').val()){
                    params.order_factory_address = $('#order_factory_address').val();
                }
                if($('#order_container_code').val()){
                    params.order_container_code = $('#order_container_code').val();
                }
                if($('#order_arrival_time_start').val()){
                    params.order_arrival_time_start = $('#order_arrival_time_start').val();
                }
                if($('#order_arrival_time_end').val()){
                    params.order_arrival_time_end = $('#order_arrival_time_end').val();
                }
                if($('#order_completed_at_start').val()){
                    params.order_completed_at_start = $('#order_completed_at_start').val();
                }
                if($('#order_completed_at_end').val()){
                    params.order_completed_at_end = $('#order_completed_at_end').val();
                }
                if($('#order_vehicle_num').val()){
                    params.order_vehicle_num = $('#order_vehicle_num').val();
                }
                //redmine #6340 增加订单来源查询条件
                let order_source = common.getSelect2Val('order_source');
                if(order_source !== ''){
                    params.order_source = order_source;
                }
                params.order_state = 90;
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
                    url: listApiUrl + 'lh',
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
                        common.BTRowFormatWithFE('order_history_so_code', '业务号', clickFormatter, tableEvents),
                        common.BTRowFormat('order_history_container_code', '柜号'),
                        common.BTRowFormat('order_history_seal_code', '封条号'),
                        common.BTRowFormat('order_history_container_weight', '柜重'),
                        common.BTRowFormat('order_history_customer_name', '客户名称'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_history_factory_id', '工厂名称', 'factorySet'),
                        common.BTRowFormat('order_history_factory_address', '工厂地址'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_history_pick_stat_id', '提柜地点', 'pStationSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_history_return_stat_id', '还柜地点', 'rStationSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_history_carrier_id', '船公司', 'carrierSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_history_container_size', '柜尺寸', 'containerSizeSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_history_container_shape', '柜型', 'containerShapeSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_history_level', '优劣单', 'orderLevelSet'),
                        common.BTRowFormatWithFW('order_history_arrival_time', '到厂时间', value=> {
                            return common.dateFormat(value, 'min')
                        }),
                        common.BTRowFormat('order_history_vehicle_num', '车牌号'),
                        common.BTRowFormat('order_history_taker_name', '承运司机'),
                        common.BTRowFormatWithFW('order_history_from', '完成类型', value=> {
                            if (value === '3') {
                                return '手动';
                            } else {
                                return '自动';
                            }
                        }),
                        common.BTRowFormatWithFW('order_history_completed_at', '完成时间', value => {
                            return common.dateFormat(value, 'min')
                        })
                    ],
                    idField: 'order_id',
                    uniqueId: 'order_id',
                    striped: true,
                    clickToSelect: false,
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
                    //初始化订单来源
                    common.initSelect2PlaceholderNoWidth($('#order_source'), _self.pagePara.orderSourceSet,'请选择订单来源');
                    initTable();
                }, (response) => {
                    common.dealErrorCommon(_self, response)
                })
            }

            function initPage() {
                getInit();
                common.initDatepicker($('#order_arrival_time_start'));
                common.initDatepicker($('#order_arrival_time_end'));
                common.initDatepicker($('#order_completed_at_start'));
                common.initDatepicker($('#order_completed_at_end'));
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