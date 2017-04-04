// DOM LOCKER
// Copyright 2017 John Ozbay / TBWA
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var noop = function(param){}; // callback fallback.

var frontlocker = {

  lock:function (password, unencryptedHTML, callback) {
    callback = callback || noop;
    password = password || document.getElementById("frontlocker-password").value;
    unencryptedHTML = unencryptedHTML || document.getElementById('frontlocker').innerHTML;
    var encryptedHTML;

    if (password.length > 0 && unencryptedHTML.length > 0) {
      try {
        encryptedHTML = sjcl.encrypt(password, JSON.stringify(unencryptedHTML));
      } catch (err) {
        if (err.message === "ccm: tag doesn't match"){
          console.error("Wrong Password");
        } else {
          console.error("Frontlocker / Stanford Javascript Crypto Library Error : ", err);
        }
      }
      if (encryptedHTML) {
        try { document.getElementById("frontlocker").innerHTML = encryptedHTML; }
        catch(err) { }
        callback(encryptedHTML);
        return encryptedHTML;
      }
    } else {
        console.error("Make sure the password input is using 'frontlocker-password' id and the div containing the HTML to be encrypted has 'frontlocker' id. Alternatively pass the password and plaintext html to this function like lock(password, htmlToEncrypt, callback)");
    }
  },

  unlock:function (password, encryptedHTML, callback) {
    callback = callback || noop;
    password = password || document.getElementById("frontlocker-password").value;
    encryptedHTML = encryptedHTML || document.getElementById('frontlocker').innerHTML;
    var decryptedHTML;

      if (password.length > 0 && encryptedHTML.length > 0) {
        try {
          decryptedHTML = JSON.parse(sjcl.decrypt(password, encryptedHTML));
          sessionStorage.setItem('frontlocker-password', JSON.stringify(password));
        } catch (err) {
          if (err.message === "ccm: tag doesn't match"){
            console.error("Wrong Password");
          } else {
            console.error("Frontlocker / Stanford Javascript Crypto Library Error : ", err);
          }
        }

        if (decryptedHTML) {
          try {
            document.getElementById("frontlocker").innerHTML = decryptedHTML;
            document.getElementById("frontlocker").style.display = "block";
          } catch (err) {}
          callback(decryptedHTML);
          return decryptedHTML;
        }
      } else {
        console.error("Make sure the password input is using 'frontlocker-password' id and the div containing the HTML to be encrypted has 'frontlocker' id. Alternatively pass the password and encrypted html to this function like unlock(password, htmlToDecrypt, callback)");
      }
  },

  check:function(encryptedHTML, callback){
    callback = callback || noop;
    var password = JSON.parse(sessionStorage.getItem('frontlocker-password'));
    encryptedHTML = encryptedHTML || document.getElementById('frontlocker').innerHTML;
    if (password.length > 0) {
        return frontlocker.unlock(password, encryptedHTML, callback);
    } else {
        console.error("There's no password stored in sessionStorage. User will need to re-enter password.");
    }
  }

};
