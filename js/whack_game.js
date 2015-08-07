// configuration
	var game_state="intro"
	var size = window.innerWidth;
	var v_partition;
	var img_folder;
	var canvas = document.getElementById('myCanvas');
	if(replace_cursor)canvas.style.cursor = "none";
	screen.orientation.lock('landscape');
	var startTime = (new Date()).getTime();
	var lastTime= startTime;
	var mouse={down:0,x:0,y:0};
	
// set up canvas
    var context = canvas.getContext('2d');
	if (size>800)
	{img_folder="800x600"; v_partition=150; canvas.width=800; canvas.height=600;}
	else
	{img_folder="400x300"; v_partition=75; canvas.width=400; canvas.height=300; npc_speed=npc_speed*0.6;}
	context.rect(0, 0, canvas.width, canvas.height);
	context.font="20px Georgia";
	// add linear gradient
    var grd = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    // light blue
    grd.addColorStop(0, '#8ED6FF');   
    // dark blue
    grd.addColorStop(1, '#004CB3');
	context.fillStyle = grd;
    context.fill();	

// set up event listeners
	document.body.onmousedown = function() {++mouse.down;}
	document.body.onmouseup = function() {--mouse.down;}
	canvas.addEventListener("mousedown", doMouseDown, false);
	canvas.addEventListener('mousemove', function(evt) {mousePos = getMousePos(canvas, evt);}, false);
	
	//window.onresize = function(event) {
    //if(window.innerWidth<canvas.width && canvas.width=800){canvas.width=400;canvas.height=300;}
	//if(window.innerWidth>800 && canvas.width=400){canvas.width=800;canvas.height=600;}
//};
      //canvas.addEventListener("resize", ResizeScript);

// declare resources
	var img_sqr= new Image();
	var img_sqg= new Image();
	  
	var img_mallet0= new Image();
	var img_mallet1= new Image();
	
	LoadResources();
	
	function LoadResources()
	{
		img_sqr.src=img_folder+"/squirrel_red.png";
		img_sqg.src=img_folder+"/squirrel_grey.png";
		img_mallet0.src="mallet0.png";
		img_mallet1.src="mallet1.png";
	}
	  
	var tree= new Tree([0,v_partition,v_partition*2,v_partition*3]);
	  
	function doMouseDown()
	{
		if(game_state="playing")
		{
			for (i = 0; i < tree.img.length-1; i++)
			{
				if (
				tree.row[i].npc.hit==false &&
				tree.row[i].npc.offsetX<mouse.x && 
				tree.row[i].npc.offsetX+tree.row[i].npc.img.width>mouse.x && 
				tree.row[i].npc.offsetY<mouse.y &&
				tree.row[i].level<mouse.y
				){
					document.getElementById('squeak').currentTime = 0;
					document.getElementById('squeak').play();
					player.score=player.score+tree.row[i].npc.type;
					global_score.current=global_score.current+tree.row[i].npc.type;
					player.time_left=player.time_left+time_diff_on_hit*tree.row[i].npc.type;
					tree.row[i].npc.hit=true;
					npc_speed=npc_speed+speed_increase;
				}
			}
		}
		else
		{if(game_state="intro") game_state="playing";}
	}
	  
	function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        mouse.x= evt.clientX - rect.left;
        mouse.y= evt.clientY - rect.top;
    }
	  
	function Row(level){
		this.level=level;
		this.image=new Image();
		this.npc=new Npc();
		this.Update= function (time) {
			switch(this.npc.status) {
				case "down":
				    this.npc.offsetY=this.npc.offsetY-npc_speed * time / 1000;
				    if(this.npc.offsetY<=0){ this.npc.status="waiting";
				    this.npc=new Npc();
				    }
				break;
				case "up":
				    this.npc.offsetY=this.npc.offsetY+npc_speed * time / 1000;
				    if(this.npc.offsetY>=this.npc.img.height) {this.npc.status="down";}
				break;
				case "waiting":
				    this.npc.timeout=this.npc.timeout-time;
				    if(this.npc.timeout<=0){ this.npc.status="up";}
				break;
				default:
				break;
			}
		}
	}
 
	function Tree(levels) {
		this.img=[];
		this.level=[];
		this.row=[];
		for (i = 0; i < levels.length; i++) {
			this.img.push( new Image());
			this.img[i].src=img_folder+"/tree"+i+".png";
			this.level.push(levels[i]);
			this.row.push(new Row(levels[i]));
		}
		this.Update= function (time) {
			for (i = 0; i < this.row.length; i++) {
			this.row[i].Update(time);
			}
		}
	}

	function Npc(){
		if (Math.random()>0.5)
		{this.type=1; this.img=img_sqg;}
		else
		{this.type=-1; this.img=img_sqr;}
		this.hit=false;
		this.offsetY=0;
		this.offsetX=Math.floor((Math.random() * canvas.width*0.6)+canvas.width*0.2);
		this.status="waiting";
		this.timeout=Math.random()*1000;
	}

	function DrawMallet(){
		console.log(mouse.down+" "+mouse.x+" "+mouse.y);
		context.drawImage(mouse.down?img_mallet1:img_mallet0,mouse.x-Math.floor(img_mallet0.width/4),mouse.y);
	}

	function DrawTree(){
		for (i = 0; i < tree.img.length; i++) {
			context.drawImage(tree.img[i], 0, tree.level[i]);
			if(i<tree.img.length)
			{context.drawImage(tree.row[i].npc.img, tree.row[i].npc.offsetX, Math.floor(tree.level[i+1]-tree.row[i].npc.offsetY));}
		}
	}
	
	function animate() {
		console.log(player.score);
		requestAnimationFrame(animate);
        // update
		var dtime = (new Date()).getTime() - lastTime;
		lastTime=(new Date()).getTime();
		
		switch(game_state) {
			case "intro":
				//draw
				context.fillStyle = grd;
				context.fill();
				context.fillStyle = 'white';
				context.fillText("left click to start the game",canvas.width/3,canvas.height/2-50);
				context.fillText("left click to whack a squirrel",canvas.width/3,canvas.height/2);
				context.fillText("Whack only grey squirrels",canvas.width/3,canvas.height/2+50);
			break;
			case "playing":
				tree.Update(dtime);
				player.time_left=player.time_left-dtime;
				if(player.time_left<=0)
				{game_state="finished"}
				//draw
				context.fillStyle = grd;
				context.fill();
				DrawTree();
				context.fillStyle = 'white';
				context.fillText("Time left: "+Math.floor(player.time_left/1000)+" | Score: "+player.score+" | global target: "+global_score.current+"/"+global_score.target,30,30);
				if(replace_cursor)DrawMallet();
			break;
			case "finished":
				//draw
				context.fillStyle = grd;
				context.fill();
				context.fillStyle = 'white';
				context.fillText("You have scored: "+player.score+" | global target: "+global_score.current+"/"+global_score.target,canvas.width/4,canvas.height/2);
			break;
			default:
			break;
		}
	}
    
	window.onload=setTimeout(function() {
        animate();
      }, 100);