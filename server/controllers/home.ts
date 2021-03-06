﻿/// <reference path='../../typings/tsd.d.ts' />

import {Express, Request, Response} from "express";
import {Services} from 'services/movie';

var self;

export class HomeController
{
    service: Services.MovieService;

    public constructor(service:Services.MovieService)
    {
        self = this;
        this.service = service;
    }

    public getTopMovies(req: Request, res: Response)
    {
        var query = { review: { $gt: 4,  } }

        self.service.getByQuery(query, null, null, function (err, item) {
            return res.json(item);
        });
    }
}  