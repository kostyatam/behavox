export default function emailsToShow () {
    return {
        restrict: 'E',
        controllerAs: 'vm',
        controller: emailsToShowController,
        template: require('./emailsToShow.html'),
        scope: {
            emailsToShow: '=',
            emails: '=',
            page: '=',
            offset: '=',
            onChange: '='
        },
        bindToController: true
    };
}

class emailsToShowController {
    constructor ($scope) {
        let watcher = (newValue, oldValue) => {
            if (newValue === oldValue) return;
            this.onChange({
                page: this.page,
                offset: this.offset,
                emails: this.emails
            })
        };
        $scope.$watch(() => this.page, watcher);
        $scope.$watch(() => this.offset, watcher);
        $scope.$watch(() => this.emails, watcher);
    }
}