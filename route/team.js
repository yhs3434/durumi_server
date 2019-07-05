const Router = require('koa-router');
const Team = require('../models/team');

const router = new Router();

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
        await createdTeam.save();
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

module.exports = router;