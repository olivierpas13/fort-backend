import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description:{
        type: String
    },
    priority:{
        type: String,
        enum: ['low', 'medium', 'high']
    },
    assignedDev:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    submitter:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'    
    },
    ticketStatus:{
        type: String,
        enum: ['open', 'close']
    },
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'    
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

  export default mongoose.model('Issue', issueSchema);