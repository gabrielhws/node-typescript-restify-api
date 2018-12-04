import config from '../config/config';
import * as mandrill from 'mandrill-api';
import { isNil } from 'lodash';
import * as swig from 'swig';
import * as async from 'async';
import * as path from 'path';
import * as log4js from 'log4js';
import * as juice from 'juice';

const log = log4js.getLogger('mandrill');
const mandrill_client = new mandrill.Mandrill(config.mandrill.key);

class Mandrill {
  send = (mail): Promise<any> => {
    return new Promise((resolve, reject) => {
      log.trace('Mandrill has been started');
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
              referer: mail.body.referer,
              body: emailHTML,
            };

            if (process.env.NODE_ENV === 'production') {
              mandrill_client.messages.send(
                {
                  message: {
                    to: [mail.to],
                    from_email: mail.from,
                    from_name: mail.from_name,
                    subject: mail.subject,
                    html: emailHTML,
                  },
                },
                (result) => {
                  resolve(result);
                },
                (error) => {
                  // Mandrill returns the error as an object with name and message keys
                  log.debug(
                    `A mandrill error occurred: ${JSON.stringify(error)}`
                  );
                  reject(error);
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
        log.warn('Could not send mandrill mail [%s]', JSON.stringify(error));
        reject(error);
      }
    });
  };
}

export default new Mandrill();
