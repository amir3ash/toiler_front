import type { GetProjectQuery } from "../gql/graphql"
import { showAlert } from "./errors"

type ProjectType = GetProjectQuery['project']
type TaskType = ProjectType['tasks'][0]
type ActivityType = TaskType['activities'][0]
type State = ProjectType['states'][0]

 /**
     * @returns date in milliseconds or `null`.
     * 
     * if `date` is `"now"` then returns now in milliseconds.
     * if `date` is `null`, returns `null`.
     * if date2 is not null, returns min of them
     */
export function strDateToOption(date?: string | "now", date2?: string){
    if (date === null)
        return null

    let res: number = null;
    if (date !== 'now')
        res =  new Date(date).getTime()
    else
        res = new Date().getTime()
    
    if (date2){
        let d2 = new Date(date2).getTime()
        res = d2 >= res ? res : d2;
    }
    
    return res
}

export function isDatesValidOrShowError(obj: TaskType|ActivityType): boolean {
    let errors: string[] = []

    const o = Object.entries(obj)
    .map(([field, value]) => { // convert string dates to Date
        if (field.endsWith("Date")){
            return {[field]: strDateToOption(value)}
        }
    })
    .reduce((a, b) => ({...a, ...b}))
    
    if (!o.plannedStartDate)
        errors.push('please plan a start date');
    
    if (!o.plannedEndDate)
        errors.push('Please plan a end date');

    const now = strDateToOption('now')

    if (o.plannedStartDate > o.plannedEndDate)
        errors.push('Planned start date should be before Planned end date.')
    
    if (o.actualStartDate && o.actualEndDate && o.actualStartDate > o.actualEndDate)
        errors.push('Actual start date should be before Actual end date.')
    
    if (o.actualStartDate && (o.actualStartDate > now))
        errors.push('Actual start date should be before now.')
    
    if (o.actualEndDate){
        if (o.actualEndDate > now)
            errors.push('Actual start date should be before now.')
        
        if (!o.actualStartDate)
            errors.push('If you specified ActualEndDate, you should specify ActualStartDate.')
    }

    errors.map(error => showAlert(error))

    return errors.length == 0
}