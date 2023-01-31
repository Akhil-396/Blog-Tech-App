const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const dbConnect = async ()=>{
    try {
       await mongoose.connect('mongodb://localhost:27017/full-stack-blog',
       {
         useNewUrlParser: true,

         useUnifiedTopology: true
       }

     );
     console.log("DB connected Succesfully");
    } catch (error) {
        console.log("DB Failed",error.message);
    }
}
dbConnect();

