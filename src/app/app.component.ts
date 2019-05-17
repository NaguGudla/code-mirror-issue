import { Component, ViewChild } from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import * as codeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('codeEditor') codeEditor: CodemirrorComponent;
    private CodeMirror: any = codeMirror;

  private server = new this.CodeMirror.TernServer();

  sourceCode = ``;
  options = {
    lineNumbers: true,
    theme: 'material',
    extraKeys: {
      'Ctrl-Space': (cm: any) => { this.getComplete(cm) },
       'Ctrl-O': (cm: any) => { this.server.showDocs(cm); },
      'Ctrl-I': (cm) => { this.server.showType(cm); },
      'Alt-.': (cm) => { this.server.jumpToDef(cm); },
      'Alt-,': (cm) => { this.server.jumpBack(cm); },
      'Ctrl-Q': (cm) => { this.server.rename(cm); },
      'Ctrl-.': (cm) => { this.server.selectName(cm); },
      'Ctrl-Y': (cm: any) => { this.server.showTooltip(cm)},

    },
        lint: { getAnnotations: this.CodeMirror.ternLint, async: true, server: this.server },
    mode: { name: 'javascript', globalVars: true },
    gutters: ["CodeMirror-lint-markers"],
  };
  cursorPos: { line: number, ch: number } = { line: 0, ch: 0 };
  getComplete(cm: any) {
    this.server = new this.CodeMirror.TernServer({ defs: [] });
    const value = cm.getValue();
    const cursor = cm.getCursor();
    const valueArray = value.split(/\n/);
    const currentLine: string = valueArray[cursor.line];
    const item = {
      "variable1": {
        "!type": "",
        "!doc": "Member Type",
        "property1": { "!type": "", "!doc": "Fiedls : ","nestedProperty":{"!type":"","!doc":"this is nested property"}},
        "property2": { "!type": "string", "!doc": "Fiedls : "}
      },
      "variable2": {
        "!type": "string",
        "!doc": "Member Type"
      },
      "variable3": {
        "!type": "string",
        "!doc": "Member Type"
      },
      "variable4": {
        "!type": "string",
        "!doc": "Member Type"
      }
    }
    if (currentLine.indexOf('${') < 0) {
      this.server.complete(cm);
    } else {
      this.server = new this.CodeMirror.TernServer({ defs: [item] });
      this.server.complete(cm);    }
  }
}
