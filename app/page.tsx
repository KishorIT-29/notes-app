"use client";

import React, { useState, useEffect } from 'react';

// === Utility Functions for Persistence and ID Generation ===

// Simple function to generate a unique ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 5);

const STORAGE_KEY = 'nextjs_simulated_notes_v1';

// Load initial state from localStorage
const loadInitialNotes = () => {
    if (typeof window !== 'undefined') {
        const storedNotes = localStorage.getItem(STORAGE_KEY);
        return storedNotes ? JSON.parse(storedNotes) : [];
    }
    return [];
};

// Save state to localStorage
const saveNotes = (notes: any[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
};

// === Main Application Components ===

// This is a client component simulation, analogous to Next.js using "use client"
// The entire logic is housed here.

// ------------------------------------------------------------------
// 1. Add/Edit Form Component
// ------------------------------------------------------------------
const NoteForm = ({ noteToEdit, onSave, onCancel }: any) => {
    const [title, setTitle] = useState(noteToEdit ? noteToEdit.title : '');
    const [content, setContent] = useState(noteToEdit ? noteToEdit.content : '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        const newNote = {
            id: noteToEdit ? noteToEdit.id : generateId(),
            title: title.trim(),
            content: content.trim(),
            createdAt: noteToEdit ? noteToEdit.createdAt : new Date().toISOString(),
        };
        onSave(newNote);
        setTitle('');
        setContent('');
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 mb-6 transition-all duration-300">
            <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-4">{noteToEdit ? 'Edit Note' : 'Add New Note'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Note Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition duration-150"
                    required
                />
                <textarea
                    placeholder="Note Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition duration-150 resize-none"
                    required
                ></textarea>
                <div className="flex justify-end space-x-3">
                    {noteToEdit && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-150"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 shadow-md"
                    >
                        {noteToEdit ? 'Update Note' : 'Add Note'}
                    </button>
                </div>
            </form>
        </div>
    );
};


// ------------------------------------------------------------------
// 2. Note Detail Screen (Simulates app/notes/[id]/page.tsx)
// ------------------------------------------------------------------
const NoteDetailScreen = ({ note, navigate, onDelete, onEdit }: any) => {
    if (!note) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Note Not Found</h1>
                <button
                    onClick={() => navigate('/notes')}
                    className="mt-4 px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-150"
                >
                    &larr; Back to all notes
                </button>
            </div>
        );
    }

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete note: "${note.title}"?`)) {
            onDelete(note.id);
            navigate('/notes'); // Navigate back after deletion
        }
    };

    const formattedDate = new Date(note.createdAt).toLocaleDateString();

    return (
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl space-y-6 transition-colors duration-300">
            <div className="flex justify-between items-center border-b pb-4 dark:border-gray-700">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">{note.title}</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(note)}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-150 rounded-full bg-gray-50 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                        title="Edit Note"
                    >
                        {/* Edit Icon (Pencil) */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-red-600 hover:text-white transition duration-150 rounded-full bg-red-100 dark:bg-red-900/20 hover:bg-red-600"
                        title="Delete Note"
                    >
                        {/* Delete Icon (Trash) */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Created: {formattedDate}</p>
            <div className="text-lg text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed pt-4 border-t border-gray-100 dark:border-gray-700">
                {note.content}
            </div>
            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={() => navigate('/notes')}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition duration-150"
                >
                    &larr; Back to all notes
                </button>
            </div>
        </div>
    );
};

// ------------------------------------------------------------------
// 3. Note List Screen (Simulates app/notes/page.tsx)
// ------------------------------------------------------------------
const NoteListScreen = ({ notes, navigate, onSaveNote, onDeleteNote, onEditNoteStart }: any) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState(null);

    const filteredNotes = notes.filter((note: any) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const handleSave = (note: any) => {
        onSaveNote(note);
        setIsAdding(false);
        setNoteToEdit(null);
    };

    const handleEditStart = (note: any) => {
        setNoteToEdit(note);
        setIsAdding(false); // Ensure we don't show the add form if editing
    };

    const handleCancelEdit = () => {
        setNoteToEdit(null);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4 transition-colors duration-300">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Notes ({notes.length})</h1>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition duration-150"
                    />
                    <button
                        onClick={() => { setIsAdding(!isAdding); setNoteToEdit(null); }}
                        className="px-6 py-3 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-150 shadow-md"
                    >
                        {isAdding ? 'Close Form' : '+ Add New Note'}
                    </button>
                </div>
            </div>

            {/* Conditional Form Display (Add or Edit) */}
            {(isAdding || noteToEdit) && (
                <NoteForm
                    noteToEdit={noteToEdit}
                    onSave={handleSave}
                    onCancel={isAdding ? () => setIsAdding(false) : handleCancelEdit}
                />
            )}

            {/* Notes List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.length > 0 ? (
                    filteredNotes.map((note: any) => (
                        <div
                            key={note.id}
                            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border-t-4 border-indigo-500 hover:shadow-xl transition duration-300 space-y-3"
                        >
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{note.title}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 h-14">{note.content}</p>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-50 dark:border-gray-700">
                                <p className="text-xs text-gray-400">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </p>
                                <button
                                    onClick={() => navigate(`/notes/${note.id}`)}
                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-sm transition duration-150 flex items-center"
                                >
                                    View Details
                                    {/* Arrow Icon */}
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="md:col-span-3 text-center p-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-lg text-gray-500 dark:text-gray-400">No notes match your search criteria.</p>
                        {notes.length === 0 && <p className="mt-2 text-gray-400">Click "Add New Note" to get started!</p>}
                    </div>
                )}
            </div>
        </div>
    );
};


// ------------------------------------------------------------------
// 4. Main App Component (Simulates Next.js Layout/Routing)
// ------------------------------------------------------------------
export default function App() {
    // Simulates application state and persistence
    const [notes, setNotes] = useState(loadInitialNotes);
    const [currentPath, setCurrentPath] = useState('/notes');

    // Effect to save notes whenever the state changes
    useEffect(() => {
        saveNotes(notes);
    }, [notes]);

    // Simulates browser navigation (history push for URLs)
    // For this environment, we just update the path state.
    const navigate = (path: string) => {
        setCurrentPath(path);
    };

    // --- CRUD Operations ---

    const handleSaveNote = (newNote: any) => {
        setNotes((prevNotes: any[]) => {
            const existingIndex = prevNotes.findIndex(n => n.id === newNote.id);
            if (existingIndex > -1) {
                // Edit existing note
                const updatedNotes = [...prevNotes];
                updatedNotes[existingIndex] = newNote;
                return updatedNotes;
            } else {
                // Add new note
                return [newNote, ...prevNotes];
            }
        });
    };

    const handleDeleteNote = (id: string) => {
        setNotes((prevNotes: any[]) => prevNotes.filter(note => note.id !== id));
    };

    // --- Routing Logic ---

    // Determine if we are on the detail page: /notes/[id]
    const match = currentPath.match(/^\/notes\/(.+)$/);
    const noteId = match ? match[1] : null;

    if (noteId) {
        const note = notes.find((n: any) => n.id === noteId);
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f11] p-4 sm:p-8 transition-colors duration-300">
                <NoteDetailScreen
                    note={note}
                    navigate={navigate}
                    onDelete={handleDeleteNote}
                    onEdit={handleSaveNote} // Edit form is integrated into the detail screen flow
                />
            </div>
        );
    }

    // Default to the list view: /notes
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f11] p-4 sm:p-8 transition-colors duration-300">
            <NoteListScreen
                notes={notes}
                navigate={navigate}
                onSaveNote={handleSaveNote}
                onDeleteNote={handleDeleteNote}
            />
        </div>
    );
}
