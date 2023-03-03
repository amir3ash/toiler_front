export function formatedD(date_or_str: string | number | Date){
    if (!date_or_str)
        return null; 

    const date = new Date(date_or_str)

    return date.toLocaleDateString('en-CA')
}

/**
 * formats to YYYY-MM-DD
 * @param object 
 * @returns 
 */
export function formatShortDate(object): string{
    if (!object)
        return null;

    if (object.length == 0)
        return null

    if (object.length > 0)
        object = object[0]

    if (object.toISOString)
        return object.toISOString().split('T')[0]

    return object
}

// date or string or list
export function formatedDateTime(object){
    if (!object)
        return null;

    if (object.length == 0)
        return null

    if (object.length > 0)
        object = object[0]
    
    if (object.toISOString)
        return object.toISOString()

    return object
}