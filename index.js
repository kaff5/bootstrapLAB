

Authorization('https://sas.front.kreosoft.space/api/auth', {
    "username": "Dog",
    "password": "catcat"
})
    .then((data) => localStorage.setItem('token', data.access))
    .catch(error => console.error(error))

function Authorization(url, data) {
    return fetch(url, {
        credentials: "same-origin",
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
    })
        .then(response => response.json())
}











function LoadNews() {
    let says = new Map([
        [1, "imagesNews/img-spacex-1.jpg"],
        [2, "imagesNews/Crew-2.png"],
        [3, "imagesNews/falcon9.jpg"],
        [4, "imagesNews/SpaceX-Logo.png"],
    ]);


    src = "imagesNews/img-spacex-1.jpg"
    let response = fetch('https://sas.front.kreosoft.space/api/news')
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            $("#all-news").empty();
            $template = $("#news-template");
            for (let news of json) {
                $newsCard = $template.clone();
                $newsCard.removeClass("d-none");
                $newsCard.attr("id", "news-" + news.id);
                $newsCard.find("#btnID").attr("data-target", "#id" + news.id)
                $newsCard.find("#collapseID").attr("id", "id" + news.id)
                $newsCard.find(".news-title").text(news.title);
                $newsCard.find(".news-content").text(news.content);
                $newsCard.find(".news-tags").text(news.tags);
                $newsCard.find(".news-date").text(getFormattedDate(news.date));
                $newsCard.find(".news-likes").text(news.serviceInfo.likes);
                $("#all-news").append($newsCard);

                $newsCard.find(".btnLike").attr("id","btnLike" + news.id)
                $newsCard.find(".countLIKES").attr("id", "id-for-count" + news.id)

                $newsCard.find("#btnLike" + news.id).on('click', function () { LikeNews(news.id) })
                $newsCard.find("#idforIMG").attr("src", says.get(news.id))


            }
        }).catch(error => console.error(error));
}
function getFormattedDate(datetime) {
    let date = new Date(datetime);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return day + '.' + month + '.' + year;
}


function GetLikes() {
    return response = fetch('https://sas.front.kreosoft.space/api/news')
    .then((response) => {
        return response.json()
    })
    .then((json)=> {
        for (let news of json)
        {
            $("#id-for-count" + news.id).text(news.serviceInfo.likes)
        }
    }).catch(error => console.error(error));
}


function Like(id)
{
    return post('https://sas.front.kreosoft.space/api/News/like', {"id": id})
}

function post(url,data)
{
    return fetch(url, {
        credentials: 'same-origin',
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        })
    })
}



function LikeNews(id) {

    Like(id)
    .then(data => {
        GetLikes()
    })
    .catch(error => console.error(error))
}



LoadNews();
