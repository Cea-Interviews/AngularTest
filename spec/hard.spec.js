const $ = require('jquery')
require('angular/angular.min');
require('angular-mocks');
require('../src/hard')


describe('hard.js | manageQuickViews directive', function () {
    'use strict';
    let $scope, $rootScope, $compile, $http, resforget, scope, body, element;
    beforeAll(function () {
        global.FREnv = {
            $rootScope: {
                channelSubViewToRender: 'ChannelSVR',
                channelToRender: {
                    id: 1,
                    channelType: 'channel',
                    shareId: '1c'
                }
            },
            channelPrefix: 'ch'
        }
        global.successMessageSeachAdded = function (x) { };
        global.usageTrackingCall = function (x) { }
        global.getShareByUserTrack = function (x) { }
        global.manageQuickViewDone = function () { }


    })
    beforeEach(function () {
        angular.mock.module('frDirectives');
        angular.mock.module(function ($provide) {
            $http = jest.fn().mockImplementation(function () {
                return $http;
            })
            $http.then = jest.fn().mockImplementation(function (fn) {
                fn({})
                return $http;
            })
            $http.post = jest.fn().mockReturnValue($http)
            $http.success = jest.fn().mockReturnValue($http)
            $http.error = jest.fn().mockReturnValue($http)
            $http.catch = jest.fn().mockReturnValue($http)
            $http.get = jest.fn()
            $provide.value('$http', $http)
        })
        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new(true)
            $compile = _$compile_
            $http.get.mockReturnValue({
                success: jest.fn().mockImplementation(function (fn) {
                    fn(resforget);
                    return $http;
                }),
                finally: $http.then
            })
        })
        resforget = {
            status: "SUCCESS"
        }
        window.successMessageSeachAdded = jest.fn()
        window.usageTrackingCall = jest.fn()
        window.manageQuickViewDone = jest.fn()
        window.getShareByUserTrack = jest.fn().mockReturnValue({
            ss: 'ss1',
            ssi: 'ssi1'
        })
        $scope.views = [
            {
                id: 'something',
                default: 'default'
            }
        ]
        element = angular.element(
            '<manage-quick-views views="views" is-mobile-view ="isMobileView" remove-quick-view-filter="removeQuickViewFilter" update-stream-quick-view="updateStreamQuickView" selected-quick-view ="selectedQuickView"></manage-quick-views>'
        )
        $compile(element)($scope);
        scope = element.isolateScope();
        scope.$digest()
        body = $('body');
    })

    describe('initialization', function () {
        it('should initiailize', function () {
            expect(element).toBeDefined()
        })

    })
    describe('scope function', function () {
        const id = 'id';
        describe('rename', function () {

            it('should hide class of jq-name-id', function () {
                body.append('<div class="jq-name-id"> </div>')
                body.append('<div class="jq-tb-a-id"></div>')
                body.append('<div class="jq-tb-id"></div>')
                scope.rename(id);
                expect($('.jq-name-id').css('display')).toEqual('none')
            })
        })
        describe('enter', function () {
            beforeAll(function () {
                $('.jq-tb-id').remove();
            });
            it('should blur class jq-tb-id', function () {
                body.append('<div class="jq-tb-id"> </div>');
                scope.enter(id);
                expect($('.jq-tb-id')).toHaveProperty('blur');
            });
        });
        describe('renameText', function () {
            let event;
            beforeAll(function () {
                $('.jq-tb-a-id').remove();
                $('.jq-name-id').remove();
                event = {
                    target: {
                        _id: id,
                    },
                    stopPropagation: function () { },
                };
            });
            it('should call the scope.updateStreamQuickView', function () {
                body.append('<div class="jq-name-id"> </div>');
                body.append('<div class="jq-tb-a-id"> </div>');
                scope.updateStreamQuickView = jest.fn();
                scope.renameText(event);
                expect(scope.updateStreamQuickView).toHaveBeenCalledWith({ 'event': event, 'id': id });
            });
        });
        describe('allResMarkDef', function () {
            it('should set all views as defualt if there is no one specified', function () {
                $scope.views = [{
                    id: 'something',
                }];
                element = angular.element(
                    '<manage-quick-views views="views" is-mobile-view="isMobileView" remove-quick-view-filter="removeQuickViewFilter" update-stream-quick-view "updateStreamQuickView" selected-quick-view="selectedQuickView"></manage-quick-views>'
                );
                $compile(element)($scope);
                expect(element.isolateScope().allResMarkDef).toBe(true);
            });
        });
        describe('unMarkQuickViewAsDefault', function () {
            it('should quickviewID to be null if scope.views has no property default', function () {
                scope.views = [{
                    id: 'something',
                }];
                scope.unMarkQuickViewAsDefault();
                expect(usageTrackingCall).toHaveBeenCalledWith('unmarkdefaultquickview',
                    null, 'stream', null, null, 'ss1', 'quickview', 'channel', 'ch1', null, null, 'ssi1');
            });
            it('should have no parentID if there is channel subview to render', function () {
                FREnv.$rootScope.channelSubViewToRender = ''
                scope.unMarkQuickViewAsDefault();
                expect($http.get).toHaveBeenCalledWith('markQuickViewAsDefault', { params: { 'quickViewId': 'something', 'unMarkDefault': true } });
            });
            it('should call $http.get with markQuickViewsAsDefault when scope.views have propery of default and res.status is equal to success', function () {
                scope.unMarkQuickViewAsDefault();
                expect($http.get).toHaveBeenCalledWith('markQuickViewAsDefault', expect.anything());
            });
            it('should not call succesMessage if response was not succesful', function () {
                resforget = {
                    status: 'FAIL',
                };
                scope.unMarkQuickViewAsDefault();
                expect(successMessageSeachAdded).not.toHaveBeenCalled();
            });
            it('should  views default to be false', function () {
                scope.unMarkQuickViewAsDefault();
                expect(scope.views[0]['default']).toBe(false)
            })
            it('should  all resDef to be true', function () {
                scope.unMarkQuickViewAsDefault();
                expect(scope.allResMarkDef).toBe(true)
            })
            it('should expect successmesage to have been added', function () {
                scope.unMarkQuickViewAsDefault();
                expect(successMessageSeachAdded).toHaveBeenCalledWith('quick.view.saved.default')
            })
        });
        describe('markQuickViewAsDefault', function () {
            let id = 'something';
            it('should have no parentID if there is channel subview', function () {

                FREnv.$rootScope.channelSubViewToRender = ''
                scope.markQuickViewAsDefault(id);
                expect($http.get).toHaveBeenCalledWith('markQuickViewAsDefault', { params: { 'quickViewId': 'something', 'markAsDefault': true } });
            });
            it('should call usage Tracking', function () {
                FREnv.$rootScope.channelSubViewToRender = 'channelSRV'
                scope.markQuickViewAsDefault(id);
                expect(usageTrackingCall).toHaveBeenCalledWith('savedefaultquickview',
                    'something', 'stream', null, null, 'ss1', 'quickview', 'channel', 'ch1', null, null, 'ssi1');
            });

            it('should not call succesMessage if response was not succesful', function () {
                resforget = {
                    status: 'FAIL',
                };
                scope.markQuickViewAsDefault(id);
                expect(successMessageSeachAdded).not.toHaveBeenCalled();
            });
            it('should  views default to be false', function () {
                scope.markQuickViewAsDefault(id);
                expect(scope.views[0]['default']).toBe(true)
            })

            it('should not set default view to true if view.id is not equal to id ', function () {
                id = 'id';
                scope.markQuickViewAsDefault(id);
                expect(scope.views[0]['default']).toEqual(false);
            });
            it('should not keep all response as default if view id is  equal to id  ', function () {
                id = 'something';
                scope.markQuickViewAsDefault(id);
                expect(scope.allResMarkDef).toEqual(false);
            });
            it('should expect successmesage to have been added', function () {
                scope.markQuickViewAsDefault(id);
                expect(successMessageSeachAdded).toHaveBeenCalledWith('quick.view.saved.default')
            });
        });
        describe('deleteQuickViews', function () {
            let id = 'something';
            beforeEach(function () {
                body.append('<div class="jq-deletequickview"></div>')
            })
            afterEach(function () {
                $('.jq-deletequickview').remove()
            })
            it('should show toggle class on click', function () {
                body.append('<span id="over-lay"> </span>')
                body.append('<span id="jq-qv-chnl-popup"> </span>')
                scope.deleteQuickViews(id);
                $('.jq-deletequickview').unbind('click');
                expect($('#jq-qv-chnl-popup').css('display')).toEqual('');
            })
            it('should show toggle class on click', function () {
                body.append('<span id="over-lay"> </span>')
                body.append('<span id="jq-qv-chnl-popup"> </span>')
                scope.deleteQuickViews(id);
                $('.jq-deletequickview').click();
                expect($('#over-lay').css('display')).toEqual('none');
            })

            it('should call usage Tracking', function () {
                scope.deleteQuickViews(id);
                $('.jq-deletequickview').click();
                expect(usageTrackingCall).toHaveBeenCalledWith('deletequickview',
                    'something', 'stream', null, null, 'ss1', 'quickview', 'channel', 'ch1', null, null, 'ssi1');
            });
            it('should call $http.get with deleteQuickView', function () {
                scope.selectedQuickView = {
                    id: 'something',
                };
                scope.deleteQuickViews(id);
                $('.jq-deletequickview').click();
                // Assert
                expect($http.get).toHaveBeenCalledWith('deleteQuickView', { params: { 'quickViewIds': 'something', 'channelId': 1, 'shareId': '1c' } })
            });
            it('should not call successMessage if there is no response', function () {
                resforget = '';
                scope.deleteQuickViews(id);
                $('.jq-deletequickview').click();
                expect(successMessageSeachAdded).not.toHaveBeenCalled();
            });
            it('should expect successmesage to have been added', function () {
                resforget = 'Success';
                scope.deleteQuickViews(id)
                $('.jq-deletequickview').click();
                expect(successMessageSeachAdded).toHaveBeenCalledWith('quick.view.delete')
            });
            it('should not remove quick view if id is not equal to views id', function () {
                id = 'id';
                scope.selectedQuickView = {
                    id: 'something',
                };
                scope.removeQuickViewFilter = jest.fn();

                scope.deleteQuickViews(id);
                $('.jq-deletequickview').click();
                expect(scope.removeQuickViewFilter).not.toHaveBeenCalled();
            });
            it('should not remove quick view if id is not equal to selectedQuickView id', function () {
                id = 'something';
                scope.selectedQuickView = {
                    id: 'id',
                };

                scope.removeQuickViewFilter = jest.fn();
                scope.deleteQuickViews(id);
                $('.jq-deletequickview').click();
                expect(scope.removeQuickViewFilter).not.toHaveBeenCalled();
            });
            it('should remove quick view if id is not equal to selectedQuickView id', function () {
                id = 'something';

                scope.selectedQuickView = {
                    id: 'something',
                };
                resforget = {
                    status: 'SUCCESS'
                };
                scope.removeQuickViewFilter = jest.fn();
                scope.deleteQuickViews(id);
                $('.jq-deletequickview').click();
                expect(scope.removeQuickViewFilter).toHaveBeenCalled();
            });
        });
        describe('setTimeOut', function () {
            beforeEach((function(){
                $('#jq-qv-chnl-popup').remove();
                $('.jq-m-qv').remove();
                $('body').removeClass('jq-fr-default');
                $.fn.extend({
                    frvscroll: function (x) { }
                });
                $('body').append('<div class="jq-filter-scroll-mqv"> </div>')
                $('.jq-filter-scroll-mqv').frvscroll({ 'load': 'none', 'touch': true, 'fadeScrollbars': false, 'scrollbars': 'custom' })
           
            }));
     
            it('should off', inject(function ($timeout) {
                $timeout.flush();
                $('body').append('<div id="jq-m-qv"> </div>');
                $('body').append('<div id="jq-qv-chnl-popup"> </div>');
                $('body').addClass('jq-fr-default');
                $('body').unbind('click.mqv');
                expect(manageQuickViewDone).not.toHaveBeenCalled();
    
            }));
            it('should on', inject(function ($timeout) {
                $timeout.flush();
                $('body').trigger('click.mqv');
                expect(manageQuickViewDone).toHaveBeenCalled();
            }));
            it('should expect usageTracking call to have been called with or without clicking', inject(function($timeout){
                $timeout.flush();
                expect(usageTrackingCall).toHaveBeenCalledWith(
                    'managequickview', null, 'stream', null, null, 'ss1', 'quickview',
                    'channel', 'ch1',
                    null, null, 'ssi1'
              
                )
     
                }))

        });

    })
})