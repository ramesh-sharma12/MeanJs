import {Component, View, bootstrap} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables} from 'angular2/router';


import {Home} from './components/home/index';
import {About} from './components/about/index';
import {MovieStore} from './components/moviestore/index';

@Component({
    selector: 'app'
})

@RouteConfig([
  { path: '/', component: Home, as: 'home' },
  { path: '/home', component: Home, as: 'home' },
  { path: '/about', component: About, as: 'about' },
  { path: '/movies', component: MovieStore, as: 'movies' }
])

@View({
  templateUrl: './app.html?v=<%= VERSION %>',
  directives: [RouterOutlet, RouterLink]
})

class App {}

bootstrap(App, [routerInjectables]);
