import Editor, { useMonaco } from '@monaco-editor/react'
import { useTheme } from 'common'
import { noop } from 'lodash'
import { useEffect, useRef } from 'react'

interface JsonEditorProps {
  queryId?: string
  defaultValue: string
  readOnly?: boolean
  onInputChange: (value: any) => void
}

const JsonEditor = ({
  queryId = '',
  defaultValue = '',
  readOnly = false,
  onInputChange = noop,
}: JsonEditorProps) => {
  const monaco = useMonaco()
  const editorRef = useRef()
  const { isDarkMode } = useTheme()

  useEffect(() => {
    if (monaco) {
      // Supabase theming (Can't seem to get it to work for now)
      monaco.editor.defineTheme('supabase', {
        base: 'vs-dark', // can also be vs-dark or hc-black
        inherit: true, // can also be false to completely replace the builtin rules
        rules: [
          // @ts-ignore
          { background: isDarkMode ? '1f1f1f' : '30313f' },
          { token: 'string.sql', foreground: '24b47e' },
          { token: 'comment', foreground: '666666' },
          { token: 'predefined.sql', foreground: 'D4D4D4' },
        ],
        colors: {
          'editor.background': isDarkMode ? '#1f1f1f' : '#30313f',
          // 'editorGutter.background': '#30313f',
          // 'editorLineNumber.foreground': '#555671',
        },
      })
    }
  }, [isDarkMode, monaco])

  const onMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    // Add margin above first line
    editor.changeViewZones((accessor: any) => {
      accessor.addZone({
        afterLineNumber: 0,
        heightInPx: 4,
        domNode: document.createElement('div'),
      })
    })
  }

  const Loading = () => <h4>Loading</h4>

  return (
    <Editor
      className="monaco-editor"
      theme="vs-dark"
      defaultLanguage="json"
      defaultValue={defaultValue}
      path={queryId}
      loading={<Loading />}
      options={{
        readOnly,
        tabSize: 2,
        fontSize: 13,
        minimap: {
          enabled: false,
        },
        wordWrap: 'on',
        fixedOverflowWidgets: true,
      }}
      onMount={onMount}
      onChange={onInputChange}
    />
  )
}

export default JsonEditor
