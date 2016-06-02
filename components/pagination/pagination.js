export default function pagination () {
    return {
        restrict: 'E',
        controllerAs: 'vm',
        controller: PaginationController,
        template: require('./pagination.html'),
        scope: {
            pages: '=',
            page: '=',
            offset: '=',
            onChange: '='
        },
        bindToController: true
    };
}

class PaginationController {
    constructor ($scope) {

    }
    range (num) {
        let arr = [];
        if (!num) return [];
        for(let i = num; i > 0; i-=1) {
            arr.push(i);
        }
        return arr;
    }
}