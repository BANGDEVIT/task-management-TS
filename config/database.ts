import mongoose  from "mongoose";

export const connect = async() : Promise<void> =>{
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected Successfully');
  } catch (error) {
    console.log('Connected error');
  }  // End of try-catch block.
 // End of connect function.  // End of module.exports.connect function.  // End of script.  // End of script.  // End of script.  // End of script.  // End of script.  // End of script.  // End of script.  // End of script.  // End of script.  // End of script.  // End of script.  // End of script.  // End of script.  // End of script.  // End of script.  // End of script.  // End of script.  // End of script.  // End of script.
}

