export default function emailsToShow () {
    return {
        restrict: 'E',
        controllerAs: 'vm',
        controller: emailsToShowController,
        template: require('./email-list.html'),
        scope: {
            emails: '=',
            from: '=',
            to: '=',
            onChange: '=',
            chooseEmail: '='
        },
        bindToController: true
    };
}

class emailsToShowController {
    constructor ($scope) {
    }
}