let zagolovokModel;
let owner;
let idforClick;



let countSpisok = 0;

$(document).ready(function () {
    Authorization('https://sas.front.kreosoft.space/api/auth', {
        "username": "Dog",
        "password": "catcat"
    })
        .then((data) =>
            localStorage.setItem('token', data.accessToken))
        .catch(error => console.error(error))

    function Authorization(url, data) {
        return fetch(url, {
            credentials: "same-origin",
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }),
        })
            .then(response => response.json())
    }
    GetToDoList();

})











$('#clearbuttonforCreatetodo').on('click', function (e) {
    $('#validationDefault01').val("");
});


$('#createbuttonforCreatetodo').on('click', function (e) {
    let nameS = $('#validationDefault01').val();
    e.preventDefault();
    if (nameS.length > 0) {
        postInToDo('https://sas.front.kreosoft.space/api/ToDoList', nameS);
        GetToDoList();

    }



});


$('#clearbutton').on('click', function (e) {
    $('#validationTextarea').val("");
    $('#zagolovokname').val("");
    $('#inputState1').prop('selectedIndex', 0);
    $('#inputState2').prop('selectedIndex', 0);
});

$('#createbutton').on('click', function (e) {


    e.preventDefault();
    let textarea = $('#validationTextarea').val();
    let zagolovok = $('#zagolovokname').val();
    let priority = document.getElementById('inputState1').selectedIndex
    let spisokDEL = document.getElementById('inputState2').selectedIndex // javascript
    var JESTb = 0;
    get('https://sas.front.kreosoft.space/api/ToDoList')
    .then((response) => {
        console.log(response)
        return response.json();
    })
    .then((json) => {
        for (let i = 0; i <= spisokDEL; i++)
        {
            JESTb= json[i].id;
            if (i == spisokDEL)
                PostToDoItem(zagolovok,textarea,priority,JESTb)
        }

    })
    .catch(error => console.error(error));











});



function get(url) {
    return fetch(url, {
        credentials: "same-origin",
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }),
    })
}

function GetToDoList() {
    get('https://sas.front.kreosoft.space/api/ToDoList')
        .then((response) => {
            return response.json();
        })
        .then((json) => {

            $("#allSPISKI").empty();
            let $template = $("#SPISKI-template");

            for (let list of json) {
                countSpisok += 1;
                let $listToDo = $template.clone();
                $listToDo.removeClass("d-none");
                $listToDo.find(".textForZag").text("Список дел №" + countSpisok + " - " + list.name)
                $listToDo.find(".textForZag").attr("id", "tab" + list.id)
                $listToDo.find(".textForZag").attr("href", "#tabList" + list.id)
                $listToDo.find(".textForZag").attr("aria-controls", "tabList" + list.id)

                if (countSpisok == 1) {
                    $listToDo.find(".textForZag").attr("aria-selected", "true")
                    $listToDo.find(".textForZag").addClass("active")
                }
                else {
                    $listToDo.find(".textForZag").attr("aria-selected", "false")
                }

                $("#allSPISKI").append($listToDo);

            }

            $("#allLists").empty();
            $template = $(".card-templateforINFO");
            countSpisok = 0;

            for (let list of json) {
                countSpisok += 1;
                let $listToDo = $template.clone();
                $listToDo.removeClass("d-none");
                $listToDo.find(".nameForZagf").text("Список дел №" + countSpisok + " - " + list.name)
                $listToDo.attr("id", "tabList" + list.id)
                $listToDo.attr("aria-labelledby", "tab" + list.id)

                $listToDo.find("button").attr("id", "btnForDelToDo" + list.id)
                $listToDo.find("#btnForDelToDo" + list.id).on('click', function () { DelToDo(list.id) })
                $listToDo.find(".listforTODO").attr("id", "listforTODO" + list.id)


                let $templateList = $listToDo.find(".getelem")
                for (let into of list.items)
                {

                    let $templateListDo = $templateList.clone();

                    $templateListDo.removeClass("d-none");
                    $templateListDo.removeClass("getelem");
                    $templateListDo.attr("id",into.id);
                    
                    $templateListDo.find(".zagolovokDo").attr("id",into.id);
                    $templateListDo.find("#"+into.id).text(into.name);
                    $templateListDo.find(".dateDo").attr("id", "date"+into.id);
                    $templateListDo.find("#date"+into.id).text(getFormattedDate(into.createDateTime));



                    if (into.isDone == true)
                    {

                        $templateList = $listToDo.find(".ifComplete")
                        let $test = $templateList.clone();

                        $test.removeClass("d-none");
                        $test.attr("id",into.id);
                        
                        $test.find(".zagolovokDo").attr("id",into.id);
                        $test.find("#"+into.id).text(into.name);
                        $test.find(".dateDo").attr("id", "date"+into.id);
                        $test.find(".descriptionDo").text(into.description);
                        $test.find("#date"+into.id).text(getFormattedDate(into.createDateTime));

                        if (into.priority == 0)
                        {
                            $test.find("#firstWorkKrit").addClass("bg-light");
                        }
                        if(into.priority == 1)
                        {
                            $test.find("#firstWorkKrit").addClass("bg-warning");
                        }
                        if (into.priority == 2)
                        {
                            $test.find("#firstWorkKrit").addClass("bg-danger");
                        }
                        $listToDo.find(".listforTODO").append($test);
                        break;

                    }
                    if (into.priority == 0)
                    {
                        $templateListDo.find("#firstWorkKrit").addClass("bg-light");
                    }
                    if(into.priority == 1)
                    {
                        $templateListDo.find("#firstWorkKrit").addClass("bg-warning");
                    }
                    if (into.priority == 2)
                    {
                        $templateListDo.find("#firstWorkKrit").addClass("bg-danger");
                    }



                    $templateListDo.find(".forCom").attr("id","buttonforCOMPLETE"+into.id)
                    $templateListDo.find(".forCom").removeClass("forCom");
                    $templateListDo.find("#buttonforCOMPLETE"+into.id).on('click',function() {CompleteDo(list.ownerId,into.id)})

                    $templateListDo.find(".fordel").attr("id","buttonforDELETE"+into.id)
                    $templateListDo.find(".fordel").removeClass("fordel");
                    $templateListDo.find("#buttonforDELETE"+into.id).on('click',function() {DeleteDo(list.ownerId,into.id)})


                    $templateListDo.find(".forEDIT").attr("id","buttonforEDIT"+into.id)
                    $templateListDo.find(".forEDIT").removeClass("forEDIT");
                    $templateListDo.find("#buttonforEDIT"+into.id).on('click',function() {EditDo(list.id,into.id,into.description,into.name,into.priority)})


                    
                    $templateListDo.find(".descriptionDo").text(into.description);
    
                    $listToDo.find(".listforTODO").append($templateListDo);
    
                }


                if (countSpisok == 1) {
                    $listToDo.attr("aria-selected", "true")
                    $listToDo.addClass("active")
                    $listToDo.addClass("show")
                }
                else {
                    $listToDo.attr("aria-selected", "false")
                }

                
                $("#allLists").append($listToDo);
            }
            countSpisok = 0;
            $('#inputState2').empty();
            var s= $('#inputState2')
            for (list of json)
            {
                countSpisok +=1;
                s.append(`<option>Список дел №${countSpisok} - ${list.name}</option>`);

            }

            countSpisok = 0;
        }).catch(error => console.error(error));





}




function getFormattedDate(datetime) {
    let date = new Date(datetime);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return day + '.' + month + '.' + year;
}



function EditDo(ownerId,id,description,name,priority) {
    idforClick = id;
    owner = ownerId;
    $('#zagolovokModel').val(name);
    $('#modelSpisok').prop('selectedIndex', priority)
    $('#validationModel').val(description)
}



$('#sumbitFORM').on('click', function (e) {
    e.preventDefault();

    let zagolovok = $('#zagolovokModel').val();;
    let desc = $('#validationModel').val()
    let prir = document.getElementById('modelSpisok').selectedIndex;
    post('https://sas.front.kreosoft.space/api/ToDoItem',
        {
            "id": idforClick,
            "name": zagolovok,
            "description": desc,
            "priority": prir,
            "listId": owner
        }
    )

    GetToDoList();
    location.reload()
});







function CompleteDo(ownerID,id) {
    post('https://sas.front.kreosoft.space/api/ToDoItem/check',{
        "ownerId": ownerID,
        "id": id,
    })
    GetToDoList();
    location.reload()
}



function DeleteDo(ownerID,id)
{
    Delete('https://sas.front.kreosoft.space/api/ToDoItem', {
        "ownerId": ownerID,
        "id": id
    })
    GetToDoList();
    location.reload()
}




function PostToDoItem(zagolovok,textarea,priority,JESTb)
{
   post('https://sas.front.kreosoft.space/api/ToDoItem',
        {
            "id": null,
            "name": zagolovok,
            "description": textarea,
            "priority": priority,
            "listId": JESTb
        }
    )
    GetToDoList();
    location.reload()
}







function DelToDo(id) {
    Delete('https://sas.front.kreosoft.space/api/ToDoList',
        {
            "id": id,
        }
    )
    GetToDoList();
    location.reload()
}

function Delete(url, data) {
    return fetch(url,
        {
            credentials: "same-origin",
            method: 'DELETE',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }),
        })
}









function postInToDo(url, nameForSpisok) {
    post(url,
        {
            "id": null,
            "name": nameForSpisok
        }
    )
        .catch(error => console.error(error))
        location.reload()
}




function post(url, data) {
    return fetch(url, {
        credentials: "same-origin",
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }),
    })
}



