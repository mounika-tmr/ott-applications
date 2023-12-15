

import { Router, Request, Response, NextFunction } from 'express';
import { Movie, User } from './models';
import NodeCache = require('node-cache');

const cache = new NodeCache({stdTTL: 300});//Set a TTl time to live for cache entries in seconds
const router = Router();

//Add a New User
router.post('/user', async (req: Request, res: Response) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.json(newUser);
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
});

//Check isAdmin Or Not
const isAdmin = async (req:Request, res: Response,next:NextFunction) => {
  const userEmail = req.query?.email; console.log(req.query);
  if(userEmail) {
    const user:any = await User.findOne({email:userEmail});console.log("user data ",user)
    if(user && user.role === 'Admin') {
      next();
    } else {
        res.status(403).json({error: 'Permission Denied!! Required Admin Role for this Action'});
    }
  } else {
    res.status(403).json({error: 'Email Address Is Mandatory To Create/Edit Movie Lobby'});
}
};

//List of Movies 
router.get('/movies', async (req: Request, res: Response) => {
    try {
        const cachedMovies = cache.get('movies'); 
        if(cachedMovies) {
            console.log(" response from cache movies ",cachedMovies )
          return  res.json(cachedMovies);
        }
        const movies = await Movie.find();
        cache.set('movies',movies);
        console.log(" response from DB movies ",cachedMovies )
        res.json(movies);
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
})

//List of Movies And Also Search either by title OR Genre
router.get('/search', async (req: Request, res: Response) => {
    try {
        let whereQuery = {};
        let { q } = req.query;
        const cacheKey = `search_${q}`;
        const cachedMovies = cache.get(cacheKey); 
        if(cachedMovies) {
            console.log(" response from cache movies ",cachedMovies )
          return  res.json(cachedMovies);
        }

        if (q) {
            whereQuery = {
                $or: [
                    { title: { $regex: new RegExp(`${q}`, 'i') } },
                    { genre: { $regex: new RegExp(`${q}`, 'i') } },
                ]
            }
        }

        const movies = await Movie.find(whereQuery);
        cache.set(cacheKey,movies);
        res.json(movies);
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
})

//Add a New Movie with Admin Role Validation
router.post('/movies',isAdmin, async (req: Request, res: Response) => {
    try {
        const newMovie = new Movie(req.body);
        await newMovie.save();
        res.json(newMovie);
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
});

//Update a Movie from the Lobby with Admin Role
router.put('/movies/:id', isAdmin ,async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const updatedMovie = await Movie.findByIdAndUpdate(
            id, req.body, { new: true } //Returns the Updated Movie
        );
        if(!updatedMovie) {
            res.status(404).json({error: "Movie Not Found"});
        }
        res.json(updatedMovie);
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
});

//Delete a movie from the lobby with Admin Role
router.delete('/movies/:id', isAdmin, async(req:Request, res: Response) => {
    try {
        const {id} = req.params;
        const deletedMovie = await Movie.findByIdAndDelete(id);
        if(!deletedMovie) {
            res.status(404).json({error: "Movie Not Found"});
        }
        res.json({"message":"Movie Deleted Successfully!!"});
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
})

export default router;