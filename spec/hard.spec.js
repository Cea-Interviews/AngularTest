/* eslint-disable no-undef */
const $ = require('jquery');
require('angular/angular.min');
require('angular-mocks');
require('../src/hard');

describe('hard.js', function () {
    'use strict';
    let $scope;
    let $rootScope;
    let $compile;
    let $http;
    let resforget;
    let element;

    beforeAll(function () {
        global.FREnv = {HTML_BASE_URL: ''};
        global.successMessageSeachAdded = function (x) {};
        global.usageTrackingCall = function (x) {};
        global.getShareByUserTrack = function (x) {
            return {
                ssi: 'abc',
            };
        };
        global.manageQuickViewDone = function () {
        };
     
    });
    describe('manageQuickViews directive', function () {
        beforeEach(function () {
            // mock the root module
            angular.mock.module('frDirectives');
            // mock the http service
            angular.mock.module(function ($provide) {
                $http = jest.fn().mockImplementation(function () {
                    return $http;
                });

                $http.then = jest.fn().mockImplementation(function (fn) {
                    fn({});
                    return $http;
                });
            
                $http.catch = jest.fn().mockReturnValue($http);
                $http.get = jest.fn();
                $http.post = jest.fn().mockReturnValue($http);
                $http.success = $http.error = $http.post;
                $provide.value('$http', $http);
             
       
           
              
            });
            angular.mock.inject(function (_$compile_, _$rootScope_){
                // inject the rootScope
                $rootScope = _$rootScope_;
                // new scope is isolated from parent
                $scope = $rootScope.$new(true);
                // neccessary for linking scope with the template, produces a template function, compiles a html string or dom
                $compile = _$compile_;
                resforget = {
                    status: 'SUCCESS',
                };
                FREnv.$rootScope = {
                    channelSubViewToRender: 'something',
                    channelToRender: {
                        id: 1,
                    },
                };
                $http.get.mockReturnValue({
                    success: jest.fn().mockImplementation(function (fn) {
                        fn(resforget);
                        return $http;
                    }),
                    finally: jest.fn().mockImplementation(function (fn) {
                        fn({});
                        return $http;
                    }),
                });
            
            });
        });
        describe('Initialization', function () {
            it('should be initialized successfully', function () {
                // Arrange
                $scope.views = [
                    {
                        id: 'something',
                        default: 'default',
                    },
                ];
                element = angular.element(
                    '<manage-quick-views views="views" is-mobile-view="isMobileView" remove-quick-view-filter="removeQuickViewFilter" update-stream-quick-view "updateStreamQuickView" selected-quick-view="selectedQuickView"></manage-quick-views>'
                );

                $compile(element)($scope);
                // get all the scope for that diretive
                const scope = element.isolateScope();
                // Act
                scope.$digest();
                //jasmine.clock().tick(500);

                // Assert
                expect(element).toBeDefined();
            });
        });
        describe('Scope Functions', function () {
            let element;
            let scope;
            let body;
            const id = 'id';
            beforeEach(function () {
                $scope.views=[{
                    id:'something',
                    default:'default',
                }];
                element = angular.element(
                    '<manage-quick-views views="views" is-mobile-view="isMobileView" remove-quick-view-filter="removeQuickViewFilter" update-stream-quick-view "updateStreamQuickView" selected-quick-view="selectedQuickView"></manage-quick-views>'
                );
                $compile(element)($scope);
                $scope.$digest();
                scope = element.isolateScope();
                scope.$apply();
                body = $('body');
            });
            describe('rename', function () {
                it('should hide display of class jq-name-id', function () {
                    // Arrange
                    body.append('<div class="jq-name-id"> </div>');
                    // Act
                    scope.rename(id);
                    expect($('.jq-name-id').css('display')).toEqual('none');
                });
                it('should show display of class jq-tb-a-id', function () {
                    // Arrange
                    body.append('<div class="jq-tb-a-id"> </div>');
                    // Act
                    scope.rename(id);
                    expect($('.jq-tb-a-id').css('display')).toEqual('block');
                });
                it('should put focus on class jq-tb-id', function () {
                    // Arrange
                    body.append('<div class="jq-tb-id"> </div>');
                    // Act
                    scope.rename(id);
                    expect($('.jq-tb-id')).toHaveProperty('focus');
                });
            });
            describe('enter', function () {
                beforeAll(function () {
                    $('.jq-tb-id').remove();
                });
                it('should blur class jq-tb-id', function () {
                    body.append('<div class="jq-tb-id"> </div>');
                    // Act
                    scope.enter(id);
                    expect($('.jq-tb-id')).toHaveProperty('blur');
                });
            });
            describe('renameText', function () {
                let event;
                beforeEach(function () {
                    $('.jq-tb-a-id').remove();
                    $('.jq-name-id').remove();
                    event = {
                        target: {
                            _id: id,
                        },
                        stopPropagation: function () {},
                    };
                });
                it('should show display of class jq-name-id', function () {
                    // Arrange
                    body.append('<div class="jq-name-id"> </div>');
                    // Act
                    scope.renameText(event);
                    expect($('.jq-name-id').css('display')).toEqual('block');
                });
                it('should hide display of class jq-tb-a-id', function () {
                    // Arrange
                    body.append('<div class="jq-tb-a-id"> </div>');
                    // Act
                    scope.renameText(event);
                    expect($('.jq-tb-a-id').css('display')).toEqual('none');
                });
                it('should call the scope.updateStreamQuickView', function () {
                    scope.updateStreamQuickView = jest.fn();
                    scope.renameText(event);
                    expect(scope.updateStreamQuickView).toHaveBeenCalled();
                });
            });
            describe('allResMarkDef', function () {
                it('should not change the value if their is no default property of view', function(){
                    $scope.views=[{
                        id:'something',
                    }];
                    element = angular.element(
                        '<manage-quick-views views="views" is-mobile-view="isMobileView" remove-quick-view-filter="removeQuickViewFilter" update-stream-quick-view "updateStreamQuickView" selected-quick-view="selectedQuickView"></manage-quick-views>'
                    );
                    $compile(element)($scope);
                    expect(element.isolateScope().allResMarkDef).toBe(true);
                });
              
               
           
            });
            describe('unMarkQuickViewAsDefault', function () {
                it('should quickviewID to be null if scope.views has no property default',function(){
                    scope.views = [{
                        id: 'something',
                        default:'default',
                    
                    }];
                    FREnv.$rootScope = {
                        channelToRender: {
                            id: 1,
                            channelType:'channel'
                        },
                    };
                    window.getShareByUserTrack=jest.fn().mockReturnValue({
                        ss: 'ss1',
                        ssi: 'ssi1',
                    });
                    FREnv.channelPrefix='ch';
                    window.usageTrackingCall = jest.fn();
                    scope.unMarkQuickViewAsDefault();
                    expect(usageTrackingCall).toHaveBeenCalledWith('unmarkdefaultquickview', 
                     'something','stream', null, null ,'ss1', 'quickview','channel', 'ch1',null, null, 'ssi1');
                });
                it('should quickviewID to be null if scope.views has no property default',function(){
                    scope.views = [{
                        id: 'something',
                    
                    }];
                    scope.unMarkQuickViewAsDefault();
                    expect($http.get).toHaveBeenCalledWith('markQuickViewAsDefault', {params: {  'parentChannelId': 1, 'quickViewId': null, 'unMarkDefault': true}});
                });
                it('should have no parentID if there is channel subview', function(){
                    scope.views = [{
                        id: 'something',
                        default:'default',
                    
                    }];
                    FREnv.$rootScope = {
                        channelToRender: {
                            id: 1,
                        },
                    };
                    scope.unMarkQuickViewAsDefault();
                    expect($http.get).toHaveBeenCalledWith('markQuickViewAsDefault', {params: { 'quickViewId': 'something', 'unMarkDefault': true}});
                });
                it('should call $http.get with markQuickViewsAsDefault when scope.views have propery of default and res.status is equal to success', function () {
                    scope.views = [{
                        id: 'something',
                        default:'default',
                    
                    }];
                    scope.unMarkQuickViewAsDefault();
                    expect($http.get).toHaveBeenCalledWith(
                        'markQuickViewAsDefault',
                        expect.anything()
                    );
                });
                it('should not call succesMessage if response was not succesful', function(){
                    scope.views = [{
                        id: 'something',
                        default:'default',
                    
                    }];
                    resforget={
                        status: 'FAIL',
                    };
                    scope.unMarkQuickViewAsDefault();
                    window.successMessageSeachAdded = jest.fn();
                    expect(successMessageSeachAdded).not.toHaveBeenCalled();
                });
          
            });
            describe('markQuickViewAsDefault', function () {
                let id = 'something';
                it('should have no parentID if there is channel subview', function(){
            
                    FREnv.$rootScope = {
                        channelToRender: {
                            id: 1,
                        },
                    };
                    scope.markQuickViewAsDefault(id);
                    expect($http.get).toHaveBeenCalledWith('markQuickViewAsDefault', {params: { 'quickViewId': 'something', 'markAsDefault': true}});
                });
                it('should call $http.get with markQuickViewsAsDefault when scope.views have propery of default and res.status is equal to success and scope.view.id equal to id', function () {
                    scope.views = [{
                        id: 'something',
                        default:'default',
                    
                    }];
                    scope.markQuickViewAsDefault(id);
                    expect($http.get).toHaveBeenCalledWith(
                        'markQuickViewAsDefault',
                        expect.anything()
                    );
                });
                it('should not call succesMessage if response was not succesful', function(){
                    resforget={
                        status: 'FAIL',
                    };
                    window.successMessageSeachAdded = jest.fn();
                    scope.markQuickViewAsDefault(id);
                    expect(successMessageSeachAdded).not.toHaveBeenCalled();
                });
                it('should not set default view to true if view.id is not equal to id ', function(){
                    id = 'id';
                    scope.views = [{
                        id: 'something',
                        default:'default',
                    
                    }];
                    scope.markQuickViewAsDefault(id);
                    expect(scope.views[0]['default']).toEqual(false);
                });
            });
            describe('deleteQuickViews', function () {
                let id = 'something';
                it('should call $http.get with deleteQuickView when scope.views exists and scope.views.id and scope.selectedQuickView.id is equal to id', function () {
                    scope.views = [{
                        id: 'something',
                        default:'default',
                    
                    }];
                    body.append('<div class="jq-deletequickview"></div>');
                    scope.selectedQuickView = {
                        id: 'something',
                    };
                    scope.deleteQuickViews(id);
                    $('.jq-deletequickview').click();

                    // Assert
                    expect($http.get).toHaveBeenCalledWith(
                        'deleteQuickView',
                        expect.anything()
                    );
                });
                it('should not call successMessage if there is no response',function(){
                    scope.views = [{
                        id: 'something',
                        default:'default',
                    
                    }];
                    body.append('<div class="jq-deletequickview"></div>');
                    scope.selectedQuickView = {
                        id: 'something',
                    };
                    resforget='';
                    window.successMessageSeachAdded = jest.fn();
                    scope.deleteQuickViews(id);
                    $('.jq-deletequickview').click();
                    expect(successMessageSeachAdded).not.toHaveBeenCalled();
                });
                it('should not remove quick view if id is not equal to views id',function(){
                    id = 'id';
                    scope.views = [{
                        id: 'something',
                        default:'default',
                    
                    }];
                    body.append('<div class="jq-deletequickview"></div>');
                    scope.selectedQuickView = {
                        id: 'id',
                    };
                    resforget= {
                        status: 'FAIL'
                    };
                    scope.removeQuickViewFilter = jest.fn();
   
                    scope.deleteQuickViews(id);
                    $('.jq-deletequickview').click();
                    expect(scope.removeQuickViewFilter).not.toHaveBeenCalled();
                });
                it('should not remove quick view if id is not equal to selectedQuickView id',function(){
                    id = 'something';
                    scope.views = [{
                        id: 'something',
                        default:'default',
                    
                    }];
                    body.append('<div class="jq-deletequickview"></div>');
                    scope.selectedQuickView = {
                        id: 'id',
                    };
                    resforget= {
                        status: 'SUCCESS'
                    };
                    scope.removeQuickViewFilter = jest.fn();
                    scope.deleteQuickViews(id);
                    $('.jq-deletequickview').click();
                    expect(scope.removeQuickViewFilter).not.toHaveBeenCalled();
                });
            });
            describe('setTimeOut', function(){
                beforeEach(inject(function($timeout){
                    $('#jq-qv-chnl-popup').remove();
                    $('.jq-m-qv').remove();
                    $('body').removeClass('jq-fr-default');
                    window.manageQuickViewDone = jest.fn();
                    window.getShareByUserTrack=jest.fn().mockReturnValue({
                        ss: 'ss1',
                        ssi: 'ssi1',
                    });
        
                    window.usageTrackingCall=jest.fn();
                    $.fn.extend({
                        frvscroll: jest.fn()
                    });
                    $timeout.flush();
                }));
                it('should not log the timeout', function(){
                    
                    $('body').append('<div id="jq-qv-chnl-popup"> </div>');
                    $('body').css('width', '200px'); 
                    $('#jq-qv-chnl-popup').css('width', '200px'); 
                    $('body').trigger('click.mqv');
                    // expect(manageQuickViewDone).not.toHaveBeenCalled();
                });
                it('should on', function(){
                    $('body').append('<div id="jq-m-qv"> </div>');
                    $('body').append('<div id="jq-qv-chnl-popup"> </div>');
                    $('body').addClass('jq-fr-default');
                    $('body').trigger('click.mqv');
                    expect(manageQuickViewDone).not.toHaveBeenCalled();
                });

                it('should on', function(){
                    $('body').trigger('click.mqv');
                    expect(manageQuickViewDone).toHaveBeenCalled();
                });
             
            });
        });
   
    });
});
