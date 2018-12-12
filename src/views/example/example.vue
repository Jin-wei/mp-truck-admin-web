<template>
<div>
    <!-- begin breadcrumb -->
    <ol class="breadcrumb p-l-15">
        <li><a href="javascript:;">example</a></li>
        <li class="active">example</li>
    </ol>
    <!-- end breadcrumb -->
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-inverse">
                <div class="panel-heading">
                    <div class="panel-heading-btn">
                        <a href="javascript:;" class="btn btn-xs btn-icon btn-circle btn-default" data-click="panel-expand"><i class="fa fa-expand"></i></a>
                    </div>
                    <h4 class="panel-title">example</h4>
                </div>
                <div class="panel-body" style="display:none;">
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
const common = require('commonFunc')
const apiUrl = '....'

export default {
    data: function() {
        return {
            pagePara: '',
        }
    },
    name: 'template',
    mounted: function() {
        let _self = this

        function initPage() {
            common.reSizeCall()
        }

        initPage()
    },
    methods: {
        example: function(event) {}
    }
}
</script>
<style scoped>
</style>
