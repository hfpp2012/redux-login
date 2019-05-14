import express from 'express';

let router = express.Router();

const json = {
"list": [
{
"key": 0,
"disabled": true,
"href": "https://ant.design",
"avatar": "https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png",
"name": "标题2222 0",
"title": "一个文章标题 0",
"owner": "随风",
"desc": "描述",
"callNo": 618,
"status": 0,
"updatedAt": "2017-06-30T16:00:00.000Z",
"createdAt": "2017-06-30T16:00:00.000Z",
"progress": 38
},
{
"key": 1,
"disabled": false,
"href": "https://ant.design",
"avatar": "https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png",
"name": "标题111 1",
"title": "一个文章标题 1",
"owner": "随风",
"desc": "描述",
"callNo": 657,
"status": 1,
"updatedAt": "2017-06-30T16:00:00.000Z",
"createdAt": "2017-06-30T16:00:00.000Z",
"progress": 99
},
{
"key": 2,
"disabled": false,
"href": "https://ant.design",
"avatar": "https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png",
"name": "标题111 2",
"title": "一个文章标题 2",
"owner": "随风",
"desc": "描述",
"callNo": 394,
"status": 0,
"updatedAt": "2017-07-01T16:00:00.000Z",
"createdAt": "2017-07-01T16:00:00.000Z",
"progress": 40
},
{
"key": 3,
"disabled": false,
"href": "https://ant.design",
"avatar": "https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png",
"name": "标题111 3",
"title": "一个文章标题 3",
"owner": "随风",
"desc": "描述",
"callNo": 831,
"status": 1,
"updatedAt": "2017-07-01T16:00:00.000Z",
"createdAt": "2017-07-01T16:00:00.000Z",
"progress": 95
}
],
"pagination": {
"total": 4,
"pageSize": 2,
"current": 1
}
}

router.get('/', (req, res) => {
  // 数据库取数据
  res.json(json);
});

export default router;
