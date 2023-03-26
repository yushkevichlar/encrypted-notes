import {
  useEditor,
  EditorContent,
  JSONContent,
  generateText,
  AnyCommands,
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
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faAlignJustify,
  faList,
  faListOl,
  faListCheck,
  faArrowRotateLeft,
  faArrowRotateRight,
  faAnglesDown,
  faAnglesUp,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./NoteEditor.module.css";
import { Note } from "../../../types";
import { useEffect, useState } from "react";

const extensions = [
  StarterKit,
  Highlight,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  TaskList.configure({
    HTMLAttributes: {
      class: styles.taskList,
    },
  }),
  TaskItem.configure({
    nested: true,
  }),
];

type Props = {
  note: Note;
  isSidebarOpen: Boolean;
  onChange: (content: JSONContent, title?: string) => void;
};

const isFoldingToolbarWidth = () => {
  return window.innerWidth < 1300;
};

function NoteEditor({ note, isSidebarOpen, onChange }: Props) {
  const [isFoldingToolbar, setIsFoldingToolbar] = useState<boolean>(
    isFoldingToolbarWidth()
  );
  const [toolbarOpen, setToolbarOpen] = useState<boolean>(false);

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
        const editorContent = editor?.getJSON();
        const firstNodeContent = editorContent?.content?.[0];

        if (editorContent) {
          onChange(
            editorContent,
            firstNodeContent && generateText(firstNodeContent, extensions)
          );
        }
      },
    },
    [note.id]
  );

  const toggleHeading = (headerLevel: any) => {
    editor?.chain().focus().toggleHeading({ level: headerLevel }).run();
  };

  useEffect(() => {
    function handleWindowResize() {
      setIsFoldingToolbar(isFoldingToolbarWidth());
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <div
      className={styles.editorContainer}
      style={{ maxWidth: isSidebarOpen ? "85%" : "95%" }}>
      {isFoldingToolbar && !toolbarOpen ? (
        <div className={styles.expandBtnWrapper}>
          {" "}
          <FontAwesomeIcon
            className={styles.expandBtn}
            icon={faAnglesDown}
            onClick={() => setToolbarOpen(true)}
          />{" "}
        </div>
      ) : (
        <div className={styles.toolbar}>
          <div className={styles.toolbarOptions}>
            <button
              className={
                editor?.isActive("bold")
                  ? styles.toolbarButtonActive
                  : styles.toolbarButton
              }
              type="button"
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
              type="button"
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
              type="button"
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
              type="button"
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
              type="button"
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
              type="button"
              title="H1"
              onClick={() => toggleHeading(1)}>
              H1
            </button>

            <button
              className={
                editor?.isActive("heading", { level: 2 })
                  ? styles.toolbarButtonActive
                  : styles.toolbarButton
              }
              type="button"
              title="H2"
              onClick={() => toggleHeading(2)}>
              H2
            </button>

            <button
              className={
                editor?.isActive("heading", { level: 3 })
                  ? styles.toolbarButtonActive
                  : styles.toolbarButton
              }
              type="button"
              title="H3"
              onClick={() => toggleHeading(3)}>
              H3
            </button>

            <button
              className={
                editor?.isActive("heading", { level: 4 })
                  ? styles.toolbarButtonActive
                  : styles.toolbarButton
              }
              type="button"
              title="H4"
              onClick={() => toggleHeading(4)}>
              H4
            </button>

            <button
              className={
                editor?.isActive("heading", { level: 5 })
                  ? styles.toolbarButtonActive
                  : styles.toolbarButton
              }
              type="button"
              title="H5"
              onClick={() => toggleHeading(5)}>
              H5
            </button>

            <button
              className={
                editor?.isActive("heading", { level: 6 })
                  ? styles.toolbarButtonActive
                  : styles.toolbarButton
              }
              type="button"
              title="H6"
              onClick={() => toggleHeading(6)}>
              H6
            </button>

            <button
              className={
                editor?.isActive("heading", { level: 6 })
                  ? styles.toolbarButtonActive
                  : styles.toolbarButton
              }
              type="button"
              title="Align Left"
              onClick={() =>
                editor?.chain().focus().setTextAlign("left").run()
              }>
              <FontAwesomeIcon icon={faAlignLeft} />
            </button>

            <button
              className={
                editor?.isActive("heading", { level: 6 })
                  ? styles.toolbarButtonActive
                  : styles.toolbarButton
              }
              type="button"
              title="Align Center"
              onClick={() =>
                editor?.chain().focus().setTextAlign("center").run()
              }>
              <FontAwesomeIcon icon={faAlignCenter} />
            </button>

            <button
              className={
                editor?.isActive("heading", { level: 6 })
                  ? styles.toolbarButtonActive
                  : styles.toolbarButton
              }
              type="button"
              title="Align Right"
              onClick={() =>
                editor?.chain().focus().setTextAlign("right").run()
              }>
              <FontAwesomeIcon icon={faAlignRight} />
            </button>

            <button
              className={
                editor?.isActive("heading", { level: 6 })
                  ? styles.toolbarButtonActive
                  : styles.toolbarButton
              }
              type="button"
              title="Align Justify"
              onClick={() =>
                editor?.chain().focus().setTextAlign("justify").run()
              }>
              <FontAwesomeIcon icon={faAlignJustify} />
            </button>

            {/* <button
            className={
              editor?.isActive("codeBlock")
                ? styles.toolbarButtonActive
                : styles.toolbarButton
            }
            type="button"
            title="Code Block"
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
            Code Block
          </button> */}

            <button
              className={
                editor?.isActive("highlight")
                  ? styles.toolbarButtonActive
                  : styles.toolbarButton
              }
              type="button"
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
              type="button"
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
              type="button"
              title="Ordered List"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
              <FontAwesomeIcon icon={faListOl} />
            </button>

            <button
              className={
                editor?.isActive("taskList")
                  ? styles.toolbarButtonActive
                  : styles.toolbarButton
              }
              type="button"
              title="Task List"
              onClick={() => editor?.chain().focus().toggleTaskList().run()}>
              <FontAwesomeIcon icon={faListCheck} />
            </button>
          </div>

          <div>
            <button
              className={
                editor?.isActive("undo")
                  ? styles.toolbarButtonActive
                  : styles.toolbarButton
              }
              type="button"
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
              type="button"
              title="Redo"
              onClick={() => editor?.chain().focus().redo().run()}
              disabled={!editor?.can().chain().focus().redo().run()}>
              <FontAwesomeIcon icon={faArrowRotateRight} />
            </button>

            <button
              style={{ display: isFoldingToolbar ? "inline-block" : "none" }}
              className={styles.collapseBtn}
              type="button"
              title="Collapse Toolbar">
              <FontAwesomeIcon
                icon={faAnglesUp}
                onClick={() => setToolbarOpen(false)}
              />
            </button>
          </div>
        </div>
      )}

      <EditorContent editor={editor} className={styles.textEditorContent} />
    </div>
  );
}

export default NoteEditor;
