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