/**
 * Created by raj on 7/14/2017.
 */
const express = require('express')
const _ = require('lodash')
const {
    ObjectId
} = require('mongodb')
let {
    mongoose
} = require('./db/mongoose')
let {
    Channel
} = require('./models/Channel')
let {
    User
} = require('./models/users')
const {
    SHA256
} = require('crypto-js')
const initDb = require('./mongoConnect').initDb;

const cors = require('cors');
const csv = require('csvtojson');

const bodyParser = require('body-parser')
let app = express()

app.use(bodyParser.json())
const corsOptions = {
    exposedHeaders: 'Authorization',
};
app.use(cors(corsOptions));




// let authenticate = (req, res, next) => {

//     let jwttoken = req.headers['authorization'];

//     let jwtTokenArray = jwttoken.split(' ')
//     let token = jwtTokenArray[1]

//     if (!jwttoken || !token) {
//         next()
//     } else {
//         console.log(`here`)
//         User.findByToken(token).then((user) => {
//             console.log(user)
//             if (!user) {
//                 next()
//             } else
//                 req.user = user;
//             next();
//         }).catch((e) => {
//             res.status(401).send();
//         })
//     }

// }

const port = process.env.PORT || 3090;

// app.post('/todos', (req, res) => {
//     let todo = new Todo({
//         text: req.body["text"]
//     })
//     todo.save().then((docs) => {
//         res.status(200).json({
//             "inserted": docs
//         })
//     }).
//     catch((e) => res.status(400).json({
//         "msg": "bad request"
//     }))
// })


// app.get('/todos/', (req, res) => {
//     Todo.find().then((docs) => {
//         res.status(200).json({
//             docs: docs
//         })
//     }).
//     catch((e) => res.status(400).json({
//         "err": e
//     }))
// })
// app.get('/todos/:id', (req, res) => {
//     let id = req.params["id"];
//     console.log(id)
//     Todo.findById(req.params.id).then((docs) => {
//         res.status(200).json({
//             docs: docs
//         })
//     }).
//     catch((e) => res.status(400).json({
//         "err": e
//     }))
// })


// app.post('/signup', (req, res) => {
//     let body = _.pick(req.body, ['email', 'password'])
//     User.findUserByEmail(body.email).then(
//         res1 => {
//             if (res1) {

//                 res.status(200).json({
//                     'err': 'Already present'
//                 })
//             } else {

//                 let user = new User(body);
//                 user.save().then((doc) => {
//                     return doc.generateAuthToken()
//                 }).
//                 then((token) => {
//                     res.header('Authorization', `Bearer ${token}`).json({
//                         'email': user['email']
//                     })
//                 })
//             }
//         }
//     ).catch(err => {
//         res.status(400).send(err)
//     })
// })


// app.post('/signin', (req, res) => {
//     User.findByUserCredentials(req.body.email, req.body.password).then((user) => {
//         if (user) {
//             user.generateAuthToken().then(token => {
//                 res.header('Authorization', `Bearer ${token}`).json({
//                     'email': user['email']
//                 })
//             })
//         } else {
//             res.status(200).json({
//                 'err': 'User not found'
//             })
//         }
//     }).catch((e) => {
//         res.status(400).send();
//     })
// })

// app.get('/getProductList', authenticate, (req, res) => {
//     console.log(req.user)
//     if (!req.user) {
//         return res.status(200).json({
//             'err': 'User not authenticated'
//         })
//     } else {
//         Dishes.find().limit(100).then(doc => {
//             res.status(200).json({
//                 'dishes': doc
//             })
//         })
//     }

// })


// app.listen(port, () => {
//     console.log(`Server started on ${port}`)
// })
// module.exports = {
//     app
// }

initDb(function (err, db) {
    if (err) {
        throw err
    } else {
        //  insertDocuments(db)

        // db.collection('documents').createIndex({ name: "text", artists: "text" }).then(re => { 
        //   console.log(re)
        // }).catch(e => { 
        //   console.log(e)
        // })
        app.locals.connection = db
        app.listen(5000, function (err) {
            if (err) {
                throw err;
            }
            console.log("API Up and running on port 5000");
        })
    }
})

const insertDocuments = (db) => {
    console.log(db)
    let collection1 = db.collection('documents');
    collection1.drop();
    let collection = db.collection('channels');
    const csvFilePath = 'file.csv';
    csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            collection.createIndex({
                name: "text",
                artist: "text"
            })
            jsonObj.map(e => {
                e.rank = parseInt(e['Rank'])
                e.grade = e['Grade']
                e.channel = e['Channel name']
                e.uploadViews = parseInt(e['Video Uploads'])
                e.subscribers = parseInt(e['Subscribers'])
                e.views = parseInt(e['Video views'])
                collection.insertOne({
                        ...e
                    }).then(res => {})
                    .catch((r) => {
                        console.log(r)
                    })
            })
        })

    // collection.createIndex( { name: "text", artists: "text" } )
}

app.get('/', (req, res) => {
  
    let connection = req.app.locals.connection
    let collection = connection.collection('documents');
  
    collection.find({})
      .sort({
        "rank": 1
      }).limit(50).toArray(function (err, docs) {
        if (docs) {
          res.status(200).json({
            msg: msg.SUCCESS,
            data: docs
          })
        }
        if (err) {
          res.status(200).json({
            msg: msg.FAILURE
          })
        }
      })
  });
