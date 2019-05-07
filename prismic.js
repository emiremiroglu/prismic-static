config = require('./config.json')
run = require('child_process').exec
parser = require('body-parser')
express = require('express')
color = require('cli-color')
filter = require('ip-filter')
morgan = require('morgan')

require('dotenv').load()
env = process.env.MODE

app = express()
app.use(morgan(':method :url :status :response-time'))
app.use(parser.json())

app.use('*', function(req, res, next){
  ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip']

  if(ip){
    check = filter(ip, config.ip_list)
    if(ip && check){
      console.log(color.green(ip))
      next()
    } else {
      console.log(color.red(ip))
      res.sendStatus(400)
    }
  } else {
    res.sendStatus(400)
  }
})

app.post('/', function(req, res){
  switch(req.body.type) {
    case 'api-update':
      domain = req.body.domain
      switch(env) {
        case 'development':
          //
        break
        case 'production':
          //
        break
      }
      // run(command, function(e, stdout, stderr){
      //   if(e) throw e
      //   if(stderr) throw stderr
      //   res.sendStatus(200)
      //   console.log(color.green(command))
      // })
    break
    case 'test-trigger':
      res.sendStatus(200)
    break
  }
})

app.listen(config.port, function(){
  console.log(color.blue('prismic:' + env + ':' + config.port))
})
