// function to send email


function searchFunction() {
    var input, filter, table, tr, td, i, alltables;
    alltables = document.querySelectorAll("table[data-name=table]");
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    alltables.forEach(function (table) {
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            if (td) {
                if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    });
}

// function for navbar to be dynamic 
// all divs which have tables of reports
let pendingReport = document.getElementById("pending");
let fullReport = document.getElementById("fullreport");
let monthlyReport = document.getElementById("monthlyreport");
let dailyReport = document.getElementById("dailyreport");

// all navbar buutons
let pendingBtn = document.getElementById("candidates");
let allEmployeesBtn = document.getElementById("fullreportbtn");
let dailyReportBtn = document.getElementById("dailyreportbtn");
let monthlyReportBtn = document.getElementById("monthlyreportbtn")

allEmployeesBtn.addEventListener("click", (e) => {
    pendingBtn.classList.remove("active");
    dailyReportBtn.classList.remove("active");
    monthlyReportBtn.classList.remove("active");
    pendingReport.classList.remove("active");
    dailyReport.classList.remove("active");
    monthlyReport.classList.remove("active");
    e.target.classList.add("active");
    fullReport.classList.add("active");
})
dailyReportBtn.addEventListener("click", (e) => {
    pendingBtn.classList.remove("active");
    monthlyReportBtn.classList.remove("active");
    allEmployeesBtn.classList.remove("active");
    pendingReport.classList.remove("active");
    monthlyReport.classList.remove("active");
    fullReport.classList.remove("active");
    e.target.classList.add("active");
    dailyReport.classList.add("active")

})

monthlyReportBtn.addEventListener("click", (e) => {
    pendingBtn.classList.remove("active");
    dailyReportBtn.classList.remove("active");
    allEmployeesBtn.classList.remove("active");
    pendingReport.classList.remove("active");
    dailyReport.classList.remove("active");
    fullReport.classList.remove("active");
    e.target.classList.add("active");
    monthlyReport.classList.add("active");
})
pendingBtn.addEventListener("click", (e) => {
    monthlyReportBtn.classList.remove("active");
    allEmployeesBtn.classList.remove("active");
    dailyReportBtn.classList.remove("active");
    monthlyReport.classList.remove("active");
    fullReport.classList.remove("active");
    dailyReport.classList.remove("active");
    e.target.classList.add("active");
    pendingReport.classList.add("active");
})

// first table in admin page (pending people who need admin permission)
pendingBody = document.getElementById("allpending");
fetch("http://localhost:3000/employees?accepted=false", {
    method: "GET",
})
    .then((response) => response.json())
    .then((data) => {
        for (let i = 0; i < data.length; i++) {
            let tr = document.createElement("tr");
            pendingBody.appendChild(tr);

            let name = document.createElement("td");
            name.innerText = `${data[i].firstName} ${data[i].lastName}`;
            tr.appendChild(name);

            let email = document.createElement("td");
            email.innerText = data[i].email;
            tr.appendChild(email);

            let age = document.createElement("td");
            age.innerText = data[i].age;
            tr.appendChild(age);

            let postition = document.createElement("td");
            if (data[i].role == 0) {
                postition.innerText = "Employee"
            } else if (data[i].role == 1) {
                postition.innerText = "Secuirty"
            } else {
                postition.innerText = "Admin"
            }
            tr.appendChild(postition)
            // Admin Choose Role of Empolyee
            let role = document.createElement("td");
            role.innerHTML = `
                                <select id='choose-${data[i].id}' class="form-select" aria-label="Default select example">
                                <option selected>Select Employee Role</option>
                                <option value="0">Employee</option>
                                <option value="1">Secuirty</option>
                                <option value="2">Admin</option>
                                </select>
                            `
            tr.appendChild(role)


            // admin accept the pending people
            let confirm = document.createElement("td");
            confirm.innerHTML = `<button id='accept-${data[i].id}' class='btn-success px-2'><i class="fa-sharp fa-solid fa-circle-check"></i></button> <button id= 'delete-${data[i].id}' class='btn-danger px-2'><i class="fa-solid fa-trash"></i></button>`
            tr.appendChild(confirm);

            // admin refuse the pending people
            let deleteBtn = document.getElementById(`delete-${data[i].id}`)
            deleteBtn.addEventListener("click", (e) => {
                let row = e.target.parentElement.parentElement;
                if (window.confirm("Are You Sure to delete this row")) {

                    fetch(`http://localhost:3000/employees/${data[i].id}`, {
                        method: "DELETE",
                        headers: { "Content-type": "application/JSON;charset=UTF-8" },

                    })
                        .then((response) => response.json())
                        .then((data) => {
                            row.remove()
                        })
                }
            })

            let confirmBbtn = document.getElementById(`accept-${data[i].id}`)
            confirmBbtn.addEventListener("click", (e) => {
                let selectTage = document.getElementById(`choose-${data[i].id}`);
                let selectedValue = document.getElementById(`choose-${data[i].id}`).value;


                let row = e.target.parentElement.parentElement;
                if (window.confirm("Are You Sure to accept this employee")) {
                    // send email provided by username and password for employee 
                    Email.send({
                        SecureToken: "e428e1de-2ff9-4bc1-a181-902c34a503b5",
                        To: `${data[i].email}`,
                        From: "abdullahmagdy786@gmail.com",
                        Subject: "This is the subject",
                        Body: `Your Username is ${data[i].username}and password is ${data[i].password}`
                    }).then(
                        message => alert(message)
                    );

                    fetch(`http://localhost:3000/employees/${data[i].id}`, {
                        method: "PATCH",
                        headers: { "Content-type": "application/JSON;charset=UTF-8" },
                        body: JSON.stringify({ accepted: true, role: selectedValue })
                    })
                        .then((response) => response.json())
                        .then((data) => {

                            row.remove();
                        })
                }
            })
        }
    })

// full employee report (Second table in admin page)
fullEmployeeReport = document.getElementById("fullEmployeeReports");

fetch("http://localhost:3000/employees", {
    method: "GET",
})
    .then((response) => response.json())
    .then((data) => {
        for (let i = 0; i < data.length; i++) {
            let tr = document.createElement("tr");
            fullEmployeeReport.appendChild(tr);

            let empName = document.createElement("td");
            empName.innerText = `${data[i].firstName} ${data[i].lastName}`;
            tr.appendChild(empName);

            let email = document.createElement("td");
            email.innerText = data[i].email;
            tr.appendChild(email);

            let age = document.createElement("td");
            age.innerText = data[i].age;
            tr.appendChild(age);

            let postition = document.createElement("td");
            if (data[i].role == 0) {
                postition.innerText = "Employee"
            } else if (data[i].role == 1) {
                postition.innerText = "Secuirty"
            } else {
                postition.innerText = "Admin"
            }
            tr.appendChild(postition)
            let startDate = document.createElement("td");
            startDate.innerText = data[i].startDate;
            tr.appendChild(startDate);
        }
    })

// Daily Report
dailyReportBody = document.getElementById("dailyReport");
const empUsername = document.getElementById("username");
fetch(`http://localhost:3000/employees`, {
    method: "GET",
    headers: { "Content-type": "application/JSON;charset=UTF-8" },
})
    .then((response) => response.json())
    .then((data) => {
        allemp = data;
        userId = allemp[0].id
        let date = new Date();
        let today = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

        fetch(`http://localhost:3000/attendence?date=${today}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                allAttendence = data;
                allemp.forEach((emp) => {
                    let tr = document.createElement("tr");
                    for (let i = 0; i < allAttendence.length; i++) {
                        if (emp.id == allAttendence[i].employeeId) {

                            let empName = document.createElement("td");
                            empName.innerText = `${emp.firstName} ${emp.lastName}`;
                            tr.appendChild(empName);

                            let late = document.createElement("td");
                            late.innerText = allAttendence[i].late;
                            tr.appendChild(late);

                            let absent = document.createElement("td");
                            if (allAttendence[i].absent) {
                                absent.innerText = "Absent"
                            } else {
                                absent.innerText = "Attend"
                            }
                            tr.appendChild(absent);

                            let postition = document.createElement("td");
                            if (emp.role == 0) {
                                postition.innerText = "Employee"
                            } else if (emp.role == 1) {
                                postition.innerText = "Secuirty"
                            } else {
                                postition.innerText = "Admin"
                            }
                            tr.appendChild(postition)
                        }
                    }
                    dailyReportBody.appendChild(tr);
                })
            })
    });

// Monthly Report

let start = new Date(document.getElementById("startrange"));
let end = new Date(document.getElementById("endrange"));

monthlyReportBody = document.getElementById("monthlyReport");

fetch(`http://localhost:3000/employees`, {
    method: "GET",
    headers: { "Content-type": "application/JSON;charset=UTF-8" },
})
    .then((response) => response.json())
    .then((data) => {
        allemp = data;


        let date = new Date();
        let today = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

        fetch(`http://localhost:3000/attendence?date=${today}`, {
            method: "GET",
        })
            .then((response) => response.json())
            .then((data) => {
                allAttendence = data;
                allemp.forEach((emp) => {
                    let tr = document.createElement("tr");
                    for (let i = 0; i < allAttendence.length; i++) {
                        if (emp.id == allAttendence[i].employeeId) {

                            let empName = document.createElement("td");
                            empName.innerText = `${emp.firstName} ${emp.lastName}`;
                            tr.appendChild(empName);

                            let absent = document.createElement("td");
                            let numOfAbsent = 0;
                            if (allAttendence[i].absent == true) {
                                numOfAbsent++;
                            }
                            absent.innerText = `${numOfAbsent}`;
                            tr.appendChild(absent);


                            let attend = document.createElement("td");
                            let numOfAttend = 0;
                            if (allAttendence[i].absent == false) {
                                numOfAttend++;
                            }
                            tr.appendChild(attend);

                            let numberOfLateDays = document.createElement("td");
                            let numOfLateDays = 0
                            if (allAttendence[i].in > "8:30") {
                                numOfLateDays++;
                            }
                            tr.appendChild(numberOfLateDays);
                            let startDate = document.createElement("td");
                            startDate.innerText = `${emp.startDate}`
                            tr.appendChild(startDate)
                        }
                    }
                    monthlyReportBody.appendChild(tr);
                })
            })
    });
let logout = document.getElementById("logout");
logout.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Are you sure you logout!")) {
        window.open("../login.html");
    }
})








