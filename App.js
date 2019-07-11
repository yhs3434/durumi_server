require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const mongoose = require('mongoose');
const bodyParser = require('koa-body');
const cors = require('koa2-cors');
const publicDir = require('koa-static');

const app = new Koa();
const router = new Router();

const port = process.env.PORT || 4000;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, {
    //useMongoClient: true
}).then(
    (response) => {
        console.log('Successfully connected to mongodb');
    }
).catch(e => {
    console.error(e);
});

app.use(cors());
app.use(bodyParser({
    multipart: true,
    formLimit: (5 * 1024 * 1024)
}));
app.use(publicDir('./public'));
app.use(publicDir('./public/images'));

const account = require('./route/account');
const team = require('./route/team');

/* Route's modules are contained in here*/
// const api = require('./api');
// router.use('/api', api.routes());

router.use('/account', account.routes());
router.use('/team', team.routes());

/* */


app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
    console.log(`durumi server is listening to port ${port}`);
});