'use strict';

angular.module('confusionApp')

    .controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {

        $scope.tab = 1;
        $scope.filtText = '';
        $scope.showDetails = false;

        $scope.msg = "Loading...";
        $scope.showMenu = false;

        menuFactory.getDishes().query(
            function (res) {
                $scope.dishes = res;
                $scope.showMenu = true;
            },
            function (res) {
                $scope.msg = "Error: " + res.status + " " + res.statusText;
            }
        );


        $scope.select = function(setTab) {
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

        $scope.toggleDetails = function() {
            $scope.showDetails = !$scope.showDetails;
        };
    }])

    .controller('ContactController', ['$scope', function($scope) {

        $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };

        var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];

        $scope.channels = channels;
        $scope.invalidChannelSelection = false;

    }])

    .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope, feedbackFactory) {

        $scope.sendFeedback = function() {

            console.log($scope.feedback);

            if ($scope.feedback.agree && ($scope.feedback.mychannel === "")) {
                $scope.invalidChannelSelection = true;
                console.log('incorrect');
            }
            else {
                $scope.invalidChannelSelection = false;
                feedbackFactory.save($scope.feedback);
                $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                $scope.feedback.mychannel="";
                $scope.feedbackForm.$setPristine();
                console.log($scope.feedback);
            }
        };
    }])

    .controller('DishDetailController', ['$scope', '$stateParams', 'menuFactory', function($scope, $stateParams, menuFactory) {

        $scope.showDish = false;
        $scope.msg = "Loading...";

        menuFactory.getDishes().get({id: parseInt($stateParams.id, 10)}).$promise.then(
            function (res) {
                $scope.dish = res;
                $scope.showDish = true;
            },
            function (res) {
                $scope.msg = "Error: " + res.status + " " + res.statusText;
            }
        );

    }])

    .controller('DishCommentController', ['$scope', 'menuFactory', function($scope, menuFactory) {

        $scope.mycomment = {rating:5, comment:"", author:"", date:""};

        $scope.submitComment = function () {

            $scope.mycomment.date = new Date().toISOString();
            console.log($scope.mycomment);

            $scope.dish.comments.push($scope.mycomment);

            menuFactory.getDishes().update({id: $scope.dish.id}, $scope.dish);

            $scope.commentForm.$setPristine();

            $scope.mycomment = {rating:5, comment:"", author:"", date:""};

        };
    }])

    .controller('IndexController', ['$scope', 'menuFactory', 'corporateFactory', function ($scope, menuFactory, corporateFactory) {

        function err(res) {
            return 'Error: ' + res.status + ' ' + res.statusText;
        }

        $scope.showDish = false;
        $scope.showPromo = false;
        $scope.showLead = false;
        $scope.msg = 'Loading..';

        menuFactory.getDishes().get({id: 0}).$promise.then(
            function (res) {
                $scope.feat = res;
                $scope.showDish = true;
            },
            function (res) {
                $scope.msg = err(res);
            }
        );

        menuFactory.getPromotions().get({id: 0}).$promise.then(
            function (res) {
                $scope.promo = res;
                $scope.showPromo = true;
            },
            function (res) {
                $scope.msg = err(res);
            }
        );
        
        corporateFactory.getLeaders().get({id: 3}).$promise.then(
            function (res) {
                $scope.lead = res;
                $scope.showLead = true;
            },
            function (res) {
                $scope.msg = err(res);
            }
        );
        
    }])
    
    .controller('AboutController', ['$scope', 'corporateFactory', function ($scope, corporateFactory) {

        $scope.showLeaders = false;
        $scope.msg = 'Loading...';

        corporateFactory.getLeaders().query(
            function (res) {
                $scope.leaders = res;
                $scope.showLeaders = true;
            },
            function (res) {
                $scope.msg = 'Error: ' + res.status + ' ' + res.statusText;
            }
        );
    }])

;