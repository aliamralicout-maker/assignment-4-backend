import express from 'express'
import productRouter from '../src/Products/product.controller.js'
import supplierRouter from '../src/supplier/supplier.controller.js'
import salesRouter from '../src/Sales/sales.controller.js'



const app = express();

app.use(express.json())

app.use('/product', productRouter)
app.use('/supplier', supplierRouter)
app.use('/sales', salesRouter)





// server
app.get('/', (req, res) => {
    res.json("server rining")
})
// -------------------------------------------------------- //
app.listen(3000, (req, res) => {
    console.log({ message: 'server success' });
})