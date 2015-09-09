/// <reference path='../../typings/tsd.d.ts' />

import {MovieModel} from '../models/movie';
import {Repository} from '../repository/movie';
import logger = require('winston');

export module Services
{

    export interface IMovieService
    {
        create();
        getMovies();
        getMovieDetails(id: string);
        update(id: string);
        delete(id: string)
    }

    export class MovieService //implements IMovieService
    {
        repository: Repository.MovieRepository;

        public constructor(repository: Repository.MovieRepository)
        {
            this.repository = repository;
        }

        public initData(sampleData: Array<Object>, callback: (errr: Error, item: any) => any)
        {
            this.bulk(sampleData, callback);
        }

        public create(data: Object, callback: (errr: Error, item: any) => any)
        {
            this.repository.create(data, callback);
        }

        public bulk(data: Array<Object>, callback: (errr: Error, item: any) => any)
        {
            this.repository.bulk(data, callback);
        }

        public getAll(sortKey: string, sortOrder: string, callback: (errr: Error, item: any) => any)
        {
            this.repository.readMany({}, sortKey, sortOrder, callback);
        }

        public getByQuery(query: Object, sortKey: string, sortOrder: string, callback: (errr: Error, item: any) => any)
        {
            this.repository.readMany(query, sortKey, sortOrder, callback);
        }

        public getById(id: number, callback: (errr: Error, item: any) => any)
        {            
            this.repository.get(id, callback);
        }

        public update(id: string)
        {
            return this.repository.update(id);
        }

        public delete(id: string)
        {
            return this.repository.delete(id);
        }
    }
}


 