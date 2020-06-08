/* eslint-disable no-undef */
const meduim = require('../src/medium');
const $ = require('jquery');

describe('medium', function () {
    beforeAll(() => {
        global.FREnv = {};
    });
    describe('buildTrendingAnalytics', function () {
        let oribuildTreemapGraph;
        beforeEach(function () {
            oribuildTreemapGraph = window.buildTreemapGraph;
            window.buildTreemapGraph = jest.fn();
            const id = 'jq-trending-graph-Type-0';
            $('body').append(`<div id=${id}></div>`);
            $('body').append('<div class="jq-chrt-name"></div>');
            $('body').append('<div class="jq-te-small-info"></div>');
        });

        afterEach(function () {
            window.buildTreemapGraph = oribuildTreemapGraph;
            const id = 'jq-trending-graph-Type-0';
            $(`#${id}`).remove();
            $('.jq-chrt-name').remove();
            $('.jq-te-small-info').remove();
        });

        it('should build trends graph', function () {
            // Arrange
            const graph = {
                nodes: [{}],
                entity: {
                    name: 'abc',
                },
                chartId: '',
               
            };
            const graph1 = {
                nodes: [{}],
                chartType: 'TREE_COMPANY',
                chartId: '',
            };
            
            const graph2 = {
                nodes: [{}],
                chartType: 'TREE_TOPICS',
                chartId: '',
            };
            const graph3 = {
                nodes: [{}],
                chartType: 'TREE_MONITOR_SEARCH',
                chartId: '',
            };
            const res = {
                data: {
                    visualizationData: {
                        chartTypeVsGraphMap: {
                            a: [graph, graph1],
                            b: [graph, graph2, graph3]
                        },
                        mapSize: 1,
                    },
                },
            };
            $('.jq-te-small-info').width(500); 

            //Act
            meduim.buildTrendingAnalytics(res);
            //Assert
            expect(window.buildTreemapGraph).toHaveBeenCalled();
        });
        it('should set chartname to graph entity name',function(){
         
            const graph = {
                nodes: [{}],
                entity: {
                    name: 'abc',
                },
                chartId: '',
                chartType:'Type'
            };
            const res = {
                data: {
                    visualizationData: {
                        chartTypeVsGraphMap: { a: [graph] },
                    },
                    mapSize: 1,
                },
            };
            meduim.buildTrendingAnalytics(res);
            expect( $('#jq-trending-graph-Type-0').parent().find('.jq-chrt-name').html()).toEqual('abc');
        });
        it('should not set chartname as html element if chartname does not exist',function(){
         
            const graph = {
                nodes: [{}],
                entity: {
                    name: '',
                },
                chartId: '',
                chartType:'Type'
            };
            const res = {
                data: {
                    visualizationData: {
                        chartTypeVsGraphMap: { a: [graph] },
                    },
                    mapSize: 1,
                },
            };
            
            meduim.buildTrendingAnalytics(res);
            expect( $('#jq-trending-graph-Type-0').parent().find('.jq-chrt-name').html()).toEqual('');
        });
        it('should not build tree map graph if there is no visualization data',function(){
            const res = {
                data: {
                    visualizationData:'',
                    mapSize: 1,
                },
            };
            meduim.buildTrendingAnalytics(res);
            expect(window.buildTreemapGraph).not.toHaveBeenCalled();
        });
        it('should not build tree map graph if there is no graph node',function(){
            const graph = {
                node:'',
                entity: {
                    name: 'abc',
                },
                chartId: '',
                chartType:'Type'
            };
            const res = {
                data: {
                    visualizationData:{
                        chartTypeVsGraphMap: { a: [graph] },
                    },
                    mapSize: 1,
                },
            };
            meduim.buildTrendingAnalytics(res);
            expect(window.buildTreemapGraph).not.toHaveBeenCalled();
        });

    });
    describe('constructActivityParamsInAjaxCall', function () {
        it('should populate params when the given data is present', function () {
            const data = {
                activity: 'activity',
                target: 'target',
                targetId: 'targetId',
                viewId: 'viewId',
                sectionId: 'sectionId',
                section: 'section',
                subSectionId: 'subSectionId',
                subSection: 'subSection',
                code: 'code',
                metadata: 'meta',
                str1: 'str1',
                str2: 'str2',
            };
            const params = {};
            FREnv = {
                inlineview: 'inlineView',
                email: 'email',
                token: 'token',
                activityChannel: 'activityChannel',
                channelPrefix: '',
            };
            meduim.constructActivityParamsInAjaxCall(data, params);
            expect(params).toEqual({
                activityType: 'activity',
                target: 'target',
                targetId: 'targetId',
                activityView: 'inlineView',
                activityChannel: 'activityChannel',
                viewId: 'viewId',
                section: 'section',
                sectionId: 'sectionId',
                subSection: 'subSection',
                subSectionId: 'subSectionId',
                code: 'code',
                metaData: 'meta',
                str1: 'str1',
                str2: 'str2',
                track: 'true',
                email: 'email',
                token: 'token',
            });
        });
        it('should populate alternative when data does not exist', function () {
            const data = {
                activity: 'activity',
                target: 'target',
                targetId: 'targetId',
                viewId: 'viewId',
                sectionId: '',
                section: '',
                subSectionId: 'subSectionId',
                subSection: 'subSection',
                code: 'code',
                metadata: 'meta',
                str1: 'str1',
                str2: 'str2',
            };
            const params = {};
            FREnv = {
                inlineview: undefined,
                email: 'email',
                token: 'token',
                activityChannel: 'activityChannel',
                channelPrefix: '',
                pageName: 'pageName',
                sectionId: 'FsectionId',
            };

            meduim.constructActivityParamsInAjaxCall(data, params);
            expect(params).toEqual({
                activityType: 'activity',
                target: 'target',
                targetId: 'targetId',
                activityView: 'pageName',
                activityChannel: 'activityChannel',
                viewId: 'viewId',
                section: 'subSection',
                sectionId: 'FsectionId',
                subSectionId: 'subSectionId',
                code: 'code',
                metaData: 'meta',
                str1: 'str1',
                str2: 'str2',
                track: 'true',
                email: 'email',
                token: 'token',
            });
        });
        it('should not populate params when there is no data and no alternatives', function(){
            const data = {
            };
            const params = {};
            FREnv = {
                inlineview: 'inlineView',
                email: 'email',
                token: 'token',
                channelPrefix: '',
                sectionId:'FsectionId'
            };
            meduim.constructActivityParamsInAjaxCall(data, params);
            expect(params).toEqual({
                sectionId:'FsectionId',
                activityView:'inlineView',
                track: 'true',
                email: 'email',
                token: 'token'
            });
        });
    });
    describe('ajxCallToLogAction(', function () {
        let mocked;
        afterEach(()=>{
            mocked.mockClear();
        });
        it('should default to get if not request type is given', function(){
            const data='something';
            mocked = jest.spyOn($ ,'ajax');
            meduim.ajxCallToLogAction(data);
            expect(mocked).toHaveBeenCalled();
            expect(mocked.mock.calls[0][0]['type']).toEqual('GET');
        });
        it('should post something in the ajax', function(){
            const data = 'something';
            const requestType = 'POST';
            mocked = jest.spyOn($ ,'ajax');
            meduim.ajxCallToLogAction(data, requestType);
            expect(mocked).toHaveBeenCalled();
            expect(mocked.mock.calls[0][0]['type']).toEqual(requestType);
            expect(mocked.mock.calls[0][0]['data']).toEqual(data);
        });
        
    });
});
