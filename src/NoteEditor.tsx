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
            onClick={() => editor?.chain().focus().toggleBold().run()}>
            Bold
          </button>

          <button
            className={
              editor?.isActive("italic")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            onClick={() => editor?.chain().focus().toggleItalic().run()}>
            Italic
          </button>

          <button
            className={
              editor?.isActive("strike")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            onClick={() => editor?.chain().focus().toggleStrike().run()}>
            Strike
          </button>

          <button
            className={
              editor?.isActive("code")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            onClick={() => editor?.chain().focus().toggleCode().run()}>
            Code
          </button>

          <button
            className={
              editor?.isActive("paragraph")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            onClick={() => editor?.chain().focus().setParagraph().run()}>
            Paragraph
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
            onClick={() => editor?.chain().focus().toggleHighlight().run()}>
            Highlight
          </button>

          <button
            className={
              editor?.isActive("bulletList")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            onClick={() => editor?.chain().focus().toggleBulletList().run()}>
            Bullet List
          </button>

          <button
            className={
              editor?.isActive("orderedList")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
            Ordered List
          </button>

          <button
            className={
              editor?.isActive("taskList")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            onClick={() => editor?.chain().focus().toggleTaskList().run()}>
            Task List
          </button>
        </div>

        <div>
          <button
            className={
              editor?.isActive("undo")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!editor?.can().chain().focus().undo().run()}>
            Undo
          </button>

          <button
            className={
              editor?.isActive("redo")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!editor?.can().chain().focus().redo().run()}>
            Redo
          </button>
        </div>
      </div>

      <EditorContent editor={editor} className={styles.textEditorContent} />
    </div>
  );
}

export default NoteEditor;
