var mongoose = require("mongoose");
var Int32 = require('mongoose-int32');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var InvoiceArSchema = new Schema({
  // `title` is required and of type String
  Id: {
    type: Int32,
    required: true
  },
  // `link` is required and of type String
  DocumentTypes: {
    type: Int32,
    enum: [0,1],
    required: false
  },
  DocId: {
    type: Int32,
    required: false
  },
  PartyCode: {
    type: String,
    required: false
  },
  SourceBalance: {
    type: Number,
    required: false
  },
  FunctionalBalance: {
    type: Number,
    required: false
  },
  SourceCurrency: {
    type: String,
    required: false
  },
  FunctionalCurrency: {
    type: String,
    required: false
  },
  BranchCode: {
    type: String,
    required: false
  },
  ActivityDate: {
    type: Date,
    required: false
  }
});

// This creates our model from the above schema, using mongoose's model method
var InvoiceAr = mongoose.model("InvoiceAr", InvoiceArSchema);

// Export the Article model
module.exports = InvoiceAr;
