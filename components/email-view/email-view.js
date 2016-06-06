require('./email-view.styl');
export default function emailView () {
    return {
        restrict: 'E',
        controllerAs: 'vm',
        controller: emailViewController,
        template: require('./email-view.html'),
        replace: true,
        scope: {
            email: '='
        },
        bindToController: true
    };
}

class emailViewController {
    constructor ($scope, $sce) {
        this.trust = $sce.trustAsHtml;
        $scope.$watch(() => this.email, (email) => {
            if (!email) {
                this.show = false;
                return
            };
            this.show = true;
            this.from = email.from;
            this.to = email.to[0];
            this.cc = email.cc.join('; ');
            this.bcc = email.bcc.join('; ');
            this.others = email.to.slice(1).join('; ');
            this.showOthers = false
            this.subject = email.subject || 'no title';
            this.body = $sce.trustAsHtml(email.body);
            this.humanDate =email.humanDate;
        })
        this.toggleOthers = this.toggleOthers.bind(this);
    }
    toggleOthers () {
        if (!this.others.length) return;
        this.showOthers = !this.showOthers;
    }
}