var storingData = [];
var storedIndex = [];

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

			// FETCHED DATA
			var filteredData;
			let gettingData = data.cards;

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
			}

			// INDEXES
			function storingIndexes(gridIndex) {
				for (var i = 0; i < [gridIndex].length; i++) {
					storedIndex.push(gridIndex);
				}
			}

			// ADD STYLINGS
			function addStylings(index) {
				document.getElementById("add" + index).style.display = "none";
				document.getElementById("added" + index).style.display = "block";
				document.getElementById("add2" + index).style.display = "none";
				document.getElementById("added2" + index).style.display = "block";
			}

			// REMOVING INDEXES
			function removingIndexes(gridIndex) {
				for (var i = 0; i < [storedIndex].length; i++) {
					if (storedIndex[i] === gridIndex) {
						storedIndex.splice(i, 1);
					}
				}
			}

			// REMOVE STYLINGS
			function removeStylings(index) {
				document.getElementById("add" + index).style.display = "block";
				document.getElementById("added" + index).style.display = "none";
				document.getElementById("add2" + index).style.display = "block";
				document.getElementById("added2" + index).style.display = "none";
			}

			function appendingData(data) {
				let gridData = "";
				let listData = "";

				for (let i = 0; i < data.length; i++) {
					gridData += `<div id="card" class="card">
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
															 <img id="add${i}" class="pointer addBtn" src="../img/add.svg" alt="" />
															 <img id="added${i}" class="pointer addedBtn" src="../img/added.svg" alt="" />
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
					listData += `<div id="list-card" class="list-card">
											<div class="inner-card-mobile d-flex align-items-center">
												<div class="first d-flex align-items-center">
													<p class="architectuurlaag-icon">${data[i].architectuurlaag}</p>
													<h3 class="architectuurlaag-heading">${data[i].activiteiten}<span class="kpi-nummer">${data[i].beheersingsniveaus}</span></h3>
												</div>
												<div class="second d-flex align-items-center">
													<p class="architectuurlaag-paragraaf">${data[i].beschrijving}</p>
													<img id="add2${i}" class="pointer addBtn" src="../img/add.svg" alt="" />
													<img id="added2${i}" class="pointer addedBtn" src="../img/added.svg" alt="" />
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

						// INDEXES
						storingIndexes(gridIndex);

						// EXPORT DATA LISTING
						makingTableToExport();

						// ADD STYLINGS
						addStylings(gridIndex);
					};
				}

				for (var i = 0; i < addBtnList.length; i++) {
					addBtnList[i].onclick = function () {
						listIndex = listAddCard.indexOf(this.getAttribute("id"));

						// INDEXES
						storingIndexes(listIndex);

						// EXPORT DATA LISTING
						makingTableToExport();

						// ADD STYLINGS
						addStylings(listIndex);
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

						// // INDEXES
						removingIndexes(gridIndexRemove);

						// // EXPORT DATA LISTING
						makingTableToExport();

						// REMOVING STYLINGS
						removeStylings(gridIndexRemove);
					};
				}

				for (var i = 0; i < addedBtnList.length; i++) {
					addedBtnList[i].onclick = function () {
						listIndexRemove = listRemoveCard.indexOf(this.getAttribute("id"));

						// // INDEXES
						removingIndexes(listIndexRemove);

						// // EXPORT DATA LISTING
						makingTableToExport();

						// REMOVING STYLINGS
						removeStylings(listIndexRemove);
					};
				}
			}

			// ONCHANGE FUNCTION
			function handleChange() {
				// Read the keyword
				var keyword = keywordInput.value;

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

				gridCards.innerHTML = "";
				listCards.innerHTML = "";
				appendingData(filteredData);

				for (var i = 0; i < storedIndex.length; i++) {
					addStylings(storedIndex[i]);
				}
			}

			// Listen to input and option changes
			keywordInput.addEventListener("input", handleChange);

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
