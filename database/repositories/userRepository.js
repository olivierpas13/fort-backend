import User from "../models/user.js";
import projectsRepository from "./projectsRepository.js";


class userRepository{
    
    constructor(){
        this.projectsRepo = new projectsRepository();
    }

    async fetchUserById(id){
        try {
            return await User.findById(id);
        } catch (error) {
            console.error(error);
        }
    }

    async fetchUserByEmail(email){
        try {
            return await User.findOne({email});
        } catch (error) {
            console.error(error);
        }
    }

    async fetchAllUsersFromOrg(organization){
        try {
            return await User.find({organization: organization});
        } catch (error) {
            console.error(error);            
        }
    }

    async createUser({name, email, role, passwordHash, organizationName, organizationId, project}){
    
        try {
            const user = new User({
                name,
                email,
                role,
                passwordHash,
                organization: organizationName,
                organizationId,
                project,
              });
        
              const savedUser = await user.save();
              await this.projectsRepo.addUserToProject({
                id: project,
                user: {
                    name,
                    id: savedUser._id,
                    role,
                }
              })


              return savedUser;

        } catch (error) {
            return(error);
        }

    }

    async createAdmin({name, email, passwordHash, organization, organizationId}){
        try {
            const user = new User({
                name,
                email,
                passwordHash,
                role: "administrator",
                organization: organization,
                organizationId,
              });
    
            const savedUser = await user.save();
            
            return savedUser;
        } catch (error) {
            console.error(error);            
        }

    }

    async updateUserOrg({id, organization}){
        return await User.findByIdAndUpdate(id, {organization: organization}, {new: true})
    }

    async getUsersCountFromProject(project){
        return await User.countDocuments({project})
    }

}

export default userRepository;
