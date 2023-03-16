import { useState, useEffect } from "react";
import { JSONContent } from "@tiptap/react";
import { v4 as uuid } from "uuid";
import styles from "./NotesPage.module.css";
import NoteEditor from "./NoteEditor";
import { Note, UserData } from "./types";
import storage from "./storage";
import debounce from "./debounce";
import { AES, enc } from "crypto-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons/faCircleXmark";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { db } from "./db";

const STORAGE_KEY = "notes";

const loadNotes = async ({ username, passphrase }: UserData) => {
  // const noteIds = storage.get<string[]>(`${username}:${STORAGE_KEY}`, []);
  // const notes: Record<string, Note> = {};

  let noteIds: string[] = [];
  const notes: Record<string, Note> = {};

  try {
    const snapshot = await db.ref("/notes").get();

    if (snapshot.exists()) {
      const data = snapshot.val();

      for (let key in data) {
        if (key.split(":").shift() === username) {
          noteIds.push(key.split(":").pop());
        }
      }

      noteIds.forEach((id) => {
        // const encryptedNote = storage.get<string>(
        //   `${username}:${STORAGE_KEY}:${id}`
        // );

        let encryptedNote = "";

        for (let key in data) {
          if (key.includes(id)) {
            encryptedNote = data[key].encryptedNote;
          }
        }

        if (encryptedNote) {
          const note: Note = JSON.parse(
            AES.decrypt(encryptedNote, passphrase).toString(enc.Utf8)
          );

          notes[note.id] = {
            ...note,
            updatedAt: new Date(note.updatedAt),
          };
        }
      });

      return notes;
    } else {
      console.log("NO DATA");
    }
  } catch (error) {
    console.log(error);
  }
};

const saveNote = debounce(
  async (note: Note, { username, passphrase }: UserData) => {
    const noteIds = storage.get<string[]>(`${username}:${STORAGE_KEY}`, []);
    const noteIdsWithoutNote = noteIds.filter((id) => id !== note.id);

    storage.set(`${username}:${STORAGE_KEY}`, [...noteIdsWithoutNote, note.id]);

    const encryptedNote = AES.encrypt(
      JSON.stringify(note),
      passphrase
    ).toString();

    storage.set(`${username}:${STORAGE_KEY}:${note.id}`, encryptedNote);

    try {
      const snapshot = await db.ref("/notes").get();

      if (snapshot.exists()) {
        const key = `${username}:${STORAGE_KEY}:${note.id}`;
        db.ref(`notes/${key}`).set({ encryptedNote });
      } else {
        console.log("NO DATA");
      }
    } catch (error) {
      console.log(error);
    }
  },
  200
);

type Props = {
  userData: UserData;
};

function App({ userData }: Props) {
  const [notes, setNotes] = useState<Record<string, Note>>(() =>
    loadNotes(userData)
  );

  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const activeNote = activeNoteId ? notes[activeNoteId] : null;

  const handleChangeNoteContent = (
    noteId: string,
    content: JSONContent,
    title = "New note"
  ) => {
    const updatedNote = {
      ...notes[noteId],
      updatedAt: new Date(),
      content,
      title,
    };

    setNotes((notes) => ({
      ...notes,
      [noteId]: updatedNote,
    }));

    saveNote(updatedNote, userData);
  };

  const handleCreateNewNote = () => {
    const newNote = {
      id: uuid(),
      title: "New note",
      content: `<h1>New note</h1>`,
      updatedAt: new Date(),
    };

    setNotes((notes) => ({
      ...notes,
      [newNote.id]: newNote,
    }));

    setActiveNoteId(newNote.id);
    saveNote(newNote, userData);
  };

  const handleChangeActiveNote = (id: string) => {
    setActiveNoteId(id);
  };

  const handleDeleteNote = (noteId: string) => {
    storage.remove(`${userData.username}:${STORAGE_KEY}:${noteId}`);

    const key = `${userData.username}:${STORAGE_KEY}:${noteId}`;

    db.ref(`notes/${key}`).remove();

    let notesWithoutNote = {};

    for (let key in notes) {
      if (key !== noteId) {
        notesWithoutNote[key] = notes[key];
      }
    }

    setNotes(() => ({
      ...notesWithoutNote,
    }));
  };

  useEffect(() => {
    loadNotes(userData).then((data) => {
      setNotes(data);
    });
  }, []);

  const notesList = Object.values(notes).sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  const handleLogOut = () => {
    localStorage.removeItem("email");
    window.location.reload();
  };

  if (!notesList)
    return (
      <div className={styles.loadingMessage}>
        <p>
          Loading<span>.</span>
          <span>.</span>
          <span>.</span>
        </p>
      </div>
    );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.sidebar}>
        <button
          className={styles.sidebarNewNoteBtn}
          onClick={handleCreateNewNote}>
          New Note
        </button>

        <div className={styles.sidebarList}>
          {notesList.map((note) => (
            <div key={note.id}>
              <div className={styles.sidebarItemContainer}>
                <div
                  role="button"
                  tabIndex={0}
                  className={
                    note.id === activeNoteId
                      ? styles.sidebarItemActive
                      : styles.sidebarItem
                  }
                  onClick={() => handleChangeActiveNote(note.id)}>
                  {note.title}
                </div>

                <div
                  role="button"
                  tabIndex={1}
                  className={styles.deleteIconContainer}
                  title="Delete note"
                  onClick={() => handleDeleteNote(note.id)}>
                  <FontAwesomeIcon icon={faCircleXmark} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className={styles.sidebarLogoutBtn} onClick={handleLogOut}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          Logout
        </button>
      </div>

      {activeNote ? (
        <NoteEditor
          note={activeNote}
          onChange={(content, title) =>
            handleChangeNoteContent(activeNote.id, content, title)
          }
        />
      ) : (
        <div className={styles.notSelectedText}>
          Create a new note or select an existing one
        </div>
      )}
    </div>
  );
}

export default App;
