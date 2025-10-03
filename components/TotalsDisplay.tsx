
import React, { useState, useMemo, useCallback } from 'react';
import { Person, Group, IndividualItem } from '../types';
import { MoneyIcon, ShareIcon, PlusIcon, TrashIcon } from './icons';
import Modal from './Modal';

interface TotalsDisplayProps {
    people: Person[];
    groups: Group[];
    individualItems: IndividualItem[];
    onAddIndividualItem: (item: Omit<IndividualItem, 'id'>) => void;
    onRemoveIndividualItem: (id: string) => void;
    grandTotal: number;
}

interface PersonTotals {
    [personId: string]: {
        total: number;
        groupShare: number;
        individualTotal: number;
        items: IndividualItem[];
        groups: { name: string; share: number }[];
    }
}

const IndividualItemForm: React.FC<{ personId: string; onAdd: (item: Omit<IndividualItem, 'id'>) => void; onCancel: () => void }> = ({ personId, onAdd, onCancel }) => {
    const [itemName, setItemName] = useState('');
    const [cost, setCost] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(itemName.trim() && parseFloat(cost) > 0) {
            onAdd({ personId, itemName: itemName.trim(), cost: parseFloat(cost) });
            onCancel();
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 p-2 bg-slate-700/50 rounded-md mt-2">
            <input type="text" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="Item" className="w-1/2 bg-slate-800 text-sm p-1 rounded border border-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500" />
            <input type="number" value={cost} onChange={e => setCost(e.target.value)} placeholder="Costo" className="w-1/4 bg-slate-800 text-sm p-1 rounded border border-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500" />
            <button type="submit" className="text-teal-400 hover:text-teal-300 p-1 text-xs">Guardar</button>
            <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-300 p-1 text-xs">X</button>
        </form>
    );
};


const TotalsDisplay: React.FC<TotalsDisplayProps> = ({ people, groups, individualItems, onAddIndividualItem, onRemoveIndividualItem, grandTotal }) => {
    const [addingItemId, setAddingItemId] = useState<string | null>(null);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

    const personTotals = useMemo<PersonTotals>(() => {
        const totals: PersonTotals = {};

        people.forEach(person => {
            totals[person.id] = { total: 0, groupShare: 0, individualTotal: 0, items: [], groups: [] };
        });

        individualItems.forEach(item => {
            if (totals[item.personId]) {
                totals[item.personId].individualTotal += item.cost;
                totals[item.personId].items.push(item);
            }
        });

        groups.forEach(group => {
            if (group.members.length > 0) {
                const share = group.totalCost / group.members.length;
                group.members.forEach(memberId => {
                    if (totals[memberId]) {
                        totals[memberId].groupShare += share;
                        totals[memberId].groups.push({ name: group.name, share });
                    }
                });
            }
        });

        Object.keys(totals).forEach(personId => {
            totals[personId].total = totals[personId].groupShare + totals[personId].individualTotal;
        });

        return totals;
    }, [people, groups, individualItems]);

    const generateSummaryText = useCallback(() => {
        let summary = `*Resumen de Gastos del Cumpleaños* 🎂\n\n`;
        summary += `*TOTAL GENERAL: $${grandTotal.toFixed(2)}*\n`;
        summary += `----------------------------------\n\n`;

        if (groups.length > 0) {
            summary += `*CONSUMOS GRUPALES*\n`;
            groups.forEach(group => {
                const share = group.members.length > 0 ? group.totalCost / group.members.length : 0;
                summary += `*- ${group.name} ($${group.totalCost.toFixed(2)})*\n`;
                summary += `  Cada uno: $${share.toFixed(2)}\n`;
            });
            summary += `\n`;
        }

        summary += `*TOTAL A PAGAR POR PERSONA*\n`;
        people.forEach(person => {
            const totals = personTotals[person.id];
            if (totals) {
                summary += `*${person.name}: $${totals.total.toFixed(2)}*\n`;
                if(totals.groups.length > 0) {
                    summary += `  Grupos: $${totals.groupShare.toFixed(2)}\n`;
                }
                if(totals.items.length > 0) {
                    summary += `  Individual: $${totals.individualTotal.toFixed(2)}\n`;
                    totals.items.forEach(item => {
                        summary += `    - ${item.itemName}: $${item.cost.toFixed(2)}\n`;
                    });
                }
            }
        });
        
        return summary;
    }, [people, personTotals, groups, grandTotal]);
    
    const summaryText = generateSummaryText();
    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(summaryText)}`;

    return (
        <div className="bg-slate-800/50 rounded-lg shadow-lg p-6 border border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2"><MoneyIcon/> Resumen y Totales</h2>
                <div className="text-center sm:text-right">
                    <p className="text-slate-400">Total de la Mesa</p>
                    <p className="text-3xl font-bold text-green-400">${grandTotal.toFixed(2)}</p>
                </div>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {people.length === 0 && <p className="text-slate-400 text-center py-8">Añade invitados para ver los totales.</p>}
                {people.map(person => {
                    const totals = personTotals[person.id] || { total: 0, items: [], groups: [] };
                    return (
                        <div key={person.id} className="bg-slate-700/50 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-white">{person.name}</h3>
                                <div className="text-lg font-bold text-teal-400">${totals.total.toFixed(2)}</div>
                            </div>
                            <div className="text-sm text-slate-400 mt-2 space-y-1">
                                {totals.groups.map((g, i) => <p key={i}>› {g.name}: ${g.share.toFixed(2)}</p>)}
                                {totals.items.map(item => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <p>› {item.itemName}: ${item.cost.toFixed(2)}</p>
                                        <button onClick={() => onRemoveIndividualItem(item.id)} className="text-red-600 hover:text-red-500 p-1 text-xs"><TrashIcon /></button>
                                    </div>
                                ))}
                            </div>
                            {addingItemId === person.id ? (
                                <IndividualItemForm personId={person.id} onAdd={onAddIndividualItem} onCancel={() => setAddingItemId(null)} />
                            ) : (
                                <button onClick={() => setAddingItemId(person.id)} className="mt-2 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                    <PlusIcon /> Añadir item individual
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {people.length > 0 && (
                 <div className="mt-6 text-center">
                    <button onClick={() => setIsSummaryModalOpen(true)} className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <ShareIcon/> Generar Resumen y Compartir
                    </button>
                </div>
            )}
            
            <Modal isOpen={isSummaryModalOpen} onClose={() => setIsSummaryModalOpen(false)}>
                <h3 className="text-xl font-bold mb-4 text-white">Resumen para Compartir</h3>
                <pre className="bg-slate-900/70 p-4 rounded-md text-slate-300 text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">{summaryText}</pre>
                 <div className="mt-6 flex justify-end">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
                       Compartir en WhatsApp
                    </a>
                </div>
            </Modal>
        </div>
    );
};

export default TotalsDisplay;
