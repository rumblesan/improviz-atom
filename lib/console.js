'use babel';
/* global document */

class ConsoleView {
  constructor() {
    this.improvizConsole = null;
    this.log = null;
    this.serialize = this.serialize.bind(this);
    this.destroy = this.destroy.bind(this);
    this.logStdout = this.logStdout.bind(this);
    this.logStderr = this.logStderr.bind(this);
    this.logText = this.logText.bind(this);
  }

  initUI() {
    if (this.improvizConsole) return;
    this.improvizConsole = document.createElement('div');
    this.improvizConsole.setAttribute('tabindex', -1);
    this.improvizConsole.classList.add('improviz', 'console', 'native-key-bindings');

    this.log = document.createElement('div');
    this.improvizConsole.appendChild(this.log);

    atom.workspace.addBottomPanel({
      item: this.improvizConsole
    });

    //sets the console max height
    this.improvizConsole.setAttribute('style', 'max-height:'+
      atom.config.get('improviz.consoleMaxHeight')+'px;');
    // listen for consoleMaxHeight changes
    atom.config.onDidChange( 'improviz.consoleMaxHeight', (data) =>{
      this.improvizConsole.setAttribute('style', 'max-height:'+
        data.newValue+'px;');
    });

  }

  serialize() {

  }

  destroy() {
    this.improvizConsole.remove();
  }

  logStdout(text) {
    this.logText(text);
  }

  logStderr(text) {
    this.logText(text, true);
  }

  logText(text, error) {
    if (!text) return;
    var pre = document.createElement('pre');
    if (error) {
      pre.className = 'error';
    }

    pre.innerHTML = text;
    this.log.appendChild(pre);

    this.improvizConsole.scrollTop = this.improvizConsole.scrollHeight;
  }
}

export default ConsoleView;
