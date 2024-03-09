export const toTitleCase = (string) => {
    return string
    .split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// pass javascript date object
export const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${year}-${month}-${day}`;
}