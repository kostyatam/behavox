'use strict';

export default router;

function router ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('index', {
            url: '/',
            controller: 'ListController',
            controllerAs: 'vm',
            template: '<h1><emails-to-show emails-to-show="vm.emailsToShow" emails="vm.emails.items" page="vm.pagination.current" offset="vm.pagination.offset" on-change="vm.showEmails"></emails-to-show><pagination pages="vm.pagination.pages" current="vm.pagination.current" on-change="vm.changePage"></pagination></h1>'
        })
}