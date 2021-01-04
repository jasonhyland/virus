// Virus sim by Jason
// Inspiration from Conway game of life....

// Simulation parameters


var simParams = {
	// How dense (%) the population is in sim
	subjectDensity: 25, 
	// % of starting population infected
	startingDistributionPercent: 5,
	// Range (in grid squares around subject) that subject in infectious 
	infectiousRadius: 1,
	// How many days (iterations) subject remains infectious
	minDaysRemainInfectious: 7,
	maxDaysRemainInfectious: 21,
	// % chance of transmission when in contact
    transmissionChance: 20,
	// Death rate of infected population %
	deathRate: 4,
	// % of population being infected at same time which would overwhem nhs
	overWhelm: 30,
	// % of people who would die when in overwhelm mode
	overWhelmDeathRate: 40,
	// % of people who move!
	movers: 30
}
	
	
var statistics = {
	populationSize: 0,
	infected: 0,
	notinfected: 0,
	immune: 0,
	dead: 0,
	nhs: 'Coping'
}

var subjectDensityControl;
var startingDistributionPercentControl;	
var infectiousRadiusControl;	
var minDaysRemainInfectiousControl;	
var maxDaysRemainInfectiousControl;	
var transmissionChanceControl;	
var deathRateControl;	
var overWhelmControl;	
var overWhelmDeathRateControl;	
var moversControl;	
var simTitleControl;

var widthControl;
var heightControl;
var resolutionControl;

var statsDiv;
var paramsDiv;

var statsButtonControl; 

var statsPopula

let grid;
let cols;
let rows;

var simSize = { 
	width: 1400, 
	height: 800, 
	resolution: 8, 
	speed: 4
	}

let day = 0;

var populationSizeControl;
var infectedControl;
var notInfectedControl;
var immuneControl;
var deadControl;
var nhsControl;

var colours = { 
	background: 'black', 
	notInfected: 'green', 
	infected: 'red', 
	immune: 'blue', 
	dead: 'white' 
	}
	  
class Subject {
	
	constructor()	{
		this.infected = 0;
		this.immune = 0;
		this.daysAtRisk = 0;
		this.dead = false;
		this.itsFatal = (random(100) < simParams.deathRate);
		this.isMover = (random(100) < simParams.movers);
		if (random(100) < simParams.startingDistributionPercent)
		{
			this.infected = 1;
			this.daysAtRisk = 1;
		}
	}
	
	infect()
	{
		if (!this.immune && !this.infected)
		{
			if (random(100) < simParams.transmissionChance)
			{
				this.infected = 1;
				this.daysAtRisk = 1;
			}
		}
	}
	
	endOfInfection()
	{
		if (this.itsFatal)
		{
			this.infected = false;
			this.dead = 1;
		} else {
			// If we are being overwhelmed ...
			if (((statistics.infected / statistics.populationSize) * 100) > simParams.overWhelm)
			{
				if (random(100) < simParams.overWhelmDeathRate)
				{
      			   this.infected = false;
			       this.dead = 1;
				   return;	
				}
			}
			this.infected = false;
			this.immune = 1;
		}
	}
	
	loop()
	{
		if (this.infected && !this.dead)
		{
			this.daysAtRisk++;
			if (this.daysAtRisk >= simParams.maxDaysRemainInfectious) 
			{
				this.endOfInfection();
			} 
			else 
			{
			  if (this.daysAtRisk >= simParams.minDaysRemainInfectious) 
			  {
				  // What are the chances of having shifted injection.
				  // Distribute chance between the min and max days
				  if (random(simParams.maxDaysRemainInfectious - simParams.minDaysRemainInfectious) < 1)
				  {
					  this.endOfInfection();
				  }
			  }
			}
		}
	}
	
}

function makeArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}


function toggleDisplay()
{
	if (statsButtonControl.html() == "Show Stats")
	{
		statsDiv.show();
		paramsDiv.hide()
		statsButton.innerHTML = "Show Params";
	} else {
		statsDiv.hide();
		paramsDiv.show()
		statsButton.innerHTML = "Show Stats";
	}
}

function readSimParams()
{
	simParams.subjectDensity = subjectDensityControl.value();
	simParams.startingDistributionPercent = startingDistributionPercentControl.value();
	simParams.infectiousRadius = infectiousRadiusControl.value();
	simParams.minDaysRemainInfectious = minDaysRemainInfectiousControl.value();
	simParams.maxDaysRemainInfectious = maxDaysRemainInfectiousControl.value();
	simParams.transmissionChance = transmissionChanceControl.value();
	
	simParams.deathRate = deathRateControl.value();
	simParams.overWhelm = overWhelmControl.value();
	simParams.overWhelmDeathRate = overWhelmDeathRateControl.value();
	simParams.movers = moversControl.value();
	
	simSize.width = widthControl.value();
	simSize.height = heightControl.value();
	simSize.resolution = resolutionControl.value();
	simSize.speed = speedControl.value();
}

function updateSimParams()
{
  // Setup sim params

  simTitleControl = select('#simTitle');
  simTitleControl.html("C19 Simulation - Day " + day);
  
  subjectDensityControl = select('#subjectDensity');
  subjectDensityControl.value(simParams.subjectDensity); 

  startingDistributionPercentControl = select('#startingDistributionPercent');
  startingDistributionPercentControl.value(simParams.startingDistributionPercent);
  
  infectiousRadiusControl = select('#infectiousRadius');
  infectiousRadiusControl.value(simParams.infectiousRadius);
  
  minDaysRemainInfectiousControl = select('#minDaysRemainInfectious');
  minDaysRemainInfectiousControl.value(simParams.minDaysRemainInfectious);

  maxDaysRemainInfectiousControl = select('#maxDaysRemainInfectious');
  maxDaysRemainInfectiousControl.value(simParams.maxDaysRemainInfectious);
  
  transmissionChanceControl = select('#transmissionChance');
  transmissionChanceControl.value(simParams.transmissionChance);
  
  deathRateControl = select('#deathRate');
  deathRateControl.value(simParams.deathRate);
  
  overWhelmControl = select('#overWhelm');
  overWhelmControl.value(simParams.overWhelm);
  
  overWhelmDeathRateControl = select('#overWhelmDeathRate');
  overWhelmDeathRateControl.value(simParams.overWhelmDeathRate);
  
  moversControl = select('#movers');
  moversControl.value(simParams.movers);
  
  widthControl = select('#sim-width');
  widthControl.value(simSize.width);

  heightControl = select('#sim-height');
  heightControl.value(simSize.height);

  resolutionControl = select('#sim-resolution');
  resolutionControl.value(simSize.resolution);

  speedControl = select('#sim-speed');
  speedControl.value(simSize.speed);

}

function setup() {
  
  updateSimParams();

  statsDiv = select('#stats');
  statsDiv.hide();

  paramsDiv = select('#params');
  paramsDiv.show();
  
  populationSizeControl = select('#stats-population');
  infectedControl = select('#stats-infected');
  notInfectedControl = select('#stats-notinfected');
  deadControl = select('#stats-dead');
  immuneControl = select('#stats-immune');
  nhsControl = select('#stats-nhs');
  
  var startButton = select("#startButton");
  startButton.mousePressed(startSketch);
  
  var resetButton = select("#resetButton");
  resetButton.mousePressed(resetSketch);

  statsButtonControl = select("#statsButton");
  statsButtonControl.mousePressed(toggleDisplay);

  init();
  noLoop(); 

}

function startSketch()
{
	init();
	toggleDisplay();
	var startButton = select("#startButton");
	startButton.attribute('disabled', '');
	loop();
}

function init()
{
	readSimParams();
	var canvas = createCanvas(simSize.width, simSize.height);
	canvas.parent('sketch-holder');
	background(colours.background);
	frameRate(int(simSize.speed)); 
	
	zeroStats();
	day = 0;
	cols = floor(width / simSize.resolution);
	rows = floor(height / simSize.resolution);

	grid = makeArray(cols, rows);
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
		// Do we need to create a subject here?
		if (random(100) < simParams.subjectDensity)
			grid[i][j] = new Subject();
		}
	}
}

function resetSketch()
{
	init();
	var startButton = select("#startButton");
	startButton.removeAttribute('disabled');
	noLoop();
	redraw();
}


function infect(grid, next, x, y) {

  let subject = grid[x][y];
  
  if (!subject.infected) return;
  
  for (let i = (-1 * simParams.infectiousRadius); i <= simParams.infectiousRadius; i++) {
    for (let j = (-1 * simParams.infectiousRadius); j <= simParams.infectiousRadius; j++) {
      //let col = (x + i + cols) % cols;
      //let row = (y + j + rows) % rows;
	  let col = (x + i);
      let row = (y + j);
	
	   if (grid[col] == undefined) continue;
	   let candidate = grid[col][row];
	   if (candidate == undefined) continue;
	   candidate.infect();
	   
    }
  }

}

function zeroStats()
{
	statistics.populationSize = 0;
	statistics.infected = 0;
	statistics.notinfected = 0;
	statistics.immune = 0;
	statistics.dead = 0;
	statistics.nhs = 'Coping';
}

function displayStats()
{
	populationSizeControl.html(statistics.populationSize);
	infectedControl.html(statistics.infected);
	notInfectedControl.html(statistics.notinfected);
	immuneControl.html(statistics.immune);
	deadControl.html(statistics.dead);
	nhsControl.html(statistics.nhs);

}

function calculateStats()
{
	zeroStats();
	
	for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
		  if (grid[i][j] != undefined)
		  {
			statistics.populationSize++;
			if (grid[i][j].dead)
			  {
				statistics.dead++;
				continue;
			  }
			  if (grid[i][j].infected)
			  {
				  statistics.infected++;
			  } else {
				  if (!grid[i][j].immune)
				  	statistics.notinfected++;
			  }
			  if (grid[i][j].immune)
			  {
				  statistics.immune++;
			  }
			  
		  }
	  }
	}
	
	if (((statistics.infected / statistics.populationSize) * 100) > simParams.overWhelm) 
		statistics.nhs = "OVERWHELMED";
	else
		statistics.nhs = "Coping";
}

function draw() {
  
  
  //if (!mouseIsPressed) return;
  //background(0);
  
  
  background(colours.background);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * simSize.resolution;
      let y = j * simSize.resolution;
	  
	  let subject = grid[i][j];
	  
	  if (subject == undefined) continue;
	  
	  let fillType = colours.notInfected;
	  if (subject.infected == 1) fillType = colours.infected;
	  if (subject.immune == 1) fillType = colours.immune;
	  if (subject.dead == 1) fillType = colours.dead;
	  
	  fill(fillType);
	  stroke(0);
	  if (subject.dead) 
		  rect(x, y, simSize.resolution - 1, simSize.resolution - 1);
	  else
	  	circle(x,y,simSize.resolution-1);

	  
    }
  }


  // Process

  let next = makeArray(cols, rows);
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
	  let subject = grid[i][j];
	  
	  if (subject == undefined) continue;

      // Do we infect anyone?

      infect(grid, next, i, j);
	  
	  subject.loop();
	  
	  // Do we need to move ?
	  if (!subject.dead && subject.isMover)
	  {
		  direction = floor(random(4));
		  if (direction == 0) // N
		  {
			  if (j-1 > 0)
			  {
				  if (grid[i][j-1] == undefined)
				  {
					  grid[i][j-1] = subject;
					  grid[i][j] = undefined;				  
				  }
			  }
		  }
		  if (direction == 1) // E
		  {
			  if (i + 1 < cols)
			  {
				  if (grid[i+1][j] == undefined)
				  {
					  grid[i+1][j] = subject;
					  grid[i][j] = undefined;				  
				  }
			  }
		  }
		  if (direction == 2) // S
		  {
			  if (j+1 < rows)
			  {
				  if (grid[i][j+1] == undefined)
				  {
					  grid[i][j+1] = subject;
					  grid[i][j] = undefined;				  
				  }
			  }
		  }
		  if (direction == 3) // W
		  {
			  if (i-1 > 0)
			  {
				  if (grid[i-1][j] == undefined)
				  {
					  grid[i-1][j] = subject;
					  grid[i][j] = undefined;				  
				  }
			  }
		  }
		  
	  }
	  

      //next[i][j] = subject;

    }
  }
  
  //grid = next;
  calculateStats();
  displayStats();

  simTitleControl.html("Virus Simulation - Day " + day);

  if (statistics.infected <= 0)
  {
	  //dayElement.html("Day " + day + " - outbreak over");
	  simTitleControl.html("Virus Simulation - Day " + day + " - outbreak over");
	  noLoop();
  } else {
    day++;
  }
}
