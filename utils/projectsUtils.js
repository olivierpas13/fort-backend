import countGroupBy from "./countGroupBy.js"

export const organizeProjectIssues = (issues) =>{
    
    const priority = (countGroupBy(issues, 'priority'));
    
    const status = (countGroupBy(issues, 'ticketStatus'));
    
    return{
        highPriorityIssues : priority?.high ? priority.high : 0,
        mediumPriorityIssues : priority?.medium ? priority.medium : 0 ,
        lowPriorityIssues : priority?.low? priority.low : 0 ,
        openIssues : status?.open ? status.open : 0 ,
        closedIssues : status?.closed ? status.closed : 0,
    }
}