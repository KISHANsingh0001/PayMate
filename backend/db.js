require('dotenv').config();
const mongoose = require('mongoose');
const { string } = require('zod');
const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.k0ymi.mongodb.net/PayTem-DB`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true, //  removes any leading/trailing whitespace.
        lowercase: true, // converts the value to lowercase before storing.
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});



const accountSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: 'User',
    required: true
  },
  balance: {
      type: Number,
      required: true
  }
})

const transactionSchema = mongoose.Schema({
  from:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'userData',
    required: true
  },
  to:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'userData',
    required:true
  },
  amount:{
    type:Number,
    required:true
  },
  timestamp:{
    type:Date , 
    default:Date.now
  }
})

const Transaction = mongoose.model('Transaction',transactionSchema)
const Account = mongoose.model('Account',accountSchema);
const userData = mongoose.model('userData', userSchema);

module.exports = {
  userData,
  Account,
  Transaction,
};
