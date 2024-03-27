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

export const convertTo12Hour = (time) => {
    const [hours, mins] = time.split(':');
    let twelve_hour_hours = hours % 12;
    let am_or_pm = 'PM';
    if (twelve_hour_hours === 0){
        twelve_hour_hours = 12;
    }

    if (parseInt(hours) / 12 < 1){
        am_or_pm = 'AM';
    }

    const twelve_hour_time = twelve_hour_hours + ':' + mins + ' ' + am_or_pm;

    return twelve_hour_time;
}