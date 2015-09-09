/// <reference path='../../typings/tsd.d.ts' />

import {Express, Request, Response} from "express";
import logger = require('winston');
import {Db} from 'mongodb';
import {Repository} from '../repository/movie';
import {Services} from '../services/movie';

var self;

export class InitialData
{
    service: Services.MovieService;
    sampleData: Array<Object>;
    db: Db;


    constructor(db: Db)
    {
        self = this;
        var repository = new Repository.MovieRepository(db)
        this.service = new Services.MovieService(repository);
    }

    verifyData()
    {
        logger.log('debug', 'verifying movies from database..');
        var sampleData = this.getSampleData();

        this.service.getAll(null,null,function (err, items)
        { 
            if (items && (items.length > 0))
            {
                logger.log('debug', 'Initial data - Movies OK');
            } else
            {
                
                self.service.initData(sampleData, function (err, result)
                {
                    if (!err)
                    {
                        logger.log('debug', 'Initial data - Movies Inserting..');
                    } else
                    {
                        logger.log('debug', err.toString());
                    }
                });
            }
        });
    }

    getSampleData(): Array<Object>
    {
        return [{ id: 1, "title": "Avtar", "description": "Awesome Movie", genre: "Horror", "rating": 5, "year": "12/2/2005", "collection": '100', reviews: [{ "title": 'Good Movie', "Description": "Must watch movie" }], "language": "English" },
            { id: 2, "title": "Hello", "description": "Good movie", genre: "Horror", "rating": 4, "year": "12/2/2015", "collection": '200', reviews: [{ "title": 'Good Movie', "Description": "Must watch movie" }], "language": "English" },
            { id: 3, "title": "Inception", "description": "Good movie", genre: "Action", "rating": 2, "year": "12/2/2006", "collection": '300', reviews: [{ "title": 'Good Movie', "Description": "Must watch movie" }], "language": "English" },
            { id: 4, "title": "Matrix", "description": "Nice movie", genre: "SI-FI", "rating": 4, "year": "12/2/2006", "collection": '400', reviews: [{ "title": 'Good Movie', "Description": "Must watch movie" }], "language": "English" },
            { id: 5,"title": "Titanic", "description": "Avg movie", genre: "Romance", "rating": 3, "year": "12/2/2007", "collection": '500', reviews: [{ "title": 'Good Movie', "Description": "Must watch movie" }], "language": "English" },
            { id: 6, "title": "X-man", "description": "Great movie", genre: "Horror", "rating": 5, "year": "12/2/2002", "collection": '200', reviews: [{ "title": 'Good Movie', "Description": "Must watch movie" }], "language": "English" },
            { id: 7, "title": "Rambo", "description": "Bad Movie", genre: "Horror", "rating": 2, "year": "12/2/2008", "collection": '100', reviews: [{ "title": 'Good Movie', "Description": "Must watch movie" }], "language": "English" },
            { id: 8, "title": "Gladiator", "description": "Good movie", genre: "Horror", "rating": 4, "year": "12/2/2002", "collection": '100', reviews: [{ "title": 'Good Movie', "Description": "Must watch movie" }], "language": "English" },
            { id:9,"title": "Last Stand", "description": "Good movie", genre: "Horror", "rating": 5, "year": "12/2/2001", "collection": '300', reviews: [{ "title": 'Good Movie', "Description": "Must watch movie" }], "language": "English" },
            { id: 10, "title": "Ring", "description": "Good movie", genre: "Horror", "rating": 3, "year": "12/2/2003", "collection": '140', reviews: [{ "title": 'Good Movie', "Description": "Must watch movie" }], "language": "English" },
            { id: 11, "title": "Insidious", "description": "Good movie", genre: "Horror", "rating": 4, "year": "12/2/2004", "collection": '170', reviews: [{ "title": 'Good Movie', "Description": "Must watch movie" }], "language": "English" },
            { id: 12,"title": "Baby", "description": "Good movie", genre: "Horror", "rating": 4, "year": "12/2/2005", "collection": '180', reviews: [{ "title": 'Good Movie', "Description": "Must watch movie" }], "language": "English" },
            { id: 13, "title": "Spider man", "description": "Nice action movies", genre: "Action", "rating": 4, "year": "12/2/2010", "collection": '200', reviews: [{ "title": 'Good Movie', "Description": "Must watch movie" }], "language": "English" },
            { id: 14,"title": "Gone Girl", "description": "Good movie", genre: "Horror", "rating": 1, "year": "12/2/2009", "collection": '250', reviews: [{ "title": 'Good Movie', "Description": "Must watch movie" }], "language": "English" },
            { id: 15, "title": "The game", "description": "Good movie", genre: "Horror", "rating": 2, "year": "12/2/2008", "collection": '130', reviews: [{ "title": 'Good Movie', "Description": "Must watch movie" }], "language": "English" },
            { id: 16,"title": "Lost world", "description": "Good movie", genre: "Adventure", "rating": 4, "year": "12/2/2007", "collection": '300', reviews: [{ "title": 'Good Movie', "Description": "Must watch movie" }], "language": "English" },
            { id: 17, "title": "The Taken", "description": "Good movie", genre: "Crime", "rating": 5, "year": "12/2/2015", "collection": '450', reviews: [{ "title": 'Good Movie', "Description": "Must watch movie" }], "language": "English" },
            { id: 18, "title": "Fast Furious", "description": "Good movie", genre: "Action", "rating": 4, "year": "12/2/2012", "collection": '100', reviews: [{ "title": 'Good Movie', "Description": "Must watch movie" }], "language": "English" }
        ];
    }

} 