export function formatedD(date_or_str){
    if (!date_or_str)
        return null; 

    const date = new Date(date_or_str)

    return date.toLocaleDateString('en-CA')
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