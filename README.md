# frontlocker.js

Frontlocker is a simple server-less, *.htpasswd* replacement for your static HTML files. It uses [Stanford Javascript Crypto Library](https://github.com/bitwiseshiftleft/sjcl) to encrypt & decrypt DOM elements to hide and protect sensitive content on a website. It's a micro Javascript library that can hide / show sensitive content when the user types a pre-defined password. Its main purpose is to save time from setting up servers for the sole purpose of using *.htpasswd*. And in case if you're wondering... No. **Your password isn't stored in the code**

## Who is this for ?
* Do you find yourself setting up servers to serve static files **just** to use *.htpasswd*?  
* Do you find yourself wondering if only you could serve static html files on AWS and still have password protection life would be awesome?  
**Frontlocker is for you!**

As developers, for client presentations / previews, often we have to set up small microsites protected with *.htpasswd*. Generally, these sites are static html files, there's no backend involved, and we still end up having to set up a server. Frontlocker is here to solve exactly this problem.

## Instructions

Frontlocker is built with vanilla js. It only has one dependency, and that is the amazing [Stanford Javascript Crypto Library](https://github.com/bitwiseshiftleft/sjcl).

First, include [sjcl.js](https://github.com/bitwiseshiftleft/sjcl) and frontlocker.js in your html file.

```html
  <!-- ... -->
  <script src="sjcl.min.js" charset="utf-8"></script>
  <script src="frontlocker.js" charset="utf-8"></script>
</body>
```

Now, there's two ways to use Frontlocker.

---
#### 1) The HTML Way


Add the `frontlocker-password` id to your password input like this :

```html
<input type="password" id="frontlocker-password" onkeypress="return frontlocker.unlock()">
```

And put all your encrypted (locked) content into a hidden div, with the `frontlocker` id. (This could even be the main wrapper div in your body)

```html
<div id="frontlocker" style="display:none;">
  { encrypted (locked) html }
</div>
```

Done. When the user presses *return* after typing their password, Frontlocker will decrypt and replace the contents of the `frontlocker` div with the decrypted one.

Got AJAX calls? Got dynamic content? Got a multi-page site? Or simply want more control or flexibility?  Then you might want to take the JS way.

---
#### 2) The JS Way

Frontlocker comes with a few convenient functions to encrypt / decrypt (lock / unlock)  the contents of your website.

**Lock (Encrypt) DOM Elements**
```js
var encryptedHTML = frontlocker.lock(password, unencryptedHTML, callback);
// encryptedHTML will have your encrypted (locked) html contents

//  OR  //

frontlocker.lock(password, unencryptedHTML, callback);
// This would automatically set the contents of a div with the id 'frontlocker'
```

* `password` is the password users will need to enter to decrypt (unlock) the content.
* `unencryptedHTML` is the raw, plaintext, HTML that will be encrypted (locked).
* `callback` is a function you'd like to call after Frontlocker is done encrypting.

*All parameters are optional.*

* If no `password` is provided, Frontlocker will try to get this from a password input with the id `frontlocker-password`
* If no `unencryptedHTML` is provided, Frontlocker will try to get this from a div with the id `frontlocker`

**Unlock (Encrypt) DOM Elements**
```js
var decryptedHTML = frontlocker.unlock(password, encryptedHTML, callback);
// decryptedHTML will have your decrypted (unlocked) html contents

//  OR  //

frontlocker.unlock(password, encryptedHTML, callback);
// This would automatically set the contents of a div with the id 'frontlocker'
```

* `password` is the password user entered to decrypt (unlock) the content
* `encryptedHTML` is the encrypted (locked) HTML that will be decrypted (unlocked)
* `callback` is a function you'd like to call after Frontlocker is done decrypting.

*All parameters are optional.*

* If no `password` is provided, Frontlocker will try to get this from a password input with the id `frontlocker-password`
* If no `encryptedHTML` is provided, Frontlocker will try to get this from a div with the id `frontlocker`

*IMPORTANT*

If you use `frontlocker.unlock()` method on a multi-page website, users would have to enter their password on every new page. If this is your intended behavior, carry on. But if you'd like the user to enter the password only once, you should use the `frontlocker.check()` function detailed below instead.

**Check if the user has already entered the password**
```js
frontlocker.check(encryptedHTML, callback);
```
* `encryptedHTML` is the encrypted (locked) HTML that will be decrypted (unlocked)
* `callback` is a function you'd like to call after Frontlocker is done decrypting.

Frontlocker uses *sessionStorage* to retain the password in the browser until the tab is closed. This way users can enter the password just once. You can run this function during `on load` or `document ready` or when your ajax call finishes, to decrypt the contents automatically without the user entering a password.

This function is a convenience wrapper for `frontlocker.unlock()`, that simply checks for a password in *sessionStorage*, and if found, calls `frontlocker.unlock(passwordFromSessionStorage, encryptedHTML, callback)`

## Examples

#### 1) The HTML Way
```html
<!DOCTYPE html>
<html>
  <head>
    <!-- ... stuff ...  -->
  </head>
  <body>
    <input type="password" id="frontlocker-password" placeholder="Decryption password" onkeypress="return frontlocker.unlock()">

    <div id="frontlocker" style="display:none;">
      {encryptedHTML} <!-- This is all encrypted and hidden -->
    </div>

    <div class="some-other-content">
      <p>This is all human-readable, visible, unencrypted.</p>
    </div>

    <script src="sjcl.min.js" charset="utf-8"></script>
    <script src="frontlocker.js" charset="utf-8"></script>
  </body>
</html>
```

#### 2) The JS Way
```html
<html>
  <head>
    <!-- ... stuff ...  -->
  </head>
  <body>

    <!-- ... things ... -->

    <script src="sjcl.min.js" charset="utf-8"></script>
    <script src="frontlocker.js" charset="utf-8"></script>
    <script type="text/javascript">
          // if the user entered the password before, and if the password is still in sessionStorage,
          // this function will unlock the content immediately, without the need for typing the password again.
          frontlocker.check("Some-Encrypted-HTML-Content-Here", callback);

          var decryptedHTML = frontlocker.unlock("YourSuperSecretPassword", "Some-Encrypted-HTML-Content-Here", callback);
    </script>
  </body>
</html>
```
