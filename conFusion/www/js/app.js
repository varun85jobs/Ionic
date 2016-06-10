// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('conFusion', ['ionic', 'ngCordova', 'conFusion.controllers', 'conFusion.services', 'conFusion.filters'])

  .run(function ($ionicPlatform, $rootScope, $ionicLoading, $cordovaSplashscreen, $timeout) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      $timeout(function(){
        $cordovaSplashscreen.hide();
      },2000);
    });

    $rootScope.$on('loading:show', function () {
      $ionicLoading.show({
        template: '<ion-spinner icon="crescent"></ion-spinner> Loading ...'
      })
    });

    $rootScope.$on('loading:hide', function () {
      $ionicLoading.hide();
    });

    $rootScope.$on('$stateChangeStart', function () {
      console.log('Loading ...');
      $rootScope.$broadcast('loading:show');
    });

    $rootScope.$on('$stateChangeSuccess', function () {
      console.log('done');
      $rootScope.$broadcast('loading:hide');
    });

    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      event.preventDefault();
      var errorObject = { 'toState' : toState , 'fromState' : fromState , 'error' : error}
      console.log('****' + JSON.stringify(errorObject));
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push(function ($rootScope) {
      return {
        request: function (config) {
          console.log('request received');
          $rootScope.$broadcast('loading:show');
          return config;
        },
        response: function (response) {
          console.log('response received');
          $rootScope.$broadcast('loading:hide');
          return response;
        },
        responseError: function(rejection) {
          console.log('error response received');
          if (rejection.status === 404) {
            console.log('404 Error!');
            $rootScope.resourceError = true;
          }
        }
      }
    });

    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/sidebar.html',
        controller: 'AppCtrl',
        resolve: {
          dishes:  ['menuFactory', function(menuFactory){
            return menuFactory.query();
          }]
        }
      })

      .state('app.home', {
        url: '/home',
        views: {
          'mainContent': {
            templateUrl: 'templates/home.html',
            controller: 'IndexController',
            resolve: {
              dish:  ['menuFactory', function(menuFactory){
                return menuFactory.get({id: 0});
              }],

              promotion : ['promotionFactory', function(promotionFactory){
                return promotionFactory.get({id: 0});
              }],

              leader : ['corporateFactory', function(corporateFactory){
                return corporateFactory.get({id: 0});
              }]


            }
          }
        }
      })

      .state('app.aboutus', {
        url: '/aboutus',
        views: {
          'mainContent': {
            templateUrl: 'templates/aboutus.html',
            controller: 'AboutController'
          }
        }
      })

      .state('app.contactus', {
        url: '/contactus',
        views: {
          'mainContent': {
            templateUrl: 'templates/contactus.html'
          }
        }
      })

      .state('app.favorite', {
        url: '/favorite',
        views: {
          'mainContent': {
            templateUrl: 'templates/favorite.html',
            controller: 'FavoriteController',
            resolve: {
              favorites: ['favoriteFactory', function(favoriteFactory) {
                return favoriteFactory.getFavorites();
              }]
            }
          }
        }
      })

      .state('app.menu', {
        url: '/menu',
        views: {
          'mainContent': {
            templateUrl: 'templates/menu.html',
            controller: 'MenuController'
          }
        }
      })


      .state('app.dishdetails', {
        url: '/menu/:id',
        views: {
          'mainContent': {
            templateUrl: 'templates/dishdetail.html',
            controller: 'DishDetailController',
            resolve: {
              dish: ['$stateParams','menuFactory', function($stateParams, menuFactory){
                return menuFactory.get({id:parseInt($stateParams.id, 10)});
              }]
            }
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
  });
