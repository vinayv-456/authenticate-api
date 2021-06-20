const express = require('express')
const app = express();
var cors = require('cors')
const { pool } = require('./connection');

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors())

const port = 8000;

app.post('/sign-up', async(req, res) => {
    let client = await pool.connect();
    try {
        await client.query('BEGIN');
        const {email, name, password} = req.body;
        const time = new Date();
        const joined_on = time.toISOString();
        let auth_insert = `INSERT INTO authenticate(email, password) VALUES ('${email}', MD5('${password}'))`
        await client.query(auth_insert); 
        let user_insert = `INSERT INTO users(name, email, joined_on) VALUES ('${name}', '${email}', '${joined_on}') RETURNING *`
        const user_record = await client.query(user_insert); 
        await client.query('COMMIT');
        res.status(201).send(user_record.rows[0]);
    } catch(e) {
        throw("unable to insert data", e);
    }
    finally{
        client.release();
    }
})

app.post('/sign-in', async(req, res) => {
    let client = await pool.connect();
    try
    {
        const {email, password} = req.body;
        const user_query = ` SELECT * FROM authenticate WHERE email='${email}' AND password=MD5('${password}')`;
        const result = await client.query(user_query);
        if(result.rowCount!=0)
        {
            const user_data_query = `SELECT * FROM users WHERE email='${email}'`;
            const user_data = await client.query(user_data_query);
            res.status(200).send(user_data.rows[0]);
        }
        else{
            res.status(200).send()
        }
    } catch(e) {
        throw("error while fetching data", e);
    }
    finally{
        client.release();
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});