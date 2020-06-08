const $ = require('jquery');

function buildTrendingAnalytics(res) {
    if (res.data && res.data.visualizationData) {
        var contWidth = $('.jq-te-small-info').outerWidth();
        for (var chartType in res.data.visualizationData.chartTypeVsGraphMap) {
            var chartList = res.data.visualizationData.chartTypeVsGraphMap[chartType];
            var count = -1;
            for (var i in chartList) {
                var graph = chartList[i];
                count++;
                if (graph.nodes) {
                    var id = '#jq-trending-graph-' + graph.chartType + '-' + count;
                    var chartName = null;
                    if (res.data.mapSize == 1 && graph.entity) {
                        chartName = graph.entity.name;
                    } else {
                        if (graph.chartType == 'TREE_COMPANY') {
                            chartName = 'BUSINESS INFLUENCERS';
                        } else if (graph.chartType == 'TREE_TOPICS') {
                            chartName = 'MARKET DRIVERS';
                        } else if (graph.chartType == 'TREE_MONITOR_SEARCH') {
                            chartName = 'MONITOR ACTIVITY TRENDS';
                        } else {
                            chartName = graph.entity.name;
                        }
                    }
                    if (chartName) {
                        $(id).parent().find('.jq-chrt-name').html(chartName);
                    }
                    var _item = 3;
                    if (contWidth < 500) {
                        _item = 1;
                    }
                    var width = contWidth / _item - 36;
                    if (contWidth < 500) {
                        //width -= 50;
                    }
                    graph.chartId = 'jq-trn';
                    var height = 170;
                    $(id).html('');

                    window.buildTreemapGraph($(id), graph, {
                        width: width,
                        height: height,
                        index: count,
                    });
                }
            }
        }
    }
}

function constructActivityParamsInAjaxCall(data, params) {
    if (data.activity != undefined && data.activity != '') {
        params.activityType = data.activity;
    }
    if (data.target != undefined && data.target != '') {
        params.target = data.target;
    }
    if (data.targetId != undefined && data.targetId != '') {
        params.targetId = data.targetId;
    }

    if (FREnv.inlineview) {
        params.activityView = FREnv.inlineview;
    } else {
        params.activityView = FREnv.pageName;
    }

    if (FREnv.activityChannel) {
        params.activityChannel = FREnv.activityChannel;
    }
    if (data.viewId != undefined && data.viewId != '') {
        params.viewId = FREnv.channelPrefix + data.viewId;
    }
    //if section is not defined and subsection is present there then subsection becomes section
    if (data.section != undefined && data.section != '') {
        params.section = data.section;
    } else if (data.subSection != undefined && data.subSection != '') {
        params.section = data.subSection;
        data.subSection = '';
    }
    if (data.sectionId != undefined && data.sectionId != '') {
        params.sectionId = data.sectionId;
    } else {
        params.sectionId = FREnv.sectionId;
    }
    if (data.subSection != undefined && data.subSection != '') {
        params.subSection = data.subSection;
    }
    if (data.subSectionId != undefined && data.subSectionId != '') {
        params.subSectionId = data.subSectionId;
    }
    if (data.code != undefined && data.code != '') {
        params.code = data.code;
    }
    if (data.metadata != undefined && data.metadata != '') {
        params.metaData = data.metadata;
    }
    if (data.str1 != undefined && data.str1 != '') {
        params.str1 = data.str1;
    }
    if (data.str2 != undefined && data.str2 != '') {
        params.str2 = data.str2;
    }
    params.track = 'true';
    params.email = FREnv.email;
    params.token = FREnv.token;
}

function ajxCallToLogAction(data, requestType) {
    $.ajax({
        url: 'logaction',
        cache: false,
        type: requestType ? requestType : 'GET',
        dataType: 'html',
        data: data,
    });
}

exports.buildTrendingAnalytics = buildTrendingAnalytics;
exports.constructActivityParamsInAjaxCall = constructActivityParamsInAjaxCall;
exports.ajxCallToLogAction = ajxCallToLogAction;
