import NoteService from '../services/NoteService.js'
import NotesList from '../cmps/NotesList.jsx'
import NotesFilter from '../cmps/NotesFilter.jsx'
// import AddNotePanel from '../cmps/AddNotePanel.jsx'
// import AddNote from '../cmps/AddNote.jsx'

export default class NotesPage extends React.Component {
  state = {
    selectedNote: { type: 'NoteTxt', isPinned: false, info: '', id: null, style: { bccolor: '' }, isOnEdit: false },
    placeholder: 'Enter your TEXT...',
    //render all notes
    allNotes: [],
    filterBy: '',
  }

  componentDidMount() {
    this.loadNotes();
  }

  loadNotes = () => {
    NoteService.getNotes(this.state.filterBy).then(notes => { this.setState({ allNotes: notes }) }),
      this.render;
  }

  onFilter = (changeFilterField) => {
    this.setState(prevState => ({ filterBy: prevState.filterBy, ...changeFilterField }), this.loadNotes)

  }

  setComponent = (ev) => {
    let type = ev.target.value;
    this.setState(prevState => ({ selectedNote: { ...prevState.selectedNote, type } }), this.setPlaceholder)
  }

  onTextChange = (ev) => {
    let info = ev.target.value
    this.setState(prevState => ({ selectedNote: { ...prevState.selectedNote, info: info } }), this.loadNotes)
  }


  onChangeBcColor = (ev) => {
    let color = ev.target.value
    this.setState(prevState => ({ selectedNote: { ...prevState.selectedNote, style: { bccolor: color } } }), this.onUpdate)
  }


  onAdd = () => {
    NoteService.saveNote(this.state.selectedNote)
      .then(() => {
        this.loadNotes();
        this.cleanSelectedNote();
      })
  }


  onUpdate = () => {
    this.setState(prevState => ({ selectedNote: { ...prevState.selectedNote, isOnEdit: false } }), () => {
      let updatedInfo = this.state.selectedNote
      NoteService.editNote(updatedInfo).then(() => {
        // this.cleanSelectedNote();
        this.loadNotes();
      })
    })

  }

  onEdit = (note) => {
    let editedNote = { ...note, isOnEdit: true }
    this.setState({ selectedNote: editedNote }, () => {
      NoteService.editNote(editedNote).then(() => {
        this.loadNotes()
      })
    })

  }

  onDelete = (note) => {
    NoteService.deleteNote(note)
      .then(() => {
        this.loadNotes();
        this.cleanSelectedNote();
      })
  }

  cleanSelectedNote = () => {
    this.setState(prevState => ({ selectedNote: { ...prevState.selectedNote, isPinned: false, info: '', id: null, style: { bccolor: '' }, isSelected: false, isOnEdit: false } }), this.loadNotes)
  }

  setPlaceholder = () => {
    const noteType = (this.state.selectedNote.type)
    switch (noteType) {
      case 'NoteVideo':
        return this.setState({ placeholder: 'Enter youtube URL...' });
      case 'NoteImg':
        return this.setState({ placeholder: 'Enter image URL...' })
      case 'NoteTodos':
        return this.setState({ placeholder: 'Enter your TODO title...' })
      case 'NoteTxt':
        return this.setState({ placeholder: 'Enter your TEXT...' })
    }
  }

  render() {

    return <React.Fragment>

      {/* <h1 className="notes-container">Miss Notes</h1> */}

      <div className="addNotePanel heartbeat">
        <input type="text" className="addInputPanel heartbeat" placeholder={this.state.placeholder} onFocus={this.cleanSelectedNote} onChange={this.onTextChange} />
        <div id="radio" className="addNoteBtns" onChange={this.setComponent}>

          <input type="radio" id="radio1" value="NoteTxt" name="radio" />
          <label htmlFor="radio1"><i className="far fa-sticky-note fa-lg"></i></label>

          <input type="radio" id="radio2" value="NoteImg" name="radio" />
          <label htmlFor="radio2"><i className="far fa-images fa-lg"></i></label>

          <input type="radio" id="radio3" value="NoteTodos" name="radio" />
          <label htmlFor="radio3"><i className="fas fa-list-ul fa-lg"></i></label>

          <input type="radio" id="radio4" value="NoteVideo" name="radio" />
          <label htmlFor="radio4"><i className="fab fa-youtube-square fa-lg"></i></label>
        </div>

        <button className="addBtnNotes" onClick={this.onAdd}><i className="fas fa-plus-circle fa-lg"></i></button>

      </div>
      <NotesFilter filterBy={this.state.filterBy} onFilter={this.onFilter}></NotesFilter>
      <div className="notes-container">
        {this.state.allNotes.length > 0 && <NotesList onTextChange={this.onTextChange} onUpdate={this.onUpdate} onChangeBcColor={this.onChangeBcColor}
          onEdit={this.onEdit} selectedNote={this.state.seletedNote} onDelete={this.onDelete} allNotes={this.state.allNotes}></NotesList>
        }
      </div>

    </React.Fragment>
  }
}



