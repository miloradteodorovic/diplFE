import { format, getTime } from 'date-fns';

export function parsePerformanceTime(time: Date) {
    return format(time, 'dd.MM.yyyy HH')
}

export function dateToMilliseconds(date: Date) {
    return getTime(date);
}

export function removeArrayItem(array: Array<any>, item: any) {
    const index: number = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
    }    
    return array;    
}