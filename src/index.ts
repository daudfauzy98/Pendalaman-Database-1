import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import connectDB from './connect'
import { Customer, CustomerType } from './mongoose'

const app = express()
connectDB()

const customerModel = new Customer()

// Middleware
app.use(express.json())
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
   // Handler ketika terjadi error di endpoint, diterima oleh parameter err bertipe Error
   res.status(500).json({ success: false, message: err.message })
})

app.get('/', async (req, res, next) => {
   res.json({ message: "Success!" })
})

// Route POST /customers
app.post('/customers', async (req, res, next) => {
   let customers: CustomerType | CustomerType[]
   try {
      if(req.body instanceof Array) {
         customers = await customerModel.createMany(req.body)
      } else {
         customers = await customerModel.create(req.body)
      }
   } catch (error) {
      return next(error) // Mengirim error ke middlerware error
   }
   res.json(customers)
})

// Route GET /customers?limit=angka
app.get('/customers', async (req, res, next) => {
   const limit = Number(req.query.limit) || 10
   let customers: CustomerType | CustomerType[]

   try {
      customers = await customerModel.getAll(limit)
   } catch (error) {
      return next(error)
   }
   res.json(customers)
})

// Route GET /customer/search?name= -> menampilkan data sesuai value query name
// Route GET /customer/search -> menampilkan semua data (tanpa filter)
// Tipe params Query Params untuk request pencarian
app.get('/customers/search', async (req, res, next) => {
   let customers: CustomerType | CustomerType[]

   const name = req.query.name ? { // Jika Params query name terisi
      first_name: { // Cari nama dengan basis atribut first_name
         $regex: req.query.name as string,
         $options: 'i' // Tidak memperdulikan besar kecil huruf
      }
   } : {} // Jika Params query name tidak terisi

   try {
      customers = await customerModel.getByName(name)
   } catch (error) {
      return next(error)
   }
   res.json(customers)
})

//@router GET /customers/type/:type
// Menampilkan data sesuai value params Path dari type
// Tipe params Path Variable untuk request perujukan
app.get('/customers/type/:type', async (req, res, next) => {
   let customers: CustomerType[]
   const type = req.params.type as string // Ambil Params "type" di header

   try {
      customers = await customerModel.getByType(type)
   } catch (error) {
      return next(error)
   }
   res.json(customers)
})

//@router GET /customers/state/:state
// Menampilkan data sesuai value params Path dari state
// Tipe params Path Variable untuk request perujukan
app.get('/customers/state/:state', async (req, res, next) => {
   let customers: CustomerType[]
   const state = req.params.state as string

   try {
      customers = await customerModel.getByState(state)
   } catch (error) {
      return next(error)
   }
   res.json(customers)
})

//@router GET /customers/age/:age
// Menampilkan data value params Path dari age $lessthan
// Tipe params Path Variable untuk request perujukan
app.get('/customers/age/:age', async (req, res, next) => {
   let customers: CustomerType[]
   const age = parseInt(req.params.age)

   try {
      customers = await customerModel.getByAge(age)
   } catch (error) {
      return next(error)
   }
   res.json(customers)
})

app.listen(3000, () => { console.log('App listen on port 3000') })