import React from 'react'
import {
	Text,
	View,
	ListView,
	Dimensions,
	Clipboard,
	TouchableHighlight
} from 'react-native'

import {Map} from 'immutable'
import NavigationBar from 'react-native-navbar';
import LoadingView from '../components/LoadingView'
import BaseInfo from '../components/BaseInfo'
import RightTopMenu from '../components/RightTopMenu'



import utils from '../utils'

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.computeTextString = this.computeTextString.bind(this)
	}
	state = {
		refreshing: true,
		data: [],
		info: {},
	}
	componentWillUnmount() {
	}
	componentDidMount() {
		this.setState({refreshing: true})
		
		utils.fetchLookupScore(true)
		.then(data=>{
			var main=data.data
			Object.keys(main.map).forEach(x=>{
				main.map[x] = main.map[x].map(r=>{
					r.subject=r.subject.replace(/^\[\w+\]/, '')
					return r
				})
			})
			this.setState({refreshing: false, ...data})
		})
		
	}
	mapData(data) {
		return {

		}
	}
	renderRow(rowData, textStyle={}, selectable=true) {
		return (
			<View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
				<Text selectable={selectable} style={[{textAlign: 'left', width: Dimensions.get('window').width*.65}, textStyle]}>{rowData.subject}</Text>
				<Text selectable={selectable} style={[{textAlign: 'center', }, textStyle]}>{rowData.fullGrade}</Text>
				<Text selectable={selectable} style={[{textAlign: 'center', }, textStyle]}>{rowData.grade}</Text>
				<Text selectable={selectable} style={[{textAlign: 'center'}, 
					rowData.score<=60?{color: 'red'}:{},
					rowData.score>60&&rowData.score<=80?{color: 'orange'}:{},
					rowData.score>=90?{color: 'green'}:{},
					textStyle
				]}>{rowData.score}</Text>
			</View>
		)
	}
	render() {
		const {navigator} = this.props
		const {refreshing, data, info} = this.state
		return (
			<View style={{flex: 1, backgroundColor: '#F8F8FF'}}>
		        <NavigationBar
		          title={{title: '查成绩', tintColor: 'red', style: {fontSize: 20}}}
		          statusBar={{hidden: false}}
		          style={{height: 45, flex: null}}
		          leftButton={{
		            title: '返回',
		            handler: () => {
		              navigator.pop()
		            }
		          }}
		        />
		        {
		        	refreshing ? <LoadingView />
		        	:<View style={{flex: 1}}>
			        	<View style={{position: 'absolute', flex: 1,top: 0, left: 6, right: 6, zIndex: 2, 
			        		backgroundColor: '#F8F8FF', borderBottomWidth: .5, borderColor: '#bbb'
			        	}}>
		        		</View>
				        <ListView 
				        	enableEmptySections={true}
				        	initialListSize={20}
				        	keyboardDismissMode="on-drag"
				        	showsVerticalScrollIndicator={true}
				        	renderHeader={()=><View style={{marginTop: 20, flex: 1}}><BaseInfo {...info}/></View>}
		        			removeClippedSubviews={true}
				        	dataSource={new ListView.DataSource({
				        		rowHasChanged: (r1, r2)=>!Map(r1).equals(Map(r2)),
				        		sectionHeaderHasChanged: (s1, s2)=> s1!==s2,
				        		getRowData: (dataBlob, sectionID, rowID) => dataBlob[sectionID][rowID],
				        		getSectionHeaderData: (dataBlob, sectionID)=> data.terms[sectionID]
				        	}).cloneWithRowsAndSections(data.terms.map(i=>data.map[i]))}
				        	renderRow={(rowData, sectionID, rowID)=>
				        		this.renderRow(rowData)
				        	}
				        	renderFooter={()=><View style={{height: 10}}/>}
				        	renderSectionHeader={(sectionData, sectionID)=>
				        		<View style={{marginTop: 20, marginBottom: 8}}>
					        		<Text selectable={true} style={{textAlign: 'center', color: 'black', fontSize: 17}}>{sectionData}</Text>
				        		</View>
				        	}
				        />
			        </View>
				}
				{
					showMenu && <RightTopMenu items={[
						{label: '复制', onPress: ()=>{
					        Clipboard.setString(this.computeTextString());
					        this.setState({showMenu: false})
					        utils.toast('复制成功，快去分享吧！')
						}}
					]}/>
		        	
		        }
	        </View>
		)
	}

	computeTextString() {
		const {info, data} = this.state
		var str = 
			`学科\t学分\t所得学分\t成绩\r\n`
			+ data.terms.map(t=>{
				var d = data.map[t]
				return `\t${t}\r\n${d.map(row=>`${row.subject}\t${row.grade}\t${row.fullGrade}\t${row.score}`).join('\r\n')}`
			}).join('\r\n\r\n')

		return `来自iNjnu\r\n\t姓名：${info.name}\t${info.department}\r\n\t学号：${info.id}\t班级：${info.classNo}\r\n\r\n`
			+ str
	}

	shouldComponentUpdate(nextProps, nextState) {
		return !Map(this.state).equals(Map(nextState))
	}
}



