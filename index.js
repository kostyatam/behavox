'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngSinitize from 'angular-sanitize';
import ngRedux from 'ng-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from './reducers';
import {actionsService} from './actions';
import directives from './components';
import router from './router';

let app = angular.module('app', [ngRedux, uiRouter, ngSinitize])
    .service('actionsService', actionsService)
    .directive('pagination', directives.pagination)
    .directive('emailList', directives.emailList)
    .directive('mainPage', directives.mainPage)
    .directive('emailFilter', directives.filter)
    .directive('emailView', directives.emailView)
    .config(($ngReduxProvider, $stateProvider, $urlRouterProvider) => {
        $ngReduxProvider.createStoreWith(rootReducer, [thunk, createLogger()]);
        router($stateProvider, $urlRouterProvider);
    })