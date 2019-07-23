const crypto = require('crypto');

const Router = require('koa-router');
const Account = require('../models/account');

const router = new Router();

const fs = require('mz/fs');

function toHash(password) {
    const hashPassword = crypto.createHash('sha512').update(password).digest('base64');
    return hashPassword;
}

router.get('/', async (ctx) => {
})

router.post('/join', async (ctx) => {
    const req = ctx.request.body;

    const hashPassword = toHash(req.password);

    const account = new Account({
        profile: {
            username: req.username
        },
        email: req.email,
        password: hashPassword
    });

    try {
        await account.save();
        const userId = account._id;
        const path = `./public/images/account/${userId}`;
        await fs.mkdir(path, {}, (err) => {
            if(err) {
                console.log('e', err);
            }
        });
        const readPath = `./public/images/account/default/thumbnail.png`;
        const writePath = `${path}/thumbnail.png`;
        const readStream = fs.createReadStream(readPath);
        const writeStream = fs.createWriteStream(writePath);
        await readStream.pipe(writeStream);
        
        ctx.response.body = account;
    } catch(e) {
        ctx.throw(e, 500);
    }
})

router.post('/login', async (ctx) => {
    const req = ctx.request.body;
    const {email, password} = req;

    const hashPassword = toHash(password);

    try{
        const result = await Account.find().where('email').equals(email).where('password').equals(hashPassword);

        console.log('login : ', result[0].profile.username);

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

router.post('/thumbnail/upload', async (ctx) => {
    const files = ctx.request.files;
    let userId = null;
    if (Boolean(ctx.request.body.userId)) {
        userId = ctx.request.body.userId;
    }
    
    const writePath = `./public/images/account/${userId}/`;
    const fileName = `thumbnail.png`;

    try {
        const readStream = fs.createReadStream(files.file.path);
        const writeStream = fs.createWriteStream(writePath+fileName);

        readStream.pipe(writeStream);
        ctx.response.body = "success";
    } catch (e) {
        ctx.response.body = "fail";
    }
    
})

router.delete('/thumbnail/:userId', async (ctx) => {
    const userId = ctx.params.userId;
    const readPath = `./public/images/account/default/thumbnail.png`;
    const writePath = `./public/images/account/${userId}/thumbnail.png`;
    try {
        const readStream = fs.createReadStream(readPath);
        const writeStream = fs.createWriteStream(writePath);

        await readStream.pipe(writeStream);

        ctx.response.body = "success";
    } catch (e) {
        ctx.response.body = "fail";
    }
})

router.put('/edit/profile', async (ctx) => {
    const reqBody = ctx.request.body;

    try {
        let account = await Account.findOne({_id: reqBody._id});
        
        if(Boolean(reqBody.username)) {
            account.username = reqBody.username;
        }
        if(Boolean(reqBody.email)) {
            account.email = reqBody.email;
        }
        if(Boolean(reqBody.birth)) {
            account.birth = reqBody.birth;
        }
        if(Boolean(reqBody.gender)) {
            account.gender = reqBody.gender;
        }
        if(Boolean(reqBody.job)) {
            account.job = reqBody.job;
        }
        if(Boolean(reqBody.office)) {
            account.office = reqBody.office;
        }
        if(Boolean(reqBody.school)) {
            account.school = reqBody.school;
        }
        if(Boolean(reqBody.major)) {
            account.major = reqBody.major;
        }
        if(Boolean(reqBody.interest)) {
            account.interest = reqBody.interest;
        }

        const result = await account.save();

        ctx.response.body = result;
    } catch (e) {
        ctx.response.body = e;
    }
})


module.exports = router;