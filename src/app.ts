// Declare globals from CDN
declare const jsPDF: any;
declare const Chart: any;
declare const autoTable: any;

type ExpenseStructure = {
    categoryOfExpense : string
    discrioptionOfExpense : string,
    hightOfExpense : string,
    dateOfExpense : string,
}
let expenses:ExpenseStructure[] = [];
let filteredList:ExpenseStructure[] = expenses;
function getNav() {
  const navs = document.querySelectorAll("nav");

  for (let i of navs) {
    i.innerHTML = `
    <a  href="index.html">Home</a>
    <a  href="filters.html">Filters</a>
    <a  href="chars.html">Chars</a>
    <a   href="about.html">About</a>`;
  }
}
function loadData() {
  const saved = localStorage.getItem("expenses");
  expenses = saved ? JSON.parse(saved) : [];
  filteredList = expenses;

  renderChart();
  renderData();
  renderFilterTable();
}
function setData(data:object[]) {
  return localStorage.setItem("expenses", JSON.stringify(data));
}

function addExpense(e:Event) {
  e.preventDefault();
  const form = document.querySelector("form") ;
  const categoryOfExpense = (document.getElementById("categoryOfExpense") as HTMLInputElement).value;
  const discrioptionOfExpense = (document.getElementById(
    "discrioptionOfExpense",
  ) as HTMLInputElement).value;
  const hightOfExpense = (document.getElementById("hightOfExpense") as HTMLInputElement).value;
  const dateOfExpense = (document.getElementById("dateOfExpense") as HTMLInputElement).value;
  if (categoryOfExpense == "other") {
    if (discrioptionOfExpense == "") {
      alert(
        'If you select the "Other" category, you must enter a description. ',
      );
      return;
    }
  }
  /// whay i need it
  const currDate = new Date();
  if (!dateOfExpense) {
    alert("Please select a date");
    return;
  }

  if (
    new Date(dateOfExpense).setHours(0, 0, 0, 0) > currDate.setHours(0, 0, 0, 0)
  ) {
    alert("Unable to enter a future date");
    return;
  }

  const expenseObject: ExpenseStructure = {
    categoryOfExpense,
    discrioptionOfExpense,
    hightOfExpense,
    dateOfExpense,
  };
  expenses.push(expenseObject);
  setData(expenses);
  (form as HTMLFormElement).reset();
  renderData();
}

function renderData() {
  const tableOfExpense = document.getElementById("tableOfExpense") as HTMLTableElement;

  if (!tableOfExpense) {
    return;
  }
  tableOfExpense.innerHTML = "";
  expenses.forEach((item) => {
    tableOfExpense.innerHTML += `
    <tr>
    <td>${item.categoryOfExpense}</td>
    <td>${item.discrioptionOfExpense}</td>
    <td>${item.hightOfExpense}</td>
    <td>${item.dateOfExpense}</td>
    <td><button onclick="delet('${item.dateOfExpense}')" class="px-3 btn btn-outline-danger">Delet</button></td>
    <td><button id="editBtn" onclick="edit(this,'${item.dateOfExpense}')" class="px-3 btn btn-outline-primary">Edit</button>
    </td>
    </tr>`;
  });
  renderChart();
}

function delet(date:string) {
  const isConfirmation =  confirm('ar you sure?')
  if(!isConfirmation){
    return
  }
  expenses = expenses.filter((item) => item.dateOfExpense != date);
  setData(expenses);
  renderData();
}

function edit(btn: HTMLButtonElement, data: string) {
  const tr = btn.closest("tr") as HTMLTableRowElement;
  btn.style.border = "5px dashed #cfcf00";
  tr.style.border = "3px dashed #ffff00";
  btn.disabled = true;
  const form = document.querySelector("form");
  window.scrollTo({ top: 0, behavior: "smooth" });
  (document.getElementById("categoryOfExpense") as HTMLInputElement).focus();
  const categoryOfExpense = document.getElementById("categoryOfExpense") as HTMLInputElement;
  const discrioptionOfExpense = document.getElementById(
    "discrioptionOfExpense",
  ) as HTMLInputElement;
  const hightOfExpense = document.getElementById("hightOfExpense") as HTMLInputElement;
  const dateOfExpense = document.getElementById("dateOfExpense") as HTMLInputElement;
  ///i don't find a better way to identify the current expense to edit,so i use the data as an id....
  ///it's not the best way because if there are two expenses with the same date, it will cause a problem, but for this project it's ok(i hope so)
  ///This has happened more than once, and it probably happened on the test as well.
  expenses.forEach((item) => {
    if (item.dateOfExpense == data) {
      categoryOfExpense.value = item.categoryOfExpense;
      discrioptionOfExpense.value = item.discrioptionOfExpense;
      hightOfExpense.value = item.hightOfExpense;
      dateOfExpense.value = item.dateOfExpense;
    }
  });
  const disableBtn = (document.getElementById("btnForAdd") as HTMLButtonElement);
  disableBtn.disabled = true;
  if (!document.getElementById("btnForSave")) {
    const form = document.querySelector("form");
    if (form) {
      form.insertAdjacentHTML(
        "beforeend",
        `
          <button id="btnForSave" type="button" onclick="updateExpense('${data}')" class="btn btn-outline-light mb-3 w-100 mt-1">
            Save Changes
          </button>`,
      );
    }
  }
}

function updateExpense(date:string) {
  const form = document.querySelector("form");
  const disableBtn = (document.getElementById("btnForAdd") as HTMLButtonElement);
  disableBtn.disabled = false;
  (document.getElementById("btnForSave") as HTMLButtonElement).remove();
  const categoryOfExpense = (document.getElementById("categoryOfExpense") as HTMLInputElement).value;
  const discrioptionOfExpense = (document.getElementById(
    "discrioptionOfExpense",
  ) as HTMLInputElement).value;
  const hightOfExpense = (document.getElementById("hightOfExpense") as HTMLInputElement).value;
  const dateOfExpense = (document.getElementById("dateOfExpense") as HTMLInputElement).value;
  const currentExpense = expenses.findIndex(
    (item) => item.dateOfExpense == date,
  );
  /// it's can be a problem if there are more than one....
  // (i don't recognized somthing Problematic behavior but i want to mention it)
  expenses[currentExpense] = {
    categoryOfExpense: (document.getElementById("categoryOfExpense") as HTMLInputElement).value,
    discrioptionOfExpense: (document.getElementById("discrioptionOfExpense") as HTMLInputElement).value,
    hightOfExpense: (document.getElementById("hightOfExpense") as HTMLInputElement).value,
    dateOfExpense: (document.getElementById("dateOfExpense") as HTMLInputElement).value,
  };
  if(form){
  form.reset();
  }
  setData(expenses);
  renderData();
}

function filterExpense(event: Event) {
  event.preventDefault();

  const userYear = (document.getElementById("yearsFilter") as HTMLInputElement).value;
  const userMonth = (document.getElementById("monthFilter") as HTMLInputElement).value;
  const userDay = (document.getElementById("dayFilter") as HTMLInputElement).value;
  const hightFilterValue = (document.getElementById("hightFilter") as HTMLInputElement).value;
  let userMaxHight: number = hightFilterValue == "" ? Infinity : +hightFilterValue;
  filteredList = expenses.filter((item) => {
    let arrayDate = item.dateOfExpense.split("-");
    if (+item.hightOfExpense > +userMaxHight) return false;
    const matchYears = userYear == "" || userYear == arrayDate[0];
    const matchMonth = userMonth == "" || userMonth == arrayDate[1];
    const matchDay = userDay == "" || userDay == arrayDate[2];
    return matchYears && matchMonth && matchDay;
  });
  renderFilterTable();
}
function renderFilterTable() {
  const tableOfFilter = document.getElementById("tableOfFilter");
  if (!tableOfFilter) {
    return;
  }
  tableOfFilter.innerHTML = "";
  filteredList.forEach((item) => {
    tableOfFilter.insertAdjacentHTML(
      "beforeend",
      `<tr>
    <td>${item.categoryOfExpense}</td>
    <td>${item.discrioptionOfExpense}</td>
    <td>${item.hightOfExpense}</td>
    <td>${item.dateOfExpense}</td></tr>`,
    );
  });
}

function renderChart() {
  const ctx = ((document.getElementById("myPieChart")) as HTMLCanvasElement)?.getContext("2d");
  if (!ctx) return;

  const totals = expenses.reduce((acc, curr) => {
    acc[curr.categoryOfExpense] =
      (acc[curr.categoryOfExpense] || 0) + Number(curr.hightOfExpense);
    return acc;
  }, {} as Record<string, number>);

  const myChars = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(totals),
      datasets: [
        {
          label: "expenses category",
          data: Object.values(totals),
          backgroundColor: [
            "#ff6384",
            "#36a2eb",
            "#ffb811",
            "#55c04b",
            "#5500ff",
          ],
        },
      ],
    },
  });
  const chartBar = (document.getElementById("myBarChart") as HTMLCanvasElement)?.getContext("2d");
  if (!chartBar) return;
  const monthlyTotals = expenses.reduce((acc, curr) => {
    const date = new Date(curr.dateOfExpense);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    acc[monthYear] = (acc[monthYear] || 0) + Number(curr.hightOfExpense);
    return acc;
  }, {} as Record<string, number>);

  const sortedMonth = Object.keys(monthlyTotals).sort();

  new Chart(chartBar, {
    type: "line",
    data: {
      labels: sortedMonth,
      datasets: [
        {
          label: "expense Until month",
          data: sortedMonth.map((m) => monthlyTotals[m]),
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
          borderWidth: 2,
        },
      ],
    },
    options: {
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "sum" } },
        x: { title: { display: true, text: "year and month" } },
      },
    },
  });
}

function downloadPDF() {
  
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("My Expenses Report", 14, 15);

  const tableData = expenses.map((item) => [
    item.categoryOfExpense,
    item.discrioptionOfExpense,
    item.hightOfExpense,
    item.dateOfExpense,
  ]);

  autoTable(doc, {
    head: [["Category", "Description", "Amount", "Date"]],
    body: tableData,
    startY: 25,
  });
 
  doc.save("expenses-report.pdf");
}

function downloadCSV() {
  let csvString = `category:,discription:,amount:,date:\n`;
  expenses.forEach((item) => {
    const row = `${item.categoryOfExpense},${item.discrioptionOfExpense},${item.hightOfExpense},${item.dateOfExpense}\n`;
    csvString += row;
  });
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "expenses.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Expose functions globally for HTML onclick/onload handlers
declare global {
  function getNav(): void;
  function loadData(): void;
  function addExpense(e: Event): void;
  function delet(date: string): void;
  function edit(btn: HTMLButtonElement, data: string): void;
  function updateExpense(date: string): void;
  function filterExpense(event: Event): void;
  function downloadPDF(): void;
  function downloadCSV(): void;
}

(window as any).getNav = getNav;
(window as any).loadData = loadData;
(window as any).addExpense = addExpense;
(window as any).delet = delet;
(window as any).edit = edit;
(window as any).updateExpense = updateExpense;
(window as any).filterExpense = filterExpense;
(window as any).downloadPDF = downloadPDF;
(window as any).downloadCSV = downloadCSV;

export {};
