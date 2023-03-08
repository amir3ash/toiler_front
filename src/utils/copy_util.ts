export function deepCopy<T>(obj: T): T{
    try {
        return structuredClone(obj)
    } catch (error) {
        return JSON.parse(JSON.stringify(obj))
    }
}