export function formatedD(date_or_str){
    if (!date_or_str)
        return null;
    if (date_or_str.toLocaleDateString)
        return date_or_str.toLocaleDateString('en-CA')
    return date_or_str
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