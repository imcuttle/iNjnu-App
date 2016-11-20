import React from 'react'
import {
	View,
	Text,
	TouchableHighlight,
	StyleSheet,
	TextInput,
	ScrollView,
	RefreshControl,
	ListView,
	Picker
} from 'react-native'
import moment from 'moment'

import NavigationBar from 'react-native-navbar';
import Popup from 'react-native-popup';

import {Map, List} from 'immutable'
import DiscussMain from '../components/DiscussMain'
import LoadingView from '../components/LoadingView'
import Comment from '../components/Comment'

import utils from '../utils'


export default class extends React.Component {
	static defaultProps={
		refreshing: false,
		hasmore: true,
		loadmore: false,
		focusRefresh: false,
		comments: [],
		discuss: null,
		commentEnable: true,
		commentVal: '',
		commentNumber: 0
	}
	state={
		size: 8,
	}
	delList=[]
	constructor(props) {
		super(props);
		this._addList = this._addList.bind(this)
		this._onRefresh = this._onRefresh.bind(this)
		this.mapDiscuss = this.mapDiscuss.bind(this)
		this.mapComment = this.mapComment.bind(this)
	}
	_addList(onlycomment) {
		const {navigator, setProps, route, refreshing, hasmore, loadmore, comments, discuss} = this.props
		const {id} = this.props.route.params
		const {size} = this.state

		if(!hasmore) {
			return;
		}
		if(comments.length%size!==0) {
	      setProps({hasmore: false})
	      return;
	    }
		setProps({
			loadmore: true,
			refreshing: false
		})
		utils.fetchDiscussMain(id, (comments.length/size)+1, size, comments.length>0?comments[comments.length-1].id:null, onlycomment)
		.then(ent=>{
			ent.comments=ent.comments || []
			var commentList = comments.concat(ent.comments)
			if(ent.comments.length===0) {
				delete ent.comments
				setProps({
					...ent,
					comments: commentList,
					refreshing: false,
					loadmore: false,
					hasmore: false
				})	
			} else {
				delete ent.comments
				setProps({
					...ent,
					comments: commentList,
					refreshing: false,
					loadmore: false
				})
			}
		})
	}
	componentDidMount() {
		const {navigator, setProps, route, refreshing, hasmore, loadmore, comments} = this.props
		if(hasmore&&comments.length===0) {
			this._addList()
		}

		
	}
	componentDidUpdate(prevProps, prevState) {
		const {setProps, focusRefresh} = this.props;
	    // if(focusRefresh) {
	    //   this._onRefresh();
	    // }
	}
	

	_onRefresh() {
	    const {setProps, hasmore, ds, comments} = this.props;
	    const {id} = this.props.route.params
	    const {size} = this.state;
	    const len = size*2

	    setProps({refreshing: true, loadmore: false, focusRefresh: false})
	    utils.fetchDiscussMain(id, 1, len)
	    .then(ent=>{
			setProps({
				...ent,
				refreshing: false,
				loadmore: false
			})
		})
	  }

	render() {
		const {
			navigator, setProps, route, refreshing, hasmore, commentNumber, 
			commentEnable, loadmore, comments, discuss, commentVal, id
		} = this.props
		const {size} = this.state
		bgcolor = commentEnable?'rgb(14, 167, 221)':'rgb(125, 125, 125)'
		return (
			<View style={{flex: 1, backgroundColor: '#F8F8FF',}}>
				<NavigationBar 
				  title={{title: route.title, tintColor: 'red', style: {fontSize: 20}}}
		          statusBar={{hidden: false}}
		          style={{height: 45, flex: null}}
		          leftButton={{
		          	title: '返回',
		          	handler: () => {
		          		navigator.pop()
		          	}
		          }}
				/>
				
				<View style={{marginBottom: 45, flex: 1, alignItems: 'stretch'}}>
					<ListView 
						style={styles.container}
						renderHeader={()=>{
							return (
								<View style={{paddingTop: 20}}>
								{
									!discuss 
									? <LoadingView size="small" />
									: <DiscussMain {...this.mapDiscuss(discuss)}/>
								}
								{
									!!comments && comments.length>0 &&
									<Text style={{margin: 10}}>评论列表</Text>
								}
								</View>
							)
						}}
						refreshControl={
				          <RefreshControl 
				            refreshing={refreshing}
				            onRefresh={this._onRefresh}
				            titleColor="#00ff00"
				            colors={['#ff0000', '#00ff00', '#0000ff']}
				            progressBackgroundColor="#ffffff"
				          />
				        }
				        initialListSize={size}
				        pageSize={size}
						enableEmptySections={true}
						dataSource={new ListView.DataSource({rowHasChanged: (r1, r2) => !Map(r1).equals(r2)}).cloneWithRows(comments)}
						renderRow={(comment, sid, rid)=>
							<Comment key={comment.id} 
								{...this.mapComment(comment)} 
								onDelPress={comment.user.id==discuss.sender.id?()=>{
									this.popup.confirm({
							            title: '确定删除该评论？',
							            ok: {
							                text: '确定',
							                style: {
							                    color: 'green'
							                },
							                callback: () => {
							                	var i = this.delList.findIndex(x=>x===comment.id)
							                	if(i>=0) {
							                		utils.toast(':) 正在处理中...')
							                		return;
							                	}
							                	this.delList.push(comment.id)
						                    	
					                    		utils.fetchDelComment(comment.id)
							                    .then(f=>{
							                    	if(f) {
							                    		var i = this.delList.findIndex(x=>x.id===comment.id)
							                    		if(i>=0) {
								                    		this.delList = List(this.state.delList).remove(i).toArray()
								                    	}
							                    		var newComments = List(comments).remove(rid).toArray()
							                    		setProps({
							                    			comments: newComments,
							                    			commentNumber: commentNumber-1
							                    		})
							                    	}
							                    })
							                    
							                },
							            },
							            cancel: {
							                text: '取消',
							                style: {
							                    color: 'red'
							                },
							                callback: () => {
							                    
							                },
							            },
							        });
								}:null}
							/>
						}
						showsVerticalScrollIndicator={true}
						onEndReachedThreshold={100}
						onEndReached={()=>{
							console.log('endreadced')
				          if(comments.length>=size && !hasmore) {
				            utils.toast('已经没数据啦！')
				          }
				          comments.length!==0 && !loadmore && this._addList(true);
				        }}
				        renderFooter={()=>{
				          if(!hasmore)
				            return null
				          //<Text style={{alignSelf: 'center', fontSize: 17, height: 30, marginVertical: 10, color: 'black'}}>:(  已经没数据啦！</Text>
				          if(loadmore)
				            return <LoadingView size="small" color="#ff0000" />
				        }}
				        enableEmptySections={true}
					/>
				</View>
				{
					discuss && <View style={styles.inputContainer}>
							<TextInput style={styles.textInput}
								ref="input"
								autoCorrect={false} multiline={true}
								placeholder="评论一下吧"
								numberOfLines={10}
								maxLength={300}
								onChangeText={(text)=>setProps({commentVal: text})}
								value={commentVal}
								editable={commentEnable}
								underlineColorAndroid="transparent"
							/>
							
							<TouchableHighlight
								style={{width: 60, height: 36,
									borderTopRightRadius: 8, borderBottomRightRadius: 8,
									justifyContent:'center', 
									borderWidth: 0, padding: 6, backgroundColor: bgcolor}}
								activeOpacity={0.7}
								onPress={()=>{
									if(!commentEnable) {
										return
									}
									if(!commentVal || commentVal.trim().length===0) {
										utils.toast('评论内容不能空哦')	
										return;
									}
									setProps({commentEnable: false})
									utils.fetchCommentPut(commentVal, discuss.id)
									.then(f=>{
										if(f) {
											setProps({commentVal: '', commentEnable: true})
											this._onRefresh();
										}
									})
								}}
								underlayColor={commentEnable?"rgba(14, 167, 221, .7)":bgcolor}
							>
								<Text style={{fontSize: 16, color: 'white',textAlign: 'center'}}>评论</Text>
							</TouchableHighlight>
						</View>
				}
				<Popup ref={popup => this.popup = popup } isOverlayClickClose={false}/>
			</View>
		)
	}
	mapComment(comment) {
		if(!comment) {
			return {}
		}
		const {discuss} = this.props
		return {
			title: comment.title,
			id: comment.id,
			img: comment.user.img,
			name: comment.user.name+(discuss.sender.id==comment.user.id?'(楼主)':''),
			time: moment(comment.datetime).format('YYYY-MM-DD HH:mm'),
			content: comment.content,
		}
		//title, time, name, img, commentNumber=0, content
	}
	mapDiscuss(discuss) {
		const {comments, commentNumber} = this.props
		if(!discuss) {
			return {}
		}

		return {
			time: moment(discuss.datetime).format('YYYY-MM-DD HH:mm'),
			id: discuss.id,
			img: discuss.sender.img,
			name: discuss.sender.name,
			title: discuss.title,
			content: discuss.content,
			commentNumber: commentNumber
		}
	}
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 20,
    // top: 40
    //justifyContent: 'flex-start',
  },
  inputContainer: {
  	left: 10,
  	right: 10,
  	position: 'absolute',
  	bottom: 6,
  	height: 36,
  	flex: 1,
  	alignItems: 'center',
  	borderColor: 'rgba(125, 125, 125, .8)',
  	borderWidth: .5,
  	flexDirection: 'row',
  	borderRadius: 8,
  	backgroundColor: 'white',
  },
  textInput: {
  	padding: 4,
  	paddingLeft: 10,
  	flex: 1,
  	borderTopLeftRadius: 8,
  	borderBottomLeftRadius: 8,
  	borderWidth: 0,
  	borderRightWidth: 0,
  	// marginBottom: 10
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  disable: {
    backgroundColor: '#ccc',
    borderColor: '#eee',
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
});