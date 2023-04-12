import generateError from "./customError.js";

export const checkIfValidIssueInput = (issue) =>{

    const requiredProps = ['title', 'priority', 'assignedDev', 'organization', 'submitter', 'project', 'projectTitle', 'description'];
    const missingProps = [];
  
    requiredProps.forEach(prop => {
      if (!issue.hasOwnProperty(prop)) {
        missingProps.push(prop);
      }
    });
  
    if (missingProps.length > 0) {
      
        throw generateError(`Required fields missing ${missingProps.join(', ')}`);
    }
    return;
}