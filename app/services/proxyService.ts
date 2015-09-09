/// <reference path='../../typings/tsd.d.ts' />

import {Http, Injectable, Request, Inject} from 'angular2/angular2';

export interface IProxyService {
    getMovieById(id: string);
    getMovies(sortKey: string, sortOrder: string);
}

@Injectable()
export class ProxyService implements IProxyService {

    private http: Http;

    public constructor(http: Http) {
        this.http = http;
    }

    public getMovieById(id: string) : Promise<Object> {
        var httpService = this.http;
        return new Promise<Object>(function (resolve, reject) {
            httpService.get('http://localhost:3000/api/movies/get/' + id).toRx().subscribe(res => resolve(res.json()));
        });
    }

    public getMovies(sortKey: string, sortOrder: string): Promise<Array<Object>> {
        var httpService = this.http;

        if (sortKey && sortOrder) {
            return new Promise<Array<Object>>(function (resolve, reject) {
                httpService.request('http://localhost:3000/api/movies/getall?sortKey=' + sortKey + '&sortOrder=' + sortOrder).toRx().subscribe(res => resolve(res.json()));
            });
        } else {
            return new Promise<Array<Object>>(function (resolve, reject) {
                httpService.request('http://localhost:3000/api/movies/getall').toRx().subscribe(res => resolve(res.json()));
            });
        }

       
    }

    public getTopMovies(): Promise<Array<Object>> {
        var httpService = this.http;

        return new Promise<Array<Object>>(function (resolve, reject) {
            httpService.request('http://localhost:3000/api/movies/gettop').toRx().subscribe(res => resolve(res.json()));
        });
    }
}

