require('./email-view.styl');
export default function emailView () {
    return {
        restrict: 'E',
        controllerAs: 'vm',
        controller: emailViewController,
        template: require('./email-view.html'),
        replace: true,
        scope: {
            email: '=',
            filters: '='
        },
        bindToController: true
    };
}

class emailViewController {
    constructor ($scope, $sce) {
        $scope.$watch(() => this.filters, (newValue) => {
            if (!this.email) return;
            this.cached = Object.assign({}, this.email);
            let to = this.cached.to.slice();
            let cc = this.cached.cc.slice();
            let bcc = this.cached.bcc.slice();
            let from = this.cached.from;
            let body =  this.cached.body;
            let subject = this.cached.subject;
            this.filters.filter((filter) => {
                let {by, value} = filter;
                if (!value) return;
                if (by === 'PERSON') {
                    let index = to.indexOf(value);
                    if (index !== -1) {
                        to[index] = `<span style="color:orange">${value}</span>`;
                        return false;
                    }
                    index = cc.indexOf(value);
                    if (index !== -1) {
                        cc[index] = `<span style="color:orange">${value}</span>`;
                        return false;
                    }
                    index = bcc.indexOf(value);
                    if (index !== -1) {
                        bcc[index] = `<span style="color:orange">${value}</span>`;
                        return false;
                    }

                    if (from == value) {
                        from = `<span style="color:orange">${value}</span>`;
                        return false;
                    }
                    return false;
                }
                return true
            }).map(filter => {
                let {by, value} = filter;
                if (by === 'EVERYWHERE') {
                    to = to.map(email => email.replace(value, `<span style="color:purple">${value}</span>`));
                    from = from.replace(value, `<span style="color:purple">${value}</span>`);
                    cc = cc.map(email => email.replace(value, `<span style="color:purple">${value}</span>`));
                    bcc = bcc.map(email => email.replace(value, `<span style="color:purple">${value}</span>`));
                    subject = subject.replace(new RegExp(value, 'ig'), '<span style="color:purple">$&</span>');
                    body = body.replace(new RegExp(value, 'ig'), '<span style="color:purple">$&</span>');
                }
            });
            this.subject = $sce.trustAsHtml(subject || 'no title');
            this.date = this.cached.humanDate;
            this.to = $sce.trustAsHtml(to.join('; '));
            this.cc = $sce.trustAsHtml(cc.join('; '));
            this.bcc = $sce.trustAsHtml(cc.join('; '));
            this.from = $sce.trustAsHtml(from);
            this.body = $sce.trustAsHtml(body);
        });
    }
    toggleOthers () {
        if (!this.others.length) return;
        this.showOthers = !this.showOthers;
    }
}