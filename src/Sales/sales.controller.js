import { Router } from "express";
import { connection } from "../connection.js";

const router = Router()



// 1 create-sale
router.post('/create-sale', (req, res) => {
    const { productID, quantitySold, saleDate } = req.body;

    connection.execute(
        `INSERT INTO sales (ProductID, QuantitySold, SaleDate)
        VALUES ('${productID}', '${quantitySold}', '${saleDate}')`,
        (err, result) => {
            if (err) {
                return res.json({ message: "Error creating sale" });
            }

            if (result.affectedRows > 0) {
                res.json({
                    message: "Sale recorded successfully",
                    newSale: {
                        SaleID: result.insertId,
                        productID,
                        quantitySold,
                        saleDate
                    }
                });
            } else {
                res.json({ message: "Failed to record sale" });
            }
        }
    );
});

// 2 retrieve all sales
router.get('/retrieve-all-sales', (req, res) => {
    connection.execute(`SELECT * FROM sales`, (err, result) => {
        if (err) {
            return res.json({ message: "Error retrieving sales" });
        }

        res.json({
            message: "Sales",
            sales: result
        });
    });
});

// 3 retrieve sales by id
router.get('/retrieve-sales/:id', (req, res) => {
    const { id } = req.params;

    connection.execute(
        `SELECT * FROM sales WHERE ProductID = '${id}'`,
        (err, result) => {
            if (err) {
                return res.json({ message: "Error retrieving sales" });
            }

            if (result.length > 0) {
                res.json({
                    message: "Product sales",
                    sales: result
                });
            } else {
                return res.json({
                    message: "No sales found for this product"
                });
            }
        });
});


export default router