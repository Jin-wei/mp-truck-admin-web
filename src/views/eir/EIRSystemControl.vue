<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:;">EIR打单管理</a></li>
            <li class="active">EIR查询和打单</li>
        </ol>
        <!-- end breadcrumb -->
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <div class="panel-heading-btn">
                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default"
                       data-click="panel-expand"><i class="fa fa-expand"></i></a>
                </div>
                <h4 class="panel-title">查询</h4>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-sm-3">
                        <select class="form-control select2" id="owner_code" data-placeholder="请选择船公司(必选)"></select>
                    </div>
                    <div class="col-sm-3">
                        <input class="form-control" v-model="bookNo" placeholder="请输入订舱号码(必填)">
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
                    <button class="btn btn-primary btn-xs" v-on:click="makeOrders">打单</button>
                    <button class="btn btn-primary btn-xs" v-on:click="clear">清空</button>
                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default"
                       data-click="panel-expand"><i class="fa fa-expand"></i></a>
                </div>
                <h4 class="panel-title">EIR查询和打单列表</h4>
            </div>
            <div class="panel-body auto-height">
                <div>
                    <table id="orderTable"></table>
                    <p class="margin-top-10">所有booking费，打单费:{{busine_cost}}  服务费:{{service_cost}}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    const common = require('commonFunc');
    const apiUrl = '/api/core/order/eir?method=';

    export default {
        data: function () {
            return {
                pagePara: {},
                workRow: {},
                orderList: [],
                ownerCode: '',
                bookNo: '',
                selectRows: [],
                busine_cost: 0,
                service_cost: 0
            }
        },
        name: 'EIRSystemControl',
        mounted: function () {
            let _self = this;
            let $table = $('#orderTable');

            window.tableEvents = {
                'click .detail': async function(e, value, row, index) {
                    common.dealConfrimCommon("确认要打单?", async function () {
                        let param = {
                            OWNER_CODE: _self.ownerCode,
                            PRINT_TYPE: 1,
                            EIR_DETAIL_SEQ: row.EIR_DETAIL_SEQ,
                            APPOINTMENTID_OOCL: ''
                        };
                        let response = await _self.$http.post(apiUrl + 'p', param);
                        if (response.data.errno == 0) {
                            _self.$router.push({
                                path: '/eir/EIRSystemDetailControl',
                                query: {
                                    OWNER_CODE: _self.ownerCode,
                                    BOOKING_NO: _self.bookNo
                                }
                            })
                        } else {
                            common.dealWarningCommon(response.data.msg);
                        }
                    });
                }
            };
            function operateFormatter(value, row, index) {
                if (row.IS_CAN_PRINT == 1) {
                    return [
                        '<a class="btn btn-primary btn-xs m-r-5 detail">打单</a>'
                    ].join('');
                } else {
                    return '';
                }

            }
            function ownerCodeFormatter() {
                return _self.ownerCode;
            }
            function ownerNameFormatter(value, row, index) {
                for(let c of _self.pagePara.carrierSet) {
                    if (_self.ownerCode === c.id) {
                        return c.text;
                    }
                }
            }
            function boolFormatter(value, row, index) {
                return (value == 1 ? '是' : '否');
            }
            function containerFormatter(value, row, index) {
                return (row.CONTA_SIZE + row.CONTA_TYPE);
            }

            /**
             *redmine #6277
             *计算选中的打单费和服务费 by weijin
             */
            // table formatter checkbox disabled
            // STATUS 1-未缴费，2-已缴费，3-已捆绑，4 已打印，5-已授权，6-已挂失，8-已提空，-1-已撤销，-2-已删除
            function checkboxDisabled(value, row, index) {
                if (row.STATUS === 1) {
                    return {disabled: false};
                } else {
                    return {disabled: true};
                }
            }

            //计算选中的打单费和服务费
            function sumCheckPrice() {
                _self.busine_cost = 0;
                _self.service_cost = 0;
                let l = _self.selectRows.length;
                for (let i = l; i < l; i--) {
                    _self.busine_cost = _self.busine_cost + Number(_self.selectRows[i].BUSINE_COST);
                    _self.service_cost = _self.service_cost + Number(_self.selectRows[i].SERVICE_COST);
                }
            }

            function initTable() {
                $table.bootstrapTable({
                    columns: [
                        {
                            field: '',
                            checkbox: true,
                            formatter : checkboxDisabled
                        },
                        common.BTRowFormatWithIndex('NO.'),
                        common.BTRowFormat('VESSEL_NAME', '船名'),
                        common.BTRowFormat('VOYAGE', '航次'),
                        common.BTRowFormatWithFormatter('OWNER_CODE', '船公司中文名', ownerNameFormatter),
                        common.BTRowFormat('BOOKING_NO', '订舱单号'),
                        common.BTRowFormatWithFormatter('', '箱型', containerFormatter),
                        common.BTRowFormat('FINAL_PICKUP_NAME', '提柜地点'),
                        common.BTRowFormat('STATUS_NAME', '数据状态'),
                        common.BTRowFormat('FINAL_RETURN_NAME', '还柜地点'),
                        common.BTRowFormat('BUSINE_COST', '打单费'),
                        common.BTRowFormat('SERVICE_COST', '服务费')
                    ],
                    idField: 'EIR_DETAIL_SEQ',
                    uniqueId: 'EIR_DETAIL_SEQ',
                    striped: true,
                    clickToSelect: true,
                    locale: 'zh-CN',
                    onCheckAll: function (rows) {
                        for (let i = 0; i < rows.length; i++) {
                            _self.selectRows.push(rows[i])
                        }
                        sumCheckPrice();
                    },
                    onUncheckAll: function (rows) {
                        _self.selectRows = [];
                        sumCheckPrice();
                    },
                    onCheck: function (row, $element) {
                        _self.selectRows.push(row);
                        sumCheckPrice();
                    },
                    onUncheck: function (row, $element) {
                        _self.selectRows.splice($.inArray(row, _self.selectRows), 1);
                        sumCheckPrice();
                    },
                    onPageChange: function (number, size) {
                        _self.selectRows = []
                    }
                });
                common.changeTableClass($table)
            }
            async function getInit() {
                try {
                    let response = await _self.$http.post(apiUrl + 'i', {});
                    _self.pagePara = response.data.info;
                    common.initSelect2($('#owner_code'), _self.pagePara.carrierSet);
//                    $('#owner_code').val('EVG').trigger('change');
                } catch (error) {
                    common.dealErrorCommon(_self, error);
                }
            }
            async function initPage() {
                await getInit();
                initTable();
            }
            initPage()
        },
        methods: {
            search: async function () {
                let _self = this;
                _self.selectRows = [];
                _self.busine_cost = 0;
                _self.service_cost = 0;
                _self.ownerCode = common.getSelect2Val('owner_code');
                if (_self.ownerCode && _self.bookNo) {
                    try {
                        let param = {
                            OWNER_CODE: _self.ownerCode,
                            BOOKING_NO: _self.bookNo
                        };
                        let response = await _self.$http.post(apiUrl + 'lm', param);
                        if (response.data.errno == 0) {
                            _self.orderList = response.data.info.rows;
                            $('#orderTable').bootstrapTable('load', {
                                data: _self.orderList
                            });
                        } else {
                            common.dealWarningCommon(response.data.msg);
                        }
                    } catch (error) {
                        common.dealErrorCommon(_self, error);
                    }
                } else if (!_self.ownerCode){
                    _self.$message({
                        message: '请选择船公司代码',
                        type: 'warning'
                    });
                } else if (!_self.bookNo){
                    _self.$message({
                        message: '请输入订舱单号',
                        type: 'warning'
                    });
                }
            },
            makeOrders: async function () {
                let _self = this;
                if (_self.selectRows.length <= 0) {
                    _self.$message({
                        message: '请选择要打的单！',
                        type: 'warning'
                    });
                    return;
                }
                common.dealConfrimCommon("确认要打单?", async function () {
                    let orders = [];
                    for (let e of _self.selectRows) {
                        if (e.STATUS == 1) {
                            orders.push({
                                OWNER_CODE: _self.ownerCode,
                                PRINT_TYPE: 1,
                                EIR_DETAIL_SEQ: e.EIR_DETAIL_SEQ,
                                APPOINTMENTID_OOCL: ''
                            })
                        }
                    }
                    let response = await _self.$http.post(apiUrl + 'pb', {orders: orders});
                    if (response.data.errno == 0) {
                        //鹏海运接口返回处理
                        let item_array = response.data.info.result;
                        let successCount = 0;//打单成功数量
                        let falseCount = 0;//打单失败数量
                        for (let key in item_array) {
                            //RESULT_CODE 为1处理成功否则失败
                            let RESULT_CODE_NAME = '-RESULT_CODE';
                            let RESULT_CODE = item_array[key].ITEM[0][RESULT_CODE_NAME];
                            if (RESULT_CODE === 1) {
                                successCount++;
                            } else {
                                falseCount++;
                            }
                        }
                        common.dealPromptCommon(`打单成功数量：${successCount}, 失败数量：${falseCount}`);

                        _self.clear();
                        _self.$router.push({
                            path: '/eir/EIRSystemDetailControl',
                            query: {
                                OWNER_CODE: _self.ownerCode,
                                BOOKING_NO: _self.bookNo
                            }
                        })
                    } else {
                        common.dealWarningCommon(response.data.msg);
                    }
                });
            },
            clear: async function () {
                let _self = this;
                _self.selectRows = [];
                _self.busine_cost = 0;
                _self.service_cost = 0;
                $('#orderTable').bootstrapTable('uncheckAll');
            }
        }
    }
</script>
<style scoped>
    .margin-top-10{
        margin-top: 10px;
    }
</style>