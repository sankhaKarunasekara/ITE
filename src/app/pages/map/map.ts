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
    });

    const marker = new googleMaps.Marker({
      map,
      position: initialPosition,
      icon:
        // tslint:disable-next-line:max-line-length
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAQlBMVEVMaXFCiv9Civ9Civ9Civ9Civ9Civ9Civ9Civ+Kt/9+r/9Pkv90qf9hnf9Civ9wpv9Ee/+Jtf9Gjf9/sP9Kj/9KXf+JdfukAAAACXRSTlMAGCD7088IcsuTBctUAAAAYUlEQVR4XlWOWQrAIBBDx302d73/VSu0UMxfQsgLAMSEzmGKcGRCkZylBHPyMJQmk44QIRWdVCuxlgQoRNLaoi4ILs/a9m6VszuGf4PSaX21eyD6oZ256/AHa/0L9RauOw+4XAWqGLX26QAAAABJRU5ErkJggg==',
    });

    const directionsService = new googleMaps.DirectionsService();
    const directionsRenderer = new googleMaps.DirectionsRenderer({
      draggable: true,
      map: map,
      panel: document.getElementById('right-panel'),
    });

    const allPaths = [];
    const allCliffs = [];
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
        });
        allCliffs.push(cliff);
        cliff.setMap(map);
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

    //set permanent markers
    const totupolaKandaStartingPoint = { lat: 6.835512, lng: 80.810887 };
    const kirigalPoththaStartingPoint = { lat: 6.835512, lng: 80.810887 };
    const backersFallTrack = { lat: 6.792802, lng: 80.790705 };

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

    trackLocation({
      onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
        const currentPosition = { lat: lat, lng: lng };
        marker.setPosition(currentPosition);
        map.panTo(currentPosition);

        // directionsRenderer.addListener('directions_changed', function() {
        //   computeTotalDistance(directionsRenderer.getDirections());
        // });

        // displayRoute(
        //   { lat: 6.7688, lng: 80.7826 },
        //   { lat: 6.773, lng: 80.7881 },
        //   currentPosition,
        //   directionsService,
        //   directionsRenderer
        // );

        let notice = false;
        const curPosition = new googleMaps.LatLng(lat, lng);

        notice = isANoticeBoard(lat, lng);

        const isInThePath = allPaths.reduce(
          (accumulator, path) => accumulator || googleMaps.geometry.poly.containsLocation(curPosition, path),
          false
        );

        const isCloseToCliff = allCliffs.reduce(
          (accumulator, path) => accumulator || googleMaps.geometry.poly.containsLocation(curPosition, path),
          false
        );

        // console.log(googleMaps.geometry.poly.containsLocation(curPosition, allNoticeAreas[0]));
        // console.log(isCloseToCliff);
        // console.log('contains' + googleMaps.geometry.poly.containsLocation(curPosition, allNoticeAreas[0]));

        const isNoticeArea = allNoticeAreas.reduce((accumulator, path) => {
          return accumulator || googleMaps.geometry.poly.containsLocation(curPosition, path);
        }, false);

        //notice = googleMaps.geometry.poly.containsLocation(curPosition, allPaths[0]);
        if (isCloseToCliff) {
          this.showWarning(lat, lng);
        }
        console.log(isNoticeArea);
        if (isNoticeArea) {
          showNotice();
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

    function showNotice() {
      totupolaKandaStartInfowindow.open(map, totupolaKandaMarker);
    }

    //   function displayRoute(origin, destination, currentPosition, service, display) {
    //     service.route(
    //       {
    //         origin: origin,
    //         destination: destination,
    //         waypoints: [{ location: new googleMaps.LatLng(currentPosition.lat, currentPosition.lng), stopover: false }],
    //         travelMode: 'WALKING',
    //         // avoidTolls: true,
    //       },
    //       function(response, status) {
    //         if (status === 'OK') {
    //           display.setDirections(response);
    //         } else {
    //           alert('Could not display directions due to: ' + status);
    //         }
    //       }
    //     );
    //   }

    //   function computeTotalDistance(result) {
    //     var total = 0;
    //     var myroute = result.routes[0];
    //     for (var i = 0; i < myroute.legs.length; i++) {
    //       total += myroute.legs[i].distance.value;
    //     }
    //     total = total / 1000;
    //     document.getElementById('total').innerHTML = total + ' km';
    //   }
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

  showWarning = (lat, lng) => {
    this.presentModal();
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.31&libraries=geometry async defer`;
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
