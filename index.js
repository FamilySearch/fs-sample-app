// Change this line to add your own app key. You can generate an app key by
// registering an app in developer's portal.
var APP_KEY = 'a02f100000Q6K3yAAF';

// Change this line to add the redirect URI associated with the app key above
var REDIRECT_URI = 'https://york.io/fs-sample-app/';

// You can modify this variable to change how many generations are included in the pedigree
var PEDIGREE_GENERATIONS = 5;

// Here we create and configure the API client
var fs = new FamilySearch({
  environment: 'integration',
  appKey: APP_KEY,
  redirectUri: REDIRECT_URI,
  saveAccessToken: true
});

// Process OAuth response, if we have one. true is returned if a code parameter
// was found in the query. Otherwise false is returned.
if(fs.oauthResponse(load)){
  // Noop. When oauthResponse returns true it means it found a code and is
  // going to exchange it for an access token. The response is handled in
  // the callback parameter of that method.
}

// We didn't find a oauth code in the query parameters so now we check to see
// if we're already authenticated.
else if(fs.getAccessToken()){
  load();
}

// If we're not processing an OAuth response and we're not already authenticated,
// we wire up and display the sign in button so that the user can initiate authentication.
else {
  document.getElementById('signin').addEventListener('click', function(){
    fs.oauthRedirect();
  });
}

/**
 * This method is called once the user is signed in and begins
 * loading data from the API.
 */
function load(){
  
  // Update displayed sections
  document.querySelector('.no-auth').style.display = 'none';
  document.querySelector('.auth').style.display = 'block';
  
  // First we fetch the user's person
  getCurrentPerson(function(person){

    // Then we display the data
    displayPerson(person);
    
  });
}

/**
 * Fetch the user's current person. The API will respond with a redirect. We tell
 * the SDK to automatically follow the redirect.
 * 
 * https://familysearch.org/developers/docs/api/tree/Current_Tree_Person_resource
 */
function getCurrentPerson(callback){
  fs.get('/platform/tree/current-person', {
    followRedirect: true
  }, function(error, response){
    if(error) {
      handleError(error);
    }
    else {
      callback(response.data.persons[0]);
    }
  });
}

/**
 * Display a person by printing out the display data in a pre block
 */
function displayPerson(person){
  var $profileContainer = document.querySelector('.person-profile'),
      $pre = document.createElement('pre');
  
  // Clear the loading message
  $profileContainer.innerHTML = '';
  
  // Pretty print the display block of the person
  $pre.innerHTML = JSON.stringify(person.display, null, 2);
  
  // Add the display block to the DOM
  $profileContainer.appendChild($pre);
}

/**
 * Prints an error to the console and fires an alert telling the user to open the console.
 * Don't do this in a production app.
 */
function handleError(error){
  console.error(error);
  alert('There was an error. Open the developer console to see the details.');
}