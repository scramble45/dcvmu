module.exports = `
  <center>
  <br>
  <table bgcolor="#000000" bordercolor="#000000" cellpadding="0" cellspacing="2">
  <tbody>
      <tr>
      <td align="center"><font color="#eeeeee" face="arial"><b><i>Dreamcast VMU Uploader<br>
      </i></b></font></td>
      </tr>
      <tr>
      <td align="center" bgcolor="#767e89"><br>
      <br>
      <form action="upload" method="post" enctype="multipart/form-data">
          <table cellpadding="3" cellspacing="3">
          <tbody>
              <tr>
              <td>File:</td>
              <td><input name="filetoupload" type="VMFILE" value="MUST USE A DREAMCAST"></td>
              </tr>
              <tr>
              <td colspan="2" align="center"><input name="submit" value="Upload" type="submit"></td>
              </tr>
          </tbody>
          </table>
      </form>
      </td>
      </tr>
      <center>Keep Dreaming...</center>
  </tbody>
  </table>
  </center>
`