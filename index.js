var fs = new FamilySearch({
  environment: 'integration',
  appKey: 'a02f100000Q6K3yAAF',
  redirectUri: window.location.href,
  saveAccessToken: true
});

// Wire up the Sign In button
document.getElementById('signin').addEventListener('click', function(){
  fs.oauthRedirect();
});

// If we're authenticated then load the pedigree
if(fs.getAccessToken()){
  
  // We first make a request to the API to get the ID of the person
  // in the tree that represents this user.
  getUsersPersonId(function(personId){

    // Now that we have the user's person ID we can request their pedigree
    getPersonsPedigree(personId, function(persons){

      // The pedigree is returned as a flat list of persons that are
      // annotated with Ahnentafel numbers. http://en.wikipedia.org/wiki/Ahnentafel
      // We use those numbers to assemble the pedigree.

      console.log(persons);

    });
  })
}

/**
 * Fetch the user's person ID via the Current User resource
 * https://familysearch.org/developers/docs/api/users/Current_User_resource
 */
function getUsersPersonId(callback){
  fs.get('/platform/users/current', function(error, response){
    if(error) {
      handleError(error);
    }
    else {
      callback(response.data.users[i].personId);
    }
  });
}

/**
 * Load a person's ancestral pedigree.
 * https://familysearch.org/developers/docs/api/tree/Ancestry_resource
 */
function getPersonsPedigree(personId, callback){
  fs.get('/platform/ancestry?person=' + personId, function(error, response){
    if(error) {
      handleError(error);
    } else {
      callback(response.data.persons);
    }
  });
}

/**
 * Prints an error to the console and fires an alert telling the user to open the console.
 * Don't do this in a production app.
 */
function handleError(error){
  console.error(error);
  alert('There was an error. Open the developer console to see the details.');
}