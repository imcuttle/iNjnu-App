var express = require('express');
var jwt = require('jsonwebtoken');
var p = require('path')

var api = express();
var SECRET = require('./protect').SECRET
var getToken = require('./protect').getToken
var verifyToken = require('./protect').verifyToken
var njnu = require('./njnu')
var userdb = require('./database/users')
var dissdb = require('./database/discusses')
var commentdb = require('./database/comments')


function obj(code, result) {
	return {code, result}
}
function getUserAllInfo(id) {
	return userdb.get(id).then(u=>{
		return njnu.getStudentInfo(u.id, u.password)
		.then(info=>{
			delete u.password;
			var i = info.img.lastIndexOf('/')
			info.grade = p.basename(info.img.slice(0, i)).replace(/[\D]/g, '')
			u.img && delete info.img
			return Object.assign(u, info)
		})
	})
}

api.post('/user/login', (req, res, next)=>{
	var stu = {
		id: req.body.id,
		password: req.body.password
	};
	njnu.checkStudent(stu.id, stu.password)
	.then(flag=>{
		if(flag) {
			userdb.check(stu.id).then( f => !f&&userdb.add(stu.id, stu.password) )
			var token = jwt.sign(stu, SECRET, {noTimestamp: true});
			res.json(obj(200, token));
		} else {
			res.json(obj(404, '用户不存在'));
		}
	}).catch(err=>res.json({code: 502, result: err.message}))
})


api.use((req, res, next)=>{
	req.token = getToken(req);
	try {
		req.tokenJson = req.token && verifyToken(req.token)
		console.info('tokenJson', req.tokenJson)
	} catch(ex) {
		res.json({code: 200, result: 'token解析出错'});
		return;
	}
	if(req.token) {
		Promise.all([
			njnu.checkStudent(req.tokenJson.id, req.tokenJson.password),
			userdb.check(req.tokenJson.id)
		]).then(flags => {
			if(flags.some(f=>!f)) {
				res.json({code: 200, result: '错误的token'});
			} else {
				next()
			}
		})
	} else
		res.json({code: 200, result: '不存在token'});
})

api.get('/user/get', (req, res, next) => {
	var id = req.query.id;
	var tokenJson = req.tokenJson

	userdb.get(id).then(en=>{
		if(en) {
			if(id==tokenJson.id)
				res.json({code: 200, result: en});
			else {
				delete en.password
				res.json({code: 200, result: en});
			}
		} else {
			res.json({code: 404, result: '用户不存在'});
		}
	}).catch(err=>res.json({code: 502, result: err.message}))
})

api.post('/discuss/put', (req, res) => {
	var tokenJson = req.tokenJson;
	var sender = tokenJson.id, password = tokenJson.password;
	var ent = req.body;
	var title = ent.title, content = ent.content;
	if(!title || !content || !sender) {
		res.json({code: 400, result: '存在空参数'})
	} else {
		dissdb.add(title, sender, new Date(), content)
		.then(f=>{
			f && res.json({code: 200, result: '发布成功'})
			!f && res.json({code: 404, result: '发布失败'})
		}).catch(err=>res.json({code: 502, result: err.message}))
	}
})

api.get('/discuss/list', (req, res)=> {
	var tokenJson = req.tokenJson;
	var ent = req.query;
	var page = ent.page, size = ent.size, previd = ent.prev
	if(page == null || size == null) {
		res.json({code: 400, result: '存在空参数'})
	} else {
		dissdb.list(page, size, previd)
		.then(list=>{
			Promise.all(list.map(diss=>{
				diss.summary=diss.content.slice(0, 50)
				delete diss.content
				return getUserAllInfo(diss.sender)
					.then(info=>{
						diss.sender = info
						return commentdb.list(diss.id, 1, 1).then(comments=>{
							if(comments && comments[0]) {
								diss.echotime = comments[0].datetime
							}
							return diss
						})
					})
			}))
			.then(disscusses=>res.json({code: 200, result: disscusses.sort((a, b)=>(b.echotime || b.datetime)-(a.echotime || a.datetime))}))
			.catch(err=>res.json({code: 500, result: err.message}))
		})
	}
})

api.post('/discuss/del', (req, res) => {
	var tokenJson = req.tokenJson;
	var sender = tokenJson.id, password = tokenJson.password;
	var ent = req.body;
	var id = ent.id;
	if(!id) {
		res.json({code: 400, result: '存在空参数'})
	} else {
		dissdb.del(id, sender)
			.then(f=>{
				f && res.json({code: 200, result: '删除成功'})
				!f && res.json({code: 404, result: '删除失败'})
			}).catch(err=>res.json({code: 502, result: err.message}))
	}
})

api.get('/discuss/get', (req, res) => {
	var tokenJson = req.tokenJson;
	var ent = req.query;
	var id = ent.id, previd=ent.prev, page=ent.page, size=ent.size, onlycomment=ent.onlycomment;
	if(!id) {
		res.json({code: 400, result: '存在空参数'})
	} else {
		Promise.all([
			!onlycomment
			?dissdb.get(id).then(discuss=>
				discuss ?
				getUserAllInfo(discuss.sender)
				.then(info=>{
					discuss.sender = info
					return discuss
				}): null
			): Promise.resolve(true),
			!!page&&!!size
			? commentdb.list(id, page, size, !!previd ? previd: null).then(list=>
				Promise.all(list.map(ent=>
					getUserAllInfo(ent.user).then(info=>{
						ent.user = info
						return ent
					})
				))
			)
			: Promise.resolve([])
		])
		.then(vals=>{
			let discuss = vals[0], comments = vals[1]
			if(discuss==null) {
				res.json({code: 200, result: '讨论不存在'})
				return;
			}
			commentdb.all(id)
			.then(all=>{
				if(discuss === true) {
					res.json({code: 200, result: {comments, commentNumber: all.length}})
				} else {
					res.json({code: 200, result: {discuss, comments, commentNumber: all.length}})
				}
			})
		})
		.catch(err=>res.json({code: 502, result: err.message}))
	}
})

api.post('/comment/put', (req, res) => {
	var tokenJson = req.tokenJson;
	var sender = tokenJson.id, password = tokenJson.password;
	var ent = req.body;
	var content = ent.content, forid = ent.forid;
	if(!content || !forid || content.trim().length===0) {
		res.json({code: 400, result: '存在空参数'})
	} else {
		commentdb.add(sender, content, forid)
			.then(f=>{
				f && res.json({code: 200, result: '评论成功'})
				!f && res.json({code: 404, result: '评论失败'})
			}).catch(err=>res.json({code: 502, result: err.message}))
	}
})

api.post('/comment/del', (req, res) => {
	var tokenJson = req.tokenJson;
	var sender = tokenJson.id, password = tokenJson.password;
	var ent = req.body;
	var id = ent.id;
	if(!id) {
		res.json({code: 400, result: '存在空参数'})
	} else {
		commentdb.del(id, sender)
			.then(f=>{
				f && res.json({code: 200, result: '删除成功'})
				!f && res.json({code: 404, result: '删除失败'})
			}).catch(err=>res.json({code: 502, result: err.message}))
	}
})


api.get('/lookup/score', (req, res) => {
	var tokenJson = req.tokenJson;
	var sender = tokenJson.id, password = tokenJson.password;
	var ent = req.query;
	var info = !!ent.info;
	njnu.getStudentScores(sender, password)
	.then(data=>{
		if(info) {
			return getUserAllInfo(sender).then(info=>{
				res.json({code: 200, result: {data, info}})
			})
		} else
			res.json({code: 200, result: {data}})
	})
	.catch(err=>res.json({code: 502, result: err.message}))
})

api.get('/info/get', (req, res) => {
	var tokenJson = req.tokenJson;
	var sender = tokenJson.id, password = tokenJson.password;
	var ent = req.query;
	var id = ent.id;
	if(id==null) {
		res.json(obj(400, '存在空参数'))
	} else {
		getUserAllInfo(id).then(info=>
			Promise.all([
				commentdb.getByUser(id),
				dissdb.getByUser(id)
			]).then((vals)=>res.json(obj(200, Object.assign(info, {commentNumber: vals[0].length, discussNumber: vals[1].length}))))
		)
		.catch(err=>res.json(obj(502, err.message)))
	}
})

module.exports = api;