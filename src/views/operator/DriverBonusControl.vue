<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:;">运营管理</a></li>
            <li class="active">自营司机月绩效评分</li>
        </ol>
        <!-- end breadcrumb -->
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <h4 class="panel-title">自营司机月绩效评分查询</h4>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-sm-3">
                        <input class="form-control" id="search_text" placeholder="搜索司机姓名、手机号">
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
                <h4 class="panel-title">自营司机月绩效评分列表</h4>
            </div>
            <div class="panel-body auto-height">
                <el-date-picker
                        v-model="selectDate"
                        type="month"
                        placeholder="请选择年-月" @change="datePickerClick">
                </el-date-picker>
                <div style="margin-top: 10px">
                    <table id="orderTable"></table>
                </div>
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
                workRow: {},
                tabSelect: "1", //本月数据、历史数据
                selectDate: ''
            }
        },
        name: 'DriverBonusControl',
        mounted: function () {
            let _self = this;
            let $table = $('#orderTable');
            _self.selectDate = new Date();

            function queryParams(params) {
                params.year = _self.selectDate.getFullYear();
                params.month = _self.selectDate.getMonth() + 1;
                if ($('#search_text').val()) {
                    params.search_text = $('#search_text').val();
                }
                return JSON.stringify(params);
            }

            window.tableEvents = {
                'click .detail': function (e, value, row, index) {
                    _self.$router.push({
                        path: '/operator/DriverBonusDetail',
                        query: {
                            driverUserId: row.driver_user_id
                        }
                    })
                }
            };

            function operateFormatter(value, row, index) {
                return [
                    '<a class="btn btn-primary btn-xs m-r-5 detail">详情</a>'
                ].join('')
            }

            function initTable() {
                $table.bootstrapTable({
                    method: 'POST',
                    url: apiUrl + 'qm',
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
                        common.BTRowFormat('driver_phone', '司机账号'),
                        common.BTRowFormat('total', '当前评分'),
                        common.actFormatter('operate', operateFormatter, tableEvents)
                    ],
                    idField: 'bonus_history_id',
                    uniqueId: 'bonus_history_id',
                    striped: true,
                    pagination: true,
                    pageList: [10, 15, 25, 50, 100],
                    locale: 'zh-CN'
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
            datePickerClick: function () {
                let year = this.selectDate.getFullYear();
                let month = this.selectDate.getMonth() + 1;
                console.log(year);
                console.log(month);
                $('#orderTable').bootstrapTable('refresh');
            },
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