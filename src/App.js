import moment from 'moment';
import Moment from 'react-moment';
import 'moment-timezone';

import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import './App.css';

const React = require('react'),
      $ = require('jquery'),
      { useState, useEffect } = require('react');

function App() {
  const [people, setPeople] = useState([]),
        [peopleNotes, setPeopleNotes] = useState([]),
        [editMode, setEditMode] = useState(null),
        [visibleNotes, setVisibleNotes] = useState([]),
        [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setPeopleNotesData();
  }, [])

  // API functions

  var setPeopleData = () => {
    fetch("https://api.airtable.com/v0/apps8Op2rBivGM3Yc/People?api_key=keyK2FU3DKzVm9DNS")
      .then(res => res.json())
      .then(
        (result) => {
          setPeople(result.records);
        },
        (error) => {
          return error;
        }
      )
  }

  var setPeopleNotesData = () => {
    fetch("https://api.airtable.com/v0/apps8Op2rBivGM3Yc/PeopleNotes?api_key=keyK2FU3DKzVm9DNS")
      .then(res => res.json())
      .then(
        (result) => {
          var notesList = result.records;
          var notesObj = {};
          notesList.forEach(note => {
            notesObj[note.id] = note;
          })
          setPeopleNotes({...notesObj});
          setPeopleData();
        },
        (error) => {
          return error;
        }
      )
  }

  var editRecord = (type, data, dataId) => {
    if (hasFormErrors(data, dataId)) { return; }
    $.ajax({
        type: "PUT",
        datatype : "application/json",
        async: true,
        url: "https://api.airtable.com/v0/apps8Op2rBivGM3Yc/"+type+"/"+dataId+"?api_key=keyK2FU3DKzVm9DNS",
        data: data,
        dataType: "html",
        success: function(data) {
          console.log('success');
          setEditMode(null);
          setPeopleData();
        },
        error: function(error) {
          console.log(error.responseText);
        }
    });
  }

  var createRecord = (type, data) => {
    if (hasFormErrors(data)) { return; }
    $.ajax({
        type: "POST",
        datatype : "application/json",
        async: true,
        url: "https://api.airtable.com/v0/apps8Op2rBivGM3Yc/"+type+"?api_key=keyK2FU3DKzVm9DNS",
        data: data,
        dataType: "html",
        success: function(data) {
          console.log('success');
          setPeopleNotesData();
        },
        error: function(error) {
          console.log(error.responseText);
        }
    });
  }

  var deleteRecord = (type, dataId) => {
    $.ajax({
        type: "DELETE",
        datatype : "application/json",
        async: true,
        url: "https://api.airtable.com/v0/apps8Op2rBivGM3Yc/"+type+"/"+dataId+"?api_key=keyK2FU3DKzVm9DNS",
        dataType: "html",
        success: function(data) {
          console.log('success');
          setPeopleData();
        },
        error: function(error) {
          console.log(error.responseText);
        }
    });
  }

  // Data update functions

  var savePeopleForm = (e) => {
    e.preventDefault();
    var formFields = {};

    $("#form_"+e.target.id).serializeArray().forEach(item => {
      if (item.value) {
        if (item.name === "peopleNotes") {
          formFields[item.name] = item.value.split(",");
        } else if (item.name === "zipCode") {
          formFields[item.name] = Number(item.value);
        } else {
          formFields[item.name] = item.value;
        }
      }
    });

    editRecord("People", {fields: formFields}, e.target.id);
    // setEditMode(null);
  };

  var savePeopleNoteForm = (e) => {
    e.preventDefault();
    var formFields = {};

    $("#form_"+e.target.id).serializeArray().forEach(item => {
      if (item.value) {
        if (item.name === "zipCode") {
          formFields[item.name] = Number(item.value);
        } else {
          formFields[item.name] = item.value;
          formFields.peopleId = peopleNotes[e.target.id].fields.peopleId;
        }
      }
    })

    editRecord("PeopleNotes", {fields: formFields}, e.target.id);
    // setEditMode(null);
  };

  var deletePerson = (e) => {
    deleteRecord("People", e.target.id);
  };

  var deleteNote = (e) => {
    deleteRecord("PeopleNotes", e.target.id);
  };

  var createPerson = (e) => {
    e.preventDefault();
    var formFields = {};

    $("#new-person").serializeArray().forEach(item => {
      if (item.value) {
        if (item.name === "zipCode") {
          formFields[item.name] = Number(item.value);
        } else {
          formFields[item.name] = item.value;
        }
      }
    });

    createRecord("People", {fields: formFields});
  };

  var createNote = (e) => {
    e.preventDefault();
    var formFields = {};

    $("#new-note").serializeArray().forEach(item => {
      if (item.value) {
        if (item.name === "peopleId") {
          formFields[item.name] = [item.value];
        } else if (item.name === "zipCode") {
          formFields[item.name] = Number(item.value);
        } else {
          formFields[item.name] = item.value;
        }
      }
    });

    createRecord("PeopleNotes", {fields: formFields});
  };

  // Misc form functions

  var sort = (e) => {
    var sortedData = people.sort((a,b)=> (a[e.target.id] - b[e.target.id] ? 1 : -1));
    setPeople([...sortedData]);
  };

  var enterEditMode = (e) => {
    setEditMode(e.target.id);
  };

  var toggleNotes = (e) => {
    var newNotes;

    if (visibleNotes.includes(e.target.id)) {
      newNotes = visibleNotes.filter(function(note) {
        return note !== e.target.id
      });
    } else {
      newNotes = visibleNotes;
      newNotes.push(e.target.id);
    }

    setVisibleNotes([...newNotes]);
  };

  var hasFormErrors = (data, dataId) => {
    var requiredFields = ["name", "birthday", "zipCode"],
        missingFields = [],
        wrongFormats = [];

    requiredFields.forEach(requiredField => {
      if (!Object.keys(data.fields).includes(requiredField)) {
        missingFields.push(requiredField);
      }
    });

    if (isNaN(data.fields.zipCode) || data.fields.zipCode.toString().length !== 5) {
      wrongFormats.push("zipCode");
    }

    if (!missingFields.length && !wrongFormats.length) {
      $("#new-person input[type=text]").val("");
    }

    if (dataId) {
      setFormErrors({...formErrors, [dataId]: {required: missingFields, format: wrongFormats}});
    } else {
      setFormErrors({...formErrors, new: {required: missingFields, format: wrongFormats}});
    }

    if (missingFields.length || wrongFormats.length) {
      return true;
    }

    // setFormErrors({...formErrors, required: missingFields, format: wrongFormats});
  }

  var onNoteChange = () => {
    $(".note-details").each(index => {
      var note = $(".note-details")[index];
      if ($(note).val()) {
        $(note.closest('#new-note')).find('.save').removeClass('disabled');
      } else {
        $(note.closest('#new-note')).find('.save').addClass('disabled');
      }
    });
  }

  var zipRequiredError = ((formErrors.new||{}).required||[]).includes("zipCode"),
      zipFormatError = ((formErrors.new||{}).format||[]).includes("zipCode"),
      nameClasses = "col form-control col-md-4 ".concat(((formErrors.new||{}).required||[]).includes("name") ? "is-invalid" : ""),
      birthdayClasses = "col form-control col-md-4 ".concat(((formErrors.new||{}).required||[]).includes("birthday") ? "is-invalid" : ""),
      zipCodeClasses = "col form-control col-md-4 ".concat((zipRequiredError||zipFormatError) ? "is-invalid" : "");
  return (
    <div>
      <h4>Create New Person</h4>
      <form key="new-person" id="new-person" className="row g-3 needs-validation">
        <div className="col-md-5">
          <label htmlFor="name" className="form-label">Name</label>
          <input id="name" className={nameClasses} type="text" name="name" required></input>
          <div style={{display:((formErrors.new||{}).required||[]).includes("name") ? "block" : "none"}} className="invalid-feedback">Name is required.</div>
        </div>
        <div className="col-md-3">
          <label htmlFor="birthday" className="form-label">Birthday</label>
          <input id="birthday"className={birthdayClasses} type="text" name="birthday" placeholder="mm/dd/yyyy" required></input>
          <div style={{display:((formErrors.new||{}).required||[]).includes("birthday") ? "block" : "none"}} className="invalid-feedback" required>Birthday is required.</div>
        </div>
        <div className="col-md-3">
          <label htmlFor="zipCode" className="form-label">Zip Code</label>
          <input id="zipCode"className={zipCodeClasses} type="text" name="zipCode"></input>
          <div style={{display:((formErrors.new||{}).required||[]).includes("zipCode") ? "block" : "none"}} className="invalid-feedback">Zip Code is required.</div>
          <div style={{display:((formErrors.new||{}).format||[]).includes("zipCode") ? "block" : "none"}} className="invalid-feedback">Zip Code must be a 5 digit number.</div>
        </div>
        <div className="col-md-2">
          <button type="submit" onClick={createPerson} className="col btn btn-primary">Save <i className="bi bi-save-fill" /></button>
        </div>
      </form>

      <br/><br/><br/><br/>

      <h4>People</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col" id="name" onClick={sort}>
              Name <i className="bi bi-arrow-down-up" />
            </th>
            <th scope="col" id="birthday" onClick={sort}>
              Birthday <i className="bi bi-arrow-down-up" />
            </th>
            <th scope="col" id="zipCode" onClick={sort}>
              Zip Code <i className="bi bi-arrow-down-up" />
            </th>
            <th scope="col" id="createdTime" onClick={sort}>
              Created Time <i className="bi bi-arrow-down-up" />
            </th>
            <th scope="col" id="modifiedTime" onClick={sort}>
              Modified Time <i className="bi bi-arrow-down-up" />
            </th>
            <th>Notes</th>
            <th>Edit/Save</th>
            <th>Delete</th>
          </tr>
        </thead>
          {Object.entries(people).map(([personId, person]) => {
            var inEditMode = editMode === person.id;
            var formId = "form_"+person.id;
            var personNotes = [];
            if ((person.fields.peopleNotes || []).length) {
              person.fields.peopleNotes.forEach(noteId => {
                personNotes.push(peopleNotes[noteId]);
              });
            }
            var isNotesVisible = visibleNotes.includes(person.id),
                indZipRequiredError = ((formErrors[person.id]||{}).required||[]).includes("zipCode"),
                indZipFormatError = ((formErrors[person.id]||{}).format||[]).includes("zipCode"),
                indNameClasses = "form-control ".concat(((formErrors[person.id]||{}).required||[]).includes("name") ? "is-invalid" : ""),
                indBirthdayClasses = "form-control ".concat(((formErrors[person.id]||{}).required||[]).includes("birthday") ? "is-invalid" : ""),
                indZipCodeClasses = "form-control ".concat((zipRequiredError||zipFormatError) ? "is-invalid" : "");
            return (
              <tbody>
              <tr>
                <td style={{display: 'none'}}>
                  <form type="hidden" key={personId} id={formId}></form>
                </td>
                <td>
                  {inEditMode && <input className={indNameClasses} form={formId} type="text" name="name" defaultValue={person.fields.name}></input>}
                  {!inEditMode && <span>{person.fields.name}</span>}
                  <div style={{display:((formErrors[person.id]||{}).required||[]).includes("name") ? "block" : "none"}} className="invalid-feedback">Name is required.</div>
                </td>
                <td className="center">
                  {inEditMode && <input className={indBirthdayClasses} form={formId} type="text" name="birthday" defaultValue={person.fields.birthday}></input>}
                  {!inEditMode && <Moment format="MM/DD/YYYY">{person.fields.birthday}</Moment>}
                  <div style={{display:((formErrors[person.id]||{}).required||[]).includes("birthday") ? "block" : "none"}} className="invalid-feedback" required>Birthday is required.</div>
                </td>
                <td className="center">
                  {inEditMode && <input className={indZipCodeClasses} form={formId} type="text" name="zipCode" defaultValue={person.fields.zipCode}></input>}
                  {!inEditMode && <span>{person.fields.zipCode}</span>}
                  <div style={{display:((formErrors[person.id]||{}).required||[]).includes("zipCode") ? "block" : "none"}} className="invalid-feedback">Zip Code is required.</div>
                  <div style={{display:((formErrors[person.id]||{}).format||[]).includes("zipCode") ? "block" : "none"}} className="invalid-feedback">Zip Code must be a 5 digit number.</div>
                </td>
                <td className="center">
                  <Moment format="YYYY-MM-DD HH:mm">{person.fields.createdTime}</Moment>
                </td>
                <td className="center">
                  <Moment format="YYYY-MM-DD HH:mm">{person.fields.modifiedTime}</Moment>
                </td>
                <td style={{display: 'none'}} className="center">
                  <input className="form-control" form={formId} type="text" hidden name="peopleNotes" defaultValue={person.fields.peopleNotes}></input>
                </td>
                <td className="center">
                  {!!personNotes.length &&
                    <span>
                      {!isNotesVisible &&
                        <a id={person.id} onClick={toggleNotes} className="btn btn-secondary">
                          Open <i className="bi bi-eye-fill" />
                        </a>
                      }
                      {!!isNotesVisible &&
                        <a id={person.id} onClick={toggleNotes} className="btn btn-secondary">
                          Close <i className="bi bi-eye-slash-fill" />
                        </a>
                      }
                    </span>
                  }
                  {!personNotes.length &&
                    <span>
                      {!isNotesVisible &&
                        <a id={person.id} onClick={toggleNotes} className="btn btn-secondary">
                          Add +
                        </a>
                      }
                      {!!isNotesVisible &&
                        <a id={person.id} onClick={toggleNotes} className="btn btn-secondary">
                          Cancel <i className="bi bi-journal-x" />
                        </a>
                      }
                    </span>
                  }
                </td>
                <td className="center">
                  {!inEditMode && <a id={person.id} onClick={enterEditMode} className="btn btn-secondary">
                    Edit <i className="bi bi-pencil-fill" />
                  </a>}
                  {inEditMode && <a type="submit" id={person.id} onClick={savePeopleForm} className="btn btn-secondary">
                    Save <i className="bi bi-save-fill" />
                  </a>}
                </td>
                <td className="center">
                  <a id={person.id} onClick={deletePerson} className="btn btn-danger">
                    Delete <i className="bi bi-trash-fill" />
                  </a>
                </td>
              </tr>
              {!!isNotesVisible &&
                <tr>
                  <td colSpan="8">
                  {!!personNotes.length && !!isNotesVisible &&
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Note</th>
                          <th>Created Time</th>
                          {/* <th>Edit/Save</th> */}
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {personNotes.map(note => {
                          var inNoteEditMode = editMode === note.id;
                          var noteFormId = "form_"+note.id;
                          return(
                            <tr>
                              <td style={{display: 'none'}}>
                                <form type="hidden" key={note.id} id={noteFormId}></form>
                              </td>
                              <td className="note-input">
                                {inNoteEditMode && <input className="form-control" form={noteFormId} type="text" name="note" defaultValue={note.fields.note}></input>}
                                {!inNoteEditMode && <span>{note.fields.note}</span>}
                              </td>
                              <td>
                                <Moment format="YYYY-MM-DD HH:mm">{note.fields.createdTime}</Moment>
                              </td>
                              {/* <td>
                                {!inNoteEditMode && <a id={note.id} onClick={enterEditMode} title="Edit" className="bi bi-pencil-fill"></a>}
                                {inNoteEditMode && <a type="submit" id={note.id} onClick={savePeopleNoteForm} title="Save" className="bi bi-save-fill"></a>}
                              </td> */}
                              <td className="center">
                                <a id={note.id} onClick={deleteNote}  className="btn btn-danger">
                                  Delete <i className="bi bi-trash-fill" />
                                </a>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                    }
                    <form key="new-note" id="new-note" className="row">
                      <input type="hidden" name="peopleId" value={person.id}></input>
                      <span className="col col-1">New Note:</span>
                      <input className="col form-control note-details" type="text" name="note" placeholder="Message" onChange={onNoteChange}></input>
                      <div className="col col-1">
                        <a type="submit" onClick={createNote} className="btn btn-primary save disabled">
                          Save <i className="col bi bi-save-fill" />
                        </a>
                      </div>
                    </form>
                  </td>
                </tr>
              }
              </tbody>
            )
          })}
      </table>
    </div>
  );
}

export default App;
