// typing text animation
document.addEventListener('DOMContentLoaded', () => {
    const typed = new Typed('#typed-text', {
        strings: ['student', 'researcher', 'chess enthusiast', 'avid reader'],
        typeSpeed: 100, // Typing speed in milliseconds
        backSpeed: 50, // Deleting speed in milliseconds
        loop: true, // Loop infinitely
        startDelay: 1000, // Delay before typing starts
        backDelay: 2000 // Delay before deleting starts
    });
});

// Get elements
const checkbox = document.getElementById('checkbox');
const body = document.body;

// Function to apply the saved theme
function applyTheme(theme) {
    body.classList.toggle('light-mode', theme === 'light');
}

// Function to save the current theme to localStorage
function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}

// Check for saved theme on page load and apply it
window.addEventListener('DOMContentLoaded', (event) => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    checkbox.checked = savedTheme === 'light';
});

// Toggle theme and save preference
checkbox.addEventListener('change', function() {
    const theme = checkbox.checked ? 'light' : 'dark';
    body.classList.toggle('light-mode', theme === 'light');
    saveTheme(theme);
});


// nav bar scroll
window.onscroll = function() {stickyNavbar()};

var navbar = document.querySelector("nav");
var sticky = navbar.offsetTop;

function stickyNavbar() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
}


// Lichess status URLs
var lichessStatusURL = "https://lichess.org/api/users/status?ids=Parth_Bibekar";
var lichessDataURL = "https://lichess.org/api/user/Parth_Bibekar";

// Function to fetch JSON data
function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
}

// Function to update Lichess status
function updateLichess() {
    // Fetch status data
    getJSON(lichessStatusURL, function(err, data) {
        if (err) {
            console.error("Error fetching Lichess status:", err);
            updateLichessCard(null); // Update card with null data
            return;
        }
        // Always update card, even if offline
        updateLichessCard(data[0]);
    });
}

// Function to update Lichess card with data
function updateLichessCard(statusData) {
    var dot = document.getElementById('lichess-status-dot');
    if (!statusData || statusData['online'] !== true) {
        // Offline or no data, show grey dot
        dot.style.backgroundColor = 'rgba(128, 128, 128, 0.3)'; // Transparent grey
        getJSON(lichessDataURL, function(err, userData) {
            if (err) {
                console.error("Error fetching Lichess data:", err);
                return;
            }
            updateRatings(userData);
        });
        return;
    }
    // User is online, show green dot
    dot.style.backgroundColor = '#4CAF50'; // Green color
    // Update ratings if needed
    if (statusData['online']) {
        getJSON(lichessDataURL, function(err, userData) {
            if (err) {
                console.error("Error fetching Lichess data:", err);
                return;
            }
            updateRatings(userData);
        });
    }
}

// Function to update ratings on the Lichess card
function updateRatings(userData) {
    document.getElementById('lichess-rapid').innerHTML = userData['perfs']['rapid']['rating'];
    document.getElementById('lichess-blitz').innerHTML = userData['perfs']['blitz']['rating'];
    document.getElementById('lichess-bullet').innerHTML = userData['perfs']['bullet']['rating'];
    document.getElementById('lichess-puzzle').innerHTML = userData['perfs']['puzzle']['rating'];
    document.getElementById('lichess-960').innerHTML = userData['perfs']['chess960']['rating'];
    document.getElementById('lichess-puzzle-storm').innerHTML = userData['storm']['runs'] ? userData['storm']['runs'] : 0; // Assuming 'runs' gives number of puzzle storms
}

// Call updateLichess initially and then every 20 seconds
updateLichess();
setInterval(updateLichess, 20000);

// Function to fetch Lichess rating history
async function fetchRatingHistory(username) {
    try {
        const response = await fetch(`https://lichess.org/api/user/${username}/rating-history`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to process rating history data and plot with Plotly.js
async function plotRatingHistory(username) {
    const data = await fetchRatingHistory(username);
    if (!data) return;

    // Filter for only Blitz, Bullet, Rapid, and Puzzles
    const categoriesToPlot = ["Blitz", "Bullet", "Rapid", "Puzzles"];
    let plotData = [];

    data.forEach(category => {
        if (categoriesToPlot.includes(category.name)) {
            let ratings = category.points.map(point => point[3]); // Extract ratings (last element in each points array)
            let dates = category.points.map(point => new Date(point[0], point[1], point[2])); // Construct dates from points

            // Create trace for each category
            let trace = {
                x: dates,
                y: ratings,
                mode: 'lines+markers',
                name: category.name,
                line: {
                    shape: 'linear'
                }
            };

            plotData.push(trace);
        }
    });

    // Define layout options
    let layout = {
        title: {
            text: `My live ratings on Lichess`,
            font: {
                color: '#cfcfcf',
                family: 'monospace'
            }
        },
        xaxis: {
            title: {
                text: 'Date',
                font: {
                    color: '#cfcfcf'
                }
            },
            tickfont: {
                color: '#cfcfcf'
            },
            gridcolor: '#444444'
        },
        yaxis: {
            title: {
                text: 'Rating',
                font: {
                    color: '#cfcfcf'
                }
            },
            tickfont: {
                color: '#cfcfcf'
            },
            gridcolor: '#444444'
        },
        paper_bgcolor: '#1e1e1e',
        plot_bgcolor: '#1e1e1e',

        legend: {
            orientation: 'h',  // Set the orientation to horizontal
            x: 0.5,  // Center the legend horizontally
            xanchor: 'center',  // Anchor the legend by its center
            y: 1.15  // Position the legend below the plot
        },
        width: 580,
        // margin: {
            b: 100  // Adjust the bottom margin to accommodate the legend
        // }
    };

    // Plot with Plotly.js
    Plotly.newPlot('plot', plotData, layout);
}

// Call the function to plot rating history for a specific user
plotRatingHistory('Parth_b');

