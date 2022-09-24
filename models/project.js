import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    orgaization:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'  
    },
    issues:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue'  
    }]
})

/*eslint-disable*/
organizationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
      delete returnedObject.passwordHash;
    },
  });
  /* eslint-enable */

  export default mongoose.model('Project', projectSchema);