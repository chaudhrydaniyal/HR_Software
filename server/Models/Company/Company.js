const mongooes = require("mongoose");
const CompanySchema = new mongooes.Schema({

    title: {
        type: String,
        required: true
    },
    employees: [{
        type: mongooes.Schema.Types.ObjectId,
        ref: 'employees'
    }],
    departments: {
        type: [mongooes.Schema.Types.ObjectId],
        ref: 'departments'
    },
    status: {
        type: Boolean,
        default: true,
    },
    NTN_number: {
    type: String,
   },
    description : {
    type: String
   },
   address: {
    type: String
   }
}, { timestamps: true })


const Company = mongooes.model("Company", CompanySchema)
module.exports = Company;