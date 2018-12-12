<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb text-right">
            <li><a href="javascript:;">运营管理</a></li>
            <li class="active">优单分配管理</li>
        </ol>
        <!-- end breadcrumb -->
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <div class="panel-heading-btn">
                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default"
                       data-click="panel-expand"><i class="fa fa-expand"></i></a>
                </div>
                <h4 class="panel-title">当前司机权值排名</h4>
            </div>
            <div class="panel-body auto-height">
                <div style="margin-top: 10px">
                    <table id="driverWeightTable"></table>
                </div>
            </div>
        </div>
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <div class="panel-heading-btn">
                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default"
                       data-click="panel-expand"><i class="fa fa-expand"></i></a>
                </div>
                <h4 class="panel-title">当前待抢优单情况</h4>
            </div>
            <div class="panel-body auto-height">
                <div style="margin-top: 10px">
                    <table id="sOrderTable"></table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    const common = require('commonFunc');
    const apiUrl = '/api/driver/weight/DriverWeight?method=';

    export default {
        data: function () {
            return {
                pagePara: {},
                workRow: {},
                selectDate: ''
            }
        },
        name: 'DriverWeightControl',
        mounted: function () {
            let _self = this;
            let $table1 = $('#driverWeightTable');
            let $table2 = $('#sOrderTable');

            function queryParams(params) {
                return JSON.stringify(params);
            }

            function initTable1() {
                $table1.bootstrapTable({
                    method: 'POST',
                    url: apiUrl + 'qwl',
                    queryParams: queryParams,
                    sidePagination: 'server',
                    ajaxOptions: common.bootstrapTableAjaxOtions,
                    responseHandler: function (res) {
                        return res.info;
                    },
//                    height: common.getTableHeight(),
                    columns: [
                        common.BTRowFormatWithIndex('NO.'),
                        common.BTRowFormat('driver_name', '司机姓名'),
                        common.BTRowFormat('vehicle_license_num', '车牌号'),
                        common.BTRowFormat('accepted_order_num', '接单总数'),
                        common.BTRowFormat('accepted_S_order_num', '接优单数'),
                        common.BTRowFormat('dyn_grade', '动态权值')
                    ],
                    idField: 'driver_id',
                    uniqueId: 'driver_id',
                    striped: true,
                    locale: 'zh-CN'
                });
                common.changeTableClass($table1)
            }

            function initTable2() {
                $table2.bootstrapTable({
                    method: 'POST',
                    url: apiUrl + 'qgsl',
                    queryParams: queryParams,
                    sidePagination: 'server',
                    ajaxOptions: common.bootstrapTableAjaxOtions,
                    responseHandler: function (res) {
                        return res.info;
                    },
//                    height: common.getTableHeight(),
                    columns: [
                        common.BTRowFormatWithIndex('NO.'),
                        common.BTRowFormat('order_so_code', '业务号'),
                        common.BTRowFormat('order_arrival_time', '到厂时间'),
                        common.BTRowFormat('drivers', '可抢单司机')
                    ],
                    idField: 'order_id',
                    uniqueId: 'order_id',
                    striped: true,
                    locale: 'zh-CN'
                });
                common.changeTableClass($table2)
            }

            function getInit() {
                initTable1();
                initTable2()
            }

            getInit()
        },
        methods: {
            search: function (event) {
                $('#sOrderTable').bootstrapTable('refresh');
            },
            tabClick(tab, event) {
                $('#sOrderTable').bootstrapTable('refresh');
            }
        }
    }
</script>
<style scoped>
</style>