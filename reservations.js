function handleSubmit(){
    
    const _fullName = document.getElementById("fullName").value;
    const _email = document.getElementById("email").value;
    const _guests = document.getElementById("guests").value;
    const _date = document.getElementById("date").value;
    const _time = document.getElementById("time").value;

    var newReservation = {
        fullName: _fullName,
        email: _email,
        guests: _guests,
        date: _date,
        time: _time
    }

    var existingReservations = JSON.parse(localStorage.getItem('reservations')) || [];

    existingReservations.push(newReservation);

    localStorage.setItem('reservations', JSON.stringify(existingReservations));

}

const reservationsTableBody = document.getElementById("reservationTable").getElementsByTagName("tbody")[0];

function populateTable(){

    const resModal = document.getElementById("resModal");

    resModal.style.display = "block";

    var reservations = JSON.parse(localStorage.getItem('reservations')) || [];

    reservationsTableBody.innerHTML = "";

    for(let i = 0; i < reservations.length; i++){
        const newTableRow = reservationsTableBody.insertRow();
        newTableRow.insertCell(0).innerHTML = reservations[i].fullName;
        newTableRow.insertCell(1).innerHTML = reservations[i].email;
        newTableRow.insertCell(2).innerHTML = reservations[i].guests;
        newTableRow.insertCell(3).innerHTML = reservations[i].date;
        newTableRow.insertCell(4).innerHTML = reservations[i].time;
    }
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
        checkRes.addEventListener('click',populateTable);
    }

    if(closeBtn){
        closeBtn.addEventListener('click',close);
    }
});
