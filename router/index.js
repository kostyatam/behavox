'use strict';

export default router;

function router ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('index', {
            url: '/',
            template: '<main-page></main-page>'
        })
}