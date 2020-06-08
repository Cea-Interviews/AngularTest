/* eslint-disable no-undef */
const $ = require('jquery');
const easy = require('../src/easy');

describe('easy', function () {
    beforeAll(() => {
        global.FREnv = {};
    });

    describe('setViewMode', function () {
        it('should fail if mode is not a string', function(){
            const mode = '';
            $('body').append('<div class="jq-trending-analytics"> </div>');
            //Act
            easy.setViewMode(mode);

            //Assert
            expect($('.jq-trending-analytics').hasClass('schlum-')).toEqual(true);
        });
        it('it should set view mode', function () {
            //Arrange
            const mode = 'abc';
            $('body').append('<div class="jq-trending-analytics"> </div>');
            //Act
            easy.setViewMode(mode);

            //Assert
            expect($('.jq-trending-analytics').hasClass('schlum-abc')).toEqual(true);
        });
    });
    describe('getTrendingAnalyticsL2Details', function () {
        let initialGet;
        let initialImage;
        beforeEach(() => {
            initialGet = $.get;
            $.get = function(ser, opt, fn){
                fn('<div class="details"> </div>');
            };
            initialImage = window.addLoadingImg;
            window.addLoadingImg = jasmine.createSpy()
        });
        afterEach(() => {
            $.get = initialGet;
            window.addLoadingImg= initialImage;
        });
        it('should get trending analytics details', function () {
            // Arrange
            const node = {
                label: '<span>FirstCheck </span>',
            };
            $('body').append('<div class="jq-schlum-details"> </div>');
            $('body').append('<div class="jq-entity-name"> </div>');
            //Act
        
            easy.getTrendingAnalyticsL2Details('', node);
            //Assert
            expect($('.jq-entity-name').html()).toBe(node.label);
            expect($('.jq-schlum-details').find('.details').length).toBe(1);
        });
    });
});
