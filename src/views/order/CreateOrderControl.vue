<!-- 创建订单 -->
<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li><a @click="goBack">订单管理</a></li>
            <li class="active">订单录入</li>
        </ol>
        <!-- end breadcrumb -->
        <div class="row">
            <div class="col-md-12">
                <div class="panel panel-inverse">
                    <div class="panel-heading">
                        <div class="panel-heading-btn">
                            <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default"
                               data-click="panel-expand"><i class="fa fa-expand"></i></a>
                        </div>
                        <h4 class="panel-title">订单录入
                            <span style="margin-left: 20px">订单状态: {{order.order_state | stateFilter}}</span>
                            <span style="margin-left: 20px" v-show="order.order_level">优劣单: {{order.order_level | orderLevelFilter}}</span>
                        </h4>
                    </div>
                    <form @submit.prevent="saveOrder" id="orderForm">
                        <div class="panel-body">
                            <div class="info">
                                <div class="row">
                                    <h4 class="col-sm-6">订单信息</h4>
                                    <div class="form-group col-sm-2"></div>
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">订单来源</span>
                                            <select class="form-control select2" id="order_source"
                                                    data-parsley-required="true" @change="changeSource"></select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">工厂名称</span>
                                            <select class="form-control select2" id="order_factory_id"
                                                    data-parsley-required="true"></select>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">客户名称</span>
                                            <select class="form-control select2" id="order_customer_id"
                                                    data-parsley-required="true"></select>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">操&nbsp;&nbsp;作&nbsp;&nbsp;员</span>
                                            <input class="form-control" placeholder="可根据工厂名称自动代入"
                                                   v-model="order.order_operator_name" data-parsley-required="true" >
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-sm-8">
                                        <div class="input-group">
                                            <span class="input-group-addon">工厂地址</span>
                                            <input class="form-control" id="order_factory_address"  placeholder="可根据工厂名称自动代入"
                                                   v-model="order.order_factory_address" >
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">联系电话</span>
                                            <input class="form-control"
                                                   v-model="order.customer_operator_phone" data-parsley-required="true" placeholder="可根据工厂名称自动代入">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">业&nbsp;&nbsp;务&nbsp;&nbsp;号</span>
                                            <input class="form-control" placeholder="请输入业务号(必填)"
                                                   v-model="order.order_so_code" data-parsley-required="true"
                                                   v-bind:readonly="checkObject(eirData) && !copy_order"
                                                   @blur="soCodeBlur">
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">提柜地点</span>
                                            <select class="form-control select2" id="order_pick_stat_id"
                                                    data-parsley-required="true"></select>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">还柜地点</span>
                                            <select class="form-control select2" id="order_return_stat_id"
                                                    data-parsley-required="true"></select>
                                        </div>
                                    </div>

                                </div>
                                <div class="row">
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">柜&nbsp;&nbsp;尺&nbsp;&nbsp;寸</span>
                                            <select class="form-control" id="order_container_size"
                                                    v-model="order.order_container_size" data-parsley-required="true"
                                                    @change="containerFeeChanged">
                                                <option value="">请选择柜尺寸(必选)</option>
                                                <option v-for="s in pagePara.containerSizeSet" v-bind:value="s.id">
                                                    {{s.text}}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">柜&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型</span>
                                            <select class="form-control" id="order_container_shape"
                                                    v-model="order.order_container_shape" data-parsley-required="true"
                                                    @change="containerFeeChanged">
                                                <option value="">请选择柜型(必选)</option>
                                                <option v-for="s in pagePara.containerShapeSet" v-bind:value="s.id">
                                                    {{s.text}}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">柜&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;重</span>
                                            <input class="form-control" v-model="order.order_container_weight" placeholder="请输入柜重(非必填)">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">船&nbsp;&nbsp;公&nbsp;&nbsp;司</span>
                                            <select class="form-control" id="order_carrier_id"
                                                    v-model="order.order_carrier_id" data-parsley-required="true">
                                                <option value="">请选择船公司(必选)</option>
                                                <option v-for="c in pagePara.carrierSet" v-bind:value="c.id">
                                                    {{c.text}}
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">到厂时间</span>
                                            <input class="form-control" placeholder="请选择到厂时间(必填)" id="order_arrival_time"
                                                   data-parsley-required="true" autocomplete="off">
                                        </div>
                                    </div>


                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">拿&nbsp;&nbsp;单&nbsp;&nbsp;号</span>
                                            <input class="form-control" v-model="order.order_fetch_code" placeholder="系统生成" readonly>
                                        </div>
                                    </div>

                                </div>


                                <div class="row">

                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">柜&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号</span>
                                            <input class="form-control" placeholder="请输入柜号(非必填)"
                                                   v-model="order.order_container_code">
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">封&nbsp;&nbsp;条&nbsp;&nbsp;号</span>
                                            <input class="form-control" placeholder="请输入封条号(非必填)"
                                                   v-model="order.order_seal_code">
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">订舱单号</span>
                                            <input class="form-control" v-model="order.order_booking_no" data-parsley-required="true"
                                                   placeholder="请输入订舱单号(非必填)">
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div class="info">
                                <h4>司机信息</h4>
                                <div class="row">
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">车&nbsp;&nbsp;牌&nbsp;&nbsp;号</span>
                                            <select class="form-control select2" id="order_vehicle_id"
                                                    v-bind:readonly="order_source === '0'"></select>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">车牌颜色</span>
                                            <select class="form-control select2" id="order_vehicle_color"></select>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">报关类型</span>
                                            <select class="form-control select2" id="order_clearance_type"></select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">司机姓名</span>
                                            <input class="form-control" placeholder="" v-model="order.order_taker_name"
                                                   readonly>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">司机电话</span>
                                            <input class="form-control" placeholder="" v-model="driver.driver_phone"
                                                   readonly>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-sm-12">
                                        <div class="input-group">
                                            <span class="input-group-addon">司机备注</span>
                                            <textarea placeholder="请输入需要备注的信息" rows="5" class="form-control"
                                                      v-model="order.order_remark"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="info">
                                <h4>运费信息</h4>
                                <div class="row">
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">客户价格</span>
                                            <input class="form-control" placeholder="请输入金额"
                                                   v-model="expense.order_expense_price_income">
                                            <span class="input-group-addon">元</span>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">产&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;值</span>
                                            <input class="form-control" placeholder="请输入金额"
                                                   v-model="expense.order_expense_price_cost">
                                            <span class="input-group-addon">元</span>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">司机提成</span>
                                            <input class="form-control" placeholder="请输入金额"
                                                   v-model="expense.order_expense_price_labour">
                                            <span class="input-group-addon">元</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">过&nbsp;&nbsp;路&nbsp;&nbsp;费</span>
                                            <input class="form-control" placeholder="请输入金额"
                                                   v-model="expense.order_expense_road_toll">
                                            <span class="input-group-addon">元</span>
                                        </div>
                                    </div>
                                    <div class="form-group col-sm-4">
                                        <div class="input-group">
                                            <span class="input-group-addon">油&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量</span>
                                            <input class="form-control" placeholder="请输入体积"
                                                   v-model="expense.order_expense_oil_cost">
                                            <span class="input-group-addon">升</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="info" v-show="order_source === '1'">
                                <h4>附加费用</h4>
                                <div class="row">
                                    <div class="row fee-container" v-for="(ef , index) in order.cFees"
                                         style="margin-top: 10px">
                                        <div class="col-sm-3" v-if="index==0">
                                            <select class="form-control" :id="'cFees'+index"
                                                    @change="feeTypeChanged(index,'c')" v-bind:readonly="index==0"
                                                    v-model="order.cFees[index].extra_fee_type_id">
                                                <option value="">请选择类别</option>
                                                <option v-for="f in fees" v-bind:value="f.id">{{f.text}}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-sm-3" v-if="index>0">
                                            <select class="form-control" :id="'cFees'+index"
                                                    @change="feeTypeChanged(index,'c')" v-bind:readonly="index==0"
                                                    v-model="order.cFees[index].extra_fee_type_id">
                                                <option value="">请选择类别</option>
                                                <option v-for="f in chargeFees" v-bind:value="f.id">{{f.text}}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="col-sm-2">
                                            <div class="input-group">
                                                <input class="form-control"
                                                       v-model="order.cFees[index].extra_fee_amount">
                                                <span class="input-group-addon">元</span>
                                            </div>
                                        </div>
                                        <div class="col-sm-3" v-if="index===0">
                                            <select :id="'pFees'+index" class="form-control" v-bind:readonly="index==0"
                                                    @change="feeTypeChanged(index,'p')"
                                                    v-model="order.pFees[index].extra_fee_type_id">
                                                <option value="">请选择类别</option>
                                                <option v-for="f in fees" v-bind:value="f.id">{{f.text}}</option>
                                            </select>
                                        </div>
                                        <div class="col-sm-3" v-if="index>0">
                                            <select :id="'pFees'+index" class="form-control" v-bind:readonly="index==0"
                                                    @change="feeTypeChanged(index,'p')"
                                                    v-model="order.pFees[index].extra_fee_type_id">
                                                <option value="">请选择类别</option>
                                                <option v-for="f in payFees" v-bind:value="f.id">{{f.text}}</option>
                                            </select>
                                        </div>
                                        <div class="col-sm-2">
                                            <div class="input-group">
                                                <input class="form-control"
                                                       v-model="order.pFees[index].extra_fee_amount">
                                                <span class="input-group-addon">元</span>
                                            </div>
                                        </div>
                                        <div class="col-sm-2" v-show="index > 0">
                                            <a class="btn btn-info" @click="reduceFee(index)"><i
                                                    class="glyphicon glyphicon-minus"></i></a>
                                        </div>
                                    </div>
                                </div>
                                <div class="row" style="margin-left: 10px; margin-top: 10px">
                                    <a class="btn btn-info" @click="increaseFee"><i
                                            class="glyphicon glyphicon-plus"></i></a>
                                </div>
                                <div class="row" style="margin-top: 20px">
                                    <div class="form-group col-sm-12">
                                        <div class="input-group">
                                            <span class="input-group-addon">操作备注信息</span>
                                            <textarea placeholder="请输入需要备注的信息" rows="5" class="form-control"
                                                      v-model="order.order_operation_remark"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="info buttons">
                                <div class="row">
                                    <div class="form-group pull-right">
                                        <button type="submit" class="btn btn-info"
                                                v-show="!order_id||order.order_state == 90||edit_order||change_taker||_self.copy_order">
                                            保存
                                        </button>
                                        <a class="btn btn-info" @click="cancelOrder" v-if="!order_id">取消</a>
                                        <a class="btn btn-info" @click="cancelOrder" v-else>返回</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
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
                pagePara: '',
                order: {
                    cFees: [],//应收费用
                    pFees: [],//应付费用
                    order_container_shape:'',
                    order_container_size:'',
                    order_carrier_id:'',
                },
                order_id: null,
                expense: {},
                driver: {},
                bookingPrice: 0,
                copy_order: false,
                outer_order: 0,
                change_taker: false,
                showRemark: false,
                pStationSet: [],
                rStationSet: [],
                factorySet: [],
                customerSet: [],
                fees: [],
                chargeFees: [],//应收费用
                payFees: [],//应付费用
                order_source: '0',
                eirData: {},
                edit_order:false,
                order_fetch_code: ''//系统生成的拿单号
            }
        },
        name: 'OrderDetailControl',
        filters: {
            stateFilter: function (value) {
                if (value === 0 || !value) {
                    return '新订单';
                } else if (value === 11) {
                    return 'A类待抢单';
                } else if (value === 12) {
                    return 'B类待抢单';
                } else if (value === 13) {
                    return 'C类待抢单';
                } else if (value === 20 || value === 21 || value === 22
                    || value === 24 || value === 25 || value === 26
                    || value === 27 || value === 28) {
                    return '已处理';
                } else if (value === 80 || value === 81 || value === 88) {
                    return '已取消';
                } else if (value === 90) {
                    return '已完成';
                }
            },
            orderLevelFilter: function (value) {
                if (value == 11) {
                    return '优单';
                } else if (value == 12) {
                    return '劣单';
                }
            }
        },
        mounted: function () {
            let _self = this;
            _self.order_id = _self.$route.query.order_id;
            _self.copy_order = _self.$route.query.copy_order;
            _self.eirData = _self.$route.query;
            console.log(_self.eirData);
            _self.order.cFees = [
                {
                    extra_fee_type_id: '1001',
                    extra_fee_name: '约柜费(应收)',
                    extra_fee_amount: null
                }
            ];
            _self.order.pFees = [
                {
                    extra_fee_type_id: '2008',
                    extra_fee_name: '路桥费(应付)',
                    extra_fee_amount: null
                }
            ];

            async function getInit() {
                try {
                    let response = await _self.$http.post(apiUrl + 'i', {order_source: '1'});
                    _self.pagePara = response.data.info;
                    common.initSelect2PlaceholderNoWidth($('#order_customer_id'), _self.pagePara.customerSet,'可根据工厂名称自动代入');
                    common.initSelect2PlaceholderNoWidth($('#order_factory_id'), _self.pagePara.factorySet, '请选择工厂名称(必选)');
                    common.initSelect2PlaceholderNoWidth($('#order_pick_stat_id'), _self.pagePara.pStationSet, '请选择提柜地点(必选)');
                    common.initSelect2PlaceholderNoWidth($('#order_return_stat_id'), _self.pagePara.rStationSet, '请选择还柜地点(必选)');
                    common.initSelect2PlaceholderNoWidth($('#order_vehicle_id'), _self.pagePara.vehicleSet,'请选择车牌号(非必填)');
                    common.initSelect2PlaceholderNoWidth($('#order_source'), _self.pagePara.orderSourceSet, '请选择订单来源(必选)');
                    common.initSelect2($('#order_vehicle_color'), _self.pagePara.vehicleColorSet);
                    common.initSelect2($('#order_clearance_type'), _self.pagePara.clearanceSet);
                    $('#order_vehicle_color').val(_self.pagePara.vehicleColorSet[0].id).trigger('change');
                    $('#order_clearance_type').val(_self.pagePara.clearanceSet[0].id).trigger('change');
                    _self.fees = _self.pagePara.feeTypeSet;
                    for (let f of _self.fees) {
                        if (f.id.toString().startsWith('1') && f.id != 1001) {
                            _self.chargeFees.push(f);
                        } else if (f.id.toString().startsWith('2') && f.id != 2008) {
                            _self.payFees.push(f);
                        }
                    }

                    if (_self.checkObject(_self.eirData)) {
                        _self.order.order_so_code = _self.eirData.CERTIFICATE_NO;
                        _self.order.order_container_code = _self.eirData.CONTA_NO;
                        _self.order.order_booking_no = _self.eirData.BOOKING_NO;
                        for (let c of _self.pagePara.carrierSet) {
                            let index = c.text.indexOf('-');
                            let code = c.text.substr(index + 1);
                            if (_self.eirData.OWNER_CODE === code) {
                                _self.order.order_carrier_id = c.id;
                            }
                        }
                        for (let s of _self.pagePara.containerSizeSet) {
                            if (_self.eirData.CONTA_SIZE == s.text) {
                                _self.order.order_container_size = s.id;
                            }
                        }
                        for (let s of _self.pagePara.containerShapeSet) {
                            if (_self.eirData.CONTA_TYPE === s.text) {
                                _self.order.order_container_shape = s.id;
                            }
                        }
                        for (let p of _self.pagePara.pStationSet) {
                            if (_self.eirData.FINAL_PICKUP_NAME === p.text) {
                                $('#order_pick_stat_id').val(p.id).trigger('change');
                            }
                        }
                        for (let r of _self.pagePara.rStationSet) {
                            if (_self.eirData.FINAL_RETURN_NAME === r.text) {
                                $('#order_return_stat_id').val(r.id).trigger('change');
                            }
                        }
                    }
                } catch (error) {
                    common.dealErrorCommon(_self, error);
                }
            }

            async function getOrder() {
                if (_self.order_id) {
                    try {
                        let params = {
                            order_id: _self.order_id
                        };
                        let response = await _self.$http.post(apiUrl + 'q', params);
                        _self.order = response.data.info.order;

                        if (!_self.order.order_state.toString().startsWith('9'))
                            _self.edit_order = true;
                        if (_self.order.order_state.toString().startsWith('2'))
                            _self.change_taker = true;
                        $('#order_customer_id').val(_self.order.order_customer_id).trigger('change');
                        $('#order_factory_id').val(_self.order.order_factory_id).trigger('change');
                        $('#order_pick_stat_id').val(_self.order.order_pick_stat_id).trigger('change');
                        $('#order_return_stat_id').val(_self.order.order_return_stat_id).trigger('change');
                        $('#order_vehicle_id').val(_self.order.order_vehicle_id).trigger('change');
                        $('#order_source').val(_self.order.order_source).trigger('change');
                        _self.expense = response.data.info.expense;
                        _self.driver = response.data.info.driver || {};
                        _self.extra = response.data.info.extra;
                        _self.order.cFees = [];
                        _self.order.pFees = [];
                        for (let f of _self.extra) {
                            if (f.extra_fee_type_id.toString().startsWith('1') && f.id != 1001) {
                                _self.order.cFees.push(f);
                            } else if (f.extra_fee_type_id.toString().startsWith('2') && f.id != 2008) {
                                _self.order.pFees.push(f);
                            }
                        }
                        if (_self.copy_order) {
                            _self.order.order_so_code = null;
                            _self.order.order_arrival_time = null;
                            _self.order.order_container_code = '';
                            _self.order.order_seal_code = '';
                            _self.order.container_weight = null;
                            _self.order.order_fetch_code = null;
                            _self.order.order_vehicle_id = null;
                            _self.order.order_vehicle_num = null;
                            _self.order.order_taker_id = null;
                            _self.order.order_taker_name = null;
                            _self.order.order_taker_phone = null;
                            _self.driver = {};
                        } else {
                            $('#order_arrival_time').val(common.dateFormat(_self.order.order_arrival_time, 'min'));
                            _self.showRemark = !!_self.order.order_remark;
                        }
                        await _self.queryCustomer();
                    } catch (error) {
                        common.dealErrorCommon(_self, error);
                    }
                }
            }
            //获取自营订单的系统拿单号
            async function getFetchCode() {
                try {
                    let response = await _self.$http.post(apiUrl + 'gfc', {});
                    let reData = response.data.info;
                    if (response.data.errno == 0) {
                        _self.order_fetch_code = reData.order_fetch_code;
                        if (_self.order.order_source === '0') {
                            _self.order.order_fetch_code = _self.order_fetch_code;
                            _self.$forceUpdate();
                        } else {
                            _self.order.order_fetch_code = '';
                            _self.$forceUpdate();
                        }
                    } else {
                        common.dealWarningCommon(response.data.msg);
                    }
                } catch (error) {
                    common.dealErrorCommon(_self, error);
                }
            }

            async function initPage() {
                await getInit();
                await getOrder();
                await getFetchCode();
                $("#order_arrival_time").datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',
                    autoclose: true,
                    startDate: new Date() //#6341 不允许选过去的时间
                });
                $('#orderForm').parsley();
                $('#order_factory_id').on('select2:select', function (e) {
                    _self.queryCustomer();
                });
                $('#order_vehicle_id').on('select2:select', function (e) {
                    _self.queryDriver();
                });

                $('#order_source').on('select2:select', function (e) {
                    _self.order_source = common.getSelect2Val('order_source');
                    if (_self.order_source === '0') {
                        _self.order.order_taker_name = null;
                        _self.driver.driver_phone = null;
                        $('#order_vehicle_id').val(null).trigger('change');
                        _self.order.order_fetch_code = _self.order_fetch_code;
                        _self.$forceUpdate();
                    } else {
                        _self.order.order_fetch_code = '';
                        _self.$forceUpdate();
                    }
                });
            }

            initPage();
        },
        methods: {
            checkObject: function (ob) {//判断object是否有keys
                return Object.keys(ob).length > 0;
            },
            changeSource: function () {
                let _self = this;
                _self.order.order_source = common.getSelect2Val('order_source');
            },
            stationNameFilter: function (stationSet, id) {
                let stationName = '';
                for (let s of stationSet) {
                    if (id == s.id) {
                        stationName = s.text;
                        break;
                    }
                }
                return stationName;
            },
            queryCustomer: async function () {
                let _self = this;
                let factoryId = common.getSelect2Val('order_factory_id');
                if (factoryId) {
                    let params = {
                        factory_id: factoryId
                    };
                    let response = await _self.$http.post(apiUrl + 'qfac', params);
                    let reData = response.data.info;
                    if (reData.length > 0) {
                        _self.customerSet = [];
                        for (let c of reData) {
                            let obj = {
                                id: c.customer_id,
                                text: c.customer_name
                            };
                            _self.customerSet.push(obj);
                        }
                        let $order_customer_id = $('#order_customer_id');
                        $order_customer_id.select2('destroy').empty();
                        common.initSelect2($order_customer_id, _self.customerSet);
                        let data = reData[0];
                        $order_customer_id.val(data.customer_id).trigger('change');
                        _self.order.order_operator_name = data.operator;
                        _self.order.order_factory_address = data.address;
                        _self.order.customer_operator_phone = data.phone;
                        _self.order.order_level = data.order_level;
                        _self.expense.order_expense_price_cost = data.fee.basic_price_cost;
                        _self.expense.order_expense_price_income = data.fee.basic_price_income;
                        _self.expense.order_expense_price_labour = data.fee.basic_price_labour;
                        _self.expense.order_expense_road_toll = data.fee.factory_road_toll;
                        _self.expense.order_expense_oil_cost = data.fee.factory_oil_cost;
                        this.$forceUpdate();
                    }
                }
            },
            queryDriver: async function () {
                let _self = this;
                let vehicleId = common.getSelect2Val('order_vehicle_id');
                if (vehicleId) {
                    let params = {
                        vehicle_id: vehicleId
                    };
                    let response = await _self.$http.post(apiUrl + 'qve', params);
                    let reData = response.data.info;
                    if (reData.length > 0) {
                        let d = reData[0];
                        _self.order.order_taker_name = d.driver_name;
                        _self.driver.driver_phone = d.driver_phone;
                        _self.order.order_taker_id = d.driver_user_id;
                        _self.order.order_vehicle_id = d.vehicle_id;
                        _self.order.order_vehicle_type = d.vehicle_type;
                        _self.order.order_vehicle_num = d.vehicle_num;
                        this.$forceUpdate();
                    }
                }
            },
            saveOrder: async function () {
                let _self = this;
                if (!_self.order_id || _self.copy_order) {
                    _self.order.order_expense_price_cost = _self.expense.order_expense_price_cost || 0;
                    _self.order.order_expense_price_income = _self.expense.order_expense_price_income || 0;
                    _self.order.order_expense_price_labour = _self.expense.order_expense_price_labour || 0;
                    _self.order.order_expense_road_toll = _self.expense.order_expense_road_toll || 0;
                    _self.order.order_expense_oil_cost = _self.expense.order_expense_oil_cost || 0;
                    _self.order.order_customer_id = common.getSelect2Val('order_customer_id');
                    _self.order.order_factory_id = common.getSelect2Val('order_factory_id');
                    _self.order.order_pick_stat_id = common.getSelect2Val('order_pick_stat_id');
                    _self.order.order_source = common.getSelect2Val('order_source');
                    _self.order.order_pick_stat_address = _self.stationNameFilter(_self.pagePara.pStationSet, _self.order.order_pick_stat_id);
                    _self.order.order_return_stat_id = common.getSelect2Val('order_return_stat_id');
                    _self.order.order_return_stat_address = _self.stationNameFilter(_self.pagePara.rStationSet, _self.order.order_return_stat_id);
                    _self.order.order_vehicle_color = common.getSelect2Val('order_vehicle_color');
                    _self.order.order_clearance_type = common.getSelect2Val('order_clearance_type');
                    for (let f of _self.pagePara.factorySet) {
                        if (_self.order.order_factory_id == f.id) {
                            _self.order.order_factory_name = f.text;
                            break;
                        }
                    }
                    for (let c of _self.pagePara.allCustomerSet) {
                        if (_self.order.order_customer_id == c.customer_id) {
                            _self.order.order_customer_name = c.customer_name;
                            break;
                        }
                    }
                    if (_self.order.order_container_code) {
                        let reg = /^[A-Za-z]{4}\d{7}$/;//柜号由4位字母和7位数字组成
                        let validate = reg.test(_self.order.order_container_code);
                        if (!validate) {
                            this.$message({
                                message: '柜号应该由4位字母和7位数字组成,请重新输入！',
                                type: 'warning'
                            });
                            return;
                        }
                    }
                    let eFees = [..._self.order.cFees, ..._self.order.pFees];
                    for (let f of eFees) {
                        if (!f.extra_fee_type_id)
                            return this.$message({
                                message: '请完整填写应收应付费用！',
                                type: 'warning'
                            });
                        if (f.extra_fee_amount == '') f.extra_fee_amount = 0;
                        for (let t of _self.pagePara.feeTypeSet) {
                            if (f.extra_fee_type_id == t.fee_type_id)
                                f.extra_fee_name = t.fee_type_name
                        }
                    }
                    if ($('#orderForm').parsley().isValid()) {
                        //校验order_so_code是否重复
                        let param = {
                            order_so_code: _self.order.order_so_code
                        };
                        let response = await _self.$http.post(apiUrl + 'scv', param);
                        if (response.data.errno == 0) {
                        } else {
                           return common.dealWarningCommon(response.data.msg);
                        }
                        //创建订单
                        common.dealConfrimCommon("确认创建订单吗？" , async function () {
                            _self.order.order_arrival_time = $('#order_arrival_time').val();
                            _self.order.eFees = _self.order.cFees.concat(_self.order.pFees);
                            let method = _self.order.order_source == 0 ? 'c' : 'co';
                            _self.$http.post(apiUrl + method, _self.order).then((response) => {
                                if (response.data.errno == 0) {
                                    common.dealPromptCommon('订单创建成功');
                                    _self.goBack()
                                } else {
                                    common.dealWarningCommon(response.data.msg);
                                }
                            }, (response) => {
                                common.dealErrorCommon(_self, response)
                            })
                        })
                    }
                }
            },
            cancelOrder: function (event) {
                this.goBack()
            },
            increaseFee: function () {
                let _self = this;
                let obj = {
                    extra_fee_type_id: null,
                    extra_fee_name: null,
                    extra_fee_amount: null,
                    extra_fee_remark: null
                };
                let obj1 = {
                    extra_fee_type_id: null,
                    extra_fee_name: null,
                    extra_fee_amount: null,
                    extra_fee_remark: null
                };
                _self.order.cFees.push(obj);
                _self.order.pFees.push(obj1);
                this.$forceUpdate();
            },
            reduceFee: function (index) {
                let _self = this;
                _self.order.cFees.splice(index, 1);
                _self.order.pFees.splice(index, 1);
                this.$forceUpdate();
            },
            containerFeeChanged: function () {
                let _self = this;
                if (_self.order.order_container_size && _self.order.order_container_shape) {
                    let isFound = false;
                    for (let c of _self.pagePara.containerFeeSet) {
                        if (c.container_fee_size == _self.order.order_container_size &&
                            c.container_fee_shape == _self.order.order_container_shape) {
                            _self.bookingPrice = c.container_fee_amount;
                            isFound = true;
                            break;
                        }
                    }
                    _self.bookingPrice = isFound ? _self.bookingPrice : 0;
                } else {
                    _self.bookingPrice = 0;
                }
                _self.order.cFees[0].extra_fee_amount = _self.bookingPrice;
                this.$forceUpdate();
            },
            feeTypeChanged: function (index, side) {
                let _self = this;
                if (index === 0) return;
                for (let i in _self.order.pFees) {
                    if (i != index && _self.order.pFees[index].extra_fee_type_id == _self.order.pFees[i].extra_fee_type_id) {
                        $('#pFees' + index).val(null);
                        return this.$message({
                            message: '费用类型不能重复！',
                            type: 'warning'
                        });
                    }
                }
                for (let i in _self.order.cFees) {
                    if (i != index && _self.order.cFees[index].extra_fee_type_id == _self.order.cFees[i].extra_fee_type_id) {
                        $('#cFees' + index).val(null);
                        return this.$message({
                            message: '费用类型不能重复！',
                            type: 'warning'
                        });
                    }

                }
                if (side === 'c') {
                    _self.order.pFees[index].extra_fee_type_id = _self.order.cFees[index].extra_fee_type_id + 1000;
                    $('#pFees' + index).val(_self.order.pFees[index].extra_fee_type_id + '');
                }
                if (side === 'p') {
                    _self.order.cFees[index].extra_fee_type_id = _self.order.pFees[index].extra_fee_type_id - 1000;
                    $('#cFees' + index).val(_self.order.cFees[index].extra_fee_type_id + '');
                }

            },
            portChanged: async function () {
                let _self = this;
                let params = {
                    container_station_port_id: _self.order.order_port_id
                };
                try {
                    let response = await _self.$http.post(apiUrl + 'qsc', params);
                    let retData = response.data.info;
                    _self.pStationSet = retData.pStationSet;
                    _self.rStationSet = retData.rStationSet;
                    $('#order_pick_stat_id').select2('destroy').empty();
                    $('#order_return_stat_id').select2('destroy').empty();
                    common.initSelect2($('#order_pick_stat_id'), _self.pStationSet);
                    common.initSelect2($('#order_return_stat_id'), _self.rStationSet);
                    this.$forceUpdate();
                } catch (error) {
                    common.dealErrorCommon(_self, error);
                }
            },
            showOrderRemark: function () {
                let _self = this;
                _self.showRemark = !_self.showRemark;
                if (_self.showRemark) {
                    _self.order.order_remark = '';
                }
            },
            goBack: function () {
                let _self = this;
                if (_self.checkObject(_self.eirData) && !_self.copy_order) {
                    _self.$router.push({
                        path: '/eir/EIRSystemDetailControl',
                        query: _self.eirData
                    })
                } else {
                    window.history.back();
                }
            },
            soCodeBlur: function () {
                let _self = this;
                if (_self.order.order_so_code) {
                    let index = _self.order.order_so_code.indexOf("-");
                    if (index != -1) {
                        _self.order.order_booking_no = _self.order.order_so_code.substring(0, index)
                        this.$forceUpdate();
                    }
                }
            }

        }
    }
</script>
<style scoped>
    .info {
        margin-left: 10px;
        margin-right: 10px
    }

    .buttons {
        margin-top: 20px;
    }
</style>