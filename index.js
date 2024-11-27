import mysql from 'mysql';
import express from 'express';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const puerto = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'phpmyadmin'
});

app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
});

app.get('/crear-tabla', (req, res) => {
    const createTableQuery =
    `CREATE TABLE Productos (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Precio DECIMAL(10,2) NOT NULL,
    Descripción TEXT
    )`;

    connection.query(createTableQuery, (err, results) => {
        if (err) {
            console.error('Error al crear la tabla', err);
            res.status(500).send('Error al crear la tabla');
        } else {
            console.log('Tabla creada exitosamente');
            res.send('Tabla creada exitosamente');
        }
    });
});

app.post('/agregar-producto', (req, res) => {
    const { Nombre, Precio, Descripción } = req.body;
    const insertQuery = 
    'INSERT INTO Productos (Nombre, Precio, Descripción) VALUES (?, ?, ?)';

    connection.query(insertQuery, [Nombre, Precio, Descripción], (err, results) => {
        if (err) {
            console.error('Error al agregar producto:', err);
            res.status(500).send('Error al agregar el producto');
        } else {
            console.log('Producto agregado exitosamente');
            res.send('Producto agregado exitosamente');
        }
    });
});

app.get('/productos', (req, res) => {
    const selectQuery = 'SELECT * FROM Productos';

    connection.query(selectQuery, (err, results) => {
        if (err) {
            console.error('Error al seleccionar productos', err);
            res.status(500).send('Error al seleccionar productos');
        } else {
            console.log('Productos seleccionados exitosamente');
            res.json(results);
        }
    });
});

app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Productos WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el producto:', err);
            res.status(500).json({ error: 'Error al eliminar el producto' });
        } else {
            if (result.affectedRows > 0) {
                res.json({ message: 'Producto eliminado correctamente' });
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        }
    });
});

app.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}`);
});

export default app;