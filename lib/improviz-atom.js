'use babel';

import { CompositeDisposable } from 'atom';
import http from 'http';

export default {

  subscriptions: null,

  config: {
    'improvizUrl':  {
      type: 'string',
      default: 'localhost'
    },
    'improvizPort':  {
      type: 'string',
      default: '3000'
    }
  },

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'improviz-atom:send': () => this.send()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'improviz-atom:toggle-text': () => toggleTextDisplay()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  send() {
    console.log('Sending code to improviz');
    const text = getProgramText()
    sendProgram(text)
  }


};

function getProgramText() {
  let editor
  if (editor = atom.workspace.getActiveTextEditor()) {
    return editor.getText()
  }
  return '';
}

function sendProgram(programText) {
  const host = atom.config.get('improviz.improvizUrl');
  const port = atom.config.get('improviz.improvizPort');
  var post_options = {
      host: host,
      port: port,
      path: '/read',
      method: 'POST',
  };

  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
  });

  // post the data
  post_req.write(programText);
  post_req.end();

}

function toggleTextDisplay() {
  const host = atom.config.get('improviz.improvizUrl');
  const port = atom.config.get('improviz.improvizPort');
  var post_options = {
      host: host,
      port: port,
      path: '/toggle/text',
      method: 'POST',
  };

  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
  });

  // post the data
  post_req.write("");
  post_req.end();
}
