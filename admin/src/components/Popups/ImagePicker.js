import React, { useState } from "react";
import Dropzone from "react-dropzone";
export default (props) => {
  const { onChange = () => {} } = props;
  const [previewImage, setPreviewImage] = useState(null);

  const onImageDrop = (image) => {
    var file = image[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function (e) {
      setPreviewImage(reader.result);
    }.bind(this);

    if (onChange) onChange(image);
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        marginBottom: "5px",
      }}
    >
      <Dropzone onDrop={onImageDrop}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div
                style={{
                  minHeight: "180px",
                  minWidth: "180px",
                  maxHeight: "300px",
                  maxWidth: "400px",
                  border: "3px dashed #ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {previewImage !== null ? (
                  <img src={previewImage} className="w-100" />
                ) : (
                  <p
                    style={{
                      textAlign: "center",
                      color: "#ccc",
                      maxWidth: "200px",
                    }}
                  >
                    Drag 'n' drop image here, or click to select image
                  </p>
                )}
              </div>
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
};

// import React, { Component } from "react";
// import { Modal, Button, ProgressBar } from "react-bootstrap";
// import Dropzone from "react-dropzone";
// import Cropper from "react-cropper";
// import "cropperjs/dist/cropper.css";
// import { dataURLtoFile } from "../helpers/image";
// import mediaHttp from "../http/media";
// import { handleHttpErrors } from "../helpers/error";
// class ImagePicker extends Component {
//   state = {
//     image: null,
//     imagePreview: null,
//     showPicker: false,
//     isChanged: false,
//     isUploading: false,
//     uploadProgress: 0,
//   };

//   showPicker = () => {
//     this.setState({ showPicker: true });
//   };

//   hidePicker = () => {
//     this.setState({ showPicker: false });
//   };

//   reset = () => {
//     this.setState({
//       image: null,
//       imagePreview: null,
//       showPicker: false,
//       isChanged: false,
//       isUploading: false,
//       uploadProgress: 0,
//     });
//   };
//   onImageDrop = (image) => {
//     var file = image[0];
//     var reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = function (e) {
//       this.setState({ imagePreview: reader.result });
//     }.bind(this);

//     this.setState({ image: file, isChanged: true });
//   };

//   onSave = async () => {
//     const { isChanged, image } = this.state;
//     const { onSave } = this.props;
//     if (!isChanged) return;

//     const dataUrl = this.cropper.current.getCroppedCanvas().toDataURL();
//     const fileObj = dataURLtoFile(dataUrl, image.name);
//     const media = await this.uploadToServer(fileObj);
//     if (!media) return;
//     if (onSave) onSave(media);
//   };

//   uploadToServer = async (image) => {
//     const formData = new FormData();
//     formData.append("image", image);
//     try {
//       this.setState({ isUploading: true, uploadProgress: 0 });
//       const res = await mediaHttp.uploadImage(formData, this.onUploadProgress);
//       return res.data;
//     } catch (err) {
//       handleHttpErrors(err);
//     } finally {
//       this.setState({ isUploading: false });
//     }
//     return null;
//   };

//   onUploadProgress = (progressEvent) => {
//     var percentCompleted = Math.round(
//       (progressEvent.loaded * 100) / progressEvent.total
//     );
//     this.setState({ uploadProgress: percentCompleted });
//     console.log(percentCompleted);
//   };
//   cropper = React.createRef();

//   render() {
//     const {
//       showPicker,
//       isChanged,
//       imagePreview,
//       uploadProgress,
//       isUploading,
//     } = this.state;
//     const { title, aspectRatio = 16 / 9 } = this.props;
//     return (
//       <div className="image-picker">
//         <Modal show={showPicker} onHide={() => {}}>
//           <Modal.Header>
//             <Modal.Title>{title || "Pick Image"}</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {imagePreview && (
//               <Cropper
//                 viewMode={1}
//                 zoomable={false}
//                 ref={this.cropper}
//                 src={imagePreview}
//                 style={{ width: "100%", marginBottom: "10px", height: "380px" }}
//                 aspectRatio={aspectRatio}
//                 guides={false}
//               />
//             )}

//             <Dropzone onDrop={this.onImageDrop}>
//               {({ getRootProps, getInputProps }) => (
//                 <section>
//                   <div {...getRootProps()}>
//                     <input {...getInputProps()} />
//                     <div
//                       style={{
//                         height: "60px",
//                         border: "3px dashed #ccc",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <p style={{ textAlign: "center", color: "#ccc" }}>
//                         Drag 'n' drop image here, or click to select image
//                       </p>
//                     </div>
//                   </div>
//                 </section>
//               )}
//             </Dropzone>
//             {isUploading && (
//               <ProgressBar now={uploadProgress} style={{ marginTop: "10px" }} />
//             )}
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={this.hidePicker}>
//               Cancel
//             </Button>
//             <Button
//               variant="primary"
//               disabled={!isChanged || isUploading}
//               onClick={this.onSave}
//             >
//               Save Changes
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </div>
//     );
//   }
// }

// export default ImagePicker;
