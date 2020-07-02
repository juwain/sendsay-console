import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/idea.css';
import './Editor.css';

const Editor = ({ className, title, readOnly, onChange, value }) => {
  const editorSettings = {
    theme: 'idea',
    mode: 'javascript',
    lineWrapping: true,
    readOnly
  }

  return (
    <section className={`${className} editor`}>
      <h2 className="editor__heading">{title}:</h2>
      <CodeMirror
        className="editor__wrap"
        value={value}
        onBeforeChange={(editor, data, value) => onChange(value)}
        options={editorSettings}
      />
    </section>
  );
};

export { Editor };
