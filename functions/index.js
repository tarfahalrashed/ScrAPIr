// var passport = require('passport')
//   , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
//
// passport.use('provider', new OAuth2Strategy({
//     authorizationURL: 'https://unsplash.com/oauth/authorize',//https://www.provider.com/oauth2/authorize',
//     tokenURL: 'https://unsplash.com/oauth/token',//https://www.provider.com/oauth2/token',
//     clientID: 'c27b385721adeda6633b003df4417672f305d3033426b891bfaffed1a73b033c',//123-456-789',
//     clientSecret: '4faa9d89167c955cca2d9c608ff492d08389b1553e87f0791a55178ede5f1fba',//shhh-its-a-secret'
//     callbackURL: 'urn:ietf:wg:oauth:2.0:oob'//https://www.example.com/auth/provider/callback'
//   },
//   function(accessToken, refreshToken, profile, done) {
//     User.findOrCreate(..., function(err, user) {
//       done(err, user);
//     });
//   }
// ));
//
// app.get('/auth/provider',
//   passport.authenticate('provider', { scope: 'email' })
// );

// var passport = require('passport')
//   , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
//
// passport.use('provider', new OAuth2Strategy({
//     authorizationURL: '//https://www.provider.com/oauth2/authorize',
//     tokenURL: 'https://www.provider.com/oauth2/token',
//     clientID: '123-456-789',
//     clientSecret: 'shhh-its-a-secret'
//     callbackURL: 'https://www.example.com/auth/provider/callback'
//   },
//   function(accessToken, refreshToken, profile, done) {
//     User.findOrCreate(..., function(err, user) {
//       done(err, user);
//     });
//   }
// ));
