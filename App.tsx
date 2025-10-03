import React, { useState, useCallback, useMemo } from 'react';
import { Person, Group, IndividualItem } from './types';
import AttendeeManager from './components/AttendeeManager';
import GroupManager from './components/GroupManager';
import TotalsDisplay from './components/TotalsDisplay';
import { PartyIcon } from './components/icons';

const App: React.FC = () => {
    const [people, setPeople] = useState<Person[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [individualItems, setIndividualItems] = useState<IndividualItem[]>([]);

    const addPerson = useCallback((name: string) => {
        if (name.trim() === '') return;
        const newPerson: Person = { id: Date.now().toString(), name: name.trim() };
        setPeople(prev => [...prev, newPerson]);
    }, []);

    const removePerson = useCallback((id: string) => {
        setPeople(prev => prev.filter(p => p.id !== id));
        // Also remove from groups and individual items
        setGroups(prev => prev.map(g => ({ ...g, members: g.members.filter(mId => mId !== id) })));
        setIndividualItems(prev => prev.filter(item => item.personId !== id));
    }, []);

    const addGroup = useCallback((group: Omit<Group, 'id'>) => {
        const newGroup: Group = { ...group, id: Date.now().toString() };
        setGroups(prev => [...prev, newGroup]);
    }, []);

    const removeGroup = useCallback((id: string) => {
        setGroups(prev => prev.filter(g => g.id !== id));
    }, []);

    const addIndividualItem = useCallback((item: Omit<IndividualItem, 'id'>) => {
        const newItem: IndividualItem = { ...item, id: Date.now().toString() };
        setIndividualItems(prev => [...prev, newItem]);
    }, []);

    const removeIndividualItem = useCallback((id: string) => {
        setIndividualItems(prev => prev.filter(item => item.id !== id));
    }, []);

    const grandTotal = useMemo(() => {
        const groupsTotal = groups.reduce((acc, group) => acc + group.totalCost, 0);
        const individualsTotal = individualItems.reduce((acc, item) => acc + item.cost, 0);
        return groupsTotal + individualsTotal;
    }, [groups, individualItems]);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white flex items-center justify-center gap-3">
                        <PartyIcon />
                        Gian divisor cumpleañitos
                    </h1>
                    <p className="text-slate-400 mt-2">Gestiona los consumos de tu fiesta de forma fácil y rápida.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <AttendeeManager people={people} onAddPerson={addPerson} onRemovePerson={removePerson} />
                        <GroupManager people={people} groups={groups} onAddGroup={addGroup} onRemoveGroup={removeGroup} />
                    </div>
                    <div className="lg:col-span-2">
                        <TotalsDisplay
                            people={people}
                            groups={groups}
                            individualItems={individualItems}
                            onAddIndividualItem={addIndividualItem}
                            onRemoveIndividualItem={removeIndividualItem}
                            grandTotal={grandTotal}
                        />
                    </div>
                </div>
                 <footer className="text-center mt-12 text-slate-500 text-sm">
                    <p>Creado para una noche de bar inolvidable.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;