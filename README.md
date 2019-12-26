<h1>Twitter prototype</h1>
<h3>Technologies used</h3>

**Programming Languages:** Javascript, HTML5

**Web/Mobile Frameworks:** React, Node.js, Redux, Passport, JWT, Canvas.js

**Databases:** MySQL, MongoDB, Redis

**Cloud Technologies:** AWS EC2, AWS ECS, AWS ECR, Docker, Kafka 

**Testing:** Mockito, Chai, JMeter

<h3>Homescreen</h3>
It contained three components - Sidebar, TweetList and SearchBar. I used child to parent callback to toggle between various screens listed in the SideBar. For example, clicking on Bookmarks button calls sendData() which  invokes the callback function to parent to change state of the parent.

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


![](https://github.com/vaswal/twitter-prototype/blob/master/images/Top10TweetsByViews.jpeg)


![](https://github.com/vaswal/twitter-prototype/blob/master/images/SearchPeople.jpeg)

