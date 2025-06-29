import React, { useState, useRef, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // 样式
import styles from './editor.module.css'
const Editor = () => {
  const [value, setValue] = useState('')
  const quillRef = useRef<ReactQuill>(null)

  useEffect(() => {
    // if (quillRef.current) {
    //   const Quill = quillRef.current.getEditor().constructor as any

    //   const FontAttributor = Quill.import('attributors/class/font')
    //   FontAttributor.whitelist = ['sofia', 'slabo', 'roboto', 'inconsolata', 'ubuntu']
    //   Quill.register(FontAttributor, true)
    // }
    if (quillRef.current) {
      const Quill = quillRef.current.getEditor().constructor as any

      // 使用 formats/font 而不是 attributors/class/font
      const Font = Quill.import('formats/font')
      Font.whitelist = ['sofia', 'slabo', 'roboto', 'inconsolata', 'ubuntu']
      Quill.register(Font, true)

      // 获取Quill实例
      const quill = quillRef.current.getEditor()

      // 设置默认字体（可选）
      quill.format('font', 'roboto')
    }
  }, [])

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }], // 預設的工具按鈕
        ['bold', 'italic', 'underline', 'strike'],
        ['image', 'code-block'],
        ['link', 'formula'],
        [{ list: 'ordered' }, { list: 'bullet' }], //列表，有序、无序
        [{ direction: 'rtl' }], // 文本方向
        [{ color: [] }, { background: [] }], // 文字颜色以及背景选择设置
        [{ font: ['sofia', 'slabo', 'roboto', 'inconsolata', 'ubuntu'] }], // 使用自定义字体列表
        [{ align: [] }]
        // [{ script: 'sub' }], // 上下标
        // [{ indent: '-1' }, { indent: '+1' }], // 缩进
      ]
      // handlers: {
      //   font: function (value: string) {
      //     const quill = quillRef.current?.getEditor()
      //     if (quill) {
      //       quill.format('font', value)
      //     }
      //   }
      // }
    }
  }
  return (
    <div className={styles.editorContainer}>
      <ReactQuill
        ref={quillRef}
        theme='snow'
        placeholder='请输入内容'
        modules={modules}
        className={styles.specialEditor}
      />
      {/* <ReactQuill theme='snow' value={value} onChange={setValue} placeholder='请输入内容' modules={modules} /> */}
      {/* <p>编辑器内容：</p> */}
      {/* <div dangerouslySetInnerHTML={{ __html: value }} /> */}
    </div>
  )
}

export default Editor
