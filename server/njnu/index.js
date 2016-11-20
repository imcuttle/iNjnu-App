const spider = require('../spider')
const URL = "http://njnu.chaiziyi.com.cn/getscores";
const CACHE = {
	checkStudent: {},
	info: {},
	score: {}
}

setInterval(() => {
	Object.getOwnPropertyNames(CACHE)
	.forEach(name=>CACHE[name]={})
}, 1000*60*60*24*7)

module.exports = {
	getToken() {
		return spider.get(URL, {}, 'jq')
			.then($ => $('[name=csrfmiddlewaretoken]').val())
	},
	checkStudent(id, password) {
		if(CACHE.checkStudent[`${id}-${password}`] != null) {
			return new Promise(r=>r(CACHE.checkStudent[`${id}-${password}`]))
		}
		return this._getJq(id, password)
			.then($=>$('.alert.alert-dismissable.alert-success').length!==0)
			.then(f=>{
				CACHE.checkStudent[`${id}-${password}`] = f;
				return f;
			})
	},
	_getJq(id, password) {
		return this.getToken()
			.then(token=>spider.post(URL,
				{username: id, password, csrfmiddlewaretoken: token},
				'jq',
				{
					'Content-Type': 'application/x-www-form-urlencoded',
					'Cookie': 'csrftoken='+token
				}
			))
	},
	getStudentInfo(id, password) {
		if(CACHE.info[`${id}-${password}`] != null) {
			return new Promise(r=>r(CACHE.info[`${id}-${password}`]))
		}
		return this._getJq(id, password)
			.then($ => $('.alert.alert-dismissable.alert-success').length===0 ? null:
					Object.assign(
						{img: $('div.col-md-2.column > img').attr('src')},
						$('body > div > div > div > div:nth-child(5)').text().trim().split(/\s+/).map(val=>val.split('：')[1])
							.reduce((p, n, i)=>{
								var k;
								switch (i) {
									case 0: k = 'department'; break;
									case 1: k = 'classNo'; break;
									case 3: k = 'name'; break;
									default: return p;
								}
								p[k] = n;
								return p
							}, {})
					)
			).then(o=>{
				CACHE.info[`${id}-${password}`] = o
				return o;
			})
	},
	getStudentScores(id, password) {
		if(CACHE.score[`${id}-${password}`] != null) {
			return new Promise(r=>r(CACHE.score[`${id}-${password}`]))
		}
		return this._getJq(id, password)
			.then($ => {
				var obj = {}, terms = new Set()
				$('.table tbody tr').map((i, tr)=>{
					var tds = $(tr).find('td');
					var term = tds.eq(0).text().trim();
					var subject = tds.eq(2).text().trim();
					var fullGrade = tds.eq(3).text().trim();
					var type = tds.eq(4).text().trim();
					var score = tds.eq(7).text().trim();
					var grade = tds.eq(8).text().trim();

					terms.add(term);
					obj[term] = obj[term] || []
					obj[term].push({
						subject, fullGrade, type, score, grade
					})
				})
				return $('.alert.alert-dismissable.alert-success').length===0 ? null: {map: obj, terms: Array.from(terms)}
			}).then(o=>{
				CACHE.score[`${id}-${password}`] = o
				return o
			})
	}
}