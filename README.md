## Run the application

In the project directory, you can run:

### npm install

Install dependencies

### npm test

Launches the test runner in the interactive watch mode.\

### npm start

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## General approach

This project required that People data be displayed in a table format. I wanted to build on that by allowing the user to perform most of the CRUD tasks within the same table. Similar to a spreadsheet, it would allow the user to create data within the same page as reading the data and allow the user to edit the data inline as well.

Each table row first displays the Person's record metadata followed buttons that allow the user to either read the PeopleNotes data, edit data, or delete data. When opening a Person's individual Notes section, the user has the option to add more notes from there or delete existing notes. (Please note: I actually added the ability to edit these notes, which I left commented in the code, until I realized that PeopleNotes shouldn't be edited from the code challenge prompt.)

Features include:
* Create/Read/Update/Delete for People data. Create/Read/Delete for PeopleNotes data.
* Ability to toggle viewing individual Person's notes.
* Ability to edit Person's data within its table row.
* Conditionally display different button options for user based on if Person has notes ("Open") or not ("Add").
* Individual PeopleNotes "Save" button is disabled unless Note input has text.
* Create/Edit Person form has validation for required fields as well as Zip Code format (5-digit number).

## Future Work

* More Testing: I didn't get around to adding more tests based on this app's features
* Docker Setup
* Upon Create/Update/Delete success, refactoring to update state for individual record directly rather than GET-ing all data again
* Form Validation: Review proper birthday format; Warn user of duplicate name (but still allow them to create duplicate)
* Date picker for birthday
* Generally improve app styling/format
* Make app more responsive across screen/device sizes
* Add keyboard shortcuts (tabbing, pressing Enter to save, general accessibility)
* Applying animation to visual changes within the app, i.e. open/closing individual Person's notes, adding new data to table, deleting data
* Messaging to indicate if Create/Update data saving was successful or not; highlighting new data that's added to the table
* Ability to cancel editing individual Person record (get out of Edit Mode) without needing to re-Save data
* Loading indicator when Creating/Reading/Updating/Deleting data
* Soft delete/Recover from Trash
* Creating PeopleNotes for individual Person while creating said new Person record
* Table pagination

## References

* This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
* AJAX https://api.jquery.com/jquery.ajax/
* React Hooks https://reactjs.org/docs/hooks-overview.html
* serializeArray https://api.jquery.com/serializeArray/
* How to use form inputs within a table (html) https://stackoverflow.com/questions/1249688/html-is-it-possible-to-have-a-form-tag-in-each-table-row-in-a-xhtml-valid-way
* Remove 0 when rendering a component conditionally https://www.designcise.com/web/tutorial/why-is-react-showing-0-when-conditionally-rendering-a-component
* How to format arrays/objects properly when using setState hook https://stackoverflow.com/questions/59100863/how-to-set-state-array-using-react-hooks
* Add Bootstrap to Create React App https://create-react-app.dev/docs/adding-bootstrap/
* How to use Moment with React https://www.delftstack.com/howto/react/moment-react/
