export default function filter () {
    return {
        restrict: 'E',
        controllerAs: 'vm',
        controller: filterController,
        template: require('./filter.html'),
        bindToController: true,
        scope: {
            filter: '=',
            applied: '=',
            matches: '=',
            onChange: '=',
            onApply: '='
        }
    };
}

class filterController {
    constructor () {

    }
    onEnter ($event, filter) {
        if ($event.keyCode !== 13) {
            return;
        }
        debugger
        this.onApply(filter)
    }
}