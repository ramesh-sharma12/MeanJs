/// <reference path='../../typings/tsd.d.ts' />

import {Db, Collection} from 'mongodb';
import logger = require('winston');

export class BaseRepository //implements IMovieRepository
{
    db: Db;
    moviesCollection: Collection;

    constructor(database: Db) {
        this.db = database;
    }

    public get(id: number, callback: (err: Error, item: any) => any) {

        this.db.open(function (err, db) {

            if (err) callback(err, {});

            var moviesCollection = db.collection("movies");

            moviesCollection.findOne({ "id" : +id }, function (err, item) {
                logger.log('debug', 'reading get data..with id..' + id);
                callback(err, item);
            });

        });
    }

    public read(query: Object, callback: (err: Error, item: any) => any) {

        this.db.open(function (err, db) {

            if (err) callback(err, {});

            var moviesCollection = db.collection("movies");

            moviesCollection.findOne(query, function (err, item) {
                logger.log('debug', 'reading single data..with query');
                callback(err, item);
            });

        });
    }

    public readMany(query: Object, sortKey: string, sortOrder: string, callback: (err: Error, item: any) => any) {

        this.db.open(function (err, db) {


            if (err) {
                callback(err, []);
            }

            var moviesCollection = db.collection("movies");

            var options;

            if (sortKey && sortOrder) {
                logger.log('debug', 'reading many data..with query and sortkey, sortorder');
                options = {
                    // "limit": 20,
                    // "skip": 10,
                    "sort": [sortKey, sortOrder]
                };

                moviesCollection.find(query, options).toArray(function (err, results) {
                    callback(err, results);
                });
            } else if (sortKey) {
                logger.log('debug', 'reading many data..with query and sortkey');
                options = {
                    //  "limit": 20,
                    //  "skip": 10,
                    "sort": sortKey
                };
                moviesCollection.find(query, options).toArray(callback);
            } else {
                logger.log('debug', 'reading many data..with query');
                moviesCollection.find(query).toArray(callback);
            }
        });
    }

    public create(data: Object, callback: (errr: Error, item: any) => any) {
        logger.log('debug', 'called create data..');

        if (data) {
            this.db.open(function (err, db) {
                if (err) callback(err, null);

                var moviesCollection = db.collection("movies");


                moviesCollection.insert(data, function (err, res) {
                    logger.log('debug', 'inserting data..');

                    callback(err, res);
                });
            });

        } else {

            callback(new Error('Empty'), null);
        }
    }
    public bulk(data: Array<Object>, callback: (errr: Error, item: any) => any) {
        logger.log('debug', 'called bulk data..');

        if (data) {
            this.db.open(function (err, db) {
                if (err) callback(err, null);

                var moviesCollection = db.collection("movies");

                moviesCollection.insert(data, function (err, res) {
                    logger.log('debug', 'inserting bulk data..');

                    callback(err, res);
                });
            });
        } else {
            callback(new Error("Empty data.."), null);
        }
    }

    public update(id: string) {
        this.db.open(function (err, db) {


        });

    }

    public delete(id: string) {
        this.db.open(function (err, db) {

        });
    }
}  