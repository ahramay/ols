import React from "react";
import {
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup
} from "reactstrap";

const IconInput = props => {
  const { icon, error, onChange } = props;
  return (
    <FormGroup>
      <InputGroup
        className={
          error
            ? "input-group-alternative border border-danger"
            : "input-group-alternative"
        }
      >
        <InputGroupAddon addonType="prepend">
          <InputGroupText className={error ? "text-danger" : ""}>
            <i className={icon} />
          </InputGroupText>
        </InputGroupAddon>
        <Input
          {...props}
          onChange={e => {
            if (onChange) onChange(e.target.value);
          }}
        />
      </InputGroup>
      {error && <div className="alert alert-danger">{error}</div>}
    </FormGroup>
  );
};

export default IconInput;
