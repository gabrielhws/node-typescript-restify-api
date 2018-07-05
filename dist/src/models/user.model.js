"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * User dependencies.
 */
const mongoose = require("mongoose");
const log4js = require("log4js");
const bcrypt = require("bcrypt");
const validators_helper_1 = require("../helpers/validators.helper");
const all_1 = require("../../config/env/all");
const Schema = mongoose.Schema;
const log = log4js.getLogger("user-model");
const UserSchema = new Schema({
  displayName: {
    type: String,
    trim: true,
    required: true,
    minlength: 3
  },
  firstName: {
    type: String,
    trim: true,
    required: true,
    minlength: 3
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
    minlength: 3
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    lowercase: true,
    required: true
  },
  roles: {
    type: String,
    enum: ["user", "admin"],
    default: ["user"],
    required: true
  },
  birth_date: {
    type: Date,
    required: false
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: false
  },
  image: {
    type: String,
    required: false
  },
  cpf: {
    type: String,
    required: false,
    validate: {
      validator: validators_helper_1.validateCPF,
      message: "{PATH}: Invalid CPF ({VALUE})"
    }
  },
  document: {
    type: String,
    required: false
  },
  location: {
    lat_lng: [Number],
    reference: {
      type: String,
      required: false
    }
  },
  timezone: {
    type: String,
    required: false
  },
  preferred_language: {
    type: String,
    enum: ["en", "es", "pt"],
    default: ["pt"],
    required: true
  },
  preferred_currency: {
    type: String,
    enum: ["eur", "usd", "brl", "gbl"],
    default: ["brl"],
    required: true
  },
  moip: {
    customer_id: {
      type: String,
      required: false
    },
    merchant_id: {
      type: String,
      required: false
    },
    original_costumer: {},
    original_merchant: {}
  },
  stripe: {},
  paypal: {},
  address: {
    zip_code: {
      type: String,
      required: false
    },
    address: {
      type: String,
      required: false
    },
    address_2: {
      type: String,
      required: false
    },
    number: {
      type: String,
      required: false
    },
    city: {
      type: String,
      required: false
    },
    province: {
      type: String,
      required: false
    },
    country: {
      type: String,
      required: false
    },
    country_code: {
      type: String,
      required: false
    },
    neighborhood: {
      type: String,
      required: false
    }
  },
  providers: {
    sample: {
      has: {
        type: Boolean,
        default: false,
        required: true
      },
      locate: {
        type: String
      },
      password: {
        type: String,
        select: false,
        required: false
      },
      resetPasswordToken: {
        type: String,
        select: false,
        required: false
      },
      resetPasswordExpires: {
        type: Date,
        select: false,
        required: false
      }
    },
    facebook: {},
    google: {},
    github: {},
    linkedin: {}
  },
  active: {
    type: Boolean,
    default: true,
    required: true
  },
  verified: {
    type: Boolean,
    default: false,
    required: true
  },
  verified_token: {
    type: String,
    select: false,
    required: false
  },
  verified_token_expires: {
    type: Date,
    select: false,
    required: false
  },
  created: {
    type: Date,
    default: Date.now,
    required: true
  }
});
/**
 * Pre
 */
const hashPassword = (obj, next) => {
  bcrypt
    .hash(obj.providers.sample.password, all_1.config.security.saltRounds)
    .then(hash => {
      obj.providers.sample.password = hash;
      next();
    })
    .catch(next);
};
const saveMiddleware = next => {
  const user = this;
  if (!user.isModified("providers.sample.password")) {
    return next();
  } else {
    hashPassword(user, next);
  }
};
const updateMiddleware = next => {
  if (!this.getUpdate().providers.sample.password) {
    return next();
  } else {
    hashPassword(this.getUpdate(), next);
  }
};
UserSchema.pre("save", saveMiddleware);
UserSchema.pre("findOneAndUpdate", updateMiddleware);
UserSchema.pre("update", updateMiddleware);
/**
 * CRUD
 */
UserSchema.post("save", function(doc) {
  log.debug("%s has been saved", JSON.stringify(doc));
});
UserSchema.post("update", function(doc) {
  log.debug("%s has been updated", JSON.stringify(doc));
});
UserSchema.post("remove", function(doc) {
  log.debug("%s has been removed", JSON.stringify(doc));
});
/**
 * Statics
 */
UserSchema.statics.getAll = function(cb) {
  log.trace("Enter in Get All");
  return this.find().exec(cb);
};
UserSchema.statics.getById = function(id, cb) {
  log.trace("Enter in Get By Id");
  return this.findById(id).exec(cb);
};
UserSchema.statics.getByUsername = function(username, cb) {
  log.trace("Enter in Get By Username");
  return this.findOne({ username: username }).exec(cb);
};
UserSchema.statics.getByEmail = function(email, cb) {
  log.trace("Enter in Find User By Email");
  return this.findOne({ email: email }).exec(cb);
};
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
  log.trace("Enter in Find Unique Username");
  const _this = this;
  let possibleUsername = username + (suffix || "");
  _this.findOne(
    {
      username: possibleUsername
    },
    function(err, user) {
      if (!err) {
        if (!user) {
          callback(possibleUsername);
        } else {
          return _this.findUniqueUsername(
            username,
            (suffix || 0) + 1,
            callback
          );
        }
      } else {
        callback(null);
      }
    }
  );
};
exports.User = mongoose.model("User", UserSchema);
