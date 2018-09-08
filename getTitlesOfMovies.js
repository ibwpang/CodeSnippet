
var async = require('async');
var https = require('https');
var url = 'https://jsonmock.hackerrank.com/api/movies/search/?Title=';

getTitles('spiderman');

function getTitles(substr) {
  async.waterfall([
    function getTotalPages(next) {
      https.get(url + substr, (res) => {
        res.setEncoding('utf8');
        res.on('data', function(body) {   // lambda style: (body) => {}
          body = JSON.parse(body);
          next(null, body['total_pages']);
        });
      });
    },
    function getAllTitles(total_pages, next) {
      var titles = [];
      var counter = 0;
      for (var i = 1; i <= total_pages; i++) {
        https.get(url + substr + '&page=' + i, (res) => {
          res.setEncoding('utf8');
          res.on('data', function(body) {   // lambda style: (body) => {}
            body = JSON.parse(body);
            for (var j = 0; j < body['data'].length; j++) {
              titles.push(body['data'][j]['Title']);
            }
            counter++;   // now i === total_pages + 1, the only way to keep track on whether we have collected titles in all pages is to use another counter
            if (counter == total_pages) {
              next(null, titles);
            }
          });
        });
      }
    }
  ], function (err, titles) {
    if (err) {
      console.log(err);
    } else {
      console.log(titles.sort());
    }
    return titles.sort();
  });
}

