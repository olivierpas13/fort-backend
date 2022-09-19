import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    users:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
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

  export default mongoose.model('Organization', organizationSchema);