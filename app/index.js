import React from 'react';
import {render} from 'react-dom';


class App extends React.Component{
	constructor(props){
		super(props);
		this.state={
			currentIndex:1,
			hasTransition:true
		};

		this.isTransition=false;
		this.count=props.items.length;
		this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
		this.tid=null;
		this.inner=null;
		this.container=null;
		this.cwidth;
		this.goNext= this.goNext.bind(this);
		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
	}
	
	componentDidMount(){
		this.cwidth=this.container.clientWidth;
		this.setTranform(this.inner,-this.currentIndex*this.cwidth);
		this.startup();
	}

	componentDidUpdate(){
		let {currentIndex,hasTransition}=this.state;
		if(hasTransition){
			this.isTransition=true;
		}

		this.setTranform(this.inner,-currentIndex*this.cwidth);
	}

	startup(){
		this.tid=setInterval(this.goNext,1500);
	}

	goPre(){
		let currentIndex = this.state.currentIndex;
		currentIndex--;
		this.setState({
			currentIndex:currentIndex,
			hasTransition:true
		});
	}

	goNext(){
		let currentIndex = this.state.currentIndex;
		currentIndex++;
		this.setState({
			currentIndex:currentIndex,
			hasTransition:true
		});
	}

	setTranform(elem,num){
		elem.style.transform='translateX('+num+'px)';
	}

	addTransition(elem){
		elem.style.transition="transform 1s ease-in-out";
	}

	removeTransition(elem){
		elem.style.transition="none";
	}

	handleTransitionEnd(event){
		let currentIndex = this.state.currentIndex;
		if(currentIndex>=this.count+1){
			currentIndex=1;
		}else if(currentIndex<=0){
			currentIndex=this.count;
		}
		this.isTransition=false;
		this.setState({
			currentIndex:currentIndex,
			hasTransition:false,
		});
	}

	handleMouseEnter(event){
		clearInterval(this.tid);
	}

	handleMouseLeave(event){
		this.startup();
	}

	handleDir(dir,event){
		if(this.isTransition)return;
		if(dir===-1){
			this.goPre();
		}else{
			this.goNext();
		}

		event.stopPropagation();
	}

	createPreAndNext(){

		return (
			<a className="carousel-opt" href="javascropt:void(0)">
				<span className="carousel-previous" onClick={this.handleDir.bind(this,-1)}>&lt;</span>
				<span className="carousel-next" onClick={this.handleDir.bind(this,1)}>&gt;</span>
			</a>);
	}

	goNav(event){
		if(this.isTransition)return;
		
		let target= event.target;
		if(target.classList.contains('nav-item')){
			this.isTransition=true;
			this.setState({
				currentIndex: 1+parseInt(target.dataset.index),
				hasTransition:true,
			});
		}
		event.stopPropagation();
	}
	
	createNav(){
		let currentIndex = this.state.currentIndex;
		let guides=[];
		for(let i=0;i!=this.count;i++){
			guides.push(this.createNavItem(i,i+1===currentIndex));
		}

		return (<ul onClick={this.goNav.bind(this)} className="carousel-nav"  style={{marginLeft:-(this.count*12+(this.count-1)*10)/2-12}}>
			{guides}	
		</ul>);
	}
	
	createNavItem(num,isActive){
		return (
			<li className={isActive?"nav-item active":"nav-item"} data-index={num}></li>
		);
	}

	setInnerWidth(elem){
		if(elem){
			this.inner=elem;
			elem.style.width = this.cwidth*(this.count+2)+'px';
			let sitems = elem.getElementsByClassName('slider-item');
			for(let i =0;i!=sitems.length;i++){
				sitems[i].style.width=this.cwidth+'px'
			}
		}
	}
	
	createSlider(){
		let {items}= this.props;
		let newItems=[items[items.length-1],...items,items[0]];
		let elems = newItems.map(item=>this.createSliderItem(item));
		let {hasTransition} = this.state;
		let style={
			transition:hasTransition?'transform 1s ease-in-out':'none',
		}

		return (
				<div className="carousel-slider" style={style} onTransitionEnd={this.handleTransitionEnd} ref={this.setInnerWidth.bind(this)}>
					{elems}
		   		</div>
		);
	}

	createSliderItem(slider){

		return (
					<div className="slider-item">
						<a href={slider.url}>
							<img src={slider.src} alt={slider.title}/>
						</a>
		   			</div>
		);
	}

	render(){


		return (
			<div className="carousel-container" ref={elem=>this.container=elem} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
				{this.createSlider()}
		   		{this.createPreAndNext()}
		   		{this.createNav()}
		   </div>);
	}
}


let data=[{
	src:'https://wallpaperbrowse.com/media/images/3848765-wallpaper-images-download.jpg',
	title:'dog1',
	url:'www.google.com'
},{
	src:'https://i0download.pchome.net//g1/M00/08/02/ooYBAFNwZK6IBEjtAAio6tFx6C4AABhcQAMRjoACKkC224.jpg',
	title:'dog2',
	url:'www.facebook.com'
},{
	src:'https://www.elastic.co/assets/bltada7771f270d08f6/enhanced-buzz-1492-1379411828-15.jpg',
	title:'animal',
	url:'www.twitter.com'
},{
	src:'http://sofra.info/wp-content/uploads/2017/03/alone-but-happy-.jpg',
	title:'beautiful girl',
	url:'www.twitter.com'
}];

render(<App items={data}/>,document.getElementById('root'));

