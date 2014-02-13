/*
 * This file creates and manages the tree. It uses d3.js for the tree 
 * and jquery for the summary on the side.
 * The code is documented with inline comments explaining important things.
*/
var width = 1000;
var height = 800;
var h_padding = 20;
var w_padding = 100;

// root of our tree
var root;
// id's of our nodes
var idx=0;

// Creates the tree
var tree = d3.layout.tree()
      .size([height, width]);

// This is our 'link', a beizer curve
var diagonal = d3.svg.diagonal()
      .projection(function(d) { return [d.y,d.x]; })

// This is basically the drawing board for our tree
var svg = d3.select("#tree").append("svg:svg")
            .attr({ "width" : width + 120,
                    "height": height + 2*h_padding
                  })
            .append("svg:g")
            .attr("transform", 
                "translate(" + w_padding + "," 
                + h_padding + ")")

d3.json("flare.json", function(json) {
  root = json;
  // vertically placing the tree
  root.x0 = height/2;
  root.y0 = 0;
  
  // Function to 'switch off' all nodes
  function toggleAll(d) {
    if(d.children) {
      d.children.forEach(toggleAll);
      toggle(d);
    }
  }

  // Initially only the root is seen
  root.children.forEach(toggleAll);
  update(root);
})

// This function toggles a node's children, hiding them in a variable
// called _children.
function toggle(d) {
  if(d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}

function update(source) {
  var duration = d3.event && d3.event.altKey ? 5000 : 500;
  
  // compute the layout
  var nodes = tree.nodes(root).reverse();

  // Normalize depth
  nodes.forEach(function(d) {
    d.y = d.depth * 180;
  });

  // data(d, function) makes a function the key instead of the default
  var node  = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++idx);});

  // Enter the data
  var nodeEnter = node
      .enter()
        .append("svg:g")
        .attr("class", "node")
        .attr("transform", function(d) { 
          return "translate(" + source.y0+ "," + source.x0 +")";
        })
        .on("click", function(d) { 
         toggle(d);
         update(d);
        })
        .on("mouseover", function(d){
          populateSummary(d);
        });

  // Add the circle
  nodeEnter.append("svg:circle")
    .attr("r", 1e-6)
    .style("fill", function(d) { 
      return d._children ? "lightsteelblue" : "#fff" ;
    })

  nodeEnter.append("svg:text")
    .attr("x", function(d) { 
      return (d._children || d.children) ? -10 : 10;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) { 
      return (d._children || d.children) ? "end" : "start";
    })
    .text(function(d) { return d.name; })
    .style("fill-opacity", 1e-6)

  var nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function(d) {
            return "translate(" + d.y +"," + d.x + ")"
    })

  nodeUpdate.select("circle")
    .attr("r", 4.5)
  
  nodeUpdate.select("text")
    .style("fill-opacity", 1)
  
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + source.y + "," + source.x + ")";
    })

  nodeExit.select("circle")
    .attr("r",1e-6);

  nodeExit.select("text")
    .style("fill-opacity", 1e-6);

  // updating the links
  var link = svg.selectAll("path.link")
    .data(tree.links(nodes), function(d){
      return d.target.id;
    });

  link.enter().insert("svg:path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = {x:source.x0 , y:source.y0};
      return diagonal({source:o , target:o});
    });

  link.transition()
   .duration(duration)
   .attr("d", diagonal); 

  link.exit().transition()
    .duration(duration)
    .attr("d", function(d){
      var o = {x: source.x , y:source.y};
      return diagonal({source:o, target:o});
    })
    .remove();

  //stash the old positions
  nodes.forEach( function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

function find(node){
  // design call : to change the json or the tree
  // the json you fool
  console.log(root.name);
}

$("#btn_clear_errors").on("click", function(){
  var data = $("#process_name").data();
  find(data); 
});

function populateSummary(data){
  $("#process_name").data(data);
  console.log(data.name);
  $("#process_name").text(data.name);
  $("#errors").text(function(){
    if(data.crashed){
      return "crashed";
    } else {
      return "active";
    }
  });
  if(data.crashed){
    $("#btn_clear_errors").css("display","block");
  } else{
    $("#btn_clear_errors").css("display","none");
  }
}

