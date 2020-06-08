const $ = require('jquery');
var app = angular.module('frDirectives', []);

angular.module('frDirectives').directive('manageQuickViews', function() {
    return {
        restrict: 'E',
        scope: {
            'views': '=',
            'isMobileView': '=',
            'removeQuickViewFilter': '&',
            'updateStreamQuickView': '&',
            'selectedQuickView': '='
        },
        controller: ['$scope', '$http' ,'$timeout', function($scope, $http, setTimeout) {

            $scope.rename = function(id) {
                $('.jq-name-' + id).hide();
                $('.jq-tb-a-' + id).show();
                $('.jq-tb-' + id).focus();
            };

            $scope.enter = function(id) {
                $('.jq-tb-' + id).blur();
            };

            $scope.renameText = function(event) {
                var _this = $(event.target);
                var id = _this.attr('_id');
                $('.jq-tb-a-' + id).hide();
                $('.jq-name-' + id).show();

                $scope.updateStreamQuickView({'event': event, 'id': id});
            };

            $scope.allResMarkDef = true;
            for (var i in $scope.views) {
                
                var view = $scope.views[i];
                if (view['default']) {
                    $scope.allResMarkDef = false;
                    break;
                }
            }

            $scope.unMarkQuickViewAsDefault = function() {

                var id = null;
                for (var i in $scope.views) {
                    var view = $scope.views[i];
                    if (view['default']) {
                        id = view.id;
                        break;
                    }
                }

                var params = {'quickViewId': id, 'unMarkDefault': true};
                if (FREnv.$rootScope.channelSubViewToRender) {
                    params.parentChannelId = FREnv.$rootScope.channelToRender.id;
                }
                var shareInfo = getShareByUserTrack(FREnv.$rootScope.channelToRender);
                usageTrackingCall(
                    'unmarkdefaultquickview', params.quickViewId, 'stream', null, null, shareInfo.ss, 'quickview',
                    FREnv.$rootScope.channelToRender.channelType, FREnv.channelPrefix + FREnv.$rootScope.channelToRender.id,
                    null, null, shareInfo.ssi);
                $http.get('markQuickViewAsDefault', {'params': params})
                    .success(function(res) {
                        if (res && res.status == 'SUCCESS') {
                            for (var i in $scope.views) {
                                var view = $scope.views[i];
                                view['default'] = false;
                            }
                            $scope.allResMarkDef = true;
                            successMessageSeachAdded('quick.view.saved.default');
                        }
                    });
            };

            $scope.markQuickViewAsDefault = function(id) {
                var params = {'quickViewId': id, 'markAsDefault': true};
                if (FREnv.$rootScope.channelSubViewToRender) {
                    params.parentChannelId = FREnv.$rootScope.channelToRender.id;
                }
                var shareInfo = getShareByUserTrack(FREnv.$rootScope.channelToRender);
                usageTrackingCall(
                    'savedefaultquickview', params.quickViewId, 'stream', null, null, shareInfo.ss, 'quickview',
                    FREnv.$rootScope.channelToRender.channelType, FREnv.channelPrefix + FREnv.$rootScope.channelToRender.id,
                    null, null, shareInfo.ssi);
                $http.get('markQuickViewAsDefault', {'params': params})
                    .success(function(res) {
                        if (res && res.status == 'SUCCESS') {
                            for (var i in $scope.views) {
                                var view = $scope.views[i];
                                view['default'] = false;
                                if (view.id == id) {
                                    $scope.allResMarkDef = false;
                                    view['default'] = true;
                                }
                            }
                            successMessageSeachAdded('quick.view.saved.default');
                        }
                    });
            };

            $scope.deleteQuickViews = function(id) {
                $('#over-lay, #jq-qv-chnl-popup').show();
                $('.jq-deletequickview').off('click').on('click', function() {
                    $('#over-lay, #jq-qv-chnl-popup').hide();

                    //Usagetracking
                    var shareInfo = getShareByUserTrack(FREnv.$rootScope.channelToRender);
                    usageTrackingCall(
                        'deletequickview', id, 'stream', null, null, shareInfo.ss, 'quickview',
                        FREnv.$rootScope.channelToRender.channelType, FREnv.channelPrefix + FREnv.$rootScope.channelToRender.id,
                        null, null, shareInfo.ssi);

                    $http.get('deleteQuickView', {params: {
                        quickViewIds: id,
                        channelId: FREnv.$rootScope.channelToRender.id,
                        shareId: FREnv.$rootScope.channelToRender.shareId,
                    }})
                        .success(function(res) {
                            if (res) {
                                successMessageSeachAdded('quick.view.delete');
                                var views = $scope.views;
                                for (var i in views) {
                                    if (views[i].id == id) {
                                        $scope.views.splice(i, 1);
                                        var sqv = $scope.selectedQuickView;
                                        if (sqv && sqv.id == id) {
                                            $scope.removeQuickViewFilter();
                                        }
                                        return;
                                    }
                                }
                            }
                        });
                });
            };
            var fn = function() {
                $('.jq-filter-scroll-mqv').frvscroll({
                    'load': 'none','touch': true,'fadeScrollbars': false,'scrollbars': 'custom'});
                $('body').off('click.mqv');
    
                $('body').on('click.mqv',function(e) {
                    if ($('#jq-qv-chnl-popup').is(':visible')) {
                        return;
                    }
                    var _target = $(e.target);
                
                    if (_target.closest('#jq-m-qv').length === 0 && _target.closest('#jq-qv-chnl-popup').length === 0 &&
                !$(e.target).hasClass('jq-fr-default')) {
                    
                        manageQuickViewDone();
                    }
                });
                //Usagetracking
                var shareInfo = getShareByUserTrack(FREnv.$rootScope.channelToRender);
                usageTrackingCall(
                    'managequickview', null, 'stream', null, null, shareInfo.ss, 'quickview',
                    FREnv.$rootScope.channelToRender.channelType, FREnv.channelPrefix + FREnv.$rootScope.channelToRender.id,
                    null, null, shareInfo.ssi);
            };
            setTimeout(fn , 100);
        }
        ],


        templateUrl: function() {
            return FREnv.HTML_BASE_URL + '/manage-quick-view.html';
        }
    };
});

