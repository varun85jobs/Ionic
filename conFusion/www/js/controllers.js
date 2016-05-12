angular.module('conFusion.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

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

    $scope.closeReserve = function(){
      $scope.reserveModal.hide();
    };

    $scope.reserve = function(){
      $scope.reserveModal.show();
    };

    $scope.doReserve = function(){
      console.log('Doing reservation', $scope.reservation);

      // Simulate a reservation delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeReserve();
      }, 1000);
    };

  })

  .controller('MenuController', ['$scope', 'menuFactory', 'favoriteFactory', '$ionicListDelegate', 'baseURL',
    function ($scope, menuFactory, favoriteFactory, $ionicListDelegate, baseURL) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showMenu = false;
    $scope.message = "Loading Menu...";

    $scope.dishes = menuFactory.getDishes().query(
      function (response) {
        $scope.dishes = response;
        $scope.showMenu = true;
      }, function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      });

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

    $scope.addFavorite = function(dishId){
      favoriteFactory.addFavorite(dishId);
      $ionicListDelegate.closeOptionButtons();
    } ;

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

  .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', 'baseURL', function ($scope, $stateParams, menuFactory, baseURL) {

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

    $scope.dish = menuFactory.getDishes().get({id: parseInt(id, baseSystem)},
      function (response) {
        $scope.dish = response;
        $scope.showDish = true;
      },
      function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      });

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

      menuFactory.getDishes().update({id: $scope.dish.id}, $scope.dish);

      //Step 4: reset your form to pristine
      $scope.commentForm.$setPristine();

      //Step 5: reset your JavaScript object that holds your comment
      $scope.newComment = {author: "", rating: '5', comment: ""};
    };


  }])


  .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', 'baseURL', function ($scope, menuFactory, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    //Fetching Promotion
    $scope.showPromotion = false;
    $scope.showPromotionMessage = "Loading Promotion...";

    $scope.promotion = menuFactory.getPromotion().get({id: 0})
      .$promise.then(
      function (response) {
        $scope.promotion = response;
        $scope.showPromotion = true;
      },
      function (response) {
        $scope.showPromotionMessage = "Error: " + response.status + " " + response.statusText;
      });


    //Fetching leader
    $scope.showLeader = false;
    $scope.showLeaderMessage = "Loading Leadership information...";

    $scope.leader = corporateFactory.getLeaders().get({id: 0})
      .$promise.then(
      function (response) {
        $scope.leader = response;
        $scope.showLeader = true;
      },
      function (response) {
        $scope.showLeaderMessage = "Error: " + response.status + " " + response.statusText;
      }
    );


    //Fetching featured Dish
    $scope.showDish = false;
    $scope.message = "Loading Dish...";

    $scope.dish = menuFactory.getDishes().get({id: 0})
      .$promise.then(
      function (response) {
        $scope.dish = response;
        $scope.showDish = true;
      },
      function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      }
    );
  }])


  .controller('AboutController', ['$scope', 'corporateFactory', 'baseURL', function ($scope, corporateFactory, baseURL) {

    $scope.baseURL = baseURL;
    $scope.showLeaders = false;
    $scope.showLeadersMessage = "Loading Leadership information...";

    $scope.leaders = corporateFactory.getLeaders().query()
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

  .controller('FavoriteController', ['$scope', 'menuFactory', 'favoriteFactory', 'baseURL', function ($scope, menuFactory, favoriteFactory, baseURL){

    $scope.baseURL = baseURL;

    $scope.shouldShowDelete = false;

    $scope.dishes = menuFactory.getDishes().query(
      function (response) {
        $scope.dishes = response;
        $scope.showMenu = true;
      }, function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      });
    console.log($scope.dishes, $scope.favorites);

    $scope.favorites = favoriteFactory.getFavorites();

    $scope.deleteFavorite = function (index) {
      favoriteFactory.deleteFavorite(index);
      $scope.shouldShowDelete = false;
    };

    $scope.toggleDelete = function(){
      $scope.shouldShowDelete = !$scope.shouldShowDelete;
      console.log("shouldShowDelete : " + $scope.shouldShowDelete);
    };

  }])


;
