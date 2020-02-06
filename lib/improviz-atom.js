'use babel';

import { CompositeDisposable, Point } from 'atom';

import ConsoleView from './console';
import {request} from './http';

export default {

  subscriptions: null,
  console: null,

  editorState: {
    errors: [],
    buffer: null,
  },

  config: {
    'improvizUrl':  {
      type: 'string',
      default: 'localhost'
    },
    'improvizPort':  {
      type: 'string',
      default: '3000'
    },
    'consoleMaxHeight': {
      type: 'integer',
      default: 100,
      description: 'The console maximum height in pixels.'
    },
  },

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.console = new ConsoleView();
    this.console.initUI();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'improviz-atom:send': () => this.send()
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'improviz-atom:toggle-text': () => {
        const opts = {path: '/toggle/text', method: 'POST'}
        request(opts, "", console.log);
      }
    }));


    const editor = atom.workspace.getActiveTextEditor();
    this.editorState.editor = editor;
    this.editorState.buffer = editor.getBuffer();
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  send() {
    this.editorState.errors.forEach(err => {
      err.marker.destroy();
      err.decoration.destroy();
    });
    console.log('Sending code to improviz');
    const programText = this.editorState.buffer.getText()
    const opts = {path: '/read', method: 'POST'}
    request(opts, programText, (resp) => handleSendResponse(this, resp));
  },

};

function handleSendResponse(plugin, response) {
  if (response.status === 'ok') {
    plugin.console.logStdout('Improviz received code OK');
  } else if (response.status === 'error') {
    displayErrors(plugin, response.payload);
  }
}

function displayErrors(plugin, errors) {
  errors.forEach((err) => {
    const pos = new Point(err.line - 1, err.column - 1);
    const marker = plugin.editorState.buffer.markPosition(pos);
    const decoration = plugin.editorState.editor.decorateMarker(
      marker, {type: 'line', class: 'line-error'}
    );
    plugin.console.logStderr(err.message);
    plugin.editorState.errors.push({
      marker,
      decoration,
    });
  });
};
