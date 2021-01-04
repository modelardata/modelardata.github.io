function addData(e, t, a) { e.data.labels.push(t); var s = 0; e.data.datasets.forEach(e => { e.data.push(a[s++]) }), e.update() } function removeData(e) { for (; e.data.labels.length > 0;)e.data.labels.pop(); e.data.datasets.forEach(e => { for (; e.data.length > 0;)e.data.pop() }), e.options.scales = { yAxes: [{ ticks: { beginAtZero: !0 }, scaleLabel: { display: !0, labelString: e.options.scales.yAxes[0].scaleLabel.labelString } }] }, e.update() } function getNewSelects() { var e, t = ["SELECT name, age, city FROM Persons WHERE age<CLMNOAGE AND age>CLMNOAGESMALLER LIMIT CLMNOLIMIT;", "SELECT * FROM Jobs LIMIT CLMNOLIMIT;", "SELECT * FROM Persons WHERE age=CLMNOAGE AND city='CLMNOCITY' OR age=CLMNOAGE2 LIMIT CLMNOLIMIT;", "SELECT * FROM Persons INNER JOIN Jobs ON Persons.jobid=Jobs.jobid WHERE age=CLMNOAGE LIMIT CLMNOLIMIT;"], a = ["New York", "Irving", "Chicago", "Houston", "Honolulu", "Washington", "Dayton", "Boston", "Reno", "Tampa"], s = ""; for (e = 0; e < t.length; e++) { for (var n = Math.floor(150 * Math.random()), o = Math.floor(150 * Math.random()); n - o > 30 | n - o < 10;)n = Math.floor(150 * Math.random()), o = Math.floor(150 * Math.random()); var l = Math.floor(10 * Math.random()); l = l < 3 ? 3 : l, s += t[e].replace(/CLMNOAGESMALLER/gm, o).replace(/CLMNOAGE2/gm, Math.floor(150 * Math.random())).replace(/CLMNOAGE/gm, n).replace(/CLMNOLIMIT/gm, l).replace(/CLMNOCITY/gm, a[Math.floor(10 * Math.random())]) + "\n" } document.getElementById("statements").value = s.replace(/\n$/, "") } function getNewInserts() { document.getElementById("loginmsg").innerText = "", null == localStorage.getItem("token") && document.getElementById("loginBox").classList.remove("is-hidden"); var e, t = ["CREATE TABLE MyTable (name VARCHAR(255), age int);", "INSERT INTO MyTable (name, age) VALUES ('My Name', 42);", "INSERT INTO MyTable (name, age) VALUES ('Another Name', 13);", "SELECT * FROM MyTable;"], a = ""; for (e = 0; e < t.length; e++)a += t[e] + "\n"; document.getElementById("statements").value = a.replace(/\n$/, "") } function openTab(e, t) { var a, s, n; for (s = document.getElementsByClassName("tabcontent"), a = 0; a < s.length; a++)s[a].style.display = "none"; for (n = document.getElementsByClassName("tablinks"), a = 0; a < n.length; a++)n[a].className = n[a].className.replace("is-active", ""); document.getElementById(t).style.display = "block", document.getElementById(e).classList.add("is-active") } function setBadsqlmsg(e) { document.getElementById("badsqlmsg").innerHTML = e, document.getElementById("badsql").classList.remove("is-hidden") } var columnoms = 0, postgresms = 0; function loadDoc() { openTab("li1", "st1result"), document.getElementById("li2").classList.add("is-hidden"), document.getElementById("li3").classList.add("is-hidden"), document.getElementById("li4").classList.add("is-hidden"), document.getElementById("badsql").classList.add("is-hidden"), columnoms = 0, postgresms = 0; var e = document.getElementById("statements").value; if (e.split("\n").length > 4) setBadsqlmsg("<i class='fas fa-flushed'></i> Please only test with up to 4 statements in this demo of our beta. If you want to go crazy, please download our beta."); else { for (v in e.split("\n")) { if (e.split("\n")[v].toLowerCase().startsWith("drop")) return void setBadsqlmsg("<i class='is-large fas fa-dizzy'></i> That almost ended in a nightmare for us.. please don't DROP our tables."); if (e.split("\n")[v].toLowerCase().startsWith("delete")) return void setBadsqlmsg("<i class='is-large fas fa-sad-tear'></i> Sorry, we can't DELETE yet.."); if (e.split("\n")[v].toLowerCase().startsWith("update")) return void setBadsqlmsg("<i class='is-large fas fa-sad-tear'></i> Sorry, we are not that up-to-date to handle an UPDATE <i class='fas fa-grin-beam-sweat'></i>.."); if (e.split("\n")[v].toLowerCase().includes("union select")) return void setBadsqlmsg("<i class='fas fa-angry'></i> Wow wow wow, wait a minute.. is it just us or is UNION SELECT typically used in SQL Injection attacks? Either way we don't support that yet..<i class='fas fa-grin-tears'></i>") } document.getElementById("results").classList.remove("is-hidden"), document.getElementById("btnExec").classList.add("is-loading"), removeData(myBarChart), removeData(myBarChart2); executeStmt(e, 0) } } function executeStmt(e, t) { var a = new XMLHttpRequest, s = e.split("\n")[0 == t ? 0 : t - 1]; s.toLowerCase().startsWith("select") || 0 != t || (t = 1); var n = s.toLowerCase().startsWith("insert") | s.toLowerCase().startsWith("create table"), o = "e4c171b8-3920-46e7-b759-cef5a563d298"; null != localStorage.getItem("token") && (o = localStorage.getItem("token")), a.open("GET", "https://api.columno.com/db/statement?token=" + o + "&s=" + s, !0), a.onload = function () { var s = a.response; myObj = JSON.parse(s); var o = "", l = "", i = 0; if (t > 0) { if (addData(myBarChart, "Statement " + t, [myObj.ColumnoStats, myObj.PostgreStats]), columnoms += myObj.ColumnoStats, postgresms += myObj.PostgreStats, addData(myBarChart2, "Statement " + t, [1e3 / myObj.ColumnoStats * 735e-7 * 24 * 31, Math.ceil(.001764 * 31), 30]), null != myObj.Error && setBadsqlmsg("<i class='fas fa-surprise'></i> Something went wrong. " + myObj.Error), null != myObj.Data || n || (e.toLowerCase().startsWith("create table") ? setBadsqlmsg("<i class='fas fa-surprise'></i> Something went wrong with the CREATE TABLE. Are you sure it does not already exists?") : setBadsqlmsg("<i class='fas fa-surprise'></i> We don't understand a thing of that SQL. Can you forgive us if we tell you that we are still in Beta 0.1? <i class='fas fa-grin-beam-sweat'></i>")), n) o += "<td>Inserted</td>", o += "</tr>"; else for (x in myObj.Data) { if (0 == i) for (y in Object.keys(myObj.Data[x])) l += "<td>" + Object.keys(myObj.Data[x])[y] + "</td>"; for (y in i++ , Object.keys(myObj.Data[x])) o += "<td>" + myObj.Data[x][Object.keys(myObj.Data[x])[y]] + "</td>"; o += "</tr>" } document.getElementById("tableBody" + t).innerHTML = o, document.getElementById("tableHead" + t).innerHTML = l, document.getElementById("li" + t).classList.remove("is-hidden") } ++t <= e.split("\n").length ? executeStmt(e, t) : (document.getElementById("avgms").innerText = Math.round(100 * Math.abs(columnoms / e.split("\n").length - postgresms / e.split("\n").length)) / 100, document.getElementById("avgcost").innerText = Math.round(1e3 / (columnoms / e.split("\n").length) * 735e-7 * 24 * 31 * 100) / 100, "NaN" == document.getElementById("avgms").innerText && (document.getElementById("avgms").innerText = "0", document.getElementById("avgcost").innerText = "0"), document.getElementById("btnExec").classList.remove("is-loading")) }, a.onerror = function () { e.toLowerCase().startsWith("create table") ? setBadsqlmsg("<i class='fas fa-surprise'></i> Something went wrong with the CREATE TABLE.. Are you sure it does not already exists?<i class='fas fa-grin-beam-sweat'></i>") : setBadsqlmsg("<i class='fas fa-surprise'></i> We don't understand a thing of that SQL. Can you forgive us if we tell you that we are still in Beta 0.1? <i class='fas fa-grin-beam-sweat'></i>"), document.getElementById("btnExec").classList.remove("is-loading") }, a.send() } function checkLogin() { null != localStorage.getItem("token") && (document.getElementById("loggedinas").innerText = "You are logged in.", document.getElementById("loginheaderbox").classList.remove("is-hidden"), document.getElementById("loginheaderboxcreateuser").classList.add("is-hidden")), null == localStorage.getItem("cookiebanner") && document.getElementById("ga-pro").classList.remove("is-hidden") } function loginOut() { localStorage.removeItem("token"), document.getElementById("loginheaderbox").classList.add("is-hidden"), document.getElementById("loginheaderboxcreateuser").classList.remove("is-hidden") } function auth(e) { "Invalid login" != myObj.token ? (localStorage.setItem("token", e), document.getElementById("loginBox").classList.add("is-hidden"), document.getElementById("loginBoxDl").classList.add("is-hidden"), document.getElementById("loggedinas").innerText = "You are logged in.", document.getElementById("loginheaderbox").classList.remove("is-hidden"), document.getElementById("loginheaderboxcreateuser").classList.add("is-hidden")) : document.getElementById("loginmsg").innerText = "Invalid login" } function logIn(e, t) { document.getElementById("loginmsg").innerText = ""; var a = new XMLHttpRequest; a.open("GET", "https://api.columno.com/users/auth?email=" + e + "&password=" + t, !0), a.onload = function () { var e = a.response; myObj = JSON.parse(e), auth(myObj.token) }, a.onerror = function () { document.getElementById("loginmsg").innerText = "Invalid login" }, a.send() } function ValidateEmail(e) { return !!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e) || (alert("You have entered an invalid email address."), !1) } function createUser(e, t) { if (ValidateEmail(e), t.length < 6) return alert("Please create a stronger password."), !1; var a = new XMLHttpRequest; a.open("GET", "https://api.columno.com/users/create?email=" + e + "&password=" + t, !0), a.onload = function () { var e = a.response; myObj = JSON.parse(e), "Email exists" == myObj.token ? (document.getElementById("loginmsg").innerText = "Email already exists.", document.getElementById("loginmsg2").innerText = "Email already exists.") : auth(myObj.token) }, a.onerror = function () { document.getElementById("loginmsg").innerText = "Invalid login" }, a.send() }