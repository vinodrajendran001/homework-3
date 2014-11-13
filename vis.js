var redditSvg;
var previousData;

var POLL_SPEED = 2000;

function redditVis() {
  // setup a poll requesting data, and make an immediate request
  setInterval(requestData,POLL_SPEED);
  requestData();

  // initial setup only needs to happen once 
  // - we don't want to append multiple svg elements
/*  redditSvg = d3.select("body")
        .append("svg")
        .attr("width",200)
        .attr("height",800)*/
}

function requestData() {
  // our jsonp url, with a cache-busting query parameter
  d3.jsonp("https://www.reddit.com/.json?jsonp=runVis&noCache=" + Math.random());
}


//////// PLEASE EDIT runVis /////////
/////////////////////////////////////
/////////////////////////////////////

function runVis(data) {

  // d3 never does anything automagical to your data
  // so we'll need to get data into the right format, with the
  // previous values attached
  var formatted = formatRedditData(data,previousData);
  ///console.log("vvvvvv",formatted);
  // select our stories, pulling in previous ones to update
  // by selecting on the stories' class name
/*  
  var stories = redditSvg
     .selectAll(".bar")
     // the return value of data() is the update context - so the 'stories' var is
     // how we refence the update context from now on
     .data(formatted,function(d) {
       // prints out data in your console id, score, diff from last pulling, text
       
      console.log(d.id);

       // use a key function to ensure elements are always bound to the same 
       // story (especially important when data enters/exits)
       return d.id;
     });

*/

  // ENTER context
/*stories.enter()
    .append("text")
    .text(function(d){return d.score + " " + d.diff + " " + d.title})
    .attr("y", function(d,i){return 1.5*i + 1 + "em"})
    .style("color","black");

 */ 
  
  var WIDTH = 500;

  var stories = d3.select("#graph")
    .selectAll(".bar")
    .data(formatted,function(d){return d.id});

  var scoreExtent = d3.extent(formatted,function(d) {
    return d.score;
  })

  var xScale = d3.scale.linear()
    .domain([0,formatted.length - 1])
    .range([0,5000]);
  var widthScale = d3.scale.linear()
    .domain(scoreExtent)
    .range([15,WIDTH])

  var enter = stories.enter()
    .append("rect")
    .attr("class","bar")
    .on("mouseover",function(d){d3.select("#title").text(d.title)})
    .on("click",function(d){window.location = d.url})

  stories
    .attr("width",function(d,i) {
      return widthScale(d.score);
    })
    .attr("height",20)
    .attr("x",0)
    .attr("y",function(d,i){return 25*i}
    );



}


function formatRedditData(data) {
  // dig through reddit's data structure to get a flat list of stories
  var formatted = data.data.children.map(function(story) {
    return story.data;
  });
  // make a map of storyId -> previousData
  var previousDataById = (previousData || []).reduce(function(all,d) {
    all[d.id] = d;
    return all;
  },{});
  // for each present story, see if it has a previous value,
  // attach it and calculate the diff
  formatted.forEach(function(d) {
    d.previous = previousDataById[d.id];
    d.diff = 0;
    if(d.previous) {
      d.diff = d.score - d.previous.score;
    }
  });
  // our new data will be the previousData next time
  previousData = formatted;
  return formatted;
}

redditVis();