import redditAPI from './redditapi';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const UIresults = document.getElementById('results');

let timerID;

searchForm.addEventListener('submit', e => {
    e.preventDefault();

    // Get the search query
    const searchQuery = searchInput.value;

    // Get the sort type
    const sortBy = document.querySelector('input[name="sortby"]:checked').value;

    // Get the limit
    const searchLimit = document.getElementById('limit').value;

    // Validate the search query
    if(searchQuery === ''){
        showMessage('Please enter a valid search term', 'alert-danger');
    }else{
        // Show Spinner
        showLoader();
        
        // Clear the input
        searchInput.value = '';
    
        // 
        redditAPI.search(searchQuery, sortBy, searchLimit)
        .then(results => {
            let output = '<div class="card-columns mt-3">';
    
            // Loop through each article
            results.forEach(post => {
                const text = truncateText(post.selftext, 100);
                const image = post.preview ? post.preview.images[0].source.url : 'image/reddit.png';
    
                output += `
                    <div class="card">
                        <img class="card-img-top" src="${image}" alt="${post.title}" />
                        <div class="card-body">
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text">${text}</p>
                            <a href="${post.url}" target="_blank" class="btn btn-primary">Read More</a>
                            <hr />
                            <span class="badge badge-secondary">Subreddit: ${post.subreddit}</span>
                            <span class="badge badge-dark">Score: ${post.score}</span>
                        </div>
                    </div>
                `;
            })
    
            output += '</div>';
    
            UIresults.innerHTML = output;
        })
        .catch(err => console.log(err));
    }
})

function showMessage(message, className){
    const alert = document.querySelector('.alert');

    // Remove the previous error element if there is one
    if(alert !==  null){
        alert.remove();
    }

    // Clear the previous timeout
    clearTimeout(timerID);

    // Create an error element
    const div = document.createElement('div');
    div.className = `text-center alert ${className}`;
    div.appendChild(document.createTextNode(message));

    // Display the error element
    const searchContainer = document.getElementById('search-container');
    const search = document.getElementById('search');

    // Insert the new error element
    searchContainer.insertBefore(div, search);

      // Remove the alert error after 3 seconds
      timerID = setTimeout(() => {
        document.querySelector('.alert').remove();
    }, 3000);
}

// Truncate Text
function truncateText(text, limit){
    const shortened = text.indexOf(' ', limit);
    if(shortened === -1) return text;
    return text.substring(0, shortened)
}

// Show the loding spinner
function showLoader(){
    const spinner = document.createElement('img');
    spinner.src = 'image/spinner.gif';
    spinner.className = 'spinner-image';

    document.getElementById('spinner').appendChild(spinner);
}

// Remove the loading spinner
export default function removeLoader(){
    document.querySelector('.spinner-image').remove();
}