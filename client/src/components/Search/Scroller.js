import React, { Component } from 'react';

class Scroller extends Component {
    componentDidMount() {
      //window.addEventListener('scroll', this.onScroll, false);
      let _this = this;
      setTimeout(()=>{
          //Scroll
          try{
            window.addEventListener("scroll", function(e){
              //console.log("scroll",e);
             // console.log(window.pageYOffset + " ___ " + window.innerHeight , _this.state);
              let windowDiff = window.innerHeight -  window.pageYOffset;
      
              if(windowDiff > 0 && windowDiff < 200 && _this.props.isLoading == false){
                console.log("now scroll");
                
                _this.props.callback();
              }
            });
          }
          catch(e){
            console.log(e);
          }
      },500);
    }

    
    componentWillUnmount() {
      window.removeEventListener('scroll', this.onScroll, false);
    }


    onScroll = () => {

      console.log(window.scrollY);
      if (
        (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) && this.props.hasMore 
      ) {
        this.props.onLoadMore();
      }
    }
    render() {
      return (
        <div style={{height:"auto",overflow:"auto"}} ref={(ref) => this.scrollParentRef = ref} className="custom-scroll">
            {this.props.children}
            <div className="scroll-element"></div>
        </div>
      )
    };
  }

  export default Scroller;