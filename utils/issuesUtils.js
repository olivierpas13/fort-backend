import generateError from "./customError.js";

export const checkIfValidIssueInput = ({title, priority, assignedDev, organization, submitter, project, projectTitle}) =>{
    if(!title || !priority || !assignedDev || !organization || !submitter || !project || !projectTitle){
        throw generateError('Required fields missing.', 400)
    }
}