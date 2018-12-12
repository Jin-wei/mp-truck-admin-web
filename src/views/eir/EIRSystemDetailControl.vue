<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a href="javascript:history.back();">EIR查询和打单</a></li>
            <li class="active">EIR打单结果</li>
        </ol>
        <!-- end breadcrumb -->
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <div class="panel-heading-btn">
                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default"
                       data-click="panel-expand"><i class="fa fa-expand"></i></a>
                </div>
                <h4 class="panel-title">筛选</h4>
            </div>
            <div class="panel-body">
                <div class="row">
                    <div class="col-sm-3">
                        <select class="form-control select2" id="owner_code" data-placeholder="请选择船公司(必选)"></select>
                    </div>
                    <div class="col-sm-3">
                        <input class="form-control" id="order_code" placeholder="请输入订舱号码(必填)" v-model="bookNo">
                    </div>
                    <div class="col-sm-3">
                        <input class="form-control" id="so_code" placeholder="请输入业务号(非必填)" v-model="soCode">
                    </div>
                </div>
            </div>

            <div class="panel-footer text-right">
                <button class="btn btn-info" @click="getList">筛选</button>
            </div>
        </div>
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <div class="panel-heading-btn">
                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default"
                       data-click="panel-expand"><i class="fa fa-expand"></i></a>
                </div>
                <h4 class="panel-title">EIR订单结果列表</h4>
            </div>
            <div class="panel-body auto-height">
                <div>
                    <table id="orderTable"></table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    const common = require('commonFunc');
    const apiUrl = '/api/core/order/eir?method=';
    import bus from '../../assets/js/eventBus';

    export default {
        data: function () {
            return {
                pagePara: {},
                workRow: {},
                orderList: [],
                queryData: {},
                ownerCode: '',
                bookNo: '',
                soCode: ''

            }
        },
        name: 'EIRSystemDetailControl',
        mounted: function () {
            let _self = this;
            let $table = $('#orderTable');
            _self.queryData = _self.$route.query;
            if (Object.keys(_self.queryData).length > 0) {
                _self.ownerCode = _self.queryData.OWNER_CODE;
                _self.bookNo = _self.queryData.BOOKING_NO;
            }

            window.tableEvents = {
                'click .order': function (e, value, row, index) {
                    _self.$router.push({
                        path: '/order/CreateOrderControl',
                        query: {
                            CERTIFICATE_NO: row.CERTIFICATE_NO,
                            CONTA_NO: row.CONTA_NO,
                            BOOKING_NO: row.BOOKING_NO,
                            OWNER_CODE: _self.ownerCode,
                            CONTA_SIZE: row.CONTA_SIZE,
                            CONTA_TYPE: row.CONTA_TYPE,
                            FINAL_PICKUP_NAME: row.FINAL_PICKUP_NAME,
                            FINAL_RETURN_NAME: row.FINAL_RETURN_NAME
                        }
                    })
                },
                'click .download': function (e, value, row, index) {
                    if (row.URL_BOTH && row.URL_BOTH !== '') {
                        let NEW_UTL_BOTH = removeSI(row.URL_BOTH);
                        let url = 'http://api.cmclink.com:8087/getfile?filepath=' + NEW_UTL_BOTH;
                        //let url = 'http://api.cmclink.com:8087/getfile?filepath=' + row.URL_BOTH;
                        window.open(url);
                    }
                }
            };

            function downloadFormatter(value, row, index) {
                if (row.URL_BOTH && row.URL_BOTH !== '') {
                    return [
                        '<a class="download">下载</a>'
                    ].join('')
                } else {
                    return [
                        '未打单'
                    ].join('')
                }

            }

            /**去除URL_BOTH 中.png前面的后3为_SI,
             * 例如：ONE_SZPUE5015800-CE1B_70465287_SI.png->ONE_SZPUE5015800-CE1B_70465287.png
             * by weijin
             */
            function removeSI(URL_BOTH) {
                let URL_BOTH_ARRAY = URL_BOTH.split('.');
                if(URL_BOTH_ARRAY[0].slice(-3) === '_SI'){
                    let temy_url = URL_BOTH_ARRAY[0].substring(0,URL_BOTH_ARRAY[0].length - 3);
                    return temy_url + '.' + URL_BOTH_ARRAY[1];
                }else {
                    return URL_BOTH;
                }
            }

            function operateFormatter(value, row, index) {
                if (row.ORDER_DONE === 1) {
                    return ['<a class="btn btn-primary btn-xs m-r-5" disabled="true">已发单</a>'].join('')
                } else {
                    return [
                        '<a class="btn btn-primary btn-xs m-r-5 order">发单</a>'
                    ].join('')
                }
            }

            function ownerCodeFormatter() {
                return _self.ownerCode;
            }

            function ownerNameFormatter(value, row, index) {
                for (let c of _self.pagePara.carrierSet) {
                    if (_self.ownerCode === c.id) {
                        return c.text;
                    }
                }
            }

            function containerFormatter(value, row, index) {
                return (row.CONTA_SIZE + row.CONTA_TYPE);
            }

            function initTable() {
                $table.bootstrapTable({
                    columns: [
                        common.BTRowFormatWithIndexFooter('NO.'),
                        common.BTRowFormat('VESSEL_NAME', '船名'),
                        common.BTRowFormat('VOYAGE', '航次'),
                        common.BTRowFormatWithFormatter('OWNER_CODE', '船公司中文名', ownerNameFormatter),
                        common.BTRowFormat('BOOKING_NO', '订舱单号'),
                        common.BTRowFormat('CERTIFICATE_NO', '业务号'),
                        common.BTRowFormatWithFormatter('', '箱型', containerFormatter),
                        common.BTRowFormat('FINAL_PICKUP_NAME', '提柜地点'),
                        common.BTRowFormat('STATUS_NAME', '数据状态'),
                        common.BTRowFormat('FINAL_RETURN_NAME', '还柜地点'),
                        common.BTRowFormat('BUSINE_COST', '打单费'),
                        common.BTRowFormat('SERVICE_COST', '服务费'),
                        common.actFormatter('URL_BOTH', downloadFormatter, tableEvents),
                        common.actFormatter('operate', operateFormatter, tableEvents)
                    ],
                    idField: 'EIR_DETAIL_SEQ',
                    uniqueId: 'EIR_DETAIL_SEQ',
                    striped: true,
                    clickToSelect: true,
                    locale: 'zh-CN'
                });
                common.changeTableClass($table)
            }

            async function getInit() {
                try {
                    let response = await _self.$http.post(apiUrl + 'i', {});
                    _self.pagePara = response.data.info;
                    common.initSelect2($('#owner_code'), _self.pagePara.carrierSet);
                    $('#owner_code').val(_self.ownerCode).trigger('change');

                } catch (error) {
                    common.dealErrorCommon(_self, error);
                }
            }

            async function initPage() {
                await getInit();
                initTable();
                bus.$emit("subMenuChanged", "subMenuChanged");
                if (Object.keys(_self.queryData).length > 0) {
                    await _self.getList();
                }
            }

            initPage()
        },
        methods: {
            search: function () {
                $('#orderTable').bootstrapTable('refresh');
            },
            getList: async function () {
                let _self = this;
                _self.ownerCode = common.getSelect2Val('owner_code');
                if (_self.ownerCode && _self.bookNo) {
                    try {
                        let param = {
                            OWNER_CODE: _self.ownerCode,
                            BOOKING_NO: _self.bookNo,
                            is_result: '1'
                        };
                        let response = await _self.$http.post(apiUrl + 'lm', param);
                        if (response.data.errno == 0) {
                            _self.orderList = [];
                            if (Object.keys(_self.queryData).length > 0) {
                                if (_self.soCode) {
                                    for (let o of response.data.info.rows) {
                                        if (o.STATUS >= 4) {
                                            if (_self.soCode && o.CERTIFICATE_NO === _self.soCode) {
                                                _self.orderList.push(o);
                                            }
                                        }
                                    }
                                } else if (_self.queryData.CERTIFICATE_NO) {
                                    for (let o of response.data.info.rows) {
                                        if (o.STATUS >= 4) {
                                            _self.orderList.push(o);
                                        }
                                    }
                                } else {
                                    _self.orderList = response.data.info.rows;
                                }
                            } else {
                                if (_self.soCode) {
                                    for (let o of response.data.info.rows) {
                                        if (o.STATUS >= 4) {
                                            if (_self.soCode && o.CERTIFICATE_NO === _self.soCode) {
                                                _self.orderList.push(o);
                                            }
                                        }
                                    }
                                } else {
                                    for (let o of response.data.info.rows) {
                                        if (o.STATUS >= 4) {
                                            _self.orderList.push(o);
                                        }
                                    }
                                }
                            }
                            $('#orderTable').bootstrapTable('load', {
                                data: _self.orderList
                            });
                        } else {
                            common.dealWarningCommon(response.data.msg);
                        }
                    } catch (error) {
                        common.dealErrorCommon(_self, error);
                    }
                } else if (!_self.ownerCode) {
                    _self.$message({
                        message: '请选择船公司代码',
                        type: 'warning'
                    });
                } else if (!_self.bookNo) {
                    _self.$message({
                        message: '请输入订舱单号',
                        type: 'warning'
                    });
                }

            }

        }
    }
</script>
<style scoped>
</style>