function handleSubmit(){
    
    const _fullName = document.getElementById("fullName").value;
    const _email = document.getElementById("email").value;
    const _guests = document.getElementById("guests").value;
    const _date = document.getElementById("date").value;
    const _time = document.getElementById("time").value;

    if(_fullName == "" || _email == "" || _date == "" || _time == ""){
        console.log("Fill in all the input fields");
        return;
    }

    var newReservation = {
        fullName: _fullName,
        email: _email,
        guests: _guests,
        date: _date,
        time: _time
    }

    fetch('http://localhost:5000/insert', {
        headers: {
            'Content-type' : 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(newReservation)
    })
    .then(response => response.json())

}


function checkReservation(value){

    const resModal = document.getElementById("resModal");

    resModal.style.display = "block";

    fetch('http://localhost:5000/search/' + value)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));

}

const search = document.querySelector('#emailConfirm');
let searchValue;

function showConfirmModal(){
    const confirmModal = document.querySelector('#confirm-modal');
    const confirmBtn = document.querySelector('#confirmEmail');

    confirmModal.style.display = "block";

    confirmBtn.onclick = function() {
        searchValue = search.value;
    
        confirmModal.style.display = "none";

        checkReservation(searchValue);

        search.value = "";
    }    

}

const closeConfirm = document.querySelector('#closeConfirm');

closeConfirm.onclick = function(){
    const confirmModal = document.querySelector('#confirm-modal');
    confirmModal.style.display = "none";

}

function loadHTMLTable(data){
    const table = document.querySelector('#reservationTable tbody');


    if(data.length === 0){
        table.innerHTML = "<tr><td class = 'no-data' colspan = '8'>There are no reservations</td></tr>"
        return;
    }

    let tableHtml = "";

    data.forEach(function ({id,fullName, email, guests, date, time}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${fullName}</td>`;
        tableHtml += `<td>${email}</td>`;
        tableHtml += `<td>${guests}</td>`;
        tableHtml += `<td>${new Date(date).toLocaleDateString()}</td>`;
        tableHtml += `<td>${time}</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Cancel</button></td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}

document.querySelector('#reservationTable tbody').addEventListener('click', function(event) {
    if (event.target.className === "delete-row-btn") {
        showDeleteModal(event.target.dataset.id);
    }
    if (event.target.className === "edit-row-btn") {
        showEditModal(event.target.dataset.id);
    }
});

const deleteModal = document.querySelector('#delete-modal');
const confirmDelete = document.querySelector('#confirmDelete');
const closeDelete = document.querySelector('#closeDelete');

function showDeleteModal(id) {
    deleteModal.style.display = "block";

    
    confirmDelete.addEventListener('click', function() {
        
        deleteRowById(id);
    });
}

closeDelete.onclick = function(){
    deleteModal.style.display = "none";
}

function deleteRowById(id) {

        fetch('http://localhost:5000/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            deleteModal.style.display = "none";
            checkReservation(searchValue);
        }
    });

    }


const editModal = document.querySelector('#edit-modal');

function showEditModal(id) {
    editModal.style.display = "block";
    resModal.style.display = "none";

    
    document.querySelectorAll('.update-input').forEach(input => {
        input.setAttribute('data-id', id);
        input.value = '';
    });
}


const cancelBtn = document.querySelector('#cancelBtn');
const updateBtn = document.querySelector('#updateBtn');

cancelBtn.onclick = function() {
    editModal.style.display = "none";
    resModal.style.display = "block";
}

updateBtn.onclick = function() {
    const formInputs = document.querySelectorAll('.update-input');

    const updateData = {};

    formInputs.forEach(input => {
        const value = input.value.trim();

        if (value !== '') {
            const fieldName = input.name;
            updateData[fieldName] = value;
            if(fieldName === 'email'){
                searchValue = value;
            }
        }
    });

    
    updateData.id = document.querySelector('.update-input').getAttribute('data-id');


    if (Object.keys(updateData).length === 1) {
        return;
    }

    fetch('http://localhost:5000/update', {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(updateData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            formInputs.forEach(input => {
                input.value = '';
            });

            editModal.style.display = "none";
            checkReservation(searchValue);
        }
    });
}




function close(){
    resModal.style.display = "none";
}

document.addEventListener('DOMContentLoaded', (event) => {
    const submitBtn = document.getElementById("submitBtn");
    const checkRes = document.getElementById("checkRes");
    const closeBtn = document.getElementById("closeBtn");

    if(submitBtn){
        submitBtn.addEventListener('click',handleSubmit);
    }

    if(checkRes){
        checkRes.addEventListener('click',showConfirmModal);
    }

    if(closeBtn){
        closeBtn.addEventListener('click',close);
    }
});
