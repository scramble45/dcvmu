module.exports = function (fileName, callback) {
  const async = require('async')
    , fs = require('fs')
    , pad = require('pad')
    , pack = require('php-pack').pack
    ;

  async.auto({
    gatherFileSize: function (cb) {
      var fileSizeInBytes = fs.statSync(`${__dirname}/../uploads/${fileName[0]}.VMS`)
      cb(null, fileSizeInBytes.blksize)
    },
    gatherChecksumInput: function (cb) {
      var checksumInput = JSON.stringify(Buffer.from('SEGA', 'utf8'))
      checksumInput = JSON.parse(checksumInput)
      var data = checksumInput.data.slice(0, 4)
      cb(null, data)
    },
    gatherChecksumData: function (cb) {
      var checksumData = JSON.stringify(Buffer.from(fileName[0], 'utf8'))
      checksumData = JSON.parse(checksumData)
      var data = checksumData.data.slice(0, 4)
      cb(null, data);
    },
    createBuffer: ['gatherFileSize', 'gatherChecksumInput', 'gatherChecksumData', function (results, cb) {
      const header_format = [
        'A4', // ="SEGA" AND sub(VMSName,4);
        'a32',
        'a32',
        'S',
        'C',
        'C',
        'C',
        'C',
        'C',
        'C', // 0 sunday, 6 saturday
        'S',
        'S',
        'A8', // Just name, no extension
        'A12',
        'S', // 1(1=game,0=data), 0(1=no_copy,0=copyable)
        'S', // set to 0
        'L' // in bytes  
      ].join('')

      var checksumInput = results.gatherChecksumInput[0]
      var checksumData = results.gatherChecksumData[1]

      function hexDec(input) {
        return input.charCodeAt(0);
      }

      var desc = {
        'checkSum': [
          checksumInput[0] & checksumData[0],
          checksumInput[1] & checksumData[1],
          checksumInput[2] & checksumData[2],
          checksumInput[3] & checksumData[3]
        ]
      }

      desc = String.fromCharCode(desc['checkSum'][0], desc['checkSum'][1], desc['checkSum'][2], desc['checkSum'][3])

      var date = new Date()

      var data = [
        // header_format,
        desc,
        // pad("Testing".substring(0, 32), 32),
        // pad(`${date.getFullYear()}`.substring(0, 32), 32),
        "VMU".substring(0, 32),
        `${date.getFullYear()}`.substring(0, 32),
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getDay() + 1,
        0, // dont touch
        1, // dont touch
        fileName[0],
        `${fileName[1]}.VMS`,
        0, // dont touch
        0, // dont touch
        results.gatherFileSize
      ]

      var buffer = pack(header_format, data)
      cb(null, buffer)
    }]
  }, function (err, results) {
    fs.writeFile(`${__dirname}/../uploads/${fileName[0]}.VMI`, results.createBuffer, (err) => {
      if (err) return callback(err)
      var msg = {
        status: true,
        message: `Successfully wrote out VMI file to: uploads/${fileName[0]}.VMI`
      }
      return callback(null, msg)
    })
  })
}