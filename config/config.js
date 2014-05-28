var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    notifier = {
        service: 'postmark',
        APN: false,
        email: false,
        actions: ['comment'],
        key: 'POSTMARK_KEY',
        parseAppId: 'PARSE_APP_ID',
        parseApiKey: 'PARSE_MASTER_KEY'
    };

module.exports = {
    development: {
        db: 'mongodb://localhost/wBook_dev',
        root: rootPath,
        notifier: notifier,
        app: {
            name: 'wBook'
        }
    },
    production: {}
};
