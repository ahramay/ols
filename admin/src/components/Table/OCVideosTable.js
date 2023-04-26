import React, { Component } from "react";
import { connect } from "react-redux";
import {allOCVideo } from "../../store/api/outclassVideos"
import { apiPath } from "../../configs";
import ReactDOM from "react-dom";
import moment from "moment";
import { basePath } from "../../configs";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import * as $ from "jquery/dist/jquery";
$.DataTable = require("datatables.net-bs4");

class OCVideosTable extends Component {
    state = {
        loading: false,
      };
      componentDidMount = () => {
        const { token } = this.props;
        $("#userTable").DataTable({
          language: {
            paginate: {
              next:
                '<span class="pagination-fa"><i class="fa fa-chevron-right" ></i></span>',
              previous:
                '<span class="pagination-fa"><i class="fa fa-chevron-left" ></i></span>',
            },
          },
          processing: true,
          serverSide: true,
          order: [[0, "_id"]],
    
          ajax: {
            url: apiPath + "/all_OCVideo",
            type: "GET",
            headers: { "x-auth-token": token },
          },
    
          columns: [
            { data: "_id" },
            { data: "VideoTitle" },
            { data: "VideoID" },
            { data: "Description" },
            // { data: "dateOfBirth" },
            // { data: "role" },
            // { data: "phoneNumber" },
            // { data: "email" },
            { data: "createdAt" },
            // { data: "_id" },
          ],
    
        //   columnDefs: [
        //     {
        //       targets: 4,
        //       createdCell: this.renderAgeCell,
        //     },
        //     {
        //       targets: 7,
        //       createdCell: this.renderEmailCell,
        //     },
        //     { targets: 8, createdCell: this.renderCreatedAt },
        //     {
        //       targets: 9,
        //       createdCell: this.renderLinkButtons,
        //     },
        //   ],
        });
      };
render() {
    const { loading } = this.state;
    return (
      <div style={{ position: "relative", overflowX: "scroll" }}>
        <table id="userTable" className="w-100 table table-striped">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Video Title</th>
              <th>Video ID</th>
              <th>Description</th>
              
              <th>Created at</th>
              {/* <th>Actions</th> */}
            </tr>
          </thead>
        </table>
        {loading && (
          <div
            className="pt-5"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <h1 className="text-white text-center ">Generating Session</h1>
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
    return {
      token: state.auth.token,
    };
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
        allOCVideo:()=>dispatch(allOCVideo())
    //   deleteUser: (params) => dispatch(deleteUser(params)),
    //   createSession: (params) => dispatch(createSession(params)),
    };
  };
  export default connect(mapStateToProps, mapDispatchToProps)(OCVideosTable);