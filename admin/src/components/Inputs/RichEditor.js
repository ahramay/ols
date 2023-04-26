import React from "react";
import { FormGroup, Input, Label } from "reactstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "./ckeditor5-build-classic/build/ckeditor";



const RichEditor = (props) => {
  const {
    error,
    label,
    className = "",
    onChange = () => {},
    value = "",
    toolbar
  } = props;
  let classes = className + "";
  if (error) {
    classes = classes + " border border-danger";
  }

  const editorConfiguration = {
    mediaEmbed: {
      previewsInData: true,
    },
  };

  if(toolbar) {
    editorConfiguration.toolbar = toolbar;
  }
  return (
    <FormGroup>
      {label && <Label className="form-control-label">{label}</Label>}
      <div className={classes}>
        <CKEditor
          editor={ClassicEditor}
          config={editorConfiguration}
          activeClass="border border-primary"
          data={value}
          // {...props}
          onChange={(event, editor) => {
            onChange(editor.getData());
          }}
        />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
    </FormGroup>
  );
};

export default RichEditor;
