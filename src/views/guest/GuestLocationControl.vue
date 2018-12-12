<template>
    <div>
        <!-- begin breadcrumb -->
        <ol class="breadcrumb p-l-15">
            <li>运营管理</li>
            <li class="active"><a href="javascript:;">司机实时位置查询</a></li>
        </ol>
        <!-- end breadcrumb -->
        <div class="panel panel-inverse">
            <div class="panel-heading">
                <div class="panel-heading-btn">
                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i
                            class="fa fa-expand"></i></a>
                </div>
                <h4 class="panel-title">实时位置查询</h4>
            </div>
            <div class="panel-body">
                <div class="form-inline">
                    <div class="form-group">
                        <input class="form-control" v-model="order_booking_no" placeholder="请输入订舱单号">
                    </div>
                    <div class="form-group">
                        <button class="btn btn-info" @click="search">查询</button>
                    </div>
                </div>
                <div v-show="orderList.length>0" style="margin-top: 10px">
                    <table id="orderTable"></table>
                </div>
            </div>
        </div>
        <div class="panel panel-inverse" v-show="transNode.length>0 && containerPhotoUrl && sealPhotoUrl">
            <div class="panel-heading">
                <div class="panel-heading-btn">
                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i
                            class="fa fa-expand"></i></a>
                </div>
                <h4 class="panel-title">箱号铅封号</h4>
            </div>
            <div class="panel-body">
                <div class="image">
                    <div class="row">
                        <img class="photo-style" :src="containerPhotoUrl">
                        <img class="photo-style" :src="sealPhotoUrl">
                        <!--<a :href="containerPhotoUrl" class="photo-style"-->
                           <!--v-bind:style="{'background':'url('+containerAbstract+') no-repeat'}"></a>-->
                        <!--<a :href="sealPhotoUrl" class="photo-style"-->
                           <!--v-bind:style="{'background':'url('+sealAbstract+') no-repeat'}"></a>-->
                    </div>
                </div>
            </div>
        </div>
        <div class=" panel panel-inverse" v-show="transNode.length>0">
            <div class="panel-heading">
                <div class="panel-heading-btn">
                    <button class="btn btn-danger btn-xs" v-on:click="clear">关闭</button>
                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default"
                       data-click="panel-expand"><i
                            class="fa fa-expand"></i></a>
                </div>
                <h4 class="panel-title">运输节点信息</h4>
            </div>
            <div class="row">
                <div class="panel-body">
                    <div class="trans-node-container">
                        <div class="row line-top" v-for="(node, index) in transNode">
                            <div v-if="node.trans_node_address">
                                <div v-bind:class="[node.trans_node_type == 92 ? 'recover-color': 'normal-color']" style="position: relative">
                                    <div class="title-width">{{node.trans_node_type | tansNodeFilter}}</div>
                                    <span class="left-margin">
                                        {{formatDate(node.created_at)}}
                                        <span class="left-space">{{node.trans_node_address}}</span>
                                    </span>

                                    <div class="vertical-line" v-show="index < transNode.length - 1"></div>
                                </div>
                            </div>
                            <div v-else="" class="alarm-color" style="position: relative">
                                <div class="title-width">{{node.trans_node_type | tansNodeFilter}}</div>
                                <span class="left-margin">
                                    {{formatDate(node.created_at)}}
                                    <span class="left-space">（GPS设备数据返回异常）</span>
                                </span>
                                <div class="vertical-line" v-show="index < transNode.length - 1"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel panel-inverse" v-show="transNode.length>0 && orderState != 90">
            <div class="panel-heading">
                <div class="panel-heading-btn">
                    <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default"
                       data-click="panel-expand"><i
                            class="fa fa-expand"></i></a>
                </div>
                <h4 class="panel-title">实时位置显示</h4>
            </div>
            <div class="row">
                <div class="panel-body">
                    <div id="mapContainer" style="height: 500px;width: 100%;"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    const common = require('commonFunc');
    const transNodeApiUrl = '/api/guest/TransNode?method=';

    export default {
        data: function () {
            return {
                map: null,
                order_booking_no: null,
                transNode: [],
                orderList: [],
                orderState: null,
                containerPhotoUrl: null,
                sealPhotoUrl: null,
                containerAbstract: null,
                sealAbstract: null,
//                testNodes: [
//                    {trans_node_type: 5, created_at: 2018-9-17, trans_node_address: '广东省深圳市龙岗区坪地街道盐龙大道'},
//                    {trans_node_type: 4, created_at: 2018-9-16, trans_node_address: '广东省深圳市罗湖区东湖街道坤达服务区'},
//                    {trans_node_type: 3, created_at: 2018-9-15, trans_node_address: '广东省深圳市盐田区盐田街道明珠大道泊郡雅苑'},
//                    {trans_node_type: 2, created_at: 2018-9-14, trans_node_address: '广东省深圳市龙岗区龙岗街道大和街9号侨联商务宾馆'},
//                    {trans_node_type: 92, created_at: 2018-9-19, trans_node_address: '广东省深圳市龙岗区坪地街道盐龙大道'},
//                    {trans_node_type: 91, created_at: 2018-9-18, trans_node_address: ''},
//                    {trans_node_type: 1, created_at: 2018-9-13, trans_node_address: ''}
//                ]
            }
        },
        name: 'DriverLocationControl',
        filters: {
            tansNodeFilter: function (value) {
                if (value == 1) {
                    return '开始运输';
                } else if (value == 2) {
                    return '提箱';
                } else if (value == 3) {
                    return '到厂';
                } else if (value == 4) {
                    return '离厂';
                } else if (value == 5) {
                    return '还箱';
                } else if (value == 91) {
                    return 'GPS数据异常';
                } else if (value == 92) {
                    return 'GPS数据恢复';
                }
            }
        },
        mounted: function () {
            let _self = this;
            let $table = $('#orderTable');
            _self.order_booking_no = _self.$route.query.order_booking_no;

            function initMap() {
                _self.map = new AMap.Map('mapContainer', {
                    resizeEnable: true,
                    center: [116.397428, 39.90923],
                    zoom: 17
                });

                AMap.plugin('AMap.ToolBar', function () {
                    var toolbar = new AMap.ToolBar();
                    _self.map.addControl(toolbar)
                })
            }

            window.tableEvents = {
                'click .detail': function (e, value, row, index) {
                    _self.containerAbstract = null;
                    _self.sealAbstract = null;
                    _self.orderState = row.order_state;
                    _self.getNodeInfo(row.order_id);
                    if (row.order_container_photo_id) {
                        _self.containerAbstract = '/api/core/file/UploadFile?method=gf&type=4&order_id=' + row.order_id;
                        _self.containerPhotoUrl = '/api/core/file/UploadFile?method=gf&type=2&order_id=' + row.order_id;
                    }
                    if (row.order_seal_photo_id) {
                        _self.sealAbstract = '/api/core/file/UploadFile?method=gf&type=5&order_id=' + row.order_id;
                        _self.sealPhotoUrl = '/api/core/file/UploadFile?method=gf&type=3&order_id=' + row.order_id;
                    }
                }
            };

            function operateFormatter(value, row, index) {
                return [
                    '<a class="btn btn-info btn-xs m-r-5 detail">查看详情</a>'
                ].join('')
            }

            function stateFormatter(value, row, index) {
                for (let state of _self.pagePara.orderStateSet) {
                    if (value == 20 || value == 21 || value == 22 ||
                            value == 24 || value == 26 || value == 27 ||
                            value == 28) {
                        return '已处理';
                    } else if (value == 80 || value == 81 || value == 88) {
                        return '已取消';
                    } else {
                        if (value == state.id) {
                            return state.text;
                        }
                    }
                }
            }

            function initTable() {
                $table.bootstrapTable({
                    columns: [
                        common.BTRowFormatWithIndex('NO.'),
                        common.BTRowFormat('order_booking_no', '订舱单号'),
                        common.BTRowFormat('order_container_code', '柜号'),
                        common.BTRowFormat('order_seal_code', '封条号'),
                        common.BTRowFormat('order_container_weight', '柜重'),
                        common.BTRowFormat('order_vehicle_num', '车牌号'),
                        common.BTRowFormat('order_taker_name', '司机姓名'),
                        common.BTRowFormat('phone', '司机电话'),
                        common.BTRowFormat('order_customer_name', '客户名称'),
                        common.BTRowFormat('order_factory_name', '工厂名称'),
                        common.BTRowFormat('order_factory_address', '工厂地址'),
                        common.BTRowFormatWithFormatter('order_state', '订单状态', stateFormatter),
                        common.actFormatter('operate', operateFormatter, tableEvents)
                    ],
                    idField: 'order_id',
                    uniqueId: 'order_id',
                    striped: true,
                    locale: 'zh-CN'
                });
                common.changeTableClass($table)
            }

            function getInit() {
                _self.$http.post(transNodeApiUrl + 'i', {}).then((response) => {
                    _self.pagePara = response.data.info;
                    initTable();
                }, (response) => {
                    common.dealErrorCommon(_self, response)
                })
            }

            function initPage() {
                getInit();
                if (_self.order_booking_no) {
                    _self.search()
                }
                common.initImageViewer();
            }

            initPage()
        },
        methods: {
            formatDate: function (date) {
                return common.dateFormat(date, 'min');
            },
            clear: function () {
                let _self = this;
                _self.transNode = [];
            },
            search: function (event) {
                let _self = this;
                let soCode = _self.order_booking_no;
                if (!soCode) {
                    this.$message({
                        message: '请输入订舱单号！',
                        type: 'warning'
                    });
                    return;
                }
                //获取订舱号的订单
                let params = {
                    order_booking_no: soCode
                };
                _self.$http.post(transNodeApiUrl + 'qo', params).then((response) => {
                    let _self = this;
                    _self.orderList = response.data.info;
                    _self.transNode = [];
                    $('#orderTable').bootstrapTable('load', _self.orderList);
                    if (_self.orderList.length <= 0) {
                        this.$message({
                            message: '查询的订舱号无结果!',
                            type: 'warning'
                        });
                    }
                }, (response) => {
                    common.dealErrorCommon(_self, response)
                })
            },
            getNodeInfo: function (orderId) {
                let _self = this;

                let params = {
                    order_id: orderId
                };

                //获取运输节点
                _self.$http.post(transNodeApiUrl + 'gq', params).then((response) => {
                    _self.transNode = [];
                    for (let node of response.data.info) {
                        if (node.trans_node_type == 1 ||
                            node.trans_node_type == 3 ||
                            node.trans_node_type == 4 ||
                            node.trans_node_type == 5 ||
                            node.trans_node_type == 91 ||
                            node.trans_node_type == 92) {
                            _self.transNode.push(node);
                        }
                    }
                }, (response) => {
                    common.dealErrorCommon(_self, response)
                });

                if (_self.orderState == 90) {//已完成订单不显示司机位置
                    return;
                }

                //获取经纬度
                _self.$http.post(transNodeApiUrl + 'dl', params).then((response) => {
                    let lng = response.data.info.lng;
                    let lat = response.data.info.lat;

                    let map = new AMap.Map('mapContainer', {
                        resizeEnable: true,
                        center: [lng, lat],
                        zoom: 17
                    });

                    AMap.plugin('AMap.ToolBar', function () {
                        let toolbar = new AMap.ToolBar();
                        map.addControl(toolbar)
                    });

                    let marker = new AMap.Marker({
                        map: map,
                        position: [lng, lat],
                        icon: "/static/images/location/truck.png",
                        offset: new AMap.Pixel(-36, -12),
                        autoRotation: true
                    });

                    let geocoder = new AMap.Geocoder({
                        radius: 1000,
                        extensions: "all"
                    });

                    geocoder.getAddress([lng, lat], function (status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            let address = result.regeocode.formattedAddress;
                            let content = [];
                            content.push("地理位置: " + address);
                            content.push("经纬度:（" + lng.toFixed(4) + ", " + lat.toFixed(4) + "）");
                            let infoWindow = new AMap.InfoWindow({
                                content: content.join("<br/>"),
                                offset: {x: 0, y: -5}
                            });
                            infoWindow.open(map, marker.getPosition());
                            marker.on("mouseover", function (e) {
                                infoWindow.open(map, marker.getPosition());
                            });
                        }
                    });

                    map.setFitView();

                }, (response) => {
                    common.dealErrorCommon(_self, response)
                });

            }
        }
    }
</script>
<style scoped>
    .trans-node-container {
        margin: 10px 10px 0px 20px;
    }

    .trans-node-container span {
        font-size: 14px;
    }

    .line-top {
        margin-top: 10px;
    }

    .left-margin {
        position: absolute;
        left: 120px;
        top: 0px;
    }
    .left-space {
        margin-left: 10px;
    }

    .vertical-line {
        height: 20px;
        width: 20px;
        margin-left: 50px;
        border-left: 2px solid;
        margin-top: 8px;
        color: #70747c;
    }

    .photo-style {
        margin-left: 10px;
        width: 100px;
        height: 100px;
        display: inline-block;
    }
    .alarm-color {
        color: red;
    }
    .recover-color {
        color: green;
    }
    .normal-color {
        color: #70747c
    }
    .title-width {
        height: 20px;
        width: 100px;
        font-size: 14px;
        text-align: center;
    }
</style>