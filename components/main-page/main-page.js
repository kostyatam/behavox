require('./main-page.styl');

export default function mainPage () {
    return {
        restrict: 'E',
        controllerAs: 'vm',
        controller: mainPageController,
        template: require('./main-page.html'),
        bindToController: true
    };
}

class mainPageController {
    constructor ($ngRedux, actionsService) {
        let unsubscribe = $ngRedux.connect(this.mapStateToThis, actionsService)((nextState, actionsService) => {
            if (!nextState.cached.length) {
                actionsService
                    .fetchEmails();
            }
            Object.assign(this, nextState, actionsService);
        });
        this.changePage = actionsService.changePage;
        this.changeFilter = actionsService.changeFilter;
        this.addToApplied = actionsService.addToApplied;
        this.removeApplied = actionsService.removeApplied;
        this.chooseEmail = actionsService.chooseEmail;
        this.setDateFrom = actionsService.setDateFrom;
        this.setDateTo = actionsService.setDateTo;
        this.clearDateFilter = actionsService.clearDateFilter;
    }
    mapStateToThis (state) {
        let {emails, pagination} = state;
        return {
            filter: emails.filter,
            applied: emails.applied,
            matches: emails.matches,
            pages: (emails.currentObservable.length > pagination.offset) ? Math.ceil(emails.currentObservable.length / pagination.offset) : 1,
            from: pagination.offset * (pagination.page - 1),
            to: pagination.offset * (pagination.page - 1) + pagination.offset,
            cached: emails.cached,
            observable: emails.currentObservable,
            page: pagination.page,
            offset: pagination.offset,
            chosenEmail: emails.chosenEmail,
            isFetching: emails.isFetching,
            dateFrom: emails.dateFrom,
            dateTo: emails.dateTo,
            dateMax: emails.dateMax,
            dateMin: emails.dateMin
        }
    }
}