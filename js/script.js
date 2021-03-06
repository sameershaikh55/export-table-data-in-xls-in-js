var storingData = [];
var storedIndex = [];
var activeFilters = [];
var filterbtns = [
	"Alle",
	"Gebruikersinteractie",
	"Organisatieprocessen",
	"Infrastructuur",
	"Software",
	"Hardware interfacing",
];
var filterbtnsicons = [
	"Alle",
	"../img/mobileFilter/i1.svg",
	"../img/mobileFilter/i2.svg",
	"../img/mobileFilter/i3.svg",
	"../img/mobileFilter/i4.svg",
	"../img/mobileFilter/i5.svg",
];

// FILTER BUTTONS
let filterBtn =
	(window.screen.width > 575 &&
		filterbtns
			.map((item) => {
				return `<button id="${item}" class="btn ${
					(item === "Alle" && "all") || ""
				}">${item}</button>`;
			})
			.join("")) ||
	filterbtnsicons
		.map((item, i) => {
			return `<div><button id="${filterbtns[i]}" class="mobile-filter-btn ${
				(item === "Alle" && "all") || ""
			}">
			${(item === "Alle" && item) || `<img src="${item}" alt="" />`}
			</button></div>`;
		})
		.join("");

document.querySelector(".filters").insertAdjacentHTML("afterbegin", filterBtn);
// FILTER BUTTONS END

// Fetch Data.json
function fetchData() {
	fetch("./data/data.json")
		.then((res) => {
			if (!res.ok) {
				throw Error("Error");
			}
			return res.json();
		})
		.then((data) => {
			// SEARCH INPUT
			var keywordInput = document.querySelector("input[name='keyword']");

			// CARDS
			var gridCards = document.querySelector(".grid-cards");
			var listCards = document.querySelector(".list-cards");

			// SORTING ICONS
			var activeSort1 = document.getElementById("activeSort1");
			var nonActiveSort1 = document.getElementById("nonActiveSort1");
			var activeSort2 = document.getElementById("activeSort2");
			var nonActiveSort2 = document.getElementById("nonActiveSort2");

			// POP-UPS
			var previewBtn = document.querySelector(".preview-btn");
			var popUpContainer = document.querySelector(".pop-up-container");
			var popupClose = document.querySelector(".popup-close");
			var popUpInnerBody = document.querySelector(".pop-up-inner-body-inner");

			// FETCHED DATA
			var filteredData;
			let gettingData = data.cards;

			// PREVIEW SECTION START
			function popUpDataTable() {
				let popupTable = storingData
					.map((item, i) => {
						return `
						<div class="pop-list-data-card">
							<div class="top-data">
								<span>${item.architectuurlaag}</span>
								<span class="left-border">${item.activiteiten}</span>
								<span>${item.beheersingsniveaus}</span>
							</div>
							<div>${item.beschrijving}</div>
							${(storingData.length !== i + 1 && "<br /> <hr /> <br />") || ""}
						<div>
					`;
					})
					.join("");

				popUpInnerBody.innerHTML = popupTable;
			}

			previewBtn.addEventListener("click", () => {
				popUpContainer.classList.remove("d-none-popup");
				popUpDataTable();
			});

			popupClose.addEventListener("click", () => {
				popUpContainer.classList.add("d-none-popup");
			});
			// PREVIEW SECTION END

			// RANDOM SORTINGS FOR PAGE LOAD
			gettingData.sort((a, b) => Math.random() - 0.5);
			filteredData && filteredData.sort((a, b) => Math.random() - 0.5);

			// Listen to input and option changes
			keywordInput.addEventListener("input", handleChange);

			nonActiveSort1.addEventListener("click", () => {
				gridCards.style.display = "flex";
				activeSort1.style.display = "block";
				nonActiveSort2.style.display = "block";
				listCards.style.display = "none";
				activeSort2.style.display = "none";
				nonActiveSort1.style.display = "none";
			});

			nonActiveSort2.addEventListener("click", () => {
				listCards.style.display = "flex";
				nonActiveSort1.style.display = "block";
				activeSort2.style.display = "block";
				activeSort1.style.display = "none";
				nonActiveSort2.style.display = "none";
				gridCards.style.display = "none";
			});

			// ADDING DATA TO EXPORT AS TABLE
			function makingTableToExport() {
				let sendingStoredData = "";
				storingData = [];

				for (var i = 0; i < storedIndex.length; i++) {
					storingData.push(gettingData[storedIndex[i]]);
				}
				// EXPORT DATA TABLE
				for (var i = 0; i < storingData.length; i++) {
					sendingStoredData += `
						<tr>
							<td>${storingData[i].activiteiten}</td>
							<td>${storingData[i].architectuurlaag}</td>
							<td>${storingData[i].beheersingsniveaus}</td>
							<td>${storingData[i].beschrijving}</td>
						<tr>
					`;
				}
				document.querySelector("#tblData").innerHTML = sendingStoredData;

				if (storingData.length) {
					previewBtn.classList.remove("d-none-popup");
				} else {
					previewBtn.classList.add("d-none-popup");
				}
			}

			// INDEXES
			function storingIndexes(gridIndex) {
				for (var i = 0; i < [gridIndex].length; i++) {
					storedIndex.push(gridIndex);
				}
			}

			// ADD STYLINGS
			function addStylings(id) {
				document.getElementById("add-" + id).style.display = "none";
				document.getElementById("added-" + id).style.display = "block";
				document.getElementById("add2-" + id).style.display = "none";
				document.getElementById("added2-" + id).style.display = "block";
			}

			// REMOVING INDEXES
			function removingIndexes(gridIndex) {
				for (var i = 0; i < storedIndex.length; i++) {
					if (storedIndex[i] === gridIndex) {
						storedIndex.splice(i, 1);
					}
				}
			}

			// REMOVE STYLINGS
			function removeStylings(id) {
				document.getElementById("add-" + id).style.display = "block";
				document.getElementById("added-" + id).style.display = "none";
				document.getElementById("add2-" + id).style.display = "block";
				document.getElementById("added2-" + id).style.display = "none";
			}

			// GET MATCH
			function getMatch(a, b) {
				var matches = [];

				for (var i = 0; i < a.length; i++) {
					for (var e = 0; e < b.length; e++) {
						if (a[i] === b[e]) matches.push(a[i]);
					}
				}
				return matches;
			}

			// REMOVE STYLINGS
			function filterFunction(method, keyword) {
				if (method === "input" && activeFilters.length === 0) {
					// FILTER METHOD TO SORT
					filteredData = gettingData.filter((item) => {
						return (
							item.architectuurlaag
								.toLowerCase()
								.includes(keyword.toLowerCase()) ||
							item.activiteiten.toLowerCase().includes(keyword.toLowerCase()) ||
							""
						);
					});
				} else if (method === "input" && activeFilters.length !== 0) {
					// // FILTER METHOD TO SORT
					filteredData = gettingData.filter((item) => {
						let filterEntries = activeFilters.filter((item2) => {
							return (
								item.architectuurlaag
									.toLowerCase()
									.includes(item2.toLowerCase()) || ""
							);
						});

						let filteredData =
							(item.architectuurlaag === filterEntries[0] &&
								item.activiteiten
									.toLowerCase()
									.includes(keyword.toLowerCase())) ||
							"";

						return filteredData;
					});
				} else {
					if (keyword.length && keyword[0] !== "Alle") {
						filteredData = gettingData.filter((item) => {
							let filterEntries = keyword.filter((item2) => {
								return (
									item.architectuurlaag
										.toLowerCase()
										.includes(item2.toLowerCase()) || ""
								);
							});
							return item.architectuurlaag === filterEntries[0];
						});
					} else {
						filteredData = [...gettingData];
					}
				}

				gridCards.innerHTML = "";
				listCards.innerHTML = "";
				appendingData(filteredData);

				let filterDataIndexes = filteredData.map((item) => item.id);
				let matchIds = getMatch(storedIndex, filterDataIndexes);

				for (var i = 0; i < matchIds.length; i++) {
					addStylings(matchIds[i]);
				}
			}

			function appendingData(data) {
				let gridData = "";
				let listData = "";

				for (let i = 0; i < data.length; i++) {
					gridData += `<div id="${data[i].id}" class="card">
											 <div class="inner-card">
													 <div class="d-flex w-100 justify-content-between align-items-center flex-wrap">
															 <p class=${
																	(data[i].architectuurlaag ===
																		"Gebruikersinteractie" &&
																		"architectuurlaag-icon-pink") ||
																	(data[i].architectuurlaag ===
																		"Organisatieprocessen" &&
																		"architectuurlaag-icon-blue") ||
																	(data[i].architectuurlaag === "Software" &&
																		"architectuurlaag-icon-green") ||
																	(data[i].architectuurlaag ===
																		"Hardware interfacing" &&
																		"architectuurlaag-icon-yellow") ||
																	(data[i].architectuurlaag ===
																		"Infrastructuur" &&
																		"architectuurlaag-icon-purple")
																}>${data[i].architectuurlaag}</p>
															 <img id="add-${
																	data[i].id
																}" class="pointer addBtn" src="../img/add.svg" alt="" />
															 <img id="added-${
																	data[i].id
																}" class="pointer addedBtn" src="../img/added.svg" alt="" />
													</div>
													 <h3 class="architectuurlaag-heading">${
															data[i].activiteiten
														}<span class="kpi-nummer">${
						data[i].beheersingsniveaus
					}</span></h3>
													 <p class="architectuurlaag-paragraaf">${data[i].beschrijving}</p>
											 </div>
									 </div>`;
				}

				for (let i = 0; i < data.length; i++) {
					listData += `<div id="${data[i].id}" class="list-card">
											<div class="inner-card-mobile d-flex align-items-center">
												<div class="first d-flex align-items-center">
													<p class=${
														(data[i].architectuurlaag ===
															"Gebruikersinteractie" &&
															"architectuurlaag-icon-pink") ||
														(data[i].architectuurlaag ===
															"Organisatieprocessen" &&
															"architectuurlaag-icon-blue") ||
														(data[i].architectuurlaag === "Software" &&
															"architectuurlaag-icon-green") ||
														(data[i].architectuurlaag ===
															"Hardware interfacing" &&
															"architectuurlaag-icon-yellow") ||
														(data[i].architectuurlaag === "Infrastructuur" &&
															"architectuurlaag-icon-purple")
													}>${data[i].architectuurlaag}</p>
													<h3 class="architectuurlaag-heading">${
														data[i].activiteiten
													}<span class="kpi-nummer">${
						data[i].beheersingsniveaus
					}</span></h3>
												</div>
												<div class="second d-flex align-items-center">
													<p class="architectuurlaag-paragraaf">${data[i].beschrijving}</p>
													<img id="add2-${
														data[i].id
													}" class="pointer addBtn" src="../img/add.svg" alt="" />
													<img id="added2-${
														data[i].id
													}" class="pointer addedBtn" src="../img/added.svg" alt="" />
												</div>
											</div>
										</div>`;
				}

				gridCards.innerHTML = gridData;
				listCards.innerHTML = listData;

				// SELECTION FUNCTIONALITY --ADDED--
				var addBtnGrid = document.querySelectorAll(".grid-cards .card .addBtn"),
					addBtnList = document.querySelectorAll(
						".list-cards .list-card .addBtn"
					),
					gridAddCard = [],
					listAddCard = [],
					gridRemoveCard = [],
					listRemoveCard = [],
					listIndex,
					gridIndex,
					listIndexRemove,
					gridIndexRemove;

				// add values to the array
				for (var i = 0; i < addBtnGrid.length; i++) {
					gridAddCard.push(addBtnGrid[i].getAttribute("id"));
					listAddCard.push(addBtnList[i].getAttribute("id"));
				}

				// get selected element index
				for (var i = 0; i < addBtnGrid.length; i++) {
					addBtnGrid[i].onclick = function () {
						gridIndex = gridAddCard.indexOf(this.getAttribute("id"));
						let getID = gridAddCard[gridIndex].split("-")[1];

						// INDEXES
						storingIndexes(getID);

						// EXPORT DATA LISTING
						makingTableToExport();

						// ADD STYLINGS
						addStylings(getID);
						console.log(storedIndex);
					};
				}

				for (var i = 0; i < addBtnList.length; i++) {
					addBtnList[i].onclick = function () {
						listIndex = listAddCard.indexOf(this.getAttribute("id"));
						let getID = listAddCard[listIndex].split("-")[1];

						// INDEXES
						storingIndexes(getID);

						// EXPORT DATA LISTING
						makingTableToExport();

						// ADD STYLINGS
						addStylings(getID);
					};
				}

				// SELECTION FUNCTIONALITY --REMOVE--
				var addedBtnGrid = document.querySelectorAll(
						".grid-cards .card .addedBtn"
					),
					addedBtnList = document.querySelectorAll(
						".list-cards .list-card .addedBtn"
					);

				// add values to the array
				for (var i = 0; i < addedBtnGrid.length; i++) {
					gridRemoveCard.push(addedBtnGrid[i].getAttribute("id"));
					listRemoveCard.push(addedBtnList[i].getAttribute("id"));
				}

				// get selected element index
				for (var i = 0; i < addedBtnGrid.length; i++) {
					addedBtnGrid[i].onclick = function () {
						gridIndexRemove = gridRemoveCard.indexOf(this.getAttribute("id"));
						let getID = gridRemoveCard[gridIndexRemove].split("-")[1];

						// // INDEXES
						removingIndexes(getID);

						// // EXPORT DATA LISTING
						makingTableToExport();

						// REMOVING STYLINGS
						removeStylings(getID);
					};
				}

				for (var i = 0; i < addedBtnList.length; i++) {
					addedBtnList[i].onclick = function () {
						listIndexRemove = listRemoveCard.indexOf(this.getAttribute("id"));
						let getID = listRemoveCard[listIndexRemove].split("-")[1];

						// // INDEXES
						removingIndexes(getID);

						// // EXPORT DATA LISTING
						makingTableToExport();

						// REMOVING STYLINGS
						removeStylings(getID);
					};
				}
			}

			// ONCHANGE FUNCTION
			function handleChange() {
				// Read the keyword
				var keyword = keywordInput.value;

				filterFunction("input", keyword);
			}

			// Listen to input and option changes
			keywordInput.addEventListener("input", handleChange);

			// FILTER BUTTONS
			var filterBtnSelector = document.querySelectorAll(".filters button"),
				filterBtnsList = filterbtns,
				activeBtnindexex = [],
				classesToMakeActive = [
					"all",
					"orange",
					"green",
					"purple",
					"blue",
					"yellow",
				];

			// FILTER LOOP
			for (var i = 0; i < filterBtnSelector.length; i++) {
				filterBtnSelector[i].onclick = function () {
					let activeFilterIndex = filterBtnsList.indexOf(
						this.getAttribute("id")
					);

					if (
						filterBtnSelector[activeFilterIndex].classList.contains(
							classesToMakeActive[activeFilterIndex]
						)
					) {
						for (var i = 0; i < activeFilters.length; i++) {
							if (activeFilters[i] === this.getAttribute("id")) {
								activeFilters.splice(i, 1);
							}
						}
						filterBtnSelector[activeFilterIndex].classList.remove(
							classesToMakeActive[activeFilterIndex]
						);
					} else {
						activeFilters.push(this.getAttribute("id"));
						activeBtnindexex.push(activeFilterIndex);

						filterBtnSelector[activeFilterIndex].classList.add(
							classesToMakeActive[activeFilterIndex]
						);
					}

					if (
						activeFilterIndex === 0 &&
						this.getAttribute("id") === filterbtns[0]
					) {
						for (var i = 0; i < filterbtns.length; i++) {
							filterBtnSelector[i].classList.remove(classesToMakeActive[i]);
						}
						activeFilters = [filterbtns[0]];
						filterBtnSelector[0].classList.add(classesToMakeActive[0]);
					} else {
						for (var i = 0; i < filterbtns.length; i++) {
							if (activeFilters[i] === "Alle") {
								activeFilters.splice(i, 1);
							}
						}
						filterBtnSelector[0].classList.remove(classesToMakeActive[0]);
					}

					filterFunction(null, activeFilters);
				};
			}

			// CALLING AN API ON LOAD
			window.onload = appendingData(gettingData);
		})
		.catch((err) => console.log(err));
}

fetchData();

// EXPORTING DATA
function exportTableToExcel(tableID, filename = "") {
	var downloadLink;
	var dataType = "application/vnd.ms-excel";
	var tableSelect = document.getElementById(tableID);
	var tableHTML = tableSelect.outerHTML.replace(/ /g, "%20");

	// Specify file name
	filename = filename ? filename + ".xls" : "excel_data.xls";

	// Create download link element
	downloadLink = document.createElement("a");

	document.body.appendChild(downloadLink);

	if (navigator.msSaveOrOpenBlob) {
		var blob = new Blob(["\ufeff", tableHTML], {
			type: dataType,
		});
		navigator.msSaveOrOpenBlob(blob, filename);
	} else {
		// Create a link to the file
		downloadLink.href = "data:" + dataType + ", " + tableHTML;

		// Setting the file name
		downloadLink.download = filename;

		//triggering the function
		downloadLink.click();
	}
}
