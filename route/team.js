const Router = require('koa-router');

const Team = require('../models/team');
const Account = require('../models/account');
const Chat = require('../models/chat');

const router = new Router();

const fs = require('mz/fs');

router.get('/', (ctx) => {
    ctx.response.body = {'status': 200};
})

router.get('/all', async (ctx) => {
    const teamList = await Team.find().sort({createdAt: -1});
    ctx.response.body = teamList;
})

router.post('/create', async (ctx) => {
    const req = ctx.request.body;
    
    let newTeam = {};
    newTeam.profile = {};
    newTeam.profile.name = req.profile.name;
    newTeam.profile.description = req.profile.description;
    newTeam.profile.thumbnail = req.profile.thumbnail||"/images/teamDefault.jpg";
    newTeam.member = req.member;    //array
    newTeam.hashTag = req.hashTag;  //array

    const createdTeam = new Team(newTeam);

    try {
        const result = await createdTeam.save();
        
        const newTeamId = createdTeam._id;
        const path = `./public/images/team/${newTeamId}`;
        await fs.mkdir(path, {}, (err) => {
            if(err) {
                console.log('team -> create', err);
            }
        })
        await new Chat({teamId: newTeamId}).save();
        
        const readPath = `./public/images/team/default/thumbnail.png`;
        const writePath = `./public/images/team/${newTeamId}/thumbnail.png`;
        const readStream = fs.createReadStream(readPath);
        const writeStream = fs.createWriteStream(writePath);

        await readStream.pipe(writeStream);
        ctx.response.body = createdTeam;
    } catch(e) {
        ctx.response.body = e;
    }
})

router.get('/:id', async (ctx) => {
    try {
        const list = await Team.findOne({_id: ctx.params.id});
        ctx.response.body = list;
    } catch (e) {
        ctx.response.body = e;
    }
})

router.get('/my/:userId', async (ctx) => {
    try {
        const userId = ctx.params.userId;
        const myTeamList = await Team.find({member: {$all: [userId]}});
        ctx.response.body = myTeamList;
    } catch(e) {
        ctx.response.body = e;
    }
})

router.post('/join', async (ctx) => {
    const req = ctx.request.body;
    const userId = req.userId;
    const teamId = req.teamId;

    try{
        const query_team = {_id: teamId};
        let team = await Team.findOne(query_team);
        const query_user = {_id: userId};
        let user = await Account.findOne(query_user);
        if(user!==null) {
            team.member=[...team.member, user._id];
            await team.save();
            ctx.response.body = team;
        } else {
            ctx.response.body = team;
        }
    } catch(e) {
        ctx.response.body = e;
    }
 
})

router.get('/album/:teamId', async (ctx) => {
    const teamId = ctx.params.teamId;
    const dirPath = `./public/images/team/${teamId}`;
    let dirContents = [];
    try {
        dirContents = await fs.readdir(dirPath);
    } catch(e) {
        console.log('e', e);
    }
    ctx.response.body = dirContents;
})

router.post('/album/upload', async (ctx) => {
    const files = ctx.request.files;
    const {teamId, userId} = ctx.request.body;

    const writePath = `./public/images/team/${teamId}/`;
    const fileName = `${userId}_${files.file.name}`;

    const readStream = fs.createReadStream(files.file.path);
    const writeStream = fs.createWriteStream(writePath+fileName);

    readStream.pipe(writeStream);

    ctx.response.body = 'success';
})

router.get('/chat/:teamId', async (ctx) => {
    const teamId = ctx.params.teamId;

    let chats = await Chat.findOne({teamId: teamId});
    console.log(chats);
    ctx.response.body = chats;
})

router.post('/chat/:teamId', async (ctx) => {
    const teamId = ctx.params.teamId;
    const { userId, message } = ctx.request.body;

    let messageData = {
        userId: userId,
        message: message
    }

    let result = undefined;
    try {
        let chatData = await Chat.findOne({teamId: teamId});
        chatData.message.push(messageData);
        result = await chatData.save();
    } catch(e) {
        console.log('e', e);
    }
    ctx.response.body = result;
})

router.get('/member/:id', async (ctx) => {
    try {
        const team = await Team.findOne({_id: ctx.params.id});
        const memberIdList = team.member;
        let memberList = [];
        let promise = [];
        memberIdList.map((item, idx) => {
            let memberPromise = new Promise((resolve, reject) => {
                Account.findOne({_id: item}).then((result) => {
                    memberList.push(result);
                    resolve('done');
                })
            })
            promise.push(memberPromise);
        })
        
        await Promise.all(promise).then((result) =>{
            console.log(result);
        })

        ctx.response.body = memberList;
    } catch (e) {
        ctx.response.body = [];
    }
})

router.post('/board', async (ctx) => {
    let reqBody = ctx.request.body;

    
})

module.exports = router;