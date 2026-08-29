import { json, Router } from 'express'
import { connection } from '../connection.js'

const router = Router()

// 1 Create a product.
router.post('/create-product', (req, res) => {
    const { name, price, stockQuantity, supplierID } = req.body
    connection.execute(`INSERT INTO products (ProductName, Price, StockQuantity, supplierID) VALUES ('${name}','${price}','${stockQuantity}','${supplierID}')`, (err, result) => {
        if (err) {
            res.json({ message: err })
            return
        }
        if (result.affectedRows > 0) {
            res.json({ message: 'create successfully', newProduct: { ProductId: result.insertId, name, price, stockQuantity, supplierID } })
        }
        else {
            res.json({ message: 'Failed to create product' })
        }
    })
})

// 2 Retrieve all products.
router.get('/retrieve-all-products', (req, res) => {
    connection.execute(`SELECT * FROM products`, (err, result) => {
        if (err) console.log(err)
        else {
            res.json({ message: "products", products: result });
        }
    })
})

// 3 Retrieve a product by ID.
router.get('/retrieve-all-products/:id', (req, res) => {
    let { id } = req.params
    connection.execute(`SELECT * FROM products WHERE ProductID  = ${id}`, (err, result) => {
        if (err) console.log(err)
        else {
            res.json({ message: "product", product: result });
        }
    })
})

// 4 Update a product.
router.put('/update-product/:id', (req, res) => {
    const { name, price, stockQuantity, supplierID } = req.body
    let { id } = req.params
    connection.execute(`UPDATE products SET ProductName='${name}',Price='${price}',StockQuantity='${stockQuantity}',SupplierID='${supplierID}' WHERE ProductID='${id}'`, (err, result) => {
        console.log(result)

        if (err) {
            console.log(err)
            return res.json({ message: "Error updating product" })
        }
        if (result.affectedRows > 0) {
            res.json({ message: "update product successfully", product: { id, name, price, stockQuantity, supplierID } })
        } else {
            res.json({ message: "Product not found or update failed" })
        }
    })
})

// 5 Delete a product.
router.delete('/delete-product/:id', (req, res) => {
    let { id } = req.params
    connection.execute(`DELETE FROM products WHERE ProductID = ${id}`, (err, result) => {
        if (err) {
            return res.json({ message: 'Error deleting product' })
        }
        if (result.affectedRows > 0) {
            res.json({ message: "Product deleted successfully" })
        } else {
            res.json({ message: "Product not found or delete failed" })
        }
    })

})



/*=======================================================================================*/
// 5

// 1 Add Category column to Products
router.patch('/add-category', (req, res) => {
    connection.execute(
        `ALTER TABLE Products ADD Category VARCHAR(255)`,
        (err, result) => {
            if (err) {
                return res.json({ message: "Error adding category" });
            }
            res.json({ message: "Category column added successfully" });
        }
    );
});


// 2 Remove Category column
router.patch('/remove-category', (req, res) => {
    connection.execute(
        `ALTER TABLE Products DROP COLUMN Category`,
        (err, result) => {
            if (err) {
                return res.json({ message: "Error removing category" });
            }

            res.json({ message: "Category column removed successfully" });
        }
    );
});


// 4
router.patch('/product-name-not-null', (req, res) => {
    connection.execute(
        `ALTER TABLE Products MODIFY ProductName VARCHAR(255) NOT NULL`,
        (err, result) => {
            if (err) {
                return res.json({ message: "Error adding NOT NULL constraint" });
            }

            res.json({ message: "ProductName is now NOT NULL" });
        }
    );
});




/*=======================================================================================*/
// 6

router.post('/insert-data', (req, res) => {

    // Add Supplier
    connection.execute(
        `INSERT INTO Suppliers (SupplierName, ContactNumber)
        VALUES ('FreshFoods', '01001234567')`,
        (err, supplierResult) => {
            if (err) {
                return res.json({ message: "Error adding supplier" });
            }
            const supplierID = supplierResult.insertId;

            // Add Products
            connection.execute(
                `INSERT INTO Products 
                (ProductName, Price, StockQuantity, SupplierID)
                VALUES
                ('Milk', 15.00, 50, ${supplierID}),
                ('Bread', 10.00, 30, ${supplierID}),
                ('Eggs', 20.00, 40, ${supplierID})`,
                (err, productResult) => {
                    if (err) {
                        return res.json({ message: "Error adding products" });
                    }


                    const milkProductID = productResult.insertId;

                    connection.execute(
                        `INSERT INTO Sales 
                        (ProductID, QuantitySold, SaleDate)
                        VALUES (${milkProductID}, 2, '2025-05-20')`,
                        (err, saleResult) => {
                            if (err) {
                                return res.json({ message: "Error adding sale" });
                            }

                            res.json({
                                message: "Data inserted successfully",
                                supplierID,
                                milkProductID,
                                saleID: saleResult.insertId
                            });
                        }
                    );
                }
            );
        }
    );
});


/*=======================================================================================*/
// 7

router.put('/update-bread-price', (req, res) => {
    connection.execute(
        `UPDATE Products SET Price = 25.00 WHERE ProductName = 'Bread'`,
        (err, result) => {
            if (err) {
                return res.json({ message: "Error updating Bread price" });
            }

            if (result.affectedRows > 0) {
                return res.json({
                    message: "Bread price updated successfully"
                });
            } else {
                return res.json({
                    message: "Bread not found"
                });
            }
        }
    );
});


/*=======================================================================================*/
// 8
router.delete('/delete-eggs', (req, res) => {
    connection.execute(
        `DELETE FROM Products WHERE ProductName = 'Eggs'`,
        (err, result) => {
            if (err) {
                return res.json({ message: "Error deleting Eggs" });
            }

            if (result.affectedRows > 0) {
                return res.json({
                    message: "Eggs deleted successfully"
                });
            } else {
                return res.json({
                    message: "Eggs not found"
                });
            }
        }
    );
});

/*=======================================================================================*/
// 9
router.get('/total-quantity-sold', (req, res) => {
    connection.execute(
        `SELECT Products.ProductName, SUM(Sales.QuantitySold) AS TotalQuantitySold
        FROM Products
        JOIN Sales ON Products.ProductID = Sales.ProductID
        GROUP BY Products.ProductID, Products.ProductName`,
        (err, result) => {
            if (err) {
                console.log(err);
                return res.json({ message: "Error retrieving report" });
            }

            res.json({
                message: "Total quantity sold for each product",
                report: result
            });
        }
    );
});


/*=======================================================================================*/
// 10

router.get('/highest-stock-product', (req, res) => {
    connection.execute(
        `SELECT * FROM Products
        ORDER BY StockQuantity DESC
        LIMIT 1`,
        (err, result) => {
            if (err) {
                console.log(err);
                return res.json({
                    message: "Error retrieving highest stock product"
                });
            }

            if (result.length > 0) {
                return res.json({
                    message: "Product with highest stock quantity",
                    product: result[0]
                });
            }

            return res.json({
                message: "No products found"
            });
        }
    );
});



/*=======================================================================================*/
// 11


router.get('/suppliers-start-with-f', (req, res) => {
    connection.execute(
        `SELECT * FROM Suppliers WHERE SupplierName LIKE 'F%'`,
        (err, result) => {
            if (err) {
                console.log(err);
                return res.json({
                    message: "Error retrieving suppliers"
                });
            }

            if (result.length > 0) {
                return res.json({
                    message: "Suppliers starting with F",
                    suppliers: result
                });
            }

            return res.json({
                message: "No suppliers found"
            });
        }
    );
});



/*=======================================================================================*/
// 12

router.get('/products-never-sold', (req, res) => {
    connection.execute(
        `SELECT Products.*
        FROM Products
        LEFT JOIN Sales ON Products.ProductID = Sales.ProductID
        WHERE Sales.ProductID IS NULL`,
        (err, result) => {
            if (err) {
                console.log(err);
                return res.json({
                    message: "Error retrieving products"
                });
            }

            if (result.length > 0) {
                return res.json({
                    message: "Products that have never been sold",
                    products: result
                });
            }

            return res.json({
                message: "All products have been sold"
            });
        }
    );
});


/*=======================================================================================*/
// 13
router.get('/sales-with-product-details', (req, res) => {
    connection.execute(
        `SELECT 
            Products.ProductName,
            Sales.QuantitySold,
            Sales.SaleDate
        FROM Sales
        JOIN Products ON Sales.ProductID = Products.ProductID`,
        (err, result) => {
            if (err) {
                console.log(err);
                return res.json({
                    message: "Error retrieving sales"
                });
            }

            if (result.length > 0) {
                return res.json({
                    message: "Sales with product details",
                    sales: result
                });
            }

            return res.json({
                message: "No sales found"
            });
        }
    );
});






export default router