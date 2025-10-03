
import React, { useState } from 'react';
import { Person, Group } from '../types';
import Modal from './Modal';
import { GroupIcon, PlusCircleIcon, TrashIcon } from './icons';

interface GroupManagerProps {
    people: Person[];
    groups: Group[];
    onAddGroup: (group: Omit<Group, 'id'>) => void;
    onRemoveGroup: (id: string) => void;
}

const GroupManager: React.FC<GroupManagerProps> = ({ people, groups, onAddGroup, onRemoveGroup }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupCost, setGroupCost] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const handleSaveGroup = () => {
        if (groupName.trim() && parseFloat(groupCost) > 0 && selectedMembers.length > 0) {
            onAddGroup({
                name: groupName.trim(),
                totalCost: parseFloat(groupCost),
                members: selectedMembers
            });
            resetForm();
            setIsModalOpen(false);
        }
    };
    
    const resetForm = () => {
        setGroupName('');
        setGroupCost('');
        setSelectedMembers([]);
    };
    
    const handleMemberToggle = (personId: string) => {
        setSelectedMembers(prev => 
            prev.includes(personId) ? prev.filter(id => id !== personId) : [...prev, personId]
        );
    };

    const getPersonName = (id: string) => people.find(p => p.id === id)?.name || 'Desconocido';

    return (
        <div className="bg-slate-800/50 rounded-lg shadow-lg p-6 border border-slate-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2"><GroupIcon /> Grupos</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-md transition-colors flex items-center gap-2 disabled:bg-slate-500 disabled:cursor-not-allowed"
                    disabled={people.length === 0}
                >
                    <PlusCircleIcon /> <span className="hidden sm:inline">Crear Grupo</span>
                </button>
            </div>
             {people.length === 0 && <p className="text-slate-400 text-sm text-center py-2">Añade invitados para poder crear grupos.</p>}
            
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                 {groups.length === 0 && <p className="text-slate-400 text-center py-4">Aún no hay grupos de consumo.</p>}
                {groups.map(group => (
                    <div key={group.id} className="bg-slate-700/50 p-3 rounded-md">
                        <div className="flex justify-between items-start">
                           <div>
                                <h3 className="font-semibold text-teal-400">{group.name}</h3>
                                <p className="text-xl font-bold text-white">${group.totalCost.toFixed(2)}</p>
                           </div>
                            <button onClick={() => onRemoveGroup(group.id)} className="text-red-500 hover:text-red-400 transition-colors p-1 rounded-full -mt-1 -mr-1">
                                <TrashIcon />
                            </button>
                        </div>
                        <div className="mt-2">
                            <p className="text-sm text-slate-400">Integrantes ({group.members.length}):</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {group.members.map(memberId => (
                                    <span key={memberId} className="bg-slate-600 text-xs text-slate-200 px-2 py-1 rounded-full">
                                        {getPersonName(memberId)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => { resetForm(); setIsModalOpen(false); }}>
                <h3 className="text-xl font-bold mb-4 text-white">Crear Nuevo Grupo</h3>
                <div className="space-y-4">
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Ej: Grupo Pizza 1"
                        className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                        type="number"
                        value={groupCost}
                        onChange={(e) => setGroupCost(e.target.value)}
                        placeholder="Costo total del grupo"
                        className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <div>
                        <h4 className="font-semibold mb-2 text-slate-300">Seleccionar Integrantes</h4>
                        <div className="max-h-48 overflow-y-auto space-y-2 pr-2 border border-slate-600 rounded-md p-2">
                        {people.map(person => (
                            <label key={person.id} className="flex items-center gap-3 bg-slate-700/50 p-2 rounded-md cursor-pointer hover:bg-slate-600/50">
                                <input
                                    type="checkbox"
                                    checked={selectedMembers.includes(person.id)}
                                    onChange={() => handleMemberToggle(person.id)}
                                    className="h-5 w-5 rounded bg-slate-800 border-slate-500 text-teal-500 focus:ring-teal-500"
                                />
                                <span className="text-slate-300">{person.name}</span>
                            </label>
                        ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => { resetForm(); setIsModalOpen(false); }} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-md text-white transition-colors">Cancelar</button>
                        <button onClick={handleSaveGroup} className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-md text-white transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed" disabled={!groupName.trim() || !groupCost || selectedMembers.length === 0}>Guardar</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default GroupManager;
