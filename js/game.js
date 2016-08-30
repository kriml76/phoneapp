document.addEventListener('touchmove',fnDefault,false);
document.addEventListener('touchstart',fnDefault,false);
function fnDefault(event){
	event.preventDefault();
}

$(function(){
	window.score = 0;
	$('#start_button').on('touchstart',function(){
		$('#start_bg').css('display','none');
		var b1 = new ball('#ball','#ball_shadow');
		var b2 = new ball('#ball2','#ball_shadow2');
		var b3 = new ball('#ball3','#ball_shadow3');
	})

	$('#reset_game').on('touchstart',function(){
		$('#end_bg').css('display','none');
		window.score = 0;
		
		var b1 = new ball('#ball','#ball_shadow');
		var b2 = new ball('#ball2','#ball_shadow2');
		var b3 = new ball('#ball3','#ball_shadow3');
		$('#ball').css('left','41%');
		$('#ball2').css('left','11%');
		$('#ball3').css('left','71%');
		$('#ball_shadow').css('left','41%');
		$('#ball_shadow2').css('left','11%');
		$('#ball_shadow3').css('left','71%');
	})

	/* 图片预加载 start */

	var picArr = [
		'ball.png','ball_shadow.png','bg.jpg','emd_bg.png','hoop_bottom.png','hoop_top.png','join.png','net.png','reset_game.png','stands.jpg','start.png','start_bg.jpg'
	];

	preloadimages(picArr);

	function preloadimages(arr){
	    var newimages=[], loadedimages=0;
	    var arr=(typeof arr!="object")? [arr] : arr;
	    function imageloadpost(){
	        loadedimages++;
	       
	        if (loadedimages<=arr.length){
	           fnLoad(loadedimages,arr.length);
	            if (loadedimages==arr.length){

	            	fnStart();

	            }
	        }
	    }
	    for (var i=0; i<arr.length; i++){
	        newimages[i]=new Image();
	        newimages[i].src="img/"+arr[i];
	        newimages[i].onload=function(){
	            imageloadpost();
	        }
	        newimages[i].onerror=function(){
	        imageloadpost();
	        }
	    }
	}

	function fnLoad(iNow,sum){          //loading
		$('#loading p').html( parseInt((iNow/sum)*100) +"%");
		$('#loading_bg div').css({
			width: parseInt((iNow/sum)*100) +"%"
		});
	}

	function fnStart(){
		$('#loding').css('display','none');

	}


	/* 图片预加载 end */

	
});




function ball(id,id_shadow){
	this.oBall = $(id);									//篮球
	this.oBall_shadow = $(id_shadow);	
	this.oScore = $('#score');	
	this.oTime = $('#time');
	this.oEnd_bg = $('#end_bg');
	this.oEnd_bg_span1 = $('#end_bg span').eq(0);		
	this.oEnd_bg_span2 = $('#end_bg span').eq(1);
	this.oEnd_bg_p = $('#end_bg p');

	//this.oBall = $('#ball');
	this.oBallWidth = $('#ball').width();
	this.oNet = $('#net');
	this.oWrapWidth = $('#wrap').width();				
	this.oWrapHeight = $('#wrap').height();
	this.disX = 0;										
	this.disY = 0;	
	this._x = 0;										//touchend时球的位置；
	this._y = 0;
	this.endX = 0;
	this.endY = 0;
	this.defaultPos = 0;
	this.gameState = true;								//游戏状态
	this.score = 0;										//得分
	this.time = 20;										//游戏时间20秒
	this.tipsText = ["堪称MVP级的表现！","你就是本场板凳王！"];

	this.num = 0;
	this.sum = 0;
	this.deVx = this.calcVy(this.sum);
	this.g = 1;											//加速度
	this.vx = 0;										//水平方向速度
	this.vy = this.deVx;								//垂直方向速度
	this.scale = 0.6;									//球缩放比例
	this.timer = null;									
	this.timer2 = null;	
	this.timer3 = null;			
	this.isRebound1 = true;								//是否反弹
	this.isRebound2 = true;
	this.isRebound3 = true;
	this.isRebound4 = true;
	this.isRebound5 = true;
	this.isRebound6 = true;
	this.isRebound7 = true;
	this.isRebound8 = true;
	this.reboundDisY1 = this.oWrapHeight*0.75-this.oBall.height();       //反弹临界点
	this.reboundDisY2 = this.oWrapHeight*0.9-this.oBall.height();
	this.reboundDisY3 = this.oWrapHeight-this.oBall.height();
	this.maxPos = 0;
	this.distance = 0;
	this.record = 0;
	this.backboardL = (this.oWrapWidth*0.44)/2 -  this.oBallWidth*0.7;         //碰撞篮板左临界点
	this.backboardR = this.oWrapWidth*0.78 - (1-0.7)*this.oBallWidth/2; 	   //碰撞篮板右临界点
	this.hoopL = (this.oWrapWidth*0.37);                                       //碰撞篮框左临界点
	this.hoopR = (this.oWrapWidth*0.58);                                       //碰撞篮框右临界点
	this.hoopT = (this.oWrapHeight*0.395);                                     //碰撞篮框上临界点


	this.init();										//初始化
}

ball.prototype.init = function(){
	this.initPosition();
	this.countdown();
	this.oTime.html(this.toZero(this.time));
	this.oScore.html(this.toZero(this.score));
	var _this = this
	this.oBall.on('touchstart',function(ev){
		_this.fnStart(ev,_this);
	});

};
ball.prototype.countdown = function(){
	var _this = this;
	this.timer3 = setInterval(function(){
		_this.time--;
		if(_this.time == 0){
			clearInterval(_this.timer3);

			setTimeout(function(){
				if(_this.score<10){
					_this.oEnd_bg_p.html(_this.tipsText[1]);
				}else{
					_this.oEnd_bg_p.html(_this.tipsText[0]);
				}
				_this.score = _this.toZero(window.score);
				_this.score = _this.score.split('');
				_this.oEnd_bg_span1.html(_this.score[0]);
				_this.oEnd_bg_span2.html(_this.score[1]);
				_this.oEnd_bg.css('display','block');
				
			},1000);
			
			_this.gameState = false;
		}
		_this.oTime.html(_this.toZero(_this.time));

	}, 1000);

};
ball.prototype.fnScore = function(num){
	if(!this.gameState){
		return false;
	}
	this.score += num;
	window.score += num;
	this.oScore.html(this.toZero(window.score));
};
ball.prototype.toZero = function(num){
	if(num<10){
		return '0'+num;
	}else{
		return ''+num;
	}
};
ball.prototype.initPosition = function(){
	this.oBall.css({'top':this.oWrapHeight-this.oWrapWidth*0.2});
	this.oBall_shadow.css({'top':this.oWrapHeight-this.oWrapWidth*0.03});
};
ball.prototype.fnStart = function(ev,_this){
	//console.log(ev.changedTouches[0].clientX);
	if(!_this.gameState){
		return false;
	}
	this.fnReset();
	_this.disX = ev.changedTouches[0].clientX - _this.oBall.position().left;
	_this.disY = ev.changedTouches[0].clientY - _this.oBall.position().top;
	_this.oBall.on('touchmove',function(ev){
		_this.fnMove(ev,_this);
	});
	_this.oBall.on('touchend',function(ev){
		_this.fnEnd(ev,_this);
	});
};
ball.prototype.fnMove = function(ev,_this){
	_this.L = ev.changedTouches[0].clientX - _this.disX;
	_this.T = ev.changedTouches[0].clientY - _this.disY;
	if(_this.L<0){
		_this.L = 0;
	}else if(_this.L>_this.oWrapWidth-_this.oBall.width()){
		_this.L = _this.oWrapWidth-_this.oBall.width();
	}
	if(_this.T<0){
		_this.T = 0;
	}else if(_this.T>_this.oWrapHeight-_this.oBall.height()){
		_this.T = _this.oWrapHeight-_this.oBall.height();
	}else if(_this.T<_this.oWrapHeight*0.65){
		//_this.fnEnd(ev,_this);
		//return false;
		_this.oBall.trigger("touchend");
		_this.oBall.off();
		_this.oBall.on('touchstart',function(ev){
			_this.fnStart(ev,_this);
		});
		//_this.oBall.off('touchmove',_this.fnMove);
		//_this.oBall.off('touchend',_this.fnEnd);
		return ;
	}
	$(_this.oBall).css({'left': _this.L , 'top': _this.T });
	$(_this.oBall_shadow).css({'left': _this.L });
};
ball.prototype.fnEnd = function(ev,_this){
	//console.log(1);
	//_this.oBall.off('touchmove',_this.fnMove);
	//_this.oBall.off('touchend',_this.fnEnd);
	_this.oBall.off();
	
	this.oBall.on('touchstart',function(ev){
		_this.fnStart(ev,_this);
	});

	_this.defaultPos = _this.oBall.position().top;
	_this._x = _this.oBall.position().left;
	_this._y = _this.oBall.position().top;
	_this.endX = _this.oBall.position().left;
	_this.endY = _this.oBall.position().top;
	_this.update(_this);
};
ball.prototype.update = function(_this){
	if(this.endX<this.backboardL || this.endX>this.backboardR){
		// alert('a');
		this.updateInterval(_this,function(){
			if(!_this.maxPos && _this.vy+_this.g>=0 ){

				_this.maxPos = _this.oBall.position().top;
				_this.distance = (_this.defaultPos - _this.maxPos)*0.15;
				_this.oBall.css({'z-index': '1' });
				_this.oBall.css({'-webkit-transition':'-webkit-transform 0.9s,opacity 0.6s','-webkit-transform': 'translateX(30px) scale(0.01)','opacity':'0' });
				_this.oBall_shadow.css({'-webkit-transition':'all 0.9s','-webkit-transform': 'translateX(30px) scale(0.01)','opacity':'0' });
				setTimeout(function(){
					clearInterval(_this.timer);
					_this.oBall.css({'-webkit-transition':'0s','-webkit-transform': 'translateX(0px) scale(1)','opacity':'1','top':_this.oWrapHeight-_this.oWrapWidth*0.2,'left':'41%' });
					_this.oBall_shadow.css({'-webkit-transition':'0s','-webkit-transform': 'translateX(0px) scale(1)','opacity':'1','top':_this.oWrapHeight-_this.oWrapWidth*0.03,'left':'41%'});
				}, 1000)

			}
		});
	}else if((/*this.endX>=this.backboardL && */this.endX<this.hoopL-this.oBallWidth*0.7) || (/*this.endX<=this.backboardR && */this.endX>this.hoopR)){
		this.updateInterval(_this,function(){
			/*if(!_this.maxPos && _this.vy+_this.g>=0 ){
				_this.maxPos = _this.oBall.position().top;
				_this.distance = (_this.defaultPos - _this.maxPos)*0.15;
				//_this.oBall.css({'z-index': '1' });
				//_this.oBall.css({'-webkit-transition':'transform 0.9s,opacity 0.6s','-webkit-transform': 'translateX(30px) scale(0.01)','opacity':'0' });
				
			}
			if(_this.isRebound4 && _this.maxPos && _this._y>=_this.maxPos+_this.distance ){
				//vx = 0.3;
				if(_this.endY<=_this.oWrapHeight*0.8){
					_this.vy += -12;
				}
				_this.oBall.css({'-webkit-transition':'-webkit-transform 0.9s','-webkit-transform': 'scale(1) translateX(0)' });
				
				//_this.oNet.css({'-webkit-animation': 'netChange .5s linear' });
				_this.isRebound4 = false;
				//_this.goal(_this._x,_this._y);
			}*/

			if( _this.isRebound4 && _this.vy+_this.g>=0){

				setTimeout(function(){
					if(_this.endY<=_this.oWrapHeight*0.8){
						_this.vy += -12;
					}
					_this.oBall.css({'-webkit-transition':'-webkit-transform 0.9s','-webkit-transform': 'scale(1) translateX(0)' });
				},300);
				_this.isRebound4 = false;
			}
			
			if(_this.isRebound1 && _this.vy>0 && _this._y>=_this.reboundDisY1  ){
				//_this._y = _this.oWrapHeight*0.75-_this.oBall.height();
				_this.vy = parseInt(-_this.vy*0.3);			
				_this.isRebound1 = false;
				_this.oBall_shadow.css({'-webkit-transition':'top 0.32s linear', 'top': _this.oWrapHeight*0.88});
			}else if(_this.vy>0 && _this.isRebound2 && _this._y>=_this.reboundDisY2 ){
				//_this._y = _this.oWrapHeight*0.9-_this.oBall.height();
				_this.vy = parseInt(-_this.vy*0.3);
				_this.isRebound2 = false;
				_this.oBall_shadow.css({'-webkit-transition':'top 0.3s linear', 'top': _this.oWrapHeight-_this.oWrapWidth*0.03});
			}else if(_this.vy>0 && _this._y>=_this.reboundDisY3 ){
				_this._y = _this.oWrapHeight-_this.oBall.height();
				_this.vy = parseInt(-_this.vy*0.3);
				_this.vx = 0;
			}
			_this.oBall.css({'left': _this._x , 'top': _this._y});
			if(_this.record == _this.vy && _this.isRebound3){
				_this.isRebound3 = false;
				clearInterval(_this.timer);
				return false;

			}
			_this.record = _this.vy;
		});

	}else{

		if(_this.endY<=_this.oWrapHeight*0.83){
			// alert('a')
			this.updateInterval(_this,function(){
				/*if(!_this.maxPos && _this.vy+_this.g>=0 ){
					_this.maxPos = _this.oBall.position().top;
					_this.distance = (_this.defaultPos - _this.maxPos)*0.15;
					_this.oBall.css({'z-index': '1' });
					//_this.oBall.css({'-webkit-transition':'transform 0.9s,opacity 0.6s','-webkit-transform': 'translateX(30px) scale(0.01)','opacity':'0' });
					
				}
				if(_this.isRebound4 && _this.maxPos && _this._y>=_this.maxPos+_this.distance ){
					//vx = 0.3;
					//if(_this.endY<=_this.oWrapHeight*0.8){
					//	_this.vy += -12;
					//}
					_this.oBall.css({'-webkit-transition':'-webkit-transform 0.7s 0.2s','-webkit-transform': 'scale(1) translateX(0)' });
					
					//_this.oNet.css({'-webkit-animation': 'netChange .5s linear' });
					_this.isRebound4 = false;
					//_this.goal(_this._x,_this._y);
				}*/
				if( _this.isRebound4 && _this.vy+_this.g>=0){
					_this.oBall.css({'z-index': '1' });
					
					setTimeout(function(){
						/*if(_this.endY<=_this.oWrapHeight*0.8){
							_this.vy += -12;
						}*/
						_this.oBall.css({'-webkit-transition':'-webkit-transform 0.9s','-webkit-transform': 'scale(1) translateX(0)' });
					},300);
					_this.isRebound4 = false;
				}

				if(_this.endX<=_this.hoopL){
					
					if(_this.endX>=_this.hoopL-_this.oBallWidth*0.3){         //进球
						if(_this.isRebound5 /*&& _this.maxPos<_this.oWrapHeight*0.39*/ && _this.vy>0 && _this._y>=_this.oWrapHeight*0.39-_this.oBall.height()){
							_this._y = _this.oWrapHeight*0.39-_this.oBall.height();
							_this.vx = 1.5;
							//_this._x += _this._vx;
							_this.vy = -5;	
							_this.isRebound5 = false;

							_this.oNet.css({'-webkit-animation': 'netChange 0.2s 0.2s linear' });

							_this.fnScore(2);
						}
					}else{
						
						if(_this.isRebound5 /*&& _this.maxPos<_this.oWrapHeight*0.39*/ && _this.vy>0 && _this._y>=_this.oWrapHeight*0.39-_this.oBall.height()){
							_this._y = _this.oWrapHeight*0.39-_this.oBall.height();
							_this.vx = -2;
							//_this._x += _this._vx;
							_this.vy = -5;	
							_this.isRebound5 = false;
						}
					}
					
				}else if(_this.endX>=_this.hoopR-_this.oBallWidth*0.7 ){
					if(_this.endX<_this.hoopR-_this.oBallWidth*0.3){         //进球
						// alert('b');
						if(_this.isRebound5 /*&& _this.maxPos<_this.oWrapHeight*0.39*/ && _this.vy>0 && _this._y>=_this.oWrapHeight*0.39-_this.oBall.height()){
							
							_this._y = _this.oWrapHeight*0.39-_this.oBall.height();
							_this.vx = -1.5;
							//_this._x += _this._vx;
							_this.vy = -5;	
							_this.isRebound5 = false;
							
							_this.oNet.css({'-webkit-animation': 'netChange 0.2s 0.2s linear' });

							_this.fnScore(2);
						}
					}else{
						if(_this.isRebound5 /*&& _this.maxPos<_this.oWrapHeight*0.39*/ && _this.vy>0 && _this._y>=_this.oWrapHeight*0.39-_this.oBall.height()){
							
							_this._y = _this.oWrapHeight*0.39-_this.oBall.height();
							
							_this.vx = 2;
							//_this._x += _this._vx;
							_this.vy = -5;	
							_this.isRebound5 = false;
						}
					}
				}else{          
					if(	_this.isRebound6 && _this.vy>0 && _this._y>_this.oWrapHeight*0.30){
						if(_this.endY<=_this.oWrapHeight*0.75){              //进球    **************************
						
							
							if(Math.random()>0.5){
								_this.oNet.css({'-webkit-animation': 'netChange .2s linear' });
								_this.isRebound6 = false;
								_this.fnScore(3);
							}else{
								if(_this.isRebound6 /*&& _this.maxPos<_this.oWrapHeight*0.40*/ && _this.vy>0 && _this._y>=_this.oWrapHeight*0.40-_this.oBall.height()){
									//_this._y = _this.oWrapHeight*0.40-_this.oBall.height();
									_this.vy = -5;	
									_this.isRebound6 = false;
									_this.oBall.css({'z-index': '2' });
									//_this.oBall.css({'-webkit-transition':'-webkit-transform 0.2s ','-webkit-transform': 'scale(0.8) translateX(0)' });
									//_this.oNet.css({'-webkit-animation': 'netChange 0.2s 0.2s linear' });
								}	
							}

						}else{
							if(_this.isRebound6 /*&& _this.maxPos<_this.oWrapHeight*0.40*/ && _this.vy>0 && _this._y>=_this.oWrapHeight*0.40-_this.oBall.height()){
								//_this._y = _this.oWrapHeight*0.40-_this.oBall.height();
								_this.vy = -5;	
								
								_this.isRebound6 = false;
								_this.oBall.css({'z-index': '2' });
								//_this.oBall.css({'-webkit-transition':'-webkit-transform 0.2s ','-webkit-transform': 'scale(0.8) translateX(0)' });
								//_this.oNet.css({'-webkit-animation': 'netChange 0.2s 0.2s linear' });
							}	
						}

					}
					
				}
				// 这是撞地反弹的碰撞处理代码-到483行
				if(_this.isRebound1 && _this.vy>0 && _this._y>=_this.reboundDisY1  ){
					//_this._y = _this.oWrapHeight*0.75-_this.oBall.height();
					_this.vy = parseInt(-_this.vy*0.3);
							
					_this.isRebound1 = false;
					_this.oBall_shadow.css({'-webkit-transition':'top 0.32s linear', 'top': _this.oWrapHeight*0.88});
				}else if(_this.vy>0 && _this.isRebound2 && _this._y>=_this.reboundDisY2 ){
					//_this._y = _this.oWrapHeight*0.9-_this.oBall.height();
					
					_this.vy = parseInt(-_this.vy*0.3);
					_this.isRebound2 = false;
					_this.oBall_shadow.css({'-webkit-transition':'top 0.3s linear', 'top': _this.oWrapHeight-_this.oWrapWidth*0.03});
				}else if(_this.vy>0 && _this._y>=_this.reboundDisY3 ){
					
					_this._y = _this.oWrapHeight-_this.oBall.height();
					_this.vy = parseInt(-_this.vy*0.3);
					_this.vx = 0;
				}
				_this.oBall.css({'left': _this._x , 'top': _this._y});
				if(_this.record == _this.vy && _this.isRebound3){
										_this.isRebound3 = false;
					clearInterval(_this.timer);
					return false;

				}
				_this.record = _this.vy;
			});
		}else{

			this.updateInterval(_this,function(){
				/*if(!_this.maxPos && _this.vy+_this.g>=0 ){
					_this.maxPos = _this.oBall.position().top;
					_this.distance = (_this.defaultPos - _this.maxPos)*0.15;
					//_this.oBall.css({'z-index': '1' });
					//_this.oBall.css({'-webkit-transition':'transform 0.9s,opacity 0.6s','-webkit-transform': 'translateX(30px) scale(0.01)','opacity':'0' });
					
				}
				if(_this.isRebound4 && _this.maxPos && _this._y>=_this.maxPos+_this.distance ){
					//vx = 0.3;
					if(_this.endY<=_this.oWrapHeight*0.8){
						_this.vy += -12;
					}
					_this.oBall.css({'-webkit-transition':'-webkit-transform 0.9s','-webkit-transform': 'scale(1) translateX(0)' });
					
					//_this.oNet.css({'-webkit-animation': 'netChange .5s linear' });
					_this.isRebound4 = false;
					_this.goal(_this._x,_this._y);
				}*/

				if( _this.isRebound4 && _this.vy+_this.g>=0){
					// /_this.oBall.css({'z-index': '1' });
					setTimeout(function(){
						if(_this.endY<=_this.oWrapHeight*0.8){
							_this.vy += -12;
						}
						_this.oBall.css({'-webkit-transition':'-webkit-transform 0.9s','-webkit-transform': 'scale(1) translateX(0)' });
					},300);
					_this.isRebound4 = false;
				}
				
				if(_this.isRebound1 && _this.vy>0 && _this._y>=_this.reboundDisY1  ){
					//_this._y = _this.oWrapHeight*0.75-_this.oBall.height();
					_this.vy = parseInt(-_this.vy*0.3);	
					_this.isRebound1 = false;
					_this.oBall_shadow.css({'-webkit-transition':'top 0.32s linear', 'top': _this.oWrapHeight*0.88});
					console.log(1);
				}else if(_this.vy>0 && _this.isRebound2 && _this._y>=_this.reboundDisY2 ){
				//	_this._y = _this.oWrapHeight*0.9-_this.oBall.height();
					_this.vy = parseInt(-_this.vy*0.3);
					_this.isRebound2 = false;
					_this.oBall_shadow.css({'-webkit-transition':'top 0.3s linear', 'top': _this.oWrapHeight-_this.oWrapWidth*0.03});
				}else if(_this.vy>0 && _this._y>=_this.reboundDisY3 ){
					_this._y = _this.oWrapHeight-_this.oBall.height();
					_this.vy = parseInt(-_this.vy*0.3);
					_this.vx = 0;
				}
				_this.oBall.css({'left': _this._x , 'top': _this._y});
				if(_this.record == _this.vy && _this.isRebound3){
					_this.isRebound3 = false;
					clearInterval(_this.timer);
					return false;

				}
				_this.record = _this.vy;
			});

		}


	}
};
ball.prototype.updateInterval = function(_this,fn){
	this.oBall.css({'-webkit-transform': 'scale('+this.scale+') translateX('+(1-this.scale)*this.oBallWidth/2+'px)' });
	//requestAnimationFrame
	clearInterval(this.timer);
	this.timer = setInterval(function(_this){

		_this._x += _this.vx;
		_this._y += _this.vy;
		_this.vy += _this.g; 

		if(_this.vx && _this._y>_this.oWrapHeight*0.4){
			_this.vx = 0;
		}
		
		fn();

		_this.oBall.css({'left': _this._x , 'top': _this._y});	
		_this.oBall_shadow.css({'left': _this._x });
		if(_this.isRebound7 && _this.vy<0){
			_this.oBall_shadow.css({'-webkit-transition':'top 0.9s ', 'top': _this.oWrapHeight*0.7});
			_this.isRebound7 = false;
		}else if(_this.isRebound8 && _this.vy>=0){
			//_this.oBall_shadow.css({'-webkit-transition':'top 1s linear', 'top': _this.oWrapHeight-_this.oWrapWidth*0.03});
			_this.isRebound8 = false;

			_this.oBall_shadow.css({'-webkit-transition':'top 0.2s linear', 'top': _this.oWrapHeight*0.73});
		}
				
		
	},1000/60,this);

};
ball.prototype.goal = function(x,y){
	//console.log(x,y);
	/*this.vy += -10  ;
	this.oBall.css({'-webkit-transform': 'scale(1) translateY(0)' });
	this.oNet.css({'-webkit-animation': 'netChange .5s linear' });*/
	//console.log(this.oBallWidth);
	
	//this.isRebound4 = false;
};
ball.prototype.calcVy = function(sum){
	//console.log(this.num);
	if(this.sum>=this.oWrapHeight*0.45){
		return -this.num;
	}else{
		this.num++;
		this.sum = sum;
		return this.calcVy(this.sum + this.num);
	}
};
ball.prototype.fnReset = function(){

	this.defaultPos = 0;
	this.g = 1;											
	this.vx = 0;										
	this.vy = this.deVx;;										
	this.scale = 0.6;										
	this.isRebound1 = true;								
	this.isRebound2 = true;
	this.isRebound3 = true;
	this.isRebound4 = true;
	this.isRebound5 = true;
	this.isRebound6 = true;
	this.isRebound7 = true;
	this.isRebound8 = true;
	this.maxPos = 0;
	this.distance = 0;
	this.record = 0;	
	clearInterval(this.timer);
	this.oBall.css({'z-index': '2','-webkit-transition':'-webkit-transform 0.9s' });
	this.oNet.css({'-webkit-animation': '' });			
};
