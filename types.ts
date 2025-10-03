
export interface Person {
    id: string;
    name: string;
}

export interface Group {
    id: string;
    name: string;
    totalCost: number;
    members: string[]; // Array of Person ids
}

export interface IndividualItem {
    id: string;
    personId: string;
    itemName: string;
    cost: number;
}
