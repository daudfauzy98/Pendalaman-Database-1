import mongoose from 'mongoose'

export type CustomerType = {
   first_name: string
   last_name: string
   age: number
   customer_type: string
   street: string
   city: string
   state: string
   zip_code: string
   phone_number: string
}

// Deklarasi CustomerDoument bertipe Mongoose.Document dan CustomerType
// untuk digunakan sebagai model dari kelas Customer
export type CustomerDocument = mongoose.Document & CustomerType
type Keyword = {
   $first_name: {
      $regex: string
      $option: string
   }
} | {}

/*type State = {
   $state: {
      $regex: string,
      $option: string
   }
}*/

const CustomerSchema = new mongoose.Schema({
   first_name: { type: String, required: true },
   last_name: { type: String, required: true },
   age: { type: Number, required: true },
   customer_type: { type: String, required: true },
   street: { type: String, required: true },
   city: { type: String, required: true },
   state: { type: String, required: true },
   zip_code: { type: String, required: true },
   phone_number: { type: String, required: true }
}, {
   timestamps: true
})

export class Customer {
   // Agar variabel model tidak bisa diakses oleh kelas lain atau
   // agar tidak terjadi redudansi variabel jika ada kelas yang menggunakan nama yang sama
   private model: mongoose.Model<CustomerDocument>

   constructor() {
      this.model = mongoose.model('customer', CustomerSchema)
   }

   async create(data: CustomerType) {
      let result: CustomerType
      try {
         result = await this.model.create(data)
         console.log(result)
      } catch (error) {
         throw error
      }
      return result
   }

   async createMany(data: CustomerType[]) {
      let result: CustomerType[]
      try {
         result = await this.model.insertMany(data)
         console.log(result)
      } catch (error) {
         throw error
      }
      return result
   }

   async getAll(limit: number) {
      let result :CustomerType[]
      try {
         result = await this.model.aggregate([
            {
               "$addFields": {
                  "full_name": { "$concat": ["$first_name", " ", "$last_name"]}
               }
            }
         ]).limit(limit).exec()
      } catch (error) {
         throw error
      }
      return result
   }

   async getByName(name: Keyword) {
      let result :CustomerType[]
      try {
         result = await this.model.find({ ...name })
      } catch (error) {
         throw error
      }
      return result
   }

   async getByType(type: string) {
      let result :CustomerType[]
      try {
         result = await this.model.aggregate([
            {
               $match: {
                  customer_type: {
                     $eq: type
                  }
               }
            }
         ]).exec()
      } catch (error) {
         throw error
      }
      return result
   }

   async getByState(state: string) {
      let result: CustomerType[]
      try {
         result = await this.model.aggregate([
            {
               $match: {
                  state: {
                     $regex: state,
                     $options: 'i'
                  }
               }
            }
         ]).exec()
      } catch (error) {
         throw error
      }
      return result
   }
   // Ambil age dimana age collection < age input
   async getByAge(age: number) {
      let result: CustomerType[]
      try {
         result = await this.model.aggregate([
            {
               $match: {
                  age: { $lt: age }
               }
            }
         ]).exec()
      } catch (error) {
         throw error
      }
      return result
   }

   async deleteMany() {
      try {
         await this.model.deleteMany({})
      } catch (error) {
         throw error
      }
   }
}