
import React, { useState } from 'react';
import { Person } from '../types';
import { UserPlusIcon, TrashIcon, UsersIcon } from './icons';

interface AttendeeManagerProps {
    people: Person[];
    onAddPerson: (name: string) => void;
    onRemovePerson: (id: string) => void;
}

const AttendeeManager: React.FC<AttendeeManagerProps> = ({ people, onAddPerson, onRemovePerson }) => {
    const [newName, setNewName] = useState('');

    const handleAddPerson = (e: React.FormEvent) => {
        e.preventDefault();
        onAddPerson(newName);
        setNewName('');
    };

    return (
        <div className="bg-slate-800/50 rounded-lg shadow-lg p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2"><UsersIcon /> Invitados</h2>
            <form onSubmit={handleAddPerson} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nombre del invitado"
                    className="flex-grow bg-slate-700 text-white placeholder-slate-400 rounded-md px-3 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center gap-2 disabled:bg-slate-500 disabled:cursor-not-allowed"
                    disabled={!newName.trim()}
                >
                    <UserPlusIcon /> <span className="hidden sm:inline">Añadir</span>
                </button>
            </form>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {people.length === 0 && <p className="text-slate-400 text-center py-4">Aún no hay invitados.</p>}
                {people.map(person => (
                    <div key={person.id} className="flex justify-between items-center bg-slate-700/50 p-2 rounded-md">
                        <span className="text-slate-300">{person.name}</span>
                        <button
                            onClick={() => onRemovePerson(person.id)}
                            className="text-red-500 hover:text-red-400 transition-colors p-1 rounded-full"
                            aria-label={`Eliminar a ${person.name}`}
                        >
                           <TrashIcon />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AttendeeManager;
