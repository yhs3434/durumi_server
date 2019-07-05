const Router = require('koa-router');
const Account = require('../models/account');

const router = new Router();

router.get('/', async (ctx) => {
})

router.post('/join', async (ctx) => {
    const req = ctx.request.body;

    const account = new Account({
        profile: {
            username: req.username
        },
        email: req.email,
        password: req.password
    });

    try {
        await account.save();
        ctx.response.body = account;
    } catch(e) {
        ctx.throw(e, 500);
    }
})

router.post('/login', async (ctx) => {
    const req = ctx.request.body;
    const {email, password} = req;

    try{
        const result = await Account.find().where('email').equals(email).where('password').equals(password);
        const result_js = JSON.parse(JSON.stringify(result));
        console.log('login : ', result[0].profile);

        if(result.length===0) {
        }
        ctx.response.body = result;
    } catch(e) {
        console.log('error', e);
    }
    
})

router.get('/login', async (ctx) => {
    ctx.response.body = 'hello ㅎㅎㅎ';
})

module.exports = router;