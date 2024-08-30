import express from 'express';
import fs from 'fs';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();

app.use(express.json());  
app.use(cors());

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Usuario por defecto en XAMPP
    password: '', // Contraseña por defecto en XAMPP (vacía por defecto)
    database: 'tienda' // Base de datos 'tienda'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Rutas para CATEGORÍAS

// Obtener todas las categorías
app.get('/categorias', (req, res) => {
    const query = 'SELECT * FROM categoria';

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching categories');
            return;
        }
        res.status(200).json(results);
    });
});

// Crear una nueva categoría
app.post('/categorias', (req, res) => {
    const { nombre, descripcion } = req.body;

    const query = 'INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)';
    db.query(query, [nombre, descripcion], (err, result) => {
        if (err) {
            res.status(500).send('Error creating category');
            return;
        }
        res.status(201).send('Category created with ID: ' + result.insertId);
    });
});

// Actualizar una categoría existente
app.put('/categorias/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const query = 'UPDATE categoria SET nombre = ?, descripcion = ? WHERE id = ?';
    db.query(query, [nombre, descripcion, id], (err, result) => {
        if (err) {
            res.status(500).send('Error updating category');
            return;
        }
        res.status(200).send('Category updated successfully');
    });
});

// Eliminar una categoría existente
app.delete('/categorias/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM categoria WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting category:', err);
            res.status(500).send('Error deleting category');
        } else {
            res.status(200).send('Category deleted successfully');
        }
    });
});

// Rutas para PRODUCTOS

// Obtener todos los productos
app.get('/productos', (req, res) => {
    const query = 'SELECT * FROM producto';

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching products');
            return;
        }
        res.status(200).json(results);
    });
});

// Crear un nuevo producto
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio, categoria_id } = req.body;

    const query = 'INSERT INTO producto (nombre, descripcion, precio, categoria_id) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, descripcion, precio, categoria_id], (err, result) => {
        if (err) {
            res.status(500).send('Error creating product');
            return;
        }
        res.status(201).send('Product created with ID: ' + result.insertId);
    });
});

// Actualizar un producto existente
app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, categoria_id } = req.body;

    const query = 'UPDATE producto SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ? WHERE id = ?';
    db.query(query, [nombre, descripcion, precio, categoria_id, id], (err, result) => {
        if (err) {
            res.status(500).send('Error updating product');
            return;
        }
        res.status(200).send('Product updated successfully');
    });
});

// Eliminar un producto existente
app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM producto WHERE id = ?';

    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            res.status(500).send('Error deleting product');
        } else {
            res.status(200).send('Product deleted successfully');
        }
    });
});

// Función para leer datos de un archivo JSON
const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};

// Función para escribir datos en un archivo JSON
const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};

// Ruta de la aplicación Express
app.get("/", (req, res) => {
    res.send("Bienvenidos a mi API de productos y categorías");
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});
