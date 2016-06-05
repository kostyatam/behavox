export default function emailView () {
    return {
        restrict: 'E',
        controllerAs: 'vm',
        controller: emailViewController,
        template: require('./email-view.html'),
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
            if (!email) return;
            this.from = email.from;
            this.to = email.to[0];
            this.cc = email.cc.join('; ');
            this.bcc = email.bcc.join('; ');
            this.others = email.to.slice(1).join('; ');
            this.subject = email.subject;
            this.body = $sce.trustAsHtml(email.body);
        })
    }
}