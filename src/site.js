import SpotifyWebApi from 'spotify-web-api-js';
import Handlebars from 'handlebars';

(function() {

  function login() {
    var CLIENT_ID = 'e39538aff1874f5993e1ff9c5b9b84a9';
    var REDIRECT_URI = 'http://spotify.lndo.site/authenticate/';
    function getLoginURL(scopes) {
      return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
        '&scope=' + encodeURIComponent(scopes.join(' ')) +
        '&response_type=token';
    }
    var url = getLoginURL([
      'user-read-email',
      'user-top-read',
    ]);
    var width = 450,
        height = 730,
        left = (screen.width / 2) - (width / 2),
        top = (screen.height / 2) - (height / 2);
    window.addEventListener("message", function(event) {
      var hash = JSON.parse(event.data);
      if (hash.type == 'access_token') {
        localStorage.setItem('spotifyAccessToken', hash.access_token);
      }
    }, false);
    var w = window.open(url,
      'Spotify',
      'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
      );
  }

  function displayArtists(items) {
    items.sort(function (a, b) {
      return a.followers.total - b.followers.total;
    });
    var templateSource = document.getElementById('result-template').innerHTML,
        template = Handlebars.compile(templateSource),
        resultsPlaceholder = document.getElementById('result');
    resultsPlaceholder.innerHTML = template({items});
    console.log(items);
  }

  var spotifyApi = new SpotifyWebApi();

  document.getElementById('btn-login').addEventListener('click', function() {
    login();
  });

  if (localStorage.getItem('spotifyAccessToken')) {
    const accessToken = localStorage.getItem('spotifyAccessToken');
    spotifyApi.setAccessToken(accessToken);
    spotifyApi
    .getMyTopArtists({time_range:'long_term', limit: 50, offset: 0})
    .then(
      function (data) {
        displayArtists(data.items);
      },
      function (err) {
        console.error(err);
      }
    );
  }
  else {
    // no access token
  }

})();
