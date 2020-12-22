import SpotifyWebApi from 'spotify-web-api-js';
import Handlebars from 'handlebars';

(function() {

  function login(callback) {
    var CLIENT_ID = 'e39538aff1874f5993e1ff9c5b9b84a9';
    var REDIRECT_URI = 'https://dungeonjumper.github.io/reversify/authenticate/';
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
        callback(hash.access_token);
      }
    }, false);
    var w = window.open(url,
      'Spotify',
      'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
      );
  }

  function getArtists(time_range) {
    spotifyApi
    .getMyTopArtists({time_range:time_range, limit: 50, offset: 0})
    .then(
      function (artists) {
        spotifyApi.getMe(artists).then(
          function (me) {;
            const items = artists.items;
            items.sort(function (a, b) {
              return a.followers.total - b.followers.total;
            });
            
            const resultTitle = me.display_name + (me.display_name.slice(-1) != 's' ? '\'s' : '\'') + ' Reversify Lineup',
                  resultTimeFrame = document.getElementById(time_range).innerHTML,
                  templateSource = document.getElementById('result-template').innerHTML,
                  template = Handlebars.compile(templateSource),
                  resultsPlaceholder = document.getElementById('results');
            resultsPlaceholder.innerHTML = template({items: items, resultTitle: resultTitle, resultTimeFrame: resultTimeFrame});
          }
        )
      },
      function (err) {
        console.error(err);
      }
    );
  }

  var spotifyApi = new SpotifyWebApi();

  const loginButton = document.getElementById('btn-login');
  const filterButtons = document.getElementById('filter_by');

  filterButtons.style.display = "none";
  loginButton.addEventListener('click', function() {
    login(function(accessToken) {
      spotifyApi.setAccessToken(accessToken);
      getArtists('long_term');
      loginButton.style.display = "none";
      filterButtons.style.display = "block";
    });
  });

  const buttons = document.querySelectorAll("button.options");
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      getArtists(button.id);
    });
  });

  if (localStorage.getItem('spotifyAccessToken')) {
    const accessToken = localStorage.getItem('spotifyAccessToken');
    spotifyApi.setAccessToken(accessToken);
    getArtists('long_term');
    loginButton.style.display = "none";
    filterButtons.style.display = "block";
  }
  else {
    // no access token
  }

})();
