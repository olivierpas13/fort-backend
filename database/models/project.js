import mongoose from "mongoose";
import { issueSchema } from "./issue.js";

const simpleUser = new mongoose.Schema({
    name: {
        type: String
    },
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    role: {
      type: String,
      enum: ['administrator', 'project-manager', 'developer', 'submitter'],
    },
})

export const projectSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    organization:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'  
    },
    issues:[{
        type: issueSchema,
    }],
    users: [{
      type: simpleUser,  
    }],
    logo: { 
      type: String,
    },
})

/*eslint-disable*/
projectSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  });
  /* eslint-enable */

  export default mongoose.model('Project', projectSchema);
