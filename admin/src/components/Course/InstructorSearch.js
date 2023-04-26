import React, { Component } from "react";
import IconInput from "../Inputs/IconInput";
import { connect } from "react-redux";

import { getInstructors } from "../../store/api/users";
class InstructorSearch extends Component {
  state = {
    focused: false,
    search: "",

    loading: false,

    instructors: [],
  };

  loadInstructors = (search) => {
    if (!search) return;
    this.setState({ loading: true });
    this.props.getInstructors({
      search,
      onSuccess: (res) => {
        this.setState({ instructors: res.data.data });
        console.log(res.data.data);
      },
      onEnd: () => {
        this.setState({ loading: false });
      },
    });
  };

  renderInstructors = () => {
    const { instructors } = this.state;
    const { onChoose = () => {} } = this.props;
    return (
      <div>
        {instructors.map((inst, index) => {
          return (
            <a
              href="#"
              key={`${inst._id}`}
              onClick={(e) => {
                e.preventDefault();
                instructors.splice(index, 1);
                this.setState({ instructors });
                onChoose(inst);
              }}
            >
              <div className="course-card-body px-4 py-2 mt-1 clearfix">
                <div
                  className="float-left"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50px",
                    overflowY: "scroll",
                    background: "#ccc",
                  }}
                ></div>
                <div className="float-left ml-2">
                  <h2 className="mb-0">{`${inst.firstName} ${inst.lastName}`}</h2>
                  <p className="text-dark text-sm mb-0">
                    {inst.email} ({inst.role})
                  </p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    );
  };
  render() {
    const { focused, search } = this.state;
    return (
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ zIndex: 1, position: "relative" }}>
          <IconInput
            icon="ni ni-email-83"
            placeholder="Search Teacher or Teacher Assistant"
            value={search}
            onChange={(search) => {
              this.setState({ search });
              this.loadInstructors(search);
            }}
            onFocus={() => {
              this.setState({ focused: true });
            }}
          />
        </div>

        {focused && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this.setState({ focused: false });
            }}
            style={{
              position: "absolute",
              zIndex: 2,
              top: 8,
              right: 12,
              fontSize: "22px",
            }}
            className="text-dark"
          >
            <i className="fa fa-times"></i>
          </a>
        )}

        {focused && (
          <div
            className="shadow shadow-sm rounded bg-white pb-2"
            style={{
              position: "absolute",
              top: 20,
              paddingTop: "26px",
              width: "100%",
              maxHeight: "300px",
              transitionDuration: "300",
            }}
          >
            {this.renderInstructors()}
          </div>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getInstructors: (params) => dispatch(getInstructors(params)),
  };
};
export default connect(null, mapDispatchToProps)(InstructorSearch);
