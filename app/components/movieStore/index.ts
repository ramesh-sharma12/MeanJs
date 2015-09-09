/// <reference path='../../../typings/tsd.d.ts' />

import {Component, View} from 'angular2/angular2';
import {RouterLink, Router} from 'angular2/router';
import {OnInit, OnChange, NgFor, NgIf} from 'angular2/angular2';

import {ProxyService} from 'services/proxyService';
import {Base} from '../../base';
import {Menu} from 'common/menu';

@Component({
    selector: 'component-1'
})

@View({
    templateUrl: './components/moviestore/index.html?v=<%= VERSION %>',
    directives: [RouterLink, NgFor, NgIf]
})

export class Movies //extends Base
{
    private proxyService: ProxyService;
    private movies: Array<Object>;
    private menus: Array<Menu>;

    constructor(proxyService: ProxyService) {  
        //super('movies'); , public router : Router
        this.proxyService = proxyService;
        this.movies = [];
        this.menus = [];

        this.menus.push(new Menu('title', 'A-Z', 'asc'));
        this.menus.push(new Menu('year', 'year', 'desc'));
        this.menus.push(new Menu('rating', 'rating', 'desc'));
        this.menus.push(new Menu('review', 'User Review', 'desc'));
        this.menus.push(new Menu('collection', 'Box Collection', 'desc'));
    }

    getMovies() {
        this.proxyService.getMovies(null, null).then((response) => {
            this.movies = response;
        });

        //this.proxyService.getMovies()
        //    .map(r => r.json())
        //    .subscribe(a => {
        //    this.movies = a;
        //});
    }

    getDetails(event, id: string) {
        window.location.href = '/movies/detail/' + id;
    }

    getByFilters(sortKey: string, sortOrder: string) {  
       
        this.menus.forEach(function (item) {
            if (item.sortKey == sortKey) {
                if (item.order == 'asc') {
                    item.order = 'desc';
                } else {
                    item.order = 'asc';
                }
            }
        })

        this.proxyService.getMovies(sortKey, sortOrder).then((response) => {
            this.movies = response;
        });
    }

    onInit() {
        this.getMovies();
    }

    onChange() {
        this.getMovies();
    }
}