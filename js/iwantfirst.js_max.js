 function addData(chart, label, data) {
            chart.data.labels.push(label);
            var i = 0;
            chart.data.datasets.forEach((dataset) => {
                dataset.data.push(data[i++]);
                
            });
            chart.update();
        }

        function removeData(chart) {
            while (chart.data.labels.length > 0) {
                chart.data.labels.pop();
            }
            chart.data.datasets.forEach((dataset) => {
                while (dataset.data.length > 0) { 
                    dataset.data.pop();
                }
                
            });

            chart.options.scales = {
                
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: chart.options.scales.yAxes[0].scaleLabel.labelString
                    }
                    
                }]
            };
            chart.update();
        }

        function getNewSelects() {
            var stmts = ["SELECT name, age, city FROM Persons WHERE age<CLMNOAGE AND age>CLMNOAGESMALLER LIMIT CLMNOLIMIT;", "SELECT * FROM Jobs LIMIT CLMNOLIMIT;",
                "SELECT * FROM Persons WHERE age=CLMNOAGE AND city='CLMNOCITY' OR age=CLMNOAGE2 LIMIT CLMNOLIMIT;", "SELECT * FROM Persons INNER JOIN Jobs ON Persons.jobid=Jobs.jobid WHERE age=CLMNOAGE LIMIT CLMNOLIMIT;"];
            var cities = ["New York", "Irving", "Chicago", "Houston", "Honolulu", "Washington", "Dayton", "Boston", "Reno", "Tampa"];
            var returnV = "";
            var i;
            for (i = 0; i < stmts.length; i++) {
                var randAgeBig = Math.floor(Math.random() * 150);
                var randAgeSmaller = Math.floor(Math.random() * 150);

                while (randAgeBig - randAgeSmaller > 30 | randAgeBig - randAgeSmaller < 10) {
                    randAgeBig = Math.floor(Math.random() * 150);
                    randAgeSmaller = Math.floor(Math.random() * 150);
                }
                var limit = Math.floor(Math.random() * 10);
                limit = limit < 3 ? 3 : limit;
                returnV += stmts[i].replace(/CLMNOAGESMALLER/gm, randAgeSmaller)
                    .replace(/CLMNOAGE2/gm, Math.floor(Math.random() * 150))
                    .replace(/CLMNOAGE/gm, randAgeBig)
                    .replace(/CLMNOLIMIT/gm, limit)
                    .replace(/CLMNOCITY/gm, cities[Math.floor(Math.random() * 10)])+ "\n";
            }

            document.getElementById("statements").value = returnV.replace(/\n$/, "");
        }

        function getNewInserts() {
            document.getElementById("loginmsg").innerText = "";

            if (localStorage.getItem("token") == null) {
                document.getElementById('loginBox').classList.remove('is-hidden');                
            }
           

            var stmts = ["CREATE TABLE MyTable (name VARCHAR(255), age int);", "INSERT INTO MyTable (name, age) VALUES ('My Name', 42);"
                , "INSERT INTO MyTable (name, age) VALUES ('Another Name', 13);"
                , "SELECT * FROM MyTable;"];
            var returnV = "";
            var i;
            for (i = 0; i < stmts.length; i++) {
                returnV += stmts[i] + "\n";
                
            }
            document.getElementById("statements").value = returnV.replace(/\n$/, "");
            //document.getElementById('loginBox').classList.add('is-hidden');

        }

        function openTab(evt, nm) {
            var i, tabcontent, tablinks;

            tabcontent = document.getElementsByClassName("tabcontent");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }

            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace("is-active", "");
            }

            document.getElementById(nm).style.display = "block";

            document.getElementById(evt).classList.add("is-active");
        }

        function setBadsqlmsg(msg) {
            document.getElementById("badsqlmsg").innerHTML = msg;

            document.getElementById("badsql").classList.remove('is-hidden')
        }
        var columnoms = 0;
        var postgresms = 0;
        function loadDoc() {

            openTab('li1', 'st1result');
            document.getElementById("li2").classList.add("is-hidden");
            document.getElementById("li3").classList.add("is-hidden");
            document.getElementById("li4").classList.add("is-hidden");
            document.getElementById("badsql").classList.add('is-hidden')
            columnoms = 0;
            postgresms = 0;
            var stmt = document.getElementById("statements").value;
            if (stmt.split("\n").length > 4) {
                setBadsqlmsg("<i class='fas fa-flushed'></i> Please only test with up to 4 statements in this demo of our beta. If you want to go crazy, please download our beta.");
                return;
            }
            for (v in stmt.split("\n")) {

                if (stmt.split("\n")[v].toLowerCase().startsWith("drop")) {

                    setBadsqlmsg("<i class='is-large fas fa-dizzy'></i> That almost ended in a nightmare for us.. please don't DROP our tables.");
                    return;
                }
                if (stmt.split("\n")[v].toLowerCase().startsWith("delete")) {

                    setBadsqlmsg("<i class='is-large fas fa-sad-tear'></i> Sorry, we can't DELETE yet..");
                    return;
                }
                if (stmt.split("\n")[v].toLowerCase().startsWith("update")) {

                    setBadsqlmsg("<i class='is-large fas fa-sad-tear'></i> Sorry, we are not that up-to-date to handle an UPDATE <i class='fas fa-grin-beam-sweat'></i>..");
                    return;
                }
                if (stmt.split("\n")[v].toLowerCase().includes("union select")) {

                    setBadsqlmsg("<i class='fas fa-angry'></i> Wow wow wow, wait a minute.. is it just us or is UNION SELECT typically used in SQL Injection attacks? Either way we don't support that yet..<i class='fas fa-grin-tears'></i>");
                    return;
                }
            }

            document.getElementById("results").classList.remove("is-hidden");
            document.getElementById("btnExec").classList.add("is-loading");
            removeData(myBarChart);
            removeData(myBarChart2);
            var i = 0;
            executeStmt(stmt, i);
        }


        function executeStmt(stmt, stmtid) {
            var xhttp = new XMLHttpRequest();
            
            var curStmt = stmt.split("\n")[stmtid == 0 ? 0 : stmtid - 1];
            if (!curStmt.toLowerCase().startsWith("select") && stmtid == 0) {
                stmtid = 1;
            }
            var isInsert = curStmt.toLowerCase().startsWith("insert") | curStmt.toLowerCase().startsWith("create table") ;
            var token = "e4c171b8-3920-46e7-b759-cef5a563d298";
            if (localStorage.getItem("token") != null) token = localStorage.getItem("token");   

            xhttp.open("GET", "https://api.columno.com/db/statement?token=" + token + "&s=" + curStmt, true);
            xhttp.onload = function () {

                var jsonResponse = xhttp.response;
                myObj = JSON.parse(jsonResponse);
                var txt = ""
                var headtxt = "";
                var i = 0;

                if (stmtid > 0) {
                    addData(myBarChart, "Statement " + stmtid, [myObj.ColumnoStats, myObj.PostgreStats]);

                    columnoms += myObj.ColumnoStats;
                    postgresms += myObj.PostgreStats;
                    addData(myBarChart2, "Statement " + stmtid, [(1000 / myObj.ColumnoStats) * (0.000147 / 2) * 24 * 31, Math.ceil((0.000147 / 2) * 24 * 31), 30]);

                    if (myObj.Error != null) {
                        setBadsqlmsg("<i class='fas fa-surprise'></i> Something went wrong. " + myObj.Error);
                    }
                    if (myObj.Data == null && !isInsert) {
                        if (stmt.toLowerCase().startsWith("create table"))
                            setBadsqlmsg("<i class='fas fa-surprise'></i> Something went wrong with the CREATE TABLE. Are you sure it does not already exists?");
                        else
                            setBadsqlmsg("<i class='fas fa-surprise'></i> We don't understand a thing of that SQL. Can you forgive us if we tell you that we are still in Beta 0.1? <i class='fas fa-grin-beam-sweat'></i>");

                    }
                    if (!isInsert) {
                        for (x in myObj.Data) {
                            if (i == 0) {
                                /*<tr>
                                    <th><abbr title="Position">Pos</abbr></th>
                                    <th>Name</th>
                                    <th><abbr title="Age">Age</abbr></th>
                                </tr>*/
                                //alert(Object.keys(myObj[x]));

                                for (y in Object.keys(myObj.Data[x])) {
                                    headtxt += "<td>" + Object.keys(myObj.Data[x])[y] + "</td>";
                                }
                            }
                            i++;
                            //txt += "<tr><td>" + i + "</td>";
                            for (y in Object.keys(myObj.Data[x])) {
                                txt += "<td>" + myObj.Data[x][Object.keys(myObj.Data[x])[y]] + "</td>";
                            }
                            txt += "</tr>";
                        }
                    } else {
                        txt += "<td>Inserted</td>";
                        
                        txt += "</tr>";
                    }

                    document.getElementById("tableBody" + stmtid).innerHTML = txt;
                    document.getElementById("tableHead" + stmtid).innerHTML = headtxt;

                    document.getElementById("li" + stmtid).classList.remove("is-hidden");
                }
                stmtid++;
                if (stmtid <= stmt.split("\n").length) {
                    executeStmt(stmt, stmtid);
                } else {
                    // Last statement
                    
                    document.getElementById("avgms").innerText = Math.round(Math.abs((columnoms / stmt.split("\n").length) - (postgresms / stmt.split("\n").length)) * 100) / 100;
                    
                    document.getElementById("avgcost").innerText = Math.round((1000 / (columnoms / stmt.split("\n").length)) * (0.000147 / 2) * 24 * 31 * 100) / 100;
                    if (document.getElementById("avgms").innerText == "NaN") {
                        document.getElementById("avgms").innerText = "0";
                        document.getElementById("avgcost").innerText = "0";
                    }
                    document.getElementById("btnExec").classList.remove("is-loading");
                }
            };
            xhttp.onerror = function () {
                
                if (stmt.toLowerCase().startsWith("create table"))
                    setBadsqlmsg("<i class='fas fa-surprise'></i> Something went wrong with the CREATE TABLE.. Are you sure it does not already exists?<i class='fas fa-grin-beam-sweat'></i>");
                else
                    setBadsqlmsg("<i class='fas fa-surprise'></i> We don't understand a thing of that SQL. Can you forgive us if we tell you that we are still in Beta 0.1? <i class='fas fa-grin-beam-sweat'></i>");
                document.getElementById("btnExec").classList.remove("is-loading");
                return;
            }
            xhttp.send();
        }


        function checkLogin() {
            if (localStorage.getItem("token") != null) {
                document.getElementById('loggedinas').innerText = "You are logged in.";
                document.getElementById("loginheaderbox").classList.remove('is-hidden')
                document.getElementById("loginheaderboxcreateuser").classList.add('is-hidden')

            }
            if (localStorage.getItem("cookiebanner") == null) {
                document.getElementById('ga-pro').classList.remove('is-hidden')
            }

        }

        function loginOut() {
            localStorage.removeItem("token");
            document.getElementById("loginheaderbox").classList.add('is-hidden')
            document.getElementById("loginheaderboxcreateuser").classList.remove('is-hidden')
            

        }

        function auth(token) {
            if (myObj.token != "Invalid login") {
                localStorage.setItem("token", token);
                document.getElementById('loginBox').classList.add('is-hidden');
                document.getElementById('loginBoxDl').classList.add('is-hidden');
                document.getElementById('loggedinas').innerText = "You are logged in.";
                document.getElementById("loginheaderbox").classList.remove('is-hidden')
                document.getElementById("loginheaderboxcreateuser").classList.add('is-hidden')
            } else {
                document.getElementById("loginmsg").innerText = "Invalid login";
            }
        }

        function logIn(email, password) {
            document.getElementById("loginmsg").innerText = "";
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", "https://api.columno.com/users/auth?email=" + email + "&password=" + password, true);
            xhttp.onload = function () {

                var jsonResponse = xhttp.response;
                myObj = JSON.parse(jsonResponse);
                auth(myObj.token);

                //alert(myObj.token);


            };
            xhttp.onerror = function () {

                document.getElementById("loginmsg").innerText = "Invalid login";
            }
            xhttp.send();
        }

function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    alert("You have entered an invalid email address.")
    return (false)
}
function createUser(email, password) {
    ValidateEmail(email);
    if (password.length < 6) {
        alert("Please create a stronger password.")
        return (false)
    }
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", "https://api.columno.com/users/create?email=" + email + "&password=" + password, true);

            xhttp.onload = function () {

                var jsonResponse = xhttp.response;
                myObj = JSON.parse(jsonResponse);
                if (myObj.token == "Email exists") {
                    document.getElementById("loginmsg").innerText = "Email already exists.";
                    document.getElementById("loginmsg2").innerText = "Email already exists.";
                } else {

                    auth(myObj.token);
                }


            };
            xhttp.onerror = function () {

                document.getElementById("loginmsg").innerText = "Invalid login";
            }
            xhttp.send();
        }
            
