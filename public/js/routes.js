angular.module('SomatiColors')
    .config(MainRouter)
    .config(interceptor)

function interceptor($httpProvider){
 $httpProvider.interceptors.push('authInterceptorFactory')
}
        
function MainRouter ($stateProvider, $urlRouterProvider){

    $stateProvider    
        .state('landing', {
            url: '/',
            templateUrl: '../partials/landing.html',
            controller: 'usersController as usersCtrl'
        })

        .state('users', {
            url: '/users',
            templateUrl: '../partials/users.html',
            controller: 'usersController as usersCtrl'
        })

        .state('events', {
            url: '/users/:user_id/events',
            templateUrl: '../partials/events.html',
            controller: 'eventsController as eventsCtrl'
        })

        .state('event', {
			url: '/users/:user_id/events/:event_id',
			templateUrl: 'partials/events/event.html',
			controller: 'eventsController as eventsCtrl'
		})

        .state('loggedOut', {
            url: '/loggedOut',
            templateUrl: '../partials/landing.html',
            controller: "usersController as usersCtrl"
        })

    $urlRouterProvider.otherwise('/') 
    
}