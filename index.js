/*
    1. buat API menggunakan express js;
    2. buat object lagu dengan atribut dengan atribut : id, judul_lagu, artis, favorite
    2. Buat endpoint get list data lagu
    3. buat endpoint tambah lagu, tambah lagu favorit.
    4. buat endpoint get list lagu favorit saja.
*/

import mysqlPromise from "mysql2/promise.js";

let poolDb = mysqlPromise.createPool({
    host: "localhost",
    user: "root",
    password: "123",
    database: "user_app"
});

import express from "express";
import { nanoid } from "nanoid";
// import poolDB from "./db";

class lagu {
    constructor(id, judul_lagu, artis, favorite) {
        this.id = id;
        this.judul_lagu = judul_lagu;
        this.artis = artis;
        this.favorite = favorite;
    } 
}

class Task {
    constructor (id, name, completed) {
        this.id = id, 
        this.name = name
        this.completed = completed || false
    }
}

let tasks = [];

const app = express();
const port = 8080;
const host = "localhost";

app.use(express.json());

app.get("/tasks", (req, res) => {
    res.json(tasks);
});


app.get("/tasks/:id", (req, res) => {
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({message:"data not found!!"})

    res.json(task);
})

app.post('/tasks', (req, res) => {
    const task = new Task(nanoid(6), req.body.name, req.body.completed);
    
    tasks.push(task);
    res.json(task)
});

app.put('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === req.params.id)
    if (!task) return res.status(404).json({message:"data not found!!"})
    
    task.name = req.body.name;
    task.completed = req.body.completed;
    res.json(task);
});

app.delete('/tasks/:id',(req, res) => {
    const index = tasks.findIndex(t=> t.id === req.params.id);
    if(!task) return res.status(404).json({message:"data not found!"})

    const task = tasks.splice(index, 1);
    res.json(task);
});

app.listen(port,host,()=>{
    console.log(`server berjalan di http://${host}:${port}`);
});

const tambahLagu = async (judul_lagu, artis) => {
    const created_at = new Date();
    
    const sql = 'insert into Lagu (judul, artis, created_at) values (?, ?, ?)';
    const value = [judul_lagu, artis, created_at];

    const [result, field] = await poolDb.query(sql, value);

    console.log(`data lagu berhasil ditambahkan dengan id ${result.insertId}`);

}

const hapusLagu = async (id) => {
    const sql = 'delete from Lagu where id = ?';
    const value = [id];
    const [result, field] = await poolDb.query(sql, value);

    console.log(`Data lagu berhasil dihapus dengan id: ${result.insertId}`);
}

const listLagu = async () => {
    const sql = 'select * from Lagu'

    const [result, field] = await poolDb.query(sql);
    console.log(result);
}

const updateLagu = async (id, judul_lagu) => {
    const sql = 'update Lagu set judul = ? where id = ?';
    const value = [judul_lagu, id];

    const [result, field] = await poolDb.query(sql, value);

    console.log(`Data berhasil diupdate : ${result}`);
}

//tambahLagu('Long hope philia', 'masaki suda');
// hapusLagu(1);
updateLagu('2', 'machigaisagashi');
listLagu();