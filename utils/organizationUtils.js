import Organization from "../database/models/organization.js"

export const checkIfNameIsAvailable = async (name) =>{
    return await Organization.findOne({name})
  }