angular.module('adminPanelGridApp', ["ngRoute",'ngMaterial', 'md.data.table'])

.config(function($mdThemingProvider,$routeProvider, $locationProvider) {
    
    $mdThemingProvider.theme('default')
      .primaryPalette('blue');


    $routeProvider
      .when("/",{
        templateUrl : "views/dashboard.html",
        controller : "gridController"
      })
      .when("/dashboard",{
        templateUrl : "views/dashboard.html",
        controller : "gridController"
      })

      .when('/about',{
        templateUrl : "views/about.html"
      })
      .when("/contact",{
         templateUrl : "views/contact.html"
      })
         
      .otherwise({templateUrl : 'views/urlError.html'});

       //to remove # from route    
       $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
       });  
  
})


.controller('gridController', ['$http','$mdEditDialog', '$q', '$scope', '$timeout','$rootScope', function ($http, $mdEditDialog, $q, $scope, $timeout,$rootScope) {
  'use strict';
  
  $scope.selected = [];
  $scope.limitOptions = [5, 10, 15];
  
  $scope.options = {
    rowSelection: true,
    multiSelect: true,
    autoSelect: true,
    decapitate: false,
    largeEditDialog: false,
    boundaryLinks: false,
    limitSelect: true,
    pageSelect: true
  };
  
  $scope.query = {
    order: 'name',
    limit: 5,
    page: 1
  };


  $http.get("/getData")
    .then(function(response) {
      console.log("data from server",response.data)
      $rootScope.desserts=response.data;

    });
  
  
  $scope.toggleLimitOptions = function () {
    $scope.limitOptions = $scope.limitOptions ? undefined : [5, 10, 15];
  };
  
  $scope.loadStuff = function () {
    $scope.promise = $timeout(function () {
      // loading
    }, 2000);
  }
  
  $scope.logItem = function (item) {
    //console.log(item.name, 'was selected');
    console.log(item);
    $rootScope.selectedItem = item;
    $rootScope.selectedItemKeyValue = item.portName;
    $rootScope.toggleRight();
  };
  
  $scope.logOrder = function (order) {
    console.log('order: ', order);
  };
  
  $scope.logPagination = function (page, limit) {
    console.log('page: ', page);
    console.log('limit: ', limit);
  }
}])



//sliderRight Controller
  .controller('sliderRightCntrl', function ($http,$scope, $timeout, $mdSidenav, $log, $rootScope) {
    $scope.toggleLeft = buildDelayedToggler('left');
    $rootScope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };


    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
      var timer;

      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }, 200);
    }

    function buildToggler(navID) {
      return function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      };
    }

    $scope.cancelSlider= function(){
       $mdSidenav('right').close()
          .then(function(){
            $log.log("cancel slider");
          });
    };
  
    $scope.submit = function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
          var updatedValues = {
            portNameOld :$rootScope.selectedItemKeyValue,
            portName :$rootScope.selectedItem.portName,
            AliasName :$rootScope.selectedItem.AliasName,
            portDesp: $rootScope.selectedItem.portDesp,
            shutDown: $rootScope.selectedItem.shutDown,
            ipAddress: $rootScope.selectedItem.ipAddress,
            speed: $rootScope.selectedItem.speed,
            mtu: $rootScope.selectedItem.mtu,
          }
          $log.log(updatedValues)

          //update api request
          $http.post('/updateData',updatedValues)
              .then(function(response){
                console.log("post response",response);

                $http.get("/getData")
                  .then(function(response) {
                    console.log("updated data from server",response.data)
                   // $rootScope.desserts=response.data;

                  });

              });

        });
    };
  });