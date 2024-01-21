// rehype
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeStringify from "rehype-stringify"
// codemirror
import { EditorState } from "@codemirror/state"
import {
  EditorView,
  drawSelection,
  highlightSpecialChars,
  keymap,
} from "@codemirror/view"
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands"
import { markdown, markdownKeymap } from "@codemirror/lang-markdown"
// markdown toolbar
import "@github/markdown-toolbar-element"
// styles
import "./style.css"
import { defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language"

const editor = document.getElementById("code-mirror-editor")!
const editorCtn = document.querySelector(".markdown-editor")!
const preview = document.getElementById("remark-rehype")!
const previewCtn = document.querySelector(".markdown-preview")!

async function updateMarkdownPreview(md: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    // .use(rehypeDocument)
    // .use(rehypeFormat)
    .use(rehypePrettyCode)
    .use(rehypeStringify)
    .process(md)

  preview.innerHTML = String(file)
}

//

const state = EditorState.create({
  extensions: [
    highlightSpecialChars(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    markdown(),
    drawSelection(),
    history(),
    EditorState.allowMultipleSelections.of(true),
    keymap.of([
      ...defaultKeymap,
      ...historyKeymap,
      ...markdownKeymap,
      indentWithTab,
    ]),
  ],
})

//

const view = new EditorView({
  state,
  parent: editor,
})

;(() => {
  previewCtn.classList.add("hidden")
})()

document.getElementById("toggle")!.addEventListener("click", () => {
  if (previewCtn.classList.contains("hidden")) {
    updateMarkdownPreview(view.state.doc.toString())
  }
  editorCtn.classList.toggle("hidden")
  previewCtn.classList.toggle("hidden")
})
