import removeLoader from './index';

export default {
    search: function(searchTerm, sortBy, searchLimit){
        return fetch(`https://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`)
        .then(res => {
            removeLoader();
            return res.json();
        })
        .then(data => data.data.children.map(data => data.data))
        .catch(err => console.log(err))
    }
}