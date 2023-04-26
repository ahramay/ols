import React from "react";
import { FormGroup, Input, Label } from "reactstrap";

const MySelect = (props) => {
  const { error, label, className } = props;
  let classes = className + " form-control form-control-alternative text-black";
  if (error) {
    classes = classes + " border border-danger";
  }

  let options = [];
  if (props.options) {
    options = [{ label: props.placeholder || "", value: "" }, ...props.options];
  }
  return (
    <FormGroup>
      {label && <Label className="form-control-label">{label}</Label>}
      <Input
        {...props}
        type="select"
        className={classes}
        style={{ color: "black" }}
      >
        {options.map((option, k) => (
          <option key={k} value={option.value}>
            {option.label}
          </option>
        ))}
      </Input>
      {error && <div className="alert alert-danger">{error}</div>}
    </FormGroup>
  );
};

{
  /* <Input type="select" name="select" id="exampleSelect">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </Input> */
}

export default MySelect;
