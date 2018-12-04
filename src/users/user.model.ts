/**
 * User dependencies.
 */
import * as mongoose from 'mongoose';
import * as log4js from 'log4js';
import * as bcrypt from 'bcrypt';
import { validateCPF } from '../../helpers/validators.helper';
import config from '../../config/config';
import { Schema } from 'mongoose';
const log = log4js.getLogger('user-model');

/**
 * User Schema
 */

export interface Address extends mongoose.Document {
  type: string;
  zip_code: string;
  address: string;
  address_2: string;
  number: string;
  city: string;
  province: string;
  country: string;
  country_code: string;
  neighborhood: string;
}

export interface User extends mongoose.Document {
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  roles: string;
  birth_date: Date;
  gender: string;
  image: string;
  cpf: string;
  document: string;
  location: {
    lat_lng: [number];
    reference: string;
  };
  timezone: string;
  preferred_language: string;
  preferred_currency: string;
  moip: {
    customer_id: string;
    merchant_id: string;
    original_costumer: object;
    original_merchant: object;
  };
  stripe: object;
  paypal: object;
  address: [Address];
  providers: {
    sample: {
      has: boolean;
      locate: string;
      password: string;
      resetPasswordToken: string;
      resetPasswordExpires: Date;
    };
    facebook: object;
    google: object;
    github: object;
    linkedin: object;
  };
  active: boolean;
  verified: boolean;
  verified_token: string;
  verified_token_expires: Date;
  created: Date;
}

export interface UserModel extends mongoose.Model<User> {
  getById(id: mongoose.Types.ObjectId): Promise<User>;
  getByEmail(email: string): Promise<User>;
  getByUsername(username: string): Promise<User>;
  findUniqueUsername(username: string, suffix: any): Promise<any>;
}

const AddressSubSchema = new Schema({
  type: {
    type: String,
    enum: ['commercial', 'residential'],
    required: false,
    default: ['residential'],
  },
  zip_code: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  address_2: {
    type: String,
    required: false,
  },
  number: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  province: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  country_code: {
    type: String,
    required: false,
  },
  neighborhood: {
    type: String,
    required: false,
  },
});

const UserSchema = new Schema({
  displayName: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
  },
  firstName: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: true,
  },
  roles: {
    type: String,
    enum: ['user', 'admin'],
    default: ['user'],
    required: true,
  },
  birth_date: {
    type: Date,
    required: false,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', null],
    required: false,
    default: () => {
      return null;
    },
  },
  image: {
    type: String,
    required: false,
  },
  cpf: {
    type: String,
    required: false,
    validate: {
      validator: validateCPF,
      message: '{PATH}: Invalid CPF ({VALUE})',
    },
  },
  document: {
    type: String,
    required: false,
  },
  location: {
    lat_lng: [Number],
    reference: {
      type: String,
      required: false,
    },
  },
  timezone: {
    type: String,
    required: false,
  },
  preferred_language: {
    type: String,
    enum: ['en', 'es', 'pt'],
    default: ['pt'],
    required: true,
  },
  preferred_currency: {
    type: String,
    enum: ['eur', 'usd', 'brl', 'gbl'],
    default: ['brl'],
    required: true,
  },
  moip: {
    customer_id: {
      type: String,
      required: false,
    },
    merchant_id: {
      type: String,
      required: false,
    },
    original_costumer: {},
    original_merchant: {},
  },
  stripe: {},
  paypal: {},
  address: {
    type: [AddressSubSchema],
    select: false,
    required: false,
    default: [],
  },
  providers: {
    sample: {
      has: {
        type: Boolean,
        default: false,
        required: true,
      },
      locate: {
        type: String,
      },
      password: {
        type: String,
        select: false,
        required: false,
      },
      resetPasswordToken: {
        type: String,
        select: false,
        required: false,
      },
      resetPasswordExpires: {
        type: Date,
        select: false,
        required: false,
      },
    },
    facebook: {},
    google: {},
    github: {},
    linkedin: {},
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
    required: true,
  },
  verified_token: {
    type: String,
    select: false,
    required: false,
  },
  verified_token_expires: {
    type: Date,
    select: false,
    required: false,
  },
  created: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

/**
 * Pre
 */

const hashPassword = (obj, next) => {
  bcrypt
    .hash(obj.providers.sample.password, config.security.saltRounds)
    .then((hash) => {
      obj.providers.sample.password = hash;
      next();
    })
    .catch(next);
};

const saveMiddleware = (next) => {
  const user: any = this;

  if (!user.isModified('providers.sample.password')) {
    return next();
  } else {
    hashPassword(user, next);
  }
};

const updateMiddleware = (next) => {
  if (!this.getUpdate().providers.sample.password) {
    return next();
  } else {
    hashPassword(this.getUpdate(), next);
  }
};

UserSchema.pre('save', saveMiddleware);

UserSchema.pre('findOneAndUpdate', updateMiddleware);

UserSchema.pre('update', updateMiddleware);

/**
 * CRUD
 */

UserSchema.post('save', function(doc) {
  log.debug('%s has been saved', JSON.stringify(doc));
});

UserSchema.post('update', function(doc) {
  log.debug('%s has been updated', JSON.stringify(doc));
});

UserSchema.post('remove', function(doc) {
  log.debug('%s has been removed', JSON.stringify(doc));
});

/**
 * Statics
 */

UserSchema.statics.getById = function(id: mongoose.Types.ObjectId) {
  log.trace('Enter in Get By Id');

  return this.findById(id);
};

UserSchema.statics.getByUsername = function(username: string) {
  log.trace('Enter in Get By Username');

  return this.findOne({ username: username });
};

UserSchema.statics.getByEmail = function(email: string) {
  log.trace('Enter in Find User By Email');

  return this.findOne({ email: email });
};

UserSchema.statics.findUniqueUsername = function(
  username: string,
  suffix: any
) {
  log.trace('Enter in Find Unique Username');
  const _this = this;
  let possibleUsername = username + (suffix || '');

  return new Promise((resolve, reject) => {
    _this.findOne(
      {
        username: possibleUsername,
      },
      function(err, user) {
        if (!err) {
          if (!user) {
            resolve(possibleUsername);
          } else {
            return _this.findUniqueUsername(username, (suffix || 0) + 1);
          }
        } else {
          resolve(null);
        }
      }
    );
  });
};

export const User = mongoose.model<User, UserModel>('User', UserSchema);
