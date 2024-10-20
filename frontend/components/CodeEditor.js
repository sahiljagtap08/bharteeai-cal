// frontend/components/CodeEditor.js
import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

export default function CodeEditor({ language, code, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      const editor = monaco.editor.create(editorRef.current, {
        value: code,
        language: language,
        theme: 'vs-dark',
        automaticLayout: true,
      });

      editor.onDidChangeModelContent(() => {
        onChange(editor.getValue());
      });

      return () => {
        editor.dispose();
      };
    }
  }, [language, code, onChange]);

  return <div ref={editorRef} style={{ width: '100%', height: '400px' }} />;
}
