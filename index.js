const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5001;
// middle ware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pii6nyx.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const newCarCollection = client.db('carDb').collection('Car')
        const addInCart = client.db('carDb').collection('product')
        app.get('/car', async (req, res) => {
            const cursor = newCarCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/cardetails/:name', async (req, res) => {
            const brandName = req.params.name;
            const filter = { brand: brandName };
            const result = await newCarCollection.find(filter).toArray();
            res.send(result);
        });

        app.get('/car/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await newCarCollection.findOne(filter);
            res.send(result);
        });

        app.get('/brandcar/:brand', async (req, res) => {
            const brand = req.params.brand;
            const filter = { brand: brand };
            const result = await newCarCollection.find(filter).toArray();
            res.send(result);
        });
        app.post('/addProducts', async (req, res) => {
            const addProduct = req.body;
            // console.log(addProduct);
            const result = await addInCart.insertOne(addProduct)
            res.send(result);
        });
        app.get('/addProducts', async (req, res) => {
            const cursor = addInCart.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/getAddProducts', async (req, res) => {
            const query = {};
            const result = await addInCart.find(query).toArray();
            res.send(result);
        })


        app.put('/car/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedCar = req.body;
            const car = {
                $set: {
                    name: updatedCar.name,
                    difficulty: updatedCar.difficulty,
                    marks: updatedCar.marks,
                    description: updatedCar.description,
                    url: updatedCar.url,
                }
            };
            const result = await newCarCollection.updateOne(filter, car);
            res.send(result);
        });
        app.delete('/car/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await newCarCollection.deleteOne(filter)
            res.send(result)
        })

        // Rest of your code remains the same
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Server is running')
})
app.listen(port, () => {
    console.log(`server is runninggg: ${port}`);
})

module.exports = app;

