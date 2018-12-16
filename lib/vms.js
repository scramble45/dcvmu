module.exports = function (fileName, data, callback) {
  const fs = require('fs')
  const enc_chars = 'AZOLYNdnETmP6ci3Sze9IyXBhDgfQq7l5batM4rpKJj8CusxRF+k2V0wUGo1vWH/=';
  const dec_chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var decoded = '';

  for (i = 0; i < data.length; i++) {
    if (data[i].indexOf(enc_chars)) {
      decoded += dec_chars[enc_chars.indexOf(data[i])]
    } else {
      decoded += data[i] // not found
    }
  }

  let buffer = Buffer.from(decoded, 'base64')

  fs.writeFile(`${__dirname}/../uploads/${fileName}.VMS`, buffer, (err) => {
    if (err) return callback(err);
    var msg = {
      status: true,
      message: `Successfully wrote out VMS file to: uploads/${fileName}.VMS`
    }
    return callback(null, msg)
  })
}
