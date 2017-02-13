//一切游戏的都是数据操控

var game={
	data:[], //启动后为二维数组，存储每个格的数字
	RN:4,//总行数
	CN:4,//总列数 
	score:0, //分数
	state:0, //状态
	RUNNING:1, //正在运行时状态
	OVER:0, //结束状态

	getGridsHtml:function(){//生成背景格
		for(var r=0,arr=[];r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				arr.push(""+r+c);
			} 
		}
		return'<div id="bg'+arr.join('" class="grid"></div><div id="bg')+'" class="grid"></div>';
	},

	getCellsHtml:function(){//生成前景格
		for(var r=0,arr=[];r<this.RN;r++){
			for(var c=0;c<this.CN;c++){
				arr.push(""+r+c);
			} 
		}
		return'<div id="cg'+arr.join('" class="cell"></div><div id="cg')+'" class="cell"></div>';
	},

	init:function(){//初始化所有背景格前景格
		var grid = document.getElementById("gridPanel");
		grid.style.width = 116*(this.CN)+16+"px";
		grid.style.height = 116*(this.RN)+16+"px";
		grid.innerHTML =  this.getGridsHtml() + this.getCellsHtml();
		// console.log(this.getGridsHtml());
		// console.log(this.getCellsHtml());
	},

	start:function(){    //启动时调用
		//初始化RN行，CN列数组,所有为0
		this.init();
		this.state = this.RUNNING;
		this.data = [];//初始化空数组
		for (var r = 0; r<this.RN; r++) {
			this.data[r]=[]; //初始化每一行为空数组
			for (var c = 0;  c< this.CN; c++) {
				this.data[r][c]=0; //初始化每个格为0
			}
		}
		this.score = 0;
		this.randomNum();
		this.randomNum();
		this.updateView();
		//console.log(this.data.join("\n"));
	},

	isOver:function(){//判断状态
		//遍历data
		for (var r = 0; r<this.RN; r++) {
			for (var c = 0;  c< this.CN; c++) {
				if(this.data[r][c]==0)
					return false; 
				else{
					//如果当前列不是最右侧列，且当前元素等于右侧元素
					//如果当前行不是最后一行，且当前元素等于下方元素  返回false
					if(c!=this.CN-1&&this.data[r][c]==this.data[r][c+1])
						return false;
					else if(r!=this.RN-1&& this.data[r][c]==this.data[r+1][c])
						return false;
					
				}
			}
		}//遍历结束后，将状态改为OVER,返true
		this.state = this.OVER;
		return true;
	},

	randomNum:function(){//随机挑选一个位置生成2/4
		if(!this.isfull()){  /* 假如未满则执行*/
			while(true){//反复执行
			//随机生成一个行下标保存在row
				var row = Math.floor(Math.random()*this.RN);
				//随机生成一个列下标保存在col
				var col = Math.floor(Math.random()*this.CN);
				//首先判断data中r行c列的值==0 则随机生成2/4放入r行c列
				// //生成一个随机数<0.5则2 否则4
				if (this.data[row][col]==0) {
			 		this.data[row][col] = Math.random()<0.5?2:4;
					break;
				}			
			}
		}
		else{
			//this.error(this.isfull);
		}			
	},

	isfull:function(){ //判断数组中是否满，若满则返回true
		for (var r=0; r < this.RN; r++) {
			for (var c=0; c<this.CN; c++) {
				if(this.data[r][c]==0){
					return false;
				}
			}
		}
	},


	//更新数据与页面及样式
	updateView:function(){ 
	 	for (var r=0; r < this.RN; r++) {
			for (var c=0; c<this.CN; c++) {	
				//找到页面和当前元素对应的DIV
				var div = document.getElementById("cg"+r+c);			
				//即data[r][c] -> cg+r+c
				if(this.data[r][c]!=0){					
					div.innerHTML = this.data[r][c];
					div.className = "cell n"+this.data[r][c];
				}
				else{
			  		div.innerHTML = "";
					div.className = "cell";
				}
				//当div中有存在2048的数字时游戏结束
				if(div.innerHTML==2048){
					this.state = this.OVER;
					alert("Good Luck");
				}
			}
		}
		var span = document.getElementById("score");
		span.innerHTML = this.score;
		var gameover = document.getElementById("gameover");
		if(this.state==this.OVER){
			var final = document.getElementById("final");
			final.innerHTML = this.score;
			gameover.style.display = "block";
		}else{
			gameover.style.display = "none";
		}
	},

	//左移核心
	moveLeft:function(){
		var before = this.data.toString();
		for (var i = 0; i < this.data.length; i++) {
			this.moveLeftInRow(i);
		}
		var after = this.data.toString();
		if(before!=after){
			this.randomNum();
			this.isOver();
			this.updateView();			
		}
	},
	moveLeftInRow:function(r){ //改变行则遍历列
		for (var c=0; c < this.data[r].length-1; c++) {
			//从c开始找下一个不为0的位置nc
			var nc = this.getRightNext(r,c);
			if(nc==-1){break;}
			else{
				if(this.data[r][c]==0){
					this.data[r][c] = this.data[r][nc];
					this.data[r][nc] = 0;
					c--;
				}
				else if(this.data[r][c] == this.data[r][nc]){
					this.data[r][c] *= 2;
					this.data[r][nc] = 0;
					this.score+=this.data[r][c];
				}
			}
		}

	},
	getRightNext:function(r,c){
		//从c+1开始遍历c之后所有元素，若有不为0的值 则返回nc
		for(var nc=c+1;nc<this.data[r].length;nc++){
			if(this.data[r][nc] != 0){
				return nc;
			}
		}
		return -1;
	},

	//右移
	moveRight:function(){
		var before = this.data.toString();
		for (var i = 0; i < this.data.length; i++) {
			this.moveRightInRow(i);
		}
		var after = this.data.toString();
		if(before!=after){
			this.randomNum();
			this.isOver();
			this.updateView();			
		}
	},
	moveRightInRow:function(r){ //改变行则遍历列
		for (var c=this.data[r].length-1; c>0; c--) {
			//从c开始找上一个不为0的位置pc
			var pc = this.getLeftNext(r,c);
			if(pc==-1){break;}
			else{
				if(this.data[r][c]==0){
					this.data[r][c] = this.data[r][pc];
					this.data[r][pc] = 0;
					c++;
				}
				else if(this.data[r][c] == this.data[r][pc]){
					this.data[r][c] *= 2;
					this.data[r][pc] = 0;
					this.score+=this.data[r][c];
				}
			}
		}

	},
	getLeftNext:function(r,c){
		//从c-1开始遍历c之前所有元素，若有不为0的值 则返回pc
		for(var pc=c-1;pc>=0;pc--){
			if(this.data[r][pc] != 0){
				return pc;
			}
		}
		return -1;
	},

	//上移
	moveUp:function(){
		var before = this.data.toString();
		for (var i = 0; i < this.CN; i++) {
			this.moveUpInCol(i);
		}
		var after = this.data.toString();
		if(before!=after){
			this.randomNum();
			this.isOver();
			this.updateView();
		}
	},
	moveUpInCol:function(c){ //改变列则遍历行
		for (var r=0; r < this.CN; r++) {
			//从r开始找下一个不为0的位置nr
			var nr = this.getDownNext(r,c);
			if(nr==-1){break;}
			else{
				if(this.data[r][c]==0){
					this.data[r][c] = this.data[nr][c];
					this.data[nr][c] = 0;
					r--;
				}
				else if(this.data[r][c] == this.data[nr][c]){
					this.data[r][c] *= 2;
					this.data[nr][c] = 0;
					this.score+=this.data[r][c];
				}
			}
		}

	},
	getDownNext:function(r,c){
		//从r+1开始遍历r之后所有元素，若有不为0的值 则返回nr
		for(var nr=r+1;nr<this.CN;nr++){
			if(this.data[nr][c] != 0){
				return nr;
			}
		}
		return -1;
	},

	//下移
	moveDown:function(){
		var before = this.data.toString();
		for (var i = 0; i < this.CN; i++) {
			this.moveDownInCol(i);
		}
		var after = this.data.toString();
		if(before!=after){
			this.randomNum();
			this.isOver();
			this.updateView();			
		}

	},
	moveDownInCol:function(c){ //改变列则遍历行
		for (var r=this.CN-1; r >0; r--) {
			//从r开始找上一个不为0的位置pr
			var pr = this.getUpNext(r,c);
			if(pr==-1){break;}
			else{
				if(this.data[r][c]==0){
					this.data[r][c] = this.data[pr][c];
					this.data[pr][c] = 0;
					r++;
				}
				else if(this.data[r][c] == this.data[pr][c]){
					this.data[r][c] *= 2;
					this.data[pr][c] = 0;
					this.score+=this.data[r][c];
				}
			}
		}

	},
	getUpNext:function(r,c){
		//从r-1开始遍历r之前所有元素，若有不为0的值 则返回pr
		for(var pr=r-1;pr>=0;pr--){
			if(this.data[pr][c] != 0){
				return pr;
			}
		}
		return -1;
	},	

}


window.onload = function(){
	// console.log(game.RN);
	// console.log(game.CN);
	game.start();
	document.onkeydown=function(){
		if (game.state == game.RUNNING) {
			var e =window.event||arguments[0];
			var code = e.keyCode;			
			if(code==37){
				game.moveLeft();
			}
			else if(code==38){
				game.moveUp();
			}
			else if(code==39){
				game.moveRight();
			}
			else if(code==40){
				game.moveDown();
			}		
		}
	}
}
