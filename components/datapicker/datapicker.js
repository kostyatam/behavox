import range from 'lodash/range';

export default function datapicker () {
    return {
        restrict: 'E',
        controllerAs: 'vm',
        controller: datapickerController,
        template: require('./datapicker.html'),
        replace: true,
        scope: {
            current: '=',
            min: '=',
            max: '=',
            onChange: '='
        },
        bindToController: true
    };
}

class datapickerController {
    constructor ($scope) {
        $scope.$watch(()=> this.min, (newValue, oldValue) => {
            if (newValue === oldValue) return;
            this.init();
        });
        $scope.$watch(()=> this.max, (newValue, oldValue) => {
            if (newValue === oldValue) return;
            this.init();
        });
        $scope.$watch(()=> this.current, (newValue, oldValue) => {
            if (newValue === oldValue) return;
            this.init();
        });
        this.onDateChange.bind(this);
    }
    init () {
        let fromDate = new Date(this.min);
        let toDate = new Date(this.max);
        let currentDate = (this.current) ? new Date(this.current) : fromDate;
        this.setPicker(fromDate, toDate, currentDate);
    }
    onDateChange () {
        let fromDate = new Date(this.min);
        let toDate = new Date(this.max);
        let currentDate = new Date(this.year, this.month - 1, (this.day <= this.daysInMonth(this.month, this.year)) ? this.day : this.daysInMonth(this.month, this.year));
        if (currentDate < fromDate) {
            currentDate = fromDate;
        }
        if (currentDate > toDate) {
            currentDate = toDate;
        }
        this.setPicker(fromDate, toDate, currentDate);
        this.onChange(currentDate.getTime());
    }

    daysInMonth (month,year) {
        return (new Date(year, month, 0)).getDate();
    }

    getShowingMonth (from, to, current) {
        if (from.getFullYear() === to.getFullYear()) {
            return range(from.getMonth() + 1, to.getMonth() + 2);
        }
        if (current.getFullYear() === to.getFullYear()) {
            return range(1, to.getMonth() + 2)
        }
        if (current.getFullYear() === from.getFullYear()) {
            return range(from.getMonth() + 1, 13)
        }
        return range(1, 13);
    }

    getShowingDays (from, to, current) {
        let daysInCurrentMonth = this.daysInMonth(current.getMonth() + 1, current.getFullYear());
        if (from.getFullYear() === to.getFullYear() && from.getMonth() === to.getMonth()) {
            return range(from.getDate(), to.getDate() + 1);
        }
        if (current.getFullYear() === to.getFullYear() && current.getMonth() === to.getMonth()) {
            return range(1, to.getDate() + 1)
        }
        if (current.getFullYear() === from.getFullYear() && current.getMonth() === to.getMonth()) {
            return range(from.getDate(),  daysInCurrentMonth + 1)
        }

        return range(1, daysInCurrentMonth + 1);
    }

    setPicker (from, to, current) {
        this.months = this.getShowingMonth(from, to, current);
        this.days = this.getShowingDays(from, to, current);
        this.years = range(from.getFullYear(), to.getFullYear() + 1);
        this.day = current.getDate();
        this.month = current.getMonth() + 1;
        this.year = current.getFullYear();
    }
}