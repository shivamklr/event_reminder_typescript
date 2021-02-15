import {Router}from 'express';
const route = Router();


// GET /user
route.get('/', (req, res)=>{
    res.send('GET req at route /user')
})

export const userRoute = route;