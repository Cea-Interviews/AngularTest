
/* eslint-disable no-undef */
const $= require('jquery');
function setViewMode(mode) {
    var modes = ['content', 'details', 'about'];
    var container = $('.jq-trending-analytics');
    for (var i in modes) {
        container.removeClass('schlum-' + modes[i]);
    }
    container.addClass('schlum-' + mode);
}

function getTrendingAnalyticsL2Details(graph, node) {
    var detailsElement = $('.jq-schlum-details').html('');
    $('.jq-entity-name').html(node.label);
    setViewMode('details');
    addLoadingImg(detailsElement, 'fr-spnr');
    $.get(
        'schlum-trending-analytics-web-result',
        {
            token: FREnv.token,
            email: FREnv.email,
            query: node.searchToken,
            entityName: node.label,
        },
        function (html) {
            detailsElement.html(html);
        }
    );
}

exports.setViewMode = setViewMode;
exports.getTrendingAnalyticsL2Details = getTrendingAnalyticsL2Details;
