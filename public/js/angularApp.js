var app = angular.module('foodHookup', ['ngRoute', 'google.places', 'ngSanitize', 'ngAnimate']);

console.log = function() {};
app.controller('MainCtrl', [
    /* Used by index and static pages */
    '$scope',
    '$http',
    function($scope, $http){
        $scope.last_location      = '/';
        $scope.wrong_loc = window.wrong_loc;
    }
]);


app.controller('FoodCardCtrl', [
    /* Used by individual restaurant view */
    '$scope',
    '$timeout',
    '$location',
    'CurrentRestaurant',
    function($scope, $timeout, $location, CurrentRestaurant){

        $scope.current_restaurant = {};

        $scope.page_class = 'single-food-card';
        $scope.last_location      = '/food';

        $scope.current_restaurant = CurrentRestaurant.restaurant;

        if ($scope.current_restaurant.name == undefined){
            $location.path('/food');
        }

        if($scope.current_restaurant) {
            $scope.star_rating = $scope.current_restaurant.star_rating;
        }

        var shorten_string = function(string) {
          // Adds line breaks to long addresses and names
            var new_string;
            if (string.length > 18) {
                for (var i = string.length; i > 0; i--) {
                    if (i < 18 && string[i] == " "){
                        new_string = string.substring(0, i)
                            + '<br />' +
                            shorten_string(string.substring(i));
                        break;
                    }
                }
            }
            else {return string;}
            return new_string;
        };

        $scope.animate_button = function(button_id) {
          // Animates the phone, map, and Yelp buttons when clicked
            var button      = document.getElementById(button_id);
            var button_link = document.getElementById(button_id+"-link");
            var new_info    = '';
            button.style.width = '70vw';

            switch (button_id) {
            case 'phone-button':
                // phone button becomes a tel: link
                if (!button_link.href.includes("first")) {
                    window.location = "tel:" + $scope.current_restaurant.phone;
                    new_info = $scope.current_restaurant.phone;
                }
                else {
                    button_link.href = "#";
                    new_info = $scope.current_restaurant.phone;
                }
                break;
            case 'address-button':
                // address button becomes a link to the Google Map for the address
                if (!button_link.href.includes("first")) {
                    new_info = shorten_string($scope.current_restaurant.address_1)
                        + '<br />' +
                        $scope.current_restaurant.address_2;
                    window.location = "http://maps.google.com/maps?q=" +
                        $scope.current_restaurant.address_as_url;
                }
                else {
                    button_link.href = "#";

                    new_info = shorten_string($scope.current_restaurant.address_1)
                        + '<br />' +
                        $scope.current_restaurant.address_2;
                }
                break;
            case 'yelp-button':
                // Yelp button becomes a Yelp link
                if (!button_link.href.includes("first")) {
                    window.location = $scope.current_restaurant.yelp_url;
                    new_info = "See it on Yelp";
                }
                else {
                    button_link.href = "#";
                    new_info = "See it on Yelp";
                }
                break;
            } // end switch

            if (new_info.length > 18) {
                button.style.fontSize = '21px';
            }
            setTimeout(function() {
              // The new button text is added after animation completes
                button.innerHTML = "" ;
                button.innerHTML += new_info ;
            }, 300);
        }; // end animate_button function
    }
]);

app.controller('FoodDeckCtrl', [
    /* Used by restaurant list view */
    '$scope',
    '$http',
    '$timeout',
    '$location',
    '$window',
    'CurrentRestaurant',
    function($scope, $http, $timeout, $location, $window, CurrentRestaurant){

        $scope.page_class         = 'food-list';

        $scope.last_location      = '/';
        // "Back" link on nav
        $scope.yelp_data          = window.yelp_data;
        // Yelp responses
        $scope.search_data        = window.search_data;
        // Data from the form
        $scope.restaurant_objects = [];
        // List of restaurants


        $scope.see_more = function() {
          /* Button at the bottom of the list that adds 20 more restaurants
           * to the list by querying Yelp again
           */

            if (document.getElementById("more-button").innerHTML == "That's it!") {
                return;
            }
            $http({
                method: 'GET',
                url: '/yelp',
                params: $scope.search_data
            }).then(function successCallback(response) {

                if (response.data.data.length < 1) {
                    document.getElementById("more-button").innerHTML = "That's it!";
                }

                $scope.search_data.offset = parseInt(response.data.search_data.offset);

                $scope.yelp_data = response.data.data;
                populate_app($scope.search_data.offset);

            }, function errorCallback(response) {
                console.log(response);
            });
        };


        $scope.view_restaurant = function(given_restaurant) {
          /* Detail view for mobile, Yelp link for desktop */

            if ($window.innerWidth < 768) {
                CurrentRestaurant.restaurant = given_restaurant;
                $location.path('restaurant');
            }
            else {
                window.location = (given_restaurant.yelp_url);
            }
        };

        var generate_rating_stars = function(rating_value) {
            /* Create star rating glyphicons using rating value */
            var star_text   = "<span id='rating_star_container'>";
            var image_source = "/img/review-stars/31x31_" + Math.floor(rating_value / 1) + "@2x.png";
            var half_image_source = "/img/review-stars/31x31_" + Math.floor(rating_value / 1) + "-5@2x.png";

            for (var i = 1; i < 5 ; i++) {
                if (i <= rating_value) {
                    for (; i <= rating_value ; i++) {
                        star_text += '<img class="rating_star" src="'+image_source+'" />';
                    }
                    if(rating_value % 1 != 0) {
                        star_text += '<img class="rating_star" src="' + half_image_source + '" />';
                        i++;
                    }
                    i--;
                }

                if (i < 5){
                    star_text += '<img class="rating_star" src="/img/review-stars/31x31_0@2x.png" />';
                }
            }
            star_text += '</span>';
            return star_text;
        };

        var get_address_1 = function(location) {
          /* address_1 is the street name and number */
            var address = "";
            if (location.address1) { address += location.address1; }
            if (location.address2) { address += ', ' + location.address2; }
            if (location.address3) { address += ', ' + location.address3; }
            return address;
        };
        var get_address_2 = function(location) {
          /* address_2 is the city and state */
            var address = "";
            if (location.city)     { address += location.city; }
            if (location.state)    { address += ', ' + location.state; }
            return address;
        };

        var get_address_as_url = function (address_1, address_2) {
          /* returns the Google Map link for a given address */
            var address_as_url  = "";
            address_as_url += address_1.replace(/ /g,"+") + ",";
            address_as_url += address_2.replace(/ /g,"+") + ",";
            return address_as_url;
        };

        var get_image = function(image) {
          /* replaced the small image from Yelp with a higher resolution one */
            var return_image = image;
            return_image = return_image.replace('ms.jpg', 'ls.jpg');
            if (return_image.length < 1) {
                return_image = "/img/orderuphookuplogo.png";
            }
            return return_image;
        };

        var image_style = function(image) {
          /* My logo default image needs special styling, so a class is added */
            if(image.includes("orderuphookuplogo")) {
                return "logo-image";
            }
            else {
                return "";
            }

        };

        var get_phone = function(phone) {
          /* removes the 1 from the front of the phone number and styles it normally */
            if (typeof(phone) != 'undefined'){
                if (phone[0] == '+') {
                    phone = phone.substring(1);
                }
                if (phone[0] == '1') {
                    phone = phone.substring(1);
                }
                if (phone.length == 10) {
                    phone = phone.substring(0, 3) + "." +
                        phone.substring(3, 6) + "." +
                        phone.substring(6); 
                }
            }
            return phone;

        };

        var get_title_size = function(length) {
          /* adjust font size for longer restaurant names */
            if (length > 22) {
                return "font-size: 26px;";
            }
            else if (length > 15) {
                return "font-size: 30px;";
            }
            else {
                return "font-size: 36px;";
            }
        };

        var get_hidden = function(element){
          /* Don't display a button if there is no data for it */
            if (typeof(element) != "undefined") {
                var length = element.length;
                if (length <= 0) {
                    return "display:none;";
                }
            }
            return "";
        };

        var setup_data = function(i, yelp_data) {
            /* Setup scope variables for a new card when the view changes */
            var restaurant_object = {};

            $scope.business = yelp_data[i];

            var is_closed   = $scope.business.is_closed;

            while (is_closed) {
                $scope.business = yelp_data[++i];
                is_closed       = $scope.business.is_closed;
            }
            restaurant_object.id             = $scope.business.id;
            restaurant_object.name           = $scope.business.name;
            restaurant_object.title_size     = get_title_size(restaurant_object.name.length);
            restaurant_object.address_1      = get_address_1($scope.business.location);
            restaurant_object.address_2      = get_address_2($scope.business.location);
            restaurant_object.location       = $scope.business.location.coordinate;
            restaurant_object.phone          = get_phone($scope.business.phone);
            restaurant_object.phone_style    = get_hidden(restaurant_object.phone);
            restaurant_object.address_style  = get_hidden(restaurant_object.address_2);
            restaurant_object.rating         = $scope.business.rating;
            restaurant_object.categories     = $scope.business.categories;
            restaurant_object.image          = get_image($scope.business.image_url);
            restaurant_object.image_class    = image_style(restaurant_object.image);
            restaurant_object.yelp_url       = $scope.business.url;
            restaurant_object.price          = $scope.business.price;
            restaurant_object.star_rating    = generate_rating_stars(restaurant_object.rating);
            restaurant_object.address_as_url = get_address_as_url(restaurant_object.address_1,
                                                                  restaurant_object.address_2);
            return restaurant_object;
        };


        var populate_app = function(offset) {
          /* Add the restaurants to the view and adjust the offset appropriately */
            for (var i = offset; i < $scope.yelp_data.length; i++) {
                $scope.restaurant_objects[i]  = setup_data(i, $scope.yelp_data);
                $scope.search_data.offset++;
            }
        };

        if ($scope.restaurant_objects.length < 1) {
          /* If there are no restaurants in the view, either repopulate or 
           * redirect to a 0 results page 
           */
            if ($scope.yelp_data.length > 0) {
                populate_app(0);
            }
            else {
                $location.path('/nope');
            }
        }
        else if ($scope.search_data.offset == 0) {
          /* If the offset is 0, it is an initial search, simply populate the app */
          populate_app(0);
        }
    }
]);


app.factory('CurrentRestaurant',function() {
  /* factory used to pass the restaurant between the singe and list
   * views/controllers */
    return {restaurant:{}};
});

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/restaurant', {
            templateUrl : 'restaurant',
            controller  : 'FoodCardCtrl'
        })

        .when('/food', {
            templateUrl : 'food',
            controller  : 'FoodDeckCtrl'
        })
        .when('/nope', {
            templateUrl : 'nope',
            controller  : 'MainCtrl'
        })
        .when('/about', {
            templateUrl : 'about',
            controller  : 'MainCtrl'
        })
        .when('/', {
            templateUrl : '/',
            controller  : ''
        })
        .otherwise({redirectTo: '/'});

    $locationProvider.html5Mode({
      /* Pretty URLs*/
        enabled: true,
        requireBase: false
    });

});

