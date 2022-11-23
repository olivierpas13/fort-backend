import User from "../models/user.js";

class userRepository{
    
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

    async createUser({name, email, role, passwordHash, organizationName, project}){
    
        try {
            
            const user = new User({
                name,
                email,
                role,
                passwordHash,
                organization: organizationName,
                project: project.length === 0? null: project
              });
        
              return await user.save();

        } catch (error) {
            return(error);
        }

    }

    async createAdmin({name, email, passwordHash, organization}){
        try {
            const user = new User({
                name,
                email,
                passwordHash,
                role: "administrator",
                organization: organization
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
