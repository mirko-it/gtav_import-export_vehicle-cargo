<?php

	$__DEBUG__ = true;
	#$__DEBUG__ = false;
	require_once($_SERVER["DOCUMENT_ROOT"] . "/script/debug/debug.php");

	date_default_timezone_set('Europe/Rome');


?>
<!DOCTYPE html>
<html>
<head>

	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=UA-35526439-1"></script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());

		gtag('config', 'UA-35526439-1');
	</script>

	<title>GTA V - Import-export cars</title>

	<link rel="icon" type="image/png" href="favicon-32x32.png" sizes="32x32" />
	<link rel="icon" type="image/png" href="favicon-16x16.png" sizes="16x16" />

	<link rel="stylesheet" href="https://unpkg.com/onsenui/css/onsenui.css">
	<link rel="stylesheet" href="https://unpkg.com/onsenui/css/onsen-css-components.min.css">
	<script src="https://unpkg.com/onsenui/js/onsenui.min.js"></script>

	<script language="JavaScript" type="text/javascript" src="../../../js/lib/jquery/jquery-3.1.1.min.js"></script>

	<script language="JavaScript" type="text/javascript" src="<?php print includeFileNoCache("js/main.js"); ?>"></script>
	<script language="JavaScript" type="text/javascript" src="<?php print includeFileNoCache("js/db.js"); ?>"></script>
	<link type='text/css' rel="stylesheet" href="<?php print includeFileNoCache("css/classes.css"); ?>" />
</head>
<body>

	<ons-navigator id="appNavigator" swipeable swipe-target-width="80px">
		<ons-page>
			<ons-splitter id="appSplitter">
				<ons-splitter-side id="sidemenu" page="sidemenu.html" swipeable side="right" collapse="" width="260px"></ons-splitter-side>
				<ons-splitter-content page="tabbar.html"></ons-splitter-content>
			</ons-splitter>
		</ons-page>
	</ons-navigator>


	<template id="tabbar.html">
		<ons-page id="tabbar-page">
			<ons-toolbar>
				<div class="center">Owned cars</div>
				<div class="right">
					<ons-toolbar-button onclick="fn.toggleMenu()">
						<ons-icon icon="ion-navicon, material:md-menu"></ons-icon>
					</ons-toolbar-button>
				</div>
			</ons-toolbar>
			<ons-tabbar swipeable id="appTabbar" position="auto">
				<ons-tab label="Owned cars" icon="ion-home" page="home.html" active></ons-tab>
				<ons-tab label="Collections" icon="ion-film-marker" page="collections.html"></ons-tab>
				<ons-tab label="Vehicles" icon="ion-model-s" page="vehicles.html"></ons-tab>
			</ons-tabbar>

			<script>
				ons.getScriptPage().addEventListener('prechange', function(event) {
					if (event.target.matches('#appTabbar')) {
						event.currentTarget.querySelector('ons-toolbar .center').innerHTML = event.tabItem.getAttribute('label');
						gtav.cars.ui.eventChangeTabbar(event.tabItem);
					}
				});
			</script>
		</ons-page>
	</template>


	<template id="sidemenu.html">
		<ons-page>
			<div class="profile-pic">
				<img src="img/VehicleCargo.png">
			</div>

			<ons-list>
				<ons-list-item onclick="fn.loadView(0)">
					<div class="left">
						<ons-icon fixed-width class="list-item__icon" icon="ion-home, material:md-home"></ons-icon>
					</div>
					<div class="center">Owned cars</div>
				</ons-list-item>
				<ons-list-item onclick="fn.loadView(1)">
					<div class="left">
						<ons-icon fixed-width class="list-item__icon" icon="ion-film-marker, material:ion-film-marker"></ons-icon>
					</div>
					<div class="center">Collections</div>
				</ons-list-item>
				<ons-list-item onclick="fn.loadView(2)">
					<div class="left">
						<ons-icon fixed-width class="list-item__icon" icon="ion-model-s, material:ion-model-s"></ons-icon>
					</div>
					<div class="center">Vehicles</div>
				</ons-list-item>
				<ons-list-item onclick="gtav.cars.ui.showInfo()">
					<div class="left">
						<ons-icon fixed-width class="list-item__icon" icon="ion-information-circled, material:ion-information-circled"></ons-icon>
					</div>
					<div class="center">Info</div>
				</ons-list-item>
			</ons-list>

			<script>
				ons.getScriptPage().onInit = function() {
					// Set ons-splitter-side animation
					this.parentElement.setAttribute('animation', ons.platform.isAndroid() ? 'overlay' : 'reveal');
				};
			</script>

			<style>
				.profile-pic {
					width: 200px;
					background-color: #fff;
					margin: 20px auto 10px;
					border: 1px solid #999;
					border-radius: 4px;
				}
				.profile-pic > img {
					display: block;
					max-width: 100%;
				}
				ons-list-item {
					color: #444;
				}
			</style>
		</ons-page>
	</template>


	<template id="home.html">
		<ons-page id="home-page">
			<ons-card id="elemEmptyGarage" style="display: none;">
				<div class="title">Your garage is empty</div>
				<div class="content">Go to "Collections" or "Vehicles" tab to select a car</div>
			</ons-card>
			<ons-card class="buttonsOrderBy">
				<ons-button _orderby="value">Value<ons-icon></ons-icon></ons-button>
				<ons-button _orderby="name">Name<ons-icon></ons-icon></ons-button>
				<ons-button _orderby="range">Range<ons-icon></ons-icon></ons-button>
				<ons-button _orderby="position">Position<ons-icon></ons-icon></ons-button>
			</ons-card>
			<ons-list id="listOwnedCars"></ons-list>
		</ons-page>
	</template>


	<template id="collections.html">
		<ons-page id="collections-page">
			<ons-list id="listCollections"></ons-list>
		</ons-page>
	</template>


	<template id="vehicles.html">
		<ons-page id="vehicles-page">
			<ons-card id="elemCardSearchVehicle">
				<ons-search-input id="elemSearchVehicle" maxlength="20" placeholder="Search"></ons-search-input>
			</ons-card>
			<ons-list id="listVehicles"></ons-list>
		</ons-page>
	</template>


	<ons-alert-dialog id="dialog-info">
		<div class="alert-dialog-title">Info</div>
		<div class="alert-dialog-content">Grand Theft Auto V and all vehicles are properties of <a href="http://www.rockstargames.com/" target="_blank">Rockstar Games</a>.</div>
		<div class="alert-dialog-content">Thanks to <a href="http://gta.wikia.com/" target="_blank">GTA Wiki</a> for the images.</div>
		<div class="alert-dialog-content">Write to the author: <a href="mailto:mirko.it@gmail.com" target="_blank">mirko.it</a></div>
		<div class="alert-dialog-footer">
			<button class="alert-dialog-button" onclick="hideDialog('dialog-info')">Close</button>
		</div>
	</ons-alert-dialog>


	<ons-alert-dialog id="dialog-vehicle">
		<div class="badge">
			<img class="list-item__thumbnail image small" src="" style="width:90%;height:auto;">
			<span class="list-item__title name"></span><br />
			<span class="list-item__title plate"></span><br />
			<span class="list-item__subtitle"></span>
		</div>
		<div class="info"></div>
		<div class="stars" id="dialog-vehicle-stars"></div>
		<div class="buttons">
			<ons-button class="btnAdd">GOT IT !</ons-button>
			<ons-button class="btnStartTimer">Start timer</ons-button>
			<ons-button class="btnRemove">It's gone</ons-button>
			<ons-button class="btnRemoveCollection">Collection sold</ons-button>
		</div>
		<div class="alert-dialog-footer">
			<button class="alert-dialog-button" onclick="hideDialog('dialog-vehicle')">Close</button>
		</div>
	</ons-alert-dialog>


	<ons-toast id="toastTimer">
		<span></span><button>Dismiss</button>
	</ons-toast>


</body>
</html>

<?php


	function getUniqueID() {
		return base_convert(uniqid(rand()), 16, 36);
	}



	function includeFileNoCache($filename) {
		if (file_exists($filename)) {
			return $filename ."?". sprintf("%08X", crc32($filename ."-". filemtime($filename) ."-". filesize($filename)));
		}
		return $filename;
	}


/* * /
	set_time_limit(300);


	$folder = "img/";

	#$url = "https://vignette.wikia.nocookie.net/gtawiki/images/8/88/811-GTAO-ImportExport3.png";

	$url_list = [
		"https://vignette.wikia.nocookie.net/gtawiki/images/1/15/811-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/e/e7/811-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/8/88/811-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/e/e3/Alpha-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/1/10/Alpha-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/8/89/Alpha-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/8/80/Banshee900R-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/a/aa/Banshee900R-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/b/bb/Banshee900R-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/7/71/BestiaGTS-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/7/73/BestiaGTS-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/9/90/BestiaGTS-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/1/1c/Cheetah-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/9/9d/Cheetah-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/6/6d/Cheetah-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/7/78/CoquetteBlackFin-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/7/7e/CoquetteBlackFin-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/9/9c/CoquetteBlackFin-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/6/6a/CoquetteClassic-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/1/1c/CoquetteClassic-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/5/53/CoquetteClassic-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/c/c7/EntityXF-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/c/c7/EntityXF-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/c/cd/EntityXF-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/8/8e/ETR1-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/8/87/ETR1-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/f/f5/ETR1-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/0/02/Feltzer-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/0/0f/Feltzer-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/4/48/Feltzer-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/d/d4/FMJ-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/6/6e/FMJ-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/5/51/FMJ-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/2/29/Jester-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/8/8e/Jester-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/0/0e/Jester-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/c/c8/Mamba-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/f/f7/Mamba-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/6/68/Mamba-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/a/a7/Massacro-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/f/f4/Massacro-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/0/08/Massacro-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/3/30/Nightshade-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/3/3e/Nightshade-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/0/08/Nightshade-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/4/4f/Omnis-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/6/69/Omnis-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/5/56/Omnis-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/9/9a/Osiris-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/8/8e/Osiris-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/9/9f/Osiris-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/5/52/Reaper-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/4/42/Reaper-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/9/91/Reaper-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/9/94/RooseveltValor-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/f/f9/RooseveltValor-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/3/32/RooseveltValor-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/0/01/SabreTurboCustom-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/2/2e/SabreTurboCustom-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/6/64/SabreTurboCustom-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/c/ce/Seven70-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/0/06/Seven70-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/3/36/Seven70-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/d/dc/StirlingGT-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/a/ad/StirlingGT-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/b/b0/StirlingGT-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/e/ea/SultanRS-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/7/70/SultanRS-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/2/20/SultanRS-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/6/60/T20-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/3/31/T20-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/3/31/T20-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/2/2b/Tampa-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/c/cd/Tampa-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/9/9f/Tampa-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/2/22/TroposRallye-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/b/b5/TroposRallye-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/a/a3/TroposRallye-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/1/13/TurismoR-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/0/04/TurismoR-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/a/ae/TurismoR-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/7/7d/Tyrus-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/9/91/Tyrus-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/5/58/Tyrus-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/e/ef/Verlierer-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/c/ca/Verlierer-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/6/6e/Verlierer-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/9/9e/X80Proto-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/8/8c/X80Proto-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/1/11/X80Proto-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/4/45/Zentorno-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/c/cd/Zentorno-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/0/02/Zentorno-GTAO-ImportExport3.png",
		"https://vignette.wikia.nocookie.net/gtawiki/images/5/5c/ZType-GTAO-ImportExport1.png", "https://vignette.wikia.nocookie.net/gtawiki/images/6/68/ZType-GTAO-ImportExport2.png", "https://vignette.wikia.nocookie.net/gtawiki/images/1/19/ZType-GTAO-ImportExport3.png"
	];


	for ($i = 0; $i < sizeof($url_list); $i++) { 
		$path_info = pathinfo($url_list[$i]);
		$fileName = $folder . $path_info["basename"];
		#$url_list[$i] .= "/revision/latest/scale-to-width-down/185";
		download($url_list[$i], $fileName);
	}


	function download($url, $path) {
		$fp = fopen ($path, 'w+');
		$ch = curl_init();
		curl_setopt( $ch, CURLOPT_URL, $url );
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, false );
		curl_setopt( $ch, CURLOPT_BINARYTRANSFER, true );
		curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );
		curl_setopt( $ch, CURLOPT_CONNECTTIMEOUT, 10 );
		curl_setopt( $ch, CURLOPT_FILE, $fp );
		curl_exec( $ch );
		curl_close( $ch );
		fclose( $fp );
		if (filesize($path) > 0) return true;
	}

/* */


?>
