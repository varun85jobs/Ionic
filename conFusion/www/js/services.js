'use strict';

angular.module('conFusion.services', ['ngResource'])
  .constant("baseURL", "http://192.168.0.10:3000/")
  .factory('menuFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

    return $resource(baseURL + "dishes/:id", null, {'update': {method: 'PUT'}});

  }])
  .factory('promotionFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

    return $resource(baseURL + "promotions/:id", null, null);
  }])

  .factory('corporateFactory', ['$resource', 'baseURL', function ($resource, baseURL) {
      return $resource(baseURL + "leadership/:id", null, null);
  }])

  .factory('feedbackFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

    var feedback = {};

    feedback.send = function () {
      return $resource(baseURL + "feedback", null, null);
    };

    return feedback;
  }])

  .factory('favoriteFactory', ['localStorage', function (localStorage) {

    var favFac = {};
    var favoritesStorageKey = 'favorites';

    var favorites = localStorage.getObject(favoritesStorageKey, '[]');


    favFac.addFavorite = function (index) {
      for (var i = 0; i < favorites.length; i++) {
        if (favorites[i].id == index)
          return;
      }
      favorites.push({id: index});
      localStorage.storeObject(favoritesStorageKey, favorites);
    }

    favFac.getFavorites = function () {
      return favorites;
    }

    favFac.deleteFavorite = function (index) {
      for (var i = 0; i < favorites.length; i++) {
        if (favorites[i].id == index) {
          favorites.splice(i, 1);
          localStorage.storeObject(favoritesStorageKey, favorites);
        }
      }
    }

    return favFac;
  }])

  .factory('localStorage', [ '$window', function($window){

    var localStorage = {}

    localStorage.store = function(key, value) {
      $window.localStorage[key] = value;
    };

    localStorage.get = function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    };

    localStorage.storeObject = function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    }

    localStorage.getObject = function(key,defaultValue) {
      return JSON.parse($window.localStorage[key] || defaultValue);
    }

    return localStorage;
  }])

;
