<h1>Twitter prototype</h1>
<h3>Technologies used</h3>

**Programming Languages:** Javascript, HTML5

**Web/Mobile Frameworks:** React, Node.js, Redux, Passport, JWT, Canvas.js

**Databases:** MySQL, MongoDB, Redis

**Cloud Technologies:** AWS EC2, AWS ECS, AWS ECR, Docker, Kafka 

**Testing:** Mockito, Chai, JMeter

<h3>Homescreen</h3>
It contains three React components - Sidebar, TweetList and SearchBar. I used child to parent callback to toggle between various screens listed in the SideBar. For example, clicking on Bookmarks button calls sendData() which  invokes the callback function to parent to change state of the parent to Bookmarks.

    <button
        type="button"
	    class="list-group-item list-group-item-action borderless"
	    onClick={() => this.sendData("Bookmarks")}
	>	
		<FontAwesomeIcon icon={faBookmark} />
        	<span>Bookmarks</span>
     </button>
     
    sendData = (screenName) => {
        this.props.parentCallback(screenName);
    };
                        
![](https://github.com/vaswal/twitter-prototype/blob/master/images/HomeScreen.jpeg)

<h3>Analytics charts</h3>
Data visualisation charts

    render() {
        const options = {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "Top 10 tweets by views"
            },
            axisX: {
                title: "Tweets",
                reversed: true,
            },
            axisY: {
                title: "Number of views",
                labelFormatter: this.addSymbols,
                interval: 1
            },
            data: [{
                type: "bar",
                dataPoints: this.props.topTenTweetsByViews.dataPoints
            }]
        };

        return (
            <div>
                <CanvasJSChart options={options}/>
                <div className="container twitter-container">
                    <div className="col-lg-7">
                        <ViewTweets dataFromParent={this.props.topTenTweetsByViews.tweets} isDisableButtons={true}/>
                    </div>
                </div>
            </div>
        );
    }
    
![](https://github.com/vaswal/twitter-prototype/blob/master/images/Top10TweetsByViews.jpeg)


![](https://github.com/vaswal/twitter-prototype/blob/master/images/SearchPeople.jpeg)

