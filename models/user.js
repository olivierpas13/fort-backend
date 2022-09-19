import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // unique: 'Username and password required',
  },
  email:{
    type: String
  },
  passwordHash: {
    type: String,
    // unique: 'Username and password required',
  },
//   blogs: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Blog',
//     },
//   ],
});

/*eslint-disable*/
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});
/* eslint-enable */

export default mongoose.model('User', userSchema);