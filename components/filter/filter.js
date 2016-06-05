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
            onApply: '=',
            onRemoveApplied: '='
        }
    };
}

class filterController {
    constructor () {

    }
    onEnter ($event, value, by = 'EVERYWHERE') {
        if ($event.keyCode !== 13) {
            return;
        }
        this.onApply({
            value,
            by
        }, this.applied);
    }
    onFilterChange (value, by = 'EVERYWHERE') {
        this.onChange({
            value,
            by
        },  this.applied)
    }
}