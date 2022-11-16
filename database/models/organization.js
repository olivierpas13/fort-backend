import mongoose from "mongoose";
import { projectSchema } from "./project.js";

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    projects: [
        {
            type: projectSchema
        }
    ],
    orgInvitationCode: {
        type: String,
        required: true,
        unique: true,
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