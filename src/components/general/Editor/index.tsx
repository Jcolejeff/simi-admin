import React, { useCallback, useMemo, useRef } from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
interface ITextEditor {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}
const TextEditor = ({ value, setValue }: ITextEditor) => {
  const quill = useRef<ReactQuill | null>(null);
  function handler() {
    console.log(value);
  }

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const imageUrl = reader.result as string;
          if (quill.current && typeof quill.current.getEditor === 'function') {
            const quillEditor = quill.current.getEditor();
            const range = quillEditor.getSelection(true);
            quillEditor.insertEmbed(range.index, 'image', imageUrl);
          }
        };
      }
    };
  }, []);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ['bold', 'italic', 'underline', 'blockquote'],
          [{ color: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          // ["link", "image"],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    [imageHandler],
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'color',
  ];

  return (
    <div className='relative py-4'>
      <ReactQuill
        theme='snow'
        value={value}
        onChange={setValue}
        ref={quill}
        modules={modules}
        formats={formats}
        className=' my-6 h-[500px]'
      />
    </div>
  );
};

export default TextEditor;
