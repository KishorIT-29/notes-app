import React, { useState, useEffect } from 'react';

// === Utility Functions ===
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 5);

const STORAGE_KEY = 'notes_app_data_v1';

const loadNotesFromStorage = () => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    }
    return [];
};

const saveNotesToStorage = (notes) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
};

// === NoteForm Component ===
const NoteForm = ({ noteToEdit, onSave, onCancel }) => {
    const [title, setTitle] = useState(noteToEdit?.title || '');
    const [content, setContent] = useState(noteToEdit?.content || '');

    useEffect(() => {
        if (noteToEdit) {
            setTitle(noteToEdit.title);
            setContent(noteToEdit.content);
        }
    }, [noteToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        const note = {
            id: noteToEdit?.id || generateId(),
            title: title.trim(),
            content: content.trim(),
            createdAt: noteToEdit?.createdAt || new Date().toISOString(),
        };

        onSave(note);

        if (!noteToEdit) {
            setTitle('');
            setContent('');
        }
    };

    return (
        <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-2xl shadow-xl border border-indigo-100 mb-8 transform transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-2xl font-bold text-indigo-700 mb-5 flex items-center gap-2">
                {noteToEdit ? (
                    <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Note
                    </>
                ) : (
                    <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Note
                    </>
                )}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Enter note title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-400 bg-white shadow-sm"
                        required
                    />
                </div>

                <div className="relative">
                    <textarea
                        placeholder="Write your note content here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="5"
                        className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-400 bg-white resize-none shadow-sm"
                        required
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="px-8 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                        {noteToEdit ? 'Update Note' : 'Save Note'}
                    </button>
                </div>
            </form>
        </div>
    );
};

// === NoteListScreen Component ===
const NoteListScreen = ({ notes, navigate, onSaveNote }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const filteredNotes = notes
        .filter(note =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const handleSave = (note) => {
        onSaveNote(note);
        setIsAdding(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-indigo-100">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                My Notes
                            </h1>
                            <p className="text-gray-600 font-medium">
                                {notes.length} {notes.length === 1 ? 'note' : 'notes'} total
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-80">
                                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search notes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-indigo-200 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                                />
                            </div>

                            <button
                                onClick={() => setIsAdding(!isAdding)}
                                className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                {isAdding ? 'Close Form' : 'Add Note'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                {isAdding && (
                    <NoteForm
                        onSave={handleSave}
                        onCancel={() => setIsAdding(false)}
                    />
                )}

                {/* Notes Grid */}
                {filteredNotes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNotes.map(note => (
                            <div
                                key={note.id}
                                className="group bg-white p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:shadow-2xl hover:scale-105 transition-all duration-300 space-y-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <h2 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1 group-hover:text-indigo-600 transition-colors">
                                        {note.title}
                                    </h2>
                                    <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                                    {note.content}
                                </p>

                                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {new Date(note.createdAt).toLocaleDateString()}
                                    </div>

                                    <button
                                        onClick={() => navigate(`/notes/${note.id}`)}
                                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold text-sm group/btn transition-all duration-200"
                                    >
                                        View Details
                                        <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-indigo-200">
                        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-xl font-semibold text-gray-500 mb-2">
                            {searchTerm ? 'No notes found' : 'No notes yet'}
                        </p>
                        <p className="text-gray-400">
                            {searchTerm ? 'Try a different search term' : 'Click "Add Note" to create your first note!'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// === NoteDetailScreen Component ===
const NoteDetailScreen = ({ note, navigate, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);

    if (!note) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
                <div className="text-center bg-white p-12 rounded-3xl shadow-2xl max-w-md">
                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Note Not Found</h1>
                    <p className="text-gray-600 mb-8">The note you're looking for doesn't exist or has been deleted.</p>
                    <button
                        onClick={() => navigate('/notes')}
                        className="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all duration-200 shadow-lg"
                    >
                        ← Back to Notes
                    </button>
                </div>
            </div>
        );
    }

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
            onDelete(note.id);
            navigate('/notes');
        }
    };

    const handleUpdate = (updatedNote) => {
        onEdit(updatedNote);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => setIsEditing(false)}
                        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Cancel Editing
                    </button>
                    <NoteForm
                        noteToEdit={note}
                        onSave={handleUpdate}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            </div>
        );
    }

    const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/notes')}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-all duration-200 group"
                >
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to all notes
                </button>

                {/* Note Content */}
                <div className="bg-white/90 backdrop-blur-lg p-8 lg:p-12 rounded-3xl shadow-2xl border border-indigo-100 space-y-8">
                    {/* Header with Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-indigo-100">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight flex-1">
                            {note.title}
                        </h1>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-3 text-indigo-600 hover:text-white bg-indigo-100 hover:bg-indigo-600 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 group"
                                title="Edit Note"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>

                            <button
                                onClick={handleDelete}
                                className="p-3 text-red-600 hover:text-white bg-red-100 hover:bg-red-600 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 group"
                                title="Delete Note"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-2 text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Created: {formattedDate}</span>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap bg-gradient-to-br from-gray-50 to-indigo-50 p-8 rounded-2xl border border-gray-100">
                            {note.content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// === Main App Component ===
const App = () => {
    const [notes, setNotes] = useState(loadNotesFromStorage);
    const [currentPath, setCurrentPath] = useState('/notes');

    useEffect(() => {
        saveNotesToStorage(notes);
    }, [notes]);

    const navigate = (path) => {
        setCurrentPath(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSaveNote = (newNote) => {
        setNotes(prevNotes => {
            const existingIndex = prevNotes.findIndex(n => n.id === newNote.id);
            if (existingIndex > -1) {
                const updated = [...prevNotes];
                updated[existingIndex] = newNote;
                return updated;
            } else {
                return [newNote, ...prevNotes];
            }
        });
    };

    const handleDeleteNote = (id) => {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    };

    // Route matching
    const match = currentPath.match(/^\/notes\/(.+)$/);
    const noteId = match ? match[1] : null;

    if (noteId) {
        const note = notes.find(n => n.id === noteId);
        return (
            <NoteDetailScreen
                note={note}
                navigate={navigate}
                onDelete={handleDeleteNote}
                onEdit={handleSaveNote}
            />
        );
    }

    return (
        <NoteListScreen
            notes={notes}
            navigate={navigate}
            onSaveNote={handleSaveNote}
        />
    );
};

export default App;
