/// <reference path='../../typings/tsd.d.ts' />

import {Db, Collection} from 'mongodb';
import logger = require('winston');
import {BaseRepository} from '../repository/base';

export module Repository {  

    export interface IMovieRepository {
        create();
        read();
        update(id: string);
        delete(id: string);
    }

    export class MovieRepository extends BaseRepository //implements IMovieRepository
    {
        db: Db;
        constructor(database: Db) {
            super(database);
        }
    } 
}
