import mongoose from "mongoose";
import { projectSchema } from "./project.js";
import { userSchema } from "./user.js";

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    users:[
        {
            type: userSchema
        }
    ],
    projects: [
        {
            type: projectSchema
        }
    ],
    orgInvitationCode: {
        type: String
    }
})

/*eslint-disable*/
organizationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  });
  /* eslint-enable */

  export default mongoose.model('Organization', organizationSchema);