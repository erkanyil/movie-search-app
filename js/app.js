$(document).ready(()=>{
    
    $("#search").click((e)=>{
        
        getData(1);
    });


    $("#pagination").click((e)=>{
        if (e.target.tagName == 'A'){
            var page = e.target.id;
            getData(page);
        }
        
    });

    // Reset all form data and remove search info
    $("#reset").click((e)=>{
        $("#title").val("");
        $("#year").val("");
        $("#movie-list-result").html("");
        $("#pagination").html("");
        
    });
    
    $('#movie-list-result').on('click', '[id^="info-"]',(e)=>{
        var button = e.currentTarget;
        var smallElement = $(`small#more-${button.id}`)[0];
        
        smallElement.classList.toggle("show");

        if (smallElement.className == "collapse"){
            button.value= "more info";
            button.className = "btn btn-info btn-sm";
        } else {
            button.value = "less info";
            button.className = "btn btn-warning btn-sm";
        }
    });
    
});


// Create content result for search
function createContent(movieMoreInfo){
    if (movieMoreInfo.length>0){
        var content = ``;
        movieMoreInfo.forEach((movie, index)=>{
            movie.Poster = movie.Poster == "N/A" ? "img/no-poster.jpg": movie.Poster;
            content += `<div class="row">
                            <div class="list-group col-md-6 mx-auto">
                                <div class="list-group-item list-group-item-action">  
                                    <div class="media py-2">
                                        <div class="media-left media-top mr-4">
                                            <img src="${movie.Poster}" class="media-object" style="width:80px">
                                        </div>
                                        <div class="media-left info">
                                            <h4 class="media-heading mb-3">${movie.Title}</h4>
                                                <p>Year: ${movie.Year}</p>
                                                <input id="info-${index}" type="button" class="btn btn-info btn-sm" value="more info" />
                                                
                                        </div>
                                    </div>
                                    
                                    <small id="more-info-${index}" class="collapse">
                                        <hr>
                                        <table class="table table-hover">
                                            <tr class="table-secondary">
                                                <th scope="row">imdb:</th>
                                                <td>${movie.imdbRating}</td>
                                                <th scope="row">Director</td>
                                                <td>${movie.Director}</td>
                                            </tr>
                                            <tr class="table-secondary">
                                                <th scope="row">Actors</th>
                                                <td>${movie.Actors}</td>
                                                <th scope="row">Description</td>
                                                <td>${movie.Plot}</td>
                                            </tr>
                                        </table>
                                    </small>
                                </div>
                            </div>
                        </div>
                        <hr class="mt-1 mb-0">`;
        });
        
    } else {
        content = showMessage(0, "danger");
    }
    return content;
}

// Create pagination bar with links
function createPagination(totalPage, activePage){
    var activeClass = "page-item";
    var paginationContent = '';
    paginationContent = `<ul class="pagination pagination-sm">
                        <li class="${activeClass}">
                            <a id="1" class="page-link" href="#">&laquo;</a>
                        </li>`;
    
    for (i=1; i<=totalPage;i++){
        
        if (i==activePage){
            activeClass = "page-item active";
        } else {
            activeClass = "page-item";
        }
        
        paginationContent += `<li class="${activeClass}">
                                <a id="${i}" class="page-link" href="#">${i}</a>
                              </li>`;
    }
    paginationContent += `<li class="${activeClass}">
                            <a id="${totalPage}" class="page-link" href="#">&raquo;</a>
                         </li></ul>`;
                         
    return paginationContent;
}

function getData(page){
    var title = $("#title").val();
    var year = $("#year").val();
    var website = "http://www.omdbapi.com/";
    var apikey = "371bd14e";
    title = title == "" ? "The Matrix": title;
    var movieLessInfo = [];
    var movieMoreInfo = [];

    var imgLoading = $("#movie-list-result");
        imgLoading.html(`<div class="row">
                         <div class="list-group col-md-3 mx-auto">
                            <img src="img/loading-14.gif" />
                         </div>
                         </div>`);

    
        
    
    
    // For movies less data
    $.ajax({
        type:'POST',
        url: website + "?apikey=" + apikey + "&type=movie&s=" + title + "&y=" + year +"&page="+page,
        datatype: "json",
        async:false,
        
        success: (result, status, xhr)=>{
            if (result.Response == "True"){
                movieLessInfo = result.Search;
                if(movieLessInfo.length == 10){
                    totalPage = Math.floor(result.totalResults / movieLessInfo.length) + 1;
                } else{
                    totalPage = Math.floor(result.totalResults / 10) + 1;
                }
            } else{
                totalPage = 0;
                movieLessInfo = [];
            }
        },
        error: (xhr, status, error)=>{
            alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText);
        } 
    });
    
    // For more data for each movie
    if (movieLessInfo.length>0){
        movieLessInfo.forEach((movie, index)=>{
            $.ajax({
                type: 'POST',
                url: website + "?apikey=" + apikey +"&i="+movie.imdbID,
                datatype: "json",
                async:false,
                success: (moreResult, status, xhr)=>{
                    movieMoreInfo[index] = moreResult;
                },
                error: (xhr, status, error)=>{
                    alert("Result: " + status + " " + error + " " + xhr.status + " " + x.statusText);
                }
            });
        });  
    }
    // After fetching and updating all movie data with more information
    // inserting into div as HTML
    setTimeout(function () {
        $("#movie-list-result").html(createContent(movieMoreInfo));
        if (totalPage != 0){
            $("#pagination").html(createPagination(totalPage, page));
        }
    }, 1000);
    
}
// Validate the whether the title is not empty 
function Validate() {
    var errorMessage = "";
    if (title == "") {
        errorMessage += "► Enter a title!";
    }
    return errorMessage;
}


// Show message content as error / warning / info
function showMessage(msgCode, msgType){
    var msgContent = `<div class="row">
                        <div class="list-group col-md-4 mx-auto">
                            <div class="alert alert-dismissible alert-${msgType}">
                                <button type="button" class="close" data-dismiss="alert">&times;</button>
                                    ${messages[msgCode]}
                            </div>
                        </div>
                    </div>`;

    return msgContent;
}




