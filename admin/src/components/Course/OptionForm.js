import React, { Component } from "react";
import Input from "../../components/Inputs/Input";
import RichEditor from "../Inputs/RichEditor";
import Toggle from "../../components/Inputs/Toggle";
import { Button, Label, ButtonGroup } from "reactstrap";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import renderHTML from "react-render-html";

class OptionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
    };
  }

  componentDidMount = () => {
    const { option } = this.props;

    const statePayload = {};
    if (!option.name) statePayload.editMode = true;
    this.setState({ ...statePayload, option });
  };

  onFormSubmit = (values) => {
    const { onUpdate = () => {} } = this.props;

    onUpdate(values);
    this.setState({ editMode: false });
  };
  render = () => {
    const { editMode } = this.state;
    const { onUpdate = () => {}, onDelete = () => {}, option } = this.props;
    return (
      <Formik
        initialValues={{
          name: option.name || "",
          id: option.id || "",
          isCorrect: option.isCorrect || false,
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().min(1).required(),
          id: Yup.string().min(1).required(),
          isCorrect: Yup.boolean().required(),
        })}
        onSubmit={this.onFormSubmit}
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          submitForm,
          setFieldValue,
        }) => {
          return (
            <Form>
              <div style={{ display: "flex" }}>
                {editMode ? (
                  <>
                    <RichEditor
                      placeholder="Name"
                      autoFocus={true}
                      value={values.name}
                      name="name"
                      onChange={(name) => {
                        setFieldValue("name", name);
                      }}
                      error={touched.name && errors.name && errors.name}
                    />
                  </>
                ) : (
                  <> {renderHTML(option.name)}</>
                )}
                <div className="mt-2 ml-3 pt-1">
                  <Toggle
                    disabled={!editMode}
                    checked={values.isCorrect}
                    onChange={(checked) => {
                      setFieldValue("isCorrect", checked);
                    }}
                  />
                </div>
                <div className="mt-2 ml-3">
                  <ButtonGroup>
                    {editMode ? (
                      <Button
                        color="success"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          submitForm();
                        }}
                      >
                        <i className="fas fa-save"></i>
                      </Button>
                    ) : (
                      <Button
                        color="primary"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          this.setState({ editMode: true });
                        }}
                      >
                        <i className="fas fa-pencil-alt"></i>
                      </Button>
                    )}
                    <Button
                      color="danger"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete();
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  };
}

export default OptionForm;
