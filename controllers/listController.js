'use strict';

export default class ListController {
    constructor ($ngRedux, actionsService) {

        let unsubscribe = $ngRedux.connect(this.mapStateToThis, actionsService)((nextState, actionsService) => {
            if (!nextState.emails.items) {
                actionsService
                    .fetchEmails();
            }
            Object.assign(this, nextState, actionsService);
        });
        this.changePage = actionsService.changePage;
        this.showEmails = actionsService.showEmails;
    }
    mapStateToThis (state) {
        let {emailsToShow, emails, pagination} = state;
        return {
            emailsToShow,
            emails,
            pagination
        }
    }
}
