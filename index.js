const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const db = require('./connection')
const response = require('./response')

//routes url utama kita method get
app.use(bodyParser.json())

app.get('/', (req, res) => {
  response(200, "API Ready", "SUCCESS", res)
})

app.get('/mahasiswa', (req, res) => {
  const sql = "SELECT * FROM mahasiswa"
  db.query(sql, (err, fields) =>{
    if(err) throw err
    response(200, fields, "mahasiswa get list", res)
  })
})

app.get('/mahasiswa/:nim', (req, res) => {
  const nim = req.params.nim
  const sql = `SELECT * FROM mahasiswa WHERE nim = ${nim}`
  db.query(sql, (err, fields) => {
    if(err) throw err
    response(200, fields, "detail mahasiswa", res)
  })
 })

app.post('/mahasiswa', (req, res) => {
  const {nim, nama, kelas, alamat} = req.body
  const sql = `INSERT INTO mahasiswa (nim, nama, kelas, alamat) VALUES (${nim}, '${nama}', '${kelas}', '${alamat}')`
  db.query(sql, (err, fields) => {
    if(err) response(500, "invalid", "error", res)
    if(fields?.affectedRows){
      const data = {
        isSuccess: fields.affectedRows,
        id: fields.insertId,
      }
      response(200, data, "posting", res)
    }
  })
  
})

app.put('/mahasiswa', (req, res) => {
  const { nim, nama, kelas, alamat } = req.body
  const sql = `UPDATE mahasiswa SET nama = '${nama}', kelas = '${kelas}', alamat = '${alamat}' WHERE nim = ${nim}`
  db.query(sql, (err, fields) => {
    if(err) response(500, "invalid", "error", res)
    if(fields?.affectedRows){
      const data = {
        isSuccess: fields.affectedRows,
        message: fields.message,
      }
      response(200, data, "update success", res)
    }else{
      response(404, "data not found", "error", res)
    }
  })
})

app.delete('/mahasiswa', (req, res) => {
  const { nim } = req.body
  const sql = `DELETE FROM mahasiswa WHERE nim = ${nim}`
  db.query(sql,(err, fields) => {
    if(err) response(404, "invalid", "error", res)
    if(fields?.affectedRows){
      const data = {
          isDelected: fields.affectedRows,
      }
      response(200, data, "deleted data", res)
    }else{
      response(404, "data not found", "error", res)
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})