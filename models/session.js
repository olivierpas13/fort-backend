import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  sessionToken: {
    type: String,
  },
  userId:{
    type: String
  },
  expires: {
    type: String,
  },
});

/*eslint-disable*/
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
/* eslint-enable */

export default mongoose.model('Session', sessionSchema);