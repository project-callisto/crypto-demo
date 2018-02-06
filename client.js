
$(document).ready(function() {
    $("#submitBtn").click(function(){
        var userId = 'a user';

      $.post('http://localhost:8080/postPID', {
        'userId': userId,
        'pid':'https://www.facebook.com/weinsteinharvey/?ref=br_rs'
      }, function(data, status) {
          const rid = data.rid;
          // var randWords = sjcl.random.randomWords(data.rid);

          const kRecord = sjcl.random.randomWords(8);

          var record = {name: 'name', incident: "asdfasdf"};

          var encryptedRecord = encryptRecord(record);
          var x = sjcl.hash.sha256.hash(userId);
          var a = ??? 

          var s = (a * x) + (rid % ((2^128)-159));
    

        // sjcl.encrypt("password", "Your plaintext", {mode : "ccm || gcm || ocb2"})
        // sjcl.decrypt("password", ciphertext) // Mode can be inferred.

        console.log('rand', randWords);
      });
    });
  });