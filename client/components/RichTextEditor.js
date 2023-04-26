import React from "react";
import {} from "react-bootstrap";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const RichTextEditor = (props) => {
  const {
    error,
    label,
    className = "",
    onChange = () => {},
    value = "",
  } = props;
  let classes = className + "";
  if (error) {
    classes = classes + " border border-danger";
  }
  return (
    <div className="from-group">
      {label && <label className="form-control-label">{label}</label>}
      <div className={classes}>
        <CKEditor
          editor={ClassicEditor}
          activeClass="border border-primary"
          data={value}
          {...props}
          onChange={(event, editor) => {
            onChange(editor.getData());
          }}
        />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default RichTextEditor;
