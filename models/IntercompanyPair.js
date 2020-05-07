var mongoose = require("mongoose");
var Int32 = require('mongoose-int32');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
// This is similar to a Sequelize model
var IntercompanyPairSchema = new Schema({
  // _id: {
  //   type: String,
  //   required: false
  // },
  IntercompanyGuid: {
    type: String,
    required: false,
    unique: true
  },
  InvoiceDocId: {
    type: Int32,
    required: false
  },
  VoucherDocId: {
    type: Int32,
    required: false
  },
  InvoiceNumber: {
    type: Int32,
    required: false
  },
  VoucherNumber: {
    type: Int32,
    required: false
  },
  AssociatedInvoiceNumber: {
    type: Int32,
    required: false
  },
  AssociatedVoucherNumber: {
    type: Int32,
    required: false
  },
  // `InvoiceArs` is an object that stores a InvoiceAr _id
  // The ref property links the ObjectId to the InvoiceArs model
  // This allows us to populate the IntercompanyPair with an associated InvoiceArs
  InvoiceAr: [
    {
      type: Schema.Types.ObjectId,
      ref: "InvoiceAr"
    }
  ],
  FunctionalInvoiceBalance: {
    type: Number,
    required: false,
    get: function (FunctionalInvoiceBalance) {
      var result;
      if (this.VoucherNumber != null) {
        result = this.VoucherNumber * Math.PI;
      }
      return result;
    }
  }

});

// This creates our model from the above schema, using mongoose's model method
var IntercompanyPair = mongoose.model("IntercompanyPair", IntercompanyPairSchema);

// Export the IntercompanyPair model
module.exports = IntercompanyPair;
