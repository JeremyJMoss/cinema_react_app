export const BASE_URL = 'http://localhost:8080'

export const ROLES = [
    {
        text: 'User',
        value: 'user'
    },
    {
        text: 'Admin',
        value: 'admin'
    }
]

export const RATINGS = [
    {
        text: 'G',
        value: 'G'
    },
    {
        text: 'PG',
        value: 'PG'
    },
    {
        text: 'M15+',
        value: 'M'
    },
    {
        text: 'MA15+',
        value: 'MA15+'
    },
    {
        text: 'R18+',
        value: 'R18+'
    }
]

export const THEATRE_TYPES = [
    {
        text: 'Gold Class',
        value: 'Gold Class'
    },
    {
        text: 'Standard',
        value: 'Standard'
    },
    {
        text: 'V-Max',
        value: 'V-Max'
    },
    {
        text: 'Drive-In',
        value: 'Drive-In'
    }
]

export const TICKET_TYPES = [
    {
        label: 'Adult',
        price: {
            "Standard": 25.50,
            "Gold Class": 46,
            "V-Max": 32,
            "Drive-In": 35
        }    
    },
    {
        label:'Child',
        price: {
            "Standard": 19.50,
            "Gold Class": 46,
            "V-Max": 24,
            "Drive-In": 35
        }
    },
    {
        label: 'Pensioner',
        price: {
            "Standard": 21.50,
            "Gold Class": 46,
            "V-Max": 27,
            "Drive-In": 35
        }
    },
    {
        label: 'Senior',
        price: {
            "Standard": 18.50,
            "Gold Class": 46,
            "V-Max": 24,
            "Drive-In": 35
        }
    },
    {
        label: 'Student',
        price: {
            "Standard": 21.50,
            "Gold Class": 46,
            "V-Max": 27,
            "Drive-In": 35
        }
    }
]

export const TIMES = Array.from({length: 48}).map((_, index) => {
    const hour = String((Math.floor(index / 2))).padStart(2, '0');
    const minutes = index % 2 === 0 ? '00' : '30';
    const time = `${hour}:${minutes}`;
    return {
        text: time,
        value: time,
        disabled: false
    }
})