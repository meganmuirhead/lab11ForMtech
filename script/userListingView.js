class userListing {
    constructor() {
        this.search();
    }
    search() {
        let searchBar = document.getElementById('test');
        searchBar.onkeyup = (e) => {
            document.getElementById('testForm').submit();
        }
    }
}
let things = new userListing();