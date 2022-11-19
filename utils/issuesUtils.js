import generateError from "./customError.js";

export const checkIfValidIssueInput = ({title, priority, assignedDev, organization, submitter, project}) =>{
    if(!title || !priority || !assignedDev || !organization || !submitter || !project){
        throw generateError('Required fields missing.', 400)
    }
}