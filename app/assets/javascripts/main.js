require.config();

require([], function() {
	function randColor() {
		var r = Math.random() * 256 | 0;
    var g = Math.random() * 256 | 0;
    var b = Math.random() * 256 | 0;
    return 'rgba(' + r + "," + g + "," + b + "," + 255.0 + ")";
  }

	function washUpAndWashDown(drawingContext, cWidth, cHeight, stripeWidth) {
		var color = randColor();
		var numStripes =  cWidth / stripeWidth;
		var increment = 60;
		var x0 = 0;
		var y0 = 0;
		function updateY() {
			increment = -increment;
			x0 = (x0 + stripeWidth) % cWidth;
			color = randColor();
		}
		
		var intervalId = setInterval(function() {
			washDown(drawingContext, 
								x0,
								y0,
								stripeWidth,   
								increment, 
								color);
			y0 += increment;
			if(y0 < 0) {
				y0 = 0;
				updateY();
			} else if(y0 > cHeight) {
				y0 = cHeight;
				updateY();
			}
		}, 5);
		return intervalId;
	}

	function washDown(drawingContext, x, y, stripeWidth, increment, color) {
		drawingContext.fillStyle = color;
		if(increment < 0) {
			drawingContext.fillRect(x, y + increment, stripeWidth, Math.abs(increment));			
		} else {
			drawingContext.fillRect(x, y, stripeWidth, increment);
		}
	}

	function drawLayer(drawingContext, layer, layers, color) {		
			drawingContext.fillStyle = color;
			var x0 =  layers - layer;
			var x1 = layers + layer;
			var y0 = layers - layer;
			var y1 = layers + layer;
			var length = layer * 2;
			drawingContext.fillRect(x0, y0, length, 1);
			drawingContext.fillRect(x0, y1, length + 1, 1);		
			drawingContext.fillRect(x0, y0, 1, length);
			drawingContext.fillRect(x1, y0, 1, length);
	}

	function drawSpirals(imageData, canvas2DContext, totalLayers, interval) {
		var currentLayer = 0;
		var intervalId = setInterval(function(){
			drawLayer(imageData, currentLayer, totalLayers, randColor());
			currentLayer = (currentLayer + 1)	% (totalLayers + 1);
		}, interval);
		return intervalId;
	}
	function bindToClick(element, drawFunction) {
		var interval = -1;
		element.click(function() {
			if(interval === -1) {
				interval = drawFunction();
			} else {
				clearInterval(interval);
				interval = -1;
			}
		});
	}

	$(document).ready(function() {
		var canvas = $("#screen").get(0);
  	var canvas2DContext = canvas.getContext("2d");
  	var width = canvas.width;
  	var xLayers = width / 2;
  	var height = canvas.height;
  	var imageData = canvas2DContext.createImageData(width, height);
  	
  	bindToClick($("#spiral-btn"), function(){
  		return drawSpirals(canvas2DContext, canvas2DContext, xLayers, 5);
  	});
  	bindToClick($("#wash-btn"), function(){
  		return washUpAndWashDown(canvas2DContext, width, height, 11);
  	});
	});
});