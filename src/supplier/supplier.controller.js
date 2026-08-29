import Router from 'express'
import { connection } from '../connection.js'

const router = Router()


// 1create supplier
router.post('/create-supplier', (req, res) => {
    const { supplierName, contactNumber } = req.body;

    connection.execute(
        `INSERT INTO suppliers (SupplierName, ContactNumber)
        VALUES ('${supplierName}', '${contactNumber}')`,
        (err, result) => {
            if (err) {
                return res.json({ message: "Error creating supplier" });
            }

            if (result.affectedRows > 0) {
                res.json({
                    message: "Supplier created successfully",
                    newSupplier: {
                        SupplierID: result.insertId,
                        supplierName,
                        contactNumber
                    }
                });
            } else {
                res.json({ message: "Failed to create supplier" });
            }
        }
    );
});

// 2 retrieve all suppliers
router.get('/retrieve-all-suppliers', (req, res) => {
    connection.execute(`SELECT * FROM suppliers`, (err, result) => {
        if (err) {
            return res.json({ message: "Error retrieving suppliers" });
        }

        res.json({
            message: "Suppliers",
            suppliers: result
        });
    });
});

// 3 update supplier
router.put('/update-supplier/:id', (req, res) => {
    const { supplierName, contactNumber } = req.body;
    const { id } = req.params;

    connection.execute(
        `UPDATE suppliers
        SET SupplierName='${supplierName}',
            ContactNumber='${contactNumber}'
        WHERE SupplierID='${id}'`,
        (err, result) => {
            if (err) {
                return res.json({ message: "Error updating supplier" });
            }

            if (result.affectedRows > 0) {
                res.json({
                    message: "Supplier updated successfully",
                    supplier: {
                        id,
                        supplierName,
                        contactNumber
                    }
                });
            } else {
                res.json({
                    message: "Supplier not found or update failed"
                });
            }
        }
    );
});

// 4 delete supplier
router.delete('/delete-supplier/:id', (req, res) => {
    const { id } = req.params;

    connection.execute(
        `DELETE FROM suppliers WHERE SupplierID = ${id}`,
        (err, result) => {
            if (err) {
                return res.json({ message: "Error deleting supplier" });
            }

            if (result.affectedRows > 0) {
                res.json({
                    message: "Supplier deleted successfully"
                });
            } else {
                res.json({
                    message: "Supplier not found or delete failed"
                });
            }
        }
    );
});



/*=======================================================================================*/
// 5

// 3
router.patch('/change-contact-number', (req, res) => {
    connection.execute(
        `ALTER TABLE Suppliers MODIFY ContactNumber VARCHAR(15)`,
        (err, result) => {
            if (err) {
                return res.json({ message: "Error changing ContactNumber" });
            }

            res.json({ message: "ContactNumber changed to VARCHAR(15) successfully" });
        }
    );
});



export default router

