export default function pagination () {
    return {
        restrict: 'E',
        controllerAs: 'paging',
        controller: PaginationController,
        template: require('./pagination.html'),
        scope: {
            pages: '=',
            current: '=',
            emails: '=',
            onChange: '='
        },
        bindToController: true
    };
}

class PaginationController {
    constructor ($scope) {
        $scope.$watch(() => this.emails, (newValue, oldValue) => {
            if (newValue === oldValue) return;
            let {pages, emails, current} = this;
            this.onChange({
                pages,
                emails,
                current
            })
        });
    }
    range (num) {
        let arr = [];
        for(let i = num; i > 0; i-=1) {
            arr.push(i);
        }
        return arr;
    }
}