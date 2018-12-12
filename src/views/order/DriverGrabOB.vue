<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:;">订单管理</a></li>
            <li class="active">司机抢单监控</li>
        </ol>
        <!-- end breadcrumb -->
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <h4 class="panel-title">订单查询</h4>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-sm-3">
                        <input class="form-control" id="order_driver" placeholder="请输入承运司机">
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
                <h4 class="panel-title">当前司机抢单列表</h4>
            </div>
            <div class="panel-body auto-height">
                <table id="driverGrabTable"></table>
            </div>
        </div>
    </div>
</template>
<script>
    const common = require('commonFunc');
    const apiUrl = '/api/core/order/OrderMain?method=';

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
            let $table = $('#driverGrabTable');

            function queryParams(params) {
                if ($('#order_driver').val()) {
                    params.order_taker_id = $('#order_driver').val();
                }
                return JSON.stringify(params);
            }

            function initTable() {
                $table.bootstrapTable({
                    method: 'POST',
                    url: apiUrl + 'gl',
                    queryParams: queryParams,
                    sidePagination: 'server',
                    ajaxOptions: common.bootstrapTableAjaxOtions,
                    responseHandler: function (res) {
                        return res.info;
                    },
                    columns: [
                        common.BTRowFormatWithIndex('NO.'),
                        common.BTRowFormat('order_so_code', '业务号'),
                        common.BTRowFormat('order_container_weight', '柜重'),
                        common.BTRowFormat('order_customer_name', '客户名称'),
                        common.BTRowFormatWithFW('order_arrival_time', '到厂时间', value => {
                            return common.dateFormat(value, 'min')
                        }),
                        common.BTRowFormat('order_factory_address', '工厂地址'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_pick_stat_id', '提柜地点', 'pStationSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_return_stat_id', '还柜地点', 'rStationSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_level', '优劣单', 'orderLevelSet')
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
            }

            initPage()
        },
        methods: {
            search: function (event) {
                $('#driverGrabTable').bootstrapTable('refresh');
            }
        }
    }
</script>
<style scoped>
</style>