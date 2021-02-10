const mongoose = require('mongoose');
const PasswordManager = require('../services/password-manager');

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

// access the middleware, this will run before mongoose
// executs a save() on a schema object
// must use 'function' keyword or the context is lost to the document
// and will look at this files context instead of db's document
userSchema.pre('save', async function (done) {
  // only attempt to hash password if password has been modified
  if (this.isModified('password')) {
    const hashed = await PasswordManager.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

// custom function to create a mongoose user object with type checking
userSchema.statics.build = (attrs) => {
  return new User(attrs);
};

const User = mongoose.model('User', userSchema);

export { User };
