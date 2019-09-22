import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Platform } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal';
import { last } from '@angular/router/src/utils/collection';

// The modal's module of the previous chapter

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss'],
})
export class MapPage implements AfterViewInit {
  @ViewChild('mapCanvas') mapElement: ElementRef;

  constructor(public confData: ConferenceData, public platform: Platform, public modalController: ModalController) {}

  async ngAfterViewInit() {
    const googleMaps = await getGoogleMaps('AIzaSyB8pf6ZdFQj5qw7rc_HSGrhUwQKfIe9ICw');

    const initialPosition = { lat: 6.802136, lng: 80.807801 };

    const mapEle = this.mapElement.nativeElement;

    const map = new googleMaps.Map(mapEle, {
      center: initialPosition,
      zoom: 10,
      mapTypeId: 'terrain',
      restriction: {
        latLngBounds: {
          east: 82,
          north: 10.0,
          south: 5.0,
          west: 79
        },
        strictBounds: true
      },
    });

    const marker = new googleMaps.Marker({
      map,
      position: initialPosition,
      icon:
        // tslint:disable-next-line:max-line-length
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAQlBMVEVMaXFCiv9Civ9Civ9Civ9Civ9Civ9Civ9Civ+Kt/9+r/9Pkv90qf9hnf9Civ9wpv9Ee/+Jtf9Gjf9/sP9Kj/9KXf+JdfukAAAACXRSTlMAGCD7088IcsuTBctUAAAAYUlEQVR4XlWOWQrAIBBDx302d73/VSu0UMxfQsgLAMSEzmGKcGRCkZylBHPyMJQmk44QIRWdVCuxlgQoRNLaoi4ILs/a9m6VszuGf4PSaX21eyD6oZ256/AHa/0L9RauOw+4XAWqGLX26QAAAABJRU5ErkJggg==',
    });

    const allPaths = [];
    const allCliffs = [];
    const allRoads = [];
    const allNoticeAreas = [];

    //set tracks
    this.confData.getPaths().subscribe((mapData: any) => {
      mapData.forEach((path: any) => {
        const track = new googleMaps.Polygon({ paths: path.coordinates });
        allPaths.push(track);
        track.setMap(map);
      });
    });

    //set cliffs
    this.confData.getCliffs().subscribe((cliffData: any) => {
      cliffData.forEach((path: any) => {
        const cliff = new googleMaps.Polygon({
          paths: path.coordinates,
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.35,
          map: map,
          content: path.name,
        });
        allCliffs.push(cliff);
      });
    });

    //set Notice areas
    this.confData.getNoticeAreas().subscribe((noticeAreaData: any) => {
      noticeAreaData.forEach((path: any) => {
        const noticeArea = new googleMaps.Polygon({
          paths: path.coordinates,
          strokeColor: '#FF0000',
          strokeOpacity: 0.3,
          strokeWeight: 2,
          fillColor: '#FFFFF0',
          fillOpacity: 0.35,
        });
        allNoticeAreas.push(noticeArea);
        noticeArea.setMap(map);
      });
    });

    //set Roads
    this.confData.getRoads().subscribe((roadData: any) => {
      roadData.forEach((path: any) => {
        const road = new googleMaps.Polyline({
          path: path.coordinates,
          geodesic: true,
          strokeColor: '#182CFA',
          strokeOpacity: 1.0,
          strokeWeight: 2,
          map: map,
          content: path.name,
        });
        allRoads.push(road);
      });
    });

    //set permanent markers
    const totupolaKandaStartingPoint = { lat: 6.832994, lng: 80.820151 };
    const kirigalPoththaStartingPoint = { lat: 6.799073, lng: 80.767392 };
    const backersFallStartingPoint = { lat: 6.792426, lng: 80.789811 };
    const camp1StartingPoint = { lat: 6.793279, lng: 80.80296 };
    const ohiyaStartingPoint = { lat: 6.807278, lng: 80.834898 };
    const pattipolaStartingPoint = { lat: 6.839239, lng: 80.812068 };
    const worldEndStartingPoint = { lat: 6.78047, lng: 80.794208 };

    //Totupola
    const totupolaKandaStartContent =
      '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h1 id="firstHeading" class="firstHeading">Thotupola Kanda</h1>' +
      '<div id="bodyContent">' +
      '<p><b>Totupala Kanda</b>, Thotupola Kanda, also sometimes referred as the Thotupola Peak or Thotupola Mountain, is the third highest mountain in Sri Lanka situated in Nuwara Eliya district 2,357 m (7,733 ft) above mean sea level. A trail to the top of the mountain, about two kilometres long, starts a few metres away from the Pattipola entrance to the Horton Plains National Park. Most parts of the mountain surface is covered with shrubs adapted to the cool and windy climate of Horton Plains National Park. Strobilanthes, Osbeckia and Rhodomyrtus species grown as shrubs are common among them.Thotupola Kanda</p>' +
      '<p>Attribution: Totupala Kanda, <a href="https://www.wikiwand.com/en/Thotupola_Kanda">' +
      '</p>' +
      '</div>' +
      '</div>';

    const totupolaKandaStartInfowindow = new googleMaps.InfoWindow({
      content: totupolaKandaStartContent,
    });

    const totupolaKandaMarker = new googleMaps.Marker({
      position: totupolaKandaStartingPoint,
      map: map,
      title: 'Thotupola Kanda',
    });

    //KiriGal Poththa
    const kirigalPoththaStartContent =
      '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h1 id="firstHeading" class="firstHeading">Kirigalpoththa Kanda</h1>' +
      '<div id="bodyContent">' +
      '<p><b>KirigalPoththa Kanda</b>, Kirigalpoththa mountain, Reaching upto 2388m (7835 feet) above mean sea level, Kirigalpoththa Mountain in Sri Lanka looms in the district of Nuwara Eliya casting its shadow over the main city. The name Kirigalpoththa literally translates to Milk (Tree) Bark Rock (Kiri � milk, gal � rock and poththa- tree bark), possibly because the mountain has many tall trees with mottled white bark. Reached by a nature trail in the Horton Plains; this mountain is the second tallest of the island paradise Sri Lanka, and the tallest of the mountains in the island whose summits are  open to access to the general public.</p>' +
      '<p>Attribution: KirigalPoththa Kanda, <a href="https://www.wikiwand.com/en/Thotupola_Kanda">' +
      '</p>' +
      '</div>' +
      '</div>';

    const kirigalPoththaStartInfowindow = new googleMaps.InfoWindow({
      content: kirigalPoththaStartContent,
    });

    const kirigalPoththaMarker = new googleMaps.Marker({
      position: kirigalPoththaStartingPoint,
      map: map,
      title: 'KirigalPoththa Kanda',
    });

    const backersFallStartContent =
      '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h1 id="firstHeading" class="firstHeading">Backers Fall</h1>' +
      '<div id="bodyContent">' +
      '<p><b>BackersFall Kanda</b>, Thotupola Kanda, also sometimes referred as the Thotupola Peak or Thotupola Mountain, is the third highest mountain in Sri Lanka situated in Nuwara Eliya district 2,357 m (7,733 ft) above mean sea level. A trail to the top of the mountain, about two kilometres long, starts a few metres away from the Pattipola entrance to the Horton Plains National Park. Most parts of the mountain surface is covered with shrubs adapted to the cool and windy climate of Horton Plains National Park. Strobilanthes, Osbeckia and Rhodomyrtus species grown as shrubs are common among them.Thotupola Kanda</p>' +
      '<p>Attribution: Totupala Kanda, <a href="https://www.wikiwand.com/en/Thotupola_Kanda">' +
      '</p>' +
      '</div>' +
      '</div>';

    const backersFallStartInfowindow = new googleMaps.InfoWindow({
      content: backersFallStartContent,
    });

    const backersFallMarker = new googleMaps.Marker({
      position: backersFallStartingPoint,
      map: map,
      title: 'Backers Fall',
    });

    //add listners if user click on the marker show message
    backersFallMarker.addListener('click', function() {
      backersFallStartInfowindow.open(map, backersFallMarker);
    });

    const camp1StartContent =
      '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h1 id="firstHeading" class="firstHeading">Chiminipool</h1>' +
      '<div id="bodyContent">' +
      '<p><b>Camp1 Kanda</b>, Thotupola Kanda, also sometimes referred as the Thotupola Peak or Thotupola Mountain, is the third highest mountain in Sri Lanka situated in Nuwara Eliya district 2,357 m (7,733 ft) above mean sea level. A trail to the top of the mountain, about two kilometres long, starts a few metres away from the Pattipola entrance to the Horton Plains National Park. Most parts of the mountain surface is covered with shrubs adapted to the cool and windy climate of Horton Plains National Park. Strobilanthes, Osbeckia and Rhodomyrtus species grown as shrubs are common among them.Thotupola Kanda</p>' +
      '<p>Attribution: Totupala Kanda, <a href="https://www.wikiwand.com/en/Thotupola_Kanda">' +
      '</p>' +
      '</div>' +
      '</div>';

    const camp1StartInfowindow = new googleMaps.InfoWindow({
      content: camp1StartContent,
    });

    const camp1Marker = new googleMaps.Marker({
      position: camp1StartingPoint,
      map: map,
      title: 'Camp1Chiminipool',
    });

    //add listners if user click on the marker show message
    camp1Marker.addListener('click', function() {
      camp1StartInfowindow.open(map, camp1Marker);
    });

    const ohiyaStartContent =
      '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h1 id="firstHeading" class="firstHeading">Ohiya</h1>' +
      '<div id="bodyContent">' +
      '<p><b>Ohiya Kanda</b>, Thotupola Kanda, also sometimes referred as the Thotupola Peak or Thotupola Mountain, is the third highest mountain in Sri Lanka situated in Nuwara Eliya district 2,357 m (7,733 ft) above mean sea level. A trail to the top of the mountain, about two kilometres long, starts a few metres away from the Pattipola entrance to the Horton Plains National Park. Most parts of the mountain surface is covered with shrubs adapted to the cool and windy climate of Horton Plains National Park. Strobilanthes, Osbeckia and Rhodomyrtus species grown as shrubs are common among them.Thotupola Kanda</p>' +
      '<p>Attribution: Totupala Kanda, <a href="https://www.wikiwand.com/en/Thotupola_Kanda">' +
      '</p>' +
      '</div>' +
      '</div>';

    const ohiyaStartInfowindow = new googleMaps.InfoWindow({
      content: ohiyaStartContent,
    });

    const ohiyaMarker = new googleMaps.Marker({
      position: ohiyaStartingPoint,
      map: map,
      title: 'Ohiya',
    });

    //add listners if user click on the marker show message
    ohiyaMarker.addListener('click', function() {
      ohiyaStartInfowindow.open(map, ohiyaMarker);
    });

    const pattipolaStartContent =
      '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h1 id="firstHeading" class="firstHeading">Pattipola</h1>' +
      '<div id="bodyContent">' +
      '<p><b>Pattipola Kanda</b>, Thotupola Kanda, also sometimes referred as the Thotupola Peak or Thotupola Mountain, is the third highest mountain in Sri Lanka situated in Nuwara Eliya district 2,357 m (7,733 ft) above mean sea level. A trail to the top of the mountain, about two kilometres long, starts a few metres away from the Pattipola entrance to the Horton Plains National Park. Most parts of the mountain surface is covered with shrubs adapted to the cool and windy climate of Horton Plains National Park. Strobilanthes, Osbeckia and Rhodomyrtus species grown as shrubs are common among them.Thotupola Kanda</p>' +
      '<p>Attribution: Totupala Kanda, <a href="https://www.wikiwand.com/en/Thotupola_Kanda">' +
      '</p>' +
      '</div>' +
      '</div>';

    const pattipolaStartInfowindow = new googleMaps.InfoWindow({
      content: pattipolaStartContent,
    });

    const pattipolaMarker = new googleMaps.Marker({
      position: pattipolaStartingPoint,
      map: map,
      title: 'Pattipola',
    });

    //add listners if user click on the marker show message
    pattipolaMarker.addListener('click', function() {
      pattipolaStartInfowindow.open(map, pattipolaMarker);
    });

    const worldEndStartContent =
      '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h1 id="firstHeading" class="firstHeading">WorldEnd</h1>' +
      '<div id="bodyContent">' +
      '<p><b>WorldEnd Kanda</b>, Thotupola Kanda, also sometimes referred as the Thotupola Peak or Thotupola Mountain, is the third highest mountain in Sri Lanka situated in Nuwara Eliya district 2,357 m (7,733 ft) above mean sea level. A trail to the top of the mountain, about two kilometres long, starts a few metres away from the WorldEnd entrance to the Horton Plains National Park. Most parts of the mountain surface is covered with shrubs adapted to the cool and windy climate of Horton Plains National Park. Strobilanthes, Osbeckia and Rhodomyrtus species grown as shrubs are common among them.Thotupola Kanda</p>' +
      '<p>Attribution: Totupala Kanda, <a href="https://www.wikiwand.com/en/Thotupola_Kanda">' +
      '</p>' +
      '</div>' +
      '</div>';

    const worldEndStartInfowindow = new googleMaps.InfoWindow({
      content: worldEndStartContent,
    });

    const worldEndMarker = new googleMaps.Marker({
      position: worldEndStartingPoint,
      map: map,
      title: 'WorldEnd',
    });

    //add listners if user click on the marker show message
    worldEndMarker.addListener('click', function() {
      worldEndStartInfowindow.open(map, worldEndMarker);
    });

    trackLocation({
      onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
        const currentPosition = { lat: lat, lng: lng };
        marker.setPosition(currentPosition);
        map.panTo(currentPosition);

        let notice = false;
        const curPosition = new googleMaps.LatLng(lat, lng);

        notice = isANoticeBoard(lat, lng);

        const isInThePath = allPaths.reduce(
          (accumulator, path) => accumulator || googleMaps.geometry.poly.containsLocation(curPosition, path),
          false
        );

        console.log(allCliffs);
        const isCloseToCliff = allCliffs.reduce(
          (accumulator, path) => accumulator || googleMaps.geometry.poly.containsLocation(curPosition, path),
          false);

        const isNoticeArea = allNoticeAreas.reduce((accumulator, path) => {
          return accumulator || googleMaps.geometry.poly.containsLocation(curPosition, path);
        }, false);

        const [currentCliff] = allCliffs.filter(path => googleMaps.geometry.poly.containsLocation(curPosition, path));
        const [currentNoticeArea] = allNoticeAreas.filter(path =>
          googleMaps.geometry.poly.containsLocation(curPosition, path)
        );

        if (isCloseToCliff) {
          this.showWarning(currentCliff);
        }

        if (isNoticeArea) {
          showNotice(currentNoticeArea);
        }


      },
      onError: err => alert(`Error: ${getPositionErrorMessage(err.code) || err.message}`),
    });

    googleMaps.event.addListenerOnce(map, 'idle', () => {
      mapEle.classList.add('show-map');
    });

    //add listners if user click on the marker show message
    totupolaKandaMarker.addListener('click', function() {
      totupolaKandaStartInfowindow.open(map, totupolaKandaMarker);
    });

    function showNotice(currentNoticeArea) {
      console.log(currentNoticeArea);
      totupolaKandaStartInfowindow.open(map, totupolaKandaMarker);
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        title: 'Warning',
        subTitle: 'Out of Track',
        message: 'You are deviating from the track, please trun around.',
      },
    });
    return await modal.present();
  }

  //Alarm
  //https://www.joshmorony.com/adding-sound-effects-to-an-ionic-application/

  async dismissModal() {
    const modal = this.modalController.dismiss({
      dismissed: true,
    });
  }

  showWarning = cliff => {
    const cliffName = cliff.content;
    const audio = new Audio();
    console.log(cliffName);

    //put your cliff names here CliffName is comming from data.json file
    // you should specifiy CliffName there
    if (cliffName == 'CliffOne') {
      audio.src = '../../../assets/audio/acliff.mp3';

    }else if(cliffName=="putYourCliffNameHere"){
      audio.src = '../../../assets/audio/acliff.mp3';
    }else{

    }

    audio.load();
    audio.play();
  };
}

const isANoticeBoard = (lat, lng) => {
  if (lat == '6.802913') {
    return true;
  } else {
    return false;
  }
};

const createMarker = ({ googleMap, map, position }) => {
  return new googleMap.Marker({ map, position });
};

const trackLocation = ({ onSuccess, onError = err => {} }) => {
  // Omitted for brevity

  return navigator.geolocation.watchPosition(onSuccess, onError, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  });
};

// Get proper error message based on the code.
const getPositionErrorMessage = code => {
  switch (code) {
    case 1:
      return 'Permission denied.';
    case 2:
      return 'Position unavailable.';
    case 3:
      return 'Timeout reached.';
  }
};

function getGoogleMaps(apiKey: string): Promise<any> {
  const win = window as any;
  const googleModule = win.google;
  if (googleModule && googleModule.maps) {
    return Promise.resolve(googleModule.maps);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.35&libraries=geometry async defer`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      const googleModule2 = win.google;
      if (googleModule2 && googleModule2.maps) {
        resolve(googleModule2.maps);
      } else {
        reject('google maps not available');
      }
    };
  });
}
