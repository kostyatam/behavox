'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngRedux from 'ng-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from './reducers';
import {actionsService} from './actions';
import ListController from './controllers/listController';
import * as components from './components';
import router from './router';

let app = angular.module('app', [ngRedux, uiRouter])
    .service('actionsService', actionsService)
    .controller('ListController', ListController)
    .directive('pagination', components.pagination)
    .directive('emailsToShow', components.emailsToShow)
    .config(($ngReduxProvider, $stateProvider, $urlRouterProvider) => {
        $ngReduxProvider.createStoreWith(rootReducer, [thunk, createLogger()]);
        router($stateProvider, $urlRouterProvider);
    })