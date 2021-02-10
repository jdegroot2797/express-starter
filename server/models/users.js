const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      // doc is the mongodb document, ret is what will be returned
      // since mongo will try to use toJSON we can edit ret
      // i prefer just having id field and removing the other unecessary fields
      // such as exposing the password
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

//TODO: add password hashing middleware to mongo save

// custom function to create a mongoose user object with type checking
userSchema.statics.build = (attrs) => {
  return new User(attrs);
};

const User = mongoose.model('User', userSchema);

export { User };
