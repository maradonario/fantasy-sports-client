var request = require('request');
var rp = require('request-promise');

function YahooApiClient(appKey, appSecret) {
  this.appKey = appKey;
  this.appSecret = appSecret;
  this.token = "";
  this.verifierf = "";
}

YahooApiClient.prototype.getToken = function getToken() {
    var date = new Date();
    var seconds = date.getTime();
    var options = {
        method: 'GET',
        uri: 'https://api.login.yahoo.com/oauth/v2/get_request_token',
        qs: {
            oauth_consumer_key: this.appKey,
            oauth_nonce : seconds,
            oauth_signature_method : 'PLAINTEXT',
            oauth_signature :  this.appSecret + '&',
            oauth_timestamp : seconds,
            oauth_version : '1.0',
            oauth_callback : 'oob'
        },
        resolveWithFullResponse: true // Automatically stringifies the body to JSON 
    };
    
    rp(options)
        .then(function (response) {
            console.log('token ' + response.body);
        })
        .catch(function (err) {
            console.log('EEEERRRROOOOORRRRRR: ' + err);
        });    
};

module.exports = YahooApiClient;