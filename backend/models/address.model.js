import mongoose from "mongoose"

const addressSchema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    dullName:String,
    phone:String,
    addressLine:String,
    city:String,
    state:String,
    pincode:String,

},{
    timeseries:true
})
export default mongoose.model('Address',addressSchema)