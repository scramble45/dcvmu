const async = require('async')
  , http = require('http')
  , formidable = require('formidable')
  , getVMS = require('./lib/vms')
  , getVMI = require('./lib/vmi')
  , upload = require('./pages/upload')
  , uploadSelectFile = require('./pages/upload_select_file')

const port = 8080

http.createServer(function (req, res) {
  if (req.url == '/upload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      if (err) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.write('an error occurred')
        return
      }

      var fileName = fields.filetoupload.match(new RegExp('filename=' + "(.*)" + '&fs'))

      if (!fileName) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.write(uploadSelectFile)
        res.end()
        return
      }

      fileName = fileName[1]
      var originalFileName = fileName
      fileName = fileName.substring(0, 8)
      while (fileName.length < 8) { fileName += "_" }

      async.series([
        function (callback) {
          var data = fields.filetoupload.slice(fields.filetoupload.indexOf('tm=') + 'tm='.length).substring(15).replace(/[\r\n]/g, '').trim()
          getVMS(fileName, data, function (err, result) {
            if (err) {
              callback(err)
            } else {
              callback(null, result)
            }
          })
        },
        function (callback) {
          getVMI([fileName, originalFileName], function (err, result) {
            if (err) {
              callback(err)
            } else {
              callback(null, result)
            }
          })
        }
      ],
        function (err, results) {
          if (err) {
            console.error(err)
            res.writeHead(400, { 'Content-Type': 'text/html' })
            res.write(`<div>An Error Occured.</div>`)
            res.end()
            return
          }
          console.log('Results:', results)
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.write(`<div>File uploaded!</div><form><input type="button" value="Go Back" onclick="history.back()"></form>`)
          res.end()
        })
    })
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write(upload)
    return res.end()
  }

}).listen(port)

console.log("Server is listening on:", port);

