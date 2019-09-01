const fs = require('fs')
const ObjectId = require('mongodb').ObjectID
const mongodb = require('mongodb')

class Model {
  constructor(options) {
    this.options = options
  }

  list(callback) {
    // DB Connection
    mongodb.connect(process.env.mongoUrl, { useNewUrlParser: true }).then((client) => {
      let db = client.db(process.env.mongoDatabase)

      let modelName = this.options.modelName
      let options = this.options

      try {
        // Get the documents collection
        var collection = db.collection(modelName)

        let idFind = {}
        if(options.hasOwnProperty('find') && options.find.hasOwnProperty('_id')) {

          let objectId = new ObjectId(options.find._id)
          idFind = {
            _id: objectId
          }
        }

        let regexFind = {}
        // Enable regex if requested
        if(options.hasOwnProperty('find')) {
          Object.keys(options.find).forEach((key) => {
            if(key !== '_id') {
              regexFind[key] = { 
                $regex: options.find[key],
                $options: 'i' 
              }
            }
          })
        }

        let findOptions = Object.assign({}, idFind, regexFind)

        let pageIndex = 0
        if(options.hasOwnProperty('page')) {
          pageIndex = parseInt(options.page - 1)
        }

        let sortOptions = {}
        if(options.hasOwnProperty('sort')) {
          sortOptions = options.sort
        }

        console.log({
          findOptions: findOptions,
          sortOptions: sortOptions
        })

        let data = collection.find(findOptions, {sort: sortOptions})

        data.count((countError, count) => {
          //let limit = process.env.pagination.itemsPerPage
          let limit = 10

          if(options.hasOwnProperty('limit')) {
            limit = options.limit
          }

          let numberOfPages = Math.ceil(count / limit)
          let skipCount = limit * pageIndex

          let returnData = {
            page: options.page,
            totalCount: count,
            skipCount: skipCount,
            numberOfPages: numberOfPages,
            itemsPerPage: limit
          }

          data.skip(skipCount).limit(limit).toArray((err, result) => {
            returnData.docs = result
            callback(returnData)
          })
        })
      }
      catch(error) {
        console.log({
          error: error,
          find: options.find
        })

        callback({
          error: error.message
        })

        if(db != null) {
          db.close()
        }
      }
    })
  }

  create(callback) {
    // DB Connection
    mongodb.connect(process.env.mongoUrl, { useNewUrlParser: true }).then((client) => {
      let db = client.db(process.env.mongoDatabase)

      try {
        // Get the documents collection
        let collection = db.collection(this.options.modelName)

        // Insert data
        collection.insertMany(this.options.data, (err, data) => {
          callback(data)
        })
      }
      catch(error) {
        console.log({
          error: error
        })

        callback({
          error: error.message
        })

        if(db != null) {
          db.close()
        }
      }
    })
  }

  update(callback) {
    let modelName = this.options.modelName
    let options = this.options

    // DB Connection
    mongodb.connect(process.env.mongoUrl, { useNewUrlParser: true }).then((client) => {
      let db = client.db(process.env.mongoDatabase)

      try {
        // Get the documents collection
        var collection = db.collection(modelName)

        if(options.hasOwnProperty('find') && options.find.hasOwnProperty('_id')) {
          let objectId = new ObjectId(options.find._id)
          options.find = {
            '$or': [
              // Allow for both string and object forms
              { _id: objectId },
              { _id: options.find._id }
            ]
          }

          // Delete _id in the data (othewise this will crash)
          if(options.data.hasOwnProperty('_id')) {
            delete options.data._id
          }
        }
        collection.update(options.find, options.data, (err, data) => {
          callback(data)
        })
      }
      catch(error) {
        console.log({
          error: error,
          find: options.find
        })

        callback({
          error: error.message
        })

        if(db != null) {
          db.close()
        }
      }
    })
  }

  delete(callback) {
    let modelName = this.options.modelName
    let options = this.options

    // DB Connection
    mongodb.connect(process.env.mongoUrl, { useNewUrlParser: true }).then((client) => {
      let db = client.db(process.env.mongoDatabase)

      try {
        // Get the documents collection
        var collection = db.collection(modelName)

        if(options.hasOwnProperty('find') && options.find.hasOwnProperty('_id')) {
          let objectId = new ObjectId(options.find._id)
          options.find = {
            _id: objectId
          }
        }

        collection.deleteOne(options.find, (err, data) => {
          callback(data)
        })
      }
      catch(error) {
        console.log({
          error: error,
          find: options.find
        })

        callback({
          error: error.message
        })

        if(db != null) {
          db.close()
        }
      }
    })
  }
}

module.exports = Model
