const $ = require('jquery')
const easy = require('../src/easy')

describe('easy', function(){
    beforeAll(function(){
    global.FREnv = {};
    });
    describe('setViewMode', function(){
        let trend;
        beforeEach(function(){
            $('body').append('<div class="jq-trending-analytics"></div>');
            trend = $('.jq-trending-analytics');
        });
        afterEach(function(){
            trend.remove()
        })
        it('it should remove all previous classes', function(){
            const mode = 'abc'
            trend.addClass('schlum-details schlum-content schlum-about')
            easy.setViewMode(mode)
            expect(trend.prop('className').split(' ').length).toEqual(2)
        })
        it("it should set view mode", function(){
            const mode = 'abc'
            easy.setViewMode(mode)
            expect(trend.hasClass('schlum-abc')).toEqual(true)
        })
     
    })

    describe('getTrendingAnalyticsL2Details', function(){
       let initialGet, initialImage, node;
       beforeAll(function(){
        global.FREnv = {
            token:'',
            email:'',
        };
        });
       beforeEach(function(){
           initialGet = $.get
           $.get = jest.fn().mockImplementation( function(ser, opt, fn){
               fn('<div class="details"></div>')
           })
           initialImage = window.addLoadingImg;
           window.addLoadingImg = jest.fn()
           node = {
               label: '<span>FirstCheck </span>',
               searchToken:'token'
           }
       });
       afterEach(function(){
           $.get = initialGet;
           window.addLoadingImg = initialImage
       })
       it('should have schlum-details class', function(){
           $('body').append('<div class="jq-trending-analytics"> </div>')
            easy.getTrendingAnalyticsL2Details('', node)
            expect($('.jq-trending-analytics').hasClass('schlum-details')).toEqual(true)
       });
       it('entity-name should have a node label', function(){

        $('body').append('<div class="jq-entity-name"> </div>') ;
        easy.getTrendingAnalyticsL2Details('', node);
        expect($('.jq-entity-name').html()).toBe(node.label)
       })
       it('entity-name should have a node label', function(){

        $('body').append('<div class="jq-entity-name"> </div>') ;
        easy.getTrendingAnalyticsL2Details('', node);
        expect(addLoadingImg).toHaveBeenCalledWith($(".jq-schlum-details").html(''), "fr-spnr")
       })
       it('entity-name should have a node label', function(){

        $('body').append('<div class="jq-entity-name"> </div>') ;
        easy.getTrendingAnalyticsL2Details('', node);
        expect($.get).toHaveBeenCalledWith('schlum-trending-analytics-web-result', {
            token: '',
            email: '',
            query: 'token',
            entityName: '<span>FirstCheck </span>'
        }, expect.anything())
     } )
       it('should get trending analytics details', function(){
           $('body').append('<div class="jq-schlum-details"> </div>')
           easy.getTrendingAnalyticsL2Details('', node);
           expect($('.jq-schlum-details').find('.details').length).toBe(1)
       });
       
    })
    
});