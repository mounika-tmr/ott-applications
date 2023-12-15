import  * as request  from "supertest";
import app from '../src/index';
import { Movie  } from "../src/models";

describe('Movie Routes', () => {
    let movieId: string;
    beforeAll(async() => {
        //Create a Sample movie for testing
        const sampleMovie = new Movie({
            "title":"Test Movie",
            "genre":"Action",
            "rating":4,
            "streamingLink":"www.testlink.com"
        });
        const savedMovie = await sampleMovie.save();
        movieId = savedMovie._id.toString();
    });

    afterAll(async () => {
        //Clean up created test movie after all tests done
        await Movie.findByIdAndDelete(movieId);
    });

    it('GET /movies should return a list of movies', async () => {
        const response  = await request(app).get('/movies');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('GET /search?q=Action should return a list of movies matching the genre or title', async () => {
        const response  = await request(app).get('/search?q=Action');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('POST /movies  should add a new  movie (require admin role)', async () => {
        const response  = await request(app)
        .post('/movies')
        .send({
            "title":"new Movie",
            "genre":"Action thriller",
            "rating":4,
            "streamingLink":"www.testlink.com"
        })
        expect(response.status).toBe(403); //Because required Admin Role
    });

    it('PUT /movies/:id  should update a movie (require admin role)', async () => {
        const response  = await request(app)
        .put('/movies/{movieId}')
        .send({
            "title":"updated Movie",
            "genre":"Drama",
            "rating":2,
            "streamingLink":"www.updatedlink.com"
        })
        expect(response.status).toBe(403); //Because required Admin Role
    });

    it('DELETE /movies/:id  should update a movie (require admin role)', async () => {
        const response  = await request(app).delete('/movies/{movieId}')
        expect(response.status).toBe(403); //Because required Admin Role
    });
})