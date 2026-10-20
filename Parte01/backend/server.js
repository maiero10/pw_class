import express, { json } from 'express'; 
import { createPool } from 'mysql2/promise'; 
import cors from 'cors'; 
const app = express(); 
 
app.use(cors()); 
app.use(json()); 
 
const dbConfig = { 
    host: 'localhost', 
    user: 'root', 
    password: '', 
    database: 'crud_funcionarios' 
}; 
 
const db = createPool(dbConfig); 
 
// GET /api/funcionarios 
app.get('/api/funcionarios', async (req, res) => { 
    try { 
        const [rows] = await db.execute('SELECT * FROM funcionarios ORDER BY id DESC'); 
        res.json(rows); 
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    } 
}); 
 
// POST /api/funcionarios 
app.post('/api/funcionarios', async (req, res) => { 
    try { 
        const { nome, funcao, salario } = req.body; 
        if (!nome || !funcao || !salario) { 
            return res.status(400).json({ error: 'Campos obrigatórios' 
}); 
        } 
        const [result] = await db.execute( 
            'INSERT INTO funcionarios (nome, funcao, salario) VALUES (?, ?, ?)', 
            [nome, funcao, parseFloat(salario)] 
        ); 
        res.json({ success: true, id: result.insertId }); 
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    } 
}); 
 
// PUT /api/funcionarios/:id 
app.put('/api/funcionarios/:id', async (req, res) => { 
    try { 
        const { nome, funcao, salario } = req.body; 
        const id = req.params.id; 
        await db.execute( 
            'UPDATE funcionarios SET nome = ?, funcao = ?, salario = ? WHERE id = ?', 
            [nome, funcao, parseFloat(salario), id] 
        ); 
        res.json({ success: true }); 
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    } 
}); 
 
// DELETE /api/funcionarios/:id 
app.delete('/api/funcionarios/:id', async (req, res) => { 
    try { 
        const id = req.params.id; 
        await db.execute('DELETE FROM funcionarios WHERE id = ?', 
[id]); 
        res.json({ success: true }); 
    } catch (error) { 
        res.status(500).json({ error: error.message }); 
    } 
}); 
 
const PORT = 3000; 
app.listen(PORT, () => { 
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`); 
    console.log('Endpoints: /api/funcionarios (GET/POST/PUT/:id/DELETE/:id)'); 
}); 