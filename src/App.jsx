import React from "react"
import Sidebar from "../components/Sidebar.jsx";
import Editor from "../components/Editor.jsx"
import Split from "react-split"
import { nanoid } from "nanoid"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore";
import { notesCollection, db } from "../firebase.js";

export default function App() {
    const [notes, setNotes] = React.useState([]);
    const [currentNoteId, setCurrentNoteId] = React.useState("");
    
    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]

    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))

            setNotes(notesArr)

        });

        return unsubscribe;
    }, [])

    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes]);

    // function currentTimeDayStamp (current) {
    //     const currentDate = new Date(current);

    //     // Get various components of the date
    //     const year = currentDate.getFullYear();
    //     const month = currentDate.getMonth() + 1; // Month is zero-based, so add 1
    //     const day = currentDate.getDate();
    //     const hours = currentDate.getHours();
    //     const minutes = currentDate.getMinutes();
    //     const seconds = currentDate.getSeconds();

    //     // Create a formatted date string
    //     const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    //     return current// Output: formatted date string
    // }

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

        const newNoteRef = await addDoc(notesCollection, newNote);
        setCurrentNoteId(newNoteRef.id)
    }

    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId);
        await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true } );
    }

    async function deleteNote(noteId) {
        const docRef = doc(db, "notes", noteId);
        await deleteDoc(docRef);
    }

   
     let sortedNotes = notes.sort(( a, b ) => {
        return b.updatedAt - a.updatedAt
     });

     
    

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                       {
                            currentNoteId && notes.length > 0 ? (
                                <Editor
                                    currentNote={currentNote}
                                    updateNote={updateNote}
                                />
                            ) : null
                        }

                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}
