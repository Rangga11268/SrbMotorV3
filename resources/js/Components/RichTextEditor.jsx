import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    LinkIcon,
    ImageIcon,
    Undo2,
    Redo2,
    Code,
    Quote,
} from "lucide-react";

export default function RichTextEditor({
    value = "",
    onChange = () => {},
    placeholder = "Tulis konten di sini...",
    error = null,
    disabled = false,
    minHeight = "300px",
}) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
            }),
            Image.configure({
                allowBase64: true,
            }),
        ],
        content: value || "",
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editable: !disabled,
    });

    if (!editor) {
        return (
            <div className="border border-gray-300 rounded-lg p-4 text-gray-500">
                Loading editor...
            </div>
        );
    }

    const toggleLink = () => {
        const url = prompt("Masukkan URL:");
        if (url) {
            editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
        }
    };

    const addImage = () => {
        const url = prompt("Masukkan URL gambar:");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addImageFile = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                editor
                    .chain()
                    .focus()
                    .setImage({ src: event.target.result })
                    .run();
            };
            reader.readAsDataURL(file);
        }
    };

    const ToolbarButton = ({ onClick, isActive, icon: Icon, title }) => (
        <button
            onClick={onClick}
            className={`p-2 rounded transition ${
                isActive
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-200"
            }`}
            title={title}
            type="button"
            disabled={disabled}
        >
            <Icon size={18} strokeWidth={2} />
        </button>
    );

    const HeadingButton = ({ level, label }) => (
        <button
            onClick={() =>
                editor.chain().focus().toggleHeading({ level }).run()
            }
            className={`p-2 rounded transition text-sm font-bold ${
                editor.isActive("heading", { level })
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-200"
            }`}
            title={`Heading ${level}`}
            type="button"
            disabled={disabled}
        >
            {label}
        </button>
    );

    return (
        <div
            className={`border rounded-lg overflow-hidden ${
                error ? "border-red-500 ring-1 ring-red-300" : "border-gray-300"
            }`}
        >
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                {/* Text Formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    icon={Bold}
                    title="Bold (Ctrl+B)"
                />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    icon={Italic}
                    title="Italic (Ctrl+I)"
                />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive("strike")}
                    icon={Strikethrough}
                    title="Strikethrough"
                />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive("code")}
                    icon={Code}
                    title="Inline Code"
                />

                <div className="border-l border-gray-300 mx-1"></div>

                {/* Headings */}
                <HeadingButton level={1} label="H1" />
                <HeadingButton level={2} label="H2" />
                <HeadingButton level={3} label="H3" />

                <div className="border-l border-gray-300 mx-1"></div>

                {/* Lists */}
                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    isActive={editor.isActive("bulletList")}
                    icon={List}
                    title="Bullet List"
                />

                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    isActive={editor.isActive("orderedList")}
                    icon={ListOrdered}
                    title="Ordered List"
                />

                <ToolbarButton
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    isActive={editor.isActive("blockquote")}
                    icon={Quote}
                    title="Blockquote"
                />

                <div className="border-l border-gray-300 mx-1"></div>

                {/* Link & Image */}
                <ToolbarButton
                    onClick={toggleLink}
                    isActive={editor.isActive("link")}
                    icon={LinkIcon}
                    title="Add Link"
                />

                <ToolbarButton
                    onClick={addImage}
                    icon={ImageIcon}
                    title="Add Image from URL"
                />

                <label
                    className="p-2 rounded transition cursor-pointer text-gray-700 hover:bg-gray-200"
                    title="Upload Image"
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={addImageFile}
                        className="hidden"
                        disabled={disabled}
                    />
                    <ImageIcon size={18} strokeWidth={2} />
                </label>

                <div className="border-l border-gray-300 mx-1"></div>

                {/* Undo/Redo */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    icon={Undo2}
                    title="Undo (Ctrl+Z)"
                />

                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    icon={Redo2}
                    title="Redo (Ctrl+Y)"
                />
            </div>

            {/* Editor Content Area */}
            <div className="p-4 bg-white overflow-y-auto" style={{ minHeight }}>
                <EditorContent
                    editor={editor}
                    className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:font-bold prose-em:italic"
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-t border-red-200 p-3 text-sm text-red-700 font-medium">
                    ⚠️ {error}
                </div>
            )}

            {/* Helper Text */}
            <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 text-xs text-gray-500">
                💡 Gunakan toolbar untuk formatting konten. Ctrl+Z untuk undo,
                Ctrl+Y untuk redo.
            </div>
        </div>
    );
}
