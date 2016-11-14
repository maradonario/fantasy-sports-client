var request = require('request');
var rp = require('request-promise');
var url = require('url');

function YahooApiClient(appKey, appSecret) {
  this.appKey = appKey;
  this.appSecret = appSecret;
  this.token = "";
  this.verifier = "";
  this.oauth_token = "";
  this.oauth_token_secret = "";
  this.oauth_expires_in = 0;
  this.xoauth_request_auth_url = "";
}

YahooApiClient.prototype.getToken = function getToken(req, res) {
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
            oauth_callback : 'oob'//'http://localhost:3000/callback'
        },
        resolveWithFullResponse: true // Automatically stringifies the body to JSON 
    };
    
    rp(options)
        .then(function (response) {
            var queryObj = response.body.split('&');
            queryObj.forEach(function(combo) {
                var queryElem = combo.split('=');
                queryElem.forEach(function(element, index, array) {
                    if (element === 'oauth_token') {
                        this.oauth_token = array[index + 1];
                        console.log(element + '=' + this.oauth_token);
                    }
                    if (element === 'oauth_token_secret') {
                        this.oauth_token_secret = array[index + 1];
                        console.log(element + '=' + this.oauth_token_secret);
                    }
                    if (element === 'oauth_expires_in') {
                        this.oauth_expires_in = array[index + 1];
                        console.log(element + '=' + this.oauth_expires_in);
                    }
                    if (element === 'xoauth_request_auth_url') {
                        this.xoauth_request_auth_url = array[index + 1];
                        console.log(element + '=' + this.xoauth_request_auth_url);
                    }
                }, this);
            }, this);
    var decodedUri = decodeURI(this.xoauth_request_auth_url);
    console.log(decodedUri);
    var viewModel = {
        'token' : this.oauth_token,
        'authUrl' : decodeURI(this.xoauth_request_auth_url)
    };
    res.render('home', viewModel); 
        })
        .catch(function (err) {
            console.log(err);
        });    
};

module.exports = YahooApiClient;