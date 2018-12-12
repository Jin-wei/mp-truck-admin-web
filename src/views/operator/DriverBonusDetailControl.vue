<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:history.back();">运营管理</a></li>
            <li class="active">自营司机月绩效评分详情</li>
        </ol>
        <!-- end breadcrumb -->
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <h4 class="panel-title">自营司机月绩效评分查询</h4>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-sm-3">
                        <input class="form-control" id="order_so_code" placeholder="请输入业务号">
                    </div>
                    <div class="col-sm-3">
                        <input class="form-control" id="order_factory_name" placeholder="请输入工厂名称">
                    </div>
                    <div class="col-sm-3">
                        <input class="form-control" id="order_factory_address" placeholder="请输入工厂地址">
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
                <h4 class="panel-title">自营司机月绩效评分详情列表</h4>
            </div>
            <div class="panel-body auto-height">
                <table id="orderTable"></table>
            </div>
        </div>
    </div>
</template>
<script>
    const common = require('commonFunc');
    const apiUrl = '/api/core/bonus/BonusMain?method=';

    export default {
        data: function () {
            return {
                pagePara: {},
                workRow: {}
            }
        },
        name: 'DriverBonusDetailControl',
        mounted: function () {
            let _self = this;
            let $table = $('#orderTable');

            function queryParams(params) {
                params.order_taker_id = _self.$route.query.driverUserId;
                if ($('#order_so_code').val()) {
                    params.order_so_code = $('#order_so_code').val();
                }
                if ($('#order_factory_name').val()) {
                    params.order_factory_name = $('#order_factory_name').val();
                }
                if ($('#order_factory_address').val()) {
                    params.order_factory_address = $('#order_factory_address').val();
                }
                return JSON.stringify(params);
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
                        common.BTRowFormat('order_history_so_code', '业务号'),
                        common.BTRowFormat('order_history_factory_name', '工厂名称'),
                        common.BTRowFormat('order_history_factory_address', '工厂地址'),
                        common.BTRowFormat('bonus_history_reason_desc', '违规操作名称'),
                        common.BTRowFormat('bonus_history_change', '违规分数')
                    ],
                    idField: 'bonus_history_id',
                    uniqueId: 'bonus_history_id',
                    pagination: true,
                    pageList: [10, 15, 25, 50, 100],
                    locale: 'zh-CN',
                    detailView: true,
                    onExpandRow: function (index, row, $detail) {
                        expandTable(row, $detail)
                    },
                });
                common.changeTableClass($table)
            }

            function expandTable(row, $detail) {
                let $el = $detail.html('<table></table>').find('table')
                let data = [];
                let obj = {};
                obj.arrival_time = row.order_history_arrival_time;
                obj.new_order_time = row.take_new_order_time;
                for (let h of row.history) {
                    if (h.order_history_state == 21) {
                        obj.state21 = h.created_at;
                    } else if (h.order_history_state == 81) {
                        obj.state81 = h.created_at;
                    } else if (h.order_history_state == 22) {
                        obj.state22 = h.created_at;
                    } else if (h.order_history_state == 26) {
                        obj.state26 = h.created_at;
                    } else if (h.order_history_state == 27) {
                        obj.state27 = h.created_at;
                    } else if (h.order_history_state == 28) {
                        obj.state28 = h.created_at;
                    }
                }
                data.push(obj);
                $el.bootstrapTable({
                    data: data,
                    columns: [
                        common.BTRowFormatWithFW('state21', '接受订单时间', value => {
                            return common.dateFormat(value);
                        }),
                        common.BTRowFormatWithFW('state81', '拒接订单时间', value => {
                            return common.dateFormat(value);
                        }),
                        common.BTRowFormatWithFW('state22', '开始运输时间', value => {
                            return common.dateFormat(value);
                        }),
                        common.BTRowFormatWithFW('arrival_time', '订单到厂时间', value => {
                            return common.dateFormat(value);
                        }),
                        common.BTRowFormatWithFW('state26', '实际到厂时间', value => {
                            return common.dateFormat(value);
                        }),
                        common.BTRowFormatWithFW('state27', '离场时间', value => {
                            return common.dateFormat(value);
                        }),
                        common.BTRowFormatWithFW('new_order_time', '接受新订单时间', value => {
                            return common.dateFormat(value);
                        }),
                        common.BTRowFormatWithFW('state28', '还柜时间', value => {
                            return common.dateFormat(value);
                        }),
                    ]
                })
            }

            function getInit() {
                _self.$http.post(apiUrl + 'i', {}).then((response) => {
                    _self.pagePara = response.data.info;
                }, (response) => {
                    common.dealErrorCommon(_self, response)
                })
            }

            function initPage() {
                // getInit();
                initTable();
            }

            initPage()
        },
        methods: {
            search: function (event) {
                $('#orderTable').bootstrapTable('refresh');
            },
            tabClick(tab, event) {
                $('#orderTable').bootstrapTable('refresh');
            }
        }
    }
</script>
<style scoped>
</style>