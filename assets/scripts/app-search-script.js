/*!
 * Vanilla Javascript Client for Elastic App Search <https://github.com/OneSmallStepfortheWeb/elastic-app-search-javascript-client>
 *
 * Copyright (c) 2021-2022, Niels Molenaar.
 * Licensed under the MIT License.
 * Version 0.1.0
 */

// Get all required Elements
const searchWrapper = document.querySelector("#search-input");
const searchRestult = document.querySelector("#search-result");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector("#suggestion-box");
const icon = searchWrapper.querySelector(".icon");
let linkTag = searchWrapper.querySelector("a");
let webLink;

// Get all Variables
const search_key = document.querySelector("div#search-box").getAttribute("search-key");
const engine_name = document.querySelector("div#search-box").getAttribute("engine-name");
const endpoint = document.querySelector("div#search-box").getAttribute("endpoint");
let endpoint_search = endpoint + '/api/as/v1/engines/' + engine_name + '/search.json';
let endpoint_suggestion = endpoint + '/api/as/v1/engines/' + engine_name + '/query_suggestion';
let _dataSearch = {
    "query": "agenda","result_fields": {
        "content": {
            "snippet": {
                "size": 200,
                "fallback": true}
            },
        "title": {
            "snippet": {
                "size": 100,
                "fallback": true}
        },
        "date": {
            "raw": {}
        },
        "url": {
            "raw": {}
        }
    },
    "page": {
        "size": 20,
        "current": 1
    }
}
let _dataSuggestion = {
    "query": "agenda"
}
let output = "";











// if user press any key and release
inputBox.onkeyup = (e)=>{
    let userData = e.target.value; //user enetered data
    let emptyArray = [];
    if(userData){
        if(e.which == 13) {
            searchWrapper.classList.remove("active"); //hide autocomplete box
            runSearch();
            
        }else {
            setSearchQuery(userData);
            icon.onclick = ()=>{
                searchWrapper.classList.remove("active"); //hide autocomplete box
                runSearch();
                
            }
            //emptyArray = suggestions.filter((data)=>{
            //   //filtering array value and user characters to lowercase and return only those words which are start with user enetered chars
            //    return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
            //});
            emptyArray = emptyArray.map((data)=>{
                // passing return data inside li tag
                return data = `<li>${data}</li>`;
            });
            searchWrapper.classList.add("active"); //show autocomplete box
            _dataSuggestion.query = e.target.value;
            //console.log(getSuggestions());
            getSuggestions();
            //showSuggestions(emptyArray);
            let allList = suggBox.querySelectorAll("li");
            allList.forEach(box => {
                box.addEventListener('click', () => {
                    console.log("bla");
                    select(box);
                    setSearchQuery(box.textContent);
                    runSearch();  
                    //console.log('');
                });
              });
            //for (let i = 0; i < allList.length; i++) {
                //adding onclick attribute in all li tag
            //    allList[i].setAttribute("onclick", "select(this)");
            //}
        }
    }else{
        searchWrapper.classList.remove("active"); //hide autocomplete box
    }
}

function select(element){
    let selectData = element.textContent;
    inputBox.value = selectData;
    setSearchQuery(element.textContent);
    runSearch();
    icon.onclick = ()=>{
        //webLink = `https://www.google.com/search?q=${selectData}`;
        //linkTag.setAttribute("href", webLink);
        //linkTag.click();
        runSearch();    
    }
    searchWrapper.classList.remove("active");
}

function showSuggestions(list){
    let listData;
    if(!list.length){
        userValue = inputBox.value;
        listData = `<li>${userValue}</li>`;
    }else{
      listData = list.join('');
    }
    suggBox.innerHTML = listData;
}

function getSuggestions(){
    fetch(endpoint_suggestion, {
        method: "POST",
        body: JSON.stringify(_dataSuggestion),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + search_key
        }
    })
    //fetch('https://jsonplaceholder.typicode.com/posts')
    .then((res) => res.json())
    .then((data) => {
        documents = data.results.documents;
        console.log(documents);
        let output = '';
        documents.forEach(function(item){
            output += `
            <li onclick="select(this)">${item.suggestion}</li>`;
        });
        console.log(output);
        suggBox.innerHTML = output;
        //suggBox.innerHTML = output;
    })
    
}

function runSearch() {   
    //hier een api call met de zoekterm
    console.log(`runSearch()`);
    fetch(endpoint_search, {
        method: "POST",
        body: JSON.stringify(_dataSearch),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + search_key
        }
    })
    //fetch('https://jsonplaceholder.typicode.com/posts')
    .then((res) => res.json())
    .then((data) => {
        documents = data.results;
        console.log(documents);
        let output = ``;
        documents.forEach(function(item){
            output += `
            <div class="card">
                <table cellspacing="0" cellpadding="0" border="0">
                <tbody>
                <tr>
                    <th>Title:</th>
                        <td>${item.title.snippet}</td>
                    <tr>
                    <tr>
                        <th>Content:</th>
                        <td>${item.content.snippet}</td>
                    <tr>
                    <tr>
                        <th>URL:</th>
                        <td><a href="${item.url.raw}" target="_blank">${item.url.raw}</a></td>
                    <tr>
                </tbody>
                </table>
            </div>`;
        });
        console.log(output);
        //add footer
        output += `<div id="search-result-footer"><span class="powered-by"><small>Powered by </small><span class="logo"><img src="https://images.contentstack.io/v3/assets/bltefdd0b53724fa2ce/blt20a39bcb050f189a/5d0823d3616162aa5a857047/logo-app-search-32-color.svg" class="img-fluid icon-32" alt="Elastic App Search"></span> Elastic App Search</span></div>`
        searchRestult.innerHTML = output;
        //suggBox.innerHTML = output;
    })
}

function setSearchQuery(search_term) {
    _dataSearch.query = search_term;
    console.log(`setSearchQuery()`);
    console.log(_dataSearch);
}