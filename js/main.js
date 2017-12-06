
fb = console.log;





	var gtav = {};

	gtav.cars = {};

	gtav.cars.data = {};
	gtav.cars.data.userdata = null;

	gtav.cars.ui = {};
	gtav.cars.isPageReady = false;
	gtav.cars.isPageLoaded = false;

	gtav.cars.ui.ownedCars = {};
	gtav.cars.ui.ownedCars.orderBy = "position";
	gtav.cars.ui.ownedCars.orderByAsc = true;










	window.fn = {};


	ons.ready(function() {
	});

	$(document).on("init", "#home-page", function(e) {
		//fb("init #home-page");
		gtav.cars.isPageReady = true;
		if (gtav.cars.isPageReady && gtav.cars.isPageLoaded) gtav.cars.ui.refreshOwnedCarsList();
	});

	window.fn.toggleMenu = function() {
		document.getElementById('appSplitter').right.toggle();
	};

	window.fn.loadView = function(index) {
		//fb(index);
		document.getElementById('appTabbar').setActiveTab(index);
		document.getElementById('sidemenu').close();
	};

	window.fn.loadLink = function(url) {
		window.open(url, '_blank');
	};

	/* */
	window.fn.pushPage = function(page, anim) {
		//fb(page);
		if (anim) {
			document.getElementById('appNavigator').pushPage(page.id, { data: { title: page.title }, animation: anim });
		} else {
			document.getElementById('appNavigator').pushPage(page.id, { data: { title: page.title } });
		}
	};
	/* */

	var showDialog = function(id) {
		document.getElementById(id).show();
	};

	var hideDialog = function(id) {
		document.getElementById(id).hide();
	};


	ons.orientation.on("change", function(event) {
		gtav.cars.ui.refreshActiveTab();
	});



	gtav.cars.ui.showInfo = function() {
		showDialog("dialog-info");
	};



	gtav.cars.ui.refreshActiveTab = function() {
		if (document.getElementById('appTabbar')) {
			if (document.getElementById('appTabbar').getActiveTabIndex() == 0) {
				gtav.cars.ui.refreshOwnedCarsList();
			} else if (document.getElementById('appTabbar').getActiveTabIndex() == 1) {
				gtav.cars.ui.refreshCollectionsList();
			} else if (document.getElementById('appTabbar').getActiveTabIndex() == 2) {
				gtav.cars.ui.refreshVehiclesList();
				$("#elemSearchVehicle input").val("").select().focus();
			}
		}
	};


	gtav.cars.ui.eventChangeTabbar = function(tabItem) {
		if (tabItem.getAttribute("page") == "home.html") {
			gtav.cars.ui.refreshOwnedCarsList();
		} else if (tabItem.getAttribute("page") == "collections.html") {
			gtav.cars.ui.refreshCollectionsList();
		} else if (tabItem.getAttribute("page") == "vehicles.html") {
			gtav.cars.ui.refreshVehiclesList();
			$("#elemSearchVehicle input").val("").select().focus();
		}
	};


	gtav.cars.data.addPlateToUserOwned = function(plate) {
		if (gtav.cars.data.userdata) {
			for (var i = 0; i < gtav.cars.data.userdata.length; i++) {
				if (gtav.cars.data.userdata[i] == plate) return;
			}
		} else {
			gtav.cars.data.userdata = [];
		}
		gtav.cars.data.userdata.push(plate);
		if ((typeof(Storage) !== "undefined") && gtav.cars.data.userdata) localStorage.setItem("gtav.cars.data.userdata", gtav.cars.data.userdata.join(","));
	}

	gtav.cars.data.removePlateToUserOwned = function(plate) {
		if (gtav.cars.data.userdata) {
			for (var i = 0; i < gtav.cars.data.userdata.length; i++) {
				if (gtav.cars.data.userdata[i] == plate) {
					gtav.cars.data.userdata.splice(i, 1);
					break;
				}
			}
		}
		if ((typeof(Storage) !== "undefined") && gtav.cars.data.userdata) localStorage.setItem("gtav.cars.data.userdata", gtav.cars.data.userdata.join(","));
	}


	gtav.cars.data.getUserOwnedFromPlate = function(plate) {
		if (gtav.cars.data.userdata) {
			for (var i = 0; i < gtav.cars.data.userdata.length; i++) {
				if (gtav.cars.data.userdata[i] == plate) return true;
			}
		}
		return false;
	}


	gtav.cars.data.getCollectionFromPlate = function(plate) {
		if (gtav.cars.data && gtav.cars.data.collections) {
			for (var i = 0; i < gtav.cars.data.collections.length; i++) {
				for (var j = 0; j < gtav.cars.data.collections[i].cars.length; j++) {
					if (gtav.cars.data.collections[i].cars[j] == plate) {
						return gtav.cars.data.collections[i];
					}
				}
			}
		}
		return null;
	}


	gtav.cars.data.getPlateCompletesUserOwnCollection = function(collection, plate) {
		if (gtav.cars.data.userdata) {
			for (var i = 0; i < collection.cars.length; i++) {
				if ((collection.cars[i] != plate) && ($.inArray(collection.cars[i], gtav.cars.data.userdata) == -1)) return false;
			}
			return true;
		}
		return false;
	}


	gtav.cars.data.getPlateCharacters = function(plate) {
		return plate.toLowerCase().replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5/g, 's').replace(/7/g, 'd').replace(/8/g, 'b');
	}


	gtav.cars.data.searchVehicle = function(data) {
		var result = [];
		data = (data ? data.toLowerCase().replace(/-/g, '') : "");
		var dataPlate = gtav.cars.data.getPlateCharacters(data);
		if (gtav.cars.data && gtav.cars.data.vehicles) {
			for (var i = 0; i < gtav.cars.data.vehicles.length; i++) {
				var name = gtav.cars.data.vehicles[i].name.toLowerCase().replace(/-/g, '');
				var plate = gtav.cars.data.getPlateCharacters(gtav.cars.data.vehicles[i].plate);
				if ((name.indexOf(data) != -1) || (plate.indexOf(dataPlate) != -1)) {
					result.push(gtav.cars.data.vehicles[i]);
				}
			}
		}
		return result;
	}


	gtav.cars.ui.eventElementsListClick = function(event) {
		if (event && event.target) {
			var plate = $(event.target.closest("ons-col.colCar")).attr("data_plate");
			gtav.cars.ui.showVehicleDialog(plate);
		}
	};


	gtav.cars.ui.showVehicleDialog = function(plate) {
		var dataCar = gtav.cars.data.cars[plate];
		if (!dataCar) {
			ons.notification.alert("Vehicle not found");
			return;
		}

		var userOwned = gtav.cars.data.getUserOwnedFromPlate(plate);
		var collection = gtav.cars.data.getCollectionFromPlate(plate);
		var completesCollection = (!!collection && gtav.cars.data.getPlateCompletesUserOwnCollection(collection, plate));
		//fb("userOwned", userOwned); fb("collection", collection); fb("completesCollection", completesCollection);

		var dialog = $("#dialog-vehicle");
		$("#dialog-vehicle .name").text(dataCar.name);
		$("#dialog-vehicle .plate").text(plate);
		$("#dialog-vehicle .image").attr("src", 'img/185x104/' + dataCar.img + '.png');

		$("#dialog-vehicle .btnAdd").toggle(!userOwned).off("click").on("click", function(e) {
			gtav.cars.data.addPlateToUserOwned(plate);
			gtav.cars.ui.refreshActiveTab();
			hideDialog('dialog-vehicle');
		});
		$("#dialog-vehicle .btnRemove").toggle(userOwned).off("click").on("click", function(e) {
			gtav.cars.data.removePlateToUserOwned(plate);
			gtav.cars.ui.refreshActiveTab();
			hideDialog('dialog-vehicle');
		});
		$("#dialog-vehicle .btnRemoveCollection").toggle(userOwned && completesCollection).off("click").on("click", function(e) {
			var collection = gtav.cars.data.getCollectionFromPlate(plate);
			if (collection && collection.cars) {
				for (var i = 0; i < collection.cars.length; i++) {
					gtav.cars.data.removePlateToUserOwned(collection.cars[i]);
				}
			}
			gtav.cars.ui.refreshActiveTab();
			hideDialog('dialog-vehicle');
		});
		$("#dialog-vehicle .btnStartTimer").toggle(userOwned).off("click").on("click", gtav.cars.ui.timerStart);

		var info = "";
		var range = ((dataCar.range == 0) ? "Standard" : ((dataCar.range == 1) ? "Mid" : ((dataCar.range == 2) ? "Top" : null)));
		var value = (((dataCar.range >= 0) && (dataCar.range <= 2)) ? gtav.cars.data.values[dataCar.range] : 0);
		if (range) info += range + " range<br />";
		if (value) info += "Value: $" + numberWithCommas(value) + "<br />";
		if (dataCar.collectionName) info += "Collection: " + dataCar.collectionName + "<br />";
		if (userOwned) info += "You own this vehicle<br />";
		if (completesCollection) {
			if (userOwned) {
				info += "<b>This collection is complete!</b><br />";
			} else {
				info += "<b>This completes a collection!</b><br />";
			}
		}
		$("#dialog-vehicle .info").html(info);

		var rating = (!!collection ? (completesCollection ? 5 : 4) : (dataCar.range + 1));
		$("#dialog-vehicle .stars").empty(); var stars = document.getElementById('dialog-vehicle-stars'); var starCount = 0; rating = ((rating < 0) ? 0 : ((rating > 5) ? 5 : rating));
		for (var i = 0; i < parseInt(rating); i++) { stars.appendChild(ons.createElement('<ons-icon class="star" icon="ion-android-star, material:ion-android-star"></ons-icon>')); starCount++; }
		if ((rating - parseInt(rating)) > 0) { stars.appendChild(ons.createElement('<ons-icon class="star" icon="ion-android-star-half, material:ion-android-star-half"></ons-icon>')); starCount++; }
		for (var i = 0; i < (5 - starCount); i++) { stars.appendChild(ons.createElement('<ons-icon class="star" icon="ion-android-star-outline, material:ion-android-star-outline"></ons-icon>')); }

		showDialog("dialog-vehicle");
	};


	gtav.cars.ui.timerStart = function() {
		gtav.cars.ui.timerStop();
		gtav.cars.ui.timeStartSell = +new Date();
		gtav.cars.ui.timerRefresh();
		document.querySelector('ons-toast#toastTimer').show();
		gtav.cars.ui.timerSellVehicle = window.setInterval(gtav.cars.ui.timerRefresh, 250);
	};

	gtav.cars.ui.timerStop = function() {
		if (gtav.cars.ui.timerSellVehicle) {
			window.clearInterval(gtav.cars.ui.timerSellVehicle);
			gtav.cars.ui.timerSellVehicle = null;
			gtav.cars.ui.timeStartSell = null;
			$('ons-toast#toastTimer').hide();
		}
	};

	gtav.cars.ui.timerRefresh = function() {
		var remainingtime = ((30 * 60) - ((+new Date()) - gtav.cars.ui.timeStartSell) / 1000);
		if (remainingtime < 0) {
			gtav.cars.ui.timerStop();
		} else {
			var min = parseInt(remainingtime / 60); var sec = parseInt(remainingtime - (min * 60));
			$('ons-toast#toastTimer span').text(("00".substr(("" + min).length)) + min + ":" + ("00".substr(("" + sec).length)) + sec);
		}
	};


	gtav.cars.ui.refreshOwnedCarsList = function(vehicles) {
		//console.log("refreshOwnedCarsList");

		if ((typeof(vehicles) == "undefined") && gtav.cars.data && gtav.cars.data.userdata && (gtav.cars.data.userdata.length > 0)) {
			vehicles = []; for (var i = 0; i < gtav.cars.data.userdata.length; i++) if (gtav.cars.data.cars[gtav.cars.data.userdata[i]]) vehicles.push(gtav.cars.data.cars[gtav.cars.data.userdata[i]]);
			if (gtav.cars.ui.ownedCars.orderBy == "position") {
				if (!gtav.cars.ui.ownedCars.orderByAsc) {
					vehicles = []; for (var i = gtav.cars.data.userdata.length - 1; i >= 0; i--) vehicles.push(gtav.cars.data.cars[gtav.cars.data.userdata[i]]);
				}
			} else {
				vehicles.sort(function(car1, car2) {
					if (gtav.cars.ui.ownedCars.orderBy == "value") {
						if (gtav.cars.ui.ownedCars.orderByAsc) return ((car2.collectionName ? 20000000 : 1) + car2.price) - ((car1.collectionName ? 20000000 : 1) + car1.price);
						return ((car1.collectionName ? 20000000 : 1) + car1.price) - ((car2.collectionName ? 20000000 : 1) + car2.price);
					} else if (gtav.cars.ui.ownedCars.orderBy == "name") {
						if (gtav.cars.ui.ownedCars.orderByAsc) return car1.name.localeCompare(car2.name);
						return car2.name.localeCompare(car1.name);
					} else if (gtav.cars.ui.ownedCars.orderBy == "range") {
						if (gtav.cars.ui.ownedCars.orderByAsc) return car2.range - car1.range;
						return car1.range - car2.range;
					}
				});
			}
			return gtav.cars.ui.refreshOwnedCarsList(vehicles);
		}

		$("ons-toast#toastTimer button").on("click", gtav.cars.ui.timerStop);

		$("#home-page .buttonsOrderBy ons-button ons-icon").attr("icon", null);
		$("#home-page .buttonsOrderBy ons-button[_orderby=" + gtav.cars.ui.ownedCars.orderBy + "] ons-icon").attr("icon", (gtav.cars.ui.ownedCars.orderByAsc ? "ion-arrow-down-b, material:ion-arrow-down-b" : "ion-arrow-up-b, material:ion-arrow-up-b"));

		if (!$("#home-page .buttonsOrderBy").data("bind_ok")) {
			$("#home-page .buttonsOrderBy ons-button").on("click", function(e) {
				var orderby = $(this).attr("_orderby");
				if (orderby == gtav.cars.ui.ownedCars.orderBy) {
					gtav.cars.ui.ownedCars.orderByAsc = !gtav.cars.ui.ownedCars.orderByAsc;
				} else {
					gtav.cars.ui.ownedCars.orderBy = orderby;
					gtav.cars.ui.ownedCars.orderByAsc = true;
				}
				gtav.cars.ui.refreshOwnedCarsList();
			});
			$("#home-page .buttonsOrderBy").data("bind_ok", true);
		}

		var listOwnedCars = document.getElementById('listOwnedCars');
		$(listOwnedCars).empty();

		if (listOwnedCars) {
			var maxCols = 4;
			if (vehicles && (vehicles.length > 0)) {
				$("#elemEmptyGarage").hide();
				var html = '';
				var index = 1;
				for (var i = 0; i < vehicles.length; i++) {
					if (vehicles[i]) {
						if (index == 1) {
							html += '<ons-list-item>';
							html += '	<ons-row class="rowCars">';
						}
						html += gtav.cars.ui.createCarElement(vehicles[i], { maxCols: maxCols, viewOwned: true });
						if ((index >= maxCols) || (i >= (vehicles.length - 1))) {
							for (var j = 0; j < (maxCols - index); j++) {
								html += '<ons-col></ons-col>';
							}
							html += '	</ons-row>';
							html += '</ons-list-item>';
							var elementsRow = ons.createElement(html);
							$(elementsRow).on("click", gtav.cars.ui.eventElementsListClick);
							listOwnedCars.appendChild(elementsRow);
							html = '';
							index = 0;
						}
						index++;
					}
				}
			} else {
				$("#elemEmptyGarage").show();
			}
		}

	}


	gtav.cars.ui.refreshCollectionsList = function() {
		//console.log("refreshCollectionsList");

		var listCollections = document.getElementById('listCollections');
		$(listCollections).empty();

		if (gtav.cars.data && gtav.cars.data.collections) {
			for (var i = 0; i < gtav.cars.data.collections.length; i++) {
				var elementsRow = gtav.cars.ui.createCollectionElementRow(gtav.cars.data.collections[i]);
				$(elementsRow).on("click", gtav.cars.ui.eventElementsListClick);
				listCollections.appendChild(elementsRow);
			}
		}

	}


	gtav.cars.ui.createCollectionElementRow = function(dataCollection) {
		var html = '';
		html += '<ons-list-item>';
		html += '	<span class="list-item__title collection_title"><b>' + dataCollection.name + "</b>: " + dataCollection.collector + '<br /></span>';
		html += '	<ons-row class="rowCars">';
		dataCollection.value = dataCollection.bonus;
		for (var i = 0; i < dataCollection.cars.length; i++) {
			if (gtav.cars.data.cars[dataCollection.cars[i]]) {
				var dataCar = gtav.cars.data.cars[dataCollection.cars[i]];
				maxCols = dataCollection.cars.length;
				//maxCols = 4;
				maxCols = ((maxCols < 3) ? 3 : maxCols);
				html += gtav.cars.ui.createCarElement(dataCar, { maxCols: maxCols, viewCollections: true });
				dataCollection.value += dataCar.value;
			}
		}
		//for (var i = 0; i < (4 - dataCollection.cars.length); i++) {
		//	html += '<ons-col></ons-col>';
		//}
		html += '	</ons-row>';
		html += '	<span class="list-item__title collection_info">Collection value: <b>$' + numberWithCommas(dataCollection.value) + '</b>&nbsp;&nbsp;(Bonus: $' + numberWithCommas(dataCollection.bonus) + ')<br /></span>';
		html += '</ons-list-item>';
		return ons.createElement(html);
	};


	gtav.cars.ui.refreshVehiclesList = function(vehicles) {
		//console.log("refreshVehiclesList");

		var listVehicles = document.getElementById('listVehicles');
		$(listVehicles).empty();

		if ((typeof(vehicles) == "undefined") && gtav.cars.data && gtav.cars.data.vehicles) {
			return gtav.cars.ui.refreshVehiclesList(gtav.cars.data.vehicles);
		}

		if (vehicles && (vehicles.length > 0)) {
			var html = '';
			var index = 1;
			for (var i = 0; i < vehicles.length; i++) {
				if (index == 1) {
					html += '<ons-list-item>';
					html += '	<ons-row class="rowCars">';
				}
				html += gtav.cars.ui.createCarElement(vehicles[i], { maxCols: 3, viewVehicles: true });
				if ((index >= 3) || (i >= (vehicles.length - 1))) {
					for (var j = 0; j < (3 - index); j++) {
						html += '<ons-col></ons-col>';
					}
					html += '	</ons-row>';
					html += '</ons-list-item>';
					var elementsRow = ons.createElement(html);
					$(elementsRow).on("click", gtav.cars.ui.eventElementsListClick);
					listVehicles.appendChild(elementsRow);
					html = '';
					index = 0;
				}
				index++;
			}
		}

		if (!$("#elemSearchVehicle").data("bind_ok")) {
			$("#elemSearchVehicle input").on("keyup", function(e) {
				var cars = gtav.cars.data.searchVehicle($(this).val());
				if (e.keyCode == 13) {
					if (cars && (cars.length == 1) && cars[0] && cars[0].plate) {
						gtav.cars.ui.showVehicleDialog(cars[0].plate);
					}
				} else {
					gtav.cars.ui.refreshVehiclesList(cars);
				}
			});
			$("#elemSearchVehicle").data("bind_ok", true);
		}

	}


	gtav.cars.ui.createCarElement = function(dataCar, params) {
		params = params || {};
		params.maxCols = params.maxCols || 4;
		dataCar.value = (((dataCar.range >= 0) && (dataCar.range <= 2)) ? gtav.cars.data.values[dataCar.range] : 0);
		var html = '';
		var userOwned = gtav.cars.data.getUserOwnedFromPlate(dataCar.plate);
		html += '<ons-col class="colCar centered' + ((!!params.viewCollections && !userOwned) ? " overlay" : "") + '" data_plate="' + dataCar.plate + '">';
		var width = parseInt((screen.width - (20 * params.maxCols)) / params.maxCols);
		var height = parseInt((width * 256) / 455);
		var size = ((width > 150) ? ((width > 185) ? "455x256" : "185x104") : "150x84");
		html += '	<div class="image small" style="width:' + width + 'px;height:' + height + 'px;background-image:' + ("url(img/" + size + "/" + dataCar.img + ".png)") + '">';
		if ((!!params.viewOwned || !!params.viewVehicles) && dataCar.collectionName) {
			html += '	<div class="car_icon star" style="background-image:url(img/car_star.png)"></div>';
			if (!!params.viewVehicles && userOwned) {
				html += '	<div class="car_icon check" style="background-image:url(img/car_check.png)"></div>';
			}
		}
		html += '	</div>';
		html += '	<span class="list-item__title name">' + dataCar.name + '<br /></span>';
		html += '	<span class="list-item__title plate">' + dataCar.plate + '<br /></span>';
		html += '	<span class="list-item__subtitle">' + (((dataCar.range == 0) ? "Standard" : ((dataCar.range == 1) ? "Mid" : ((dataCar.range == 2) ? "Top" : "?"))) + " range") + '</span>';
		html += '</ons-col>';
		return html;
	};







	gtav.cars.init = function() {
		//console.log("init");

		//$("body").hide().fadeIn({ duration: 1000 });

		gtav.cars.data.cars = [];
		for (var i = 0; i < gtav.cars.data.vehicles.length; i++) {
if (location.hostname == "127.0.0.1") gtav.cars.data.vehicles[i].img = "no_img";
			gtav.cars.data.cars[gtav.cars.data.vehicles[i].plate] = gtav.cars.data.vehicles[i];
		}

		if (gtav.cars.data && gtav.cars.data.collections) {
			for (var i = 0; i < gtav.cars.data.collections.length; i++) {
				for (var j = 0; j < gtav.cars.data.collections[i].cars.length; j++) {
					if (gtav.cars.data.cars[gtav.cars.data.collections[i].cars[j]]) {
						gtav.cars.data.cars[gtav.cars.data.collections[i].cars[j]].collectionName = gtav.cars.data.collections[i].name;
					}
				}
			}
		}

		gtav.cars.ui.panel = $('<div>').addClass("panelCars").appendTo($("body"));

		gtav.cars.ui.panelCarsList = $('<div>').addClass("panelCarsList").appendTo(gtav.cars.ui.panel);
		gtav.cars.ui.panelCollections = $('<div>').addClass("panelCollections").appendTo(gtav.cars.ui.panel);

		if (typeof(Storage) !== "undefined") {
			gtav.cars.data.userdata = localStorage.getItem("gtav.cars.data.userdata");
			if (gtav.cars.data.userdata) gtav.cars.data.userdata = gtav.cars.data.userdata.split(",");
		}

		gtav.cars.isPageLoaded = true;
		if (gtav.cars.isPageReady && gtav.cars.isPageLoaded) gtav.cars.ui.refreshOwnedCarsList();

		window.scrollTo(0,1);

/* * /
var plate = "B1GM0N3Y";
//plate = "M4K3B4NK";
plate = "D3V1L";
gtav.cars.ui.showVehicleDialog(plate);
/* */
		// old desktop version
		//gtav.cars.drawVehicles();
		//gtav.cars.drawCollections();
	}



	gtav.cars.drawVehicles = function() {
		if (gtav.cars.data && gtav.cars.data.vehicles) {
			var index = 0;
			var panel = null;
			for (var i = 0; i < gtav.cars.data.vehicles.length; i++) {
				if (panel == null) panel = $('<div>').addClass("panelCarsRow").appendTo(gtav.cars.ui.panelCarsList);
				var car = gtav.cars.drawCar(gtav.cars.data.vehicles[i], panel);
				index++; if (index >= 6) { index = 0; panel = null; }
			}
		}
	}


	gtav.cars.drawCollections = function() {
		if (gtav.cars.data && gtav.cars.data.collections) {
			for (var i = 0; i < gtav.cars.data.collections.length; i++) {
				gtav.cars.drawCollection(gtav.cars.data.collections[i]);
			}
		}
	}


	gtav.cars.drawCollection = function(dataCollection) {
		var collection = {};

		collection.panel = $('<div>').addClass("panelCollection").appendTo(gtav.cars.ui.panelCollections);

		collection.panelTitle = $('<div>').addClass("title").appendTo(collection.panel);
		collection.panelImages = $('<div>').addClass("panelImages").appendTo(collection.panel);
		collection.panelBonusInfo = $('<div>').addClass("infoBonus").appendTo(collection.panel);
		collection.panelValueInfo = $('<div>').addClass("infoValue").appendTo(collection.panel);

		dataCollection.value = dataCollection.bonus;

		for (var i = 0; i < dataCollection.cars.length; i++) {
			if (gtav.cars.data.cars[dataCollection.cars[i]]) {
				var dataCar = gtav.cars.data.cars[dataCollection.cars[i]];
				gtav.cars.drawCollectionCar(collection, dataCar);
				dataCollection.value += dataCar.value;
			}
		}

		collection.panelTitle.text(dataCollection.name + ": " + dataCollection.collector);
		collection.panelBonusInfo.text("Collection Bonus: $" + dataCollection.bonus);
		collection.panelValueInfo.text("Collection Value: $" + dataCollection.value);

		return collection;
	}



	gtav.cars.drawCar = function(dataCar, container) {
		var car = {};
		dataCar.value = (((dataCar.range >= 0) && (dataCar.range <= 2)) ? gtav.cars.data.values[dataCar.range] : 0);

		car.panel = $('<div>').addClass("panelCar").data("car", dataCar).appendTo(container);

		car.panelImage = $('<div>').addClass("image small").appendTo(car.panel);
		car.panelTitle = $('<div>').addClass("title").appendTo(car.panel);
		car.panelInfo = $('<div>').addClass("info").appendTo(car.panel);

		//car.panelImage.css("background-image", ("url(img/455x256/" + dataCar.img + ".png)"));
		//car.panelImage.css("background-image", ("url(img/150x84/" + dataCar.img + ".png)"));
		car.panelImage.css("background-image", ("url(img/185x104/" + dataCar.img + ".png)"));
		car.panelTitle.text(dataCar.name + ": " + dataCar.plate);
		car.panelInfo.html("Range: " + ((dataCar.range == 0) ? "Standard" : ((dataCar.range == 1) ? "Mid" : ((dataCar.range == 2) ? "Top" : "?"))) + " ($" + numberWithCommas(dataCar.value) + ")");

		return car;
	}



	gtav.cars.drawCollectionCar = function(collection, dataCar) {
		var car = gtav.cars.drawCar(dataCar, collection.panelImages);

		car.panel.addClass("overlay")
		if (gtav.cars.data.userdata) {
			for (var i = 0; i < gtav.cars.data.userdata.length; i++) {
				if (gtav.cars.data.userdata[i] == dataCar.plate) {
					car.panel.removeClass("overlay");
					break;
				}
			}
		}

		car.panelImage.on("click", function() {
			car.panel.toggleClass("overlay");

			gtav.cars.data.userdata = [];
			$(".panelCar", gtav.cars.ui.panelCollections).each(function(index, element) {
				if (!$(element).hasClass("overlay")) {
					gtav.cars.data.userdata.push($(element).data("car").plate);
				}
			});
			if (typeof(Storage) !== "undefined") {
				localStorage.setItem("gtav.cars.data.userdata", gtav.cars.data.userdata);
			}

		});

		return car;
	}





	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}




	$(window).bind("load", gtav.cars.init);
