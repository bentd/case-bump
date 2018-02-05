import { Component } from '@angular/core';
import { Platform } from "ionic-angular";
import { NavController } from 'ionic-angular';
import { Geolocation } from "@ionic-native/geolocation";
import { Vibration } from '@ionic-native/vibration';
//import { DeviceMotion } from "@ionic-native/device-motion";
//import { DeviceMotionAccelerationData } from "@ionic-native/device-motion";

@Component
({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage
{
    location: any = { "lat": 0.0, "lon": 0.0 };
    locationVisible: boolean = false;

    isSeller: boolean = false;
    isBuyer: boolean = false;

    event: boolean = false;

    constructor(public platform: Platform,
                public navCtrl: NavController,
                private geolocation: Geolocation,
                private vibration: Vibration)
    {
        /*window.addEventListener("devicemotion", this.deviceMotion, true);*/
        window["counter"] = 0;
        window["motionstack"] = [];
        window.addEventListener("devicemotion", this.observe.bind(this));
    }

    ngAfterViewInit()
    {
        setInterval(() => { this.bump(); }, 100);
    }

    toggleLocation()
    {
        this.locationVisible = !(this.locationVisible);

        if (this.locationVisible)
        {
            this.geolocation.getCurrentPosition().then((resp) =>
            {
                this.location = { "lat": resp.coords.latitude, "lon": resp.coords.longitude };
            })
        }
        else
        {
            this.location = { "lat": 0.0, "lon": 0.0 };
        }
    }

    toggleSeller()
    {
        this.isBuyer = false;
        this.isSeller = !(this.isSeller);
    }

    toggleBuyer()
    {
        this.isSeller = false;
        this.isBuyer = !(this.isBuyer);
    }

    deviceOrientation(event: any)
    {
    }

    bumpAlgorithm(): boolean
    {
        if (window["motionstack"].length === 10)
        {
            for (let i = 1; i < window["motionstack"].length - 1; i++)
            {
                if (Math.abs(window["motionstack"][i]) > Math.abs(window["motionstack"][i-1]))
                {
                    continue;
                }
                else
                {
                    return false;
                }
            }
            if (Math.abs(window["motionstack"][9]) < 1)
            {
                console.log(window["motionstack"]);
                return true;
            }
        }
        return false;
    }

    observe(event: any)
    {
        //console.log(event.acceleration.x);

        if (window["motionstack"].length < 10)
        {
            window["motionstack"].push(event.acceleration.x);
        }
        else
        {
            window["motionstack"].pop();
            window["motionstack"].push(event.acceleration.x);
        }

        if (this.bumpAlgorithm())
        {
            window["bumped"] = true;
            if (this.isSeller)
            {
                this.vibration.vibrate(1000);
                //console.log(`X: ${event.acceleration.x} Bump Seller`);
            }
            else
            {
                this.vibration.vibrate(1000);
                //console.log(`X: ${event.acceleration.x} Bump Buyer`);
            }
            console.log();
        }
        else
        {
            window["bumped"] = false;
        }
    }

    bump()
    {
        if (window["bumped"])
        {
            this.event = !(this.event);
        }
    }
}
