'use strict';

angular.module('conFusion.services', ['ngResource'])
       .constant("baseURL","http://localhost:3000/")
       .service('menuFactory', [ '$resource', 'baseURL', function($resource, baseURL){

        this.getDishes = function(){

            return $resource(baseURL + "dishes/:id" , null,  {'update':{method:'PUT'}});

        };

        this.getPromotion = function(){
            return $resource(baseURL + "promotions/:id" , null, null);
        };
    }])

       .factory('corporateFactory', ['$resource', 'baseURL', function($resource, baseURL) {

        var corporate = {};

        corporate.getLeaders = function(){
            return $resource(baseURL + "leadership/:id", null, null);
        };

        return corporate;
    }])

    .factory('feedbackFactory', ['$resource', 'baseURL', function($resource, baseURL) {

        var feedback = {};

        feedback.send = function(){
            return $resource(baseURL + "feedback", null, null);
        };

        return feedback;
    }])
;
