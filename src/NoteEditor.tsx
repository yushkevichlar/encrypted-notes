import {
  useEditor,
  EditorContent,
  JSONContent,
  generateText,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faStrikethrough,
  faCode,
  faParagraph,
  faHighlighter,
  faList,
  faListOl,
  faArrowRotateLeft,
  faArrowRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./NoteEditor.module.css";
import { Note } from "./types";

const extensions = [
  StarterKit,
  Highlight,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
];

type Props = {
  note: Note;
  onChange: (content: JSONContent, title?: string) => void;
};

function NoteEditor({ note, onChange }: Props) {
  const editor = useEditor(
    {
      extensions,
      content: note.content,
      editorProps: {
        attributes: {
          class: styles.textEditor,
        },
      },

      onUpdate: ({ editor }) => {
        const editorContent = editor.getJSON();
        const firstNodeContent = editorContent.content?.[0];

        onChange(
          editorContent,
          firstNodeContent && generateText(firstNodeContent, extensions)
        );
      },
    },
    [note.id]
  );

  const toggleHeading = (headerLevel: number) => {
    editor?.chain().focus().toggleHeading({ level: headerLevel }).run();
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.toolbar}>
        <div>
          <button
            className={
              editor?.isActive("bold")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            title="Bold"
            onClick={() => editor?.chain().focus().toggleBold().run()}>
            <FontAwesomeIcon icon={faBold} />
          </button>

          <button
            className={
              editor?.isActive("italic")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            title="Italic"
            onClick={() => editor?.chain().focus().toggleItalic().run()}>
            <FontAwesomeIcon icon={faItalic} />
          </button>

          <button
            className={
              editor?.isActive("strike")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            title="Strike"
            onClick={() => editor?.chain().focus().toggleStrike().run()}>
            <FontAwesomeIcon icon={faStrikethrough} />
          </button>

          <button
            className={
              editor?.isActive("code")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            title="Code"
            onClick={() => editor?.chain().focus().toggleCode().run()}>
            <FontAwesomeIcon icon={faCode} />
          </button>

          <button
            className={
              editor?.isActive("paragraph")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            title="Paragraph"
            onClick={() => editor?.chain().focus().setParagraph().run()}>
            <FontAwesomeIcon icon={faParagraph} />
          </button>

          <button
            className={
              editor?.isActive("heading", { level: 1 })
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            onClick={() => toggleHeading(1)}>
            H1
          </button>

          <button
            className={
              editor?.isActive("heading", { level: 2 })
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            onClick={() => toggleHeading(2)}>
            H2
          </button>

          <button
            className={
              editor?.isActive("heading", { level: 3 })
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            onClick={() => toggleHeading(3)}>
            H3
          </button>

          <button
            className={
              editor?.isActive("heading", { level: 4 })
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            onClick={() => toggleHeading(4)}>
            H4
          </button>

          <button
            className={
              editor?.isActive("heading", { level: 5 })
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            onClick={() => toggleHeading(5)}>
            H5
          </button>

          <button
            className={
              editor?.isActive("heading", { level: 6 })
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            onClick={() => toggleHeading(6)}>
            H6
          </button>

          {/* <button
            className={
              editor?.isActive("codeBlock")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
            Code Block
          </button> */}

          <button
            className={
              editor?.isActive("highlight")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            title="Highlight"
            onClick={() => editor?.chain().focus().toggleHighlight().run()}>
            <FontAwesomeIcon icon={faHighlighter} />
          </button>

          <button
            className={
              editor?.isActive("bulletList")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            title="Bullet List"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}>
            <FontAwesomeIcon icon={faList} />
          </button>

          <button
            className={
              editor?.isActive("orderedList")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            title="Ordered List"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
            <FontAwesomeIcon icon={faListOl} />
          </button>

          {/* <button
            className={
              editor?.isActive("taskList")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            onClick={() => editor?.chain().focus().toggleTaskList().run()}>
            Task List
          </button> */}
        </div>

        <div>
          <button
            className={
              editor?.isActive("undo")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            title="Undo"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().chain().focus().undo().run()}>
            <FontAwesomeIcon icon={faArrowRotateLeft} />
          </button>

          <button
            className={
              editor?.isActive("redo")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            title="Redo"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().chain().focus().redo().run()}>
            <FontAwesomeIcon icon={faArrowRotateRight} />
          </button>
        </div>
      </div>

      <EditorContent editor={editor} className={styles.textEditorContent} />
    </div>
  );
}

export default NoteEditor;
