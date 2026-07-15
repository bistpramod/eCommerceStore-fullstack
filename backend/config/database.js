import mongoose from "mongoose";


 const connectDB = async () =>{
    try{
       await mongoose.connect(process.env.MONGO_URI)
       console.log("mongoDB connected successfully ")
    }
    catch(error){
     throw error;   //! Better than console.log() because console.log() only displays the error, while throw propagates it.
    }
}
export default connectDB