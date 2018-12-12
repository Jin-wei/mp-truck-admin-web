<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:;">对账单管理</a></li>
            <li class="active">客户对账单</li>
        </ol>
        <!-- end breadcrumb -->
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <div class="panel-heading-btn">
                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default"
                       data-click="panel-expand"><i class="fa fa-expand"></i></a>
                </div>
                <h4 class="panel-title">客户对账单查询</h4>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-sm-3">
                        <input class="form-control" id="order_customer_name" placeholder="请输入客户名称">
                    </div>
                    <div class="col-sm-3">
                        <input class="form-control" id="order_factory_name" placeholder="请输入工厂名称">
                    </div>
                    <div class="col-sm-3">
                        <input class="form-control" id="order_operator_name" placeholder="请输入操作员名称">
                    </div>
                    <div class="col-sm-3">
                        <input class="form-control" id="order_booking_no" placeholder="请输入订舱单">
                    </div>
                </div>
                <div class="row" style="margin-top: 10px">
                    <div class="col-sm-3">
                        <input class="form-control" id="order_container_code" placeholder="请输入柜号">
                    </div>
                    <div class="col-sm-3">
                        <input class="form-control" id="order_vehicle_num" placeholder="请输入车牌号">
                    </div>
                    <!--<div class="col-sm-3">-->
                        <!--<select class="form-control" id="order_container_size">-->
                            <!--<option value="">请选择柜尺寸</option>-->
                            <!--<option v-for="s in pagePara.containerSizeSet" v-bind:value="s.id">{{s.text}}</option>-->
                        <!--</select>-->
                    <!--</div>-->
                    <!--<div class="col-sm-3">-->
                        <!--<select class="form-control" id="order_container_shape">-->
                            <!--<option value="">请选择柜型</option>-->
                            <!--<option v-for="s in pagePara.containerShapeSet" v-bind:value="s.id">{{s.text}}</option>-->
                        <!--</select>-->
                    <!--</div>-->
                    <div class="col-sm-3">
                        <input type="text" class="form-control" id='order_completed_at_start'
                               placeholder="完成时间起点"/>
                    </div>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" id='order_completed_at_end'
                               placeholder="完成时间终点"/>
                    </div>
                </div>
            </div>

            <div class="panel-footer text-right">
                <button class="btn btn-info" @click="search">查询</button>
                <button class="btn btn-info" @click="exportBasicBill">导出</button>
            </div>
        </div>
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <div class="panel-heading-btn">
                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default"
                       data-click="panel-expand"><i class="fa fa-expand"></i></a>
                </div>
                <h4 class="panel-title">客户对账单列表</h4>
            </div>
            <div class="panel-body auto-height">
                <!--<div class="text-right">-->
                <!--<button class="btn btn-info" @click="dataExport">导出</button>-->
                <!--</div>-->
                <div style="margin-top: 10px">
                    <el-tabs v-model="tabSelect" type="border-card" @tab-click="tabClick">
                        <el-tab-pane label="近三个月数据" name="1"></el-tab-pane>
                        <el-tab-pane label="历史数据" name="2"></el-tab-pane>
                        <div>
                            <table id="orderTable"></table>
                        </div>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    const common = require('commonFunc');
    const apiUrl = '/api/core/bill/BasicBill?method=';

    export default {
        data: function () {
            return {
                pagePara: {},
                workRow: {},
                queryParams: {},
                tabSelect: "1",
                startDate: null
            }
        },
        name: 'CustomerBillControl',
        mounted: function () {
            let _self = this;
            let $table = $('#orderTable');

            function queryParams(params) {
                if ($('#order_customer_name').val()) {
                    params.order_customer_name = $('#order_customer_name').val();
                }
                if ($('#order_factory_name').val()) {
                    params.order_factory_name = $('#order_factory_name').val();
                }
                if ($('#order_operator_name').val()) {
                    params.order_operator_name = $('#order_operator_name').val();
                }
                if ($('#order_booking_no').val()) {
                    params.order_booking_no = $('#order_booking_no').val();
                }
                if ($('#order_container_code').val()) {
                    params.order_container_code = $('#order_container_code').val();
                }
                if ($('#order_container_size').val()) {
                    params.order_container_size = $('#order_container_size').val();
                }
                if ($('#order_arrival_time_start').val()) {
                    params.order_arrival_time_start = $('#order_arrival_time_start').val();
                }
                if ($('#order_container_size').val()) {
                    params.order_container_size = $('#order_container_size').val();
                }
                if ($('#order_container_shape').val()) {
                    params.order_container_shape = $('#order_container_shape').val();
                }
                if ($('#order_vehicle_num').val()) {
                    params.order_vehicle_num = $('#order_vehicle_num').val();
                }
                if ($('#order_completed_at_start').val()) {
                    params.order_completed_at_start = $('#order_completed_at_start').val();
                } else {
                    if (_self.startDate) {
                        params.order_completed_at_start = _self.startDate;
                    }
                }
                if ($('#order_completed_at_end').val()) {
                    params.order_completed_at_end = $('#order_completed_at_end').val();
                }
                params.order_state = 90;
                params.bill_type = 1;
                _self.queryParams = params;
                return JSON.stringify(params);
            }

            function totalFeeFormatter(value, row, index) {
                let transport = row.order_expense_price_income || 0;
                for (let k in row) {
                    if (k.startsWith('fee'))
                        transport += row[k] || 0;
                }
                return transport;
            }

            function sumFormatter(data) {
                let field = this.field;
                console.log(data);
                return data.reduce(function (sum, row) {
                    return sum + (+row[field]);
                }, 0);
            }

            function merge_footer() {
                let footer_tbody = $('.fixed-table-footer table tbody');
                let footer_tr = footer_tbody.find('>tr');
                let footer_td = footer_tr.find('>td');
                let footer_td_1 = footer_td.eq(0);
                let footer_td_2 = footer_td.eq(1);
                //第一列为:'平均分',第二列为平局分内容
                for (var i = 1; i < footer_td.length - 1; i++) {
                    footer_td.eq(i).hide();
                }
                footer_td_1.attr('width', 10).show();
//                footer_td_2.val(footer_td.eq(footer_td.length - 1).val()).show();
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
                        common.BTRowFormatWithIndexFooter('NO.'),
                        common.BTRowFormat('order_booking_no', '订舱单号'),
                        common.BTRowFormat('order_container_code', '柜号'),
                        common.BTRowFormat('order_seal_code', '铅封号'),
                        common.BTRowFormat('order_container_weight', '柜重'),
                        common.BTRowFormatWithFW('order_completed_at', '完成时间', value => {
                            return common.dateFormat(value, 'min');
                        }),
                        common.BTRowFormat('order_customer_name', '客户名称'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_factory_id', '工厂名称', 'factorySet'),
                        common.BTRowFormat('order_factory_address', '工厂地址'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_pick_stat_id', '提柜地点', 'pStationSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_return_stat_id', '还柜地点', 'rStationSet'),
                        common.BTRowFormat('order_operator_name', '操作员'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_container_size', '柜尺寸', 'containerSizeSet'),
                        common.BTRowFormatEdSelect2Disabled(_self, 'order_container_shape', '柜型', 'containerShapeSet'),
                        common.BTRowFormat('order_vehicle_num', '车牌号'),
                        common.BTRowFormat('order_expense_price_income', '运费'),
                        common.BTRowFormat('fee1001', '约柜费'),
                        common.BTRowFormat('fee1002', '过磅费'),
                        common.BTRowFormat('fee1003', '压夜费'),
                        common.BTRowFormat('fee1004', '高速费'),
                        common.BTRowFormat('fee1005', '异提费'),
                        common.BTRowFormat('fee1006', '返空费'),
                        common.BTRowFormat('fee1007', '两地装'),
                        common.BTRowFormat('fee1999', '其他费用'),
                        common.BTRowFormatFooter('row_amount', '合计费用', sumFormatter)
                    ],
                    showFooter: true,
                    idField: 'order_id',
                    uniqueId: 'order_id',
                    striped: true,
                    clickToSelect: true,
                    pagination: true,
                    pageList: [10, 15, 25, 50, 100],
                    locale: 'zh-CN',
                    onPostBody: function () {
                        //合并页脚
                        merge_footer();
                    }
                });
                common.changeTableClass($table)
            }

            function getInit() {
                _self.$http.post(apiUrl + 'i', {}).then((response) => {
                    _self.pagePara = response.data.info;
                    common.initSelect2($('#order_customer_id'), _self.pagePara.customerSet);
                    initTable();
                }, (response) => {
                    common.dealErrorCommon(_self, response)
                })
            }

            function initPage() {
                _self.startDate = _self.calculateDate();
                getInit();
                common.initDatepicker($('#order_completed_at_start'));
                common.initDatepicker($('#order_completed_at_end'));

            }

            initPage()
        },
        methods: {
            search: function (event) {
                $('#orderTable').bootstrapTable('refresh');
            },
            dataExport: function (event) {

            },
            calculateDate: function () {
                let _self = this;
                let now = new Date();
                let time = now.getTime() - 3 * 30 * 24 * 3600 * 1000;
                return new Date(time);
            },
            tabClick: function (event) {
                let _self = this;
                if (_self.tabSelect == 1) {
                    _self.startDate = _self.calculateDate();
                } else {
                    _self.startDate = null;
                }
                $('#orderTable').bootstrapTable('refresh');
            },
            exportBasicBill: function (event) {
                let _self = this;
                this.$http.post(apiUrl + 'ex', _self.queryParams).then(response => {
                    let downUrl = response.data.info;
                    window.location.href = window.location.protocol + '//' + window.location.host + downUrl;
                }, (response) => {
                    common.dealErrorCommon(this, response)
                });
            }
        }
    }
</script>
<style scoped>
    .top {
        margin-top: 10px;
    }
</style>