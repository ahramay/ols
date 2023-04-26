// import React from 'react'
// import { Field, FieldArray, reduxForm } from 'redux-form'
// const validate = values => {
//     const errors = {}
//     if(!values.clubName) {
//       errors.clubName = 'Required'
//     }
//     if (!values.members || !values.members.length) {
//       errors.members = { _error: 'At least one member must be entered' }
//     } else {
//       const membersArrayErrors = []
//       values.members.forEach((member, memberIndex) => {
//         const memberErrors = {}
//         if (!member || !member.firstName) {
//           memberErrors.firstName = 'Required'
//           membersArrayErrors[memberIndex] = memberErrors
//         }
//         if (!member || !member.lastName) {
//           memberErrors.lastName = 'Required'
//           membersArrayErrors[memberIndex] = memberErrors
//         }
//         if (member && member.hobbies && member.hobbies.length) {
//           const hobbyArrayErrors = []
//           member.hobbies.forEach((hobby, hobbyIndex) => {
//             if (!hobby || !hobby.length) {
//               hobbyArrayErrors[hobbyIndex] =  'Required'
//             }
//           })
//           if(hobbyArrayErrors.length) {
//             memberErrors.hobbies = hobbyArrayErrors
//             membersArrayErrors[memberIndex] = memberErrors
//           }
//           if (member.hobbies.length > 5) {
//             if(!memberErrors.hobbies) {
//               memberErrors.hobbies = []
//             }
//             memberErrors.hobbies._error = 'No more than five hobbies allowed'
//             membersArrayErrors[memberIndex] = memberErrors
//           }
//         }
//       })
//       if(membersArrayErrors.length) {
//         errors.members = membersArrayErrors
//       }
//     }
//     return errors
//   }
// const renderField = ({ input, label, type, meta: { touched, error } }) => (
//   <div>
//     <label>{label}</label>
//     <div>
//       <input {...input} type={type} placeholder={label}/>
//       {touched && error && <span>{error}</span>}
//     </div>
//   </div>
// )

// const renderMembers = ({ fields, meta: { touched, error } }) => (
//   <ul>
//     <li>
//       <button type="button" onClick={() => fields.push({})}>Add Member</button>
//       {touched && error && <span>{error}</span>}
//     </li>
//     {fields.map((member, index) =>
//       <li key={index}>
//         <button
//           type="button"
//           title="Remove Member"
//           onClick={() => fields.remove(index)}/>
//         <h4>Member #{index + 1}</h4>
//         <Field
//           name={`${member}.firstName`}
//           type="text"
//           component={renderField}
//           label="First Name"/>
//         <Field
//           name={`${member}.lastName`}
//           type="text"
//           component={renderField}
//           label="Last Name"/>
//         <FieldArray name={`${member}.hobbies`} component={renderHobbies}/>
//       </li>
//     )}
//   </ul>
// )

// const renderHobbies = ({ fields, meta: { error } }) => (
//   <ul>
//     <li>
//       <button type="button" onClick={() => fields.push()}>Add Hobby</button>
//     </li>
//     {fields.map((hobby, index) =>
//       <li key={index}>
//         <button
//           type="button"
//           title="Remove Hobby"
//           onClick={() => fields.remove(index)}/>
//         <Field
//           name={hobby}
//           type="text"
//           component={renderField}
//           label={`Hobby #${index + 1}`}/>
//       </li>
//     )}
//     {error && <li className="error">{error}</li>}
//   </ul>
// )

// const FieldArraysForm = (props) => {
//   const { handleSubmit, pristine, reset, submitting } = props
//   return (
//     <form onSubmit={handleSubmit}>
//       <Field name="clubName" type="text" component={renderField} label="Club Name"/>
//       <FieldArray name="members" component={renderMembers}/>
//       <div>
//         <button type="submit" disabled={submitting}>Submit</button>
//         <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
//       </div>
//     </form>
//   )
// }

// export default reduxForm({
//   form: 'fieldArrays',     // a unique identifier for this form
//   validate
// })(FieldArraysForm)

//////////////////////////////////////////////////////////////////////////////////////////////////////

//import React, { useState } from "react";
// handle input change
// import React, { useState } from "react";
 
// function App() {
//   const [inputList, setInputList] = useState([{ firstName: "", lastName: "" }]);
 
//   // handle input change
//   const handleInputChange = (e, index) => {
//     const { name, value } = e.target;
//     const list = [...inputList];
//     list[index][name] = value;
//     setInputList(list);
//   };
 
//   // handle click event of the Remove button
//   const handleRemoveClick = index => {
//     const list = [...inputList];
//     list.splice(index, 1);
//     setInputList(list);
//   };
 
//   // handle click event of the Add button
//   const handleAddClick = () => {
//     setInputList([...inputList, { firstName: "", lastName: "" }]);
//   };
 
//   return (
//     <div className="App">
//       <h3><a href="https://cluemediator.com">Clue Mediator</a></h3>
//       {inputList.map((x, i) => {
//         return (
//           <div className="box">
//             <input
//               name="firstName"
//    placeholder="Enter First Name"
//               value={x.firstName}
//               onChange={e => handleInputChange(e, i)}
//             />
//             <input
//               className="ml10"
//               name="lastName"
//    placeholder="Enter Last Name"
//               value={x.lastName}
//               onChange={e => handleInputChange(e, i)}
//             />
//             <div className="btn-box">
//               {inputList.length !== 1 && <button
//                 className="mr10"
//                 onClick={() => handleRemoveClick(i)}>Remove</button>}
//               {inputList.length - 1 === i && <button onClick={handleAddClick}>Add</button>}
//             </div>
//           </div>
//         );
//       })}
//       <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div>
//     </div>
//   );
// }
 

 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import React from 'react';
import ReactDOM from 'react-dom';
import { WithContext as ReactTags } from 'react-tag-input';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tags: [
                { id: "Thailand", text: "Thailand" },
                { id: "India", text: "India" }
             ],
            suggestions: [
                { id: 'USA', text: 'USA' },
                { id: 'Germany', text: 'Germany' },
                { id: 'Austria', text: 'Austria' },
                { id: 'Costa Rica', text: 'Costa Rica' },
                { id: 'Sri Lanka', text: 'Sri Lanka' },
                { id: 'Thailand', text: 'Thailand' }
             ]
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }

    handleDelete(i) {
        const { tags } = this.state;
        this.setState({
         tags: tags.filter((tag, index) => index !== i),
        });
    }

    handleAddition(tag) {
        this.setState(state => ({ tags: [...state.tags, tag] }));
    }

    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: newTags });
    }

    render() {
        const { tags, suggestions } = this.state;
        return (
            <div>
                <ReactTags tags={tags}
                    suggestions={suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
                    delimiters={delimiters} />
            </div>
        )
    }
};

export default App;
