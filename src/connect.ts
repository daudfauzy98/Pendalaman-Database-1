import mongoose from 'mongoose'

const connectDB = async () => {
   try {
      const connDB = await mongoose.connect(`${process.env.MONGODB_URI}`, {
         useCreateIndex: true,
         useNewUrlParser: true,
         useUnifiedTopology: true
      })

      console.log(`MongoDB Connected to: ${connDB.connection.host}`)

   } catch (error) {
      console.error(`Error: ${ error.message}`)
      process.exit(1)
   }
}

export default connectDB