var APP_KEY = 'a02f100000Q6K3yAAF';
var PEDIGREE_GENERATIONS = 3;

var fs = new FamilySearch({
  environment: 'integration',
  appKey: APP_KEY,
  redirectUri: window.location.href,
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
// we wire up and display the signin button so that the user can initiate authentication.
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
  
  // We first make a request to the API to get the ID of the person
  // in the tree that represents this user.
  getUsersPersonId(function(personId){

    // Now that we have the user's person ID we can request their pedigree
    getPersonsPedigree(personId, function(persons){
      displayPedigree(persons);
    });
  });
}

/**
 * This method will interpret the pedigree response and display the persons
 * grouped by generation.
 */
function displayPedigree(persons){
  var generations = calculateGenerations(persons),
      $list = document.querySelector('.family-list');
  
  // Clear the loading message
  $list.innerHTML = '';
      
  // Generate and add the generation groups
  Object.keys(generations).forEach(function(generationNumber){
    var persons = generations[generationNumber];
    var $generation = document.createElement('div');
    var $title = document.createElement('h3');
    $title.textContent = 'Generation ' + generationNumber;
    $generation.appendChild($title);
    persons.forEach(function(person){
      var $person = document.createElement('div');
      $person.textContent = person.display.name + ' • ' + person.id + ' • ' + person.display.lifespan;
      $generation.appendChild($person);
      $list.appendChild($generation);
    });
  });
}

/**
 * Given a list of persons annotated with ahnentafel numbers, group them by generation
 */
function calculateGenerations(persons){
  
  // The pedigree is returned as a flat list of persons that are
  // annotated with Ahnentafel numbers. http://en.wikipedia.org/wiki/Ahnentafel
  // We use those numbers to assemble the pedigree.
  
  // This map will be keyed by the generation number (1,2,3, etc)
  var generations = { };
  
  persons.forEach(function(person){
    var ahnenNumber = person.display.ascendancyNumber;
        
    // Ignore the spouse
    if(ahnenNumber === '1-S'){
      return;
    }
        
    // According to the Wikipedia article linked to above, we can calculate
    // the generation number by rounding down log2() of the ahnentafel number
    var generation = Math.floor(Math.log2(ahnenNumber));
        
    if(!Array.isArray(generations[generation])){
      generations[generation] = [];
    }
    
    generations[generation].push(person);
  });
  
  return generations;
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
      callback(response.data.users[0].personId);
    }
  });
}

/**
 * Load a person's ancestral pedigree.
 * https://familysearch.org/developers/docs/api/tree/Ancestry_resource
 */
function getPersonsPedigree(personId, callback){
  fs.get('/platform/tree/ancestry?person=' + personId + '&generations=' + PEDIGREE_GENERATIONS, function(error, response){
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