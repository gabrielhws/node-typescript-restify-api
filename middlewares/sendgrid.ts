import * as sendgrid from '@sendgrid/mail';
import * as log4js from 'log4js';
import config from '../config/config';
import * as swig from 'swig';
import * as async from 'async';
import * as path from 'path';
import { isNil } from 'lodash';
import * as juice from 'juice';

sendgrid.setApiKey(config.sendgrid.key);

const log = log4js.getLogger('sendgrid');

class Sendgrid {
  send = (mail): Promise<any> => {
    return new Promise((resolve, reject) => {
      log.trace('Sendgrid has been started');
      try {
        mail.body.template = {
          lang: process.env.LANG_ENV.replace('-', '_'),
          domain: config.domain,
          page: mail.page,
          env: process.env.NODE_ENV,
        };

        async.waterfall([
          (callback) => {
            swig.renderFile(
              path.resolve(`./src/templates/${mail.page}.html`),
              mail.body,
              (err, emailHTML) => {
                if (!isNil(err) || isNil(emailHTML))
                  log.fatal(
                    'Failed to create the email for %s: %s',
                    mail.page,
                    err.message
                  );
                callback(err, juice(emailHTML));
              }
            );
          },
          (emailHTML) => {
            let message = {
              to: mail.to,
              from: {
                email: mail.from,
                name: mail.from_name,
              },
              subject: mail.subject,
              body: emailHTML,
            };

            if (process.env.NODE_ENV === 'production') {
              sendgrid.send(
                {
                  to: mail.body.to,
                  from: {
                    email: mail.from,
                    name: mail.from_name,
                  },
                  subject: mail.subject,
                  html: emailHTML,
                },
                false,
                (err, result) => {
                  if (!isNil(err)) {
                    log.debug(`A mandrill error occurred: ${err}`);
                    reject(err);
                  }
                  resolve(result);
                }
              );
            } else {
              log.debug(
                `${mail.from_name} <${mail.from}}> -->> [${
                  mail.subject
                }] -->> <${mail.to.email}>`
              );
              log.debug(emailHTML);
              resolve(200);
            }
          },
        ]);
      } catch (error) {
        log.warn('Could not send sendgrid mail [%s]', JSON.stringify(error));
        reject(error);
      }
    });
  };
}

export default new Sendgrid();
