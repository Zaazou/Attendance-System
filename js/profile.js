const username = localStorage.getItem("username");

let fullName = document.getElementById("fullname");
let position = document.getElementById("position");
let headAddress = document.getElementById("headaddress");
let address = document.getElementById("address");
let headName = document.getElementById("headname");
let email = document.getElementById("email");
let age = document.getElementById("age");
let id = document.getElementById("id");

let body = document.getElementById("employeeData");
fetch(`http://localhost:3000/employees?username=${username}`, {
    method: "GET",
})
    .then((response) => response.json())
    .then((data) => {
        console.log(data[0]) // array of object of every employee
        fullName.innerText = `${data[0].firstName} ${data[0].lastName}`;
        headName.innerText = `${data[0].firstName} ${data[0].lastName}`;
        if (data[0].role == 0) {
            position.innerText = `Employee`;
        } else {
            position.innerText = `Secuirty`;
        }
        address.innerText = `${data[0].address}`;
        headAddress.innerText = `${data[0].address}`;
        email.innerText = `${data[0].email}`;
        age.innerText = `${data[0].age}`;

        fetch(`http://localhost:3000/attendence?employeeId=${data[0].id}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                data.forEach(element => {
                    let tr = document.createElement("tr");

                    let id = document.createElement("td");
                    id.innerText = `${element.employeeId}`;
                    tr.appendChild(id);

                    let date = document.createElement("td");
                    date.innerText = `${element.date}`;
                    tr.appendChild(date);

                    let late = document.createElement("td");
                    late.innerText = `${element.late}`;
                    tr.appendChild(late);

                    let absent = document.createElement("td");
                    if (element.absent == false) {
                        absent.innerHTML = `<i class="fa-sharp fa-solid fa-check"></i>`;
                    } else {
                        absent.innerHTML = `<i class="fa-solid fa-square-xmark"></i>`;
                    }
                    tr.appendChild(absent);

                    let In = document.createElement("td");
                    In.innerText = `${element.in}`;
                    tr.appendChild(In);

                    let out = document.createElement("td");
                    out.innerText = `${element.out}`;
                    tr.appendChild(out);

                    body.appendChild(tr);
                });
            });
    });

let logout = document.getElementById("logout");
logout.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Are you sure you logout!")) {
        window.open("../login.html");
    }
})