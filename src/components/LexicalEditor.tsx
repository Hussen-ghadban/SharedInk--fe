import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useEffect } from 'react';

interface LexicalEditorProps {
  content?: string;
  onChange: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
}

function MyOnChangePlugin({ onChange }: { onChange: (content: string) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        onChange(JSON.stringify(editorState.toJSON()));
      });
    });
  }, [editor, onChange]);

  return null;
}

export default function CustomLexicalEditor({ 
  content, 
  onChange, 
  editable = true,
  placeholder = 'Start writing...'
}: LexicalEditorProps) {
  const initialConfig = {
    editorState: content ? () => {
      try {
        const parsed = JSON.parse(content);
        return parsed;
      } catch (e) {
        console.error('Failed to parse editor content', e);
        return undefined;
      }
    } : undefined,
    namespace: 'MyEditor',
    theme: {
      root: 'editor-root',
      paragraph: 'editor-paragraph',
    },
    onError: (error: Error) => {
      console.error('Lexical error:', error);
    },
    editable,
  };

  return (
    <div className="editor-container">
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="editor-content-editable" />
          }
          placeholder={
            <div className="editor-placeholder">{placeholder}</div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <MyOnChangePlugin onChange={onChange} />
      </LexicalComposer>
    </div>
  );
}