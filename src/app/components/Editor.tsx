import React, { useState, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import { Quill } from "react-quill";

Quill.register("modules/imageResize", ImageResize);

interface EditorComponentProps {
  data: string;
  onChange: (content: string) => void;
}

const EditorComponent: React.FC<EditorComponentProps> = ({
  data,
  onChange,
}) => {
  const [editorContent, setEditorContent] = useState(data);
  const [loading, setLoading] = useState(false);

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    onChange(content);
  };

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
        [{ size: ["small", false, "large", "huge"] }], // Add size dropdown
        [{ list: "ordered" }, { list: "bullet" }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        ["link", "image", "video"],
        ["code-block"],
        ["clean"],
        [{ direction: "rtl" }],
      ],
      imageResize: {
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "align",
    "color",
    "background",
    "link",
    "image",
    "video",
    "code-block",
    "direction",
  ];

  return (
    <div>
      <ReactQuill
        value={editorContent}
        onChange={handleEditorChange}
        modules={modules}
        formats={formats}
        theme="snow"
      />
    </div>
  );
};

export default EditorComponent;
