angular.module('conFusion.controllers', [])

  .controller('AppCtrl', [ '$scope', '$ionicModal', '$timeout', 'localStorage', function ($scope, $ionicModal, $timeout, localStorage) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = localStorage.getObject('userinfo','{}');

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);
      localStorage.storeObject('userinfo', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };

    $scope.reservation = {};

    $ionicModal.fromTemplateUrl('templates/reserve.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.reserveModal = modal;
    });

    $scope.closeReserve = function () {
      $scope.reserveModal.hide();
    };

    $scope.reserve = function () {
      $scope.reserveModal.show();
    };

    $scope.doReserve = function () {
      console.log('Doing reservation', $scope.reservation);

      // Simulate a reservation delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeReserve();
      }, 1000);
    };

  }])

  .controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', '$ionicListDelegate', 'baseURL', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
    function ($scope, dishes, favoriteFactory, $ionicListDelegate, baseURL, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

      $scope.baseURL = baseURL;
      $scope.tab = 1;
      $scope.filtText = '';
      $scope.showDetails = false;
      $scope.showMenu = false;
      $scope.message = "Loading Menu...";

      $scope.dishes = dishes;

      $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
          $scope.filtText = "appetizer";
        }
        else if (setTab === 3) {
          $scope.filtText = "mains";
        }
        else if (setTab === 4) {
          $scope.filtText = "dessert";
        }
        else {
          $scope.filtText = "";
        }
      };

      $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
      };

      $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
      };

      $scope.addFavorite = function (dishId) {
        favoriteFactory.addFavorite(dishId);
        $ionicListDelegate.closeOptionButtons();

        $ionicPlatform.ready(function(){
          $cordovaLocalNotification.schedule({
            id: 1,
            title: "Added Favorite",
            text: $scope.dishes[dishId].name
          }).then(function () {
              console.log('Added Favorite '+$scope.dishes[dishId].name);
            },
            function () {
              console.log('Failed to add Notification ');
            });

          $cordovaToast
            .show('Added Favorite '+$scope.dishes[dishId].name, 'long', 'center')
            .then(function (success) {
              // success
            }, function (error) {
              // error
            });
        });
      };

    }])

  .controller('ContactController', ['$scope', function ($scope) {

    $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};

    var channels = [{value: "tel", label: "Tel."}, {value: "Email", label: "Email"}];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

  }])

  .controller('FeedbackController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {

    $scope.sendFeedback = function () {

      console.log($scope.feedback);

      feedbackFactory.send().save($scope.feedback);

      $scope.invalidChannelSelection = false;
      $scope.feedback = {mychannel: "", firstName: "", lastName: "", agree: false, email: ""};
      $scope.feedback.mychannel = "";
      $scope.feedbackForm.$setPristine();
      console.log($scope.feedback);

    };
  }])

  .controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'baseURL', '$ionicPopover', 'favoriteFactory','$ionicModal',
    function ($scope, $stateParams, dish, menuFactory, baseURL, $ionicPopover, favoriteFactory, $ionicModal) {

      var id = $stateParams.id;
      var baseSystem = 10;
      var sortingTypes = [{value: "date", label: "Date: Oldest To Recent"}, {
        value: "-date",
        label: "Date : Recent To Oldest"
      },
        {value: "rating", label: "Rating: Low to High"}, {
          value: "-rating",
          label: "Rating: High to Low"
        }, {value: "author", label: "Author: A to Z"},
        {value: "-author", label: "Author: Z to A"}];

      $scope.baseURL = baseURL;
      $scope.showDish = false;
      $scope.message = "Loading Dish...";
      $scope.sortingTypes = sortingTypes;

      /*Code for creating dish detail popover*/

      $ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
        scope: $scope
      }).then(function (popover) {
        $scope.popover = popover;
      });


      $scope.showPopup = function($event){
        $scope.popover.show($event);
      }

      $scope.hidePopup = function(){
        $scope.popover.hide();
      }


      /*Code for creating dish detail comment modal*/

      $ionicModal.fromTemplateUrl('templates/dish-comment.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.commentModal = modal;
      });

      $scope.showCommentForm = function(){
        $scope.commentModal.show();
        $scope.hidePopup();
      };

      $scope.closeCommentForm = function(){
        $scope.commentModal.hide();
      };


      $scope.dish = dish;


      $scope.addFavorite = function (dishId) {
        favoriteFactory.addFavorite(dishId);
        $scope.hidePopup();
      };

      $scope.commentData = {};

      $scope.addComment = function(){

        $scope.commentData.date = new Date().toISOString();
        $scope.dish.comments.push($scope.commentData);

        menuFactory.update({id: $scope.dish.id}, $scope.dish);

        console.log($scope.commentData);

        $scope.closeCommentForm();
        $scope.commentData = {};
      };

    }])

  .controller('DishCommentController', ['$scope', 'menuFactory', function ($scope, menuFactory) {

    //Step 1: Create a JavaScript object to hold the comment from the form
    $scope.newComment = {author: "", rating: '5', comment: "", date: new Date().toISOString()};

    $scope.commentPreview = false;

    $scope.submitComment = function () {

      //Step 2: This is how you record the date
      //"The date property of your JavaScript object holding the comment" = new Date().toISOString();
      $scope.newComment.date = new Date().toISOString();

      // Step 3: Push your comment into the dish's comment array
      $scope.dish.comments.push($scope.newComment);

      menuFactory.update({id: $scope.dish.id}, $scope.dish);

      //Step 4: reset your form to pristine
      $scope.commentForm.$setPristine();

      //Step 5: reset your JavaScript object that holds your comment
      $scope.newComment = {author: "", rating: '5', comment: ""};
    };


  }])


  .controller('IndexController', ['$scope', 'dish', 'leader', 'promotion', 'baseURL', function ($scope, dish, leader, promotion, baseURL) {

    $scope.baseURL = baseURL;
    //Fetching Promotion
    $scope.showPromotion = false;
    $scope.showPromotionMessage = "Loading Promotion...";

    $scope.promotion = promotion;

    //Fetching leader
    $scope.showLeader = false;
    $scope.showLeaderMessage = "Loading Leadership information...";

    $scope.leader = leader;


    //Fetching featured Dish
    $scope.showDish = false;
    $scope.message = "Loading Dish...";

    $scope.dish = dish;
  }])


  .controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', function ($scope, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.showLeaders = false;
    $scope.showLeadersMessage = "Loading Leadership information...";

    //Purposely keeping this way of calling query() method to remind myself later.
    $scope.leaders = corporateFactory.query()
      .$promise.then(
      function (response) {
        $scope.leaders = response;
        $scope.showLeaders = true;
      },
      function (response) {
        $scope.showLeadersMessage = "Error: " + response.status + " " + response.statusText;
      }
    );

  }])

  .controller('FavoriteController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicPopup', '$ionicLoading', '$timeout',
    function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicPopup, $ionicLoading, $timeout) {

      $scope.baseURL = baseURL;

      $scope.shouldShowDelete = false;

      /*$ionicLoading.show({
        template: '<ion-spinner icon="crescent"></ion-spinner> Loading...'
      });*/

      $scope.dishes = dishes;

      console.log('Dishes and favorites', $scope.dishes, $scope.favorites);

      $scope.favorites = favorites;

      $scope.deleteFavorite = function (index) {

        var confirmPopup = $ionicPopup.confirm({
          title: 'Confirm Delete',
          template: 'Are you sure you want to delete this item?'
        });

        confirmPopup.then(function (result) {
          if (result) {
            console.log('Ok to delete')
            favoriteFactory.deleteFavorite(index);
          } else {
            console.log('Canceled delete');
          }

          $scope.shouldShowDelete = false;
        });
      };

      $scope.toggleDelete = function () {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
        console.log("shouldShowDelete : " + $scope.shouldShowDelete);
      };

    }])
;
