import dotenv from 'dotenv'
dotenv.config()

import { Customer } from './mongoose'

import customers from './data/customers'
import connectDB from './connect'

connectDB()

const customersModel = new Customer()

const importData = async () => {
   try {
      await customersModel.deleteMany()
      await customersModel.createMany(customers)

      console.log('Data successful imported!')
      process.exit()

   } catch (error) {
      console.error(`Terjadi error: ${error}`)
      process.exit(1)
   }
}

const destroyData = async () => {
   try {
      await customersModel.deleteMany()

      console.log('Data successful destroyed!')
      process.exit()

   } catch (error) {
      console.error(`Terjadi error: ${error}`)
      process.exit(1)
   }
}

// Eksekusi method importData() dan destroyData() dengan membaca argumen
// dari key build.import dan build.destroy pada package.json
if(process.argv[2] === '-d') {
   // Jika argumen ke-3 (index ke-2) === -d
   destroyData()
} else {
   importData()
}